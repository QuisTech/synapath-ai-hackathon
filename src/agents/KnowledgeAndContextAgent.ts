import { UiPathClient } from '@/lib/uipath';
import { LLMClient } from '@/lib/llm';

/**
 * Represents the input data for the Knowledge & Context Agent.
 */
export interface KnowledgeInput {
  incidentId: string;
  incidentDetails: any; // Raw or summarized incident data
  identifiedKeywords?: string[];
  previousSimilarIncidents?: string[]; // IDs of similar incidents from Maestro
}

/**
 * Represents the output of the Knowledge & Context Agent.
 */
export interface KnowledgeOutput {
  relevantArticles: string[];     // URLs or IDs of relevant KB articles
  runbookSteps: string[];        // Specific steps from runbooks
  historicalContext: string;     // Summary of past similar incidents or system changes
  systemDiagrams?: string[];     // URLs or IDs of relevant system diagrams
}

/**
 * The Knowledge & Context Agent queries internal knowledge bases, documentation,
 * runbooks, and external sources to gather relevant information for the incident.
 * It provides context to other agents.
 */
export class KnowledgeAndContextAgent {
  private uipathClient: UiPathClient;
  private llmClient: LLMClient;

  constructor() {
    this.uipathClient = new UiPathClient();
    this.llmClient = new LLMClient();
  }

  /**
   * Queries various knowledge sources to gather context for a given incident.
   * @param input - Incident details and keywords to guide the search.
   * @returns A promise resolving to the gathered knowledge and context.
   */
  public async query(input: KnowledgeInput): Promise<KnowledgeOutput> {
    console.log(`KnowledgeAndContextAgent: Querying for incident ${input.incidentId}`);

    const searchKeywords = input.identifiedKeywords?.join(', ') || input.incidentDetails.title || 'generic incident';
    const contextPrompt = `Find relevant knowledge base articles, runbook steps, and historical context for an incident with the following details/keywords:
    Incident ID: ${input.incidentId}
    Keywords: ${searchKeywords}
    Details: ${JSON.stringify(input.incidentDetails)}
    Previous similar incidents: ${input.previousSimilarIncidents?.join(', ') || 'None'}
    Output format: Articles: [...], RunbookSteps: [...], HistoricalContext: "..."`;

    const llmResponse = await this.llmClient.generateText(contextPrompt);
    console.log('LLM Knowledge Search Response:', llmResponse);

    // Simulate fetching from various sources and parsing LLM output
    const relevantArticles: string[] = ['KB-101: General Troubleshooting Guide', 'KB-205: Database Connection Issues'];
    if (llmResponse.includes('network')) relevantArticles.push('KB-302: Network Configuration Best Practices');
    
    const runbookSteps: string[] = ['Check service status', 'Review recent deployments', 'Restart relevant services'];
    if (llmResponse.includes('database')) runbookSteps.push('Verify database credentials', 'Check database server logs');

    const historicalContext = `Based on similar past incidents (${input.previousSimilarIncidents?.join(',') || 'none found'}), issues with '${searchKeywords}' often relate to network connectivity or recent configuration changes.`;
    
    // Update Maestro case with agent activity
    await this.uipathClient.updateMaestroCase(input.incidentId, {
      agentActivityLog: [`Knowledge & Context Agent: Queried KB and gathered context.`]
    });

    return {
      relevantArticles,
      runbookSteps,
      historicalContext,
      systemDiagrams: ['SYS-DIAG-001: Prod Env Network Layout'],
    };
  }
}
