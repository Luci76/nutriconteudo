
export type ContentGoal = 'atração' | 'autoridade' | 'conversão';
export type ContentType = 'post único' | 'carrossel' | 'reel' | 'ideia de stories';
export type CommunicationTone = 'profissional' | 'acolhedor' | 'direto';

export interface PostInput {
  niche: string;
  targetAudience: string;
  goal: ContentGoal;
  contentType: ContentType;
  tone: CommunicationTone;
}

export interface GeneratedPost {
  id: string;
  timestamp: number;
  input: PostInput;
  title: string;
  type: string;
  structure: string;
  legend: string;
  cta: string;
}
