import { Appointment, AppointmentCategory, AppointmentPriority } from '../types';

export function parseAppointmentTextLocally(text: string): Partial<Appointment> {
  const result: Partial<Appointment> = {
    title: 'Novo Compromisso',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: 'Igreja',
    description: 'Criado via assistente inteligente',
    priority: 'normal',
    category: 'particular',
  };

  const lower = text.toLowerCase();

  // Category determination
  if (lower.includes('culto') || lower.includes('pregação') || lower.includes('pregar')) {
    result.category = 'cultos';
    result.title = 'Culto';
  } else if (lower.includes('visita') || lower.includes('visitar') || lower.includes('aconselhamento')) {
    result.category = 'visitas';
    result.title = 'Visita Pastoral';
  } else if (lower.includes('casamento') || lower.includes('noivado')) {
    result.category = 'casamentos';
    result.title = 'Casamento';
  } else if (lower.includes('batismo') || lower.includes('batizar')) {
    result.category = 'batismos';
    result.title = 'Cerimônia de Batismo';
  } else if (lower.includes('reunião') || lower.includes('reuniao') || lower.includes('presbitério') || lower.includes('conselho')) {
    result.category = 'reunioes';
    result.title = 'Reunião';
  } else if (lower.includes('administração') || lower.includes('finanças') || lower.includes('escritório') || lower.includes('administrativo')) {
    result.category = 'administracao';
    result.title = 'Trabalho Administrativo';
  } else if (lower.includes('evangelismo') || lower.includes('missões') || lower.includes('rua') || lower.includes('evangelizar')) {
    result.category = 'evangelismo';
    result.title = 'Ação de Evangelismo';
  } else if (lower.includes('estudo') || lower.includes('discipulado') || lower.includes('aula') || lower.includes('teologia')) {
    result.category = 'estudos';
    result.title = 'Estudo Bíblico / Discipulado';
  } else if (lower.includes('evento') || lower.includes('congresso') || lower.includes('conferência') || lower.includes('festa')) {
    result.category = 'eventos';
    result.title = 'Evento Ministerial';
  }

  // Priority determination
  if (lower.includes('urgente') || lower.includes('emergência') || lower.includes('imediato') || lower.includes('🚨')) {
    result.priority = 'urgente';
  } else if (lower.includes('prioritário') || lower.includes('prioridade') || lower.includes('máxima')) {
    result.priority = 'prioridade';
  } else if (lower.includes('importante') || lower.includes('relevante')) {
    result.priority = 'importante';
  }

  // Date Parsing
  const today = new Date();
  let eventDate = new Date();

  if (lower.includes('amanhã') || lower.includes('amanha')) {
    eventDate.setDate(today.getDate() + 1);
  } else if (lower.includes('depois de amanhã') || lower.includes('depois de amanha')) {
    eventDate.setDate(today.getDate() + 2);
  } else if (lower.includes('hoje')) {
    eventDate = today;
  } else {
    // Check day of the week
    const daysOfWeek = [
      { name: 'domingo', dayIndex: 0 },
      { name: 'dom', dayIndex: 0 },
      { name: 'segunda-feira', dayIndex: 1 },
      { name: 'segunda', dayIndex: 1 },
      { name: 'seg', dayIndex: 1 },
      { name: 'terça-feira', dayIndex: 2 },
      { name: 'terça', dayIndex: 2 },
      { name: 'ter', dayIndex: 2 },
      { name: 'quarta-feira', dayIndex: 3 },
      { name: 'quarta', dayIndex: 3 },
      { name: 'qua', dayIndex: 3 },
      { name: 'quinta-feira', dayIndex: 4 },
      { name: 'quinta', dayIndex: 4 },
      { name: 'qui', dayIndex: 4 },
      { name: 'sexta-feira', dayIndex: 5 },
      { name: 'sexta', dayIndex: 5 },
      { name: 'sex', dayIndex: 5 },
      { name: 'sábado', dayIndex: 6 },
      { name: 'sabado', dayIndex: 6 },
      { name: 'sáb', dayIndex: 6 },
      { name: 'sab', dayIndex: 6 },
    ];

    let foundDay = false;
    for (const d of daysOfWeek) {
      // Use regex with word boundary or simple checks depending on word length
      const regex = new RegExp('\\b' + d.name + '\\b|' + d.name + '(?=\\s|$|\\.)', 'i');
      if (regex.test(lower)) {
        foundDay = true;
        const currentDayIndex = today.getDay();
        let targetIndex = d.dayIndex;
        let daysToAdd = targetIndex - currentDayIndex;
        if (daysToAdd <= 0) daysToAdd += 7; // Next week's day
        eventDate.setDate(today.getDate() + daysToAdd);
        break;
      }
    }

    // Check specific day number like "dia 15", "dia 20"
    if (!foundDay) {
      const dayMatch = text.match(/dia\s+(\d{1,2})/i);
      if (dayMatch) {
        const targetDay = parseInt(dayMatch[1], 10);
        if (targetDay >= 1 && targetDay <= 31) {
          eventDate.setDate(targetDay);
          // If the date is in the past, maybe next month
          if (eventDate < today && targetDay < today.getDate()) {
            eventDate.setMonth(today.getMonth() + 1);
          }
        }
      }
    }
  }

  result.date = eventDate.toISOString().split('T')[0];

  // Time Parsing
  const timeMatch = text.match(/(\d{1,2})[h:](\d{2})?|às\s+(\d{1,2})/i);
  if (timeMatch) {
    let hour = '09';
    let minute = '00';

    if (timeMatch[1]) {
      hour = timeMatch[1].padStart(2, '0');
      minute = timeMatch[2] ? timeMatch[2].padStart(2, '0') : '00';
    } else if (timeMatch[3]) {
      hour = timeMatch[3].padStart(2, '0');
    }

    // Validate
    const hrNum = parseInt(hour, 10);
    const minNum = parseInt(minute, 10);
    if (hrNum >= 0 && hrNum < 24 && minNum >= 0 && minNum < 60) {
      result.time = `${hour}:${minute}`;
    }
  } else {
    // Smart Defaults based on category / text keywords
    if (lower.includes('jovens') || lower.includes('noite') || lower.includes('culto') || lower.includes('pregação')) {
      result.time = '19:30';
    } else if (lower.includes('reunião') || lower.includes('reuniao') || lower.includes('conselho')) {
      result.time = '19:00';
    } else if (lower.includes('visita') || lower.includes('visitar') || lower.includes('aconselhamento')) {
      result.time = '15:00';
    } else if (lower.includes('casamento') || lower.includes('batismo')) {
      result.time = '16:00';
    } else {
      result.time = '09:00';
    }
  }

  // Location Parsing
  const locMatch = text.match(/(?:no|na|no\s+local|em|na\s+casa\s+de|casa\s+do|no\s+templo)\s+([A-ZÀ-Úa-zà-ú0-9\s]+?)(?=\s+dia|\s+às|\s+as|\s+amanhã|\s+amanha|\s+hoje|\s+com|$)/i);
  if (locMatch && locMatch[1]) {
    const loc = locMatch[1].trim();
    const locLower = loc.toLowerCase();
    
    // List of words that are actually temporal or relative qualifiers, NOT physical locations
    const nonLocations = [
      'amanha', 'amanhã', 'hoje', 
      'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo',
      'seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'sab', 'dom',
      'próximo', 'proximo', 'próxima', 'proxima', 'próximos', 'próximas',
      'fim de semana', 'final de semana', 'mês', 'mes', 'ano'
    ];
    
    const isInvalidLoc = nonLocations.some(word => locLower.includes(word));
    if (loc.length > 2 && !isInvalidLoc) {
      result.location = loc;
    }
  }

  // Title Extraction based on core subject
  // Let's remove pronouns, timings and clean up the title
  let parsedTitle = text;
  const wordsToRemove = [
    /amanhã/gi, /amanha/gi, /hoje/gi, /depois de amanhã/gi, /depois de amanha/gi,
    /segunda-feira/gi, /terça-feira/gi, /quarta-feira/gi, /quinta-feira/gi, /sexta-feira/gi, /sábado/gi, /domingo/gi,
    /segunda/gi, /terça/gi, /quarta/gi, /quinta/gi, /sexta/gi, /sabado/gi,
    /seg\b/gi, /ter\b/gi, /qua\b/gi, /qui\b/gi, /sex\b/gi, /sáb\b/gi, /sab\b/gi, /dom\b/gi,
    /próxima/gi, /proxima/gi, /próximo/gi, /proximo/gi,
    /às\s+\d{1,2}(?:[h:]\d{2})?/gi, /as\s+\d{1,2}(?:[h:]\d{2})?/gi,
    /\d{1,2}[h:]\d{2}/gi, /\d{1,2}h/gi,
    /dia\s+\d{1,2}/gi,
    /no\s+local\s+[a-zA-ZÀ-Úa-zà-ú0-9\s]+/gi,
    /na\s+casa\s+de\s+[a-zA-ZÀ-Úa-zà-ú0-9\s]+/gi,
    /no\s+templo/gi,
    /urgente/gi, /importante/gi, /prioridade/gi
  ];

  wordsToRemove.forEach(pattern => {
    parsedTitle = parsedTitle.replace(pattern, '');
  });

  // If location was successfully parsed, remove it from the title as well to prevent redundancy
  if (result.location && parsedTitle.toLowerCase().includes(result.location.toLowerCase())) {
    const locEscaped = result.location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const locRegex = new RegExp(`(?:no|na|em|no\\s+local|na\\s+casa\\s+de|casa\\s+do|no\\s+templo)?\\s*${locEscaped}`, 'i');
    parsedTitle = parsedTitle.replace(locRegex, '');
  }

  // Clean trailing spaces, prepositions
  parsedTitle = parsedTitle
    .replace(/^\s*(?:criar|agendar|marcar|marcar um|marcar uma|um|uma|o|a|para|às|as)\s+/i, '')
    .trim();

  // Capitalize first letter
  if (parsedTitle.length > 0) {
    result.title = parsedTitle.charAt(0).toUpperCase() + parsedTitle.slice(1);
    if (result.title.length > 50) {
      result.title = result.title.substring(0, 47) + '...';
    }
  }

  return result;
}

export async function parseAppointmentWithAI(text: string): Promise<Partial<Appointment>> {
  try {
    const localDate = new Date();
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const clientDate = `${year}-${month}-${day}`;

    const response = await fetch('/api/parse-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text,
        clientDate
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.appointment) {
        return data.appointment;
      }
    }
  } catch (error) {
    console.warn('AI Parsing failed, falling back to local parsing:', error);
  }
  return parseAppointmentTextLocally(text);
}
