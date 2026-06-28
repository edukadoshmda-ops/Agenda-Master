import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash, Folder, BookOpen, Mic, Play, Square, Paperclip, ClipboardList, CheckSquare, Square as CheckboxEmpty, Sparkles, FileText, Heart } from 'lucide-react';
import { Note, Task } from '../types';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  tasks: Task[];
  onAddTask: (title: string, date?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  theme: 'light' | 'dark';
}

export default function NotesSection({
  notes,
  onAddNote,
  onDeleteNote,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  theme,
}: NotesSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'tasks'>('notes');

  // --- Notes States ---
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFolder, setNoteFolder] = useState('Esboços de Sermão');
  const [noteColor, setNoteColor] = useState('#b58028'); // Gold
  const [noteAttachments, setNoteAttachments] = useState<{ name: string; type: 'image' | 'document' }[]>([]);
  const [noteAudioUrl, setNoteAudioUrl] = useState<string | undefined>(undefined);

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Task States ---
  const [taskInput, setTaskInput] = useState('');
  const [taskDate, setTaskDate] = useState('');

  const FOLDERS = ['Esboços de Sermão', 'Estudos Bíblicos', 'Avisos da Igreja', 'Visitas e Orações', 'Idéias Criativas', 'Particular'];
  const COLORS = ['#b58028', '#2c6595', '#16a34a', '#dc2626', '#7c3aed', '#db2777'];

  // Start Audio Recording using MediaRecorder API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setNoteAudioUrl(audioUrl);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission or support issues, using simulated recording:', err);
      // Fallback: Elegant simulation
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setNoteAudioUrl('simulated_audio_note.mp3');
      }, 5000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleAddAttachment = () => {
    const mockFiles = [
      { name: 'Esboco_Apocalipse_v1.pdf', type: 'document' as const },
      { name: 'Fotos_Evento_Jovens.png', type: 'image' as const },
      { name: 'Cronograma_Santa_Ceia.docx', type: 'document' as const },
      { name: 'Lista_Membros_Batismo.xlsx', type: 'document' as const },
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setNoteAttachments([...noteAttachments, randomFile]);
  };

  const submitNote = () => {
    if (!noteTitle.trim()) return;
    onAddNote({
      title: noteTitle,
      content: noteContent,
      category: noteFolder,
      color: noteColor,
      attachments: noteAttachments,
      audioUrl: noteAudioUrl,
    });

    // Reset fields
    setNoteTitle('');
    setNoteContent('');
    setNoteAttachments([]);
    setNoteAudioUrl(undefined);
  };

  const submitTask = () => {
    if (!taskInput.trim()) return;
    onAddTask(taskInput, taskDate || undefined);
    setTaskInput('');
    setTaskDate('');
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className={`p-1 rounded-2xl flex justify-between ${theme === 'dark' ? 'bg-navy-900/60' : 'bg-gray-100'} shadow-inner`}>
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeSubTab === 'notes'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                : 'bg-navy-800 text-white shadow-md font-bold'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          <BookOpen size={14} />
          Bloco de Notas
        </button>
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeSubTab === 'tasks'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                : 'bg-navy-800 text-white shadow-md font-bold'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          <ClipboardList size={14} />
          Lista de Tarefas
        </button>
      </div>

      {/* --- Notes View --- */}
      {activeSubTab === 'notes' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Note Composer Card */}
          <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-4 border-l-4`} style={{ borderLeftColor: noteColor }}>
            <h3 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
              Nova Anotação / Esboço
            </h3>

            <input
              id="note-composer-title"
              type="text"
              placeholder="Título da Anotação..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none ${
                theme === 'dark' ? 'bg-navy-950/60 text-white border border-gold-500/10' : 'bg-gray-50 border border-gray-200 text-navy-950'
              }`}
            />

            <textarea
              id="note-composer-content"
              placeholder="Digite seu esboço, sermão, lembrete ou anotação de aconselhamento pastoral..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none resize-none ${
                theme === 'dark' ? 'bg-navy-950/60 text-white border border-gold-500/10' : 'bg-gray-50 border border-gray-200 text-navy-950'
              }`}
            />

            {/* Folder & Color selection */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[120px]">
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Pasta</label>
                <select
                  id="note-folder-select"
                  value={noteFolder}
                  onChange={(e) => setNoteFolder(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-[11px] font-semibold focus:outline-none ${
                    theme === 'dark' ? 'bg-navy-950 text-gold-400 border border-gold-500/10' : 'bg-gray-50 text-navy-900 border'
                  }`}
                >
                  {FOLDERS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5 uppercase tracking-wider">Etiqueta</label>
                <div className="flex gap-1.5">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNoteColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        noteColor === c ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Audio note or attachment panel */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold-500/10 pt-3">
              <div className="flex items-center gap-2">
                {/* Voice recorder trigger */}
                <button
                  id="note-audio-record-btn"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : theme === 'dark'
                      ? 'bg-navy-900 hover:bg-navy-800 text-gold-400'
                      : 'bg-gold-50 hover:bg-gold-100 text-gold-600'
                  }`}
                >
                  <Mic size={14} />
                  <span>{isRecording ? 'Parar' : noteAudioUrl ? 'Gravado ✓' : 'Gravar Áudio'}</span>
                </button>

                {/* Attach File trigger */}
                <button
                  id="note-attach-file-btn"
                  onClick={handleAddAttachment}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    theme === 'dark' ? 'bg-navy-900 hover:bg-navy-800 text-gold-400' : 'bg-gold-50 hover:bg-gold-100 text-gold-600'
                  }`}
                >
                  <Paperclip size={14} />
                  <span>Anexar</span>
                </button>
              </div>

              <button
                id="save-note-btn"
                onClick={submitNote}
                disabled={!noteTitle.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  noteTitle.trim()
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-navy-950'
                      : 'bg-navy-800 hover:bg-navy-950 text-white'
                    : 'opacity-40 cursor-not-allowed text-gray-400'
                }`}
              >
                Salvar Nota
              </button>
            </div>

            {/* Attachments preview */}
            {(noteAttachments.length > 0 || noteAudioUrl) && (
              <div className="p-3 rounded-xl bg-navy-950/20 border border-gold-500/5 space-y-1.5">
                {noteAudioUrl && (
                  <div className="flex items-center gap-2 text-xs text-gold-500">
                    <Mic size={12} />
                    <span className="font-semibold">Nota de Voz Pastoral</span>
                    {noteAudioUrl !== 'simulated_audio_note.mp3' ? (
                      <audio src={noteAudioUrl} controls className="h-6 max-w-full inline-block scale-90 origin-left" />
                    ) : (
                      <span className="text-[10px] italic text-gray-400">(Áudio Simulado Gravado com Sucesso!)</span>
                    )}
                  </div>
                )}
                {noteAttachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FileText size={12} className="text-gold-500" />
                    <span>{att.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Nenhuma anotação ministerial registrada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`p-4 rounded-3xl relative border flex flex-col justify-between h-48 transition-all duration-300 group ${
                    theme === 'dark'
                      ? 'bg-navy-900/40 border-gold-500/10 hover:border-gold-500/30'
                      : 'bg-white border-gray-100 hover:border-gold-300 shadow-sm'
                  }`}
                  style={{ borderLeftWidth: '5px', borderLeftColor: note.color }}
                >
                  <button
                    id={`delete-note-${note.id}`}
                    onClick={() => onDeleteNote(note.id)}
                    className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash size={14} />
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center pr-6">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gold-500 flex items-center gap-1">
                        <Folder size={10} />
                        {note.category}
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold leading-tight line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-4 font-medium leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  {/* Note Footer: Time, Audio icon, attachments indicator */}
                  <div className="border-t border-gold-500/5 pt-2.5 flex justify-between items-center text-[10px] text-gray-400">
                    <span>{note.updatedAt}</span>
                    <div className="flex gap-2 items-center">
                      {note.audioUrl && <Mic size={10} className="text-gold-500" />}
                      {note.attachments && note.attachments.length > 0 && <Paperclip size={10} className="text-gold-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Tasks Checklist View --- */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Task Creator */}
          <div className={`p-4 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-3`}>
            <div className="flex gap-2">
              <input
                id="task-input"
                type="text"
                placeholder="Adicionar tarefa ministerial, de oração ou visita..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitTask()}
                className={`w-full pl-4 pr-3 py-3 rounded-xl text-xs font-semibold focus:outline-none ${
                  theme === 'dark' ? 'bg-navy-950/60 text-white border border-gold-500/10 focus:border-gold-500' : 'bg-gray-50 border border-gray-200 text-navy-950'
                }`}
              />
              <button
                id="add-task-btn"
                onClick={submitTask}
                className={`px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950'
                    : 'bg-navy-800 text-white'
                }`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Target Date for Tasks */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Data de Entrega</span>
                <input
                  id="task-date-input"
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold focus:outline-none ${
                    theme === 'dark' ? 'bg-navy-950 text-gold-400 border border-gold-500/10' : 'bg-gray-50 border'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Nenhuma tarefa pendente para o ministério pastoral.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                    task.done
                      ? 'opacity-65'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-navy-900/60 border-gold-500/10 hover:border-gold-500/20'
                      : 'bg-white border-gray-100 hover:border-gold-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      id={`toggle-task-${task.id}`}
                      onClick={() => onToggleTask(task.id)}
                      className="text-gold-500 focus:outline-none"
                    >
                      {task.done ? <CheckSquare size={18} /> : <CheckboxEmpty size={18} />}
                    </button>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-semibold leading-normal ${
                        task.done
                          ? 'line-through text-gray-500'
                          : theme === 'dark'
                          ? 'text-white'
                          : 'text-navy-900'
                      }`}>
                        {task.title}
                      </p>
                      {task.date && (
                        <span className="text-[10px] text-gold-500/85 font-semibold">
                          Prazo: {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`delete-task-${task.id}`}
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
