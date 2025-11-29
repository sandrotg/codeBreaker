import { useState } from 'react';
import { ApiService } from '../services/api.service';
import type { 
  ChallengeResponse, 
  CreateChallengeDto,
  Difficulty,
  ChallengeState
} from '../types/challenge.types';
import './ChallengeEditor.css';

interface Props {
  generatedChallenge: ChallengeResponse;
  onCancel: () => void;
}

export function ChallengeEditor({ generatedChallenge, onCancel }: Props) {
  const [formData, setFormData] = useState({
    title: generatedChallenge.title,
    description: generatedChallenge.description,
    inputDescription: generatedChallenge.inputDescription,
    outputDescription: generatedChallenge.outputDescription,
    difficulty: 'Medium' as Difficulty,
    tags: '',
    timeLimit: 1000,
    memoryLimit: 256,
    state: 'Draft' as ChallengeState,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const challengeData: CreateChallengeDto = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        timeLimit: Number(formData.timeLimit),
        memoryLimit: Number(formData.memoryLimit),
      };

      // 1. Crear el challenge
      const createdChallenge = await ApiService.createChallenge(challengeData);

      // 2. Crear los test cases del challenge generado
      if (generatedChallenge.examples && generatedChallenge.examples.length > 0) {
        await Promise.all(
          generatedChallenge.examples.map(example =>
            ApiService.createTestCase({
              challengeId: createdChallenge.challengeId,
              input: example.input,
              output: example.output,
            })
          )
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onCancel(); // Volver al inicio después de guardar
      }, 2000);
    } catch (err) {
      setError('Error al guardar el challenge');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h2>✅ Challenge guardado exitosamente</h2>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="challenge-editor">
      <div className="editor-header">
        <h2>Editar Challenge Generado</h2>
        {generatedChallenge.reviewedBy && (
          <span className="review-badge">
            Revisado por: {generatedChallenge.reviewedBy}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">Dificultad:</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Fácil</option>
              <option value="Medium">Medio</option>
              <option value="Hard">Difícil</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (separados por coma):</label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="arrays, sorting, recursion"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timeLimit">Tiempo límite (ms):</label>
            <input
              id="timeLimit"
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="memoryLimit">Memoria límite (MB):</label>
            <input
              id="memoryLimit"
              type="number"
              name="memoryLimit"
              value={formData.memoryLimit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inputDescription">Descripción de entrada:</label>
          <textarea
            id="inputDescription"
            name="inputDescription"
            value={formData.inputDescription}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="outputDescription">Descripción de salida:</label>
          <textarea
            id="outputDescription"
            name="outputDescription"
            value={formData.outputDescription}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="examples-section">
          <h3>Ejemplos generados:</h3>
          {generatedChallenge.examples.map((example, idx) => (
            <div key={idx} className="example">
              <div><strong>Entrada:</strong> {example.input}</div>
              <div><strong>Salida:</strong> {example.output}</div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="state">Estado:</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="Draft">Borrador</option>
            <option value="Published">Publicado</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="button-group">
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
}
