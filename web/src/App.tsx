import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ChallengesListPage } from './pages/ChallengesListPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { AIGeneratePage } from './pages/AIGeneratePage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { LoginPage } from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/challenges" element={<ChallengesListPage />} />
              <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
              <Route path="/ai-generate" element={<AIGeneratePage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>CodeBreaker © 2025 - Powered by OpenAI GPT + Ollama</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
