// Tipos compartidos con el backend
export interface ChallengeExample {
  input: string;
  output: string;
}

export interface ChallengeResponse {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  examples: ChallengeExample[];
  reviewedBy?: 'ollama' | 'human_required';
}

export interface ChallengeEditorProps {
  challengeId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number; 
  memoryLimit: number;
  state: ChallengeState;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ChallengeState = 'Draft' | 'Published' | 'Archived';

export interface CreateChallengeDto {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  state: ChallengeState;
}

export interface TestCase {
  input: string;
  output: string;
}
