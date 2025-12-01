import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../hooks/useRole';
import { Plus, Calendar, Clock, Eye, Trash2, X, AlertTriangle, Power, PowerOff, Play, BarChart } from 'lucide-react';
import './ListEvalPage.css';

interface Evaluation {
  evaluationId: string;
  name: string;
  startAt: Date;
  duration: number;
  state: string;
  createdAt: Date;
}

export function EvaluationsListPage() {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; evaluation: Evaluation | null }>({
    isOpen: false,
    evaluation: null
  });

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      let data: any;
      
      if (isAdmin) {
        // Admin ve todas las evaluaciones
        data = await ApiService.getEvaluations();
      } else if (user?.userId) {
        // Estudiante ve solo evaluaciones activas de sus cursos
        data = await ApiService.getActiveEvaluationsByStudent(user.userId);
      } else {
        data = [];
      }
      
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las evaluaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (evaluation: Evaluation) => {
    setDeleteModal({
      isOpen: true,
      evaluation
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      evaluation: null
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.evaluation) return;

    try {
      await ApiService.deleteEvaluation(deleteModal.evaluation.evaluationId);
      setEvaluations(evaluations.filter(e => e.evaluationId !== deleteModal.evaluation?.evaluationId));
      closeDeleteModal();
    } catch (err) {
      alert('Error al eliminar la evaluación');
      console.error(err);
      closeDeleteModal();
    }
  };

  const handleToggleState = async (evaluationId: string, currentState: string) => {
    try {
      if (currentState === 'Active') {
        await ApiService.deactivateEvaluation(evaluationId);
      } else {
        await ApiService.activateEvaluation(evaluationId);
      }
      await loadEvaluations(); // Recargar lista
    } catch (err) {
      alert('Error al cambiar el estado de la evaluación');
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (state: string) => {
    return state === 'Active' ? 'status-active' : 'status-inactive';
  };

  const getStatusText = (state: string) => {
    return state === 'Active' ? 'Activa' : 'Inactiva';
  };

  const isEvaluationFinished = (evaluationId: string): boolean => {
    if (!user?.userId) return false;
    const finishedKey = `evaluation_finished_${evaluationId}_${user.userId}`;
    return localStorage.getItem(finishedKey) === 'true';
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
      {/* Modal de confirmación de eliminación */}
      {deleteModal.isOpen && deleteModal.evaluation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <div className="warning-icon">
                <AlertTriangle size={24} />
              </div>
              <h3>¿Eliminar Evaluación?</h3>
              <button onClick={closeDeleteModal} className="close-button">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Estás a punto de eliminar la evaluación: <strong>"{deleteModal.evaluation.name}"</strong>
              </p>
              <p className="warning-text">
                Esta acción no se puede deshacer. Todos los datos asociados a esta evaluación se perderán permanentemente.
              </p>
            </div>
            
            <div className="modal-actions">
              <button onClick={closeDeleteModal} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={handleDelete} className="btn-confirm-delete">
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Evaluaciones</h1>
        {isAdmin && (
          <Link to="/evaluations/create" className="btn-primary">
            <Plus size={18} />
            Nueva Evaluación
          </Link>
        )}
      </div>

      <div className="evaluations-count">
        {evaluations.length} evaluaci{evaluations.length !== 1 ? 'ones' : 'ón'} encontrada{evaluations.length !== 1 ? 's' : ''}
      </div>

      <div className="evaluations-grid">
        {evaluations.map((evaluation) => (
          <div key={evaluation.evaluationId} className="evaluation-card">
            <div className="evaluation-header">
              <h3>{evaluation.name}</h3>
              {isAdmin && (
                <div className="evaluation-actions">
                  <Link 
                    to={`/evaluations/${evaluation.evaluationId}/results`}
                    className="btn-icon btn-info"
                    title="Ver resultados"
                  >
                    <BarChart size={18} />
                  </Link>
                  <Link 
                    to={`/evaluations/${evaluation.evaluationId}`}
                    className="btn-icon"
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => handleToggleState(evaluation.evaluationId, evaluation.state)}
                    className={`btn-icon ${evaluation.state === 'Active' ? 'btn-warning' : 'btn-success'}`}
                    title={evaluation.state === 'Active' ? 'Desactivar' : 'Activar'}
                  >
                    {evaluation.state === 'Active' ? <PowerOff size={18} /> : <Power size={18} />}
                  </button>
                  <button 
                    onClick={() => openDeleteModal(evaluation)}
                    className="btn-icon btn-danger"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="evaluation-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Inicia: {formatDate(evaluation.startAt)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>Duración: {formatDuration(evaluation.duration)}</span>
              </div>
            </div>

            <div className="evaluation-footer">
              <div className={`status-badge ${getStatusBadge(evaluation.state)}`}>
                {getStatusText(evaluation.state)}
              </div>
              {!isAdmin && (
                isEvaluationFinished(evaluation.evaluationId) ? (
                  <button 
                    className="btn-start-evaluation btn-disabled"
                    disabled
                  >
                    <Play size={18} />
                    Finalizada
                  </button>
                ) : (
                  <Link 
                    to={`/evaluations/${evaluation.evaluationId}/exam`}
                    className="btn-start-evaluation"
                  >
                    <Play size={18} />
                    Empezar Evaluación
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {evaluations.length === 0 && !loading && (
        <div className="empty-state">
          <Calendar size={64} />
          {isAdmin ? (
            <>
              <h3>No hay evaluaciones creadas</h3>
              <p>Crea tu primera evaluación para comenzar a gestionar tus tests.</p>
              <Link to="/evaluations/create" className="btn-primary">
                <Plus size={18} />
                Crear Primera Evaluación
              </Link>
            </>
          ) : (
            <>
              <h3>No tienes evaluaciones activas</h3>
              <p>No hay evaluaciones activas asignadas a tus cursos en este momento.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}