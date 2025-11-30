import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService, type Challenge, type TestCase } from '../services/api.service';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';
import { 
  Clock, Database, Tag, ArrowLeft, Play, CheckCircle, 
  XCircle, Code, Terminal 
} from 'lucide-react';
import './ChallengeDetailPage.css';

const LANGUAGE_OPTIONS = [
  { value: 'Python', label: 'Python', monacoLang: 'python' },
  { value: 'CPlusPlus', label: 'C++', monacoLang: 'cpp' },
  { value: 'Java', label: 'Java', monacoLang: 'java' },
  { value: 'Node', label: 'Node.js', monacoLang: 'javascript' },
];

const DEFAULT_CODE: Record<string, string> = {
  Python: '# Escribe tu solución aquí\ndef solve():\n    pass\n',
  CPlusPlus: '// Escribe tu solución aquí\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n',
  Java: '// Escribe tu solución aquí\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  Node: '// Escribe tu solución aquí\nfunction solve() {\n    \n}\n',
};

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [code, setCode] = useState(DEFAULT_CODE.Python);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadChallenge(id);
      loadTestCases(id);
    }
  }, [id]);

  const loadChallenge = async (challengeId: string) => {
    try {
      setLoading(true);
      const data = await ApiService.getChallengeById(challengeId);
      setChallenge(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el challenge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTestCases = async (challengeId: string) => {
    try {
      const data = await ApiService.getTestCasesByChallengeId(challengeId);
      setTestCases(data);
    } catch (err) {
      console.error('Error al cargar test cases:', err);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user || !challenge) {
      alert('Debes iniciar sesión para enviar una solución');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setSubmissionResult(null);

    try {
      await ApiService.createSubmission({
        user: user.userId,
        challengeId: challenge.challengeId,
        lenguage: selectedLanguage,
      });

      // Simular resultado
      setSubmissionResult({
        status: 'ACCEPTED',
        message: '¡Solución aceptada! Todos los test cases pasaron.',
      });
    } catch (err) {
      setSubmissionResult({
        status: 'ERROR',
        message: 'Error al enviar la solución. Intenta de nuevo.',
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="challenge-detail-page">
        <div className="loading">Cargando challenge...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="challenge-detail-page">
        <div className="error-box">{error || 'Challenge no encontrado'}</div>
        <Link to="/challenges" className="btn-primary">
          ← Volver a challenges
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };

  const selectedLangConfig = LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage);

  return (
    <div className="challenge-detail-page">
      <div className="challenge-detail-container">
        {/* Columna izquierda: Descripción */}
        <div className="challenge-description-panel">
          <Link to="/challenges" className="back-link">
            <ArrowLeft size={20} />
            Volver a challenges
          </Link>

          <div className="challenge-header-detail">
            <h1>{challenge.title}</h1>
            <div className="challenge-meta-badges">
              <span className={`badge badge-${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="badge badge-blue">
                {challenge.state}
              </span>
            </div>
          </div>

          <div className="challenge-stats">
            <div className="stat-item">
              <Clock size={18} />
              <span>{challenge.timeLimit}ms</span>
            </div>
            <div className="stat-item">
              <Database size={18} />
              <span>{challenge.memoryLimit}MB</span>
            </div>
          </div>

          <div className="challenge-tags-section">
            {challenge.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>

          <div className="section">
            <h2>Descripción</h2>
            <p>{challenge.description}</p>
          </div>

          {testCases.length > 0 && (
            <div className="section">
              <h2>Ejemplos</h2>
              {testCases.slice(0, 3).map((testCase, idx) => (
                <div key={testCase.testCaseId} className="example-case">
                  <h3>Ejemplo {idx + 1}</h3>
                  <div className="example-io">
                    <div>
                      <strong>Entrada:</strong>
                      <pre>{testCase.input}</pre>
                    </div>
                    <div>
                      <strong>Salida:</strong>
                      <pre>{testCase.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha: Editor de código */}
        <div className="code-editor-panel">
          <div className="editor-header">
            <div className="editor-title">
              <Code size={20} />
              <span>Escribe tu solución</span>
            </div>

            <div className="language-selector">
              <label htmlFor="language">Lenguaje:</label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="monaco-editor-container">
            <Editor
              height="500px"
              language={selectedLangConfig?.monacoLang || 'python'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="editor-actions">
            <button
              onClick={handleSubmit}
              className="btn-submit"
              disabled={submitting || !isAuthenticated}
            >
              {submitting ? (
                <>
                  <Terminal className="spin" size={20} />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Enviar Solución
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="login-hint">
                Debes <Link to="/login">iniciar sesión</Link> para enviar soluciones
              </p>
            )}
          </div>

          {submissionResult && (
            <div className={`submission-result ${submissionResult.status.toLowerCase()}`}>
              {submissionResult.status === 'ACCEPTED' ? (
                <CheckCircle size={24} />
              ) : (
                <XCircle size={24} />
              )}
              <div>
                <h3>{submissionResult.status}</h3>
                <p>{submissionResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
