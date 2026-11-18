'use client';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useReducer, useState } from 'react';
import {
  entries,
  gallerySlots,
  profile,
  realms,
  type MascotState,
  type Panel,
  type RealmId,
} from '@/data/portfolio';
import { initialJourney, journeyReducer } from '@/lib/journey';
import Modal from './Modal';
import Fallback from './Fallback';
const Atelier = dynamic(() => import('@/scenes3d/Atelier'), {
  ssr: false,
  loading: () => <div className="scene-loading">Gathering the woodland light…</div>,
});
class SceneBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}
const pages = [
  [
    'An inventor’s sketchbook',
    'A little logic. A little imagination.',
    'Explore the places where code, design, and art meet.',
  ],
  [
    'Think in systems',
    'Engineering & experimentation',
    'A space for technical projects and AI/ML explorations.',
  ],
  [
    'Make with feeling',
    'Design, motion & paint',
    'A space for interfaces, visual stories, and creative practice.',
  ],
  ['Keep being curious', 'Books, craft & discovery', 'Follow a thread. See where it takes you.'],
];
export default function Experience() {
  const [journey, dispatch] = useReducer(journeyReducer, initialJourney);
  const [panel, setPanel] = useState<Panel>(null),
    [realm, setRealm] = useState<RealmId>('art');
  const [mascot, setMascot] = useState<MascotState>('idle');
  const [reduced, setReduced] = useState(false),
    [low, setLow] = useState(false),
    [lightweight, setLightweight] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null),
    [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState(''),
    [command, setCommand] = useState(false);
  const skip = useCallback(() => {
    dispatch({ type: 'skip' });
    try {
      sessionStorage.setItem('srishti_intro_seen', 'true');
    } catch {
      /* Storage is optional. */
    }
  }, []);
  const openPanel = useCallback(
    (next: Panel) => {
      skip();
      setMascot('idle');
      setPanel(next);
      setCommand(false);
    },
    [skip],
  );
  const back = useCallback(() => {
    if (panel) setPanel(null);
    else if (command) setCommand(false);
    else dispatch({ type: 'back' });
  }, [panel, command]);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(motion.matches);
    motion.addEventListener('change', update);
    const initialize = requestAnimationFrame(() => {
      update();
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      setSupported(Boolean(gl));
      const debug = gl?.getExtension('WEBGL_debug_renderer_info');
      const renderer = gl && debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      setLow(
        navigator.hardwareConcurrency <= 4 ||
          matchMedia('(max-width: 700px)').matches ||
          /swiftshader|llvmpipe|software/i.test(renderer),
      );
      try {
        if (sessionStorage.getItem('srishti_intro_seen') || motion.matches || location.hash)
          dispatch({ type: 'skip' });
      } catch {
        if (motion.matches) dispatch({ type: 'skip' });
      }
      syncHash();
    });
    const syncHash = () => {
      const hash = location.hash.slice(1);
      if (['work', 'about', 'resume', 'contact'].includes(hash)) {
        dispatch({ type: 'skip' });
        setPanel(hash as Panel);
      }
    };
    window.addEventListener('hashchange', syncHash);
    return () => {
      cancelAnimationFrame(initialize);
      motion.removeEventListener('change', update);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);
  useEffect(() => {
    if (journey.view !== 'intro' || supported === null || (supported && !loaded && !lightweight))
      return;
    const timer = setTimeout(skip, 5000);
    return () => clearTimeout(timer);
  }, [journey.view, supported, loaded, lightweight, skip]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        skip();
        setPanel(null);
        setCommand((v) => !v);
      }
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) back();
      if (panel || command || (event.target as HTMLElement).matches('input, textarea, select'))
        return;
      if (journey.view === 'book' && event.key === 'ArrowRight')
        dispatch({ type: 'page', direction: 1 });
      if (journey.view === 'book' && event.key === 'ArrowLeft')
        dispatch({ type: 'page', direction: -1 });
      if (journey.view === 'gallery' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        const count = gallerySlots(realm).length;
        dispatch({
          type: 'inspect',
          index:
            ((journey.inspected ?? (event.key === 'ArrowRight' ? -1 : 0)) +
              (event.key === 'ArrowRight' ? 1 : -1) +
              count) %
            count,
        });
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [journey, realm, panel, command, back, skip]);
  useEffect(() => {
    if (['wave', 'celebrate', 'turn'].includes(mascot)) {
      const timer = setTimeout(() => setMascot('idle'), 1800);
      return () => clearTimeout(timer);
    }
  }, [mascot]);
  const openBook = () => {
    skip();
    dispatch({ type: 'open' });
    setMascot('interact');
  };
  const enterRealm = (id: RealmId) => {
    setRealm(id);
    setPanel(null);
    if (id === 'about' || supported === false || lightweight) openPanel(id);
    else {
      dispatch({ type: 'gallery' });
      setMascot('celebrate');
    }
  };
  const fallback = supported === false || lightweight;
  const currentRealm = realms.find((item) => item.id === realm)!;
  const selected = journey.inspected === null ? null : gallerySlots(realm)[journey.inspected];
  const showIndex =
    journey.view === 'hub' || (fallback && journey.view !== 'intro' && journey.view !== 'book');
  const ready = useCallback(() => setLoaded(true), []);
  const failed = useCallback(() => setSupported(false), []);
  const commands = (
    [
      'work',
      'about',
      'resume',
      'contact',
      ...realms.filter((r) => r.id !== 'about').map((r) => r.id),
    ] as Exclude<Panel, null>[]
  ).filter((id) =>
    `${id} ${realms.find((r) => r.id === id)?.name ?? ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main className="experience">
      <a className="skip-link" href="#work" onClick={() => openPanel('work')}>
        Skip to work
      </a>
      <header className="hud">
        <button
          className="brand"
          onClick={() => {
            skip();
            setPanel(null);
          }}
          aria-label="Return to atelier"
        >
          <span className="monogram">
            sg<span>✦</span>
          </span>
          <span className="brand-name">
            Srishti Gupta<small>THE ENCHANTED ATELIER</small>
          </span>
        </button>
        <nav aria-label="Professional navigation">
          {(['work', 'about', 'resume', 'contact'] as const).map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                openPanel(id);
              }}
            >
              {id === 'work' ? 'Work' : id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <button
          className="menu-key"
          onClick={() => {
            skip();
            setCommand(true);
          }}
          aria-label="Open quick navigation"
        >
          ⌘ K
        </button>
      </header>
      <div className="scene" aria-label="Interactive three-dimensional woodland atelier">
        {supported === null ? (
          <div className="scene-loading">Finding the forest…</div>
        ) : fallback ? (
          <Fallback
            reason={
              lightweight
                ? 'You’re in the quiet, lightweight edition.'
                : '3D is unavailable on this device.'
            }
          />
        ) : (
          <SceneBoundary onError={failed}>
            <Atelier
              journey={journey}
              realm={realm}
              mascot={mascot}
              setMascot={setMascot}
              reduced={reduced}
              low={low}
              paused={Boolean(panel || command)}
              downgrade={() => setLow(true)}
              openBook={openBook}
              inspect={(index) => dispatch({ type: 'inspect', index })}
              enterRealm={enterRealm}
              ready={ready}
              failed={failed}
            />
          </SceneBoundary>
        )}
      </div>
      <div className="vignette" />
      <div className="location">
        <span className="live-dot" />
        <span>
          {journey.view === 'gallery' ? currentRealm.name : 'Somewhere between logic & magic'}
        </span>
      </div>
      {journey.view === 'intro' && (
        <section className="intro" aria-label="Introduction">
          <p className="eyebrow">A SMALL WORLD BY</p>
          <h1>Srishti Gupta</h1>
          <p>Code. Create. Stay curious.</p>
          <button className="text-button" onClick={skip}>
            Step inside <span>↗</span>
          </button>
          <div className={`intro-progress ${loaded || fallback ? 'running' : ''}`} />
          <button className="intro-skip" onClick={skip}>
            Skip intro →
          </button>
        </section>
      )}
      {journey.view === 'studio' && !showIndex && (
        <>
          <section className="scene-caption">
            <p className="eyebrow">WELCOME TO MY LITTLE CORNER OF THE UNIVERSE</p>
            <h1>
              The enchanted
              <br />
              <em>atelier.</em>
            </h1>
            <p>A curious mind. A thousand ways to create.</p>
          </section>
          <div className="invitation">
            <span className="annotation">Every idea begins with a blank page.</span>
            <button
              className="primary"
              onClick={openBook}
              onPointerEnter={() => setMascot('interact')}
              onPointerLeave={() => setMascot('idle')}
            >
              Open the sketchbook <span>↗</span>
            </button>
            <button
              className="text-button"
              onClick={() => {
                skip();
                dispatch({ type: 'portal' });
              }}
            >
              Explore the worlds
            </button>
          </div>
        </>
      )}
      {journey.view === 'book' && (
        <section className="book-notes" aria-label="Sketchbook pages">
          <p className="eyebrow">
            THE INVENTOR’S NOTES / {String(journey.page + 1).padStart(2, '0')}
          </p>
          <h2>{pages[journey.page][0]}</h2>
          <p className="book-subtitle">{pages[journey.page][1]}</p>
          <p>{pages[journey.page][2]}</p>
          <div className="page-actions">
            <button
              onClick={() => dispatch({ type: 'page', direction: -1 })}
              aria-label="Previous page"
            >
              ←
            </button>
            <span>{journey.page + 1} / 4</span>
            <button onClick={() => dispatch({ type: 'page', direction: 1 })} aria-label="Next page">
              →
            </button>
          </div>
          <button className="primary" onClick={() => dispatch({ type: 'portal' })}>
            Activate the portals ↗
          </button>
        </section>
      )}
      {showIndex && (
        <section className="world-index" aria-label="Portfolio world hub">
          <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
          <h1>Choose a world.</h1>
          <div className="realm-list">
            {realms.map((item) => (
              <button key={item.id} onClick={() => enterRealm(item.id)}>
                <span className="realm-number" style={{ color: item.color }}>
                  {item.symbol}
                </span>
                <span>
                  {item.name}
                  <small>{item.subtitle}</small>
                </span>
                <span className="realm-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {journey.view === 'gallery' && !fallback && (
        <>
          <section className="gallery-caption">
            <p className="eyebrow">THE ATELIER / {currentRealm.short.toUpperCase()}</p>
            <h1>{currentRealm.name}</h1>
            <p>
              {journey.inspected === null
                ? 'Drag to look around. Select a frame to come closer.'
                : (selected?.title ?? 'An exhibition in the making')}
            </p>
          </section>
          <div className="gallery-actions">
            {gallerySlots(realm).map((entry, i) => (
              <button
                key={entry?.id ?? i}
                aria-label={`Inspect ${entry?.title ?? `empty frame ${i + 1}`}`}
                aria-pressed={journey.inspected === i}
                onClick={() => dispatch({ type: 'inspect', index: i })}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
            <button onClick={() => setPanel(realm)}>Exhibition notes ↗</button>
          </div>
          {journey.inspected !== null && (
            <aside className="inspection">
              <p className="eyebrow">{selected ? 'WORK DETAILS' : 'PLACEHOLDER FRAME'}</p>
              <h2>{selected?.title ?? 'Curating this exhibition'}</h2>
              <p>
                {selected?.description ??
                  'This frame is reserved for real work. No artwork has been added yet.'}
              </p>
              {selected?.medium && (
                <p>
                  {selected.medium} · {selected.year}
                </p>
              )}
              <button className="text-button" onClick={() => dispatch({ type: 'back' })}>
                Return to gallery ←
              </button>
            </aside>
          )}
        </>
      )}
      {journey.view !== 'intro' && journey.view !== 'studio' && (
        <button
          className="back-button"
          onClick={() => {
            dispatch({ type: 'back' });
            setMascot('idle');
          }}
        >
          ←{' '}
          {journey.inspected !== null
            ? 'Gallery'
            : journey.view === 'gallery'
              ? 'Worlds'
              : 'Atelier'}
        </button>
      )}
      <footer className="scene-footer">
        <span>AN EXPLORATION IN CODE & CRAFT</span>
        <div>
          <button
            onClick={() => {
              setLightweight((v) => !v);
              skip();
            }}
            aria-pressed={lightweight}
            disabled={supported === false}
          >
            {supported === false ? '3D unavailable' : fallback ? 'Enable 3D' : 'Quiet mode'}
          </button>
          <button onClick={() => setLow((v) => !v)} aria-pressed={low}>
            {low ? 'Quality: gentle' : 'Quality: full'}
          </button>
          <button onClick={() => openPanel('guide')}>Field guide</button>
        </div>
        <span className="edition">VOL. 01 — A WORLD IN THE MAKING</span>
      </footer>
      {panel && (
        <Modal
          title={
            panel === 'work'
              ? 'A cabinet of curiosities'
              : panel === 'about'
                ? 'Hello, I’m Srishti.'
                : panel === 'resume'
                  ? 'The professional chapter'
                  : panel === 'contact'
                    ? 'Let’s make something meaningful.'
                    : panel === 'guide'
                      ? 'A few notes for your visit'
                      : (realms.find((item) => item.id === panel)?.name ?? '')
          }
          close={() => setPanel(null)}
        >
          {panel === 'work' ? (
            <>
              <p>Choose a discipline to visit its exhibition.</p>
              <div className="modal-realms">
                {realms
                  .filter((r) => r.id !== 'about')
                  .map((r) => (
                    <button key={r.id} onClick={() => enterRealm(r.id)}>
                      <span>{r.symbol}</span>
                      {r.name}
                      <small>
                        {entries.filter((e) => e.realm === r.id).length} curated works ↗
                      </small>
                    </button>
                  ))}
              </div>
            </>
          ) : panel === 'about' ? (
            <>
              <p className="lead">{profile.title}</p>
              <p>{profile.bio}</p>
              <p>This atelier brings those interests into one explorable space.</p>
              <p className="fine-print">
                The 3D guide is a temporary procedural character, not a final likeness. A custom
                sculpt and rig are still to come.
              </p>
            </>
          ) : panel === 'resume' ? (
            <>
              <p>{profile.title}</p>
              {profile.resume ? (
                <a className="primary" href={profile.resume} download>
                  Download resume PDF ↓
                </a>
              ) : (
                <p className="empty-note">
                  The resume is being prepared. No PDF or verified education and experience timeline
                  has been supplied yet.
                </p>
              )}
              {profile.education.map((item) => (
                <p key={item.institution}>
                  {item.institution} · {item.degree} · {item.period}
                </p>
              ))}
            </>
          ) : panel === 'contact' ? (
            <>
              {profile.email ? (
                <a className="primary" href={`mailto:${profile.email}`}>
                  Write to Srishti ↗
                </a>
              ) : (
                <p className="empty-note">
                  Contact details are coming soon. A verified email address and social links will
                  appear here when supplied.
                </p>
              )}
              <p className="fine-print">
                There is no message submission service connected to this portfolio yet.
              </p>
            </>
          ) : panel === 'guide' ? (
            <>
              <p>
                Click the sketchbook to approach it. Turn the pages, activate the portals, and
                choose a world. In a gallery, drag to look around or select a numbered frame.
              </p>
              <p>
                Use ← / → for pages or gallery frames. Escape goes back. Work, About, Resume, and
                Contact are always available above. Ctrl / ⌘ K opens quick navigation.
              </p>
              <p>
                Quiet mode offers the same navigation without WebGL. Your device’s reduced-motion
                preference is respected. Audio is off; no sound assets are included.
              </p>
              <label className="state-picker">
                Temporary guide animation
                <select value={mascot} onChange={(e) => setMascot(e.target.value as MascotState)}>
                  {['idle', 'wave', 'walk', 'run', 'turn', 'interact', 'celebrate', 'sit'].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </label>
              <p className="fine-print">
                Procedural guide animations are blocking poses, pending a custom rig.
              </p>
            </>
          ) : (
            <>
              <p>{realms.find((r) => r.id === panel)?.subtitle}</p>
              {entries.filter((e) => e.realm === panel).length ? (
                entries
                  .filter((e) => e.realm === panel)
                  .map((e) => (
                    <article key={e.id}>
                      <h3>{e.title}</h3>
                      <p>{e.description}</p>
                      {e.url && (
                        <a href={e.url} target="_blank" rel="noopener noreferrer">
                          View work ↗
                        </a>
                      )}
                    </article>
                  ))
              ) : (
                <p className="empty-note">
                  Curating this exhibition. Real work, context, and process notes will be added
                  here. The gallery’s empty frames are placeholders.
                </p>
              )}
              {!fallback && (
                <button className="text-button" onClick={() => enterRealm(panel as RealmId)}>
                  Enter the gallery ↗
                </button>
              )}
            </>
          )}
        </Modal>
      )}
      {command && (
        <Modal title="Where would you like to go?" close={() => setCommand(false)}>
          <label className="search-label">
            Find a chapter
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commands[0]) {
                  e.preventDefault();
                  openPanel(commands[0]);
                }
              }}
              placeholder="Work, art, resume…"
            />
          </label>
          <div className="command-list">
            {(
              [
                'work',
                'about',
                'resume',
                'contact',
                ...realms.filter((r) => r.id !== 'about').map((r) => r.id),
              ] as Exclude<Panel, null>[]
            )
              .filter((id) =>
                `${id} ${realms.find((r) => r.id === id)?.name ?? ''}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((id) => (
                <button key={id} onClick={() => openPanel(id)}>
                  {realms.find((r) => r.id === id)?.name ?? id}
                  <span>↗</span>
                </button>
              ))}
          </div>
        </Modal>
      )}
    </main>
  );
}
