import { Link } from 'react-router-dom';
import { Book, ClipboardList, List, Zap, Code, TrendingUp, Award, Target } from 'lucide-react';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

export function HomePage() {
  const { canViewCourses, canViewEvaluations, isAdmin, isStudent } = useRole();
  const { user } = useAuth();
  
  const getHeroContent = () => {
    if (isAdmin) {
      return {
        title: '¡Bienvenido, Profesor!',
        subtitle: 'Panel de Control - CodeBreaker',
        description: 'Gestiona cursos, crea evaluaciones y challenges. Utiliza IA para generar retos automáticamente y supervisa el progreso de tus estudiantes.'
      };
    }
    return {
      title: `¡Hola, ${user?.userName || 'Estudiante'}!`,
      subtitle: 'Tu Plataforma de Aprendizaje',
      description: 'Resuelve challenges de programación, participa en evaluaciones y mejora tus habilidades. ¡Cada reto es una oportunidad para crecer!'
    };
  };

  const getStatsContent = () => {
    if (isAdmin) {
      return [
        { value: '∞', label: 'Challenges con IA' },
        { value: '100%', label: 'Control Total' },
        { value: 'AI', label: 'Generación Automática' }
      ];
    }
    return [
      { value: '∞', label: 'Retos Disponibles' },
      { value: '3', label: 'Niveles de Dificultad' },
      { value: '+', label: 'Crece Cada Día' }
    ];
  };

  const heroContent = getHeroContent();
  const statsContent = getStatsContent();
  
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-badge">
          {isAdmin ? '🎓 Profesor' : '💻 Estudiante'}
        </div>
        <h1>{heroContent.title}</h1>
        <p className="hero-subtitle">
          {heroContent.subtitle}
        </p>
        <p className="hero-description">
          {heroContent.description}
        </p>
      </section>

      <section className="features">
        {canViewCourses && (
          <div className="feature-card">
            <div className="feature-icon courses">
              <Book size={32} />
            </div>
            <h3>{isAdmin ? 'Gestionar Cursos' : 'Mis Cursos'}</h3>
            <p>{isAdmin ? 'Administra cursos y estudiantes' : 'Accede a tus cursos inscritos'}</p>
            <Link to="/courses" className="feature-link">
              {isAdmin ? 'Administrar →' : 'Ver Cursos →'}
            </Link>
          </div>
        )}

        {canViewEvaluations && (
          <div className="feature-card">
            <div className="feature-icon evaluations">
              <ClipboardList size={32} />
            </div>
            <h3>{isAdmin ? 'Evaluaciones' : 'Mis Evaluaciones'}</h3>
            <p>{isAdmin ? 'Crea y supervisa evaluaciones' : 'Participa en evaluaciones activas'}</p>
            <Link to="/evaluations" className="feature-link">
              {isAdmin ? 'Gestionar →' : 'Ver Evaluaciones →'}
            </Link>
          </div>
        )}

        <div className="feature-card">
          <div className="feature-icon challenges">
            <Code size={32} />
          </div>
          <h3>{isAdmin ? 'Challenges' : 'Resolver Challenges'}</h3>
          <p>{isAdmin ? 'Crea y edita desafíos con IA' : 'Practica con retos de programación'}</p>
          <Link to="/challenges" className="feature-link">
            {isAdmin ? 'Gestionar →' : 'Explorar →'}
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon submissions">
            <Zap size={32} />
          </div>
          <h3>{isAdmin ? 'Submissions' : 'Mis Soluciones'}</h3>
          <p>{isAdmin ? 'Revisa soluciones de estudiantes' : 'Revisa tu historial de envíos'}</p>
          <Link to="/submissions" className="feature-link">
            {isAdmin ? 'Ver Todas →' : 'Mi Historial →'}
          </Link>
        </div>
      </section>

      {isStudent && (
        <section className="student-motivational">
          <div className="motivational-card">
            <Target size={48} />
            <h3>Establece tus metas</h3>
            <p>Cada challenge completado te acerca más a dominar la programación</p>
          </div>
          <div className="motivational-card">
            <TrendingUp size={48} />
            <h3>Mejora continua</h3>
            <p>Analiza tus resultados y aprende de cada intento</p>
          </div>
          <div className="motivational-card">
            <Award size={48} />
            <h3>Alcanza la excelencia</h3>
            <p>Completa evaluaciones y demuestra tu progreso</p>
          </div>
        </section>
      )}

      <section className="stats">
        {statsContent.map((stat, index) => (
          <div key={index} className="stat">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}