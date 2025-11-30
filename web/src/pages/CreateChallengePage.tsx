import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import type { CreateChallengeDto, Difficulty, ChallengeState } from '../types/challenge.types';
import { ArrowLeft, Plus, X } from 'lucide-react';
import './CreateChallengePage.css';

interface TestCaseInput {
  input: string;
  output: string;
}

export function CreateChallengePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputDescription: '',
    outputDescription: '',
    difficulty: 'Medium' as Difficulty,
    tags: '',
    timeLimit: 1000,
    memoryLimit: 256,
    state: 'Draft' as ChallengeState,
  });

  const [testCases, setTestCases] = useState<TestCaseInput[]>([
    { input: '', output: '' },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'output', value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validar que haya al menos un test case con datos
      const validTestCases = testCases.filter(tc => tc.input.trim() && tc.output.trim());
      if (validTestCases.length === 0) {
        setError('Debes agregar al menos un test case válido');
        setSaving(false);
        return;
      }

      const challengeData: CreateChallengeDto = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        timeLimit: Number(formData.timeLimit),
        memoryLimit: Number(formData.memoryLimit),
      };

      // 1. Crear el challenge
      const createdChallenge = await ApiService.createChallenge(challengeData);

      // 2. Crear los test cases
      await Promise.all(
        validTestCases.map(testCase =>
          ApiService.createTestCase({
            challengeId: createdChallenge.challengeId,
            input: testCase.input,
            output: testCase.output,
          })
        )
      );

      // Redirigir a la lista de challenges
      navigate('/challenges');
    } catch (err) {
      setError('Error al crear el challenge');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-challenge-page">
      <div className="page-header">
        <button onClick={() => navigate('/challenges')} className="back-button">
          <ArrowLeft size={20} />
          Volver
        </button>
        <h1>Crear Nuevo Challenge</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h2>Información Básica</h2>

          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej: Suma de dos números"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Describe el problema a resolver..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Dificultad *</label>
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
              <label htmlFor="state">Estado *</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (separados por coma)</label>
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

        <div className="form-section">
          <h2>Límites</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="timeLimit">Tiempo Límite (ms) *</label>
              <input
                id="timeLimit"
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                required
                min="100"
                step="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="memoryLimit">Memoria Límite (MB) *</label>
              <input
                id="memoryLimit"
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                required
                min="32"
                step="32"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Test Cases *</h2>
            <button type="button" onClick={addTestCase} className="btn-add">
              <Plus size={18} />
              Agregar Test Case
            </button>
          </div>

          <div className="test-cases-list">
            {testCases.map((testCase, index) => (
              <div key={index} className="test-case-item">
                <div className="test-case-header">
                  <h3>Test Case {index + 1}</h3>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="btn-remove"
                      title="Eliminar"
                    >
                      <X size={18} />
                      <span className="btn-text">Eliminar</span>
                    </button>
                  )}
                </div>

                <div className="test-case-fields">
                  <div className="form-group">
                    <label>Entrada</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      rows={3}
                      placeholder="Ejemplo: 5 3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Salida Esperada</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                      rows={3}
                      placeholder="Ejemplo: 8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/challenges')} className="btn-cancel" disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? 'Creando...' : 'Crear Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
}
