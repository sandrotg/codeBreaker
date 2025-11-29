import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ChallengesListPage } from './pages/ChallengesListPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { CreateChallengePage } from './pages/CreateChallengePage';
import { AIGeneratePage } from './pages/AIGeneratePage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { EditChallengePage } from './pages/EditChallengePage';
import { CoursesPage } from './pages/CoursesPage';
import { CreateEvaluationPage } from './pages/EvaluationsPage';
import { EvaluationsListPage } from './pages/ListEvalPage';
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
              <Route path="/challenges/create" element={<CreateChallengePage />} />
              <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
              <Route path="/challenges/:id/edit" element={<EditChallengePage />} />
              <Route path="/ai-generate" element={<AIGeneratePage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/evaluations" element={<EvaluationsListPage />} />
              <Route path="/evaluations/create" element={<CreateEvaluationPage />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>CodeBreaker © 2025</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
