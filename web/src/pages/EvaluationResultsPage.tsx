import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { ArrowLeft, User, CheckCircle, Award, RotateCcw } from 'lucide-react';
import './EvaluationResultsPage.css';

interface EvaluationResult {
  resultId: string;
  evaluationId: string;
  userId: string;
  submissionIds: string[];
  score: number | null;
  totalChallenges: number;
  startedAt: string;
  completedAt: string | null;
}

interface Evaluation {
  evaluationId: string;
  name: string;
  startAt: string;
  durationMinutes: number;
  state: string;
}

export function EvaluationResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [evalData, resultsData] = await Promise.all([
        ApiService.getEvaluationById(id!),
        ApiService.getResultsByEvaluation(id!)
      ]);
      
      setEvaluation(evalData);
      setResults(resultsData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los resultados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetResult = async (resultId: string) => {
    if (!window.confirm('\u00bfEst\u00e1s seguro de que quieres resetear este resultado? El estudiante podr\u00e1 volver a realizar la evaluaci\u00f3n.')) {
      return;
    }

    try {
      await ApiService.deleteEvaluationResult(resultId);
      
      // Recargar los datos
      await loadData();
      
      alert('Resultado reseteado exitosamente. El estudiante puede volver a realizar la evaluaci\u00f3n. La pr\u00f3xima vez que acceda, se limpiar\u00e1 autom\u00e1ticamente su sesi\u00f3n anterior.');
    } catch (err) {
      console.error('Error al resetear resultado:', err);
      alert('Error al resetear el resultado');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (result: EvaluationResult) => {
    if (result.completedAt) {
      return <span className="status-badge completed">Completada</span>;
    }
    return <span className="status-badge in-progress">En progreso</span>;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return '';
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  };

  const calculateStats = () => {
    const completed = results.filter(r => r.completedAt).length;
    const inProgress = results.length - completed;
    const avgScore = results.filter(r => r.score !== null).length > 0
      ? results.filter(r => r.score !== null).reduce((sum, r) => sum + (r.score || 0), 0) / results.filter(r => r.score !== null).length
      : 0;

    return { completed, inProgress, avgScore };
  };

  if (loading) {
    return (
      <div className="evaluation-results-page">
        <div className="loading">Cargando resultados...</div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="evaluation-results-page">
        <div className="error-box">{error || 'Evaluación no encontrada'}</div>
        <button onClick={() => navigate('/evaluations')} className="btn-secondary">
          <ArrowLeft size={18} />
          Volver a Evaluaciones
        </button>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="evaluation-results-page">
      <div className="page-header">
        <button onClick={() => navigate('/evaluations')} className="btn-back">
          <ArrowLeft size={20} />
          Volver
        </button>
        <div>
          <h1>Resultados: {evaluation.name}</h1>
          <p className="evaluation-date">
            Iniciada el {formatDate(evaluation.startAt)}
          </p>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon participants">
            <User size={32} />
          </div>
          <div className="stat-info">
            <h3>{results.length}</h3>
            <p>Participantes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completadas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon in-progress">
            <Award size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.avgScore.toFixed(1)}%</h3>
            <p>Promedio</p>
          </div>
        </div>
      </div>

      <div className="results-table-container">
        <h2>Resultados por Estudiante</h2>
        
        {results.length === 0 ? (
          <div className="no-results">
            <User size={64} />
            <h3>No hay resultados</h3>
            <p>Ningún estudiante ha iniciado esta evaluación todavía.</p>
          </div>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Usuario ID</th>
                <th>Fecha Inicio</th>
                <th>Fecha Finalización</th>
                <th>Challenges</th>
                <th>Submissions</th>
                <th>Puntaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.resultId}>
                  <td className="user-id">{result.userId}</td>
                  <td>{formatDate(result.startedAt)}</td>
                  <td>
                    {result.completedAt 
                      ? formatDate(result.completedAt) 
                      : <span className="text-muted">-</span>
                    }
                  </td>
                  <td>{result.totalChallenges}</td>
                  <td>{result.submissionIds.length}</td>
                  <td>
                    {result.score !== null ? (
                      <span className={`score-badge ${getScoreColor(result.score)}`}>
                        {result.score.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>{getStatusBadge(result)}</td>
                  <td>
                    {result.completedAt && (
                      <button
                        onClick={() => handleResetResult(result.resultId)}
                        className="btn-reset"
                        title="Resetear evaluación"
                      >
                        <RotateCcw size={16} />
                        Resetear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
