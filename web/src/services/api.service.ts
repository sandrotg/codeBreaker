import type { 
  ChallengeResponse, 
  CreateChallengeDto, 
  Difficulty,
  ChallengeState 
} from '../types/challenge.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  inputDescription: string;
  outputDescription: string;
  state: ChallengeState;
}

export interface TestCase {
  testCaseId: string;
  challengeId: string;
  input: string;
  output: string;
}

export interface Submission {
  submissionId: string;
  user: string;
  challengeId: string;
  language: string;
  status: string;
  createdAt: string;
  score?: number;
  timeMsTotal?: number;
}

export class ApiService {
  // ============ AI Challenges ============
  static async generateChallenge(theme: string): Promise<ChallengeResponse> {
    const response = await fetch(`${API_URL}/ai-challenges/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      throw new Error('Error al generar el challenge');
    }

    return response.json();
  }

  // ============ Challenges CRUD ============
  static async getChallenges(): Promise<Challenge[]> {
    const response = await fetch(`${API_URL}/challenges`);
    if (!response.ok) throw new Error('Error al obtener challenges');
    return response.json();
  }

  static async getChallengeById(id: string): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenges/${id}`);
    if (!response.ok) throw new Error('Error al obtener challenge');
    return response.json();
  }

  static async createChallenge(challenge: CreateChallengeDto): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(challenge),
    });

    if (!response.ok) {
      throw new Error('Error al crear el challenge');
    }

    return response.json();
  }

  static async updateChallenge(id: string, challenge: Partial<CreateChallengeDto>): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenges/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(challenge),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el challenge');
    }

    return response.json();
  }

  static async deleteChallenge(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/challenges/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el challenge');
    }
  }

  // ============ Test Cases ============
  static async getTestCasesByChallengeId(challengeId: string): Promise<TestCase[]> {
    const response = await fetch(`${API_URL}/test-cases/challenge/${challengeId}`);
    if (!response.ok) throw new Error('Error al obtener test cases');
    return response.json();
  }

  static async createTestCase(testCase: Omit<TestCase, 'testCaseId'>): Promise<TestCase> {
    const response = await fetch(`${API_URL}/test-cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase),
    });

    if (!response.ok) {
      throw new Error('Error al crear test case');
    }

    return response.json();
  }

  static async deleteTestCase(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/test-cases/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar test case');
    }
  }

  // ============ Submissions ============
  static async createSubmission(submission: {
    user: string;
    challengeId: string;
    language: string;
  }): Promise<Submission> {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      throw new Error('Error al crear submission');
    }

    return response.json();
  }
}
