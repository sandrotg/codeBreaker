import { useState } from 'react';
import { ApiService } from '../services/api.service';
import type { ChallengeResponse } from '../types/challenge.types';
import { ChallengeEditor } from './ChallengeEditor';
import './GenerateChallenge.css';

export function GenerateChallenge() {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<ChallengeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const challenge = await ApiService.generateChallenge(theme);
      setGeneratedChallenge(challenge);
    } catch (err) {
      setError('Error al generar el challenge. Verifica que el backend esté corriendo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGeneratedChallenge(null);
    setTheme('');
  };

  return (
    <div className="generate-challenge">
      <h1>Generar Challenge con IA</h1>

      {!generatedChallenge ? (
        <form onSubmit={handleGenerate} className="generate-form">
          <div className="form-group">
            <label htmlFor="theme">Tema del Challenge:</label>
            <input
              id="theme"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ej: algoritmos de ordenamiento, recursión, árboles binarios..."
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading || !theme}>
            {loading ? 'Generando...' : 'Generar Challenge'}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <ChallengeEditor 
          generatedChallenge={generatedChallenge}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
