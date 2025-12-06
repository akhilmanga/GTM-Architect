export enum Domain {
  WEB3 = 'Web3 / Blockchain',
  WEB2 = 'Web2 / AI',
}

export interface Web3Inputs {
  projectName: string;
  description: string;
  targetChains: string;
  firstUser: string;
  tokenStrategy: string[]; // Utility, TGE, Airdrop
  pitchDeck: string;
  competitors: string;
}

export interface Web2Inputs {
  projectName: string;
  description: string;
  pricingModel: string[]; // Free tier, Usage-based, Enterprise
  firstCustomer: string;
  techEdge: string;
  pitchDeck: string;
  competitors: string;
}

export type FormData = Web3Inputs | Web2Inputs;

export interface ChannelStrategy {
  name: string;
  samplePost: string;
}

export interface TacticalPartner {
  name: string;
  outreach: string;
}

export interface ActionItem {
  title: string;
  channels: ChannelStrategy[];
  resources: string; // Budget, team, tools
}

export interface QuarterPlan {
  quarterName: string; // e.g., "Q1"
  focus: string; // Main theme
  actions: ActionItem[];
  partners: TacticalPartner[];
  successMetric: {
    name: string;
    target: string;
  };
}

export interface StrategicPartner {
  target: string;
  leverage: string;
}

export interface ContentPillar {
  platform: string;
  pillars: string[]; // e.g. "Educational", "Meme"
  hooks: string[]; // e.g. "Did you know...", "Thread 🧵"
}

export interface CompetitorAnalysis {
  competitorName: string;
  weakness: string;
  ourWedge: string;
}

export interface GTMPlan {
  mvcc: string;
  primaryMotion: string;
  domain: string;
  roadmap: QuarterPlan[];
  strategicPartnerships: StrategicPartner[]; // High level "Why"
  contentPlan: ContentPillar[];
  competitorAnalysis: CompetitorAnalysis[];
}

export interface ContentDraft {
  style: string;
  content: string;
}

export enum AppState {
  LANDING,
  INTAKE,
  LOADING,
  DASHBOARD,
}