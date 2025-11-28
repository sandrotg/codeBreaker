import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { Plus, Calendar, Clock, Eye, Trash2, X, AlertTriangle } from 'lucide-react';
import './ListEvalPage.css';

interface Evaluation {
  evaluationId: string;
  name: string;
  startAt: Date;
  duration: number;
  createdAt: Date;
}

export function EvaluationsListPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluationStates, setEvaluationStates] = useState<{[key: string]: string}>({});
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
      const data = await ApiService.getEvaluations();
      setEvaluations(data);
      
      // Cargar estados de cada evaluación
      const states: {[key: string]: string} = {};
      for (const evaluation of data) {
        try {
          const details = await ApiService.getEvaluationById(evaluation.evaluationId);
          states[evaluation.evaluationId] = details.state;
        } catch (err) {
          console.error(`Error al cargar estado de evaluación ${evaluation.evaluationId}:`, err);
          states[evaluation.evaluationId] = 'no_activo';
        }
      }
      setEvaluationStates(states);
      
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
    switch (state) {
      case 'activo':
        return 'status-active';
      case 'no_activo':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  const getStatusText = (state: string) => {
    switch (state) {
      case 'activo':
        return 'Activa';
      case 'no_activo':
        return 'Inactiva';
      default:
        return 'Inactiva';
    }
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
                <Link 
                  to={`/evaluations/${evaluation.evaluationId}`}
                  className="btn-icon"
                  title="Ver detalles"
                >
                  <Eye size={18} />
                </Link>
                <button 
                  onClick={() => openDeleteModal(evaluation)}
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
                <span>Inicia: {formatDate(evaluation.startAt)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>Duración: {formatDuration(evaluation.duration)}</span>
              </div>
            </div>

            <div className="evaluation-footer">
              <div className={`status-badge ${getStatusBadge(evaluationStates[evaluation.evaluationId] || 'no_activo')}`}>
                {getStatusText(evaluationStates[evaluation.evaluationId] || 'no_activo')}
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