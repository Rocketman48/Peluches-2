import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function callGeminiJson(prompt: string, retries = 2): Promise<any> {
  const modelToUse = 'gemini-3.8-flash';
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      return JSON.parse(response.text?.trim() || '{}');
    } catch (err: any) {
      const is503 = err.message && (err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('high demand'));
      if (is503 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

// Helper to normalize character fields
function normalizeChar(character: any) {
  const p1Name = character.power_basic_name || character.power1Name || 'Poder Básico';
  const p1Desc = character.power_basic_description || character.power1Desc || '';
  const p2Name = character.power_upgrade_name || character.power2Name || 'Poder de Mejora';
  const p2Desc = character.power_upgrade_description || character.power2Desc || '';
  const p3Name = character.power_ultimate_name || character.power3Name || 'Poder Definitivo';
  const p3Desc = character.power_ultimate_description || character.power3Desc || '';
  const p3Cost = character.power_ultimate_cost || character.power3Cost || '3 Cargas';

  const strengths = Array.isArray(character.strengths)
    ? character.strengths.join(', ')
    : character.strengths || '';
  const weaknesses = Array.isArray(character.weaknesses)
    ? character.weaknesses.join(', ')
    : character.weaknesses || '';

  const concept = character.description || character.concept || '';

  return {
    name: character.name,
    title: character.title || '',
    concept,
    element: character.element || 'No especificado',
    role: character.role || 'No especificado',
    p1Name,
    p1Desc,
    p2Name,
    p2Desc,
    p3Name,
    p3Desc,
    p3Cost,
    strengths,
    weaknesses,
  };
}

// Endpoint: AI Review Abilities
app.post('/api/review-skills', async (req, res) => {
  try {
    const rawChar = req.body;
    if (!rawChar || !rawChar.name) {
      return res.status(400).json({ error: 'Falta la información del personaje' });
    }

    const c = normalizeChar(rawChar);

    const prompt = `Eres el asistente experto de diseño para el universo de personajes basados en peluches reales de Jandel.
Tu objetivo es REVISAR LA INFORMACIÓN DE HABILIDADES del personaje sin transformar al personaje ni sustituir sus ideas.

REGLAS DE REVISIÓN:
1. Coherencia entre los tres poderes (Poder 1: Básico, Poder 2: Mejora, Poder 3: Definitivo).
2. Diferenciación clara entre Poder 1, Poder 2 y Poder 3 (cada uno debe tener un propósito distinto).
3. Relación entre habilidades, elemento (${c.element}) y rol (${c.role}).
4. Claridad de las descripciones.
5. Originalidad de las habilidades sin salirse del concepto de peluche.
6. Coherencia del costo del definitivo (Poder 3: ${c.p3Cost}).
7. Relación entre fortalezas y debilidades.
8. Evitar habilidades repetitivas o demasiado genéricas.
9. Conservar la idea y esencia original del usuario. No reemplazar una idea si ya funciona.

DATOS DEL PERSONAJE:
- Nombre: ${c.name} (${c.title})
- Concepto/Peluche: ${c.concept}
- Elemento: ${c.element}
- Rol: ${c.role}
- Poder 1 (Básico): ${c.p1Name} -> ${c.p1Desc}
- Poder 2 (Mejora): ${c.p2Name} -> ${c.p2Desc}
- Poder 3 (Definitivo): ${c.p3Name} (Costo: ${c.p3Cost}) -> ${c.p3Desc}
- Fortalezas: ${c.strengths}
- Debilidades: ${c.weaknesses}

Devuelve un análisis estructurado en formato JSON con la siguiente estructura:
{
  "summary": "Resumen conciso y cálido de la evaluación general",
  "score": "Calificación cualitativa (ej: 'Sólido y Carismático', 'Requiere Ajustes Leves', 'Bien Diferenciado')",
  "coherenceAssessment": "Evaluación de coherencia entre los 3 poderes, el elemento y el rol",
  "differentiationAssessment": "Evaluación de la distinción entre Poder 1, 2 y 3",
  "ultimateAssessment": "Evaluación de impacto y costo del Poder 3",
  "strengthsAndWeaknessesAssessment": "Evaluación de la relación entre fortalezas y debilidades",
  "issuesFound": ["Lista de problemas específicos encontrados (vacía si todo está excelente)"],
  "suggestions": ["Sugerencias constructivas que respetan al 100% la idea original"],
  "readyToUse": true
}`;

    const parsed = await callGeminiJson(prompt);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/review-skills:', err);
    return res.status(500).json({ error: err.message || 'Error al revisar habilidades' });
  }
});

// Endpoint: AI Adapt Essence ("Arreglar y Adaptar Esencia")
app.post('/api/adapt-essence', async (req, res) => {
  try {
    const rawChar = req.body;
    if (!rawChar || !rawChar.name) {
      return res.status(400).json({ error: 'Falta la información del personaje' });
    }

    const c = normalizeChar(rawChar);

    const prompt = `Eres el asistente de diseño y desarrollo de personajes de peluches de Jandel.
Tu tarea es ejecutar la función "Arreglar y Adaptar Esencia".
Esta función DEBE MEJORAR las habilidades del personaje SIN CAMBIAR la identidad ni transformar al personaje.

DEBES MANTENER ESTRICTAMENTE:
- Concepto e identidad de peluche
- Elemento: ${c.element}
- Rol: ${c.role}
- Intención de cada poder
- La idea principal del usuario

PUEDES MEJORAR:
- Redacción (hacerla más clara, evocadora y profesional sin sonar a videojuego genérico)
- Nombres de poderes (hacerlos más distintivos y acordes a su peluche)
- Coherencia entre habilidades
- Diferenciación clara entre Poder 1, Poder 2 y Poder 3 (definitivo con costo razonable)
- Equilibrio conceptual
- Relación entre poderes, fortalezas y debilidades

DATOS ORIGINALES:
- Nombre: ${c.name}
- Concepto: ${c.concept}
- Elemento: ${c.element}
- Rol: ${c.role}
- Poder 1: ${c.p1Name} -> ${c.p1Desc}
- Poder 2: ${c.p2Name} -> ${c.p2Desc}
- Poder 3: ${c.p3Name} (Costo: ${c.p3Cost}) -> ${c.p3Desc}
- Fortalezas: ${c.strengths}
- Debilidades: ${c.weaknesses}

Devuelve un JSON con:
{
  "explanation": "Breve explicación de las mejoras realizadas y por qué respetan la esencia original",
  "adapted": {
    "power_basic_name": "...",
    "power_basic_description": "...",
    "power_upgrade_name": "...",
    "power_upgrade_description": "...",
    "power_ultimate_name": "...",
    "power_ultimate_cost": "...",
    "power_ultimate_description": "...",
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."]
  }
}`;

    const parsed = await callGeminiJson(prompt);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/adapt-essence:', err);
    return res.status(500).json({ error: err.message || 'Error al adaptar la esencia' });
  }
});

// Endpoint: Parse Raw Character Text
app.post('/api/parse-raw-text', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Texto no proporcionado' });
    }

    const prompt = `Analiza el siguiente texto sobre un personaje de peluche y extrae sus campos estructurados.
No inventes datos absurdos; si algo no se menciona déjalo vacío o infiérelo respetuosamente.

TEXTO:
${rawText}

Devuelve un JSON con este formato exacto:
{
  "name": "Nombre del peluche",
  "title": "Título o apodo (ej: El Guardián Acolchado)",
  "description": "Descripción general o concepto del peluche",
  "element": "Elemento (ej: Algodón, Lana, Costura, Fuego Cálido, Viento Suave, etc.)",
  "role": "Rol (ej: Defensor Protector, Vanguardia Ágil, Estratega de Apoyo)",
  "power_basic_name": "Nombre Poder 1 (Básico)",
  "power_basic_type": "Tipo Poder 1",
  "power_basic_description": "Descripción Poder 1",
  "power_upgrade_name": "Nombre Poder 2 (Mejora)",
  "power_upgrade_type": "Tipo Poder 2",
  "power_upgrade_description": "Descripción Poder 2",
  "power_ultimate_name": "Nombre Poder 3 (Definitivo)",
  "power_ultimate_type": "Definitivo",
  "power_ultimate_cost": "Costo (ej: 3 Cargas, 100%, 3 Turnos)",
  "power_ultimate_description": "Descripción Poder 3",
  "stat_attack": 50,
  "stat_defense": 50,
  "stat_speed": 50,
  "stat_magic": 50,
  "stat_resistance": 50,
  "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
  "weaknesses": ["Debilidad 1", "Debilidad 2", "Debilidad 3"]
}`;

    const parsed = await callGeminiJson(prompt);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/parse-raw-text:', err);
    return res.status(500).json({ error: err.message || 'Error al procesar el texto' });
  }
});

// Endpoint: Test or Clone GitHub Repo
app.post('/api/sync-github', async (req, res) => {
  const repoUrl = req.body?.repoUrl || 'https://github.com/Rocketman48/pryectPeluches-U.git';
  try {
    const testCmd = `git ls-remote "${repoUrl}"`;
    const { stdout } = await execAsync(testCmd, { timeout: 10000 });
    return res.json({
      success: true,
      message: 'Conectado exitosamente con el repositorio público en GitHub.',
      remoteRefs: stdout.slice(0, 200),
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: 'No se pudo conectar al repositorio.',
      rawError: err.message || '',
    });
  }
});

// Start server and Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
