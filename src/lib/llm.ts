import Groq from "groq-sdk";

export class LLMClient {
  private groq: Groq;
  private model: string;

  constructor(model: string = 'llama-3.3-70b-versatile') {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || '',
    });
    this.model = model;
  }

  /**
   * Generates text using the configured LLM.
   */
  async generateText(prompt: string, systemMessage?: string, temperature: number = 0.5): Promise<string> {
    console.log(`LLMClient: Generating text with model ${this.model}`);
    
    // Default system message to enforce strict output formats needed by the agents
    const defaultSystem = `You are SynaPath AI, an autonomous IT incident management orchestrator. 
    You must strictly follow any "Output format" instructions provided in the prompt. Do not use markdown wrappers unless specifically asked. Do not add introductory conversational text like "Here is the result...". Provide ONLY the requested format.`;

    try {
      const messages: any[] = [];
      messages.push({ role: 'system', content: systemMessage || defaultSystem });
      messages.push({ role: 'user', content: prompt });

      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages,
        model: this.model,
        temperature: temperature,
      });

      const response = chatCompletion.choices[0]?.message?.content || "";
      console.log(`LLMClient: Received response of length ${response.length}`);
      return response;
    } catch (error) {
      console.error("LLM Generation failed:", error);
      throw new Error(`Groq LLM Generation Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generates a code snippet using the LLM.
   */
  async generateCode(requirements: string, language: string): Promise<string> {
    console.log(`LLMClient: Generating ${language} code...`);
    const prompt = `Write a script in ${language} to fulfill the following requirements: ${requirements}\n\nIMPORTANT: Only output the raw code block. No explanations, no markdown wrappers like \`\`\`${language}, just the raw plain text code.`;
    
    return this.generateText(prompt, `You are an expert ${language} programmer. Output ONLY raw executable code. Do not wrap in markdown tags.`, 0.1);
  }
}
