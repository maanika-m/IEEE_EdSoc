import React, { useState, useEffect } from 'react';
import type { EventCategory, EventStatus, Event } from '../../lib/types/database';
import { slugify } from '../../lib/utils/format';

export interface EventFormData {
  id?: string;
  title: string;
  slug: string;
  category: EventCategory;
  date: string;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  speaker: string | null;
  description: string | null;
  cover_image_url: string | null;
  status: EventStatus;
}

interface EventEditorProps {
  initialData?: Event | null;
  onSaveDraft?: (data: EventFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onPublish?: (data: EventFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
}

export const EventEditor: React.FC<EventEditorProps> = ({
  initialData,
  onSaveDraft,
  onPublish,
  onCancelEdit,
  isSubmitting = false,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'report' | 'resources'>('details');

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [startTime, setStartTime] = useState(initialData?.start_time || '');
  const [endTime, setEndTime] = useState(initialData?.end_time || '');
  const [venue, setVenue] = useState(initialData?.venue || '');
  const [speaker, setSpeaker] = useState(initialData?.speaker || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverFileName, setCoverFileName] = useState<string | null>(null);

  // Photos state
  const [photoCount, setPhotoCount] = useState(0);
  const [photosList, setPhotosList] = useState<string[]>([]);

  // Report state
  const [reportFileName, setReportFileName] = useState<string | null>(null);

  // Resources state
  const [resourcesList, setResourcesList] = useState<{ title: string; url: string; type: string }[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Notification / toast feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Sync state if initialData changes (e.g. user clicks "Edit" on an event)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setIsSlugManuallyEdited(true);
      setCategory(initialData.category || '');
      setDate(initialData.date || '');
      setStartTime(initialData.start_time || '');
      setEndTime(initialData.end_time || '');
      setVenue(initialData.venue || '');
      setSpeaker(initialData.speaker || '');
      setDescription(initialData.description || '');
      setCoverFileName(initialData.cover_image_url ? 'Configured URL' : null);
    } else {
      setTitle('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      setCategory('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setVenue('');
      setSpeaker('');
      setDescription('');
      setCoverFileName(null);
    }
  }, [initialData]);

  const showStatus = (msg: string, isError = false) => {
    setStatusMessage({ text: msg, isError });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(slugify(newSlug));
  };

  const buildPayload = (status: EventStatus): EventFormData => {
    const finalSlug = slug.trim() || slugify(title);
    return {
      id: initialData?.id,
      title: title.trim(),
      slug: finalSlug,
      category: category as EventCategory,
      date,
      start_time: startTime ? startTime : null,
      end_time: endTime ? endTime : null,
      venue: venue.trim() || null,
      speaker: speaker.trim() || null,
      description: description.trim() || null,
      cover_image_url: initialData?.cover_image_url || null,
      status,
    };
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    if (!title.trim()) {
      showStatus('⚠️ Please enter an Event Title before saving draft.', true);
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      showStatus('⚠️ Please specify a valid URL slug for the event.', true);
      return;
    }
    const payload = buildPayload('draft');
    if (onSaveDraft) {
      const res = await onSaveDraft(payload);
      if (res && res.error) {
        showStatus(`⚠️ Error saving draft: ${res.error}`, true);
        return;
      }
    }
    showStatus('✓ Event saved as draft.');
  };

  const handlePublish = async () => {
    if (isSubmitting) return;
    if (!title.trim() || !category || !date) {
      showStatus('⚠️ Required fields missing: Title, Category, and Date are mandatory to publish.', true);
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      showStatus('⚠️ Please specify a valid URL slug for the event.', true);
      return;
    }
    const payload = buildPayload('published');
    if (onPublish) {
      const res = await onPublish(payload);
      if (res && res.error) {
        showStatus(`⚠️ Error publishing event: ${res.error}`, true);
        return;
      }
    }
    showStatus('✓ Event published successfully! Visible in public archive.');
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const count = e.target.files.length;
      setPhotoCount((prev) => prev + count);
      const names = Array.from(e.target.files).map((f) => f.name);
      setPhotosList((prev) => [...prev, ...names]);
      showStatus(`✓ ${count} photo(s) selected.`);
    }
  };

  const handleReportUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReportFileName(file.name);
      showStatus(`✓ Report attached: ${file.name}`);
    }
  };

  const handleAddResource = () => {
    if (!newResourceTitle || !newResourceUrl) return;
    setResourcesList((prev) => [
      ...prev,
      { title: newResourceTitle, url: newResourceUrl, type: 'Link' },
    ]);
    setNewResourceTitle('');
    setNewResourceUrl('');
    setShowResourceModal(false);
    showStatus('✓ Resource link attached.');
  };

  return (
    <section className="space-y-4">
      {/* Workflow Section Header */}
      <div className="flex items-center justify-between border-b border-[#e2e8fc] pb-3">
        <div>
          <span className="font-mono text-xs font-bold text-[#964900] uppercase tracking-widest">
            ACTIVE WORKFLOW
          </span>
          <h2 className="font-poppins font-bold text-2xl text-[#151b2a]">
            Event Editor
          </h2>
        </div>
        <p className="hidden sm:block font-sans text-xs text-[#45464e]">
          All photos, reports, and details are managed seamlessly within each event.
        </p>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3 border-l-4 font-mono text-xs flex items-center justify-between ${
            statusMessage.isError
              ? 'bg-red-50 border-red-500 text-red-800'
              : 'bg-[#e9edff] border-[#ff8928] text-[#151b2a]'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-[#76767f] hover:text-[#151b2a] cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Editor Card */}
      <div className="bg-[#ffffff] border border-[#e2e8fc] rounded-xl shadow-sm overflow-hidden">
        {/* Editor Controls Bar */}
        <div className="p-6 border-b border-[#e2e8fc] flex flex-wrap items-center justify-between gap-4 bg-[#f2f3ff]/40">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff8928]"></span>
            <h3 className="font-headline-sm text-lg font-bold text-[#151b2a]">
              {initialData ? `Edit Event: ${initialData.title}` : 'Create Event'}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
                (initialData?.status || 'draft') === 'published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#ffdcc6]/50 text-[#642f00]'
              }`}
            >
              {initialData?.status || 'Draft'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {initialData && onCancelEdit && (
              <button
                onClick={onCancelEdit}
                disabled={isSubmitting}
                className="px-3.5 py-2 rounded border border-[#c6c6cf] hover:border-[#76767f] bg-white font-headline-sm text-xs text-[#76767f] hover:text-[#151b2a] font-semibold transition-colors cursor-pointer"
                type="button"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-4 py-2 rounded border border-[#76767f]/30 hover:border-[#76767f] bg-white font-headline-sm text-xs text-[#151b2a] font-semibold hover:bg-[#e9edff] transition-colors cursor-pointer disabled:opacity-50"
              type="button"
            >
              {isSubmitting ? 'Saving...' : initialData?.status === 'published' ? 'Save as Draft (Unpublish)' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="chamfer-btn px-5 py-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs font-bold uppercase shadow-sm transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              {isSubmitting ? 'Publishing...' : initialData?.status === 'published' ? 'Update Published Event' : 'Publish Event'}
            </button>
          </div>
        </div>

        {/* 4 Clear Workflow Tabs */}
        <div className="bg-[#f2f3ff] border-b border-[#e2e8fc] px-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 py-3.5 px-4 font-headline-sm text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'text-[#ff8928] border-[#ff8928] bg-white'
                : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Details</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 py-3.5 px-4 font-headline-sm text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'text-[#ff8928] border-[#ff8928] bg-white font-bold'
                : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">photo_library</span>
            <span>Photos</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
              {photoCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 py-3.5 px-4 font-headline-sm text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'report'
                ? 'text-[#ff8928] border-[#ff8928] bg-white font-bold'
                : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Report (PDF)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
              {reportFileName ? '1 Attached' : 'Optional'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 py-3.5 px-4 font-headline-sm text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resources'
                ? 'text-[#ff8928] border-[#ff8928] bg-white font-bold'
                : 'text-[#45464e] border-transparent hover:text-[#151b2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">attachment</span>
            <span>Additional Resources</span>
            {resourcesList.length > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
                {resourcesList.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: DETAILS FORM */}
        {activeTab === 'details' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Event Title <span className="text-[#ff8928]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Chapter Inauguration & Welcome Assembly"
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Category <span className="text-[#ff8928]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="technical_session">Technical Session</option>
                  <option value="meeting">Meeting</option>
                  <option value="outreach">Outreach</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* URL Slug (Auto-generated or custom editable) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  URL Slug <span className="text-[#ff8928]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManuallyEdited(false);
                    setSlug(slugify(title));
                  }}
                  className="font-mono text-[10px] text-[#ff8928] hover:underline cursor-pointer"
                >
                  Regenerate from Title
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#f2f3ff] border border-r-0 border-[#c6c6cf] text-[#76767f] font-mono text-xs">
                  /events/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="chapter-inauguration"
                  className="flex-1 px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-mono text-xs outline-none transition-colors"
                />
              </div>
              <p className="font-mono text-[10px] text-[#76767f]">
                URL identifier for public page routing (/events/[slug]). Lowercase alphanumeric and hyphens.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Date <span className="text-[#ff8928]">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none"
                />
              </div>

              {/* Start Time */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none"
                />
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., Tech Park Auditorium, SRMIST"
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none transition-colors"
                />
              </div>

              {/* Speaker / Guest */}
              <div className="space-y-1.5">
                <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                  Speaker / Guest (Optional)
                </label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g., Dr. Jane Doe, IEEE Senior Member"
                  className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-1.5">
              <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                Event Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the full write-up, recap, or overview of the event..."
                className="w-full px-4 py-2.5 rounded-none border border-[#c6c6cf] bg-white focus:border-[#ff8928] focus:ring-1 focus:ring-[#ff8928] font-sans text-sm outline-none transition-colors"
              />
            </div>

            {/* Cover Photo Upload Zone */}
            <div className="space-y-1.5">
              <label className="block font-headline-sm text-xs font-semibold text-[#151b2a]">
                Cover Photo
              </label>
              <label className="border-2 border-dashed border-[#c6c6cf] hover:border-[#ff8928] rounded p-6 bg-[#f2f3ff]/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCoverFileName(e.target.files[0].name);
                      showStatus(`✓ Selected cover image: ${e.target.files[0].name}`);
                    }
                  }}
                />
                <span className="material-symbols-outlined text-3xl text-[#ff8928] mb-2">
                  add_photo_alternate
                </span>
                <span className="font-headline-sm text-sm font-semibold text-[#151b2a]">
                  {coverFileName ? coverFileName : 'Drop keynote banner or cover image here'}
                </span>
                <span className="font-sans text-xs text-[#45464e] mt-1">
                  16:9 recommended ratio (JPG, PNG, or WebP up to 10MB)
                </span>
                <span className="mt-3 px-3.5 py-1.5 rounded bg-white border border-[#c6c6cf] text-[#151b2a] font-mono text-xs hover:bg-[#e9edff] transition-colors inline-block">
                  Choose File
                </span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: PHOTOS TAB CONTENT */}
        {activeTab === 'photos' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a]">Event Photographs</h4>
                <p className="font-sans text-xs text-[#45464e]">High-resolution photo stream documenting active participants, workshops, and lab sessions.</p>
              </div>
              <label className="chamfer-btn px-4 py-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUploadSim} />
                <span className="material-symbols-outlined text-sm">upload</span>
                <span>Upload Photos</span>
              </label>
            </div>

            {photosList.length === 0 ? (
              <div className="border border-dashed border-[#c6c6cf] rounded-lg p-12 text-center bg-[#f2f3ff]/40">
                <span className="material-symbols-outlined text-[#76767f] text-4xl mb-2">image</span>
                <p className="font-sans text-sm font-semibold text-[#151b2a]">No photos added yet</p>
                <p className="font-sans text-xs text-[#45464e] mt-1">Drag photos here or click Upload Photos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photosList.map((name, i) => (
                  <div key={i} className="border border-[#c6c6cf] p-2 bg-[#f2f3ff] text-center">
                    <div className="h-24 bg-[#e2e8fc] flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[#ff8928]">photo</span>
                    </div>
                    <p className="font-mono text-[10px] truncate text-[#151b2a]">{name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORT PDF TAB CONTENT */}
        {activeTab === 'report' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a]">Official Event Report (PDF)</h4>
                <p className="font-sans text-xs text-[#45464e]">Official downloadable documentation PDF compiled by chapter rapporteurs for formal institutional records.</p>
              </div>
            </div>

            {reportFileName ? (
              <div className="p-4 border border-[#e2e8fc] bg-[#f2f3ff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 text-3xl">picture_as_pdf</span>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#151b2a]">{reportFileName}</p>
                    <p className="font-mono text-xs text-[#76767f]">Official Chapter Documentation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReportFileName(null)}
                  className="text-xs font-mono text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#c6c6cf] hover:border-[#ff8928] rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-[#f2f3ff]/40">
                <input type="file" accept="application/pdf" className="hidden" onChange={handleReportUploadSim} />
                <span className="material-symbols-outlined text-red-600 text-4xl mb-2">picture_as_pdf</span>
                <p className="font-sans text-sm font-semibold text-[#151b2a]">No report uploaded yet</p>
                <p className="font-sans text-xs text-[#45464e] mt-1">Single document file up to 25MB (PDF format)</p>
                <span className="mt-4 px-4 py-2 bg-white border border-[#c6c6cf] text-xs font-mono font-semibold text-[#151b2a] hover:bg-[#e9edff] transition-colors">
                  Choose PDF Report
                </span>
              </label>
            )}
          </div>
        )}

        {/* TAB 4: RESOURCES TAB CONTENT */}
        {activeTab === 'resources' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a]">Additional Educational Resources</h4>
                <p className="font-sans text-xs text-[#45464e]">Attach keynote slides, external reference links, or the official IEEE/vTools meeting recording URL.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="chamfer-btn px-4 py-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add_link</span>
                <span>Add Resource Link</span>
              </button>
            </div>

            {resourcesList.length === 0 ? (
              <div className="border border-dashed border-[#c6c6cf] rounded-lg p-12 text-center bg-[#f2f3ff]/40">
                <span className="material-symbols-outlined text-[#76767f] text-4xl mb-2">link</span>
                <p className="font-sans text-sm font-semibold text-[#151b2a]">No external links attached</p>
                <p className="font-sans text-xs text-[#45464e] mt-1">e.g., Slides, GitHub repo, or vTools recording</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resourcesList.map((res, i) => (
                  <div key={i} className="p-3 bg-[#f2f3ff] border border-[#e2e8fc] flex items-center justify-between">
                    <div>
                      <p className="font-sans text-sm font-bold text-[#151b2a]">{res.title}</p>
                      <a href={res.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#ff8928] hover:underline">
                        {res.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResourcesList(resourcesList.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-600 hover:underline font-mono"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showResourceModal && (
              <div className="p-4 border border-[#ff8928] bg-white rounded space-y-3">
                <h5 className="font-mono text-xs font-bold uppercase text-[#964900]">New Resource</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Resource Title (e.g., Slide Deck / Presentation PDF)"
                    value={newResourceTitle}
                    onChange={(e) => setNewResourceTitle(e.target.value)}
                    className="p-2 border border-[#c6c6cf] text-xs font-sans"
                  />
                  <input
                    type="url"
                    placeholder="URL (e.g., https://...)"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    className="p-2 border border-[#c6c6cf] text-xs font-sans"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResourceModal(false)}
                    className="px-3 py-1 text-xs border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="px-3 py-1 text-xs bg-[#ff8928] text-white font-bold"
                  >
                    Save Resource
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTEGRATED IN-EVENT WORKFLOW PREVIEW PANELS */}
        <div className="border-t border-[#e2e8fc] bg-[#f2f3ff]/30 p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#964900]">layers</span>
            <h4 className="font-headline-sm text-sm font-bold text-[#151b2a]">
              Integrated Event Assets
            </h4>
            <span className="font-mono text-[10px] text-[#45464e]">
              (Visible preview of connected tabs)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TAB 2 PREVIEW: PHOTOS */}
            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline-sm text-xs font-bold text-[#151b2a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff8928] text-[20px]">
                      photo_library
                    </span>
                    <span>Event Photos</span>
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
                    {photoCount} Photos
                  </span>
                </div>
                <p className="font-sans text-xs text-[#45464e] mb-4">
                  Upload and organize photographs for this event. Thumbnails support set as cover, caption, and delete.
                </p>
                <div className="border border-dashed border-[#c6c6cf] rounded p-4 text-center bg-[#f2f3ff]/40">
                  <span className="material-symbols-outlined text-[#76767f] text-[24px] mb-1">
                    image
                  </span>
                  <p className="font-sans text-xs text-[#151b2a] font-medium">
                    {photoCount > 0 ? `${photoCount} photos uploaded` : 'No photos added yet'}
                  </p>
                  <p className="font-mono text-[10px] text-[#45464e]">
                    Drag photos here or choose files
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className="mt-4 w-full py-2 border border-[#c6c6cf] hover:border-[#ff8928] bg-white text-[#151b2a] font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Manage Photos</span>
              </button>
            </div>

            {/* TAB 3 PREVIEW: REPORT (PDF) */}
            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline-sm text-xs font-bold text-[#151b2a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                      picture_as_pdf
                    </span>
                    <span>Event Report</span>
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
                    {reportFileName ? 'PDF Loaded' : 'PDF'}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#45464e] mb-4">
                  Upload the official event report PDF for attendees and records. Download, replace, or delete anytime.
                </p>
                <div className="border border-dashed border-[#c6c6cf] rounded p-4 text-center bg-[#f2f3ff]/40">
                  <span className="material-symbols-outlined text-[#76767f] text-[24px] mb-1">
                    description
                  </span>
                  <p className="font-sans text-xs text-[#151b2a] font-medium">
                    {reportFileName ? reportFileName : 'No report uploaded yet'}
                  </p>
                  <p className="font-mono text-[10px] text-[#45464e]">
                    Single document file up to 25MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className="mt-4 w-full py-2 border border-[#c6c6cf] hover:border-[#ff8928] bg-white text-[#151b2a] font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>{reportFileName ? 'Replace Report' : 'Choose PDF Report'}</span>
              </button>
            </div>

            {/* TAB 4 PREVIEW: ADDITIONAL RESOURCES */}
            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline-sm text-xs font-bold text-[#151b2a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d1b3d] text-[20px]">
                      attachment
                    </span>
                    <span>Additional Resources</span>
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e9edff] text-[#45464e]">
                    {resourcesList.length > 0 ? `${resourcesList.length} Links` : 'Optional'}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#45464e] mb-4">
                  Attach keynote slides, external reference links, or the official IEEE/vTools meeting recording URL.
                </p>
                <div className="border border-dashed border-[#c6c6cf] rounded p-4 text-center bg-[#f2f3ff]/40">
                  <span className="material-symbols-outlined text-[#76767f] text-[24px] mb-1">
                    link
                  </span>
                  <p className="font-sans text-xs text-[#151b2a] font-medium">
                    {resourcesList.length > 0 ? `${resourcesList.length} external links` : 'No external links attached'}
                  </p>
                  <p className="font-mono text-[10px] text-[#45464e]">
                    e.g., Slides, GitHub repo, or vTools
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className="mt-4 w-full py-2 border border-[#c6c6cf] hover:border-[#ff8928] bg-white text-[#151b2a] font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_link</span>
                <span>Add Resource Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: BOTTOM SUMMARY GUIDANCE */}
      <section className="bg-white border-l-4 border-[#ff8928] rounded-r-lg p-6 shadow-sm flex items-start gap-4">
        <span className="material-symbols-outlined text-[#ff8928] text-2xl mt-0.5 shrink-0">
          info
        </span>
        <div>
          <h4 className="font-headline-sm text-sm font-bold text-[#151b2a]">
            Publishing Workflow
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#45464e] mt-1 leading-relaxed">
            How it works: Publishing an event automatically creates its public event page and surfaces recent highlights and photos on the chapter homepage. You can keep events as drafts until all materials are ready.
          </p>
        </div>
      </section>
    </section>
  );
};
