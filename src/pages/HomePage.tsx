import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logHistory, teamToInfo } from '@/lib/history';
import type { Team, Character, TeamWithCount } from '@/types';
import { TeamCard } from '@/components/Cards';
import TeamFormModal from '@/components/TeamFormModal';
import ImportModal from '@/components/ImportModal';
import { LoadingSpinner, EmptyState } from '@/components/UI';
import { Plus, Users, GitBranch, Download, ClipboardCopy, Sparkles } from 'lucide-react';

interface HomePageProps {
  onOpenTeam: (teamId: string) => void;
}

export default function HomePage({ onOpenTeam }: HomePageProps) {
  const [teams, setTeams] = useState<TeamWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: true });

    if (!teamsData) {
      setLoading(false);
      return;
    }

    const { data: charsData } = await supabase.from('characters').select('team_id');

    const counts = new Map<string, number>();
    (charsData || []).forEach((c: { team_id: string }) => {
      counts.set(c.team_id, (counts.get(c.team_id) || 0) + 1);
    });

    const enriched: TeamWithCount[] = (teamsData as Team[]).map((t) => ({
      ...t,
      character_count: counts.get(t.id) || 0,
    }));

    setTeams(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleSave = async (data: { name: string; concept: string; image_url: string }) => {
    const { data: inserted, error } = await supabase
      .from('teams')
      .insert(data)
      .select()
      .single();

    if (error || !inserted) return;

    await logHistory({
      teamId: (inserted as Team).id,
      actionType: 'team_created',
      affectedName: (inserted as Team).name,
      newInfo: teamToInfo(inserted as Team),
      status: 'created',
    });

    setFormOpen(false);
    loadTeams();
  };

  const handleImportCharacter = async (parsed: Record<string, unknown>) => {
    if (!teams.length) return;
    const teamId = teams[0].id;
    const charData = {
      team_id: teamId,
      name: (parsed.name as string) || 'Peluche Sin Nombre',
      title: (parsed.title as string) || '',
      element: (parsed.element as string) || 'Algodón',
      role: (parsed.role as string) || 'Defensor',
      image_url: (parsed.image_url as string) || '',
      description: (parsed.description as string) || '',
      power_basic_name: (parsed.power_basic_name as string) || '',
      power_basic_type: (parsed.power_basic_type as string) || '',
      power_basic_description: (parsed.power_basic_description as string) || '',
      power_upgrade_name: (parsed.power_upgrade_name as string) || '',
      power_upgrade_type: (parsed.power_upgrade_type as string) || '',
      power_upgrade_description: (parsed.power_upgrade_description as string) || '',
      power_ultimate_name: (parsed.power_ultimate_name as string) || '',
      power_ultimate_type: (parsed.power_ultimate_type as string) || '',
      power_ultimate_description: (parsed.power_ultimate_description as string) || '',
      power_ultimate_cost: (parsed.power_ultimate_cost as string) || '3 Cargas',
      stat_attack: Number(parsed.stat_attack) || 50,
      stat_defense: Number(parsed.stat_defense) || 50,
      stat_speed: Number(parsed.stat_speed) || 50,
      stat_magic: Number(parsed.stat_magic) || 50,
      stat_resistance: Number(parsed.stat_resistance) || 50,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      status: 'approved',
    };

    const { data: inserted, error } = await supabase.from('characters').insert(charData).select().single();
    if (error || !inserted) return;

    await logHistory({
      characterId: inserted.id,
      teamId,
      actionType: 'character_imported',
      affectedName: inserted.name,
      newInfo: charData,
      source: 'user',
      status: 'approved',
    });

    loadTeams();
  };

  const handleExportBackup = async () => {
    const [{ data: allTeams }, { data: allChars }] = await Promise.all([
      supabase.from('teams').select('*'),
      supabase.from('characters').select('*'),
    ]);

    const backup = {
      project: 'Peluches-U: Universo de Jandel',
      export_date: new Date().toISOString(),
      teams: allTeams || [],
      characters: allChars || [],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `peluches-u-respaldo-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-semibold text-ink">NÚCLEO TEST</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-50 text-forest-dark border border-forest/20">
                Peluches-U
              </span>
            </div>
            <p className="text-sm text-ink-light mt-0.5">El centro del universo de peluches de Jandel</p>
          </div>
          <button
            onClick={handleExportBackup}
            className="p-2 rounded-xl bg-card border border-border text-ink-light hover:text-ink hover:bg-cream-200 transition-colors shadow-xs"
            title="Descargar Respaldo JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* GitHub sync badge */}
        <div className="mt-3 p-2.5 rounded-xl bg-card border border-border flex items-center justify-between gap-2 shadow-xs text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-forest-50 text-forest shrink-0">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <span className="truncate text-ink-light">
              Repositorio: <strong className="text-ink font-mono">Rocketman48/pryectPeluches-U</strong>
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-forest-50 text-forest-dark border border-forest/20 shrink-0">
            Conectado
          </span>
        </div>
      </div>

      {/* Teams section */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Equipos</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setImportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 transition-all shadow-xs active:scale-95"
              title="Pegar notas o texto de personaje con IA"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pegar con IA</span>
            </button>
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Cargando equipos..." />
        ) : teams.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No hay equipos todavía"
            description="Crea tu primer equipo para empezar a organizar tus personajes."
            action={
              <button
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white font-medium text-sm hover:bg-forest-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear equipo
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                characterCount={team.character_count}
                onClick={() => onOpenTeam(team.id)}
              />
            ))}
          </div>
        )}
      </div>

      <TeamFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImportCharacter} />
    </div>
  );
}
