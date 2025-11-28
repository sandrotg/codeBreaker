import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { Plus, X, Clock, List, Trash2 } from 'lucide-react';
import './EvaluationsPage.css';

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

interface EvaluationForm {
  name: string;
  startAt: string;
  duration: number;
  challengeIds: string[];
}

export function CreateEvaluationPage() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChallengesModal, setShowChallengesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<EvaluationForm>({
    name: '',
    startAt: '',
    duration: 60,
    challengeIds: []
  });

  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getChallenges();
      setChallenges(data);
    } catch (err) {
      setError('Error al cargar los challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleAddChallenge = (challenge: Challenge) => {
    if (!formData.challengeIds.includes(challenge.challengeId)) {
      setFormData(prev => ({
        ...prev,
        challengeIds: [...prev.challengeIds, challenge.challengeId]
      }));
      setSelectedChallenges(prev => [...prev, challenge]);
    }
  };

  const handleRemoveChallenge = (challengeId: string) => {
    setFormData(prev => ({
      ...prev,
      challengeIds: prev.challengeIds.filter(id => id !== challengeId)
    }));
    setSelectedChallenges(prev => prev.filter(ch => ch.challengeId !== challengeId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.challengeIds.length === 0) {
      setError('Debes agregar al menos un challenge a la evaluación');
      return;
    }

    if (!formData.name.trim()) {
      setError('El nombre de la evaluación es requerido');
      return;
    }

    if (!formData.startAt.trim()) {
      setError('La fecha y hora de inicio es requerida');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const evaluationData = {
        name: formData.name,
        startAt: formData.startAt,
        duration: formData.duration,
        challengeIds: formData.challengeIds
      };

      // await ApiService.createEvaluation(evaluationData);
      console.log('Creando evaluación:', evaluationData);
      
      // Simulación de éxito
      setTimeout(() => {
        navigate('/evaluations');
      }, 1000);

    } catch (err) {
      setError('Error al crear la evaluación');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableChallenges = filteredChallenges.filter(
    challenge => !formData.challengeIds.includes(challenge.challengeId)
  );

  if (loading) {
    return (
      <div className="create-evaluation-page">
        <div className="loading">Cargando challenges...</div>
      </div>
    );
  }

  return (
    <div className="create-evaluation-page">
      {/* Modal para seleccionar challenges */}
      {showChallengesModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Seleccionar Challenges</h3>
              <button onClick={() => setShowChallengesModal(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            
            <div className="search-box">
              <List size={20} />
              <input
                type="text"
                placeholder="Buscar challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="challenges-grid-modal">
              {availableChallenges.length === 0 ? (
                <div className="no-challenges">
                  <p>No hay challenges disponibles para agregar</p>
                </div>
              ) : (
                availableChallenges.map((challenge) => (
                  <div key={challenge.challengeId} className="challenge-card-modal">
                    <div className="challenge-header">
                      <h4>{challenge.title}</h4>
                      <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="challenge-description">
                      {challenge.description.substring(0, 120)}
                      {challenge.description.length > 120 ? '...' : ''}
                    </p>
                    <div className="challenge-meta">
                      <span className="time-limit">
                        <Clock size={14} />
                        {challenge.timeLimit}ms
                      </span>
                      <span className="memory-limit">
                        {challenge.memoryLimit}MB
                      </span>
                    </div>
                    <div className="challenge-tags">
                      {challenge.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddChallenge(challenge)}
                      className="btn-add-challenge"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setShowChallengesModal(false)} 
                className="btn-primary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Crear Nueva Evaluación</h1>
        <button onClick={() => navigate('/evaluations')} className="btn-secondary">
          ← Volver a Evaluaciones
        </button>
      </div>

      <form onSubmit={handleSubmit} className="evaluation-form">
        <div className="form-section">
          <h2>Información de la Evaluación</h2>

          <div className="form-group">
            <label htmlFor="name">Nombre de la Evaluación *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Ej: Parcial 1 - Estructuras de Datos"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startAt">Fecha y Hora de Inicio *</label>
              <input
                id="startAt"
                type="text"
                name="startAt"
                value={formData.startAt}
                onChange={handleInputChange}
                required
                placeholder="Ej: 15 de octubre, 10:00 a.m."
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duración (minutos) *</label>
              <input
                id="duration"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Challenges de la Evaluación</h2>
            <button 
              type="button" 
              onClick={() => setShowChallengesModal(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              Agregar Challenges
            </button>
          </div>

          {selectedChallenges.length === 0 ? (
            <div className="no-challenges-selected">
              <List size={48} />
              <p>No hay challenges seleccionados</p>
              <p className="hint">Haz clic en "Agregar Challenges" para comenzar</p>
            </div>
          ) : (
            <div className="selected-challenges">
              <h4>Challenges Seleccionados ({selectedChallenges.length})</h4>
              <div className="challenges-list">
                {selectedChallenges.map((challenge) => (
                  <div key={challenge.challengeId} className="selected-challenge-item">
                    <div className="challenge-info">
                      <h5>{challenge.title}</h5>
                      <p>{challenge.description.substring(0, 80)}...</p>
                      <div className="challenge-meta">
                        <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="time-limit">{challenge.timeLimit}ms</span>
                      </div>
                    </div>
                    <div className="challenge-actions">
                      <button
                        type="button"
                        onClick={() => handleRemoveChallenge(challenge.challengeId)}
                        className="btn-remove"
                        title="Eliminar de la evaluación"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="error-close">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/evaluations')}
            className="btn-cancel"
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={saving || selectedChallenges.length === 0}
          >
            {saving ? 'Creando...' : 'Crear Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
}