import type { Team, Character, Proposal, HistoryEntry } from '@/types';

const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-sofa',
    name: 'Escuadrón del Sofá',
    concept: 'Los guardianes principales del descanso y protectores de la sala.',
    image_url: '',
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: 'team-repisa',
    name: 'Vanguardia de la Repisa',
    concept: 'Observadores estratégicos situados en altura con visión total de la habitación.',
    image_url: '',
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
];

const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char-barnaby',
    team_id: 'team-sofa',
    name: 'Barnaby Garra Suave',
    title: 'El Guardián Acolchado',
    element: 'Algodón y Lana',
    role: 'Defensor Protector',
    image_url: '',
    description: 'Oso de felpa marrón clásico con chaleco de paño tejido y parche en la oreja derecha. Su relleno denso le permite absorber cualquier golpe.',
    power_basic_name: 'Abrazo Amortiguador',
    power_basic_type: 'Defensa Activa',
    power_basic_description: 'Extiende sus brazos mullidos para proteger a un aliado cercano, mitigando el impacto de corrientes de aire frío o caídas.',
    power_upgrade_name: 'Puntada de Esperanza',
    power_upgrade_type: 'Soporte y Reparación',
    power_upgrade_description: 'Canaliza la calidez acumulada en su costura para remendar fibras dañadas de compañeros y reconfortar su moral.',
    power_ultimate_name: 'Muralla de Felpa Viva',
    power_ultimate_type: 'Definitivo',
    power_ultimate_description: 'Expande su aura mullida en toda el área, generando un espacio de confort absoluto que disipa tensiones y bloquea cualquier hostilidad.',
    power_ultimate_cost: '3 Cargas de Calidez',
    stat_attack: 45,
    stat_defense: 95,
    stat_speed: 30,
    stat_magic: 60,
    stat_resistance: 90,
    strengths: ['Alta absorción de impactos', 'Genera calma inmediata en el equipo', 'Resistente al desgaste'],
    weaknesses: ['Movilidad lenta por relleno pesado', 'Vulnerable a enganches en alambres', 'Sensible a humedad prolongada'],
    status: 'approved',
    created_at: new Date('2026-10-01T01:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T01:00:00Z').toISOString(),
  },
  {
    id: 'char-dino',
    team_id: 'team-sofa',
    name: 'Dino Chispa',
    title: 'El Ímpetu Esmeralda',
    element: 'Fuego Cálido',
    role: 'Vanguardia Ágil',
    image_url: '',
    description: 'Tiranosaurio de felpa verde con cresta de fieltro amarillo vibrante. Es impulsivo, alegre y jamás se queda quieto.',
    power_basic_name: 'Coletazo de Fieltro',
    power_basic_type: 'Ofensivo Físico',
    power_basic_description: 'Gira velozmente proyectando su cola acolchada para abrir paso y apartar objetos sueltos del camino.',
    power_upgrade_name: 'Rugido Chicharra',
    power_upgrade_type: 'Distracción y Estímulo',
    power_upgrade_description: 'Hace sonar su silbato interno emitiendo un chirrido característico que confunde a los oponentes y recarga el ánimo de los suyos.',
    power_ultimate_name: 'Embestida Cometa',
    power_ultimate_type: 'Definitivo',
    power_ultimate_description: 'Se lanza en un vuelo parabólico rodeado de un resplandor dorado que ilumina el entorno y desbarata las sombras del cuarto.',
    power_ultimate_cost: '4 Cargas de Energía',
    stat_attack: 85,
    stat_defense: 50,
    stat_speed: 85,
    stat_magic: 70,
    stat_resistance: 45,
    strengths: ['Excelente velocidad de arranque', 'Muy dinámico y carismático', 'Gran impacto sorpresivo'],
    weaknesses: ['Actúa sin medir riesgos', 'Costuras de las patas sensibles a tirones', 'Poca resistencia a batallas largas'],
    status: 'approved',
    created_at: new Date('2026-10-01T01:10:00Z').toISOString(),
    updated_at: new Date('2026-10-01T01:10:00Z').toISOString(),
  },
  {
    id: 'char-lulu',
    team_id: 'team-repisa',
    name: 'Lulú Tejedora',
    title: 'La Guía de Seda',
    element: 'Costura y Seda',
    role: 'Estratega de Apoyo',
    image_url: '',
    description: 'Gatita de peluche blanca con ovillo de hilo y cascabel de madera. Metódica, atenta y capaz de leer el tablero de la habitación.',
    power_basic_name: 'Hilván Guiado',
    power_basic_type: 'Control Táctico',
    power_basic_description: 'Lanza una hebra suave para conectar a dos aliados, permitiéndoles coordinar sus posiciones y evitar resbalones.',
    power_upgrade_name: 'Puntada Invisible',
    power_upgrade_type: 'Refuerzo de Estructura',
    power_upgrade_description: 'Aplica una serie de puntos firmes para estabilizar a un compañero inestable y devolverle firmeza.',
    power_ultimate_name: 'Red del Destino Tejido',
    power_ultimate_type: 'Definitivo',
    power_ultimate_description: 'Despliega un tapiz de hebras resplandecientes que inmoviliza amenazas y sostiene a cualquier peluche en apuros.',
    power_ultimate_cost: '3 Hebras Doradas',
    stat_attack: 40,
    stat_defense: 60,
    stat_speed: 75,
    stat_magic: 90,
    stat_resistance: 70,
    strengths: ['Visión global del terreno', 'Control de espacios', 'Gran capacidad de soporte a distancia'],
    weaknesses: ['Baja fuerza física directa', 'Requiere tiempo para desenredar sus hilos si es sorprendida', 'Vulnerable a cortes'],
    status: 'approved',
    created_at: new Date('2026-10-01T01:20:00Z').toISOString(),
    updated_at: new Date('2026-10-01T01:20:00Z').toISOString(),
  },
];

class LocalTable<T extends { id: string }> {
  private key: string;
  private initial: T[];

  constructor(key: string, initial: T[]) {
    this.key = `nucleo_${key}`;
    this.initial = initial;
  }

  getAll(): T[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.key);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error(`Error reading ${this.key}`, e);
    }
    this.save(this.initial);
    return [...this.initial];
  }

  save(items: T[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.key, JSON.stringify(items));
      }
    } catch (e) {
      console.error(`Error saving ${this.key}`, e);
    }
  }

  insert(item: Partial<T>): T {
    const items = this.getAll();
    const newItem = {
      ...item,
      id: item.id || 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      created_at: (item as any).created_at || new Date().toISOString(),
      updated_at: (item as any).updated_at || new Date().toISOString(),
    } as unknown as T;
    items.unshift(newItem);
    this.save(items);
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    this.save(filtered);
    return filtered.length < items.length;
  }
}

const teamsStore = new LocalTable<Team>('teams', INITIAL_TEAMS);
const charactersStore = new LocalTable<Character>('characters', INITIAL_CHARACTERS);
const proposalsStore = new LocalTable<Proposal>('proposals', []);
const historyStore = new LocalTable<HistoryEntry>('history', []);

export class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderColumn?: string;
  private orderAscending = true;
  private limitCount?: number;
  private rangeBounds?: [number, number];

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getStore(): LocalTable<any> {
    switch (this.tableName) {
      case 'teams':
        return teamsStore;
      case 'characters':
        return charactersStore;
      case 'proposals':
        return proposalsStore;
      case 'history':
        return historyStore;
      default:
        return new LocalTable(this.tableName, []);
    }
  }

  select(columns = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push((item) => values.includes(item[column]));
    return this;
  }

  is(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }) {
    this.orderColumn = column;
    this.orderAscending = opts?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.rangeBounds = [from, to];
    return this;
  }

  async then(resolve: (val: any) => void) {
    const store = this.getStore();
    let data = store.getAll();

    for (const filter of this.filters) {
      data = data.filter(filter);
    }

    if (this.orderColumn) {
      const col = this.orderColumn;
      const asc = this.orderAscending;
      data.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.rangeBounds) {
      const [from, to] = this.rangeBounds;
      data = data.slice(from, to + 1);
    } else if (this.limitCount !== undefined) {
      data = data.slice(0, this.limitCount);
    }

    resolve({ data, error: null });
  }

  async single() {
    const store = this.getStore();
    let data = store.getAll();
    for (const filter of this.filters) {
      data = data.filter(filter);
    }
    const item = data[0] || null;
    return { data: item, error: item ? null : { message: 'Not found' } };
  }

  async maybeSingle() {
    const store = this.getStore();
    let data = store.getAll();
    for (const filter of this.filters) {
      data = data.filter(filter);
    }
    return { data: data[0] || null, error: null };
  }

  insert(recordOrRecords: any) {
    const store = this.getStore();
    if (Array.isArray(recordOrRecords)) {
      const inserted = recordOrRecords.map((r) => store.insert(r));
      return {
        select: () => ({
          single: async () => ({ data: inserted[0] || null, error: null }),
          then: (resolve: (val: any) => void) => resolve({ data: inserted, error: null }),
        }),
        then: (resolve: (val: any) => void) => resolve({ data: inserted, error: null }),
      };
    } else {
      const inserted = store.insert(recordOrRecords);
      return {
        select: () => ({
          single: async () => ({ data: inserted, error: null }),
          then: (resolve: (val: any) => void) => resolve({ data: inserted, error: null }),
        }),
        then: (resolve: (val: any) => void) => resolve({ data: inserted, error: null }),
      };
    }
  }

  update(updates: any) {
    const store = this.getStore();
    return {
      eq: (column: string, value: any) => ({
        then: (resolve: (val: any) => void) => {
          if (column === 'id') {
            const updated = store.update(value, updates);
            resolve({ data: updated, error: null });
          } else {
            const items = store.getAll();
            items.forEach((item) => {
              if (item[column] === value) {
                store.update(item.id, updates);
              }
            });
            resolve({ data: null, error: null });
          }
        },
      }),
      then: (resolve: (val: any) => void) => resolve({ data: null, error: null }),
    };
  }

  delete() {
    const store = this.getStore();
    return {
      eq: (column: string, value: any) => ({
        then: (resolve: (val: any) => void) => {
          if (column === 'id') {
            store.delete(value);
            // Cascade deletes if team or character deleted
            if (this.tableName === 'teams') {
              const chars = charactersStore.getAll().filter((c) => c.team_id === value);
              chars.forEach((c) => charactersStore.delete(c.id));
            } else if (this.tableName === 'characters') {
              const props = proposalsStore.getAll().filter((p) => p.character_id === value);
              props.forEach((p) => proposalsStore.delete(p.id));
            }
          }
          resolve({ data: null, error: null });
        },
      }),
      then: (resolve: (val: any) => void) => resolve({ data: null, error: null }),
    };
  }
}

export const mockSupabase = {
  from: (table: string) => new MockQueryBuilder(table),
};
