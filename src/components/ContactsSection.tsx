import React, { useState } from 'react';
import { Search, Star, MessageSquare, Phone, Mail, UserPlus, Heart, Award, ShieldAlert, Sparkles, Filter, Trash2 } from 'lucide-react';
import { Contact } from '../types';

interface ContactsSectionProps {
  contacts: Contact[];
  onToggleFavorite: (id: string) => void;
  onAddContact: (contact: Omit<Contact, 'id' | 'favorite'>) => void;
  onDeleteContact: (id: string) => void;
  theme: 'light' | 'dark';
}

const ROLES = ['Todos', 'Líderes', 'Diáconos', 'Membros', 'Obreiros', 'Visitantes'];

export default function ContactsSection({
  contacts,
  onToggleFavorite,
  onAddContact,
  onDeleteContact,
  theme,
}: ContactsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos');

  // --- Add Member Modal State ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Membros');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const submitContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    
    // Choose a random preset avatar
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    ];
    const randAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    onAddContact({
      name: newName,
      role: newRole,
      phone: newPhone,
      email: newEmail || undefined,
      avatar: randAvatar,
    });

    // Reset Form
    setNewName('');
    setNewRole('Membros');
    setNewPhone('');
    setNewEmail('');
    setShowAddForm(false);
  };

  // Filter Contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);

    const matchesRole =
      selectedRole === 'Todos' ||
      contact.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div id="contacts-view" className="space-y-6">
      {/* Header, Search bar & add contact trigger */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input
            id="contact-search-input"
            type="text"
            placeholder="Pesquisar membros, líderes ou telefones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-navy-900/60 text-white border border-gold-500/10 focus:border-gold-500'
                : 'bg-white border border-gray-200 text-navy-950 focus:border-navy-800 shadow-sm'
            }`}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500" size={16} />
        </div>

        <button
          id="add-member-trigger-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-navy-950 shadow-gold-500/10'
              : 'bg-navy-800 hover:bg-navy-900 text-white'
          }`}
        >
          <UserPlus size={14} />
          Membro
        </button>
      </div>

      {/* Add Contact Modal / Section */}
      {showAddForm && (
        <div className={`p-5 rounded-3xl animate-fadeIn space-y-4 ${
          theme === 'dark' ? 'glass-premium-dark border-gold-400/30' : 'glass-premium-light border-navy-800/30 shadow-lg'
        }`}>
          <h3 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
            Cadastrar Novo Membro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase block">Nome Completo</label>
              <input
                id="new-contact-name"
                type="text"
                placeholder="Ex: Diácono João de Souza"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl focus:outline-none ${
                  theme === 'dark' ? 'bg-navy-950 text-white border border-gold-500/10' : 'bg-gray-50 text-navy-950 border'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase block">Função / Cargo</label>
              <select
                id="new-contact-role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl focus:outline-none font-semibold ${
                  theme === 'dark' ? 'bg-navy-950 text-gold-400 border border-gold-500/10' : 'bg-gray-50 text-navy-900 border'
                }`}
              >
                {ROLES.slice(1).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase block">Telefone / WhatsApp</label>
              <input
                id="new-contact-phone"
                type="tel"
                placeholder="Ex: (11) 98765-4321"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl focus:outline-none ${
                  theme === 'dark' ? 'bg-navy-950 text-white border border-gold-500/10' : 'bg-gray-50 text-navy-950 border'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase block">E-mail (Opcional)</label>
              <input
                id="new-contact-email"
                type="email"
                placeholder="Ex: joao@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl focus:outline-none ${
                  theme === 'dark' ? 'bg-navy-950 text-white border border-gold-500/10' : 'bg-gray-50 text-navy-950 border'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gold-500/10">
            <button
              id="cancel-add-member-btn"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              id="save-new-member-btn"
              onClick={submitContact}
              className={`px-5 py-2 rounded-xl text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
                  : 'bg-navy-800 text-white hover:bg-navy-950'
              }`}
            >
              Salvar Membro
            </button>
          </div>
        </div>
      )}

      {/* Role Filters list */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROLES.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedRole === role
                ? theme === 'dark'
                  ? 'bg-gold-500 text-navy-950 shadow-md shadow-gold-500/10'
                  : 'bg-navy-800 text-white shadow-md'
                : theme === 'dark'
                ? 'bg-navy-900/60 text-navy-200 hover:bg-navy-900 hover:text-white'
                : 'bg-gray-100 text-navy-800 hover:bg-gray-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Contacts List Grid */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-xs">
          Nenhum membro ou líder cadastrado nesta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`p-4 rounded-3xl flex items-center justify-between border transition-all duration-300 group ${
                theme === 'dark'
                  ? 'bg-navy-900/40 border-gold-500/10 hover:border-gold-500/25'
                  : 'bg-white border-gray-100 hover:border-gold-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Member Avatar */}
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/30"
                  />
                  {contact.favorite && (
                    <div className="absolute -top-1 -right-1 bg-gold-500 text-navy-950 p-0.5 rounded-full">
                      <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Member info details */}
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>
                    {contact.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      contact.role === 'Líderes'
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : contact.role === 'Diáconos'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    }`}>
                      {contact.role}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <p className="text-[10px] text-gray-400 tracking-tight">{contact.email}</p>
                  )}
                </div>
              </div>

              {/* Member Quick Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Star / Unstar Favorite */}
                <button
                  id={`toggle-fav-${contact.id}`}
                  onClick={() => onToggleFavorite(contact.id)}
                  className={`p-2 rounded-xl transition-all ${
                    contact.favorite
                      ? 'text-gold-500 hover:bg-gold-500/10'
                      : 'text-gray-400 hover:text-gold-500 hover:bg-gold-500/5'
                  }`}
                >
                  <Star size={14} fill={contact.favorite ? 'currentColor' : 'none'} />
                </button>

                {/* Simulated Call */}
                <a
                  href={`tel:${contact.phone}`}
                  id={`call-member-${contact.id}`}
                  className={`p-2 rounded-xl transition-all ${
                    theme === 'dark' ? 'text-gold-400 hover:bg-gold-500/10' : 'text-navy-800 hover:bg-gold-50'
                  }`}
                >
                  <Phone size={14} />
                </a>

                {/* Simulated Msg / WhatsApp */}
                <a
                  href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  id={`msg-member-${contact.id}`}
                  className={`p-2 rounded-xl transition-all ${
                    theme === 'dark' ? 'text-gold-400 hover:bg-gold-500/10' : 'text-navy-800 hover:bg-gold-50'
                  }`}
                >
                  <MessageSquare size={14} />
                </a>

                {/* Delete Contact Button */}
                <button
                  id={`delete-contact-${contact.id}`}
                  onClick={() => onDeleteContact(contact.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
