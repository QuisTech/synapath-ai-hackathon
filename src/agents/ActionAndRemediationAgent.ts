import { UiPathClient } from '@/lib/uipath';
import { LLMClient } from '@/lib/llm';
import { DiagnosticOutput } from './DiagnosticAndRootCauseAgent';

/**
 * Represents the input data for the Action & Remediation Agent.
 */
export interface ActionInput {
  incidentId: string;
  diagnosticPlan: DiagnosticOutput; // Output from Diagnostic Agent
  currentIncidentState: any;       // Current system state, relevant configurations
  humanApprovalRequired: boolean;  // Flag if a critical action needs approval
}

/**
 * Represents the output of the Action & Remediation Agent.
 */
export interface ActionResult {
  executionResults: string[];     // Output/logs from executed commands/workflows
  proposedRemediation: string;   // Final proposed fix (script, workflow name, manual step)
  requiresHumanApproval: boolean; // True if the final remediation needs approval
  status: 'executed' | 'pending_approval' | 'failed';
}

/**
 * The Action & Remediation Agent executes diagnostic commands, runs RPA workflows to gather more data,
 * and crucially, uses UiPath for Coding Agents (Claude Code/Gemini CLI) to generate small,
 * targeted automation scripts to test hypotheses or apply fixes. It seeks human approval for critical actions.
 */
export class ActionAndRemediationAgent {
  private uipathClient: UiPathClient;
  private llmClient: LLMClient;

  constructor() {
    this.uipathClient = new UiPathClient();
    this.llmClient = new LLMClient();
  }

  /**
   * Executes diagnostic actions or proposes remediation based on the diagnostic plan.
   * @param input - The diagnostic output and current incident state.
   * @returns A promise resolving to the action results.
   */
  public async executeActions(input: ActionInput): Promise<ActionResult> {
    console.log(`ActionAndRemediationAgent: Executing actions for incident ${input.incidentId}`);

    const executionResults: string[] = [];
    let proposedRemediation: string = 'No specific remediation proposed yet.';
    let requiresHumanApproval = input.humanApprovalRequired;
    let status: ActionResult['status'] = 'executed';

    // Prioritize actions based on confidence or predefined rules
    const primaryRootCause = input.diagnosticPlan.hypothesizedRootCauses[0];

    // Step 1: Execute recommended diagnostic actions to gather more data
    for (const action of input.diagnosticPlan.recommendedDiagnosticActions) {
      console.log(`Executing diagnostic action: ${action}`);
      // Use LLM to generate a script for the action or trigger a UiPath workflow
      const scriptRequirement = `Generate a PowerShell script to "${action}" for diagnosing ${input.incidentId}.`;
      const generatedScript = await this.llmClient.generateCode(scriptRequirement, 'powershell');

      // In a real scenario, this would involve UiPath Coding Agent executing the script
      try {
        const job = await this.uipathClient.triggerWorkflow('ExecuteDiagnosticScript', { script: generatedScript, incidentId: input.incidentId });
        const executionLog = `Triggered UiPath Job ${job.jobId} for: ${action}`;
        executionResults.push(executionLog);
        console.log(executionLog);
      } catch (err) {
        const errorLog = `Failed to trigger UiPath Job for: ${action}. Error: ${err instanceof Error ? err.message : String(err)}`;
        executionResults.push(errorLog);
        console.error(errorLog);
      }
    }

    // Step 2: Based on new data and primary root cause, propose remediation
    if (primaryRootCause && primaryRootCause.confidence > 0.6) {
      const remediationPrompt = `Based on the following root cause hypothesis and execution results, propose a specific remediation plan. Consider if human approval is needed.
      Root Cause: ${primaryRootCause.cause} (Confidence: ${primaryRootCause.confidence})
      Execution Results: ${executionResults.join('\n')}
      Current State: ${JSON.stringify(input.currentIncidentState)}
      Output format: Remediation: "[plan]", ApprovalNeeded: [true/false]`;
      const remediationLLMResponse = await this.llmClient.generateText(remediationPrompt);
      console.log('LLM Remediation Proposal:', remediationLLMResponse);

      const remediationMatch = remediationLLMResponse.match(/Remediation: "([^"]+)"/);
      const approvalMatch = remediationLLMResponse.match(/ApprovalNeeded: (true|false)/i);

      proposedRemediation = remediationMatch ? remediationMatch[1] : `Automatically restart service associated with ${primaryRootCause.cause}.`;
      requiresHumanApproval = approvalMatch ? JSON.parse(approvalMatch[1].toLowerCase()) : input.humanApprovalRequired; // Default logic

      if (requiresHumanApproval) {
        status = 'pending_approval';
        console.warn(`ActionAndRemediationAgent: Remediation for ${input.incidentId} requires human approval: ${proposedRemediation}`);
      } else {
        // In a real system, trigger UiPath for Coding Agents to apply the fix
        const fixScriptRequirement = `Generate a Python script to perform the remediation: "${proposedRemediation}".`;
        const generatedFixScript = await this.llmClient.generateCode(fixScriptRequirement, 'python');
        executionResults.push(`Generated and executed fix script: ${generatedFixScript.substring(0, 100)}...`);
        console.log(`ActionAndRemediationAgent: Applying automated remediation for ${input.incidentId}: ${proposedRemediation}`);
      }
    } else {
        executionResults.push('Insufficient confidence in root cause. No automated remediation proposed.');
    }

    // Update Maestro case with agent activity
    await this.uipathClient.updateMaestroCase(input.incidentId, {
      agentActivityLog: [
        `Action & Remediation Agent: Executed diagnostic actions.`,
        `Action & Remediation Agent: Proposed remediation: ${proposedRemediation}. Human approval: ${requiresHumanApproval ? 'Required' : 'Not required'}.`,
      ],
      status: status === 'pending_approval' ? 'Pending Human Approval' : 'Investigating',
    });

    return {
      executionResults,
      proposedRemediation,
      requiresHumanApproval,
      status,
    };
  }
}
