import React, { useState } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminFooter } from '../../../components/admin/AdminFooter';
import { EventEditor, type EventFormData } from '../../../components/admin/EventEditor';
import { formatDate, formatCategory } from '../../../lib/utils/format';
import type { Event, AdminProfile } from '../../../lib/types/database';

interface AdminEventsPageProps {
  events: Event[];
  profile?: AdminProfile | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onAddEvent: (newEvent: EventFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onUpdateEvent?: (updatedEvent: EventFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onDeleteEvent?: (id: string) => Promise<{ success: boolean; error?: string } | void> | void;
  onNavigate: (path: string) => void;
  onSignOut?: () => void;
}

export default function AdminEventsPage({
  events,
  profile,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onNavigate,
  onSignOut,
}: AdminEventsPageProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const publishedCount = events.filter((e) => e.status === 'published').length;
  const draftsCount = events.filter((e) => e.status === 'draft').length;

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleSaveDraft = async (data: EventFormData) => {
    if (editingEvent && onUpdateEvent) {
      return onUpdateEvent({ ...data, id: editingEvent.id, status: 'draft' });
    }
    return onAddEvent({ ...data, status: 'draft' });
  };

  const handlePublish = async (data: EventFormData) => {
    if (editingEvent && onUpdateEvent) {
      return onUpdateEvent({ ...data, id: editingEvent.id, status: 'published' });
    }
    return onAddEvent({ ...data, status: 'published' });
  };

  const startEditEvent = (evt: Event) => {
    setEditingEvent(evt);
    const el = document.getElementById('event-editor-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const scrollToEditor = () => {
    setEditingEvent(null);
    const el = document.getElementById('event-editor-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete || !onDeleteEvent) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await onDeleteEvent(eventToDelete.id);
      if (res && res.error) {
        setDeleteError(res.error);
      } else {
        setEventToDelete(null);
        if (editingEvent?.id === eventToDelete.id) {
          setEditingEvent(null);
        }
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] font-body-md antialiased min-h-screen flex flex-col selection:bg-[#ff8928] selection:text-white">
      {/* Admin Top Bar */}
      <AdminHeader
        profile={profile}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />

      {/* Admin Shell: Sidebar + Main Content Canvas */}
      <div className="flex flex-1 w-full max-w-[1720px] mx-auto">
        <AdminSidebar currentPath="/admin/events" onNavigate={onNavigate} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 space-y-10 grid-bg overflow-x-hidden">
          {/* SECTION A: EVENTS LIST & ACTIONS */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-[#151b2a] tracking-tight">
                    Events
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e2e8fc] text-[#45464e] font-mono text-xs font-semibold">
                    {events.length} Total
                  </span>
                </div>
                <p className="font-sans text-sm text-[#45464e] mt-1">
                  Create, edit, and publish chapter events, photographs, and reports for the website.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToEditor}
                className="chamfer-btn inline-flex items-center justify-center gap-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs sm:text-sm uppercase px-5 py-2.5 font-bold shadow-md hover:shadow-lg transition-all duration-150 active:translate-y-px cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span>+ Create Event</span>
              </button>
            </div>

            {/* Error Banner with Retry */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-red-700 text-sm">
                  <span className="material-symbols-outlined text-xl">error</span>
                  <span>{errorMessage}</span>
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="font-mono text-xs text-red-700 underline hover:text-red-900 cursor-pointer"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {/* FILTER TABS & REGISTRY CONTAINER */}
            <div className="bg-white border border-[#e2e8fc] rounded-lg shadow-sm overflow-hidden">
              {/* Filter Tabs */}
              <div className="border-b border-[#e2e8fc] px-6 pt-3 flex items-center gap-8">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`font-mono text-xs font-semibold pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    filter === 'all'
                      ? 'text-[#ff8928] border-[#ff8928]'
                      : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
                  }`}
                >
                  <span>All Events</span>
                  <span className="text-[10px] bg-[#e9edff] px-1.5 py-0.2 rounded text-[#151b2a]">
                    {events.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('published')}
                  className={`font-mono text-xs font-semibold pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    filter === 'published'
                      ? 'text-[#ff8928] border-[#ff8928]'
                      : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
                  }`}
                >
                  <span>Published</span>
                  <span className="text-[10px] bg-[#e9edff] px-1.5 py-0.2 rounded text-[#45464e]">
                    {publishedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('draft')}
                  className={`font-mono text-xs font-semibold pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    filter === 'draft'
                      ? 'text-[#ff8928] border-[#ff8928]'
                      : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
                  }`}
                >
                  <span>Drafts</span>
                  <span className="text-[10px] bg-[#e9edff] px-1.5 py-0.2 rounded text-[#45464e]">
                    {draftsCount}
                  </span>
                </button>
              </div>

              {/* TABLE HEADER & TRUTHFUL ZERO-STATE / RECORD ROWS */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f3ff] border-b border-[#e2e8fc] text-[#45464e] font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-6 font-semibold">Event Title</th>
                      <th className="py-3 px-6 font-semibold">Date</th>
                      <th className="py-3 px-6 font-semibold">Category</th>
                      <th className="py-3 px-6 font-semibold">Status</th>
                      <th className="py-3 px-6 font-semibold">Last Updated</th>
                      <th className="py-3 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td className="py-16 px-6 text-center" colSpan={6}>
                          <div className="flex flex-col items-center justify-center gap-2 text-[#76767f]">
                            <div className="w-6 h-6 border-2 border-[#ff8928] border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-mono text-xs">Loading events...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredEvents.length === 0 ? (
                      <tr>
                        <td className="py-16 px-6 text-center" colSpan={6}>
                          <div className="max-w-md mx-auto flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-[#e2e8fc] text-[#964900] flex items-center justify-center mb-4">
                              <span className="material-symbols-outlined text-3xl">calendar_month</span>
                            </div>
                            <h3 className="font-headline-sm text-xl font-bold text-[#151b2a] mb-1">
                              No events yet
                            </h3>
                            <p className="font-sans text-sm text-[#45464e] mb-6 text-center">
                              Create your first event to publish it on the public website.
                            </p>
                            <button
                              type="button"
                              onClick={scrollToEditor}
                              className="chamfer-btn inline-flex items-center gap-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs uppercase px-5 py-2.5 font-bold transition-all duration-150 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                              <span>+ Create First Event</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((evt) => (
                        <tr
                          key={evt.id}
                          className={`border-b border-[#e2e8fc] hover:bg-[#f2f3ff]/50 transition-colors text-xs font-sans ${
                            editingEvent?.id === evt.id ? 'bg-[#ff8928]/5' : ''
                          }`}
                        >
                          <td className="py-4 px-6 font-semibold text-[#151b2a]">
                            <div className="font-medium text-sm text-[#0d1b3d]">{evt.title}</div>
                            <div className="text-[#76767f] text-xs font-mono">
                              /events/{evt.slug}
                              {evt.venue ? ` • ${evt.venue}` : ''}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-[#45464e]">{formatDate(evt.date)}</td>
                          <td className="py-4 px-6 font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#e9edff] text-[#0d1b3d]">
                              {formatCategory(evt.category)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                                evt.status === 'published'
                                   ? 'bg-emerald-100 text-emerald-800'
                                   : 'bg-[#ffdcc6]/60 text-[#642f00]'
                              }`}
                            >
                              {evt.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-[#76767f]">
                            {formatDate(evt.updated_at || evt.created_at)}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => startEditEvent(evt)}
                              className="text-xs font-mono text-[#0d1b3d] hover:text-[#ff8928] underline cursor-pointer"
                            >
                              Edit
                            </button>
                            {evt.status === 'published' ? (
                              <button
                                onClick={() => onNavigate(`/events/${evt.slug}`)}
                                className="text-xs font-mono text-emerald-700 hover:text-emerald-900 underline ml-2 cursor-pointer"
                              >
                                View
                              </button>
                            ) : (
                              <span className="text-xs font-mono text-gray-400 ml-2" title="Drafts are not visible on public site">
                                Draft
                              </span>
                            )}
                            {onDeleteEvent && (
                              <button
                                onClick={() => setEventToDelete(evt)}
                                className="text-xs font-mono text-red-600 hover:text-red-800 underline ml-2 cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION B: MAIN WORKFLOW — UNIFIED EVENT EDITOR */}
          <div id="event-editor-section">
            <EventEditor
              initialData={editingEvent}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onCancelEdit={cancelEdit}
            />
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal with Event Title */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c6c6cf] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-poppins font-bold text-lg text-[#151b2a]">Confirm Event Deletion</h3>
            </div>
            <p className="font-sans text-sm text-[#45464e] leading-relaxed">
              Are you sure you want to permanently delete the event{' '}
              <strong className="text-[#151b2a]">"{eventToDelete.title}"</strong>?
            </p>
            <p className="font-mono text-xs text-[#76767f] bg-[#f2f3ff] p-2.5 rounded">
              All linked photos, reports, and resources will be removed via cascading deletion. This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-xs text-red-600 font-mono bg-red-50 p-2 border border-red-200">
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold text-[#151b2a] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Shell Footer */}
      <AdminFooter />
    </div>
  );
}
