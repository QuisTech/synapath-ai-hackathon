# SynaPath AI

> Autonomous IT Incident Management, Orchestrated by UiPath Agents.

## 🎯 Problem Statement
Enterprises struggle with complex IT incidents that demand manual investigation across disparate systems, leading to prolonged downtime, increased operational costs, and overburdened IT staff. The current reactive approach lacks real-time, intelligent diagnostics and proactive resolution capabilities.

## 💡 Solution
SynaPath AI is an intelligent, multi-agent solution orchestrated by UiPath Maestro that autonomously triages, investigates, diagnoses, and remediates IT incidents. Leveraging specialized agents and advanced LLMs, it transforms reactive incident response into a proactive, efficient, and 'human-in-the-loop' experience.

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, Tailwind CSS, Framer Motion, Lucide React |
| Backend | UiPath Automation Cloud (Maestro, Agent Builder, API Workflows, Orchestrator), UiPath Coding Agents (for Claude Code, Gemini CLI integration), Node.js (for custom API proxies/webhooks to Next.js dashboard) |
| APIs | UiPath Orchestrator API, External LLM APIs (e.g., Anthropic Claude API for core reasoning), ITSM APIs (ServiceNow, Jira, etc.), Monitoring System APIs (Datadog, Splunk, etc.), Cloud Provider APIs (AWS, Azure, GCP), UiPath for Coding Agents (Claude Code/Gemini CLI integration) |
| Deployment | UiPath Automation Cloud (for agents and workflows), Vercel (for Next.js dashboard), GitHub (for public repository) |

## 🤖 Agent Architecture

### Intake & Triage Agent
- **Role:** Monitors incoming incidents (e.g., from ITSM, monitoring alerts), extracts key information, categorizes severity and impact, and initiates a new case in UiPath Maestro.
- **Inputs:** Incident data (ticket details, alert payloads, email content)
- **Outputs:** Categorized incident, new UiPath Maestro Case ID, initial diagnostic plan.

### Knowledge & Context Agent
- **Role:** Queries internal knowledge bases, documentation, runbooks, and external sources to gather relevant information for the incident. Provides context to other agents.
- **Inputs:** Incident details, identified keywords, previous similar incidents (from Maestro)
- **Outputs:** Relevant articles, runbook steps, historical context, system diagrams.

### Diagnostic & Root Cause Agent
- **Role:** Analyzes system logs, metrics, error codes, and contextual data (from Knowledge Agent) using advanced LLM reasoning to identify potential root causes and formulate diagnostic steps.
- **Inputs:** Log snippets, metric data, incident context, KB articles, LLM prompts
- **Outputs:** Hypothesized root causes, a series of recommended diagnostic actions, confidence score.

### Action & Remediation Agent
- **Role:** Executes diagnostic commands, runs RPA workflows to gather more data, and crucially, uses UiPath for Coding Agents (Claude Code/Gemini CLI) to generate small, targeted automation scripts (e.g., PowerShell, Python, UiPath XAML snippets) to test hypotheses or apply fixes. Seeks human approval for critical actions.
- **Inputs:** Diagnostic action plan, generated code snippets, human approval triggers
- **Outputs:** Execution results, updated system state, proposed remediation (script/workflow), human approval request.

### Communication & Update Agent
- **Role:** Keeps relevant stakeholders informed, updates the ITSM ticket with progress and resolution details, and logs all agent activities within the UiPath Maestro Case for auditability.
- **Inputs:** Incident status updates, resolution steps, stakeholder list
- **Outputs:** ITSM ticket updates, internal notifications (Slack/Teams/Email), detailed case log in Maestro.

## 🖥️ UI Pages

### Landing Page
**Purpose:** Marketing and problem explanation with Hero/Features sections, highlighting the value proposition of autonomous incident management.
**Components:** HeroSection (Dynamic incident resolution visual) · InnovationShowcase (How UiPath agents enable autonomy) · KeyFeatures (Faster MTTR, Reduced Costs, Human-in-the-Loop) · CTA (Try SynaPath AI Demo)

### Dashboard
**Purpose:** The functional AI workspace showing live reasoning, agent collaboration, incident progress, and human intervention points.
**Components:** GlobalIncidentView (List of active cases, status, severity) · AgentStatusHUD (Live status of each agent, what they're doing) · LiveReasoningLog (Stream of agent interactions, LLM calls, decisions made) · ActionCenter (Pending human approvals, manual override options, one-click remediation execution) · IncidentDetailsPanel (Comprehensive view of a selected incident, root causes, proposed solutions, audit trail)

## 🚀 Getting Started

```bash
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

## 🎬 Demo Flow

1. Step 1: Landing Page - Highlight the pervasive problem of manual IT incident management and introduce SynaPath AI's transformative vision, emphasizing the 'Innovation Highlight' of autonomous, LLM-powered resolution.
2. Step 2: Dashboard - Show the Multi-Agent HUD in 'Standby' mode within a clean, premium UI. Quickly demonstrate the 'GlobalIncidentView' showing a high-level overview of open cases.
3. Step 3: Action - A new, complex IT incident (e.g., 'Service XYZ is degraded due to recent deployment') is simulated to trigger the system (e.g., via a mock ITSM alert). The 'Intake & Triage Agent' immediately picks it up, creating a new 'Case' in UiPath Maestro.
4. Step 4: Reasoning - The 'LiveReasoningLog' comes alive. Show the 'Knowledge & Context Agent' fetching relevant info, followed by the 'Diagnostic & Root Cause Agent' leveraging an external LLM (via API workflow) to analyze logs and propose a root cause. Crucially, the 'Action & Remediation Agent' is then shown using 'UiPath for Coding Agents' (e.g., `_codingAgent.invoke('Claude Code', 'generate_powershell_script_to_restart_service')`) to generate a small script for remediation, and UiPath Maestro pauses for human approval in the 'ActionCenter'.
5. Step 5: Result - A human operator quickly reviews and approves the generated script via the 'ActionCenter'. The 'Action & Remediation Agent' then executes it (via RPA/API workflow). The system confirms the resolution, and the 'Communication & Update Agent' closes the incident in the mock ITSM, with the 'IncidentDetailsPanel' showing a complete, auditable trail. Emphasize speed, accuracy, and reduced manual effort.

## 📊 Scoring Strategy
This project aims for an 11/10 by tackling a ubiquitous business problem (IT Incident Management) with a truly *agentic* solution, not just automation. It demonstrates profound innovation by orchestrating multiple specialized agents and integrating cutting-edge LLMs (via UiPath for Coding Agents for bonus points, and direct API for advanced reasoning) for dynamic root cause analysis and code-generated remediation. Deep UiPath Platform usage (Maestro Cases, Agent Builder, API Workflows, RPA, UiPath Coding Agents) is central to its architecture, showcasing the platform's power as an orchestration layer. The 'Human-in-the-Loop' design ensures production viability and addresses real-world concerns. The sleek, modern UI elevates the user experience, while the detailed demo flow clearly highlights the innovation and business impact, making it visually and technically compelling for judges.

---

*Generated by [Agents Assemble](https://github.com/QuisTech/agents-assemble) — The Hackathon Co-Founder Meta-System*
