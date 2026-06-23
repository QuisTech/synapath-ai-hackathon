import { LogOut } from 'lucide-react';

/**
 * Represents an incident case within UiPath Maestro.
 */
export interface MaestroCase {
  id: string;
  status: string;
  severity: string;
  incidentDetails: any;
  agentActivityLog: string[];
  currentPlan: string[];
}

// Simple in-memory token cache
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * Client for interacting with UiPath Automation Cloud (Orchestrator, Maestro, Agent Builder APIs).
 */
export class UiPathClient {
  private orchestratorApiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private orgName: string;
  private tenantName: string;
  private folderId: string;

  constructor() {
    this.clientId = process.env.UIPATH_APP_ID || '';
    this.clientSecret = process.env.UIPATH_APP_SECRET || '';
    this.orgName = process.env.UIPATH_ORG_NAME || '';
    this.tenantName = process.env.UIPATH_TENANT_NAME || '';
    this.folderId = process.env.UIPATH_FOLDER_ID || '';
    
    this.orchestratorApiUrl = `https://cloud.uipath.com/${this.orgName}/${this.tenantName}`;

    if (!this.clientId || !this.clientSecret) {
      console.warn('UiPath API credentials not set. API calls will fail.');
    } else {
      console.log(`UiPathClient initialized for Tenant: ${this.tenantName}`);
    }
  }

  /**
   * Fetches an OAuth 2.0 Bearer token using Client Credentials flow.
   */
  private async getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiryTime) {
      return cachedToken;
    }

    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
    tokenParams.append('client_id', this.clientId);
    tokenParams.append('client_secret', this.clientSecret);
    tokenParams.append('scope', 'OR.Folders OR.Jobs OR.Queues OR.Tasks OR.Execution');

    const response = await fetch('https://cloud.uipath.com/identity_/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to get UiPath Access Token: ${err}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Expire 5 minutes before actual expiry to be safe (usually 3600 seconds)
    tokenExpiryTime = Date.now() + ((data.expires_in - 300) * 1000);
    
    return cachedToken as string;
  }

  /**
   * Generic request handler for UiPath APIs
   */
  private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    try {
      const token = await this.getAccessToken();
      const url = `${this.orchestratorApiUrl}/${endpoint}`;

      console.log(`UiPathClient: ${method} ${url}`);

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      if (this.folderId) {
        headers['X-UIPATH-OrganizationUnitId'] = this.folderId;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`UiPath API Error (${response.status}) on ${endpoint}:`, errorText);
        throw new Error(`UiPath API Request Failed: ${response.status} - ${errorText}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();

    } catch (error) {
      console.error('UiPath API Request Failed:', error);
      throw error;
    }
  }


  /**
   * Creates a new incident case in UiPath Maestro.
   */
  async createMaestroCase(incidentData: any): Promise<MaestroCase> {
    const endpoint = 'casemanagement_/api/Cases';
    
    let result: any = {};
    try {
      result = await this.request<any>(endpoint, 'POST', {
        title: incidentData.title || 'New Incident',
        data: incidentData, // Payload structure will depend on actual Case schema
      });
    } catch (err: any) {
      console.warn('Graceful degradation: Maestro API failed, continuing pipeline with offline case ID.', err.message);
      result = { Id: `CASE-OFFLINE-${Date.now()}` };
    }

    // Map the real response to the UI's expected format
    return {
      id: result.Id || result.id,
      status: 'New',
      severity: incidentData.severity || 'Medium',
      incidentDetails: incidentData,
      agentActivityLog: [`Case created for incident: ${incidentData.title || 'N/A'}`],
      currentPlan: ['Initial triage'],
    };
  }

  /**
   * Updates an existing incident case in UiPath Maestro.
   */
  async updateMaestroCase(caseId: string, updates: Partial<MaestroCase>): Promise<void> {
    const endpoint = `casemanagement_/api/Cases/${caseId}`;
    try {
      if (!caseId.startsWith('CASE-OFFLINE')) {
        await this.request<void>(endpoint, 'PUT', updates);
        console.log(`Maestro case ${caseId} updated.`);
      }
    } catch (err: any) {
      console.warn(`Graceful degradation: Failed to update Maestro case ${caseId}.`, err.message);
    }
  }

  /**
   * Triggers a UiPath RPA workflow or API workflow.
   */
  async triggerWorkflow(workflowName: string, inputArguments: any): Promise<{ jobId: string; status: string }> {
    // This hits the real Orchestrator Jobs API to start a process by Release Key
    const endpoint = 'orchestrator_/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs';
    
    const payload = {
      startInfo: {
        ReleaseKey: workflowName, // Assuming workflowName passed is the ReleaseKey
        Strategy: "All",
        InputArguments: JSON.stringify(inputArguments)
      }
    };

    const result = await this.request<any>(endpoint, 'POST', payload);
    return {
      jobId: result.value?.[0]?.Id || result.jobId,
      status: 'Queued'
    };
  }

  /**
   * Retrieves details for a specific Maestro case.
   */
  async getMaestroCaseDetails(caseId: string): Promise<MaestroCase> {
    const endpoint = `casemanagement_/api/Cases/${caseId}`;
    const result = await this.request<any>(endpoint, 'GET');
    
    return {
      id: result.Id || result.id || caseId,
      status: result.Status || result.status || 'Active',
      severity: 'High',
      incidentDetails: result.data || { title: 'Loaded Incident' },
      agentActivityLog: [],
      currentPlan: []
    };
  }
}
