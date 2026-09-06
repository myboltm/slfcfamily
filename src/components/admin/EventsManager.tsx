import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, X, Pencil } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  recurring: boolean;
  event_date: string | null;
}

const EMPTY_FORM = { title: '', date: '', time: '', location: '', description: '', image: '', recurring: false, event_date: '' };

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: true });
    setEvents(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.time || !form.location) {
      alert('Please fill in title, date, time and location.');
      return;
    }
    setSaving(true);
    const payload = { title: form.title, date: form.date, time: form.time, location: form.location, description: form.description, image: form.image, recurring: form.recurring, event_date: form.recurring ? null : form.event_date || null };
    if (editingEvent) {
      await supabase.from('events').update(payload).eq('id', editingEvent.id);
    } else {
      await supabase.from('events').insert([payload]);
    }
    setSaving(false);
    resetForm();
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({ title: event.title, date: event.date, time: event.time, location: event.location, description: event.description, image: event.image, recurring: event.recurring, event_date: event.event_date || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditingEvent(null); setShowForm(false); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" /></div>;

  const recurring = events.filter(e => e.recurring);
  const special = events.filter(e => !e.recurring);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-500">{events.length} total events</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          <Plus className="h-5 w-5" /> Add Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={resetForm}><X className="h-6 w-6 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Date * (e.g. "Every Sunday")</label>
                  <input type="text" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 9:00 AM" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="recurring" checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))} className="h-4 w-4 text-purple-600 rounded" />
                <label htmlFor="recurring" className="text-sm text-gray-700">Recurring event (never expires)</label>
              </div>
              {!form.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date (for auto-removal after this date)</label>
                  <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={resetForm} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-5 py-2.5 rounded-lg font-semibold">
                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : editingEvent ? 'Update' : 'Save Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Events */}
      {recurring.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Recurring Events</h3>
          <div className="space-y-3">
            {recurring.map(event => <EventRow key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} />)}
          </div>
        </div>
      )}

      {/* Special Events */}
      {special.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Special Events</h3>
          <div className="space-y-3">
            {special.map(event => <EventRow key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} />)}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-400 mb-4">No events yet</p>
          <button onClick={() => setShowForm(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700">Add First Event</button>
        </div>
      )}
    </div>
  );
};

const EventRow: React.FC<{ event: Event; onEdit: (e: Event) => void; onDelete: (id: string) => void }> = ({ event, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    {event.image && <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <h4 className="font-semibold text-gray-900 truncate">{event.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${event.recurring ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {event.recurring ? 'Recurring' : 'Special'}
        </span>
      </div>
      <p className="text-sm text-gray-500">{event.date} · {event.time} · {event.location}</p>
      {event.event_date && <p className="text-xs text-orange-500 mt-0.5">Expires: {new Date(event.event_date).toLocaleDateString()}</p>}
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={() => onEdit(event)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="h-4 w-4" /></button>
      <button onClick={() => onDelete(event.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
    </div>
  </div>
);

export default EventsManager;
