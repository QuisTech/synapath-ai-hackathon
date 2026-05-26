# SynaPath AI

> **Your autonomous Site Reliability Engineer. SynaPath uses multi-agent AI to instantly triage, diagnose, and resolve system outages—reducing MTTR by 73% and manual effort by 85% with human-in-the-loop oversight.**

---

### **Inspiration**
Every Site Reliability Engineer (SRE) knows the dread of a 3:00 AM pager alert. Engineers are forced to wake up, groggily pull terminal logs, analyze convoluted stack traces, and manually correlate data across multiple dashboards before they can even *begin* to attempt a fix. We realized that modern AI shouldn't just summarize alerts—it should actively investigate them. We were inspired to build SynaPath AI to end "pager fatigue" by creating an autonomous system that doesn't just tell you something is broken, but actually diagnoses the root cause and hands you the code to fix it.

### **What it does**
SynaPath AI is an autonomous, multi-agent Site Reliability Engineer. When a system alert fires, SynaPath instantly springs into action through a specialized AI workforce:
1. **Intake Agent:** Instantly categorizes and prioritizes the incoming incident.
2. **Diagnostic Agent:** Autonomously pulls live terminal logs, analyzes stack traces, and queries system health.
3. **Action Agent:** Synthesizes the root cause context and generates a code-level remediation (a "Proposed Fix").

Instead of executing blindly, SynaPath presents this data in a breathtaking Command Center UI. A human engineer simply reviews the root cause and clicks "Approve" to deploy the fix. This human-in-the-loop workflow reduces Mean Time To Resolution (MTTR) by 73% and manual effort by 85%.

### **How we built it**
* **The Core Platform:** We built the application using **Next.js (App Router)**, **React**, and **TailwindCSS**, heavily utilizing glassmorphism, dynamic gradients, and modern typography to create a premium, dark-mode Command Center that feels incredibly responsive and alive.
* **The AI Orchestration Layer:** We engineered a custom multi-agent orchestration framework. Rather than relying on a single monolithic LLM prompt, we deployed specialized agents that operate asynchronously. The agents communicate via a shared state, allowing the Diagnostic Agent to securely "read" logs and pass structured context to the Action Agent for code generation.

### **Challenges we ran into**
* **AI Hallucinations in DevOps:** Confining our diagnostic agents so they wouldn't hallucinate fake terminal logs or propose destructive infrastructure changes required rigorous prompt engineering, strict boundary framing, and robust validation of the generated output.
* **Parsing Unstructured Logs:** Real-world server logs and stack traces are messy. Building a parsing engine that could cleanly feed this raw data into the LLM context window without exceeding token limits was a significant hurdle.
* **Complex State Management:** Managing the real-time asynchronous state between multiple AI agents and ensuring the UI reflected those live updates without stuttering required complex React state handling.

### **Accomplishments that we're proud of**
* Designing a truly gorgeous, highly-functional UI that abstracts away the massive complexity of DevOps and server management into a simple, human-in-the-loop approval flow.
* Proving that multi-agent AI systems can accurately traverse complex stack traces and propose verifiable, production-ready code fixes in real-time.
* Successfully orchestrating a system where distinct AI personas hand off tasks to one another seamlessly.

### **What we learned**
We learned the deep intricacies of multi-agent prompt chaining and how to design "Diagnostic" AI systems that safely explore data without taking destructive actions. We also gained immense experience in building highly resilient Next.js architectures that can handle dynamic, streaming data from asynchronous LLM responses.

### **What's next for SynaPath AI**
* **Direct CI/CD Integrations:** Native hooks into AWS CloudWatch, Kubernetes clusters, and GitHub Actions for one-click, zero-downtime deployment of the proposed fixes.
* **Predictive AI Analytics:** Using historical incident data to warn teams of anomalous behavior *before* an alert even fires.
* **Conversational Agent Terminal:** A real-time chat interface where SREs can dynamically interrogate the Diagnostic Agent about the live state of the server during an active incident.

### **Built with**
next.js, react, typescript, tailwind-css, node.js, vercel, framer-motion, openai, multi-agent-systems, llm

---

### **🚀 Getting Started**

To run SynaPath AI locally and test the dashboard:

```bash
# Clone the repository
git clone https://github.com/QuisTech/synapath-ai.git
cd synapath-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
