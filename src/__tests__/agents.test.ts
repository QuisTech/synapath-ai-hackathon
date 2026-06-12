import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * synapath-ai agents use UiPathClient and LLMClient, but both are pre-mocked
 * with setTimeout-based simulations. Tests exercise real agent logic paths.
 */

// ─── IntakeAndTriageAgent ────────────────────────────────────────────
import { IntakeAndTriageAgent } from '../agents/IntakeAndTriageAgent.ts';
import type { TriageOutput } from '../agents/IntakeAndTriageAgent.ts';

describe('IntakeAndTriageAgent', () => {
  const agent = new IntakeAndTriageAgent();

  it('processes an incident and returns a triage output', async () => {
    const result: TriageOutput = await agent.process({
      source: 'MonitoringAlert',
      payload: { title: 'High CPU on auth-service', message: '500 error spike' },
      timestamp: new Date().toISOString(),
    });

    assert.ok(result.caseId, 'Should generate a case ID');
    assert.ok(result.category, 'Should assign a category');
    assert.ok(['low', 'medium', 'high', 'critical'].includes(result.severity), 'Severity should be valid');
    assert.ok(result.impact, 'Should determine impact');
    assert.ok(result.initialDiagnosticPlan, 'Should provide diagnostic plan');
  });

  it('uses the correct severity values (lowercase enum)', async () => {
    const result = await agent.process({
      source: 'ITSM',
      payload: { title: 'Database timeout' },
      timestamp: new Date().toISOString(),
    });

    // Severity is parsed from LLM output via regex — should always be lowercase
    assert.equal(result.severity, result.severity.toLowerCase());
  });
});

// ─── KnowledgeAndContextAgent ────────────────────────────────────────
import { KnowledgeAndContextAgent } from '../agents/KnowledgeAndContextAgent.ts';

describe('KnowledgeAndContextAgent', () => {
  const agent = new KnowledgeAndContextAgent();

  it('returns relevant articles and runbook steps', async () => {
    const result = await agent.query({
      incidentId: 'INC-100',
      incidentDetails: { title: 'Network outage in DC-1' },
      identifiedKeywords: ['network', 'timeout', 'DC-1'],
    });

    assert.ok(Array.isArray(result.relevantArticles));
    assert.ok(result.relevantArticles.length > 0);
    assert.ok(Array.isArray(result.runbookSteps));
    assert.ok(result.runbookSteps.length > 0);
    assert.ok(typeof result.historicalContext === 'string');
    assert.ok(result.historicalContext.length > 0);
  });

  it('includes system diagrams', async () => {
    const result = await agent.query({
      incidentId: 'INC-101',
      incidentDetails: { title: 'API Gateway slow' },
    });

    assert.ok(Array.isArray(result.systemDiagrams));
  });

  it('references previous similar incidents in historical context', async () => {
    const result = await agent.query({
      incidentId: 'INC-102',
      incidentDetails: { title: 'DB pool exhausted' },
      previousSimilarIncidents: ['INC-050', 'INC-075'],
    });

    assert.ok(result.historicalContext.includes('INC-050'));
    assert.ok(result.historicalContext.includes('INC-075'));
  });
});

// ─── DiagnosticAndRootCauseAgent ─────────────────────────────────────
import { DiagnosticAndRootCauseAgent } from '../agents/DiagnosticAndRootCauseAgent.ts';

describe('DiagnosticAndRootCauseAgent', () => {
  const agent = new DiagnosticAndRootCauseAgent();

  it('returns hypothesized root causes and diagnostic actions', async () => {
    const result = await agent.diagnose({
      incidentId: 'INC-200',
      logSnippets: ['ERROR: Connection timeout', 'WARN: Retry limit reached'],
      metricData: { cpu: '95%', memory: '3.8GB' },
      incidentContext: 'Auth-service experiencing 500 errors',
      knowledgeBaseOutput: {
        relevantArticles: ['KB-101'],
        runbookSteps: ['Restart service'],
        historicalContext: 'Similar to INC-050',
      },
    });

    assert.ok(Array.isArray(result.hypothesizedRootCauses));
    assert.ok(result.hypothesizedRootCauses.length > 0);

    const firstCause = result.hypothesizedRootCauses[0];
    assert.ok(firstCause.cause, 'Should have a cause string');
    assert.ok(typeof firstCause.confidence === 'number', 'Confidence should be a number');
    assert.ok(firstCause.explanation, 'Should have explanation');

    assert.ok(Array.isArray(result.recommendedDiagnosticActions));
    assert.ok(result.recommendedDiagnosticActions.length > 0);
  });
});

// ─── ActionAndRemediationAgent ───────────────────────────────────────
import { ActionAndRemediationAgent } from '../agents/ActionAndRemediationAgent.ts';

describe('ActionAndRemediationAgent', () => {
  const agent = new ActionAndRemediationAgent();

  it('executes actions and returns results with valid status', async () => {
    const result = await agent.executeActions({
      incidentId: 'INC-300',
      diagnosticPlan: {
        hypothesizedRootCauses: [
          { cause: 'Network misconfiguration', confidence: 0.75, explanation: 'Timeouts in logs' },
        ],
        recommendedDiagnosticActions: ['Check firewall rules', 'Verify DNS resolution'],
      },
      currentIncidentState: { services: ['auth', 'gateway'], status: 'degraded' },
      humanApprovalRequired: false,
    });

    assert.ok(Array.isArray(result.executionResults));
    assert.ok(result.executionResults.length > 0, 'Should have execution results');
    assert.ok(typeof result.proposedRemediation === 'string');
    assert.ok(typeof result.requiresHumanApproval === 'boolean');
    assert.ok(['executed', 'pending_approval', 'failed'].includes(result.status));
  });

  it('skips automated remediation when confidence is too low', async () => {
    const result = await agent.executeActions({
      incidentId: 'INC-301',
      diagnosticPlan: {
        hypothesizedRootCauses: [
          { cause: 'Unknown', confidence: 0.3, explanation: 'Insufficient data' },
        ],
        recommendedDiagnosticActions: ['Gather more data'],
      },
      currentIncidentState: {},
      humanApprovalRequired: false,
    });

    assert.ok(result.executionResults.some(r => r.includes('Insufficient confidence')));
  });
});

// ─── CommunicationAndUpdateAgent ─────────────────────────────────────
import { CommunicationAndUpdateAgent } from '../agents/CommunicationAndUpdateAgent.ts';

describe('CommunicationAndUpdateAgent', () => {
  const agent = new CommunicationAndUpdateAgent();

  it('sendUpdate completes without error', async () => {
    await assert.doesNotReject(
      agent.sendUpdate({
        incidentId: 'INC-400',
        statusUpdate: 'Investigating',
        details: 'Root cause identified as network issue',
        stakeholders: ['team-lead@corp.com', '#incident-channel'],
        auditTrailEntry: 'Communication Agent: Sent initial update',
      })
    );
  });

  it('logActivity completes without error', async () => {
    await assert.doesNotReject(
      agent.logActivity('INC-401', 'TriageAgent', 'Completed triage', 'Severity: High')
    );
  });
});
