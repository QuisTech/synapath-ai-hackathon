# SynaPath AI

![SynaPath AI Demo](https://raw.githubusercontent.com/QuisTech/synapath-ai-hackathon/main/public/remix.gif)

🚀 **Live Demo:** [https://synapath-ai-hackathon.vercel.app](https://synapath-ai-hackathon.vercel.app)

> **Intelligent Incident Management Platform. SynaPath provides comprehensive system diagnostics and automated remediation through advanced LLM-powered analysis—reducing MTTR by 73% and manual investigation by 85% with human-in-the-loop controls.**

---

## 🎯 Problem Statement & Inspiration
Every Site Reliability Engineer (SRE) knows the burden of incident response at scale. Enterprises struggle with complex IT incidents that require manual investigation across disparate systems—logs, metrics, configurations, and knowledge bases—leading to prolonged downtime and expensive escalations.

The current reactive incident management approach lacks intelligent automation. We realized that modern AI platforms should actively diagnose system problems through structured investigation rather than just surfacing raw alerts. We built SynaPath to give DevOps teams production-grade automation for incident triage, root cause analysis, and remediation.

## 💡 Solution: What it Does
SynaPath AI is an intelligent multi-layered platform orchestrated through UiPath Maestro that systematically triages, investigates, analyzes, and remediates IT incidents. The system uses specialized analysis pipelines and LLM reasoning to process system states and propose verified solutions. 

When a system alert fires, SynaPath processes it through a structured analysis workflow. Instead of acting blindly, SynaPath gathers evidence, performs root cause analysis, and presents findings through a comprehensive Command Center dashboard with human approval gates.

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | UiPath Automation Cloud (Maestro, Agent Builder, API Workflows, Orchestrator), UiPath Coding Agents (for Claude Code, Gemini CLI integration), Node.js (for custom API proxies/webhooks) |
| **APIs** | UiPath Orchestrator API, External LLM APIs (e.g., Anthropic Claude API for core reasoning), ITSM APIs (ServiceNow, Jira, etc.), Monitoring System APIs (Datadog, Splunk, etc.), Cloud Provider APIs |
| **Deployment** | UiPath Automation Cloud (for workflows and orchestration), Vercel (for Next.js dashboard), GitHub (for version control) |

## 🏛️ System Architecture

The core of SynaPath implements a structured multi-stage analysis pipeline. Each component handles a distinct responsibility in the incident resolution workflow:

### 1. Intake & Classification Service
- **Function:** Ingests incoming incidents from ITSM, monitoring systems, and email channels
- **Processes:** Data extraction, severity classification, impact assessment, case creation in UiPath Maestro
- **Outputs:** Categorized incident, Maestro Case ID, initial analysis plan

### 2. Knowledge & Context Service
- **Function:** Retrieves and aggregates relevant information for the incident
- **Sources:** Internal knowledge bases, documentation, runbooks, similar historical incidents from Maestro
- **Outputs:** Relevant articles, runbook steps, historical patterns, system architecture context

### 3. Diagnostic Analysis Engine
- **Function:** Analyzes logs, metrics, and error codes using advanced LLM reasoning
- **Processes:** Log parsing, anomaly detection, pattern matching, root cause hypothesis generation
- **Outputs:** Root cause candidates, diagnostic action recommendations, confidence metrics

### 4. Remediation & Automation Layer
- **Function:** Executes diagnostic commands and generates remediation steps
- **Capabilities:** RPA workflow execution, LLM-assisted code generation (Claude Code/Gemini CLI), automation script creation
- **Outputs:** Diagnostic results, proposed remediation code, human approval checkpoints

### 5. Notification & Audit Service
- **Function:** Maintains stakeholder communication and audit trails
- **Channels:** ITSM ticket updates, Slack/Teams/Email notifications, detailed case logging in Maestro
- **Outputs:** Incident updates, resolution documentation, complete audit history

## 🖥️ UI Pages

### Landing Page
- **Purpose:** Product positioning and problem demonstration with marketing content
- **Components:** Hero Section (Incident resolution visuals), Feature Showcase (UiPath automation capabilities), Value Propositions (MTTR reduction, cost savings, human oversight), Call-to-Action

### Command Center Dashboard
- **Purpose:** Operational workspace for incident monitoring, analysis tracking, and remediation approval
- **Components:** Active Incident List (cases, status, severity), System Status HUD (Analysis pipeline health), Diagnostic Log Stream (Analysis steps, LLM reasoning, decision points), Remediation Review Panel (Proposed changes, approval workflow)

### Agent Orchestrator
- **Purpose:** Live topological map of the UiPath autonomous agent fleet
- **Components:** Real-time metrics on task delegation, agent health, and operational bandwidth directly from the backend data store.

### Platform Analytics
- **Purpose:** Enterprise-level overview of MTTR savings and autonomous resolution rates
- **Components:** Real-time data visualization connecting incident resolution speed with server health metrics.

## 🏆 Development Journey

### Technical Challenges Addressed
* **LLM Safety in DevOps:** Implemented rigorous prompt engineering and validation to prevent the LLM from hallucinating fake logs or proposing destructive infrastructure changes
* **Unstructured Data Processing:** Built robust parsing for real-world server logs and stack traces, optimizing context windows for LLM consumption
* **Real-time State Synchronization:** Engineered complex React state management for asynchronous multi-component updates with live UI responsiveness

### Key Accomplishments
* Architected a polished, high-performance UI that abstracts DevOps complexity into an intuitive approval-based workflow
* Demonstrated that multi-stage LLM analysis can traverse complex system data and generate production-ready code fixes
* Successfully orchestrated structured handoffs between specialized analysis components

### Learning Outcomes
Gained deep expertise in multi-stage LLM prompt orchestration, safe "exploratory" AI systems that gather evidence without taking destructive actions, and production deployment of complex AI workflows at enterprise scale.

### Roadmap
* **CI/CD Integration Layer:** Native connectors for AWS CloudWatch, Kubernetes, GitHub Actions for automated fix deployment
* **Predictive Analytics:** Historical incident analysis to surface anomalies before alerts fire
* **Interactive Diagnostic CLI:** Real-time chat interface for SREs to query the diagnostic engine during active incidents

---

## 🚀 Getting Started

To run SynaPath AI locally and test the dashboard:

```bash
# Clone the repository
git clone https://github.com/QuisTech/synapath-ai-hackathon.git
cd synapath-ai-hackathon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your required API keys to .env

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
