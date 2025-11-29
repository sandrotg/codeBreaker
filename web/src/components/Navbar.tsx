import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, PlusCircle, Sparkles, FileText, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Sparkles size={24} />
          <span>CodeBreaker</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>

          <Link 
            to="/challenges" 
            className={`nav-link ${isActive('/challenges') ? 'active' : ''}`}
          >
            <List size={20} />
            <span>Challenges</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                to="/challenges/create" 
                className={`nav-link ${isActive('/challenges/create') ? 'active' : ''}`}
              >
                <PlusCircle size={20} />
                <span>Crear</span>
              </Link>

              <Link 
                to="/ai-generate" 
                className={`nav-link ${isActive('/ai-generate') ? 'active' : ''}`}
              >
                <Sparkles size={20} />
                <span>IA</span>
              </Link>

              <Link 
                to="/submissions" 
                className={`nav-link ${isActive('/submissions') ? 'active' : ''}`}
              >
                <FileText size={20} />
                <span>Mis Submissions</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <User size={18} />
                <span>{user?.userName}</span>
              </div>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              <LogIn size={20} />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
