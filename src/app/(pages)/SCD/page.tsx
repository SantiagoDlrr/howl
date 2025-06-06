'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Feature panels (keep your own relative paths)
import DAContainer from '../../_components/SCD/DeepAnalisis/DAContainer';
import ClientInsightPage from '../testttt/page';
import FeedbackManagerPage from '../testFM/page';


const SCD = () => {
  /** Which panel is currently displayed, or `null` for none. */
  const [activePanel, setActivePanel] = useState<string | null>(null);
  /** If `true`, the menu is collapsed into the floating button. */
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);

  /* --------------------------------------------------------------------- */
  /** Panels metadata – keep colours / images in one place. */
  const panels = [
    {
      id: 'ClientInsight',
      title: 'Client Insight',
      badge: 'Smart Recommendations',
      description:
        'Personalised customer context built from previous interactions, emotional tone, and key topics—empowering agents with a single AI‑powered briefing per client.',
      image: '/images/sr.jpg',
      color: 'purple'
    },
    {
      id: 'FeedbackManager',
      title: 'Feedback Manager',
      badge: 'Smart Recommendations',
      description:
        'AI‑driven performance insights that compare customer satisfaction and behaviour over time—helping agents track progress and act on weekly feedback.',
      image: '/images/gc.jpg',
      color: 'orange'
    },
    {
      id: 'deep-analysis',
      title: 'Deep Analysis',
      badge: 'RAG Interface',
      description:
        'Advanced analytics dashboard with comprehensive data visualisation and performance metrics for strategic decision‑making.',
      image: '/images/da.jpg',
      color: 'blue'
    }
  ] as const;

  /** Map theme‑colour → tailwind fragments. */
  const c = (k: 'purple' | 'orange' | 'blue') =>
    ({
      ring: {
        purple: 'ring-purple-500',
        orange: 'ring-orange-500',
        blue: 'ring-blue-500'
      }[k],
      overlay: {
        purple: 'bg-purple-500/20',
        orange: 'bg-orange-500/20',
        blue: 'bg-blue-500/20'
      }[k],
      badge: {
        purple: 'bg-purple-500/80',
        orange: 'bg-orange-500/80',
        blue: 'bg-blue-500/80'
      }[k]
    });

  /* --------------------------------------------------------------------- */
  /** Open a panel and collapse the menu for more space. */
  const openPanel = (id: string) => {
    setActivePanel(id);
    setMenuCollapsed(true); // always give content maximum width when a panel is opened
  };

  /** Toggle menu collapsed state without touching activePanel. */
  const toggleMenu = () => setMenuCollapsed((v) => !v);

  /* --------------------------------------------------------------------- */
  return (
    <div className="flex flex-col w-full pt-16 h-[calc(100vh-4rem)] bg-gray-50 relative">
      {/* ───────── Floating *expand* icon (visible only when menuCollapsed) ───────── */}
      {menuCollapsed && (
        <button
          aria-label="Expand menu"
          onClick={toggleMenu}
          className="fixed top-48 left-4 z-50 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* ───────── Centered menu grid (hidden while collapsed) ───────── */}
      {!menuCollapsed && (
        <aside className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="w-full max-w-5xl">
            {/* Collapse control row */}
            <div className="flex justify-end mb-4">
              <button
                aria-label="Collapse menu"
                onClick={toggleMenu}
                className="p-2 bg-white/80 hover:bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {panels.map(({ id, title, badge, description, image, color }) => {
                const colors = c(color as 'purple' | 'orange' | 'blue');
                const isActive = activePanel === id;
                return (
                  <article
                    key={id}
                    aria-label={`${title} card`}
                    onClick={() => openPanel(id)}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                      isActive ? `ring-4 ${colors.ring}` : ''
                    }`}
                  >
                    {/* Background */}
                    <div className="h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] relative">
                      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 ${colors.overlay}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Caption */}
                      <footer className="absolute bottom-0 inset-x-0 p-6 text-white">
                        <span className={`inline-block mb-2 px-3 py-1 text-sm font-medium rounded-full ${colors.badge}`}>{badge}</span>
                        <h3 className="text-xl font-bold mb-2">{title}</h3>
                        <p className="text-sm leading-relaxed text-gray-200">{description}</p>
                      </footer>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* ───────── Active panel content (fills remaining space) ───────── */}
      {activePanel && (
        <main aria-live="polite" className="flex-1 overflow-auto">
          {activePanel === 'deep-analysis' && <DAContainer />}
          {activePanel === 'ClientInsight' && <ClientInsightPage />}
          {activePanel === 'FeedbackManager' && <FeedbackManagerPage />}
        </main>
      )}

      {/* ───────── Empty‑state when no panel selected ───────── */}
      {!activePanel && (
        <section className="flex-1 flex items-center justify-center">
          <div className="text-center p-12 bg-white/80 backdrop-blur rounded-2xl border border-gray-200 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Smart Call Diagnostics</h2>
            <p className="text-gray-600 leading-relaxed">
              Select a module above to get started with AI‑powered call analysis and customer insights.
            </p>
          </div>
        </section>
      )}

      {/* Global smooth‑scroll behaviour */}
      <style jsx global>{`
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default SCD;
