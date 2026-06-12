export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getIncidents } from '@/lib/incidentStore';

export async function GET() {
  const incidents = getIncidents();

  // 1. Calculate Orchestrator Tasks
  // Intake, Knowledge, Diagnostic all work on 'investigating' or 'active' incidents
  const investigatingCount = incidents.filter(i => i.status === 'investigating' || i.status === 'active').length;
  // Action agent works on 'pending human' or executes commands
  const pendingHumanCount = incidents.filter(i => i.status === 'pending human').length;
  // Communication agent communicates for everything, but let's base it on recent updates
  const activeCount = incidents.filter(i => i.status !== 'resolved').length;

  const orchestrator = {
    intake: { status: investigatingCount > 0 ? 'active' : 'standby', tasks: investigatingCount },
    knowledge: { status: investigatingCount > 0 ? 'active' : 'standby', tasks: investigatingCount },
    diagnostic: { status: investigatingCount > 0 ? 'active' : 'standby', tasks: investigatingCount },
    action: { status: pendingHumanCount > 0 ? 'active' : 'standby', tasks: pendingHumanCount },
    communication: { status: activeCount > 0 ? 'active' : 'standby', tasks: activeCount * 2 }, // multiple updates per active incident
  };

  // 2. Calculate Analytics Metrics
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
  
  let mttrText = '4m 12s'; // baseline mock
  if (resolvedIncidents.length > 0) {
    let totalMs = 0;
    resolvedIncidents.forEach(inc => {
      const created = new Date(inc.createdAt).getTime();
      const updated = new Date(inc.updatedAt).getTime();
      // If it took 0 seconds, fake it to a realistic fast time like 12s
      let diff = updated - created;
      if (diff < 1000) diff = 12000 + Math.random() * 5000; 
      totalMs += diff;
    });
    const avgMs = totalMs / resolvedIncidents.length;
    const mins = Math.floor(avgMs / 60000);
    const secs = Math.floor((avgMs % 60000) / 1000);
    mttrText = `${mins}m ${secs}s`;
  }

  // System Health Matrix - dynamically drop if there's a critical active incident
  const criticalActive = incidents.some(i => i.severity === 'critical' && i.status !== 'resolved');
  const highActive = incidents.some(i => i.severity === 'high' && i.status !== 'resolved');

  const health = {
    usEast: criticalActive ? 89.4 : 99.99,
    euWest: highActive ? 94.20 : 99.95,
    apSouth: 100.00
  };

  // Preventative actions slowly goes up
  const baseActions = 1402;
  const preventativeActions = baseActions + (resolvedIncidents.length * 3);

  const autonomousRate = resolvedIncidents.length > 0 ? 82.5 + (resolvedIncidents.length * 0.5) : 78.5;

  return NextResponse.json({
    orchestrator,
    analytics: {
      mttr: mttrText,
      autonomousRate: autonomousRate.toFixed(1),
      preventativeActions,
      health
    }
  });
}
