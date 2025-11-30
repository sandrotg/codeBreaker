import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
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
import { EvaluationDetailPage } from './pages/EvaluationDetailPage';
import { EvaluationExamPage } from './pages/EvaluationExamPage';
import { EvaluationResultsPage } from './pages/EvaluationResultsPage';
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
              
              {/* Rutas protegidas - solo admin */}
              <Route path="/challenges/create" element={
                <ProtectedRoute requireAdmin>
                  <CreateChallengePage />
                </ProtectedRoute>
              } />
              <Route path="/challenges/:id/edit" element={
                <ProtectedRoute requireAdmin>
                  <EditChallengePage />
                </ProtectedRoute>
              } />
              <Route path="/ai-generate" element={
                <ProtectedRoute requireAdmin>
                  <AIGeneratePage />
                </ProtectedRoute>
              } />
              
              {/* Rutas accesibles para todos los usuarios autenticados */}
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/evaluations" element={<EvaluationsListPage />} />
              <Route path="/evaluations/:id" element={<EvaluationDetailPage />} />
              <Route path="/evaluations/:id/exam" element={<EvaluationExamPage />} />
              <Route path="/evaluations/:id/results" element={
                <ProtectedRoute requireAdmin>
                  <EvaluationResultsPage />
                </ProtectedRoute>
              } />
              
              {/* Rutas protegidas - solo admin */}
              <Route path="/evaluations/create" element={
                <ProtectedRoute requireAdmin>
                  <CreateEvaluationPage />
                </ProtectedRoute>
              } />
              
              {/* Rutas públicas */}
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/login" element={<LoginPage />} />
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
