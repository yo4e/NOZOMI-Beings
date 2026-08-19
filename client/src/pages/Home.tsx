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
const needMeta: Record<NeedKey, { label: string; tone: string; icon: typeof Sprout }> = {
  hunger: { label: "空腹", tone: "var(--persimmon)", icon: Sprout },
  safety: { label: "安全", tone: "var(--ink-blue)", icon: ShieldAlert },
  affiliation: { label: "つながり", tone: "var(--moss)", icon: HeartHandshake },
  curiosity: { label: "好奇心", tone: "var(--gold)", icon: Eye },
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
  const selected = useMemo(() => world.agents.find((agent) => agent.id === selectedId) ?? world.agents[0], [selectedId, world.agents]);

  useEffect(() => {
    if (!isGitHubPages) return undefined;
    document.body.classList.add("github-pages");
    return () => document.body.classList.remove("github-pages");
  }, []);

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
          <img className="brand-mark" src={visualAssets.logo} alt="NOZOMI Islandを表す標章" />
          <div>
            <p className="eyebrow">AUTONOMOUS ISLAND OBSERVATORY</p>
            <h1>NOZOMI <em>Beings</em></h1>
          </div>
        </div>
        <div className="world-status" aria-label="世界の状態">
          <span className="status-dot" />
          <span>DAY {String(world.day).padStart(2, "0")}</span>
          <span className="status-divider" />
          <span>{displayTime(world.hour)}</span>
          <span className="weather">{world.weather}</span>
        </div>
        <div className="control-bank">
          <Button size="sm" variant="outline" className="control-button" onClick={() => setSpeed((current) => current === 1 ? 2 : current === 2 ? 4 : 1)}>
            <FastForward size={15} /> <span>{speed}×</span>
          </Button>
          <Button size="sm" className="primary-control" onClick={() => setRunning((current) => !current)}>
            {running ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />} {running ? "観察を止める" : "観察を続ける"}
          </Button>
          <Button size="icon" variant="outline" className="control-button reset-button" onClick={resetWorld} aria-label="世界を初期状態に戻す">
            <RotateCcw size={16} />
          </Button>
        </div>
      </header>

      <main className="observatory-grid">
        <aside className="log-column" aria-label="世界の出来事ログ">
          <div className="panel-heading">
            <span className="tape-label">LIVE FIELD LOG</span>
            <span className="tick-readout">TICK {String(world.tick).padStart(3, "0")}</span>
          </div>
          <p className="panel-intro">世界は、指示を待たずに進行しています。理由は欲求と、見聞きした記憶に残ります。</p>
          <div className="event-stack">
            {world.events.map((event, index) => (
              <button className={`event-entry event-${event.kind}`} onClick={() => setSelectedId(event.agentIds[0])} key={event.id}>
                <span className="event-time">{String(event.tick).padStart(3, "0")}</span>
                <span className="event-glyph">{eventGlyph[event.kind]}</span>
                <span className="event-copy">
                  <strong>{event.title}</strong>
                  <span>{event.description}</span>
                </span>
                {index === 0 && <span className="new-mark">NEW</span>}
              </button>
            ))}
          </div>
          <div className="field-note" style={{ backgroundImage: `linear-gradient(90deg, rgba(248,245,236,.93), rgba(248,245,236,.62)), url('${visualAssets.notes}')` }}>
            <span className="note-index">OBS. 04</span>
            <p>「命令がなくても、局所の不足が島を少しずつ動かしている。」</p>
            <span className="note-credit">— field protocol</span>
          </div>
        </aside>

        <section className="world-column" aria-label="NOZOMI Islandの観察窓">
          <div className="world-header">
            <div>
              <p className="eyebrow">A SMALL WORLD, IN MOTION</p>
              <h2>誰も呼んでいないのに、<br />彼らは動き出す。</h2>
            </div>
            <div className="world-key">
              <span><i className="key-dot active" /> 自律NPC</span>
              <span><i className="key-line" /> 直近の航跡</span>
            </div>
          </div>

          <div className="island-frame">
            <div className="island-map" style={{ backgroundImage: `linear-gradient(180deg, rgba(235,239,222,.08), rgba(25,70,60,.08)), url('${visualAssets.atlas}')` }}>
              <div className="map-grain" />
              {(Object.entries(places) as [keyof typeof places, typeof places[keyof typeof places]][]).map(([key, place]) => (
                <div className={`place-marker place-${place.kind}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} key={key}>
                  <span className="place-pin" />
                  <span>{place.label}</span>
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
                  aria-label={`${agent.name}を観察する`}
                >
                  <span className="agent-pulse" />
                  <span className="agent-pin">{agent.symbol}</span>
                  <span className="agent-name">{agent.name}</span>
                </button>
              ))}
              <div className="map-scale"><span /> 20 m</div>
              <div className="map-compass">N<br /><b>✦</b></div>
            </div>
          </div>

          <div className="world-footer">
            <div><span className="footer-number">{world.agents.length}</span><span>個の内なる世界が、<br />同時に進行中</span></div>
            <div><span className="footer-number">{Object.values(world.visited).reduce((sum, value) => sum + value, 0)}</span><span>回の場所選択が、<br />今日のNOZOMI Islandを描いた</span></div>
            <div className="observation-state"><Activity size={16} /><span>{running ? "観察を記録中" : "世界を静止中"}</span></div>
          </div>
        </section>

        <aside className="specimen-column" aria-label="選択中NPCの内面">
          <div className="panel-heading specimen-heading">
            <span className="tape-label">SELECTED SPECIMEN</span>
            <span className="specimen-no">NPC—{selected.id.toUpperCase()}</span>
          </div>
          <section className="identity-card">
            <div className="portrait-stamp" style={{ background: selected.color }}>{selected.symbol}</div>
            <div className="identity-copy">
              <p>{selected.role}</p>
              <h3>{selected.name}</h3>
              <span><MapPin size={13} /> {places[selected.place].label}</span>
            </div>
            <span className="mood-stamp">{selected.mood}</span>
          </section>

          <section className="intent-card">
            <span className="intent-label"><Brain size={14} /> 現在の意図</span>
            <strong>{selected.goal}</strong>
            <p>{selected.action}</p>
          </section>

          <section className="needs-section">
            <div className="section-rule"><span>INNER WEATHER</span><span>緊急度</span></div>
            {needKeys.map((key) => {
              const meta = needMeta[key];
              const Icon = meta.icon;
              return (
                <div className="need-row" key={key}>
                  <div className="need-label"><Icon size={14} style={{ color: meta.tone }} /> <span>{meta.label}</span><b>{Math.round(selected.needs[key] * 100)}</b></div>
                  <div className="need-track"><span style={{ width: `${selected.needs[key] * 100}%`, background: meta.tone }} /></div>
                </div>
              );
            })}
          </section>

          <section className="memory-section">
            <div className="section-rule"><span>RECENT IMPRESSIONS</span><span>記憶</span></div>
            <div className="memory-list">
              {selected.memories.slice(0, 3).map((memory) => (
                <div className="memory-item" key={memory.id}>
                  <span className="memory-tick">{String(memory.tick).padStart(3, "0")}</span>
                  <p>{memory.text}</p>
                  <span className="confidence" title="記憶の確かさ" style={{ width: `${memory.confidence * 100}%` }} />
                </div>
              ))}
            </div>
          </section>

          <section className="weight-section">
            <div className="section-rule"><span>GENTLE INTERVENTION</span><span>欲求の重み</span></div>
            <p>観察者は、次の選択を決めずに「傾き」だけを調整できます。</p>
            {needKeys.map((key) => (
              <label className="weight-control" key={key}>
                <span>{needMeta[key].label}</span>
                <input type="range" min="0.5" max="1.8" step="0.05" value={selected.traits[key]} onChange={(event) => adjustTrait(key, Number(event.target.value))} />
                <output>{selected.traits[key].toFixed(2)}</output>
              </label>
            ))}
          </section>
          <div className="cove-peek" style={{ backgroundImage: `linear-gradient(90deg, rgba(22,64,58,.94), rgba(22,64,58,.24)), url('${visualAssets.cove}')` }}>
            <span>EVENT AT THE COVE</span>
            <p>知らない光が、まだ誰かの行動を待っている。</p>
            <ChevronRight size={17} />
          </div>
        </aside>
      </main>
      <footer className="simulation-footer" aria-labelledby="simulation-footer-title">
        <div className="footer-topline" />
        <div className="footer-explainer">
          <div className="footer-lead">
            <span className="tape-label">HOW THIS WORLD MOVES</span>
            <h2 id="simulation-footer-title">これは、表示だけのモックではありません。</h2>
            <p>NOZOMI Islandの住人は、空腹・安全・つながり・好奇心という数値的な欲求を持ち、時間と出来事でその値を変化させています。いま必要なことを選び、歩き、出会い、その出来事を短期記憶として残します。</p>
          </div>
          <div className="mechanism-grid">
            <article>
              <span className="mechanism-number">01</span>
              <h3>欲求が行き先を選ぶ</h3>
              <p>欲求の強さと個性の重みから、食料、安全な場所、他者、未知の場所を比べます。</p>
            </article>
            <article>
              <span className="mechanism-number">02</span>
              <h3>出会いが関係を変える</h3>
              <p>近くで出会った住人どうしは、trustとfamiliarityを更新し、孤立の強さも変わります。</p>
            </article>
            <article>
              <span className="mechanism-number">03</span>
              <h3>記憶が理由を残す</h3>
              <p>選択や遭遇は、観察できる短期記憶として残り、次の物語の足跡になります。</p>
            </article>
          </div>
        </div>
        <div className="footer-boundary">
          <span className="boundary-dot" />
          <p><strong>現在の範囲:</strong> この世界はブラウザ内で進む短期シミュレーションです。ページを閉じると状態はリセットされ、長期保存・複雑な会話・LLMによる計画生成は、これから育てる層として残しています。</p>
          <span className="footer-signature">NOZOMI BEINGS / FIELD PROTOCOL 01</span>
        </div>
      </footer>
    </div>
  );
}
