/**
 * Field Notes Observatory — the island stays central; panels reveal causes,
 * memories, and relationships without treating the observer as a controller.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  ChevronRight,
  Eye,
  FastForward,
  Globe2,
  HeartHandshake,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  advanceWorld,
  createInitialState,
  places,
  type Agent,
  type NeedKey,
  type WorldEvent,
} from "@/lib/simulation";
import { tAgent, tEvent, tMemory, tNeed, tPlace, tWeather, ui, type Language } from "@/lib/i18n";

const isGitHubPages = import.meta.env.BASE_URL !== "/";
const assetUrl = (fileName: string, storageFileName: string) => isGitHubPages
  ? `${import.meta.env.BASE_URL}assets/${fileName}`
  : `/manus-storage/${storageFileName}`;
const visualAssets = {
  atlas: assetUrl("mintwhirl-island-atlas.png", "mintwhirl-island-atlas_471d94bd.png"),
  notes: assetUrl("field-notes-specimen.png", "field-notes-specimen_ead964b1.png"),
  cove: assetUrl("misty-cove-event.png", "misty-cove-event_0e9e5b55.png"),
  logo: assetUrl("mintwhirl-mark.png", "mintwhirl-mark_2c03a2e8.png"),
};

const needKeys: NeedKey[] = ["hunger", "safety", "affiliation", "curiosity"];
const needMeta: Record<NeedKey, { tone: string; icon: typeof Sprout }> = {
  hunger: { tone: "var(--persimmon)", icon: Sprout },
  safety: { tone: "var(--ink-blue)", icon: ShieldAlert },
  affiliation: { tone: "var(--moss)", icon: HeartHandshake },
  curiosity: { tone: "var(--gold)", icon: Eye },
};

const eventGlyph: Record<WorldEvent["kind"], string> = {
  memory: "記",
  need: "欲",
  social: "縁",
  movement: "行",
  curiosity: "見",
};

function displayTime(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function Home() {
  const [world, setWorld] = useState(createInitialState);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedId, setSelectedId] = useState("mio");
  const [language, setLanguage] = useState<Language>(() => typeof window !== "undefined" && window.localStorage.getItem("nozomi-language") === "en" ? "en" : "ja");
  const selected = useMemo(() => world.agents.find((agent) => agent.id === selectedId) ?? world.agents[0], [selectedId, world.agents]);
  const text = ui[language];
  const selectedDisplay = tAgent(selected, language);

  useEffect(() => {
    if (!isGitHubPages) return undefined;
    document.body.classList.add("github-pages");
    return () => document.body.classList.remove("github-pages");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nozomi-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setWorld((current) => advanceWorld(current)), Math.max(560, 2200 / speed));
    return () => window.clearInterval(timer);
  }, [running, speed]);

  const resetWorld = () => {
    setWorld(createInitialState());
    setSelectedId("mio");
    setRunning(false);
  };

  const adjustTrait = (key: NeedKey, value: number) => {
    setWorld((current) => ({
      ...current,
      agents: current.agents.map((agent) => agent.id === selected.id ? { ...agent, traits: { ...agent.traits, [key]: value } } : agent),
    }));
  };

  return (
    <div className="observatory-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src={visualAssets.logo} alt={language === "ja" ? "NOZOMI Islandを表す標章" : "The NOZOMI Island emblem"} />
          <div>
            <p className="eyebrow">AUTONOMOUS ISLAND OBSERVATORY</p>
            <h1>NOZOMI <em>Beings</em></h1>
          </div>
        </div>
        <div className="world-status" aria-label={language === "ja" ? "世界の状態" : "World state"}>
          <span className="status-dot" />
          <span>{text.day} {String(world.day).padStart(2, "0")}</span>
          <span className="status-divider" />
          <span>{displayTime(world.hour)}</span>
          <span className="weather">{tWeather(world.weather, language)}</span>
        </div>
        <div className="control-bank">
          <Button size="sm" variant="outline" className="control-button language-button" onClick={() => setLanguage((current) => current === "ja" ? "en" : "ja")} aria-label={language === "ja" ? "Switch to English" : "日本語に切り替え"}>
            <Globe2 size={15} /> <span>{language === "ja" ? "EN" : "JP"}</span>
          </Button>
          <Button size="sm" variant="outline" className="control-button" onClick={() => setSpeed((current) => current === 1 ? 2 : current === 2 ? 4 : 1)}>
            <FastForward size={15} /> <span>{speed}×</span>
          </Button>
          <Button size="sm" className="primary-control" onClick={() => setRunning((current) => !current)}>
            {running ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />} {running ? text.pause : text.resume}
          </Button>
          <Button size="icon" variant="outline" className="control-button reset-button" onClick={resetWorld} aria-label={text.reset}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </header>

      <main className="observatory-grid">
        <aside className="log-column" aria-label={language === "ja" ? "世界の出来事ログ" : "World event log"}>
          <div className="panel-heading">
            <span className="tape-label">{text.fieldLog}</span>
            <span className="tick-readout">TICK {String(world.tick).padStart(3, "0")}</span>
          </div>
          <p className="panel-intro">{text.logIntro}</p>
          <div className="event-stack">
            {world.events.map((event, index) => (
              <button className={`event-entry event-${event.kind}`} onClick={() => setSelectedId(event.agentIds[0])} key={event.id}>
                <span className="event-time">{String(event.tick).padStart(3, "0")}</span>
                <span className="event-glyph">{eventGlyph[event.kind]}</span>
                <span className="event-copy">
                  <strong>{tEvent(event, language).title}</strong>
                  <span>{tEvent(event, language).description}</span>
                </span>
                {index === 0 && <span className="new-mark">NEW</span>}
              </button>
            ))}
          </div>
          <div className="field-note" style={{ backgroundImage: `linear-gradient(90deg, rgba(248,245,236,.93), rgba(248,245,236,.62)), url('${visualAssets.notes}')` }}>
            <span className="note-index">OBS. 04</span>
            <p>{text.note}</p>
            <span className="note-credit">— field protocol</span>
          </div>
        </aside>

        <section className="world-column" aria-label={language === "ja" ? "NOZOMI Islandの観察窓" : "NOZOMI Island observation window"}>
          <div className="world-header">
            <div>
              <p className="eyebrow">{text.worldLabel}</p>
              <h2>{text.worldTitle[0]}<br />{text.worldTitle[1]}</h2>
            </div>
            <div className="world-key">
              <span><i className="key-dot active" /> {text.agents}</span>
              <span><i className="key-line" /> {text.trails}</span>
            </div>
          </div>

          <div className="island-frame">
            <div className="island-map" style={{ backgroundImage: `linear-gradient(180deg, rgba(235,239,222,.08), rgba(25,70,60,.08)), url('${visualAssets.atlas}')` }}>
              <div className="map-grain" />
              {(Object.entries(places) as [keyof typeof places, typeof places[keyof typeof places]][]).map(([key, place]) => (
                <div className={`place-marker place-${place.kind}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} key={key}>
                  <span className="place-pin" />
                  <span>{tPlace(key, language)}</span>
                </div>
              ))}
              <svg className="trail-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {world.agents.map((agent) => agent.path.length > 1 && <polyline key={agent.id} points={agent.path.map((point) => `${point.x},${point.y}`).join(" ")} style={{ stroke: agent.color }} />)}
              </svg>
              {world.agents.map((agent) => (
                <button
                  key={agent.id}
                  className={`agent-marker ${selected.id === agent.id ? "selected" : ""}`}
                  style={{ left: `${agent.x}%`, top: `${agent.y}%`, "--agent-color": agent.color } as React.CSSProperties}
                  onClick={() => setSelectedId(agent.id)}
                  aria-label={language === "ja" ? `${agent.name}を観察する` : `Observe ${tAgent(agent, language).name}`}
                >
                  <span className="agent-pulse" />
                  <span className="agent-pin">{agent.symbol}</span>
                  <span className="agent-name">{tAgent(agent, language).name}</span>
                </button>
              ))}
              <div className="map-scale"><span /> 20 m</div>
              <div className="map-compass">N<br /><b>✦</b></div>
            </div>
          </div>

          <div className="world-footer">
            <div><span className="footer-number">{world.agents.length}</span><span>{text.innerWorld}<br />{text.simultaneous}</span></div>
            <div><span className="footer-number">{Object.values(world.visited).reduce((sum, value) => sum + value, 0)}</span><span>{text.choices}<br />{text.islandDrawn}</span></div>
            <div className="observation-state"><Activity size={16} /><span>{running ? text.recording : text.frozen}</span></div>
          </div>
        </section>

        <aside className="specimen-column" aria-label={language === "ja" ? "選択中NPCの内面" : "Selected NPC inner state"}>
          <div className="panel-heading specimen-heading">
            <span className="tape-label">{text.specimen}</span>
            <span className="specimen-no">NPC—{selected.id.toUpperCase()}</span>
          </div>
          <section className="identity-card">
            <div className="portrait-stamp" style={{ background: selected.color }}>{selected.symbol}</div>
            <div className="identity-copy">
              <p>{selectedDisplay.role}</p>
              <h3>{selectedDisplay.name}</h3>
              <span><MapPin size={13} /> {tPlace(selected.place, language)}</span>
            </div>
            <span className="mood-stamp">{selectedDisplay.mood}</span>
          </section>

          <section className="intent-card">
            <span className="intent-label"><Brain size={14} /> {text.intent}</span>
            <strong>{selectedDisplay.goal}</strong>
            <p>{selectedDisplay.action}</p>
          </section>

          <section className="needs-section">
            <div className="section-rule"><span>{text.innerWeather}</span><span>{text.urgency}</span></div>
            {needKeys.map((key) => {
              const meta = needMeta[key];
              const Icon = meta.icon;
              return (
                <div className="need-row" key={key}>
                  <div className="need-label"><Icon size={14} style={{ color: meta.tone }} /> <span>{tNeed(key, language)}</span><b>{Math.round(selected.needs[key] * 100)}</b></div>
                  <div className="need-track"><span style={{ width: `${selected.needs[key] * 100}%`, background: meta.tone }} /></div>
                </div>
              );
            })}
          </section>

          <section className="memory-section">
            <div className="section-rule"><span>{text.impressions}</span><span>{text.memory}</span></div>
            <div className="memory-list">
              {selected.memories.slice(0, 3).map((memory) => (
                <div className="memory-item" key={memory.id}>
                  <span className="memory-tick">{String(memory.tick).padStart(3, "0")}</span>
                  <p>{tMemory(memory.text, language)}</p>
                  <span className="confidence" title={language === "ja" ? "記憶の確かさ" : "Memory confidence"} style={{ width: `${memory.confidence * 100}%` }} />
                </div>
              ))}
            </div>
          </section>

          <section className="weight-section">
            <div className="section-rule"><span>{text.intervention}</span><span>{text.weights}</span></div>
            <p>{text.weightHelp}</p>
            {needKeys.map((key) => (
              <label className="weight-control" key={key}>
                <span>{tNeed(key, language)}</span>
                <input type="range" min="0.5" max="1.8" step="0.05" value={selected.traits[key]} onChange={(event) => adjustTrait(key, Number(event.target.value))} />
                <output>{selected.traits[key].toFixed(2)}</output>
              </label>
            ))}
          </section>
          <div className="cove-peek" style={{ backgroundImage: `linear-gradient(90deg, rgba(22,64,58,.94), rgba(22,64,58,.24)), url('${visualAssets.cove}')` }}>
            <span>{text.coveEvent}</span>
            <p>{text.coveCopy}</p>
            <ChevronRight size={17} />
          </div>
        </aside>
      </main>
      <footer className="simulation-footer" aria-labelledby="simulation-footer-title">
        <div className="footer-topline" />
        <div className="footer-explainer">
          <div className="footer-lead">
            <span className="tape-label">{text.footerLabel}</span>
            <h2 id="simulation-footer-title">{text.footerTitle}</h2>
            <p>{text.footerLead}</p>
          </div>
          <div className="mechanism-grid">
            <article>
              <span className="mechanism-number">01</span>
              <h3>{text.mechanismTitles[0]}</h3>
              <p>{text.mechanismCopies[0]}</p>
            </article>
            <article>
              <span className="mechanism-number">02</span>
              <h3>{text.mechanismTitles[1]}</h3>
              <p>{text.mechanismCopies[1]}</p>
            </article>
            <article>
              <span className="mechanism-number">03</span>
              <h3>{text.mechanismTitles[2]}</h3>
              <p>{text.mechanismCopies[2]}</p>
            </article>
          </div>
        </div>
        <div className="footer-boundary">
          <span className="boundary-dot" />
          <p><strong>{text.boundaryLabel}</strong> {text.boundaryCopy}</p>
          <span className="footer-signature">NOZOMI BEINGS / FIELD PROTOCOL 01</span>
        </div>
      </footer>
    </div>
  );
}
