export class ChallengeExample {
  input: string;
  output: string;
}

export class ChallengeResponse {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  examples: ChallengeExample[];
  reviewedBy?: 'ollama' | 'human_required';
}
