import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, X, Save } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  recurring: boolean;
  event_date: string | null; // ISO date for expiry check, null = recurring
}

const EMPTY_FORM = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  image: '',
  recurring: false,
  event_date: '',
};

const Events: React.FC = () => {
  const { isEditMode } = useEdit();
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Filter out non-recurring events whose date has passed
      const active = data.filter((e: Event) => {
        if (e.recurring || !e.event_date) return true;
        return new Date(e.event_date) >= today;
      });
      setEvents(active);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.date || !form.time || !form.location) {
      alert('Please fill in title, date, time and location.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('events').insert([{
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      description: form.description,
      image: form.image,
      recurring: form.recurring,
      event_date: form.recurring ? null : form.event_date || null,
    }]);
    setSaving(false);
    if (error) { alert('Error saving event.'); return; }
    setForm(EMPTY_FORM);
    setShowForm(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  const recurring = events.filter(e => e.recurring);
  const special = events.filter(e => !e.recurring);

  const EventCard = ({ event, special: isSpecial }: { event: Event; special?: boolean }) => (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${isSpecial ? 'border-2 border-purple-200' : ''}`}>
      <div className="lg:flex">
        <div
          className="lg:w-2/5 h-48 lg:h-auto bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${event.image || 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/40 transition-all duration-300" />
          <div className="absolute top-4 left-4">
            <span className={`text-white text-xs px-3 py-1 rounded-full font-semibold ${isSpecial ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-purple-600'}`}>
              {isSpecial ? 'Special Event' : 'Recurring'}
            </span>
          </div>
        </div>
        <div className="lg:w-3/5 p-8 relative">
          {isEditMode && (
            <button
              onClick={() => handleDelete(event.id)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300 pr-8">
            {event.title}
          </h4>
          <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for worship services, community events, and fellowship opportunities.
            There's always something happening at Shining Light Family Church.
          </p>
        </div>

        {/* Special Events */}
        {special.length > 0 && (
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Special <span className="text-purple-600">Events</span>
            </h3>
            <div className="grid gap-6">
              {special.map(event => <EventCard key={event.id} event={event} special />)}
            </div>
          </div>
        )}

        {/* Recurring Events */}
        <div className="grid gap-6">
          {recurring.map(event => <EventCard key={event.id} event={event} />)}
        </div>

        {events.length === 0 && !isEditMode && (
          <p className="text-center text-gray-500 py-12">No upcoming events at this time. Check back soon!</p>
        )}

        {/* Add Event Button (edit mode only) */}
        {isEditMode && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" /> Add Event
            </button>
          </div>
        )}

        {/* Add Event Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Add New Event</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Date * (e.g. "Every Sunday" or "Dec 25, 2025")</label>
                    <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input type="text" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 9:00 AM"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="recurring" checked={form.recurring}
                    onChange={e => setForm({ ...form, recurring: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <label htmlFor="recurring" className="text-sm text-gray-700">Recurring event (never expires)</label>
                </div>
                {!form.recurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date (for auto-removal)</label>
                    <input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleAdd} disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg font-semibold">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
