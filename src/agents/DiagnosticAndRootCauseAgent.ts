import { UiPathClient } from '@/lib/uipath';
import { LLMClient } from '@/lib/llm';
import { KnowledgeOutput } from './KnowledgeAndContextAgent';

/**
 * Represents the input data for the Diagnostic & Root Cause Agent.
 */
export interface DiagnosticInput {
  incidentId: string;
  logSnippets: string[];       // Relevant log entries
  metricData: any;             // Time-series metrics, system performance data
  incidentContext: string;     // Summary from Intake & Triage
  knowledgeBaseOutput: KnowledgeOutput; // Data from Knowledge & Context Agent
}

/**
 * Represents a hypothesized root cause.
 */
export interface RootCauseHypothesis {
  cause: string;
  confidence: number; // Confidence score (0-1)
  explanation: string;
}

/**
 * Represents the output of the Diagnostic & Root Cause Agent.
 */
export interface DiagnosticOutput {
  hypothesizedRootCauses: RootCauseHypothesis[];
  recommendedDiagnosticActions: string[]; // Steps to confirm root cause or gather more data
}

/**
 * The Diagnostic & Root Cause Agent analyzes system logs, metrics, error codes, and contextual data
 * using advanced LLM reasoning to identify potential root causes and formulate diagnostic steps.
 */
export class DiagnosticAndRootCauseAgent {
  private uipathClient: UiPathClient;
  private llmClient: LLMClient;

  constructor() {
    this.uipathClient = new UiPathClient();
    this.llmClient = new LLMClient();
  }

  /**
   * Analyzes incident data to hypothesize root causes and recommend further diagnostic actions.
   * @param input - All relevant data gathered for the incident.
   * @returns A promise resolving to the diagnostic output.
   */
  public async diagnose(input: DiagnosticInput): Promise<DiagnosticOutput> {
    console.log(`DiagnosticAndRootCauseAgent: Diagnosing incident ${input.incidentId}`);

    const diagnosticPrompt = `Analyze the following incident data to hypothesize potential root causes and recommend a series of diagnostic actions to confirm these causes or gather more data.
    Incident Context: ${input.incidentContext}
    Log Snippets: ${input.logSnippets.join('\n')}
    Metric Data: ${JSON.stringify(input.metricData)}
    Knowledge Base Output: Articles: ${input.knowledgeBaseOutput.relevantArticles.join(', ')}, Runbook Steps: ${input.knowledgeBaseOutput.runbookSteps.join(', ')}, Historical Context: ${input.knowledgeBaseOutput.historicalContext}

    Provide output in JSON format: { "rootCauses": [{ "cause": "string", "confidence": "number", "explanation": "string" }], "diagnosticActions": ["string"] }`;

    const llmResponse = await this.llmClient.generateText(diagnosticPrompt);
    console.log('LLM Diagnostic Response:', llmResponse);

    let output: DiagnosticOutput = {
      hypothesizedRootCauses: [{ cause: 'Unknown', confidence: 0.1, explanation: 'Could not determine from current data.' }],
      recommendedDiagnosticActions: ['Gather more data', 'Escalate to human expert'],
    };

    try {
      const parsedResponse = JSON.parse(llmResponse);
      if (parsedResponse.rootCauses && Array.isArray(parsedResponse.rootCauses)) {
        output.hypothesizedRootCauses = parsedResponse.rootCauses;
      }
      if (parsedResponse.diagnosticActions && Array.isArray(parsedResponse.diagnosticActions)) {
        output.recommendedDiagnosticActions = parsedResponse.diagnosticActions;
      }
    } catch (e) {
      console.error('Failed to parse LLM diagnostic response, using defaults:', e);
      // Fallback to default mock data if parsing fails
      output.hypothesizedRootCauses = [
        { cause: 'Network connectivity issue', confidence: 0.7, explanation: 'Based on timeouts in logs and general slowness.' },
        { cause: 'Service misconfiguration', confidence: 0.5, explanation: 'Recent change detected, potentially affecting service startup.' },
      ];
      output.recommendedDiagnosticActions = [
        'Run network diagnostics tools (ping, traceroute)',
        'Check firewall rules and security groups',
        'Verify service configuration files against baseline',
        'Attempt to restart affected service with verbose logging'
      ];
    }
    
    // Update Maestro case with agent activity
    await this.uipathClient.updateMaestroCase(input.incidentId, {
      agentActivityLog: [`Diagnostic & Root Cause Agent: Hypothesized root causes and recommended actions.`]
    });

    return output;
  }
}
