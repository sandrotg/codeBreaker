import type {
  ChallengeResponse,
  CreateChallengeDto,
  Difficulty,
  ChallengeState
} from '../types/challenge.types';
import { cookieUtils } from '../utils/cookies';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para obtener headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = cookieUtils.get('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

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

export interface Evaluation {
  evaluationId: string;
  name: string;
  startAt: Date;
  duration: number;
  state: string;
  createdAt: Date;
}

export interface EvaluationDetails {
  evaluationId: string;
  name: string;
  startAt: string;
  durationMinutes: number;
  state: string;
  expiresAt: string;
}

export class ApiService {
  // ============ AI Challenges ============
  static async generateChallenge(theme: string): Promise<ChallengeResponse> {
    const response = await fetch(`${API_URL}/ai-challenges/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      throw new Error('Error al generar el challenge');
    }

    return response.json();
  }

  // ============ Challenges CRUD ============
  static async getChallenges(): Promise<Challenge[]> {
    const response = await fetch(`${API_URL}/challenge/list`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener challenges');
    return response.json();
  }

  static async getChallengeById(id: string): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenge/find/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener challenge');
    return response.json();
  }

  static async createChallenge(challenge: CreateChallengeDto): Promise<Challenge> {
    const response = await fetch(`${API_URL}/challenge/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al publicar el challenge');
    }
    return response.json();
  }

  static async deleteChallenge(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/challenge/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el challenge');
    }
  }

  // ============ Test Cases ============
  static async getTestCasesByChallengeId(challengeId: string): Promise<TestCase[]> {
    const response = await fetch(`${API_URL}/challenge/${challengeId}/testcases`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener test cases');
    return response.json();
  }

  static async createTestCase(testCase: Omit<TestCase, 'testCaseId'>): Promise<TestCase> {
    const response = await fetch(`${API_URL}/testcase/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar test case');
    }
  }

  // ============ Submissions ============
  static async createSubmission(submission: {
    user: string;
    challengeId: string;
    lenguage: string;
  }): Promise<Submission> {
    console.log('Submitting:', submission);
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      throw new Error('Error al crear submission');
    }

    return response.json();
  }

  // ============ Courses ============
  static async createCourse(courseData: {
    creatorEmail: string;
    title: string;
    nrc: number;
    period: string;
    group: number;
  }): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Error al crear curso');
    return response.json();
  }

  static async addUsersToCourse(nrc: number, usersData: { userEmails: string[] }): Promise<void> {
    const response = await fetch(`${API_URL}/courses/add-users/${nrc}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(usersData),
    });
    if (!response.ok) throw new Error('Error al agregar usuarios al curso');
  }

  static async addChallengeToCourse(nrc: number, challengeId: string): Promise<void> {
    const response = await fetch(`${API_URL}/courses/add-challenges/${nrc}/${challengeId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al agregar challenge al curso');
  }

  static async getCourseChallenges(nrc: number): Promise<Challenge[]> {
    const response = await fetch(`${API_URL}/courses/challenges/${nrc}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener challenges del curso');
    return response.json();
  }

  static async getCourseUsers(nrc: number): Promise<User[]> {
    const response = await fetch(`${API_URL}/courses/users/${nrc}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuarios del curso');
    return response.json();
  }

  static async getCourseByNrc(nrc: number): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${nrc}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener curso');
    return response.json();
  }

  static async getCourseByTitle(title: string): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${title}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener curso');
    return response.json();
  }

  static async getCourseEvaluations(nrc: number): Promise<Evaluation[]> {
    const response = await fetch(`${API_URL}/courses/evaluations/${nrc}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener evaluaciones del curso');
    return response.json();
  }

  static async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/courses`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener cursos');
    return response.json();
  }

  static async getCoursesByStudent(userId: string): Promise<Course[]> {
    const response = await fetch(`${API_URL}/users/${userId}/cursosdeunusuario`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener cursos del estudiante');
    return response.json();
  }

  // ============ Authentication ============
  static async login(email: string, password: string): Promise<{ user: User; token: { accessToken: string; refreshToken: string } }> {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al iniciar sesión');
    }
    return response.json();
  }

  static async register(userName: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },// student
      body: JSON.stringify({ userName, email, password, roleId: '597b2e7f-b95b-4ea3-95ff-15b61d64ce86' }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al registrar usuario');
    }
    return response.json();
  }

  // ============ Evaluations ============

  static async createEvaluation(evaluationData: {
    name: string;
    startAt: string;
    duration: number;
    challengeIds: string[];
    courseIds: string[];
  }): Promise<Evaluation> {
    const response = await fetch(`${API_URL}/evaluation/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) throw new Error('Error al crear evaluación');
    return response.json();
  }

  static async getEvaluations(): Promise<Evaluation[]> {
    const response = await fetch(`${API_URL}/evaluation`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener evaluaciones');
    return response.json();
  }

  static async getEvaluationById(id: string): Promise<EvaluationDetails> {
    const response = await fetch(`${API_URL}/evaluation/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener evaluación');
    return response.json();
  }

  static async getEvaluationChallenges(id: string): Promise<Challenge[]> {
    const response = await fetch(`${API_URL}/evaluation/challenges/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener challenges de la evaluación');
    return response.json();
  }

  static async deleteEvaluation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/evaluation/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar evaluación');
  }

  static async activateEvaluation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/evaluation/activate/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al activar evaluación');
  }

  static async deactivateEvaluation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/evaluation/deactivate/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al desactivar evaluación');
  }

  static async getActiveEvaluationsByStudent(userId: string): Promise<Evaluation[]> {
    const response = await fetch(`${API_URL}/evaluation/student/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener evaluaciones del estudiante');
    return response.json();
  }

  // Evaluation Results
  static async createEvaluationResult(data: {
    evaluationId: string;
    userId: string;
    totalChallenges: number;
  }): Promise<any> {
    const response = await fetch(`${API_URL}/evaluation/results`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear resultado de evaluación');
    return response.json();
  }

  static async updateEvaluationResult(
    resultId: string,
    data: { submissionIds: string[]; score: number }
  ): Promise<any> {
    const response = await fetch(`${API_URL}/evaluation/results/${resultId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar resultado de evaluación');
    return response.json();
  }

  static async getResultsByEvaluation(evaluationId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/evaluation/results/${evaluationId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener resultados de evaluación');
    return response.json();
  }

  static async getResultByUserAndEvaluation(
    evaluationId: string,
    userId: string
  ): Promise<any> {
    const response = await fetch(`${API_URL}/evaluation/results/${evaluationId}/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener resultado del estudiante');
    return response.json();
  }

  static async deleteEvaluationResult(resultId: string): Promise<void> {
    const response = await fetch(`${API_URL}/evaluation/results/${resultId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al resetear resultado de evaluación');
  }
}
