import React from 'react';
import Modal from './Modal';
import type { Character } from '@/types';
import { Sparkles, Check, FileEdit, Wand2 } from 'lucide-react';

export interface AdaptedEssenceResult {
  explanation: string;
  adapted: {
    power_basic_name: string;
    power_basic_description: string;
    power_upgrade_name: string;
    power_upgrade_description: string;
    power_ultimate_name: string;
    power_ultimate_cost: string;
    power_ultimate_description: string;
    strengths?: string[];
    weaknesses?: string[];
  };
}

interface AdaptEssenceModalProps {
  open: boolean;
  onClose: () => void;
  character: Character;
  adaptedResult: AdaptedEssenceResult | null;
  loading: boolean;
  onApplyDirectly: (updates: Partial<Character>) => void;
  onCreateProposal: (updates: Partial<Character>) => void;
}

export default function AdaptEssenceModal({
  open,
  onClose,
  character,
  adaptedResult,
  loading,
  onApplyDirectly,
  onCreateProposal,
}: AdaptEssenceModalProps) {
  const adapted = adaptedResult?.adapted;

  const getUpdates = (): Partial<Character> => {
    if (!adapted) return {};
    return {
      power_basic_name: adapted.power_basic_name || character.power_basic_name,
      power_basic_description: adapted.power_basic_description || character.power_basic_description,
      power_upgrade_name: adapted.power_upgrade_name || character.power_upgrade_name,
      power_upgrade_description: adapted.power_upgrade_description || character.power_upgrade_description,
      power_ultimate_name: adapted.power_ultimate_name || character.power_ultimate_name,
      power_ultimate_cost: adapted.power_ultimate_cost || character.power_ultimate_cost,
      power_ultimate_description: adapted.power_ultimate_description || character.power_ultimate_description,
      ...(adapted.strengths && adapted.strengths.length > 0 ? { strengths: adapted.strengths } : {}),
      ...(adapted.weaknesses && adapted.weaknesses.length > 0 ? { weaknesses: adapted.weaknesses } : {}),
    };
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Arreglar y Adaptar Esencia"
      size="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <p className="text-xs text-ink-light">
            Tú decides si aplicar los cambios directamente o guardarlos como propuesta para revisión.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-light hover:text-ink transition-colors"
            >
              Mantener Original
            </button>
            <button
              onClick={() => {
                onCreateProposal(getUpdates());
                onClose();
              }}
              disabled={loading || !adapted}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-lavender/40 bg-card text-lavender-dark hover:bg-lavender-50 transition-all disabled:opacity-50"
            >
              <FileEdit className="w-3.5 h-3.5 inline mr-1" />
              Crear Propuesta
            </button>
            <button
              onClick={() => {
                onApplyDirectly(getUpdates());
                onClose();
              }}
              disabled={loading || !adapted}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-forest hover:bg-forest-dark text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              Aplicar al Personaje
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-lavender border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-semibold text-ink">
              Puliendo habilidades de {character.name}...
            </div>
            <p className="text-xs text-ink-light max-w-md mx-auto">
              Preservando concepto de peluche, elemento ({character.element}), rol ({character.role}) y la intención original de cada poder.
            </p>
          </div>
        ) : !adaptedResult || !adapted ? (
          <div className="py-12 text-center text-ink-light text-xs">
            No se pudo generar la propuesta de adaptación.
          </div>
        ) : (
          <>
            {/* Explanation */}
            <div className="p-3.5 rounded-xl bg-lavender-50 border border-lavender/30 space-y-1">
              <div className="text-xs font-bold text-lavender-dark flex items-center gap-1.5 uppercase tracking-wide">
                <Wand2 className="w-4 h-4 text-lavender" />
                <span>Criterio de Adaptación Aplicado:</span>
              </div>
              <p className="text-xs text-ink leading-relaxed">
                {adaptedResult.explanation}
              </p>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 rounded-xl border border-border bg-cream-50/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold uppercase text-ink-light">Versión Actual</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-card text-ink-light border border-border">
                    Sin cambios
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-ink">Poder Básico:</span> {character.power_basic_name}
                    <p className="text-ink-light mt-0.5 leading-relaxed">{character.power_basic_description}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Poder de Mejora:</span> {character.power_upgrade_name}
                    <p className="text-ink-light mt-0.5 leading-relaxed">{character.power_upgrade_description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gold-dark">Poder Definitivo:</span>
                      <span className="text-[10px] text-ink-light">{character.power_ultimate_cost}</span>
                    </div>
                    <p className="font-medium text-ink">{character.power_ultimate_name}</p>
                    <p className="text-ink-light mt-0.5 leading-relaxed">{character.power_ultimate_description}</p>
                  </div>
                </div>
              </div>

              {/* Adapted */}
              <div className="p-4 rounded-xl border-2 border-lavender/40 bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-lavender-100">
                  <span className="text-xs font-bold uppercase text-lavender-dark flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lavender" />
                    Versión Adaptada (Esencia Pulida)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-lavender-50 text-lavender-dark font-semibold">
                    Recomendada
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-lavender-50/50 p-2.5 rounded-lg border border-lavender/20">
                    <span className="font-bold text-forest">Poder Básico:</span> {adapted.power_basic_name}
                    <p className="text-ink mt-0.5 leading-relaxed">{adapted.power_basic_description}</p>
                  </div>
                  <div className="bg-lavender-50/50 p-2.5 rounded-lg border border-lavender/20">
                    <span className="font-bold text-forest">Poder de Mejora:</span> {adapted.power_upgrade_name}
                    <p className="text-ink mt-0.5 leading-relaxed">{adapted.power_upgrade_description}</p>
                  </div>
                  <div className="bg-gold-50/60 p-2.5 rounded-lg border border-gold/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gold-dark">Poder Definitivo:</span>
                      <span className="text-[10px] font-semibold text-gold-dark px-1.5 py-0.5 rounded bg-gold-100">
                        Costo: {adapted.power_ultimate_cost}
                      </span>
                    </div>
                    <p className="font-bold text-ink mt-0.5">{adapted.power_ultimate_name}</p>
                    <p className="text-ink mt-0.5 leading-relaxed">{adapted.power_ultimate_description}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
