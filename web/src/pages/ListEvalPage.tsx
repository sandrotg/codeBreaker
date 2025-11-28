import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { ApiService } from '../services/api.service';
import { Plus, Calendar, Clock, Users, Eye, Edit, Trash2 } from 'lucide-react';
import './ListEvalPage.css';

interface Evaluation {
  evaluationId: string;
  name: string;
  startAt: string;
  duration: number;
  challengeIds: string[];
  challenges?: Challenge[];
}

interface Challenge {
  challengeId: string;
  title: string;
  difficulty: string;
}

export function EvaluationsListPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      // TODO: Implementar endpoint para obtener evaluaciones
      // const data = await ApiService.getEvaluations();
      
      // Datos de ejemplo por ahora
      const exampleEvaluations: Evaluation[] = [
        {
          evaluationId: '1',
          name: 'Parcial 1 - Estructuras de Datos',
          startAt: '15 de octubre, 10:00 a.m.',
          duration: 120,
          challengeIds: ['1', '2'],
          challenges: [
            { challengeId: '1', title: 'Suma de Arrays', difficulty: 'Easy' },
            { challengeId: '2', title: 'Ordenamiento Avanzado', difficulty: 'Medium' }
          ]
        },
        {
          evaluationId: '2',
          name: 'Quiz Semanal - Algoritmos',
          startAt: '20 de octubre, 2:00 p.m.',
          duration: 60,
          challengeIds: ['3'],
          challenges: [
            { challengeId: '3', title: 'Búsqueda Binaria', difficulty: 'Easy' }
          ]
        }
      ];
      
      setEvaluations(exampleEvaluations);
      setError(null);
    } catch (err) {
      setError('Error al cargar las evaluaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (evaluationId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta evaluación?')) return;

    try {
      // TODO: Implementar endpoint para eliminar evaluación
      // await ApiService.deleteEvaluation(evaluationId);
      setEvaluations(evaluations.filter(e => e.evaluationId !== evaluationId));
    } catch (err) {
      alert('Error al eliminar la evaluación');
      console.error(err);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutos`;
  };

  const getChallengeCount = (evaluation: Evaluation) => {
    return evaluation.challenges?.length || evaluation.challengeIds.length;
  };

  if (loading) {
    return (
      <div className="evaluations-list-page">
        <div className="loading">Cargando evaluaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluations-list-page">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  return (
    <div className="evaluations-list-page">
      <div className="page-header">
        <h1>Evaluaciones</h1>
        <Link to="/evaluations/create" className="btn-primary">
          <Plus size={18} />
          Nueva Evaluación
        </Link>
      </div>

      <div className="evaluations-count">
        {evaluations.length} evaluación{evaluations.length !== 1 ? 'es' : ''} encontrada{evaluations.length !== 1 ? 's' : ''}
      </div>

      <div className="evaluations-grid">
        {evaluations.map((evaluation) => (
          <div key={evaluation.evaluationId} className="evaluation-card">
            <div className="evaluation-header">
              <h3>{evaluation.name}</h3>
              <div className="evaluation-actions">
                <button className="btn-icon" title="Ver detalles">
                  <Eye size={18} />
                </button>
                <button className="btn-icon" title="Editar">
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(evaluation.evaluationId)}
                  className="btn-icon btn-danger"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="evaluation-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{evaluation.startAt}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{formatDuration(evaluation.duration)}</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{getChallengeCount(evaluation)} challenge{getChallengeCount(evaluation) !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {evaluation.challenges && evaluation.challenges.length > 0 && (
              <div className="evaluation-challenges">
                <h4>Challenges incluidos:</h4>
                <div className="challenges-list">
                  {evaluation.challenges.map((challenge) => (
                    <div key={challenge.challengeId} className="challenge-item">
                      <span className="challenge-title">{challenge.title}</span>
                      <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="evaluation-footer">
              <span className="evaluation-id">ID: {evaluation.evaluationId}</span>
              <div className="status-badge status-active">
                Activa
              </div>
            </div>
          </div>
        ))}
      </div>

      {evaluations.length === 0 && (
        <div className="empty-state">
          <Calendar size={64} />
          <h3>No hay evaluaciones creadas</h3>
          <p>Crea tu primera evaluación para comenzar a gestionar tus tests.</p>
          <Link to="/evaluations/create" className="btn-primary">
            <Plus size={18} />
            Crear Primera Evaluación
          </Link>
        </div>
      )}
    </div>
  );
}