import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
      throw new Error('GEMINI_API_KEY environment variable is not set or placeholder.');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// API endpoint for smart speech/text parser
app.post('/api/parse-appointment', async (req, res) => {
  const { text, clientDate } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text prompt is required.' });
  }

  // Fallback anchor date
  const referenceDate = clientDate || new Date().toISOString().split('T')[0];

  try {
    const ai = getGeminiClient();
    
    const prompt = `Você é o assistente pessoal de IA de um pastor de igreja (Pastor Pro Premium).
Sua tarefa é analisar a frase a seguir em português e transformá-la em um compromisso de agenda estruturado.

Texto falado ou escrito do pastor: "${text}"

Regras de negócio:
1. Extraia o título do compromisso de forma clara e profissional.
2. Identifique a data considerando que o dia de referência (hoje) é: ${referenceDate}. 
   - Se o texto disser "amanhã", calcule o dia seguinte em relação a ${referenceDate}.
   - Se disser "segunda-feira", calcule a data da próxima segunda-feira.
   - Retorne o formato "YYYY-MM-DD".
3. Identifique o horário no formato de 24h "HH:MM". Se não encontrar, use "09:00".
4. Identifique o local. Se não houver, coloque "Igreja" ou "Gabinete Pastoral".
5. Forneça uma breve descrição profissional do compromisso.
6. Determine a prioridade como uma das seguintes: "urgente", "prioridade", "importante", "normal".
7. Determine a categoria baseada no contexto:
   - "cultos" (se envolver cultos, celebrações, pregação, púlpito)
   - "visitas" (visitas a membros, enfermos, aconselhamento pastoral)
   - "casamentos" (cerimônias de casamento ou ensaios)
   - "batismos" (batismo, águas)
   - "reunioes" (reuniões de diretoria, conselho, presbitério, líderes)
   - "administracao" (assuntos de escritório, compras, finanças da igreja)
   - "evangelismo" (impactos, missões, trabalho externo)
   - "estudos" (estudo bíblico, escola bíblica dominical, teologia, discipulado)
   - "eventos" (congressos, festividades, conferências)
   - "particular" (compromissos pessoais, lazer, família)

Por favor, responda estritamente em formato JSON estruturado com o seguinte esquema:
{
  "title": "Título resumido e profissional do compromisso",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "Localização",
  "description": "Breve descrição em português",
  "priority": "urgente | prioridade | importante | normal",
  "category": "cultos | visitas | casamentos | batismos | reunioes | administracao | evangelismo | estudos | eventos | particular"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsedText = response.text || '';
    const jsonResult = JSON.parse(parsedText.trim());

    return res.json({ appointment: jsonResult });
  } catch (error: any) {
    console.error('Gemini API Error in backend:', error.message || error);
    return res.status(500).json({ 
      error: 'Failed to parse text via AI', 
      details: error.message || String(error)
    });
  }
});

// Serve health status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Set up Vite development server or production static assets
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mounting Vite in middleware mode (development)...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving production static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pastor Pro Premium running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
