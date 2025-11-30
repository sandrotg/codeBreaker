import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { Calendar, Clock, ArrowLeft, List, Eye } from 'lucide-react';
import './EvaluationDetailPage.css';

interface EvaluationDetails {
  evaluationId: string;
  name: string;
  startAt: string;
  durationMinutes: number;
  state: string;
  expiresAt: string;
}

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

export function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEvaluationDetails();
    }
  }, [id]);

  const loadEvaluationDetails = async () => {
    try {
      setLoading(true);
      const evalData = await ApiService.getEvaluationById(id!);
      setEvaluation(evalData);
      
      const challengesData = await ApiService.getEvaluationChallenges(id!);
      setChallenges(challengesData);
      
      setError(null);
    } catch (err) {
      setError('Error al cargar los detalles de la evaluación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="evaluation-detail-page">
        <div className="loading">Cargando detalles de la evaluación...</div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="evaluation-detail-page">
        <div className="error-box">{error || 'Evaluación no encontrada'}</div>
        <button onClick={() => navigate('/evaluations')} className="btn-secondary">
          <ArrowLeft size={18} />
          Volver a Evaluaciones
        </button>
      </div>
    );
  }

  return (
    <div className="evaluation-detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/evaluations')} className="btn-back">
          <ArrowLeft size={20} />
          Volver
        </button>
        <h1>{evaluation.name}</h1>
      </div>

      <div className="evaluation-info-card">
        <div className="info-grid">
          <div className="info-item">
            <Calendar size={20} />
            <div>
              <label>Fecha de Inicio</label>
              <p>{formatDate(evaluation.startAt)}</p>
            </div>
          </div>

          <div className="info-item">
            <Clock size={20} />
            <div>
              <label>Duración</label>
              <p>{evaluation.durationMinutes} minutos</p>
            </div>
          </div>

          <div className="info-item">
            <Calendar size={20} />
            <div>
              <label>Expira el</label>
              <p>{formatDate(evaluation.expiresAt)}</p>
            </div>
          </div>

          <div className="info-item">
            <div>
              <label>Estado</label>
              <div className={`status-badge-large ${evaluation.state === 'Active' ? 'status-active' : 'status-inactive'}`}>
                {evaluation.state === 'Active' ? 'Activa' : 'Inactiva'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="challenges-section">
        <h2>
          <List size={24} />
          Challenges de la Evaluación
        </h2>
        
        {challenges.length === 0 ? (
          <div className="no-challenges">
            <p>No hay challenges asignados a esta evaluación</p>
          </div>
        ) : (
          <div className="challenges-list">
            {challenges.map((challenge) => (
              <div key={challenge.challengeId} className="challenge-item">
                <div className="challenge-content">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <div className="challenge-meta">
                    <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                      {challenge.difficulty}
                    </span>
                    <span>{challenge.timeLimit}ms</span>
                    <span>{challenge.memoryLimit}MB</span>
                  </div>
                </div>
                <div className="challenge-actions">
                  <Link
                    to={`/challenges/${challenge.challengeId}`}
                    className="btn-view-challenge"
                    title="Ver detalles del challenge"
                  >
                    <Eye size={18} />
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
