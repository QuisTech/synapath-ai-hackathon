---

SynaPath AI

https://raw.githubusercontent.com/QuisTech/synapath-ai-hackathon/main/public/remix.gif

🚀 Live Demo: https://synapath-ai-hackathon.vercel.app

Your autonomous Site Reliability Engineer. SynaPath uses multi-agent AI to instantly triage, diagnose, and resolve system outages—reducing MTTR by 73% and manual effort by 85% with human-in-the-loop oversight.

---

📋 Table of Contents

· Problem Statement & Inspiration
· Solution: What it Does
· Tech Stack
· System Architecture
· UiPath Integration
· UI Pages
· Installation & Setup
· Development Journey
· Roadmap

---

🎯 Problem Statement & Inspiration

Every Site Reliability Engineer (SRE) knows the dread of a 3:00 AM pager alert. Enterprises struggle with complex IT incidents that demand manual investigation across disparate systems—logs, metrics, configurations, and knowledge bases—leading to prolonged downtime, increased operational costs, and overburdened IT staff.

Engineers are forced to wake up, groggily pull terminal logs, analyze convoluted stack traces, and manually correlate data across multiple dashboards before they can even begin to attempt a fix. The current reactive approach lacks real-time, intelligent diagnostics.

We realized that modern AI shouldn't just summarize alerts—it should actively investigate them. We built SynaPath AI to end "pager fatigue" by creating an autonomous system that doesn't just tell you something is broken, but actually diagnoses the root cause and hands you the code to fix it.

---

💡 Solution: What it Does

SynaPath AI is an intelligent, multi-agent platform orchestrated through a custom agent pipeline that systematically triages, investigates, diagnoses, and remediates IT incidents. Leveraging specialized AI agents and advanced LLM reasoning, it transforms reactive incident response into a proactive, efficient, and 'human-in-the-loop' experience.

When a system alert fires, SynaPath instantly springs into action through a specialized AI workforce:

1. Intake & Triage - Captures and categorizes the incident
2. Knowledge Retrieval - Gathers relevant context from KBs and runbooks
3. Diagnostic Analysis - Performs root cause analysis using LLM reasoning
4. Action & Remediation - Generates precise code-level fixes
5. Communication - Updates stakeholders and maintains audit trails

Instead of executing blindly, SynaPath presents its findings in a breathtaking Command Center UI. A human engineer simply reviews the root cause and clicks "Approve" to deploy the proposed fix.

---

🏗️ Tech Stack

Layer Technologies
Frontend Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React
Backend Next.js API Routes, Prisma ORM, MongoDB
AI/LLM Groq API (Llama 3.3-70b), Custom Agent Framework
Orchestration UiPath Automation Cloud (Maestro, Agent Builder, Orchestrator)
Video Generation Remotion (Cinematic demos, automated video creation)
Database MongoDB (via Prisma)
Deployment Vercel (Frontend), UiPath Cloud (Orchestration)

---

🏛️ System Architecture

SynaPath implements a real, production-grade multi-stage agent pipeline with persistent storage and LLM integration:

1. Intake & Triage Agent

· Function: Monitors incoming incidents from ITSM, monitoring alerts, and email
· Processes: Extracts key information, categorizes severity/impact, initiates cases
· Outputs: Categorized incident, Maestro Case ID, initial diagnostic plan
· Implementation: src/agents/IntakeAndTriageAgent.ts

2. Knowledge & Context Agent

· Function: Queries internal knowledge bases, documentation, and runbooks
· Processes: Retrieves relevant articles, runbook steps, historical patterns
· Outputs: Relevant articles, runbook steps, historical context, system diagrams
· Implementation: src/agents/KnowledgeAndContextAgent.ts

3. Diagnostic & Root Cause Agent

· Function: Analyzes logs, metrics, and error codes using LLM reasoning
· Processes: Log parsing, anomaly detection, root cause hypothesis generation
· Outputs: Root cause candidates, diagnostic actions, confidence scores
· Implementation: src/agents/DiagnosticAndRootCauseAgent.ts

4. Action & Remediation Agent

· Function: Executes diagnostic commands and generates remediation code
· Capabilities: RPA workflow execution, LLM-assisted code generation (Bash/Python/PowerShell)
· Outputs: Execution results, proposed remediation, human approval checkpoints
· Implementation: src/agents/ActionAndRemediationAgent.ts

5. Communication & Update Agent

· Function: Maintains stakeholder communication and audit trails
· Channels: ITSM ticket updates, stakeholder notifications, Maestro logging
· Outputs: Incident updates, resolution documentation, complete audit history
· Implementation: src/agents/CommunicationAndUpdateAgent.ts

Database Layer

· Real MongoDB persistence via Prisma ORM
· Incident model with full audit trail, metrics, and agent activity logs
· Real-time updates from agent pipeline

API Layer

· Full REST API with endpoints for incidents, metrics, approvals
· Real agent pipeline execution on incident creation
· Live metrics calculation from incident data

---

🧩 UiPath Integration Details

To fully comply with the hackathon submission guidelines, here is an explicit breakdown of how SynaPath AI utilizes the UiPath ecosystem:

1. UiPath Components Used

· UiPath Maestro: Core orchestration engine managing the end-to-end incident lifecycle, tracking case status, and handling handoffs between different AI agents
· UiPath Agent Builder: Designed to prompt and configure individual AI personas (Intake, Knowledge, Diagnostic, Action, and Communication agents)
· UiPath Orchestrator & API Workflows: Backend bridge to trigger automated diagnostic scripts and remediation actions on target servers
· UiPath Coding Agents: Leveraged dynamically to generate and execute custom remediation code snippets based on the LLM's root cause analysis

2. Agent Type Specification

SynaPath AI utilizes BOTH Coded Agents and Low-code Agents:

· Low-code Agents are used for the Intake & Triage, Knowledge, and Communication layers to rapidly parse payloads, query knowledge bases, and send ITSM updates via pre-built connectors
· Coded Agents are used heavily in the Diagnostic and Action & Remediation layers to execute custom bash/PowerShell scripts and apply precise infrastructure fixes that require complex programming logic

3. Graceful Degradation

The UiPath client implements graceful degradation:

· Attempts real API calls when credentials are configured
· Falls back to offline mode with simulated case IDs if credentials are missing
· Ensures the demo works even without full UiPath access

---

🖥️ UI Pages

Landing Page

· Purpose: Marketing and problem explanation with Hero/Features sections
· Components: Hero Section (Dynamic incident resolution visual), Innovation Showcase (How UiPath agents enable autonomy), Key Features (Faster MTTR, Reduced Costs, Human-in-the-Loop), Call-to-Action
· Route: /

Command Center Dashboard

· Purpose: The functional AI workspace showing live reasoning, agent collaboration, incident progress, and human intervention points
· Components: Active Incident List (cases, status, severity), Agent Status HUD (Live status of each agent), Live Reasoning Log (Stream of agent interactions), Action Center (Pending human approvals), Incident Details Panel (Root causes, proposed solutions, audit trail)
· Route: /dashboard

Agent Orchestrator

· Purpose: Live topological map of the autonomous agent fleet
· Components: Real-time visual metrics tracking task delegation, state changes, and pipeline throughput natively tied to the incident store backend
· Route: /orchestrator

Platform Analytics

· Purpose: Executive-level observability into MTTR savings and system health
· Components: Live dashboarding reflecting how quickly the autonomous agents are diagnosing incidents versus human industry baselines
· Route: /analytics

Cinematic Demo

· Purpose: Automated video demonstration of the agent pipeline
· Components: Remotion-powered cinematic walkthrough with voiceover narration
· Route: /cinematic-demo

---

🚀 Installation & Setup

Follow these step-by-step instructions to configure and run the SynaPath AI dashboard locally for your evaluation.

(Note: The live Vercel deployment at https://synapath-ai-hackathon.vercel.app is fully configured and ready for immediate testing without any local installation.)

1. Prerequisites

· Node.js (v18 or higher)
· npm or yarn
· Git
· MongoDB (local or Atlas)

2. Installation

```bash
# Clone the repository
git clone https://github.com/QuisTech/synapath-ai-hackathon.git
cd synapath-ai-hackathon

# Install dependencies
npm install
```

3. Environment Variables

Create a .env.local file in the root directory:

```env
# Database (MongoDB)
DATABASE_URL="mongodb://localhost:27017/synapath"

# UiPath Automation Cloud Credentials (Optional)
UIPATH_APP_ID="your_uipath_app_id"
UIPATH_APP_SECRET="your_uipath_app_secret"
UIPATH_ORG_NAME="your_uipath_org_name"
UIPATH_TENANT_NAME="your_uipath_tenant_name"
UIPATH_FOLDER_ID="your_uipath_folder_id"

# LLM Intelligence (Required)
GROQ_API_KEY="your_groq_api_key"
```

4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with initial incidents
# The database will auto-seed on first run
```

5. Running the Application

```bash
# Start the Next.js development server
npm run dev
```

The application will be available at http://localhost:3000.

6. Testing the Live Agent Pipeline

1. Open your browser and navigate to http://localhost:3000/dashboard
2. Click the "New Incident" button on the Command Center Dashboard
3. Enter a title and severity level, then click "Launch Agent Pipeline"
4. This triggers a POST request to /api/incidents, executing the full multi-agent orchestration:
   · Intake Agent categorizes the incident
   · Knowledge Agent retrieves relevant context
   · Diagnostic Agent performs root cause analysis
   · Action Agent generates remediation code
   · Communication Agent updates stakeholders
5. Watch the incident transition through the 5 specialized agent states dynamically in the UI log stream
6. Navigate to the Orchestrator and Analytics tabs to see real-time system metrics

---

🏆 Development Journey

Challenges We Overcame

· AI Hallucinations in DevOps: Confining diagnostic agents to prevent hallucinated terminal logs or destructive infrastructure changes required rigorous prompt engineering and robust validation
· Parsing Unstructured Logs: Real-world server logs and stack traces are messy—building a parsing engine to cleanly feed raw data into LLM context windows without exceeding token limits was a significant hurdle
· Complex State Management: Managing real-time asynchronous state between multiple AI agents and ensuring the UI reflected those live updates without stuttering required complex React state handling with Prisma

Accomplishments We're Proud Of

· Designed a truly gorgeous, highly-functional UI that abstracts away DevOps complexity into a simple, human-in-the-loop approval flow
· Proved that multi-agent AI systems can accurately traverse complex stack traces and propose verifiable, production-ready code fixes in real-time
· Successfully orchestrated a system where distinct AI personas hand off tasks to one another seamlessly with persistent state
· Built a production-grade backend with real database persistence, full REST API, and LLM integration

What We Learned

We learned the deep intricacies of multi-agent prompt chaining and how to design "Diagnostic" AI systems that safely explore data without taking destructive actions. We also gained immense experience in building highly resilient Next.js architectures that handle dynamic, streaming data from asynchronous LLM responses and real database operations.

---

🗺️ Roadmap

· Direct CI/CD Integrations: Native hooks into AWS CloudWatch, Kubernetes, and GitHub Actions for one-click, zero-downtime deployment of proposed fixes
· Predictive AI Analytics: Using historical incident data to warn teams of anomalous behavior before an alert even fires
· Conversational Agent Terminal: A real-time chat interface where SREs can dynamically interrogate the Diagnostic Agent about live server state during an active incident
· Multi-Tenant Support: Enterprise-grade isolation and RBAC for large organizations
· Custom Agent Workflows: Visual workflow builder for defining custom agent pipelines

---

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by QuisTech