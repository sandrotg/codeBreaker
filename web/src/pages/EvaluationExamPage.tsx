import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { useAuth } from '../contexts/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './EvaluationExamPage.css';

interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  state: string;
}

interface EvaluationDetails {
  evaluationId: string;
  name: string;
  startAt: string;
  durationMinutes: number;
  state: string;
  expiresAt: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'Python', label: 'Python', monacoLang: 'python' },
  { value: 'CPlusPlus', label: 'C++', monacoLang: 'cpp' },
  { value: 'Java', label: 'Java', monacoLang: 'java' },
  { value: 'Node', label: 'Node.js', monacoLang: 'javascript' },
];

const DEFAULT_CODE: Record<string, string> = {
  'Python': '# Escribe tu solución aquí\ndef solve():\n    pass\n',
  'CPlusPlus': '// Escribe tu solución aquí\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n',
  'Java': '// Escribe tu solución aquí\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  'Node': '// Escribe tu solución aquí\nfunction solve() {\n    \n}\n',
};

export function EvaluationExamPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // en segundos
  const [code, setCode] = useState<string>(DEFAULT_CODE['Python']);
  const [language, setLanguage] = useState<string>('Python');
  const [submissions, setSubmissions] = useState<Map<string, { code: string; language: string }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [evaluationResultId, setEvaluationResultId] = useState<string | null>(null);
  const [submissionIdsList, setSubmissionIdsList] = useState<string[]>([]);

  useEffect(() => {
    if (id && user?.userId) {
      checkEvaluationStatus();
    }
  }, [id, user]);

  const checkEvaluationStatus = async () => {
    try {
      setLoading(true);
      
      // Verificar en la base de datos si ya existe un resultado completado
      let existingResult = null;
      try {
        existingResult = await ApiService.getResultByUserAndEvaluation(id!, user!.userId);
      } catch (resultErr: any) {
        // Si es 404, no hay resultado (esto es normal para evaluaciones no iniciadas)
        existingResult = null;
      }
      
      if (existingResult && existingResult.completedAt) {
        // Si existe y está completado en la BD, bloquear acceso
        setIsFinished(true);
        setError('Ya has finalizado esta evaluación');
        setLoading(false);
        return;
      }
      
      // Si no está completado o no existe, permitir acceso
      setIsFinished(false);
      
      // Cargar datos de la evaluación
      await loadEvaluationData();
    } catch (err) {
      console.error('Error al verificar estado de evaluación:', err);
      setError('Error al cargar la evaluación');
      setLoading(false);
    }
  };

  // Temporizador
  useEffect(() => {
    if (!hasStarted || timeRemaining <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeRemaining, isFinished]);

  const loadEvaluationData = async () => {
    try {
      setLoading(true);
      
      const evalData = await ApiService.getEvaluationById(id!);
      setEvaluation(evalData);
      
      const challengesData = await ApiService.getEvaluationChallenges(id!);
      setChallenges(challengesData);
      
      // El tiempo restante es simplemente la duración de la evaluación
      const durationSeconds = evalData.durationMinutes * 60;
      setTimeRemaining(durationSeconds);
      setError(null);
    } catch (err) {
      setError('Error al cargar la evaluación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = async () => {
    if (isFinished) {
      alert('Esta evaluación ya ha sido finalizada');
      return;
    }
    
    try {
      // Crear el resultado de evaluación al iniciar
      const result = await ApiService.createEvaluationResult({
        evaluationId: id!,
        userId: user!.userId,
        totalChallenges: challenges.length,
      });
      setEvaluationResultId(result.resultId);
      setHasStarted(true);
    } catch (err) {
      console.error('Error al crear resultado de evaluación:', err);
      alert('Error al iniciar la evaluación');
    }
  };

  const handleTimeUp = async () => {
    setIsFinished(true);
    alert('¡Tiempo agotado! La evaluación ha finalizado.');
    await submitAllSolutions();
    navigate(`/evaluations/${id}`);
  };

  const handleNextChallenge = () => {
    // Guardar código actual
    saveCurrentCode();
    
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      loadSavedCode(currentChallengeIndex + 1);
    }
  };

  const handlePreviousChallenge = () => {
    // Guardar código actual
    saveCurrentCode();
    
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
      loadSavedCode(currentChallengeIndex - 1);
    }
  };

  const saveCurrentCode = () => {
    if (challenges.length > 0) {
      const currentChallenge = challenges[currentChallengeIndex];
      const newSubmissions = new Map(submissions);
      newSubmissions.set(currentChallenge.challengeId, { code, language });
      setSubmissions(newSubmissions);
    }
  };

  const loadSavedCode = (index: number) => {
    if (challenges.length > 0) {
      const challenge = challenges[index];
      const saved = submissions.get(challenge.challengeId);
      if (saved) {
        setCode(saved.code);
        setLanguage(saved.language);
      } else {
        setCode(DEFAULT_CODE['Python']);
        setLanguage('Python');
      }
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Si no hay código guardado para este challenge, usar el template por defecto
    if (!code || code === DEFAULT_CODE[language]) {
      setCode(DEFAULT_CODE[lang] || '');
    }
  };

  const handleSubmitChallenge = async () => {
    if (!user?.userId || challenges.length === 0) return;
    
    const currentChallenge = challenges[currentChallengeIndex];
    
    try {
      const submission = await ApiService.createSubmission({
        user: user.userName,
        challengeId: currentChallenge.challengeId,
        lenguage: language
      });
      
      // Guardar el ID de la submission
      if (submission?.submissionId) {
        setSubmissionIdsList(prev => [...prev, submission.submissionId]);
      }
      
      // Actualizar submissions guardadas
      saveCurrentCode();
      
      alert('Solución enviada correctamente');
    } catch (err) {
      alert('Error al enviar la solución');
      console.error(err);
    }
  };

  const submitAllSolutions = async () => {
    // Guardar código actual primero
    saveCurrentCode();
    
    const allSubmissionIds = [...submissionIdsList];
    
    // Enviar todas las soluciones guardadas que aún no se han enviado
    for (const [challengeId, submission] of submissions.entries()) {
      try {
        const result = await ApiService.createSubmission({
          user: user!.userName,
          challengeId,
          lenguage: submission.language
        });
        
        if (result?.submissionId && !allSubmissionIds.includes(result.submissionId)) {
          allSubmissionIds.push(result.submissionId);
        }
      } catch (err) {
        console.error(`Error al enviar solución para challenge ${challengeId}:`, err);
      }
    }
    
    // Calcular score básico (porcentaje de challenges completados)
    const score = (allSubmissionIds.length / challenges.length) * 100;
    
    // Actualizar el resultado de la evaluación
    if (evaluationResultId) {
      try {
        await ApiService.updateEvaluationResult(evaluationResultId, {
          submissionIds: allSubmissionIds,
          score: score,
        });
      } catch (err) {
        console.error('Error al actualizar resultado de evaluación:', err);
      }
    }
  };

  const handleFinishEvaluation = async () => {
    if (confirm('¿Estás seguro de que quieres finalizar la evaluación?')) {
      setIsFinished(true);
      await submitAllSolutions();
      navigate(`/evaluations`);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    const totalSeconds = evaluation ? evaluation.durationMinutes * 60 : 0;
    const percentage = (timeRemaining / totalSeconds) * 100;
    
    if (percentage > 50) return 'time-good';
    if (percentage > 20) return 'time-warning';
    return 'time-danger';
  };

  if (loading) {
    return (
      <div className="evaluation-exam-page">
        <div className="loading">Cargando evaluación...</div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="evaluation-exam-page">
        <div className="completed-evaluation-screen">
          <div className="completed-icon">
            <CheckCircle size={80} />
          </div>
          <h1>Evaluación Completada</h1>
          <p className="completed-message">
            {error || 'Ya has finalizado esta evaluación. Tu trabajo ha sido registrado exitosamente.'}
          </p>
          <div className="completed-info">
            <AlertCircle size={20} />
            <span>Si crees que esto es un error, contacta con tu profesor</span>
          </div>
          <button onClick={() => navigate('/evaluations')} className="btn-back-evaluations">
            Volver a Evaluaciones
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="evaluation-exam-page">
        <div className="start-screen">
          <h1>{evaluation.name}</h1>
          <div className="evaluation-info">
            <div className="info-card">
              <Clock size={32} />
              <h3>Duración</h3>
              <p>{evaluation.durationMinutes} minutos</p>
            </div>
            <div className="info-card">
              <CheckCircle size={32} />
              <h3>Challenges</h3>
              <p>{challenges.length} problemas</p>
            </div>
            <div className="info-card">
              <AlertCircle size={32} />
              <h3>Importante</h3>
              <p>Una vez iniciado, no podrás pausar</p>
            </div>
          </div>
          <button onClick={handleStartEvaluation} className="btn-start">
            Iniciar Evaluación
          </button>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <div className="evaluation-exam-page">
      <div className="exam-header">
        <div className="exam-title">
          <h2>{evaluation.name}</h2>
          <span className="challenge-counter">
            Challenge {currentChallengeIndex + 1} de {challenges.length}
          </span>
        </div>
        <div className={`timer ${getTimeColor()}`}>
          <Clock size={24} />
          <span className="time-display">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="exam-content">
        <div className="challenge-panel">
          <div className="challenge-header">
            <h3>{currentChallenge.title}</h3>
            <span className={`difficulty-badge difficulty-${currentChallenge.difficulty.toLowerCase()}`}>
              {currentChallenge.difficulty}
            </span>
          </div>
          
          <div className="challenge-description">
            <p>{currentChallenge.description}</p>
          </div>

          <div className="challenge-details">
            <div className="detail-item">
              <strong>Límite de tiempo:</strong> {currentChallenge.timeLimit}ms
            </div>
            <div className="detail-item">
              <strong>Límite de memoria:</strong> {currentChallenge.memoryLimit}MB
            </div>
          </div>

          {currentChallenge.tags && currentChallenge.tags.length > 0 && (
            <div className="challenge-tags">
              {currentChallenge.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="code-panel">
          <div className="code-header">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button onClick={handleSubmitChallenge} className="btn-submit">
              Enviar Solución
            </button>
          </div>
          
          <div className="monaco-editor-container">
            <Editor
              height="500px"
              language={LANGUAGE_OPTIONS.find(l => l.value === language)?.monacoLang || 'python'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>

      <div className="exam-footer">
        <button 
          onClick={handlePreviousChallenge} 
          disabled={currentChallengeIndex === 0}
          className="btn-nav"
        >
          <ChevronLeft size={20} />
          Anterior
        </button>

        <div className="challenge-indicators">
          {challenges.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                saveCurrentCode();
                setCurrentChallengeIndex(index);
                loadSavedCode(index);
              }}
              className={`challenge-indicator ${index === currentChallengeIndex ? 'active' : ''} ${
                submissions.has(challenges[index].challengeId) ? 'completed' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="footer-actions">
          <button 
            onClick={handleNextChallenge} 
            disabled={currentChallengeIndex === challenges.length - 1}
            className="btn-nav"
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
          <button onClick={handleFinishEvaluation} className="btn-finish">
            Finalizar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
}
