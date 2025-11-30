import { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { Link } from 'react-router-dom';
import { Plus, Users, Book, X, Search, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../hooks/useRole';
import './CoursesPage.css';

interface Course {
  courseId: string;
  title: string;
  nrc: number;
  period: string;
  group: number;
  users?: User[];
  challenges?: Challenge[];
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

interface User {
  email: string;
  name?: string;
}

export function CoursesPage() {
  const { user } = useAuth();
  const { isAdmin, canCreateCourses } = useRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'challenges' | 'evaluations'>('users');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseUsers, setCourseUsers] = useState<User[]>([]);
  const [courseChallenges, setCourseChallenges] = useState<Challenge[]>([]);
  const [courseEvaluations, setCourseEvaluations] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUsersModal, setShowAddUsersModal] = useState(false);
  const [showAddChallengesModal, setShowAddChallengesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para formularios
  const [newCourse, setNewCourse] = useState({
    title: '',
    nrc: '',
    period: '',
    group: ''
  });
  const [userEmails, setUserEmails] = useState('');

  useEffect(() => {
    loadCourses();
    loadAllChallenges();
  }, [isAdmin, user?.userId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let data:any;
      
      if (isAdmin) {
        // Admin ve todos los cursos
        data = await ApiService.getAllCourses();
      } else if (user?.userId) {
        // Estudiante ve solo sus cursos
        data = await ApiService.getCoursesByStudent(user.userId);
      } else {
        data = [];
      }
      
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllChallenges = async () => {
    try {
      const data = await ApiService.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Error al cargar challenges:', err);
    }
  };

  const loadCourseDetails = async (course: Course) => {
    try {
      setSelectedCourse(course);

      // Cargar usuarios del curso
      const users = await ApiService.getCourseUsers(course.nrc);
      setCourseUsers(users);

      // Cargar challenges del curso
      const courseChallengesData = await ApiService.getCourseChallenges(course.nrc);
      setCourseChallenges(courseChallengesData);

      // Cargar evaluaciones del curso
      const evaluations = await ApiService.getCourseEvaluations(course.nrc);
      setCourseEvaluations(evaluations);
    } catch (err) {
      console.error('Error al cargar detalles del curso:', err);
      setError('Error al cargar los detalles del curso');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseData = {
        creatorEmail: "Email@Email.com", // En una app real, esto vendría del usuario autenticado
        title: newCourse.title,
        nrc: parseInt(newCourse.nrc),
        period: newCourse.period,
        group: parseInt(newCourse.group)
      };
      console.log('Curso creado:', courseData);
      const createdCourse = await ApiService.createCourse(courseData);

      // Agregar a la lista local
      setCourses(prev => [...prev, createdCourse]);
      setShowCreateModal(false);
      setNewCourse({ title: '', nrc: '', period: '', group: '' });

      // Seleccionar el nuevo curso automáticamente
      loadCourseDetails(createdCourse);
    } catch (err) {
      setError('Error al crear el curso');
      console.error(err);
    }
  };

  const handleAddUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      const emails = userEmails.split(',').map(email => email.trim()).filter(Boolean);
      const addUsersData = { userEmails: emails };

      await ApiService.addUsersToCourse(selectedCourse.nrc, addUsersData);

      // Recargar la lista de usuarios
      const updatedUsers = await ApiService.getCourseUsers(selectedCourse.nrc);
      setCourseUsers(updatedUsers);

      setShowAddUsersModal(false);
      setUserEmails('');
    } catch (err) {
      setError('Error al agregar usuarios');
      console.error(err);
    }
  };

  const handleAddChallenge = async (challengeId: string) => {
    if (!selectedCourse) return;

    try {
      await ApiService.addChallengeToCourse(selectedCourse.nrc, challengeId);

      // Recargar la lista de challenges del curso
      const updatedChallenges = await ApiService.getCourseChallenges(selectedCourse.nrc);
      setCourseChallenges(updatedChallenges);

      // Mostrar mensaje de éxito
      const addedChallenge = challenges.find(c => c.challengeId === challengeId);
      if (addedChallenge) {
        setError(null);
        console.log(`Challenge "${addedChallenge.title}" agregado al curso`);
      }
    } catch (err) {
      setError('Error al agregar challenge al curso');
      console.error(err);
    }
  };

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading">Cargando cursos...</div>
      </div>
    );
  }

  // Si es estudiante y no tiene cursos asignados
  if (!isAdmin && courses.length === 0) {
    return (
      <div className="courses-page">
        <div className="empty-courses-message">
          <h2>No tienes cursos asignados</h2>
          <p>Por favor, espera a que un administrador te asigne a un curso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Modal para crear curso */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Crear Nuevo Curso</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label>Título del Curso *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Ej: Programación Web"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>NRC *</label>
                  <input
                    type="number"
                    value={newCourse.nrc}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, nrc: e.target.value }))}
                    required
                    placeholder="Ej: 9261"
                  />
                </div>
                <div className="form-group">
                  <label>Grupo *</label>
                  <input
                    type="number"
                    value={newCourse.group}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, group: e.target.value }))}
                    required
                    placeholder="Ej: 2"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Periodo *</label>
                <input
                  type="text"
                  value={newCourse.period}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, period: e.target.value }))}
                  required
                  placeholder="Ej: 2025-2"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar usuarios */}
      {showAddUsersModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Agregar Usuarios al Curso</h3>
              <button onClick={() => setShowAddUsersModal(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUsers}>
              <div className="form-group">
                <label>Emails de Usuarios (separados por coma)</label>
                <textarea
                  value={userEmails}
                  onChange={(e) => setUserEmails(e.target.value)}
                  rows={4}
                  placeholder="usuario1@ejemplo.com, usuario2@ejemplo.com"
                  required
                />
                <small>Separa cada email con una coma</small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddUsersModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Agregar Usuarios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar challenges */}
      {showAddChallengesModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Agregar Challenges al Curso - {selectedCourse.title}</h3>
              <button onClick={() => setShowAddChallengesModal(false)} className="close-button">
                <X size={20} />
              </button>
            </div>

            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="challenges-grid-modal">
              {filteredChallenges.map((challenge) => {
                const isAlreadyAdded = courseChallenges.some(c => c.challengeId === challenge.challengeId);
                return (
                  <div key={challenge.challengeId} className="challenge-card-modal">
                    <div className="challenge-header">
                      <h4>{challenge.title}</h4>
                      <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="challenge-description">
                      {challenge.description.substring(0, 100)}
                      {challenge.description.length > 100 ? '...' : ''}
                    </p>
                    <div className="challenge-tags">
                      {challenge.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddChallenge(challenge.challengeId)}
                      className={`btn-add-challenge ${isAlreadyAdded ? 'added' : ''}`}
                      disabled={isAlreadyAdded}
                    >
                      {isAlreadyAdded ? '✓ Agregado' : 'Agregar al Curso'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Gestión de Cursos</h1>
        {canCreateCourses && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus size={18} />
            Crear Curso
          </button>
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

      <div className="courses-layout">
        <div className="courses-sidebar">
          <h3>Cursos ({courses.length})</h3>
          <div className="courses-list">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className={`course-item ${selectedCourse?.courseId === course.courseId ? 'active' : ''}`}
                onClick={() => loadCourseDetails(course)}
              >
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <p>NRC: {course.nrc} • Grupo: {course.group}</p>
                  <p className="course-period">{course.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="courses-content">
          {selectedCourse ? (
            <div className="course-details">
              <div className="course-header">
                <div>
                  <h2>{selectedCourse.title}</h2>
                  <p className="course-meta">
                    NRC: {selectedCourse.nrc} • Grupo: {selectedCourse.group} • Periodo: {selectedCourse.period}
                  </p>
                </div>
                {canCreateCourses && (
                  <div className="course-actions">
                    <button
                      onClick={() => setShowAddUsersModal(true)}
                      className="btn-secondary"
                    >
                      <Users size={16} />
                      Agregar Usuarios
                    </button>
                    <button
                      onClick={() => setShowAddChallengesModal(true)}
                      className="btn-secondary"
                    >
                      <Book size={16} />
                      Agregar Challenges
                    </button>
                  </div>
                )}
              </div>

              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  Usuarios ({courseUsers.length})
                </button>
                <button
                  className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
                  onClick={() => setActiveTab('challenges')}
                >
                  Challenges ({courseChallenges.length})
                </button>
                <button
                  className={`tab ${activeTab === 'evaluations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evaluations')}
                >
                  Evaluaciones ({courseEvaluations.length})
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'users' && (
                  <div className="users-list">
                    <h4>Integrantes del Curso ({courseUsers.length})</h4>
                    {courseUsers.length === 0 ? (
                      <p className="no-data">No hay usuarios en este curso</p>
                    ) : (
                      courseUsers.map((user, index) => (
                        <div key={index} className="user-item">
                          <span className="user-email">{user.email}</span>
                          {user.name && <span className="user-name">{user.name}</span>}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'challenges' && (
                  <div className="challenges-list">
                    <h4>Challenges del Curso ({courseChallenges.length})</h4>
                    {courseChallenges.length === 0 ? (
                      <p className="no-data">No hay challenges en este curso</p>
                    ) : (
                      courseChallenges.map((challenge) => (
                        <div key={challenge.challengeId} className="course-challenge-item">
                          <div className="challenge-info">
                            <h5>{challenge.title}</h5>
                            <p className="challenge-desc">{challenge.description.substring(0, 100)}...</p>
                            <div className="challenge-meta">
                              <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                                {challenge.difficulty}
                              </span>
                              <span className="time-limit">{challenge.timeLimit}ms</span>
                              <span className="memory-limit">{challenge.memoryLimit}MB</span>
                              <span className={`state-badge state-${challenge.state.toLowerCase()}`}>
                                {challenge.state}
                              </span>
                            </div>
                            <div className="challenge-tags">
                              {challenge.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="challenge-actions">
                            <Link
                              to={`/challenges/${challenge.challengeId}`}
                              className="btn-view"
                              title="Ver detalles del challenge"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'evaluations' && (
                  <div className="evaluations-list">
                    <h4>Evaluaciones del Curso ({courseEvaluations.length})</h4>
                    {courseEvaluations.length === 0 ? (
                      <p className="no-data">No hay evaluaciones asignadas a este curso</p>
                    ) : (
                      courseEvaluations.map((evaluation) => (
                        <div key={evaluation.evaluationId} className="course-evaluation-item">
                          <div className="evaluation-info">
                            <h5>{evaluation.name || 'Sin nombre'}</h5>
                            <div className="evaluation-meta">
                              <span>Inicio: {new Date(evaluation.startAt).toLocaleString('es-ES')}</span>
                              <span>Duración: {evaluation.durationMinutes || 0} min</span>
                            </div>
                          </div>
                          <div className="evaluation-actions">
                            <Link
                              to={`/evaluations/${evaluation.evaluationId}`}
                              className="btn-view"
                              title="Ver detalles de la evaluación"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-course-selected">
              <Book size={48} />
              <h3>Selecciona un curso para ver los detalles</h3>
              <p>Haz clic en un curso de la lista para ver sus usuarios y challenges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}