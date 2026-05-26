import { UiPathClient, MaestroCase } from '@/lib/uipath';
import { LLMClient } from '@/lib/llm';

/**
 * Represents the input data for the Intake & Triage Agent.
 */
export interface IntakeInput {
  source: string; // e.g., 'ITSM', 'MonitoringAlert', 'Email'
  payload: any;    // Raw incident data (ticket details, alert payload, email body)
  timestamp: string;
}

/**
 * Represents the output of the Intake & Triage Agent.
 */
export interface TriageOutput {
  caseId: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  initialDiagnosticPlan: string;
}

/**
 * The Intake & Triage Agent monitors incoming incidents, extracts key information,
 * categorizes severity and impact, and initiates a new case in UiPath Maestro.
 */
export class IntakeAndTriageAgent {
  private uipathClient: UiPathClient;
  private llmClient: LLMClient;

  constructor() {
    this.uipathClient = new UiPathClient();
    this.llmClient = new LLMClient();
  }

  /**
   * Processes an incoming incident, performs triage, and creates a Maestro case.
   * @param input - The incident data from various sources.
   * @returns A promise resolving to the triage output, including the new Maestro Case ID.
   */
  public async process(input: IntakeInput): Promise<TriageOutput> {
    console.log(`IntakeAndTriageAgent: Processing new incident from ${input.source}`);

    // 1. Extract key information using LLM
    const extractionPrompt = `Extract key information (title, description, affected systems, error codes) from the following incident data originating from ${input.source}:
    ${JSON.stringify(input.payload)}`;
    const extractedInfo = await this.llmClient.generateText(extractionPrompt);
    console.log('Extracted Info:', extractedInfo);

    // 2. Categorize and determine severity/impact using LLM
    const triagePrompt = `Categorize the following incident, determine its severity (low/medium/high/critical), impact, and suggest an initial diagnostic plan:
    Incident details: ${extractedInfo}
    Source: ${input.source}
    Output format: Category: [category], Severity: [severity], Impact: [impact], Plan: [plan]`;
    const triageResult = await this.llmClient.generateText(triagePrompt);
    console.log('Triage Result:', triageResult);

    // Parse LLM output (simplified parsing)
    const categoryMatch = triageResult.match(/Category: ([^,]+)/);
    const severityMatch = triageResult.match(/Severity: (low|medium|high|critical)/i);
    const impactMatch = triageResult.match(/Impact: ([^,]+)/);
    const planMatch = triageResult.match(/Plan: (.*)/);

    const category = categoryMatch ? categoryMatch[1].trim() : 'Unknown';
    const severity = (severityMatch ? severityMatch[1].toLowerCase() : 'medium') as TriageOutput['severity'];
    const impact = impactMatch ? impactMatch[1].trim() : 'Undetermined';
    const initialDiagnosticPlan = planMatch ? planMatch[1].trim() : 'Initiate basic diagnostics.';

    // 3. Initiate a new case in UiPath Maestro
    const maestroCase = await this.uipathClient.createMaestroCase({
      title: (input.payload.title || extractedInfo.substring(0, 100)), // Use extracted title or snippet
      source: input.source,
      payload: input.payload,
      category,
      severity,
      impact,
      initialDiagnosticPlan,
    });
    console.log(`IntakeAndTriageAgent: Created Maestro case ${maestroCase.id} with status ${maestroCase.status}`);

    return {
      caseId: maestroCase.id,
      category,
      severity,
      impact,
      initialDiagnosticPlan,
    };
  }
}
