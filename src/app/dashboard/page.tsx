"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, MoreHorizontal, UserCheck, Activity, Brain, Handshake, Mail, Zap, Terminal, Code2, Info, Plus, RefreshCw, Loader2 } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  status: 'active' | 'resolved' | 'pending_human' | 'investigating';
  severity: 'low' | 'medium' | 'high' | 'critical';
  agentActivity: string[];
  rootCause?: string;
  proposedSolution?: string;
  auditTrail: string[];
  metrics: { cpu: string; memory: string; latency: string };
  codeSnippet?: string;
  terminalLog?: string;
}

const agentIcons = {
  'Intake & Triage Agent': <Activity className="w-5 h-5 text-purple-400" />,
  'Knowledge & Context Agent': <Brain className="w-5 h-5 text-blue-400" />,
  'Diagnostic & Root Cause Agent': <Handshake className="w-5 h-5 text-yellow-400" />,
  'Action & Remediation Agent': <Terminal className="w-5 h-5 text-red-400" />,
  'Communication & Update Agent': <Mail className="w-5 h-5 text-green-400" />,
};

const Dashboard = () => {
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [reasoningLog, setReasoningLog] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'code'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Fetch incidents from the API
  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setActiveIncidents(data.incidents);

        // Safely update selected incident using functional state update to avoid stale closures in setInterval
        setSelectedIncident((prev) => {
          if (!prev) return prev;
          const updated = data.incidents.find((i: Incident) => i.id === prev.id);
          return updated || prev;
        });
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling every 3 seconds for live updates
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live reasoning log from agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Pull latest agent activity from all incidents as reasoning log entries
      const allActivity = activeIncidents
        .flatMap((inc) => inc.agentActivity.map((a) => `[${inc.id}] ${a}`));
      if (allActivity.length > 0) {
        setReasoningLog(allActivity.slice(-20));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeIncidents]);

  // Create a new incident via the API
  const handleCreateIncident = async () => {
    if (!newIncidentTitle.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newIncidentTitle,
          source: 'Dashboard',
          severity: newIncidentSeverity,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewIncidentTitle('');
        setShowNewIncidentForm(false);
        setReasoningLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 🚀 New incident created: ${data.incident.id} — Agent pipeline started.`,
        ]);
        // Fetch immediately to show the new incident
        await fetchIncidents();
      }
    } catch (error) {
      console.error('Failed to create incident:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const [isRejecting, setIsRejecting] = useState(false);

  // Approve remediation via the API
  const handleApproveRemediation = async (incidentId: string) => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        setReasoningLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✅ Human approved remediation for ${incidentId}. Executing fix...`,
        ]);
        await fetchIncidents();
      }
    } catch (error) {
      console.error('Failed to approve incident:', error);
    } finally {
      setIsApproving(false);
    }
  };

  // Reject remediation via the API
  const handleRejectRemediation = async (incidentId: string) => {
    setIsRejecting(true);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/reject`, {
        method: 'POST',
      });
      if (res.ok) {
        setReasoningLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ❌ Human REJECTED remediation for ${incidentId}. Sending back to investigation.`,
        ]);
        await fetchIncidents();
      }
    } catch (error) {
      console.error('Failed to reject incident:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusIcon = (status: Incident['status']) => {
    switch (status) {
      case 'active':
      case 'investigating':
        return <Activity className="w-5 h-5 text-primary" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'pending_human':
        return <UserCheck className="w-5 h-5 text-warning" />;
      default:
        return <MoreHorizontal className="w-5 h-5 text-secondary" />;
    }
  };

  const getSeverityClass = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-danger';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-success';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SynaPath AI Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchIncidents}
            className="flex items-center gap-2 bg-card border border-border hover:bg-background text-foreground py-2 px-4 rounded-md text-sm font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setShowNewIncidentForm(!showNewIncidentForm)}
            className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-bold transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" /> New Incident
          </button>
        </div>
      </div>

      {/* New Incident Form */}
      {showNewIncidentForm && (
        <div className="bg-card border border-primary/30 rounded-lg p-6 mb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Ingest New Incident
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-secondary mb-1 block">Incident Title / Description</label>
              <input
                type="text"
                value={newIncidentTitle}
                onChange={(e) => setNewIncidentTitle(e.target.value)}
                placeholder="e.g. Kubernetes pod CrashLoopBackOff in prod-api namespace"
                className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateIncident()}
              />
            </div>
            <div>
              <label className="text-sm text-secondary mb-1 block">Severity</label>
              <select
                value={newIncidentSeverity}
                onChange={(e) => setNewIncidentSeverity(e.target.value as any)}
                className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowNewIncidentForm(false)}
              className="bg-background border border-border hover:bg-card text-foreground py-2 px-6 rounded-md font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateIncident}
              disabled={isCreating || !newIncidentTitle.trim()}
              className="bg-primary hover:bg-indigo-600 disabled:opacity-50 text-white py-2 px-6 rounded-md font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isCreating ? 'Launching Agents...' : 'Launch Agent Pipeline'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Global Incident View */}
        <div className="md:col-span-2 bg-card rounded-lg shadow-lg p-6 flex flex-col border border-border">
          <h2 className="text-2xl font-semibold mb-4">Global Incident View</h2>
          <div className="overflow-x-auto flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-secondary">Loading incidents...</span>
              </div>
            ) : activeIncidents.length === 0 ? (
              <p className="text-secondary">No active incidents.</p>
            ) : (
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="border-b border-border text-secondary">
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Severity</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-border last:border-b-0 hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono text-primary">{incident.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{incident.title}</td>
                      <td className="py-3 px-4 flex items-center gap-2 text-sm">
                        {getStatusIcon(incident.status)}
                        <span className="capitalize">{incident.status.replace(/_/g, ' ')}</span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-semibold uppercase ${getSeverityClass(incident.severity)}`}>{incident.severity}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => { setSelectedIncident(incident); setActiveTab('overview'); }}
                          className="bg-primary hover:bg-indigo-600 text-white py-1.5 px-4 rounded-md text-xs font-semibold transition-colors shadow-md"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Agent Status HUD */}
        <div className="md:col-span-1 bg-card rounded-lg shadow-lg p-6 flex flex-col border border-border">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-primary"/> Agent Status HUD</h2>
          <div className="flex flex-col gap-3 overflow-y-auto flex-grow pr-2">
            {Object.entries(agentIcons).map(([agentName, icon]) => (
              <div key={agentName} className="bg-background/80 p-3 rounded-lg shadow-sm flex items-center space-x-3 border border-border hover:border-primary/50 transition-colors">
                <div className="p-2 rounded-full bg-card border border-border">
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{agentName}</h3>
                  <p className="text-xs text-success flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Active</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Reasoning Log */}
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-sm uppercase text-secondary font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Reasoning Log
            </h3>
            <div className="bg-[#0D1117] rounded-lg p-3 h-40 overflow-y-auto font-mono text-xs text-green-400 space-y-1">
              {reasoningLog.length === 0 ? (
                <p className="text-secondary">Waiting for agent activity...</p>
              ) : (
                reasoningLog.map((entry, i) => (
                  <p key={i} className="leading-relaxed">{entry}</p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Incident Details Panel */}
        {selectedIncident && (
          <div className="md:col-span-3 bg-card rounded-lg shadow-xl p-0 flex flex-col border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-background p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  {selectedIncident.id} 
                  <span className={`text-sm px-3 py-1 rounded-full uppercase border ${getSeverityClass(selectedIncident.severity)} border-current`}>
                    {selectedIncident.severity}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full uppercase ${
                    selectedIncident.status === 'resolved' ? 'bg-success/20 text-success border border-success/30' :
                    selectedIncident.status === 'pending_human' ? 'bg-warning/20 text-warning border border-warning/30' :
                    'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {selectedIncident.status.replace(/_/g, ' ')}
                  </span>
                </h2>
                <p className="text-secondary mt-1 text-lg">{selectedIncident.title}</p>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-secondary hover:text-danger transition-colors p-2">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-background/50 px-6">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`py-4 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}
              >
                <Info className="w-4 h-4" /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('terminal')} 
                className={`py-4 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'terminal' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}
              >
                <Terminal className="w-4 h-4" /> Agent Terminal
              </button>
              <button 
                onClick={() => setActiveTab('code')} 
                className={`py-4 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'code' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}
              >
                <Code2 className="w-4 h-4" /> Proposed Fix
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm uppercase text-secondary font-semibold mb-2">Affected Systems Metrics</h3>
                      <div className="flex gap-4">
                        <div className="bg-background px-4 py-3 rounded-lg border border-border text-center min-w-[100px]">
                          <p className="text-xs text-secondary mb-1">CPU</p>
                          <p className="text-xl font-mono font-bold text-danger">{selectedIncident.metrics.cpu}</p>
                        </div>
                        <div className="bg-background px-4 py-3 rounded-lg border border-border text-center min-w-[100px]">
                          <p className="text-xs text-secondary mb-1">Memory</p>
                          <p className="text-xl font-mono font-bold text-warning">{selectedIncident.metrics.memory}</p>
                        </div>
                        <div className="bg-background px-4 py-3 rounded-lg border border-border text-center min-w-[100px]">
                          <p className="text-xs text-secondary mb-1">Latency</p>
                          <p className="text-xl font-mono font-bold text-primary">{selectedIncident.metrics.latency}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase text-secondary font-semibold mb-2">Root Cause Analysis</h3>
                      <p className="bg-background p-4 rounded-lg border border-border text-foreground">
                        {selectedIncident.rootCause || 'Diagnostic Agent is still analyzing telemetry data...'}
                      </p>
                    </div>
                    {selectedIncident.proposedSolution && (
                      <div>
                        <h3 className="text-sm uppercase text-secondary font-semibold mb-2">Proposed Solution</h3>
                        <p className="bg-background p-4 rounded-lg border border-primary/30 text-foreground">
                          {selectedIncident.proposedSolution}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm uppercase text-secondary font-semibold mb-2">Agent Audit Trail</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {selectedIncident.agentActivity.map((activity, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="mt-1"><CheckCircle className="w-4 h-4 text-primary" /></div>
                          <p className="text-sm text-foreground bg-background p-2 rounded-md border border-border w-full">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'terminal' && (
                <div className="bg-[#0D1117] rounded-lg p-4 font-mono text-sm text-green-400 border border-border h-64 overflow-y-auto shadow-inner">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="whitespace-pre-wrap">{selectedIncident.terminalLog || '> Awaiting diagnostic stream...'}</pre>
                  <div className="animate-pulse mt-2">_</div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="flex flex-col h-full">
                  <div className="bg-[#1E1E1E] rounded-lg p-6 font-mono text-sm text-blue-300 border border-border h-64 overflow-y-auto shadow-inner mb-6">
                    <pre className="whitespace-pre-wrap">{selectedIncident.codeSnippet || '// No code remediation proposed for this incident.'}</pre>
                  </div>
                  
                  {selectedIncident.status === 'pending_human' && selectedIncident.proposedSolution && (
                    <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-warning flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Human Approval Required</h4>
                        <p className="text-sm text-foreground mt-1">Agent proposes executing the above script on target servers.</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleRejectRemediation(selectedIncident.id)}
                          disabled={isApproving || isRejecting}
                          className="bg-background border border-border hover:bg-card hover:border-danger hover:text-danger disabled:opacity-50 text-foreground py-2 px-6 rounded-md font-semibold transition-colors flex items-center gap-2"
                        >
                          {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {isRejecting ? 'Rejecting...' : 'Reject Fix'}
                        </button>
                        <button 
                          onClick={() => handleApproveRemediation(selectedIncident.id)}
                          disabled={isApproving || isRejecting}
                          className="bg-success hover:bg-green-600 disabled:opacity-50 text-white py-2 px-6 rounded-md font-bold transition-colors shadow-lg hover:shadow-green-500/20 flex items-center gap-2"
                        >
                          {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {isApproving ? 'Executing...' : 'Execute Remediation'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedIncident.status === 'resolved' && (
                    <div className="bg-success/10 border border-success/30 p-4 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-success" />
                      <div>
                        <h4 className="font-bold text-success">Incident Resolved</h4>
                        <p className="text-sm text-foreground mt-1">Remediation has been approved and executed successfully.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
