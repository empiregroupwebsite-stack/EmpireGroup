import { useState, useMemo, useRef, useEffect } from 'react';
import { completedProjectsData, type Project } from '../data/projectsData';
import { ongoingProjectsData, type OngoingProject } from '../data/ongoingProjectsData';
import { CITY_HUBS, getProjectSvgCoordinates } from '../data/mapData';
import indiaStatesData from '../data/indiaStatesPaths.json';

interface HeroIndiaMapProps {
  onSelectProject?: (project: Project) => void;
}

type CombinedProject = (Project | OngoingProject) & { isOngoing: boolean; cityKey: string };

interface ViewBoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Corridor overview framing Mumbai, Pune, and Hyderabad with surrounding states
const CORRIDOR_OVERVIEW_VIEWBOX: ViewBoxRect = { x: 75, y: 460, w: 270, h: 180 };

// City-focused zoom camera bounds for high-precision micro project marker exploration
const CITY_ZOOM_BOUNDS: Record<string, ViewBoxRect> = {
  mumbai: { x: 92, y: 498, w: 85, h: 62 },
  pune: { x: 120, y: 512, w: 85, h: 62 },
  hyderabad: { x: 242, y: 544, w: 85, h: 62 },
};

export function HeroIndiaMap({ onSelectProject }: HeroIndiaMapProps) {
  // Navigation state: null = Corridor Overview, or 'pune' | 'mumbai' | 'hyderabad'
  const [selectedCity, setSelectedCity] = useState<string | null>('pune');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'ongoing'>('all');

  // Camera lerp animation state
  const [viewBox, setViewBox] = useState<ViewBoxRect>(CITY_ZOOM_BOUNDS.pune);
  const targetViewBox = useRef<ViewBoxRect>(CITY_ZOOM_BOUNDS.pune);
  const animFrameRef = useRef<number | null>(null);

  // Mouse drag-to-scroll support for projects drawer
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Normalize all completed and ongoing projects with cityKey
  const allProjects = useMemo<CombinedProject[]>(() => {
    const list: CombinedProject[] = [];

    completedProjectsData.forEach((p) => {
      const c = p.city.toLowerCase();
      let cityKey = 'other';
      if (c.includes('mumbai')) cityKey = 'mumbai';
      else if (c.includes('pune')) cityKey = 'pune';
      else if (c.includes('hyderabad')) cityKey = 'hyderabad';
      list.push({ ...p, isOngoing: false, cityKey });
    });

    ongoingProjectsData.forEach((p) => {
      const c = p.city.toLowerCase();
      let cityKey = 'other';
      if (c.includes('mumbai')) cityKey = 'mumbai';
      else if (c.includes('pune')) cityKey = 'pune';
      else if (c.includes('hyderabad')) cityKey = 'hyderabad';
      list.push({ ...p, isOngoing: true, cityKey });
    });

    return list;
  }, []);

  // Compute live dynamic project statistics
  const cityCounts = useMemo(() => {
    const counts: Record<string, { total: number; completed: number; ongoing: number }> = {
      mumbai: { total: 0, completed: 0, ongoing: 0 },
      pune: { total: 0, completed: 0, ongoing: 0 },
      hyderabad: { total: 0, completed: 0, ongoing: 0 },
    };

    allProjects.forEach((p) => {
      if (counts[p.cityKey]) {
        counts[p.cityKey].total++;
        if (p.isOngoing) counts[p.cityKey].ongoing++;
        else counts[p.cityKey].completed++;
      }
    });

    return counts;
  }, [allProjects]);

  // Filtered projects for active city (or all if corridor overview)
  const cityProjects = useMemo(() => {
    if (!selectedCity) return allProjects;
    return allProjects.filter((p) => p.cityKey === selectedCity);
  }, [selectedCity, allProjects]);

  // Tab filtered projects
  const displayedProjects = useMemo(() => {
    if (activeTab === 'completed') return cityProjects.filter((p) => !p.isOngoing);
    if (activeTab === 'ongoing') return cityProjects.filter((p) => p.isOngoing);
    return cityProjects;
  }, [cityProjects, activeTab]);

  const activeProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return allProjects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, allProjects]);

  const activeProjectCoords = useMemo(() => {
    if (!activeProject) return null;
    return getProjectSvgCoordinates(activeProject.location, activeProject.cityKey, activeProject.id);
  }, [activeProject]);

  // Camera lerp animation: smooth 60fps glide between cities and projects
  useEffect(() => {
    function animate() {
      setViewBox((current) => {
        const target = targetViewBox.current;
        const lerpFactor = 0.12;
        const dx = (target.x - current.x) * lerpFactor;
        const dy = (target.y - current.y) * lerpFactor;
        const dw = (target.w - current.w) * lerpFactor;
        const dh = (target.h - current.h) * lerpFactor;

        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(dw) < 0.05 && Math.abs(dh) < 0.05) {
          return target;
        }

        return {
          x: current.x + dx,
          y: current.y + dy,
          w: current.w + dw,
          h: current.h + dh,
        };
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update target camera viewBox on city or project change
  useEffect(() => {
    if (selectedProjectId && activeProjectCoords) {
      // Focus on active project while keeping local context
      const pw = 48;
      const ph = 35;
      targetViewBox.current = {
        x: activeProjectCoords.x - pw / 2,
        y: activeProjectCoords.y - ph / 2,
        w: pw,
        h: ph,
      };
    } else if (selectedCity && CITY_ZOOM_BOUNDS[selectedCity]) {
      targetViewBox.current = CITY_ZOOM_BOUNDS[selectedCity];
    } else {
      targetViewBox.current = CORRIDOR_OVERVIEW_VIEWBOX;
    }
  }, [selectedCity, selectedProjectId, activeProjectCoords]);

  // City selection handlers
  function handleSelectCity(cityKey: string | null) {
    setSelectedCity(cityKey);
    setSelectedProjectId(null);
    setActiveTab('all');
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  function handleProjectClick(proj: CombinedProject) {
    if (hasDragged.current) return;
    setSelectedCity(proj.cityKey);
    setSelectedProjectId(proj.id);
  }

  // Mouse drag-to-scroll implementation
  function onMouseDown(e: React.MouseEvent) {
    if (!sliderRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  }

  function onMouseLeave() {
    isDragging.current = false;
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const diff = x - startX.current;
    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
    }
    const walk = diff * 1.6;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  }

  const selectedHubConfig = selectedCity ? CITY_HUBS[selectedCity] : null;

  return (
    <div className="hero-map-wrapper dark-map-theme">
      {/* Top Header & Fast City Selection Filter */}
      <div className="dark-map-header">
        <div className="dark-map-header-left">
          <div className="dark-map-kicker-row">
            <span className="dark-map-live-dot" />
            <span className="dark-map-kicker">INFRASTRUCTURE NETWORK</span>
          </div>
          <h3 className="dark-map-title">Interactive City Hubs &amp; Projects</h3>
        </div>

        <div className="dark-map-chips">
          <button
            type="button"
            className={`dark-map-chip ${selectedCity === null ? 'is-active' : ''}`}
            onClick={() => handleSelectCity(null)}
          >
            <span className="chip-bullet" />
            <span>Corridor Overview</span>
          </button>
          {(['mumbai', 'pune', 'hyderabad'] as const).map((key) => {
            const hub = CITY_HUBS[key];
            const count = cityCounts[key]?.total || 0;
            const isSelected = selectedCity === key;
            return (
              <button
                key={key}
                type="button"
                className={`dark-map-chip ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelectCity(key)}
              >
                <span className="chip-bullet" />
                <span>{hub.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dark Charcoal SVG Map Canvas */}
      <div className="dark-map-canvas-container">
        {/* Floating Top Controls & Camera Indicator */}
        <div className="dark-map-top-bar">
          <div className="dark-map-status-pill">
            <span className="status-indicator-dot" />
            <span className="status-indicator-text">
              {selectedProjectId && activeProject
                ? `Project Focus: ${activeProject.name}`
                : selectedHubConfig
                ? `${selectedHubConfig.name} Hub (${cityProjects.length} Projects)`
                : 'Corridor Overview (Mumbai · Pune · Hyderabad)'}
            </span>
          </div>

          {selectedCity && (
            <button
              type="button"
              className="dark-map-reset-btn"
              onClick={() => handleSelectCity(null)}
              title="Reset camera to all hubs"
            >
              <span>← View All Hubs</span>
            </button>
          )}
        </div>

        <svg
          className="dark-map-svg"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Dark Charcoal Map Background Gradient */}
            <radialGradient id="darkBgGradient" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#0d1527" />
              <stop offset="60%" stopColor="#080d1a" />
              <stop offset="100%" stopColor="#040711" />
            </radialGradient>

            {/* Glowing Emerald Pulse for markers */}
            <filter id="emeraldBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense Glow for Active Pins */}
            <filter id="activePinGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing Emerald Corridor Highway Line */}
            <linearGradient id="corridorHighwayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
            </linearGradient>

            {/* Maritime Ocean Pattern */}
            <pattern id="darkOceanWater" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.8" />
            </pattern>

            {/* Subtle Architectural Blueprint Grid */}
            <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(52, 211, 153, 0.05)" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* Premium Dark Canvas Background */}
          <rect x="-400" y="-400" width="1600" height="1600" fill="url(#darkBgGradient)" />

          {/* Blueprint Grid Overlay */}
          <rect x="-400" y="-400" width="1600" height="1600" fill="url(#archGrid)" />

          {/* Arabian Sea Water Depth Fill */}
          <rect x="-400" y="380" width="530" height="700" fill="#040814" />
          <rect x="-400" y="380" width="530" height="700" fill="url(#darkOceanWater)" opacity="0.8" />

          {/* Coordinate Guide Lines */}
          <g opacity="0.18" stroke="#334155" strokeWidth="0.7">
            <line x1="0" y1="480" x2="800" y2="480" strokeDasharray="3 5" />
            <line x1="0" y1="520" x2="800" y2="520" strokeDasharray="3 5" />
            <line x1="0" y1="560" x2="800" y2="560" strokeDasharray="3 5" />
            <line x1="0" y1="600" x2="800" y2="600" strokeDasharray="3 5" />
            <line x1="120" y1="400" x2="120" y2="700" strokeDasharray="3 5" />
            <line x1="180" y1="400" x2="180" y2="700" strokeDasharray="3 5" />
            <line x1="260" y1="400" x2="260" y2="700" strokeDasharray="3 5" />
          </g>

          {/* Real India State Polygons with Glowing Boundaries */}
          <g className="states-group">
            {indiaStatesData.map((state) => {
              const isHubState = state.id === 'maharashtra' || state.id === 'telangana';
              const isSelectedState =
                (selectedCity === 'mumbai' || selectedCity === 'pune') && state.id === 'maharashtra'
                  ? true
                  : selectedCity === 'hyderabad' && state.id === 'telangana'
                  ? true
                  : selectedCity === null && isHubState;

              return (
                <path
                  key={state.id}
                  id={state.id}
                  d={state.d}
                  fill={
                    isSelectedState
                      ? 'rgba(16, 185, 129, 0.16)'
                      : isHubState
                      ? 'rgba(16, 185, 129, 0.07)'
                      : 'rgba(15, 23, 42, 0.65)'
                  }
                  stroke={
                    isSelectedState
                      ? '#34d399'
                      : isHubState
                      ? 'rgba(52, 211, 153, 0.6)'
                      : 'rgba(51, 65, 85, 0.6)'
                  }
                  strokeWidth={isSelectedState ? '1.8' : isHubState ? '1.4' : '0.9'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={`state-path ${isHubState ? 'is-hub-state' : ''}`}
                >
                  <title>{state.name}</title>
                </path>
              );
            })}
          </g>

          {/* Glowing State & Water Geographic Context Labels */}
          <g className="state-labels" style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <text x="205" y="525" fill="#34d399" fontSize="12" fontWeight="800" letterSpacing="0.12em" opacity="0.65" fontFamily="sans-serif">
              MAHARASHTRA
            </text>
            <text x="310" y="555" fill="#34d399" fontSize="10.5" fontWeight="800" letterSpacing="0.12em" opacity="0.65" fontFamily="sans-serif">
              TELANGANA
            </text>
            <text x="200" y="625" fill="#64748b" fontSize="9.5" fontWeight="700" letterSpacing="0.1em" opacity="0.5" fontFamily="sans-serif">
              KARNATAKA
            </text>
            <text x="95" y="475" fill="#64748b" fontSize="9.5" fontWeight="700" letterSpacing="0.1em" opacity="0.5" fontFamily="sans-serif">
              GUJARAT
            </text>
            <text x="90" y="575" fill="#38bdf8" fontSize="8" fontWeight="800" letterSpacing="0.15em" opacity="0.6" fontFamily="sans-serif">
              ARABIAN SEA
            </text>
          </g>

          {/* Inter-City High-Tech Connecting Corridors */}
          <g className="routes-group">
            {/* Glowing Corridor Triangle Zone */}
            <polygon
              points={`${CITY_HUBS.mumbai.svgX},${CITY_HUBS.mumbai.svgY} ${CITY_HUBS.pune.svgX},${CITY_HUBS.pune.svgY} ${CITY_HUBS.hyderabad.svgX},${CITY_HUBS.hyderabad.svgY}`}
              fill="rgba(52, 211, 153, 0.08)"
              stroke="rgba(52, 211, 153, 0.45)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* Mumbai - Pune Expressway Route */}
            <line
              x1={CITY_HUBS.mumbai.svgX}
              y1={CITY_HUBS.mumbai.svgY}
              x2={CITY_HUBS.pune.svgX}
              y2={CITY_HUBS.pune.svgY}
              stroke="url(#corridorHighwayGrad)"
              strokeWidth="2.4"
              strokeDasharray="5 3"
              className="corridor-pulse-line"
            />

            {/* Pune - Hyderabad Growth Corridor Route */}
            <line
              x1={CITY_HUBS.pune.svgX}
              y1={CITY_HUBS.pune.svgY}
              x2={CITY_HUBS.hyderabad.svgX}
              y2={CITY_HUBS.hyderabad.svgY}
              stroke="url(#corridorHighwayGrad)"
              strokeWidth="2.4"
              strokeDasharray="5 3"
              className="corridor-pulse-line"
            />
          </g>

          {/* Regional Infrastructure Landmarks */}
          {selectedHubConfig && (
            <g className="landmarks-group">
              {selectedHubConfig.landmarks.map((lm, idx) => (
                <g key={idx} transform={`translate(${lm.x}, ${lm.y})`} className="landmark-node" opacity="0.75">
                  <circle r="1.4" fill="#94a3b8" />
                  <text x="3" y="1.8" fill="#cbd5e1" fontSize="5.2" fontWeight="700" fontFamily="sans-serif">
                    {lm.name}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Individual Project Markers Positioned by Actual Coordinates */}
          <g className="project-markers-layer">
            {allProjects.map((proj) => {
              const coords = getProjectSvgCoordinates(proj.location, proj.cityKey, proj.id);
              const isSelected = selectedProjectId === proj.id;
              const isCityActive = !selectedCity || selectedCity === proj.cityKey;

              // Hide pins not matching current city unless overview mode
              if (selectedCity && selectedCity !== proj.cityKey) return null;

              return (
                <g
                  key={proj.id}
                  className={`dark-project-pin ${isSelected ? 'is-selected' : ''}`}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(proj);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selected Active Glow Halo */}
                  {isSelected && (
                    <circle
                      r="7.5"
                      fill="rgba(52, 211, 153, 0.28)"
                      stroke="#34d399"
                      strokeWidth="1.2"
                      className="pin-pulse-halo"
                      filter="url(#activePinGlow)"
                    />
                  )}

                  {/* Outer Project Dot */}
                  <circle
                    r={isSelected ? 3.4 : 2.2}
                    fill={isSelected ? '#34d399' : proj.isOngoing ? '#38bdf8' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 1.4 : 0.8}
                    opacity={isCityActive ? 1 : 0.35}
                  />

                  {/* Project Tooltip Pill on Selection or Active Focus */}
                  {isSelected && (
                    <g transform="translate(6, -8)" className="pin-tooltip-bubble">
                      <rect
                        x="0"
                        y="0"
                        width={proj.name.length * 4.6 + 14}
                        height="16"
                        rx="4"
                        fill="#0b1329"
                        stroke="#34d399"
                        strokeWidth="1"
                      />
                      <text x="7" y="11" fill="#ffffff" fontSize="6.8" fontWeight="800" fontFamily="sans-serif">
                        {proj.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Three Interactive City Hub Markers with Animated Pulsing Beacons */}
          {(['mumbai', 'pune', 'hyderabad'] as const).map((key) => {
            const hub = CITY_HUBS[key];
            const count = cityCounts[key]?.total || 0;
            const isSelected = selectedCity === key;

            // Dedicated offset for non-overlapping tag badges
            const tagOffset = {
              mumbai: { x: -74, y: -13, w: 68, h: 24 },
              pune: { x: -8, y: 12, w: 64, h: 24 },
              hyderabad: { x: 12, y: -13, w: 76, h: 24 },
            }[key];

            return (
              <g
                key={key}
                className={`city-emerald-beacon ${isSelected ? 'is-selected' : ''}`}
                transform={`translate(${hub.svgX}, ${hub.svgY})`}
                onClick={() => handleSelectCity(key)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulsing Emerald Ripple */}
                <circle
                  r={isSelected ? 18 : 13}
                  className="beacon-ripple-outer"
                  fill="none"
                  stroke={isSelected ? '#34d399' : '#10b981'}
                  strokeWidth={isSelected ? 2.2 : 1.4}
                />

                {/* Inner Pulsing Aura */}
                <circle
                  r={isSelected ? 9.5 : 6.8}
                  className="beacon-ripple-inner"
                  fill={isSelected ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.22)'}
                  stroke="#34d399"
                  strokeWidth="1.2"
                />

                {/* Solid Emerald Beacon Core */}
                <circle
                  r={isSelected ? 4.8 : 3.8}
                  fill={isSelected ? '#34d399' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  filter="url(#emeraldBeaconGlow)"
                />

                {/* City Name & Count Badge Tag */}
                <g transform={`translate(${tagOffset.x}, ${tagOffset.y})`} className="beacon-tag">
                  <rect
                    x="0"
                    y="0"
                    width={tagOffset.w}
                    height={tagOffset.h}
                    rx="12"
                    fill={isSelected ? '#064e3b' : 'rgba(11, 19, 41, 0.92)'}
                    stroke={isSelected ? '#34d399' : 'rgba(52, 211, 153, 0.6)'}
                    strokeWidth={isSelected ? '1.8' : '1.2'}
                  />
                  <text
                    x="9"
                    y="10.5"
                    fill={isSelected ? '#ffffff' : '#f8fafc'}
                    fontSize="8.4"
                    fontWeight="800"
                    fontFamily="system-ui, sans-serif"
                  >
                    {hub.name}
                  </text>
                  <text
                    x="9"
                    y="18.5"
                    fill={isSelected ? '#34d399' : '#10b981'}
                    fontSize="7"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                  >
                    {count} Projects
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Premium Floating City Information Card */}
        {selectedHubConfig && (
          <div className="dark-map-floating-city-card">
            <div className="floating-card-header">
              <div className="floating-card-title-group">
                <span className="floating-card-kicker">SELECTED CITY HUB</span>
                <h4 className="floating-card-city-name">{selectedHubConfig.name}</h4>
              </div>
              <span className="floating-card-count-badge">
                {cityCounts[selectedHubConfig.key]?.total || 0} Projects Active
              </span>
            </div>

            <p className="floating-card-desc">{selectedHubConfig.description}</p>

            <div className="floating-card-stats-row">
              <div className="floating-stat">
                <span className="stat-label">Delivered:</span>
                <strong className="stat-value">{cityCounts[selectedHubConfig.key]?.completed || 0} Sites</strong>
              </div>
              <div className="floating-stat">
                <span className="stat-label">Ongoing:</span>
                <strong className="stat-value ongoing-val">{cityCounts[selectedHubConfig.key]?.ongoing || 0} Sites</strong>
              </div>
            </div>

            <div className="floating-landmarks-row">
              <span className="landmarks-heading">Key Districts:</span>
              <div className="landmarks-pills">
                {selectedHubConfig.landmarks.slice(0, 4).map((lm, idx) => (
                  <span key={idx} className="landmark-pill">
                    {lm.name.split('(')[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Project Address Overlay Card */}
        {activeProject && (
          <div className="dark-map-active-project-card">
            <button
              type="button"
              className="active-project-close-btn"
              onClick={() => setSelectedProjectId(null)}
              aria-label="Close project view"
            >
              ✕
            </button>

            <span className="active-project-kicker">
              {activeProject.isOngoing ? 'Ongoing Site' : 'Delivered Landmark'}
            </span>
            <h5 className="active-project-title">{activeProject.name}</h5>

            <p className="active-project-address">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{activeProject.location}, {activeProject.city}</span>
            </p>

            <div className="active-project-specs">
              <div className="spec-item">
                <span className="spec-label">DEVELOPER</span>
                <span className="spec-val">{activeProject.developer}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">CONFIG / AREA</span>
                <span className="spec-val">{activeProject.builtUpArea}</span>
              </div>
            </div>

            <button
              type="button"
              className="active-project-action-btn"
              onClick={() => {
                if (onSelectProject && !('isOngoing' in activeProject && activeProject.isOngoing)) {
                  onSelectProject(activeProject as Project);
                } else {
                  const target = document.getElementById('projects');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span>View Full Project Portfolio ↗</span>
            </button>
          </div>
        )}

        {/* Clean Interactive Map Legend */}
        <div className="dark-map-legend">
          <div className="legend-item">
            <span className="legend-beacon-dot" />
            <span>City Hub</span>
          </div>
          <div className="legend-item">
            <span className="legend-project-dot" />
            <span>Project Site</span>
          </div>
          <div className="legend-item">
            <span className="legend-ongoing-dot" />
            <span>Ongoing Site</span>
          </div>
          <div className="legend-item">
            <span className="legend-corridor-line" />
            <span>Corridor Route</span>
          </div>
        </div>
      </div>

      {/* Projects of Selected Location ONLY Below the Map */}
      <div className="dark-map-projects-drawer">
        <div className="drawer-header-bar">
          <div className="drawer-title-group">
            <span className="drawer-label">
              {selectedHubConfig ? `${selectedHubConfig.name.toUpperCase()} PROJECTS` : 'CORRIDOR PORTFOLIO'}
            </span>
            <h4 className="drawer-heading">
              {selectedHubConfig ? `${selectedHubConfig.name} Projects` : 'Empire Group Development Sites'}
              <span className="drawer-count-pill">{cityProjects.length} Projects</span>
            </h4>
          </div>

          <div className="drawer-tabs">
            <button
              type="button"
              className={`drawer-tab ${activeTab === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({cityProjects.length})
            </button>
            <button
              type="button"
              className={`drawer-tab ${activeTab === 'completed' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({cityProjects.filter((p) => !p.isOngoing).length})
            </button>
            <button
              type="button"
              className={`drawer-tab ${activeTab === 'ongoing' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing ({cityProjects.filter((p) => p.isOngoing).length})
            </button>
          </div>
        </div>

        {/* Horizontal Drag-to-Scroll Slider */}
        <div
          ref={sliderRef}
          className="drawer-slider is-draggable"
          role="list"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {displayedProjects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className={`drawer-project-card ${isSelected ? 'is-selected' : ''}`}
                role="listitem"
                onClick={() => handleProjectClick(proj)}
              >
                <div className="card-status-line">
                  <span className={`status-tag ${proj.isOngoing ? 'is-ongoing' : ''}`}>
                    {proj.isOngoing ? 'Ongoing Site' : 'Delivered'}
                  </span>
                  <span className="view-detail-tag">
                    {isSelected ? '● Focused' : 'Pin Details →'}
                  </span>
                </div>
                <h6 className="card-headline">{proj.name}</h6>
                <p className="card-loc">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{proj.location}</span>
                </p>
                <div className="card-bottom">
                  <span className="card-dev-name">{proj.developer}</span>
                  <span className="card-sqft">{proj.builtUpArea}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
