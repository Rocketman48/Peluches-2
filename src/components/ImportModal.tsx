import { useState } from 'react';
import Modal from './Modal';
import { ConfirmButton } from './UI';
import { FileDown, AlertCircle, Wand2, Sparkles } from 'lucide-react';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: Record<string, unknown>) => void;
}

const fieldGuide = `// Puedes pegar JSON o escribir notas libres sobre tu peluche.
// Ejemplo libre:
Nombre: Capitán Parche
Título: Pingüino de Pana
Elemento: Algodón y Hielo
Rol: Centinela Táctico
Descripción: Pingüino de peluche con bufanda azul marino y relleno mullido.
Poder Básico: Deslizamiento Suave (Se desliza en pisos lisos amortiguando caídas)
Poder de Mejora: Bufanda Térmica (Aísla a un compañero del frío)
Poder Definitivo: Ventisca de Plumas (Costo: 3 Cargas) (Crea un halo de plumón ártico que reconforta al equipo)
Fortalezas: Gran equilibrio, no pierde la calma, rápido
Debilidades: Teme a las aspiradoras, pesado al mojarse`;

export default function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleImport = () => {
    setError('');
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null) {
        setError('El JSON debe ser un objeto.');
        return;
      }
      if (!parsed.name || typeof parsed.name !== 'string') {
        setError('El personaje debe tener al menos un "name" (nombre).');
        return;
      }
      onImport(parsed);
      setText('');
    } catch {
      // If not strict JSON, prompt to use AI extraction
      setError('El texto no es un JSON directo. Usa el botón "Interpretar con IA" para procesarlo automáticamente.');
    }
  };

  const handleParseWithAI = async () => {
    if (!text.trim()) {
      setError('Pega primero el texto o notas del personaje.');
      return;
    }
    setError('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/parse-raw-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al procesar con IA.');
      }
      onImport(data);
      setText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'No se pudo interpretar el texto con IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleClose = () => {
    setText('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Pegar / Importar Personaje"
      size="lg"
      footer={
        <div className="flex flex-wrap gap-2 justify-between items-center w-full">
          <ConfirmButton variant="secondary" onConfirm={handleClose}>
            Cancelar
          </ConfirmButton>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleParseWithAI}
              disabled={aiLoading || !text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lavender text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
              {aiLoading ? 'Interpretando...' : 'Interpretar con IA'}
            </button>
            <ConfirmButton
              variant="gold"
              onConfirm={handleImport}
              className={text.trim() ? '' : 'opacity-50 pointer-events-none'}
            >
              Importar JSON
            </ConfirmButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gold-50 border border-gold/20">
          <FileDown className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
          <p className="text-sm text-ink leading-relaxed">
            Puedes pegar un <strong>JSON estructurado</strong> o simplemente <strong>texto libre / notas</strong> de tu personaje. Haz clic en <em>"Interpretar con IA"</em> para estructurarlo automáticamente sin alterar su esencia.
          </p>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={13}
          placeholder={fieldGuide}
          className="w-full px-4 py-3 rounded-xl border border-border bg-cream-50 text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none modal-scroll leading-relaxed"
          autoFocus
        />
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

