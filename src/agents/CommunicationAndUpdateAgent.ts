import { UiPathClient } from '@/lib/uipath';
import { LLMClient } from '@/lib/llm';

/**
 * Represents the input data for the Communication & Update Agent.
 */
export interface CommunicationInput {
  incidentId: string;
  statusUpdate: string;
  details: string; // Detailed description of progress or resolution
  stakeholders: string[]; // List of stakeholders (e.g., email addresses, Slack channels)
  itsmTicketId?: string; // Optional: ID of the ITSM ticket to update
  auditTrailEntry: string; // Specific log entry for Maestro case
}

/**
 * The Communication & Update Agent keeps relevant stakeholders informed, updates the ITSM ticket
 * with progress and resolution details, and logs all agent activities within the UiPath Maestro Case
 * for auditability.
 */
export class CommunicationAndUpdateAgent {
  private uipathClient: UiPathClient;
  private llmClient: LLMClient;

  constructor() {
    this.uipathClient = new UiPathClient();
    this.llmClient = new LLMClient();
  }

  /**
   * Sends updates to stakeholders, updates ITSM tickets, and logs activity in Maestro.
   * @param input - The communication and update details.
   * @returns A promise indicating success or failure.
   */
  public async sendUpdate(input: CommunicationInput): Promise<void> {
    console.log(`CommunicationAndUpdateAgent: Sending update for incident ${input.incidentId}. Status: ${input.statusUpdate}`);

    // 1. Log activity in UiPath Maestro
    await this.uipathClient.updateMaestroCase(input.incidentId, {
      agentActivityLog: [`Communication & Update Agent: ${input.auditTrailEntry}`],
      status: input.statusUpdate, // Update the status of the Maestro case directly
    });
    console.log(`CommunicationAndUpdateAgent: Logged activity and updated status in Maestro for case ${input.incidentId}.`);

    // 2. Update ITSM Ticket (if applicable)
    if (input.itsmTicketId) {
      const itsmUpdatePrompt = `Generate a concise update for ITSM ticket ${input.itsmTicketId} based on the following incident status and details:
      Status: ${input.statusUpdate}
      Details: ${input.details}`;      
      const itsmMessage = await this.llmClient.generateText(itsmUpdatePrompt);

      // In a real application, interact with ITSM API (e.g., ServiceNow, Jira)
      // const itsmClient = new ITSMClient();
      // await itsmClient.updateTicket(input.itsmTicketId, { status: input.statusUpdate, comments: itsmMessage });
      console.log(`CommunicationAndUpdateAgent: Updated ITSM ticket ${input.itsmTicketId} with status '${input.statusUpdate}'. Message: "${itsmMessage.substring(0, 100)}..."`);
    } else {
      console.log(`CommunicationAndUpdateAgent: No ITSM ticket ID provided for incident ${input.incidentId}. Skipping ITSM update.`);
    }

    // 3. Notify Stakeholders
    if (input.stakeholders && input.stakeholders.length > 0) {
      const notificationPrompt = `Craft a notification message for stakeholders about incident ${input.incidentId} with status "${input.statusUpdate}" and details: ${input.details}. Keep it professional and informative.`;
      const notificationMessage = await this.llmClient.generateText(notificationPrompt);

      // In a real application, send notifications (e.g., Slack, Teams, Email)
      // const notificationService = new NotificationService();
      // await notificationService.send(input.stakeholders, `Incident ${input.incidentId} Update: ${input.statusUpdate}`, notificationMessage);
      console.log(`CommunicationAndUpdateAgent: Notified stakeholders ${input.stakeholders.join(', ')} about incident ${input.incidentId}. Message: "${notificationMessage.substring(0, 100)}..."`);
    } else {
      console.log(`CommunicationAndUpdateAgent: No stakeholders provided for incident ${input.incidentId}. Skipping notifications.`);
    }

    console.log(`CommunicationAndUpdateAgent: Completed update for incident ${input.incidentId}.`);
  }

  /**
   * Logs a specific activity within the UiPath Maestro Case for auditability.
   * This can be used by other agents to record their actions directly.
   * @param caseId - The ID of the Maestro case.
   * @param agent - The name of the agent performing the action.
   * @param action - A concise description of the action.
   * @param details - More elaborate details about the action.
   */
  public async logActivity(caseId: string, agent: string, action: string, details: string): Promise<void> {
    await this.uipathClient.updateMaestroCase(caseId, {
      agentActivityLog: [`${agent}: ${action} - ${details}`],
    });
    console.log(`CommunicationAndUpdateAgent: Logged activity for case ${caseId}: ${agent} -> ${action}`);
  }
}
