import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Domain, FormData, GTMPlan, QuarterPlan, Web3Inputs, Web2Inputs, ContentDraft } from "../types";

const SYSTEM_INSTRUCTION = `
You are a Tier-1 Go-To-Market Strategist (a16z meets Notion).
Your goal is to build a "Founder-Ready, Execution-Grade" GTM playbook.

CRITICAL INSTRUCTIONS:
1. DO NOT SUMMARIZE OR GENERALIZE. Be specific, actionable, and battle-tested.
2. MVCC Framework: Define the Minimum Viable Customer Category hyper-specifically (e.g., "DeFi degens on Arbitrum bridging >$10k" or "Series A DevTools founders").
3. For each Quarter:
   - Provide 3 CONCRETE, TIME-BOUND actions (e.g., "Launch Galxe quest targeting...", "Publish 'vs Competitor' technical deep dive").
   - EXACT CHANNELS with 1 SAMPLE POST idea per channel.
   - 1-2 TACTICAL PARTNER TARGETS per quarter with a 2-line COLD OUTREACH message.
   - A clear SUCCESS METRIC with a NUMERIC TARGET.
   - REQUIRED RESOURCES (Budget, Team, Tools).
4. Competitor Analysis: Identify 2-3 key competitors (or category equivalents) and provide a "How to Kill" battle card:
   - Their Weakness (Product or GTM).
   - Your Wedge (How you steal their users).
5. Content Plan: Provide specific Content Pillars and Engagement Hooks per platform.

Domain Nuances:
- Web3: Focus on TVL, wallets, on-chain data, governance, Discord/Telegram/X.
- Web2/AI: Focus on ARR, seats, API calls, LinkedIn/X/Dev.to.
`;

const ACTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Concrete, time-bound action" },
    channels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "e.g., X, LinkedIn, Discord" },
          samplePost: { type: Type.STRING, description: "Actual draft text for a post/thread" },
        },
        required: ["name", "samplePost"],
      },
    },
    resources: { type: Type.STRING, description: "Budget ($), Team (Roles), Tools" },
  },
  required: ["title", "channels", "resources"],
};

const QUARTER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    quarterName: { type: Type.STRING, description: "e.g., Q1" },
    focus: { type: Type.STRING, description: "Main theme (e.g., 'Liquidity Bootstrap')" },
    successMetric: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        target: { type: Type.STRING },
      },
      required: ["name", "target"],
    },
    actions: {
      type: Type.ARRAY,
      items: ACTION_SCHEMA,
    },
    partners: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          outreach: { type: Type.STRING, description: "2-line cold outreach template" },
        },
        required: ["name", "outreach"],
      },
    },
  },
  required: ["quarterName", "focus", "successMetric", "actions", "partners"],
};

const PLAN_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    mvcc: { type: Type.STRING, description: "Specific Minimum Viable Customer Category" },
    primaryMotion: { type: Type.STRING, description: "One of the 5 GTM motions" },
    domain: { type: Type.STRING, description: "The selected domain" },
    roadmap: {
      type: Type.ARRAY,
      items: QUARTER_SCHEMA,
    },
    competitorAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          competitorName: { type: Type.STRING },
          weakness: { type: Type.STRING, description: "Critical weakness in product or GTM" },
          ourWedge: { type: Type.STRING, description: "Specific angle to win their users" },
        },
        required: ["competitorName", "weakness", "ourWedge"],
      },
    },
    strategicPartnerships: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          target: { type: Type.STRING, description: "High-potential partner name" },
          leverage: { type: Type.STRING, description: "Why they would partner (your leverage)" },
        },
        required: ["target", "leverage"],
      },
    },
    contentPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          pillars: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 Content themes" },
          hooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 Opening lines/styles" },
        },
        required: ["platform", "pillars", "hooks"],
      },
    },
  },
  required: ["mvcc", "primaryMotion", "domain", "roadmap", "competitorAnalysis", "strategicPartnerships", "contentPlan"],
};

export const generateGTMPlan = async (domain: Domain, data: FormData): Promise<GTMPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let promptContext = "";
  
  if (domain === Domain.WEB3) {
    const d = data as Web3Inputs;
    promptContext = `
    Domain: Web3 / Blockchain
    Project: ${d.projectName}
    Description: ${d.description}
    Target Chain: ${d.targetChains}
    First User: ${d.firstUser}
    Token Strategy: ${d.tokenStrategy.join(', ')}
    Competitors: ${d.competitors}
    Pitch Deck Notes: ${d.pitchDeck}
    `;
  } else {
    const d = data as Web2Inputs;
    promptContext = `
    Domain: Web2 / AI
    Project: ${d.projectName}
    Description: ${d.description}
    Pricing Model: ${d.pricingModel.join(', ')}
    First Customer: ${d.firstCustomer}
    Tech Edge: ${d.techEdge}
    Competitors: ${d.competitors}
    Pitch Deck Notes: ${d.pitchDeck}
    `;
  }

  const prompt = `
  Generate a DEEP, EXECUTION-GRADE GTM Playbook.
  ${promptContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: PLAN_SCHEMA,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GTMPlan;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("GTM Generation Error:", error);
    throw error;
  }
};

export const regenerateQuarter = async (
  domain: Domain, 
  data: FormData, 
  currentPlan: GTMPlan, 
  quarterIndex: number
): Promise<QuarterPlan> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const quarterName = currentPlan.roadmap[quarterIndex].quarterName;

    const prompt = `
    REGENERATE the GTM plan for ${quarterName} ONLY.
    Project: ${JSON.stringify(data)}
    Current MVCC: ${currentPlan.mvcc}
    
    Provide a FRESH, execution-grade plan for ${quarterName} with:
    - 3 New concrete Actions
    - Specific channels + sample posts
    - Tactical partners + outreach scripts
    - Metrics + Resources
    `;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: QUARTER_SCHEMA,
          },
        });
    
        if (response.text) {
          return JSON.parse(response.text) as QuarterPlan;
        }
        throw new Error("No response text generated");
      } catch (error) {
        console.error("Quarter Regeneration Error:", error);
        throw error;
      }
};

export const generatePostDrafts = async (action: string, platform: string, projectContext: FormData): Promise<ContentDraft[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
    Draft 3 distinct social media posts for ${platform} based on this action: "${action}".
    Project Context: ${JSON.stringify(projectContext)}
    
    Styles:
    1. Viral / Hook-heavy (Short, punchy, clicky)
    2. Professional / Value-add (Thought leadership, educational)
    3. Storytelling / Behind-the-scenes (Authentic, narrative)
    `;

    const DRAFT_SCHEMA: Schema = {
        type: Type.OBJECT,
        properties: {
            variations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        style: { type: Type.STRING },
                        content: { type: Type.STRING }
                    },
                    required: ["style", "content"]
                }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: DRAFT_SCHEMA,
            }
        });

        if (response.text) {
            return JSON.parse(response.text).variations as ContentDraft[];
        }
        return [];
    } catch (error) {
        console.error("Draft Generation Error:", error);
        return [];
    }
};

export const startPersonaChat = async (plan: GTMPlan, data: FormData) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `
      ROLE PLAY INSTRUCTION:
      You are NOT an AI assistant. You are a human being who fits this specific persona: "${plan.mvcc}".
      
      CONTEXT:
      - You are browsing the internet or sitting in a meeting.
      - A founder is trying to pitch you this project: ${data.projectName}
      - Project Description: ${data.description}
      
      YOUR MENTALITY:
      - You are busy, skeptical, and have a problem that needs solving.
      - You are evaluating the founder's pitch based on 7 key signals (The "Perfect Pitch Flow"):
        1. Empathy (Do they get my pain?)
        2. Problem Definition (Is it my actual problem?)
        3. Clear Solution/One-Liner (Do I understand what it is?)
        4. Concrete Example (Can I visualize it?)
        5. Market Fit (Is it for me?)
        6. Traction/Social Proof (Do others trust it?)
        7. Clear Ask (What do they want?)
      
      SCORING RULES (Resonance Score 0-100):
      - Start at 15.
      - If they hit a signal clearly, BOOST score by +15.
      - If they are vague, generic, or salesy, DECREASE score by -10.
      - If the score reaches 90, you are "SOLD". Explicitly state that you want to try it/buy it and end the roleplay positively.
      
      OUTPUT FORMAT:
      - Respond naturally as the human persona. Short, conversational texts (1-3 sentences max).
      - At the VERY END of every message, append the hidden score tag: <<SCORE: [current_score]>>
      - If Score >= 90 (or you are convinced), append <<VALIDATED>> after the score.
      
      GOAL:
      Help the founder practice this 7-step flow. If they convince you, they win.
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemPrompt,
        }
    });

    const initResponse = await chat.sendMessage({
        message: "The founder has just walked up to you (or DM'd you). Say your opening line based on your persona. Be skeptical. Append <<SCORE: 15>>"
    });

    return { chat, initialMessage: initResponse.text };
}