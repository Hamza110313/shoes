import { useState } from 'react';
import {
  Bell,
  Check,
  Copy,
  MessageCircle,
  Send,
  Share2,
} from 'lucide-react';
import {
  DesignMode,
  DropUpdate,
  ShoeProduct,
  UpdateCategory,
  WhatsAppPreferences,
} from '../types';
import { formatPKR } from '../utils/currency';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatUpdateWhatsAppMessage,
  triggerNativeShare,
} from '../utils/whatsapp';

interface WhatsAppUpdatesScreenProps {
  mode: DesignMode;
  updates: DropUpdate[];
  products: ShoeProduct[];
  preferences: WhatsAppPreferences;
  onUpdatePreferences: (next: WhatsAppPreferences) => void;
  onPublishUpdate: (newUpdate: DropUpdate) => void;
  onInspectProduct: (productId: string) => void;
}

const FILTER_TABS: { id: UpdateCategory; label: string }[] = [
  { id: 'all', label: 'All Updates' },
  { id: 'drop', label: 'New Drops' },
  { id: 'restock', label: 'Restocks' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'order', label: 'Orders' },
];

export function WhatsAppUpdatesScreen({
  mode,
  updates,
  products,
  preferences,
  onUpdatePreferences,
  onPublishUpdate,
  onInspectProduct,
}: WhatsAppUpdatesScreenProps) {
  const isObsidian = mode === 'obsidian';

  const [activeFilter, setActiveFilter] = useState<UpdateCategory>('all');
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ''
  );
  const [composeCategory, setComposeCategory] =
    useState<Exclude<UpdateCategory, 'all'>>('drop');
  const [composeTitle, setComposeTitle] = useState(
    'PRO - X1 shoe — Run Club Drop Dispatch'
  );
  const [composeSummary, setComposeSummary] = useState(
    'Limited marathon batch open now. Reply with your US size to lock allocation before 18:00.'
  );
  const [customNote, setCustomNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const filteredUpdates =
    activeFilter === 'all'
      ? updates
      : updates.filter((u) => u.category === activeFilter);

  const linkedProduct = products.find((p) => p.id === selectedProductId);

  const draftUpdate: DropUpdate = {
    id: 'draft-preview',
    category: composeCategory,
    categoryLabel:
      composeCategory === 'drop'
        ? 'Drop Release'
        : composeCategory === 'restock'
          ? 'Size Restock'
          : composeCategory === 'telemetry'
            ? 'Track Telemetry'
            : 'Order Milestone',
    title: composeTitle.trim() || 'Pro-X1 Shoe Update',
    summary: composeSummary.trim() || 'Live footwear update from Pro-X1 Shoe.',
    timestamp: 'Just now',
    author: 'Broadcast Dispatch',
    productId: linkedProduct?.id,
    productName: linkedProduct?.name,
    highlightMetric: linkedProduct ? formatPKR(linkedProduct.price) : undefined,
  };

  const previewMessage = formatUpdateWhatsAppMessage(
    draftUpdate,
    linkedProduct,
    customNote
  );
  const previewWaUrl = buildWhatsAppUrl(
    previewMessage,
    preferences.recipientPhone
  );

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTitle.trim() || !composeSummary.trim()) return;
    onPublishUpdate({
      ...draftUpdate,
      id: `upd-${Date.now()}`,
      timestamp: 'Just now',
    });
  };

  const handleSavePrefs = () => {
    setPrefsSaved(true);
    window.setTimeout(() => setPrefsSaved(false), 1800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div
            className={`text-xs font-semibold uppercase tracking-wider ${
              isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-display-apex'
            }`}
          >
            WhatsApp Dispatch & Live Updates
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isObsidian
                ? 'font-display-obsidian text-white'
                : 'font-display-apex uppercase text-[#0d0d0e]'
            }`}
          >
            Drop Alerts & Channel Sharing
          </h2>
          <p
            className={`text-sm max-w-2xl ${
              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
            }`}
          >
            Send restock alerts, split-time lab records, and order updates
            directly to WhatsApp contacts or running clubs in one click.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div
          className={`inline-flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full w-full md:w-auto ${
            isObsidian
              ? 'rounded-full bg-[#18181b] border border-zinc-800'
              : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
          }`}
        >
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[36px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isObsidian
                    ? `rounded-full ${
                        active
                          ? 'bg-[#ccff00] text-[#09090b]'
                          : 'text-zinc-400 hover:text-white'
                      }`
                    : `rounded-none ${
                        active
                          ? 'bg-[#0d0d0e] text-white'
                          : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                      }`
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Grid: Updates Timeline (Left) + WhatsApp Composer & Subscriptions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Updates Feed */}
        <div className="lg:col-span-7 space-y-4">
          {filteredUpdates.length === 0 ? (
            <div
              className={`p-8 text-center text-sm ${
                isObsidian
                  ? 'rounded-2xl bg-[#18181b] border border-zinc-800 text-zinc-400'
                  : 'rounded-none bg-white border border-[#0d0d0e] text-[#5f5e5f]'
              }`}
            >
              No updates in this category yet. Compose one on the right to
              publish and share via WhatsApp.
            </div>
          ) : (
            filteredUpdates.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              const formattedMsg = formatUpdateWhatsAppMessage(item, product);
              const waUrl = buildWhatsAppUrl(
                formattedMsg,
                preferences.recipientPhone
              );

              return (
                <article
                  key={item.id}
                  className={`p-4 sm:p-6 space-y-4 transition-all duration-150 ${
                    isObsidian
                      ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                      : 'rounded-none bg-white border border-[#0d0d0e] hover:shadow-[4px_4px_0px_#0d0d0e]'
                  }`}
                >
                  {/* Unboxed quiet metadata line */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 text-xs ${
                      isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          item.category === 'drop' || item.category === 'restock'
                            ? isObsidian
                              ? 'text-[#ccff00]'
                              : 'text-[#e5001a]'
                            : ''
                        }`}
                      >
                        {item.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.author}</span>
                    </div>
                    <span className="font-mono-tech">{item.timestamp}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3
                      className={`text-lg font-bold tracking-tight ${
                        isObsidian
                          ? 'font-display-obsidian text-white'
                          : 'font-display-apex uppercase text-[#0d0d0e]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isObsidian ? 'text-zinc-300' : 'text-[#474647]'
                      }`}
                    >
                      {item.summary}
                    </p>
                  </div>

                  {item.highlightMetric && (
                    <div
                      className={`text-xs font-mono-tech ${
                        isObsidian ? 'text-[#ccff00]' : 'text-[#0d0d0e] font-semibold'
                      }`}
                    >
                      {item.highlightMetric}
                    </div>
                  )}

                  <div
                    className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 ${
                      isObsidian ? 'border-zinc-800' : 'border-zinc-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                          isObsidian
                            ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                            : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, formattedMsg)}
                        className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                          isObsidian
                            ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                            : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#f4f4f5]'
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {product && (
                      <button
                        type="button"
                        onClick={() => onInspectProduct(product.id)}
                        className={`text-xs font-semibold underline underline-offset-4 cursor-pointer ${
                          isObsidian
                            ? 'text-zinc-300 hover:text-[#ccff00]'
                            : 'text-[#0d0d0e] hover:text-[#e5001a]'
                        }`}
                      >
                        Inspect {product.name}
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column: WhatsApp Broadcast Composer & Alert Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recipient & Alert Subscriptions */}
          <div
            className={`p-4 sm:p-6 space-y-4 ${
              isObsidian
                ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                : 'rounded-none bg-white border border-[#0d0d0e]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bell
                  className={`w-4 h-4 ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                  }`}
                />
                <h3
                  className={`text-sm font-bold uppercase tracking-wider ${
                    isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                  }`}
                >
                  WhatsApp Alert Preferences
                </h3>
              </div>
              {prefsSaved && (
                <span
                  className={`text-xs font-semibold ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                  }`}
                >
                  Saved
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="wa-recipient-input"
                className={`block text-xs font-semibold ${
                  isObsidian ? 'text-zinc-300' : 'text-[#474647]'
                }`}
              >
                Default WhatsApp Number (optional — leave blank to pick contact)
              </label>
              <input
                id="wa-recipient-input"
                type="tel"
                value={preferences.recipientPhone}
                onChange={(e) => {
                  onUpdatePreferences({
                    ...preferences,
                    recipientPhone: e.target.value,
                  });
                  handleSavePrefs();
                }}
                placeholder="+1 415 555 0194"
                className={`w-full h-11 px-3.5 text-base sm:text-sm outline-none transition-colors ${
                  isObsidian
                    ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { key: 'notifyDrops', label: 'New Drops' },
                { key: 'notifyRestocks', label: 'Size Restocks' },
                { key: 'notifyOrders', label: 'Order Tracking' },
                { key: 'notifyTelemetry', label: 'Lab Telemetry' },
              ].map((pref) => {
                const checked = Boolean(
                  preferences[pref.key as keyof WhatsAppPreferences]
                );
                return (
                  <label
                    key={pref.key}
                    className={`flex items-center gap-2 p-2.5 cursor-pointer border transition-colors ${
                      isObsidian
                        ? `rounded-lg ${
                            checked
                              ? 'bg-[#09090b] border-[#ccff00]/60 text-white'
                              : 'bg-[#09090b] border-zinc-800 text-zinc-400'
                          }`
                        : `rounded-none ${
                            checked
                              ? 'bg-[#0d0d0e] border-[#0d0d0e] text-white'
                              : 'bg-white border-[#0d0d0e] text-[#0d0d0e]'
                          }`
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        onUpdatePreferences({
                          ...preferences,
                          [pref.key]: e.target.checked,
                        });
                        handleSavePrefs();
                      }}
                      className="accent-[#ccff00]"
                    />
                    <span className="font-medium">{pref.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Broadcast Composer */}
          <form
            onSubmit={handlePublish}
            className={`p-4 sm:p-6 space-y-4 ${
              isObsidian
                ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                : 'rounded-none bg-white border border-[#0d0d0e] apex-hard-shadow'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-sm font-bold uppercase tracking-wider ${
                  isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                }`}
              >
                Compose & Dispatch Update
              </h3>
              <span
                className={`text-[11px] font-mono-tech ${
                  isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                }`}
              >
                wa.me Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="compose-category"
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                  }`}
                >
                  Update Type
                </label>
                <select
                  id="compose-category"
                  value={composeCategory}
                  onChange={(e) =>
                    setComposeCategory(
                      e.target.value as Exclude<UpdateCategory, 'all'>
                    )
                  }
                  className={`w-full h-11 px-3 text-base sm:text-xs font-semibold outline-none ${
                    isObsidian
                      ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white focus:border-[#ccff00]'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e]'
                  }`}
                >
                  <option value="drop">Drop Release</option>
                  <option value="restock">Size Restock</option>
                  <option value="telemetry">Track Telemetry</option>
                  <option value="order">Order Milestone</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="compose-shoe"
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                  }`}
                >
                  Attach Model
                </label>
                <select
                  id="compose-shoe"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className={`w-full h-11 px-3 text-base sm:text-xs font-semibold outline-none ${
                    isObsidian
                      ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white focus:border-[#ccff00]'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e]'
                  }`}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="compose-title"
                className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Headline
              </label>
              <input
                id="compose-title"
                type="text"
                value={composeTitle}
                onChange={(e) => setComposeTitle(e.target.value)}
                required
                className={`w-full h-11 px-3.5 text-base sm:text-sm outline-none ${
                  isObsidian
                    ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white focus:border-[#ccff00]'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e]'
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="compose-summary"
                className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Update Details
              </label>
              <textarea
                id="compose-summary"
                rows={3}
                value={composeSummary}
                onChange={(e) => setComposeSummary(e.target.value)}
                required
                className={`w-full p-3.5 text-base sm:text-sm outline-none resize-none ${
                  isObsidian
                    ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white focus:border-[#ccff00]'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e]'
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="compose-note"
                className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Personal WhatsApp Note (optional)
              </label>
              <input
                id="compose-note"
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Grab US 9.5 before Saturday track session!"
                className={`w-full h-11 px-3.5 text-base sm:text-xs outline-none ${
                  isObsidian
                    ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676]'
                }`}
              />
            </div>

            {/* Live Formatted WhatsApp Message Preview */}
            <div
              className={`p-3.5 text-xs font-mono-tech whitespace-pre-wrap leading-relaxed ${
                isObsidian
                  ? 'rounded-xl bg-[#09090b] border border-zinc-800 text-zinc-300'
                  : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#1a1c1d]'
              }`}
            >
              {previewMessage}
            </div>

            {/* Composer Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={previewWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 min-w-[165px] h-12 inline-flex items-center justify-center gap-2 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isObsidian
                    ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                    : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>

              <button
                type="submit"
                className={`h-12 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                    : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Feed</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy('composer', previewMessage)}
                aria-label="Copy formatted WhatsApp message"
                className={`h-12 w-12 inline-flex items-center justify-center cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                    : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#f4f4f5]'
                }`}
              >
                {copiedId === 'composer' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => triggerNativeShare(composeTitle, previewMessage)}
                aria-label="Share via native share sheet"
                className={`h-12 w-12 inline-flex items-center justify-center cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                    : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#f4f4f5]'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
