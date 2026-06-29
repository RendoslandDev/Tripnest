import { useCallback, useEffect, useState } from 'react';
import type { PropertyTour, TourHotspot, TourRoom } from '../../../types';
import { getPropertyTour } from '../../../api/tours';
import { useAsync } from '../../../hooks/useAsync';
import CategoryIcon from './CategoryIcon';

const AUTOPLAY_MS = 4200;

interface VirtualTourProps {
  propertyId: string;
  onClose: () => void;
}

/** Full-screen immersive virtual tour overlay for a property. */
export default function VirtualTour({ propertyId, onClose }: VirtualTourProps) {
  const state = useAsync(() => getPropertyTour(propertyId), [propertyId]);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white">
      {state.loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-white/70">
          Preparing your walkthrough…
        </div>
      )}
      {state.error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-white/70">Couldn’t load this tour.</p>
          <button onClick={onClose} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
            Close
          </button>
        </div>
      )}
      {!state.loading && !state.error && state.data && (
        <TourStage tour={state.data} onClose={onClose} />
      )}
      {!state.loading && !state.error && !state.data && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-white/70">No tour available for this listing yet.</p>
          <button onClick={onClose} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function TourStage({ tour, onClose }: { tour: PropertyTour; onClose: () => void }) {
  const rooms = tour.rooms;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [active, setActive] = useState<TourHotspot | null>(null);

  const room = rooms[index];

  // Stories/Shorts-style navigation: wrap around so the walkthrough loops.
  const go = useCallback((target: number) => {
    setActive(null);
    setIndex(target);
  }, []);
  const next = useCallback(
    () => go((index + 1) % rooms.length),
    [go, index, rooms.length],
  );
  const prev = useCallback(
    () => go((index - 1 + rooms.length) % rooms.length),
    [go, index, rooms.length],
  );

  // Autoplay: advance while playing and no hotspot is open; loops continuously.
  useEffect(() => {
    if (!playing || active) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % rooms.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, active, index, rooms.length]);

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (active) setActive(null);
        else onClose();
      } else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, next, prev, onClose]);

  return (
    <div className="flex w-full flex-1 justify-center overflow-hidden sm:items-center sm:p-4">
      {/* Vertical 9:16 Shorts frame */}
      <div className="relative h-full w-full overflow-hidden bg-black sm:h-[92vh] sm:aspect-[9/16] sm:w-auto sm:rounded-3xl sm:shadow-2xl">
        <Scene key={room.id} room={room} active={active} onSelect={setActive} />

        {/* Tap zone for advancing (sits below hotspots & overlays). */}
        <button
          type="button"
          aria-label="Next room"
          onClick={next}
          className="absolute inset-0 z-10 cursor-default"
          tabIndex={-1}
        />

        {/* Top overlay: segmented progress + header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/70 to-transparent px-3 pb-10 pt-3">
          <div className="pointer-events-auto flex gap-1">
            {rooms.map((r, i) => {
              const animating = i === index && playing && !active;
              return (
                <div key={r.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                  <div
                    className={`h-full rounded-full bg-white ${
                      i < index
                        ? 'w-full'
                        : animating
                          ? 'w-0 animate-[tour-progress_4200ms_linear_forwards] motion-reduce:w-1/2 motion-reduce:animate-none'
                          : i === index
                            ? 'w-1/2'
                            : 'w-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div className="pointer-events-auto mt-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{tour.title}</p>
              <p className="text-xs text-white/70">
                Virtual tour · {index + 1}/{rooms.length}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close tour"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right action rail */}
        <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3">
          <RailButton label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </RailButton>
          <RailButton label="Previous room" onClick={prev}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
          </RailButton>
          <RailButton label="Next room" onClick={next}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </RailButton>
        </div>

        {/* Bottom overlay: caption + filmstrip */}
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 pt-16">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {room.area}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-white drop-shadow">{room.name}</h2>
          <p className="text-sm text-white/85">{room.caption}</p>
          {room.dimensions && <p className="mt-0.5 text-xs text-white/65">Approx. {room.dimensions}</p>}

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                onClick={() => go(i)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === index
                    ? 'border-white bg-white text-black'
                    : 'border-white/30 text-white/75 hover:bg-white/10'
                }`}
              >
                {i + 1}. {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hotspot detail panel */}
        {active && <HotspotDetail hotspot={active} onClose={() => setActive(null)} />}
      </div>
    </div>
  );
}

function Scene({
  room,
  active,
  onSelect,
}: {
  room: TourRoom;
  active: TourHotspot | null;
  onSelect: (h: TourHotspot) => void;
}) {
  return (
    <div className="absolute inset-0 animate-[tour-fade_700ms_ease-out] motion-reduce:animate-none">
      {/* Scene placeholder (or real media when supplied) */}
      {room.media ? (
        <img src={room.media} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 origin-center animate-[tour-kenburns_16s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          style={{ backgroundImage: `linear-gradient(135deg, ${room.from}, ${room.to})` }}
        />
      )}
      {/* Hotspots (above the tap zone, below the overlays) */}
      {room.hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => onSelect(h)}
          aria-label={h.label}
          className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className="absolute inset-0 -m-2 rounded-full bg-white/40 animate-ping motion-reduce:animate-none" />
          <span
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-transform group-hover:scale-110 ${
              active?.id === h.id ? 'border-white bg-brand text-white' : 'border-white bg-white/90 text-brand'
            }`}
          >
            <CategoryIcon category={h.category} />
          </span>
        </button>
      ))}
    </div>
  );
}

function RailButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
    >
      {children}
    </button>
  );
}

function HotspotDetail({ hotspot, onClose }: { hotspot: TourHotspot; onClose: () => void }) {
  return (
    <div className="absolute inset-x-3 bottom-24 z-40 mx-auto max-w-sm rounded-2xl bg-white p-4 text-ink shadow-2xl animate-[tour-fade_250ms_ease-out] motion-reduce:animate-none">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
          <CategoryIcon category={hotspot.category} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{hotspot.label}</p>
          <p className="mt-1 text-sm text-muted">{hotspot.detail}</p>
        </div>
        <button onClick={onClose} aria-label="Close detail" className="text-muted hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

