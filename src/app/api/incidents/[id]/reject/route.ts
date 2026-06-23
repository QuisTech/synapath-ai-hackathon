export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getIncident, updateIncident } from '@/lib/incidentStore';
import { CommunicationAndUpdateAgent } from '@/agents/CommunicationAndUpdateAgent';
import { UiPathClient } from '@/lib/uipath';

/**
 * POST /api/incidents/[id]/reject
 * Human-in-the-loop: rejects the proposed remediation for an incident.
 * This sends the incident back to the investigating state.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await getIncident(params.id);
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (incident.status !== 'pending_human') {
      return NextResponse.json(
        { error: `Incident is not pending approval. Current status: ${incident.status}` },
        { status: 400 }
      );
    }

    // 1. Mark as investigating in our store
    await updateIncident(params.id, {
      status: 'investigating',
      agentActivity: [
        `Action & Remediation Agent: ❌ Human rejected remediation at ${new Date().toLocaleTimeString()}.`,
        `Communication & Update Agent: Returning incident back to Investigation phase.`,
      ],
      auditTrail: [
        `[${new Date().toLocaleTimeString()}] Human REJECTED remediation.`,
        `[${new Date().toLocaleTimeString()}] Incident returned to investigation state.`,
      ],
    });

    // 2. Update UiPath Maestro case (if we have a case ID)
    if (incident.maestroCaseId) {
      try {
        const uipathClient = new UiPathClient();
        await uipathClient.updateMaestroCase(incident.maestroCaseId, {
          status: 'Active',
          agentActivityLog: [
            `Human rejected remediation: ${incident.proposedSolution}`,
            'Incident sent back for further investigation.',
          ],
        });
      } catch (err) {
        console.error('Failed to update Maestro case:', err);
      }
    }

    // 3. Notify stakeholders
    try {
      const commsAgent = new CommunicationAndUpdateAgent();
      await commsAgent.sendUpdate({
        incidentId: params.id,
        statusUpdate: 'Investigating',
        details: `Human rejected fix: "${incident.proposedSolution}". Incident ${params.id} requires alternative remediation.`,
        stakeholders: ['sre-team@synapath.ai'],
        auditTrailEntry: 'Remediation rejected. Stakeholders notified.',
      });
    } catch (err) {
      console.error('Failed to send comms update:', err);
    }

    const updatedIncident = await getIncident(params.id);
    return NextResponse.json({ incident: updatedIncident });
  } catch (error) {
    console.error('Error rejecting incident:', error);
    return NextResponse.json({ error: 'Failed to reject incident' }, { status: 500 });
  }
}
