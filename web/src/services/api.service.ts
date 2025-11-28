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
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  description: string;
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

export interface Course {
  courseId: string;
  title: string;
  nrc: number;
  period: string;
  group: number;
  users?: User[];
  challenges?: Challenge[];
}

export interface User {
  userId: string;
  userName: string;
  email: string;
  passwordHash: string;
  roleId: string;
  createdAt: Date;
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
    const response = await fetch(`${API_URL}/challenge/list`);
    if (!response.ok) throw new Error('Error al obtener challenges');
    return response.json();
  }

  static async getChallengeById(id: string): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenge/find/${id}`);
    if (!response.ok) throw new Error('Error al obtener challenge');
    return response.json();
  }

  static async createChallenge(challenge: CreateChallengeDto): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenge/create`, {
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
    const response = await fetch(`${API_URL}/challenge/update/${id}`, {
      method: 'PUT',
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

  static async publishChallenge(id: string): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenge/publish/${id}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Error al publicar el challenge');
    }
    return response.json();
  }

  static async deleteChallenge(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/challenge/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el challenge');
    }
  }

  // ============ Test Cases ============
  static async getTestCasesByChallengeId(challengeId: string): Promise<TestCase[]> {
    const response = await fetch(`${API_URL}/challenge/${challengeId}/testcases`);
    if (!response.ok) throw new Error('Error al obtener test cases');
    return response.json();
  }

  static async createTestCase(testCase: Omit<TestCase, 'testCaseId'>): Promise<TestCase> {
    const response = await fetch(`${API_URL}/testcase/create`, {
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
    const response = await fetch(`${API_URL}/testcase/delete/${id}`, {
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

  // Cursos
  static async createCourse(courseData: {
    creatorEmail: string;
    title: string;
    nrc: number;
    period: string;
    group: number;
  }): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Error al crear curso');
    return response.json();
  }

  static async addUsersToCourse(nrc: number, usersData: { userEmails: string[] }): Promise<void> {
    const response = await fetch(`${API_URL}/courses/add-users/${nrc}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersData),
    });
    if (!response.ok) throw new Error('Error al agregar usuarios al curso');
  }

  static async addChallengeToCourse(nrc: number, challengeId: string): Promise<void> {
    const response = await fetch(`${API_URL}/courses/add-challenges/${nrc}/${challengeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al agregar challenge al curso');
  }

  static async getCourseChallenges(nrc: number): Promise<Challenge[]> {
    const response = await fetch(`${API_URL}/courses/challenges/${nrc}`);
    if (!response.ok) throw new Error('Error al obtener challenges del curso');
    return response.json();
  }

  static async getCourseUsers(nrc: number): Promise<User[]> {
    const response = await fetch(`${API_URL}/courses/users/${nrc}`);
    if (!response.ok) throw new Error('Error al obtener usuarios del curso');
    return response.json();
  }

  static async getCourseByNrc(nrc: number): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${nrc}`);
    if (!response.ok) throw new Error('Error al obtener curso');
    return response.json();
  }

  static async getCourseByTitle(title: string): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${title}`);
    if (!response.ok) throw new Error('Error al obtener curso');
    return response.json();
  }

  static async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Error al obtener cursos');
    return response.json();
  }

  //////////////////////////////////////////////////////////EVALUATIONS//////////////////////////////////////////////////////////

  static async createEvaluation(evaluationData: {
    name: string;
    startAt: string;
    duration: number;
    challengeIds: string[];
  }): Promise<any> {
    const response = await fetch(`${API_URL}/evaluation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) throw new Error('Error al crear evaluación');
    return response.json();
  }

  // En tu ApiService
  static async getEvaluations(): Promise<any[]> {
    const response = await fetch(`${API_URL}/evaluations`);
    if (!response.ok) throw new Error('Error al obtener evaluaciones');
    return response.json();
  }
}
