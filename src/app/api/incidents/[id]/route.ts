export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getIncident, updateIncident } from '@/lib/incidentStore';
import { CommunicationAndUpdateAgent } from '@/agents/CommunicationAndUpdateAgent';

/**
 * GET /api/incidents/[id]
 * Returns a single incident by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const incident = await getIncident(params.id);
  if (!incident) {
    return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
  }
  return NextResponse.json({ incident });
}
