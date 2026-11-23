import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import indiaMap from '@svg-maps/india';
import { svgPathBbox } from 'svg-path-bbox';
import { completedProjectsData, type Project } from '../data/projectsData';
import { ongoingProjectsData, type OngoingProject } from '../data/ongoingProjectsData';
import { DeveloperLogo } from '../components/ClientLogo';
import { COMPANY_STATS } from '../data/companyStats';
import {
  HERO_CITIES,
  REFERENCE_CITIES,
  locateProject,
  projectLatLon,
  type MapPoint,
} from '../data/heroMap';
import { CITY_BOUNDARIES } from '../data/cityBoundaries';

interface IndiaMapLocation {
  id: string;
  name: string;
  path: string;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Size {
  w: number;
  h: number;
}

type HeroProject = {
  cityKey: string;
  localityKey: string;
  localityName: string;
  point: MapPoint;
} & ({ kind: 'completed'; data: Project } | { kind: 'ongoing'; data: OngoingProject });

interface Locality {
  key: string;
  name: string;
  point: MapPoint;
  completed: number;
  ongoing: number;
}

const INDIA_STATES = indiaMap.locations as IndiaMapLocation[];
const INDIA_BOX: Box = { x: -8, y: -8, w: 628, h: 712 };
const PROJECT_STATE_IDS = new Set(HERO_CITIES.map((city) => city.stateId));
const CITY_STATE_IDS: Record<string, string> = Object.fromEntries(HERO_CITIES.map((city) => [city.key, city.stateId]));
const ZOOM_MS = 1150;
const CARD_GAP = 12;
const CARD_MIN_HEIGHT = 84;
// Overlays inside the map panel that pin labels must avoid (px).
// The city caption is hidden below COMPACT_MAP_WIDTH (see the container query in style.css).
const MAP_SAFE_TOP = 64;
const COMPACT_MAP_WIDTH = 600;

const HERO_PROJECTS: HeroProject[] = [
  ...completedProjectsData.map((data) => ({ kind: 'completed' as const, data })),
  ...ongoingProjectsData.map((data) => ({ kind: 'ongoing' as const, data })),
].flatMap((entry) => {
  const place = locateProject(entry.data.city, entry.data.location);
  if (!place) return [];
  return [{
    ...entry,
    cityKey: place.city.key,
    localityKey: place.localityKey,
    localityName: place.localityName,
    point: place.point,
  } as HeroProject];
});

const CITY_STATS = Object.fromEntries(
  HERO_CITIES.map((city) => {
    const projects = HERO_PROJECTS.filter((project) => project.cityKey === city.key);
    const localities = new Map<string, Locality>();
    for (const project of projects) {
      const locality = localities.get(project.localityKey) ?? {
        key: project.localityKey,
        name: project.localityName,
        point: project.point,
        completed: 0,
        ongoing: 0,
      };
      locality[project.kind] += 1;
      localities.set(project.localityKey, locality);
    }
    // Busiest localities first so they win label placement.
    const sorted = [...localities.values()].sort(
      (a, b) => b.completed + b.ongoing - (a.completed + a.ongoing),
    );
    return [city.key, { center: projectLatLon(city.lat, city.lon), total: projects.length, localities: sorted }];
  }),
) as Record<string, { center: MapPoint; total: number; localities: Locality[] }>;

const CITY_NAMES = HERO_CITIES.map((city) => city.name);
const CITY_LIST_TEXT = `${CITY_NAMES.slice(0, -1).join(', ')} and ${CITY_NAMES[CITY_NAMES.length - 1]}`;

/** Camera box that fits the city borders and every project locality. */
function cityBox(cityKey: string): Box {
  const { center, localities } = CITY_STATS[cityKey];
  const points = [center, ...localities.map((locality) => locality.point)];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  for (const boundary of CITY_BOUNDARIES[cityKey] ?? []) {
    const [bMinX, bMinY, bMaxX, bMaxY] = svgPathBbox(boundary.path);
    xs.push(bMinX, bMaxX);
    ys.push(bMinY, bMaxY);
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const size = Math.max(Math.max(maxX - minX, maxY - minY) * 1.12, 6);
  return { x: (minX + maxX) / 2 - size / 2, y: (minY + maxY) / 2 - size / 2, w: size, h: size };
}

function stateBox(stateId: string): Box {
  const state = INDIA_STATES.find((candidate) => candidate.id === stateId);
  if (!state) return INDIA_BOX;
  const [minX, minY, maxX, maxY] = svgPathBbox(state.path);
  const pad = Math.max(maxX - minX, maxY - minY) * 0.08;
  return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
}

/** Grow a box around its centre until it matches the container aspect ratio. */
function fitBox(box: Box, aspect: number): Box {
  if (box.w / box.h > aspect) {
    const h = box.w / aspect;
    return { x: box.x, y: box.y - (h - box.h) / 2, w: box.w, h };
  }
  const w = box.h * aspect;
  return { x: box.x - (w - box.w) / 2, y: box.y, w, h: box.h };
}

/** Fit a box into the part of the panel not covered by the chips (top) and caption (bottom), as a full-panel box. */
function fitBoxInSafeArea(box: Box, size: Size): Box {
  const top = MAP_SAFE_TOP + 16;
  const bottom = size.w < COMPACT_MAP_WIDTH ? 72 : 104;
  const safeH = Math.max(size.h - top - bottom, size.h * 0.5);
  const fitted = fitBox(box, size.w / safeH);
  const unitsPerPx = fitted.h / safeH;
  return { x: fitted.x, y: fitted.y - top * unitsPerPx, w: fitted.w, h: fitted.h + (top + bottom) * unitsPerPx };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Interpolate centre linearly and size geometrically so the zoom feels even. */
function lerpBox(from: Box, to: Box, t: number): Box {
  const w = from.w * (to.w / from.w) ** t;
  const h = from.h * (to.h / from.h) ** t;
  const cx = from.x + from.w / 2 + (to.x + to.w / 2 - (from.x + from.w / 2)) * t;
  const cy = from.y + from.h / 2 + (to.y + to.h / 2 - (from.y + from.h / 2)) * t;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

interface LabelSpot {
  dx: number;
  dy: number;
  w: number;
}

/** Greedy label placement in screen px: right, left, above, below; skip when nothing fits. */
function placeLabels(localities: Locality[], box: Box, size: Size): Record<string, LabelSpot | null> {
  const scale = size.w / box.w;
  const safeBottom = size.w < COMPACT_MAP_WIDTH ? 36 : 88;
  const taken = localities.map((locality) => {
    const x = (locality.point.x - box.x) * scale;
    const y = (locality.point.y - box.y) * scale;
    return { x: x - 11, y: y - 11, w: 22, h: 22 };
  });
  const result: Record<string, LabelSpot | null> = {};

  for (const locality of localities) {
    const px = (locality.point.x - box.x) * scale;
    const py = (locality.point.y - box.y) * scale;
    const w = locality.name.length * 6.8 + 22;
    const options = [
      { dx: 14, dy: -11 },
      { dx: -14 - w, dy: -11 },
      { dx: -w / 2, dy: -36 },
      { dx: -w / 2, dy: 14 },
    ];
    const spot = options.find(({ dx, dy }) => {
      const rect = { x: px + dx, y: py + dy, w, h: 22 };
      const inside = rect.x > 8 && rect.x + rect.w < size.w - 8 && rect.y > MAP_SAFE_TOP && rect.y + rect.h < size.h - safeBottom;
      return inside && !taken.some((other) =>
        rect.x < other.x + other.w && rect.x + rect.w > other.x && rect.y < other.y + other.h && rect.y + rect.h > other.y);
    });
    if (spot) {
      result[locality.key] = { ...spot, w };
      taken.push({ x: px + spot.dx, y: py + spot.dy, w, h: 22 });
    } else {
      result[locality.key] = null;
    }
  }
  return result;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((previous) => (previous && previous.w === width && previous.h === height ? previous : { w: width, h: height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function onActivate(action: () => void) {
  return (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
}

function completedLabel(year: string) {
  return /^\d{4}/.test(year) ? `Completed · ${year}` : 'Completed';
}

interface HeroProps {
  onSelectProject: (project: Project) => void;
  onViewOngoingProjects: () => void;
  onViewAllProjects: () => void;
}

export function Hero({ onSelectProject, onViewOngoingProjects, onViewAllProjects }: HeroProps) {
  const [stateId, setStateId] = useState<string | null>(null);
  const [cityKey, setCityKey] = useState<string | null>(null);
  const [localityKey, setLocalityKey] = useState<string | null>(null);
  const [hovered, setHovered] = useState<HeroProject | null>(null);
  const [page, setPage] = useState(0);

  const [mapRef, mapSize] = useElementSize<HTMLDivElement>();
  const [gridRef, gridSize] = useElementSize<HTMLDivElement>();

  const [viewBox, setViewBox] = useState<Box>(INDIA_BOX);
  const viewBoxRef = useRef(viewBox);
  // India view, state view, or city view.
  const viewKey = cityKey ?? stateId ?? 'india';
  const lastViewRef = useRef(viewKey);

  const city = HERO_CITIES.find((candidate) => candidate.key === cityKey) ?? null;
  const cityStats = city ? CITY_STATS[city.key] : null;
  const state = INDIA_STATES.find((candidate) => candidate.id === stateId) ?? null;
  const aspect = mapSize ? mapSize.w / mapSize.h : 1;
  const targetBox = useMemo(() => {
    if (cityKey && mapSize) return fitBoxInSafeArea(cityBox(cityKey), mapSize);
    return fitBox(cityKey ? cityBox(cityKey) : stateId ? stateBox(stateId) : INDIA_BOX, aspect);
  }, [cityKey, stateId, aspect, mapSize]);

  // Fly the camera to the target. View changes animate; container resizes snap.
  useEffect(() => {
    if (!mapSize) return;
    const from = viewBoxRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = lastViewRef.current !== viewKey && !reduceMotion;
    lastViewRef.current = viewKey;

    if (!animate) {
      viewBoxRef.current = targetBox;
      setViewBox(targetBox);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ZOOM_MS);
      const next = lerpBox(from, targetBox, easeInOutCubic(t));
      viewBoxRef.current = next;
      setViewBox(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [viewKey, targetBox, mapSize]);

  const labels = useMemo(
    () => (cityStats && mapSize ? placeLabels(cityStats.localities, targetBox, mapSize) : {}),
    [cityStats, targetBox, mapSize],
  );

  // Map units per screen pixel: markers are drawn in px and scaled by this (a bit smaller on compact maps).
  const markerScale = mapSize && mapSize.w < COMPACT_MAP_WIDTH ? 0.82 : 1;
  const unitsPerPx = (viewBox.w / (mapSize?.w || 600)) * markerScale;

  const projects = HERO_PROJECTS.filter(
    (project) =>
      (!stateId || CITY_STATE_IDS[project.cityKey] === stateId) &&
      (!cityKey || project.cityKey === cityKey) &&
      (!localityKey || project.localityKey === localityKey),
  );

  const cardMinWidth = gridSize && gridSize.w < 560 ? 160 : 250;
  const columns = gridSize ? Math.max(1, Math.floor((gridSize.w + CARD_GAP) / (cardMinWidth + CARD_GAP))) : 3;
  const rows = gridSize ? Math.min(3, Math.max(1, Math.floor((gridSize.h + CARD_GAP) / (CARD_MIN_HEIGHT + CARD_GAP)))) : 1;
  const perPage = columns * rows;
  const pageCount = Math.max(1, Math.ceil(projects.length / perPage));
  const currentPage = Math.min(page, pageCount - 1);
  const pageProjects = projects.slice(currentPage * perPage, currentPage * perPage + perPage);

  const activeLocality = hovered && hovered.cityKey === cityKey ? hovered.localityKey : localityKey;
  const activeCityKey = hovered && !cityKey ? hovered.cityKey : null;

  function selectView(nextStateId: string | null, nextCityKey: string | null) {
    setStateId(nextStateId);
    setCityKey(nextCityKey);
    setLocalityKey(null);
    setHovered(null);
    setPage(0);
  }

  function selectCity(key: string | null) {
    selectView(key ? CITY_STATE_IDS[key] : null, key);
  }

  function selectState(id: string | null) {
    selectView(id, null);
  }

  function toggleLocality(key: string) {
    setLocalityKey((current) => (current === key ? null : key));
    setPage(0);
  }

  function openProject(project: HeroProject) {
    if (project.kind === 'completed') onSelectProject(project.data);
    else onViewOngoingProjects();
  }

  const selectedLocality = cityStats?.localities.find((locality) => locality.key === localityKey);
  const listTitle = selectedLocality?.name ?? city?.name ?? state?.name ?? 'All India';
  const stateCityCount = state ? HERO_CITIES.filter((option) => option.stateId === state.id).length : 0;

  return (
    <section className="ehero" id="home" aria-labelledby="hero-title">
      <div className="ehero__backdrop" aria-hidden="true" />

      <div className="ehero__inner">
        <div className="ehero__main">
          <div className="ehero__copy">
            <span className="ehero__eyebrow">
              <span className="ehero__eyebrow-dot" aria-hidden="true" />
              Infrastructure · Real Estate · EPC
            </span>
            <h1 id="hero-title" className="ehero__title">
              Engineering Excellence. <em>Growth By Trust.</em>
            </h1>
            <p className="ehero__lead">
              Construction partner to India&rsquo;s leading developers, with landmark projects across {CITY_LIST_TEXT}.
            </p>

            <div className="ehero__actions">
              <a className="ehero__cta" href="#projects">
                Explore Projects <span aria-hidden="true">↗</span>
              </a>
              <a className="ehero__cta ehero__cta--ghost" href="#contact">
                Partner with Us <span aria-hidden="true">→</span>
              </a>
            </div>

            <dl className="ehero__stats">
              {COMPANY_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}<span>{stat.unit}</span></dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ehero-map" aria-label="Project locations map">
            <div className="ehero-map__chips" role="group" aria-label="Choose a location">
              <button
                type="button"
                className={!stateId ? 'is-active' : ''}
                aria-pressed={!stateId}
                onClick={() => selectCity(null)}
              >
                India <small>{HERO_PROJECTS.length}</small>
              </button>
              {HERO_CITIES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={cityKey === option.key ? 'is-active' : ''}
                  aria-pressed={cityKey === option.key}
                  onClick={() => selectCity(option.key)}
                >
                  {option.name} <small>{CITY_STATS[option.key].total}</small>
                </button>
              ))}
            </div>

            <div className="ehero-map__stage" ref={mapRef}>
              <svg
                className="ehero-map__svg"
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={
                  city
                    ? `Map of ${city.name} city border with project localities`
                    : state
                      ? `Map of ${state.name} with Empire Group project cities`
                      : 'Map of India with Empire Group project cities'
                }
              >
                <g className={`ehero-map__states ${city ? 'is-locked' : ''}`}>
                  {INDIA_STATES.map((option) => {
                    const isFocus = stateId === option.id;
                    const hasProjects = PROJECT_STATE_IDS.has(option.id);
                    return (
                      <path
                        key={option.id}
                        d={option.path}
                        className={isFocus ? 'is-focus' : hasProjects ? 'is-active' : undefined}
                        role="button"
                        tabIndex={!city && hasProjects && !isFocus ? 0 : -1}
                        aria-label={`Show ${option.name} map`}
                        onClick={() => !isFocus && selectState(option.id)}
                        onKeyDown={onActivate(() => !isFocus && selectState(option.id))}
                      >
                        <title>{option.name}</title>
                      </path>
                    );
                  })}
                </g>

                {/* India overview: reference cities and project city markers */}
                <g className={`ehero-map__layer ${city ? '' : 'is-visible'}`}>
                  {REFERENCE_CITIES.map((reference) => (
                    <g key={reference.name} transform={`translate(${reference.x} ${reference.y}) scale(${unitsPerPx})`} className="ehero-ref">
                      <circle r="2.5" />
                      <text x={reference.labelSide === 'left' ? -6 : 6} y="3.5" textAnchor={reference.labelSide === 'left' ? 'end' : 'start'}>
                        {reference.name}
                      </text>
                    </g>
                  ))}

                  {HERO_CITIES.map((option) => {
                    const { center, total } = CITY_STATS[option.key];
                    const label = `${option.name}`;
                    const labelWidth = label.length * 7.4 + 44;
                    const labelX = option.labelSide === 'right' ? 16 : option.labelSide === 'left' ? -16 - labelWidth : -labelWidth / 2;
                    const labelY = option.labelSide === 'top' ? -46 : -13;
                    return (
                      <g
                        key={option.key}
                        className={`ehero-city ${activeCityKey === option.key ? 'is-hot' : ''}`}
                        transform={`translate(${center.x} ${center.y}) scale(${unitsPerPx})`}
                        role="button"
                        tabIndex={city ? -1 : 0}
                        aria-label={`Zoom to ${option.name}, ${total} projects`}
                        onClick={() => selectCity(option.key)}
                        onKeyDown={onActivate(() => selectCity(option.key))}
                      >
                        <circle className="ehero-city__pulse" r="18" />
                        <circle className="ehero-city__ring" r="10" />
                        <circle className="ehero-city__dot" r="5" />
                        <g transform={`translate(${labelX} ${labelY})`}>
                          <rect className="ehero-city__tag" width={labelWidth} height="26" rx="13" />
                          <text className="ehero-city__name" x="12" y="17.5">{label}</text>
                          <text className="ehero-city__count" x={labelWidth - 12} y="17.5" textAnchor="end">{total}</text>
                        </g>
                      </g>
                    );
                  })}

                  {!state && (
                    <>
                      <text className="ehero-map__sea" x="10" y="610">ARABIAN SEA</text>
                      <text className="ehero-map__sea" x="400" y="520">BAY OF BENGAL</text>
                    </>
                  )}
                </g>

                {/* City view: city borders with locality pins */}
                {city && cityStats && (
                  <g className="ehero-map__layer ehero-map__layer--city is-visible" key={city.key}>
                    {CITY_BOUNDARIES[city.key]?.map((boundary) => (
                      <g key={boundary.name} className="ehero-border">
                        <path d={boundary.path} fillRule="evenodd" />
                        <g transform={`translate(${boundary.label.x} ${boundary.label.y}) scale(${unitsPerPx})`}>
                          <text y="-8" textAnchor="middle">{boundary.name}</text>
                        </g>
                      </g>
                    ))}
                    {cityStats.localities.map((locality) => {
                      const count = locality.completed + locality.ongoing;
                      const tone = locality.completed === 0 ? 'is-ongoing' : '';
                      const isActive = activeLocality === locality.key;
                      const spot = labels[locality.key] ?? (isActive ? { dx: 14, dy: -11, w: locality.name.length * 6.8 + 22 } : null);
                      return (
                        <g
                          key={locality.key}
                          className={`ehero-pin ${tone} ${isActive ? 'is-active' : ''} ${localityKey && !isActive ? 'is-dim' : ''}`}
                          transform={`translate(${locality.point.x} ${locality.point.y}) scale(${unitsPerPx})`}
                          role="button"
                          tabIndex={0}
                          aria-pressed={localityKey === locality.key}
                          aria-label={`${locality.name}: ${count} project${count > 1 ? 's' : ''}`}
                          onClick={() => toggleLocality(locality.key)}
                          onKeyDown={onActivate(() => toggleLocality(locality.key))}
                        >
                          <circle className="ehero-pin__halo" r="17" />
                          <circle className="ehero-pin__dot" r={count > 1 ? 10 : 7} />
                          {count > 1 && <text className="ehero-pin__count" y="3.6" textAnchor="middle">{count}</text>}
                          {locality.completed > 0 && locality.ongoing > 0 && (
                            <circle className="ehero-pin__flag" cx="8" cy="-8" r="3.5" />
                          )}
                          {spot && (
                            <g transform={`translate(${spot.dx} ${spot.dy})`} className="ehero-pin__label">
                              <rect width={spot.w} height="22" rx="11" />
                              <text x={spot.w / 2} y="15" textAnchor="middle">{locality.name}</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>

              {city && cityStats ? (
                <div className="ehero-map__caption" key={city.key}>
                  <button type="button" className="ehero-map__back" onClick={() => selectState(city.stateId)}>
                    <span aria-hidden="true">←</span> {city.state}
                  </button>
                  <div>
                    <strong>{city.name}</strong>
                    <span>{city.state} · {cityStats.localities.length} localities</span>
                  </div>
                </div>
              ) : state && (
                <div className="ehero-map__caption" key={state.id}>
                  <button type="button" className="ehero-map__back" onClick={() => selectState(null)}>
                    <span aria-hidden="true">←</span> India
                  </button>
                  <div>
                    <strong>{state.name}</strong>
                    <span>{projects.length} project{projects.length === 1 ? '' : 's'} · {stateCityCount} cit{stateCityCount === 1 ? 'y' : 'ies'}</span>
                  </div>
                </div>
              )}

              <div className="ehero-map__footer">
                <span className="ehero-legend" aria-hidden="true"><i className="is-completed" /> Completed</span>
                <span className="ehero-legend" aria-hidden="true"><i className="is-ongoing" /> Ongoing</span>
                {city ? (
                  <span className="ehero-map__credit">City borders © OpenStreetMap contributors</span>
                ) : (
                  <span className="ehero-map__coords" aria-hidden="true">20.59°N · 78.96°E</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="ehero-cards">
          <div className="ehero-cards__head">
            <p className="ehero-cards__title" aria-live="polite">
              <strong>{listTitle}</strong>
              <span>{projects.length} project{projects.length === 1 ? '' : 's'}</span>
              {localityKey && (
                <button type="button" className="ehero-cards__clear" onClick={() => toggleLocality(localityKey)}>
                  Clear ×
                </button>
              )}
            </p>
            <div className="ehero-cards__nav">
              {pageCount > 1 && (
                <>
                  <button type="button" aria-label="Previous projects" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>‹</button>
                  <span>{currentPage + 1} / {pageCount}</span>
                  <button type="button" aria-label="Next projects" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>›</button>
                </>
              )}
              <button type="button" className="ehero-cards__all" onClick={onViewAllProjects}>
                View all <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div
            className="ehero-cards__grid"
            ref={gridRef}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
            onMouseLeave={() => setHovered(null)}
          >
            {projects.length === 0 && (
              <p className="ehero-cards__empty">No Empire Group projects in {listTitle} yet.</p>
            )}
            {pageProjects.map((project) => {
              const isOngoing = project.kind === 'ongoing';
              return (
                <button
                  type="button"
                  key={project.data.id}
                  className={`ehero-card ${activeLocality === project.localityKey ? 'is-linked' : ''}`}
                  onClick={() => openProject(project)}
                  onMouseEnter={() => setHovered(project)}
                  onFocus={() => setHovered(project)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="ehero-card__media">
                    <img src={project.data.image} alt="" loading="lazy" />
                    <DeveloperLogo developer={project.data.developer} className="ehero-card__logo" />
                  </span>
                  <span className="ehero-card__body">
                    <span className={`ehero-card__status ${isOngoing ? 'is-ongoing' : ''}`}>
                      {project.kind === 'ongoing' ? `Ongoing · ${project.data.progressPercent}%` : completedLabel(project.data.year)}
                    </span>
                    <strong className="ehero-card__name">{project.data.name}</strong>
                    <span className="ehero-card__meta">{project.localityName} · {project.data.developer}</span>
                    {project.kind === 'ongoing' && (
                      <span className="ehero-card__progress" aria-hidden="true">
                        <i style={{ width: `${project.data.progressPercent}%` }} />
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
