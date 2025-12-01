import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { 
  Search, 
  Filter, 
  // Eye, 
  Clock, 
  Code, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Hash
} from 'lucide-react';
import './SubmissionsPage.css';

interface Submission {
  submissionId: string;
  user: string; // userId
  challengeId: string;
  language: string;
  status: string;
  createdAt: string;
  score?: number;
  timeMsTotal?: number;
  cases?: CaseResult[];
}

interface CaseResult {
  caseId: string;
  status: string;
  timeMs: number;
}

interface User {
  userId: string;
  userName: string;
  email: string;
  passwordHash: string;
  roleId: string;
  createdAt: Date;
}

// Tipos separados para mapeos
interface UserNamesMap {
  [userId: string]: string; // userId -> userName
}

interface ChallengeTitlesMap {
  [challengeId: string]: string; // challengeId -> challenge title
}

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userNames, setUserNames] = useState<UserNamesMap>({});
  const [challengeTitles, setChallengeTitles] = useState<ChallengeTitlesMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await ApiService.findAllSubmissions();
      setSubmissions(data);
      
      // Cargar nombres de usuarios y títulos de challenges
      await loadUserAndChallengeData(data);
      
      setError(null);
    } catch (err) {
      setError('Error al cargar las submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAndChallengeData = async (submissionsData: Submission[]) => {
    try {
      const uniqueUserIds = [...new Set(submissionsData.map(s => s.user))];
      const uniqueChallengeIds = [...new Set(submissionsData.map(s => s.challengeId))];
      
      const userMap: UserNamesMap = {};
      const challengeMap: ChallengeTitlesMap = {};
      
      // Cargar usuarios en paralelo
      const userPromises = uniqueUserIds.map(async (userId) => {
        try {
          const user = await ApiService.getUserById(userId);
          userMap[userId] = user.userName;
        } catch (err) {
          console.error(`Error al cargar usuario ${userId}:`, err);
          userMap[userId] = `Usuario ${userId.substring(0, 6)}...`;
        }
      });
      
      // Cargar challenges en paralelo
      const challengePromises = uniqueChallengeIds.map(async (challengeId) => {
        try {
          const challenge = await ApiService.getChallengeById(challengeId);
          challengeMap[challengeId] = challenge.title;
        } catch (err) {
          console.error(`Error al cargar challenge ${challengeId}:`, err);
          challengeMap[challengeId] = `Challenge ${challengeId.substring(0, 6)}...`;
        }
      });
      
      await Promise.all([...userPromises, ...challengePromises]);
      
      setUserNames(userMap);
      setChallengeTitles(challengeMap);
    } catch (err) {
      console.error('Error al cargar datos adicionales:', err);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const userName = userNames[submission.user]?.toLowerCase() || '';
    const challengeTitle = challengeTitles[submission.challengeId]?.toLowerCase() || '';
    
    const matchesSearch = 
      userName.includes(searchTerm.toLowerCase()) ||
      challengeTitle.includes(searchTerm.toLowerCase()) ||
      submission.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.challengeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesLanguage = filterLanguage === 'all' || submission.language === filterLanguage;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${ms}ms`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'CORRECT':
        return 'green';
      case 'WRONG_ANSWER':
      case 'FAILED':
        return 'red';
      case 'TIME_LIMIT_EXCEEDED':
        return 'orange';
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return 'purple';
      case 'QUEUED':
      case 'RUNNING':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'CORRECT':
        return <CheckCircle size={16} />;
      case 'WRONG_ANSWER':
      case 'FAILED':
        return <XCircle size={16} />;
      case 'TIME_LIMIT_EXCEEDED':
        return <Clock size={16} />;
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'Python':
        return '#306998';
      case 'Java':
        return '#007396';
      case 'CPlusPlus':
        return '#00599c';
      case 'Node':
        return '#68a063';
      default:
        return '#666';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'gray';
    if (score >= 80) return 'green';
    if (score >= 50) return 'orange';
    return 'red';
  };

  const calculatePassedCases = (cases?: CaseResult[]) => {
    if (!cases) return { passed: 0, total: 0 };
    const passed = cases.filter(c => c.status === 'CORRECT').length;
    return { passed, total: cases.length };
  };

  if (loading) {
    return (
      <div className="submissions-list-page">
        <div className="loading">Cargando submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submissions-list-page">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  return (
    <div className="submissions-list-page">
      <div className="page-header">
        <h1>Submissions</h1>
        <div className="submissions-count">
          {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por usuario, challenge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="ACCEPTED">Aceptado</option>
              <option value="WRONG_ANSWER">Respuesta incorrecta</option>
              <option value="TIME_LIMIT_EXCEEDED">Tiempo excedido</option>
              <option value="COMPILATION_ERROR">Error de compilación</option>
              <option value="RUNTIME_ERROR">Error de ejecución</option>
              <option value="QUEUED">En cola</option>
              <option value="RUNNING">Ejecutando</option>
            </select>
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)}>
              <option value="all">Todos los lenguajes</option>
              <option value="Python">Python</option>
              <option value="CPlusPlus">C++</option>
              <option value="Java">Java</option>
              <option value="Node">Node.js</option>
            </select>
          </div>
        </div>
      </div>

      <div className="submissions-grid">
        {filteredSubmissions.map((submission) => {
          const { passed, total } = calculatePassedCases(submission.cases);
          const userName = userNames[submission.user] || `Usuario ${submission.user.substring(0, 6)}...`;
          const challengeTitle = challengeTitles[submission.challengeId] || `Challenge ${submission.challengeId.substring(0, 6)}...`;
          
          return (
            <div key={submission.submissionId} className="submission-card">
              <div className="submission-header">
                <h3>Submission {submission.submissionId.substring(0, 8)}...</h3>
                <div className="submission-status">
                  <span className={`status-badge status-${getStatusColor(submission.status)}`}>
                    {getStatusIcon(submission.status)}
                    {submission.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="submission-meta">
                <div className="meta-item">
                  <User size={14} />
                  <span title={submission.user}>
                    {userName}
                  </span>
                </div>
                <div className="meta-item">
                  <Code size={14} />
                  <span style={{ color: getLanguageColor(submission.language) }}>
                    {submission.language}
                  </span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{formatTime(submission.timeMsTotal)}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{formatDate(submission.createdAt)}</span>
                </div>
              </div>

              <div className="challenge-info">
                <div className="challenge-header">
                  <Hash size={14} />
                  <h4>Challenge:</h4>
                </div>
                <div className="challenge-details">
                  <span className="challenge-title" title={challengeTitle}>
                    {challengeTitle}
                  </span>
                </div>
              </div>

              {submission.score !== undefined && (
                <div className="submission-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${submission.score}%`,
                        backgroundColor: `var(--color-${getScoreColor(submission.score)})`
                      }}
                    />
                  </div>
                  <span className={`score-value score-${getScoreColor(submission.score)}`}>
                    {submission.score}%
                  </span>
                </div>
              )}

              {submission.cases && submission.cases.length > 0 && (
                <div className="cases-info">
                  <h4>Test Cases: {passed}/{total} correctos</h4>
                  <div className="cases-grid">
                    {submission.cases.slice(0, 4).map((testCase) => (
                      <div key={testCase.caseId} className="case-item">
                        <div className={`case-status ${testCase.status.toLowerCase()}`}>
                          {testCase.status === 'CORRECT' ? '✓' : '✗'}
                        </div>
                        <span className="case-time">{testCase.timeMs}ms</span>
                      </div>
                    ))}
                    {submission.cases.length > 4 && (
                      <div className="case-item more-cases">
                        +{submission.cases.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="empty-state">
          <Code size={64} />
          <h3>No se encontraron submissions</h3>
          <p>No hay submissions que coincidan con los filtros seleccionados.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterLanguage('all');
            }}
            className="btn-primary"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}