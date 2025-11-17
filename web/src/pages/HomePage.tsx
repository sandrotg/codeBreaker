import { Link } from 'react-router-dom';
import { Sparkles, List, PlusCircle, Zap } from 'lucide-react';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>🎯 Bienvenido a CodeBreaker</h1>
        <p className="hero-subtitle">
          Plataforma de challenges de programación con IA
        </p>
        <p className="hero-description">
          Crea, gestiona y resuelve challenges de programación. 
          Genera automáticamente retos con inteligencia artificial.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon ai">
            <Sparkles size={32} />
          </div>
          <h3>Generación con IA</h3>
          <p>Crea challenges automáticamente usando GPT y Ollama</p>
          <Link to="/ai-generate" className="feature-link">
            Generar Challenge →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon challenges">
            <List size={32} />
          </div>
          <h3>Ver Challenges</h3>
          <p>Explora todos los challenges disponibles</p>
          <Link to="/challenges" className="feature-link">
            Ver Lista →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon create">
            <PlusCircle size={32} />
          </div>
          <h3>Crear Manual</h3>
          <p>Crea challenges personalizados manualmente</p>
          <Link to="/challenges/create" className="feature-link">
            Crear Ahora →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon submissions">
            <Zap size={32} />
          </div>
          <h3>Submissions</h3>
          <p>Envía y revisa soluciones</p>
          <Link to="/submissions" className="feature-link">
            Ver Submissions →
          </Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-value">∞</div>
          <div className="stat-label">Challenges Posibles</div>
        </div>
        <div className="stat">
          <div className="stat-value">3</div>
          <div className="stat-label">Dificultades</div>
        </div>
        <div className="stat">
          <div className="stat-value">AI</div>
          <div className="stat-label">Powered</div>
        </div>
      </section>
    </div>
  );
}
