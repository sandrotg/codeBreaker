import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService, type Challenge } from '../services/api.service';
import { Search, Filter, Eye, Edit, Trash2, Clock, Database } from 'lucide-react';
import './ChallengesListPage.css';

export function ChallengesListPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getChallenges();
      setChallenges(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este challenge?')) return;

    try {
      await ApiService.deleteChallenge(id);
      setChallenges(challenges.filter(c => c.challengeId !== id));
    } catch (err) {
      alert('Error al eliminar el challenge');
      console.error(err);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
    const matchesState = filterState === 'all' || challenge.state === filterState;
    
    return matchesSearch && matchesDifficulty && matchesState;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Published': return 'blue';
      case 'Draft': return 'gray';
      case 'Archived': return 'dark-gray';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="challenges-list-page">
        <div className="loading">Cargando challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenges-list-page">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  return (
    <div className="challenges-list-page">
      <div className="page-header">
        <h1>Challenges</h1>
        <Link to="/challenges/create" className="btn-primary">
          + Nuevo Challenge
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
              <option value="all">Todas las dificultades</option>
              <option value="Easy">Fácil</option>
              <option value="Medium">Medio</option>
              <option value="Hard">Difícil</option>
            </select>
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="Published">Publicado</option>
              <option value="Draft">Borrador</option>
              <option value="Archived">Archivado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="challenges-count">
        {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} encontrado{filteredChallenges.length !== 1 ? 's' : ''}
      </div>

      <div className="challenges-grid">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.challengeId} className="challenge-card">
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <div className="badges">
                <span className={`badge badge-${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className={`badge badge-${getStateColor(challenge.state)}`}>
                  {challenge.state}
                </span>
              </div>
            </div>

            <p className="challenge-description">
              {challenge.description.substring(0, 150)}
              {challenge.description.length > 150 ? '...' : ''}
            </p>

            <div className="challenge-tags">
              {challenge.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
              {challenge.tags.length > 3 && (
                <span className="tag">+{challenge.tags.length - 3}</span>
              )}
            </div>

            <div className="challenge-meta">
              <span className="meta-item">
                <Clock size={16} />
                {challenge.timeLimit}ms
              </span>
              <span className="meta-item">
                <Database size={16} />
                {challenge.memoryLimit}MB
              </span>
            </div>

            <div className="challenge-actions">
              <Link to={`/challenges/${challenge.challengeId}`} className="btn-icon" title="Ver">
                <Eye size={18} />
              </Link>
              <Link to={`/challenges/${challenge.challengeId}/edit`} className="btn-icon" title="Editar">
                <Edit size={18} />
              </Link>
              <button 
                onClick={() => handleDelete(challenge.challengeId)} 
                className="btn-icon btn-danger"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron challenges</p>
          <Link to="/ai-generate" className="btn-primary">
            Generar con IA
          </Link>
        </div>
      )}
    </div>
  );
}
