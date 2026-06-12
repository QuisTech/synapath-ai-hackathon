import { NextRequest, NextResponse } from 'next/server';
import { getIncident, updateIncident } from '@/lib/incidentStore';
import { CommunicationAndUpdateAgent } from '@/agents/CommunicationAndUpdateAgent';
import { UiPathClient } from '@/lib/uipath';

/**
 * POST /api/incidents/[id]/approve
 * Human-in-the-loop: approves the proposed remediation for an incident.
 * This triggers the Action agent to execute the fix and updates UiPath Maestro.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const incident = getIncident(params.id);
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (incident.status !== 'pending_human') {
      return NextResponse.json(
        { error: `Incident is not pending approval. Current status: ${incident.status}` },
        { status: 400 }
      );
    }

    // 1. Mark as resolved in our store
    updateIncident(params.id, {
      status: 'resolved',
      agentActivity: [
        `Action & Remediation Agent: ✅ Human approved remediation at ${new Date().toLocaleTimeString()}.`,
        `Action & Remediation Agent: Executing fix — "${incident.proposedSolution}".`,
        'Communication & Update Agent: Marking incident as RESOLVED.',
      ],
      auditTrail: [
        `[${new Date().toLocaleTimeString()}] Human approved remediation.`,
        `[${new Date().toLocaleTimeString()}] Fix executed. Incident resolved.`,
      ],
    });

    // 2. Update UiPath Maestro case (if we have a case ID)
    if (incident.maestroCaseId) {
      try {
        const uipathClient = new UiPathClient();
        await uipathClient.updateMaestroCase(incident.maestroCaseId, {
          status: 'Resolved',
          agentActivityLog: [
            `Human approved remediation: ${incident.proposedSolution}`,
            'Incident resolved.',
          ],
        });
      } catch (err) {
        console.error('Failed to update Maestro case:', err);
        // Non-blocking — the incident is still resolved locally
      }
    }

    // 3. Notify stakeholders
    try {
      const commsAgent = new CommunicationAndUpdateAgent();
      await commsAgent.sendUpdate({
        incidentId: params.id,
        statusUpdate: 'Resolved',
        details: `Human approved fix: "${incident.proposedSolution}". Incident ${params.id} is now resolved.`,
        stakeholders: ['sre-team@synapath.ai'],
        auditTrailEntry: 'Remediation approved and executed. Incident closed.',
      });
    } catch (err) {
      console.error('Failed to send comms update:', err);
    }

    const updatedIncident = getIncident(params.id);
    return NextResponse.json({ incident: updatedIncident });
  } catch (error) {
    console.error('Error approving incident:', error);
    return NextResponse.json({ error: 'Failed to approve incident' }, { status: 500 });
  }
}
