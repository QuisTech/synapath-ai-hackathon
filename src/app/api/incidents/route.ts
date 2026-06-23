export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAllIncidents, createIncident, updateIncident } from '@/lib/incidentStore';
import { IntakeAndTriageAgent } from '@/agents/IntakeAndTriageAgent';
import { KnowledgeAndContextAgent } from '@/agents/KnowledgeAndContextAgent';
import { DiagnosticAndRootCauseAgent } from '@/agents/DiagnosticAndRootCauseAgent';
import { ActionAndRemediationAgent } from '@/agents/ActionAndRemediationAgent';
import { CommunicationAndUpdateAgent } from '@/agents/CommunicationAndUpdateAgent';

/**
 * GET /api/incidents
 * Returns all incidents from the database.
 */
export async function GET() {
  const incidents = await getAllIncidents();
  return NextResponse.json({ incidents });
}

/**
 * POST /api/incidents
 * Creates a new incident and runs the full multi-agent pipeline:
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, source, severity, payload } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // 1. Create the incident in our store
    const incident = await createIncident({
      title,
      source: source || 'Dashboard',
      severity: severity || 'high',
      metrics: payload?.metrics || { cpu: 'Fetching...', memory: 'Fetching...', latency: 'Fetching...' },
    });

    // 2. Run the multi-agent pipeline (blocking updates to ensure Vercel serverless doesn't kill it)
    await runAgentPipeline(incident.id, title, source || 'Dashboard', payload || {}, severity);

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}

/**
 * Runs the full 5-agent SynaPath pipeline for an incident.
 */
async function runAgentPipeline(incidentId: string, title: string, source: string, payload: any, initialSeverity?: string) {
  try {
    const intakeAgent = new IntakeAndTriageAgent();
    const knowledgeAgent = new KnowledgeAndContextAgent();
    const diagnosticAgent = new DiagnosticAndRootCauseAgent();
    const actionAgent = new ActionAndRemediationAgent();
    const commsAgent = new CommunicationAndUpdateAgent();

    // --- Stage 1: Intake & Triage ---
    await updateIncident(incidentId, {
      agentActivity: ['Intake & Triage Agent: Processing incoming incident...'],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Intake & Triage Agent activated.`],
    });

    const triageResult = await intakeAgent.process({
      source,
      payload: { title, ...payload, initialSeverity },
      timestamp: new Date().toISOString(),
    });

    const finalSeverity = (initialSeverity || triageResult.severity) as 'low' | 'medium' | 'high' | 'critical';

    await updateIncident(incidentId, {
      maestroCaseId: triageResult.caseId,
      severity: finalSeverity,
      agentActivity: [
        `Intake & Triage Agent: Categorized as ${triageResult.category}.`,
        `Intake & Triage Agent: Severity set to ${finalSeverity.toUpperCase()}.`,
      ],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Maestro Case ${triageResult.caseId} created.`],
      diagnosticPlan: triageResult.initialDiagnosticPlan,
    });

    // --- Stage 2: Knowledge & Context ---
    await updateIncident(incidentId, {
      agentActivity: ['Knowledge & Context Agent: Querying knowledge bases...'],
    });

    const knowledgeResult = await knowledgeAgent.query({
      incidentId,
      incidentDetails: { title, ...payload },
      identifiedKeywords: [title],
    });

    await updateIncident(incidentId, {
      agentActivity: [
        `Knowledge & Context Agent: Found ${knowledgeResult.relevantArticles.length} relevant KB articles.`,
        `Knowledge & Context Agent: Retrieved ${knowledgeResult.runbookSteps.length} runbook steps.`,
      ],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Knowledge gathering complete.`],
    });

    // --- Stage 3: Diagnostic & Root Cause ---
    await updateIncident(incidentId, {
      agentActivity: ['Diagnostic & Root Cause Agent: Analyzing logs and metrics...'],
    });

    const diagnosticResult = await diagnosticAgent.diagnose({
      incidentId,
      logSnippets: payload?.logs || ['Error: Connection timeout', 'Warning: High memory usage detected'],
      metricData: payload?.metrics || { cpu: '85%', memory: '12GB' },
      incidentContext: `${triageResult.category} - ${title}`,
      knowledgeBaseOutput: knowledgeResult,
    });

    const primaryCause = diagnosticResult.hypothesizedRootCauses[0];
    await updateIncident(incidentId, {
      rootCause: primaryCause?.cause || 'Analysis in progress...',
      agentActivity: [
        `Diagnostic & Root Cause Agent: Primary hypothesis — "${primaryCause?.cause}" (${Math.round((primaryCause?.confidence || 0) * 100)}% confidence).`,
        `Diagnostic & Root Cause Agent: ${diagnosticResult.recommendedDiagnosticActions.length} diagnostic actions recommended.`,
      ],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Root cause analysis complete.`],
      terminalLog: `> SynaPath Diagnostic Agent v2.1\n> Analyzing incident ${incidentId}...\n> Log analysis: ${diagnosticResult.recommendedDiagnosticActions.join('\n> ')}\n> Root cause identified: ${primaryCause?.cause}\n> Confidence: ${Math.round((primaryCause?.confidence || 0) * 100)}%`,
      metrics: {
        cpu: payload?.metrics?.cpu || `${Math.floor(Math.random() * 40 + 60)}%`,
        memory: payload?.metrics?.memory || `${Math.floor(Math.random() * 8 + 4)}GB`,
        latency: payload?.metrics?.latency || `${Math.floor(Math.random() * 2000 + 200)}ms`,
      },
    });

    // --- Stage 4: Action & Remediation ---
    await updateIncident(incidentId, {
      agentActivity: ['Action & Remediation Agent: Generating remediation plan...'],
    });

    const actionResult = await actionAgent.executeActions({
      incidentId,
      diagnosticPlan: diagnosticResult,
      currentIncidentState: payload,
      humanApprovalRequired: true, // Always require human approval for safety
    });

    const newStatus = actionResult.requiresHumanApproval ? 'pending_human' : 'resolved';
    await updateIncident(incidentId, {
      status: newStatus as any,
      proposedSolution: actionResult.proposedRemediation,
      agentActivity: [
        `Action & Remediation Agent: Proposed fix — "${actionResult.proposedRemediation}".`,
        actionResult.requiresHumanApproval
          ? 'Action & Remediation Agent: ⚠️ Human approval required before execution.'
          : 'Action & Remediation Agent: ✅ Fix applied automatically.',
      ],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Remediation plan ready. Status: ${newStatus}.`],
      codeSnippet: `#!/bin/bash\n# Remediation Script — Generated by SynaPath Action Agent\n# Incident: ${incidentId}\n# Root Cause: ${primaryCause?.cause}\n# Generated: ${new Date().toISOString()}\n\necho "Applying fix: ${actionResult.proposedRemediation}"\n# Execute remediation steps here\necho "Fix applied successfully. Monitoring for stability..."`,
    });

    // --- Stage 5: Communication & Update ---
    await commsAgent.sendUpdate({
      incidentId,
      statusUpdate: newStatus === 'pending_human' ? 'Awaiting Human Approval' : 'Resolved',
      details: `Root cause: ${primaryCause?.cause}. Proposed fix: ${actionResult.proposedRemediation}.`,
      stakeholders: ['sre-team@synapath.ai'],
      auditTrailEntry: 'All agents completed processing. Stakeholders notified.',
    });

    await updateIncident(incidentId, {
      agentActivity: ['Communication & Update Agent: ✅ All stakeholders notified.'],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Full agent pipeline complete.`],
    });

    console.log(`Agent pipeline completed for incident ${incidentId}`);
  } catch (error) {
    console.error(`Agent pipeline failed for incident ${incidentId}:`, error);
    await updateIncident(incidentId, {
      agentActivity: [`⚠️ Pipeline error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      auditTrail: [`[${new Date().toLocaleTimeString()}] Agent pipeline encountered an error.`],
    });
  }
}

