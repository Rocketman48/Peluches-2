import React from 'react';
import Modal from './Modal';
import type { Character } from '@/types';
import { Sparkles, Layers, Scale, ShieldCheck, AlertTriangle, Lightbulb, Wand2 } from 'lucide-react';

export interface SkillReviewResult {
  summary: string;
  score: string;
  coherenceAssessment: string;
  differentiationAssessment: string;
  ultimateAssessment: string;
  strengthsAndWeaknessesAssessment: string;
  issuesFound: string[];
  suggestions: string[];
  readyToUse: boolean;
}

interface SkillReviewModalProps {
  open: boolean;
  onClose: () => void;
  character: Character;
  reviewResult: SkillReviewResult | null;
  loading: boolean;
  onRunAdaptation: () => void;
}

export default function SkillReviewModal({
  open,
  onClose,
  character,
  reviewResult,
  loading,
  onRunAdaptation,
}: SkillReviewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Revisión de Habilidades con IA"
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <p className="text-xs text-ink-light">
            Prioridad: Conservar la idea original y proponer cambios solo si aportan valor.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-light hover:text-ink transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onRunAdaptation();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-lavender hover:opacity-90 text-white shadow-xs transition-all active:scale-95"
            >
              <Wand2 className="w-4 h-4" />
              <span>Arreglar y Adaptar Esencia</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-lavender border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-semibold text-ink">Analizando habilidades de {character.name}...</div>
            <p className="text-xs text-ink-light max-w-sm mx-auto">
              Verificando coherencia entre Poder Básico, de Mejora y Definitivo, elemento ({character.element}) y rol ({character.role}).
            </p>
          </div>
        ) : !reviewResult ? (
          <div className="py-12 text-center text-ink-light text-xs">
            No se pudo obtener el análisis en este momento.
          </div>
        ) : (
          <>
            {/* Summary Banner */}
            <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-ink-light uppercase tracking-wider">
                  Diagnóstico General:
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-dark font-bold border border-forest/20">
                  {reviewResult.score}
                </span>
              </div>
              <p className="text-xs text-ink leading-relaxed">{reviewResult.summary}</p>
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Layers className="w-4 h-4 text-forest" />
                  <span>Coherencia (Poderes, Elemento y Rol)</span>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  {reviewResult.coherenceAssessment}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Scale className="w-4 h-4 text-gold-dark" />
                  <span>Diferenciación entre Poderes</span>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  {reviewResult.differentiationAssessment}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-lavender" />
                  <span>Definitivo y Costo</span>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  {reviewResult.ultimateAssessment}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  <span>Fortalezas vs Debilidades</span>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  {reviewResult.strengthsAndWeaknessesAssessment}
                </p>
              </div>
            </div>

            {/* Issues */}
            {reviewResult.issuesFound && reviewResult.issuesFound.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Observaciones detectadas:</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-xs text-amber-900 leading-relaxed">
                  {reviewResult.issuesFound.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-lavender-50 border border-lavender/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-lavender-dark">
                  <Lightbulb className="w-4 h-4 text-lavender shrink-0" />
                  <span>Sugerencias para enriquecer (respetando la esencia original):</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-xs text-lavender-dark leading-relaxed">
                  {reviewResult.suggestions.map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
