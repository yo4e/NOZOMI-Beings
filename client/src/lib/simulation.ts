/**
 * Field Notes Observatory: deterministic inner world model. The simulation treats
 * NPC life as numeric drives, local observation, relations, and bounded memories.
 */

export type NeedKey = "hunger" | "safety" | "affiliation" | "curiosity";
export type PlaceKey = "grove" | "pond" | "mill" | "lookout" | "garden" | "cove";

export interface Memory {
  id: string;
  tick: number;
  text: string;
  confidence: number;
  salience: number;
}

export interface Relation {
  trust: number;
  affinity: number;
  fear: number;
  familiarity: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  place: PlaceKey;
  color: string;
  symbol: string;
  action: string;
  goal: string;
  mood: string;
  needs: Record<NeedKey, number>;
  traits: Record<NeedKey, number>;
  relations: Record<string, Relation>;
  memories: Memory[];
  path: { x: number; y: number }[];
}

export interface WorldEvent {
  id: string;
  tick: number;
  kind: "memory" | "need" | "social" | "movement" | "curiosity";
  title: string;
  description: string;
  agentIds: string[];
  place: PlaceKey;
}

export interface WorldState {
  tick: number;
  day: number;
  hour: number;
  weather: "薄曇り" | "海風" | "晴れ間";
  agents: Agent[];
  events: WorldEvent[];
  visited: Record<PlaceKey, number>;
}

export const places: Record<PlaceKey, { label: string; x: number; y: number; kind: "food" | "safe" | "social" | "unknown" }> = {
  grove: { label: "果樹の木立", x: 24, y: 30, kind: "food" },
  pond: { label: "静かな池", x: 58, y: 31, kind: "safe" },
  mill: { label: "風車の広場", x: 72, y: 57, kind: "social" },
  lookout: { label: "霧の見晴台", x: 30, y: 71, kind: "unknown" },
  garden: { label: "手入れされた庭", x: 50, y: 67, kind: "food" },
  cove: { label: "潮だまりの入江", x: 80, y: 23, kind: "unknown" },
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const id = () => Math.random().toString(36).slice(2, 9);

const initialAgents: Agent[] = [
  {
    id: "mio", name: "ミオ", role: "見張り役", color: "#E4804A", symbol: "M", x: 30, y: 67, targetX: 30, targetY: 67, place: "lookout",
    action: "霧の向こうを観察している", goal: "未知を安全な距離から確かめる", mood: "用心深い好奇心",
    needs: { hunger: .31, safety: .64, affiliation: .42, curiosity: .76 }, traits: { hunger: .8, safety: 1.22, affiliation: .76, curiosity: 1.35 },
    relations: { sora: { trust: .18, affinity: .12, fear: .08, familiarity: .34 }, riku: { trust: .48, affinity: .35, fear: .02, familiarity: .61 } },
    memories: [{ id: "m1", tick: 8, text: "入江の方で、見慣れない青い光を見た。", confidence: .78, salience: .82 }], path: [{ x: 30, y: 67 }],
  },
  {
    id: "sora", name: "ソラ", role: "庭の世話役", color: "#D6B648", symbol: "S", x: 52, y: 66, targetX: 52, targetY: 66, place: "garden",
    action: "木の実を分けている", goal: "空腹を満たし、誰かにも分ける", mood: "おだやか",
    needs: { hunger: .67, safety: .29, affiliation: .73, curiosity: .35 }, traits: { hunger: 1.3, safety: .75, affiliation: 1.2, curiosity: .62 },
    relations: { mio: { trust: .25, affinity: .2, fear: .05, familiarity: .38 }, riku: { trust: .62, affinity: .67, fear: .01, familiarity: .83 } },
    memories: [{ id: "s1", tick: 4, text: "リクが池のそばで転び、少し驚いていた。", confidence: .92, salience: .56 }], path: [{ x: 52, y: 66 }],
  },
  {
    id: "riku", name: "リク", role: "小さな運び手", color: "#66A89A", symbol: "R", x: 70, y: 55, targetX: 70, targetY: 55, place: "mill",
    action: "広場で、風の音を聞いている", goal: "誰かと一緒に過ごす", mood: "親しみ深い",
    needs: { hunger: .38, safety: .42, affiliation: .82, curiosity: .48 }, traits: { hunger: .9, safety: .95, affiliation: 1.42, curiosity: .82 },
    relations: { mio: { trust: .58, affinity: .4, fear: .01, familiarity: .62 }, sora: { trust: .77, affinity: .71, fear: .01, familiarity: .9 } },
    memories: [{ id: "r1", tick: 7, text: "ソラから温かい木の実をもらった。", confidence: .98, salience: .76 }], path: [{ x: 70, y: 55 }],
  },
];

export const createInitialState = (): WorldState => ({
  tick: 12,
  day: 1,
  hour: 9,
  weather: "薄曇り",
  agents: JSON.parse(JSON.stringify(initialAgents)),
  events: [
    { id: "e1", tick: 12, kind: "social", title: "分け合う", description: "ソラは庭の木の実をリクに渡した。", agentIds: ["sora", "riku"], place: "garden" },
    { id: "e2", tick: 10, kind: "curiosity", title: "遠くの光", description: "ミオは入江の方で知らない青い光を見つけた。", agentIds: ["mio"], place: "cove" },
    { id: "e3", tick: 8, kind: "movement", title: "風車へ", description: "リクは人の声を探して広場へ歩いた。", agentIds: ["riku"], place: "mill" },
  ],
  visited: { grove: 4, pond: 2, mill: 7, lookout: 3, garden: 8, cove: 0 },
});

const needLabel: Record<NeedKey, string> = { hunger: "空腹", safety: "安全", affiliation: "つながり", curiosity: "好奇心" };

function chooseDestination(agent: Agent, state: WorldState) {
  const entries = Object.entries(places) as [PlaceKey, typeof places[PlaceKey]][];
  const best = entries.map(([key, place]) => {
    let score = 0.12 + Math.random() * .12;
    if (place.kind === "food") score += agent.needs.hunger * agent.traits.hunger;
    if (place.kind === "safe") score += agent.needs.safety * agent.traits.safety;
    if (place.kind === "social") score += agent.needs.affiliation * agent.traits.affiliation;
    if (place.kind === "unknown") score += agent.needs.curiosity * agent.traits.curiosity * (1 / (1 + state.visited[key] * .22));
    if (key === agent.place) score -= .1;
    return { key, place, score };
  }).sort((a, b) => b.score - a.score)[0];
  return best;
}

function reasonFor(agent: Agent, destination: PlaceKey) {
  const place = places[destination];
  if (place.kind === "food") return { action: destination === "garden" ? "庭で木の実を探している" : "果樹の下へ急いでいる", goal: "空腹を少し和らげる", mood: "腹を空かせている", key: "hunger" as NeedKey };
  if (place.kind === "safe") return { action: "池のそばで息を整えている", goal: "安全を取り戻す", mood: "慎重", key: "safety" as NeedKey };
  if (place.kind === "social") return { action: "広場で誰かを待っている", goal: "近くにいる誰かと過ごす", mood: "ひらかれている", key: "affiliation" as NeedKey };
  return { action: destination === "cove" ? "潮だまりの光を確かめに行く" : "霧の奥を見に行く", goal: "まだ知らないことを一つ確かめる", mood: "静かな好奇心", key: "curiosity" as NeedKey };
}

export function advanceWorld(previous: WorldState): WorldState {
  const state: WorldState = JSON.parse(JSON.stringify(previous));
  state.tick += 1;
  state.hour = (state.hour + 1) % 24;
  if (state.hour === 0) state.day += 1;
  if (state.tick % 14 === 0) state.weather = state.weather === "薄曇り" ? "海風" : state.weather === "海風" ? "晴れ間" : "薄曇り";

  const events: WorldEvent[] = [];
  state.agents.forEach((agent) => {
    agent.needs.hunger = clamp(agent.needs.hunger + .035 + Math.random() * .018);
    agent.needs.safety = clamp(agent.needs.safety + (state.weather === "海風" ? .018 : .006) - .004 * agent.needs.affiliation);
    agent.needs.affiliation = clamp(agent.needs.affiliation + .016);
    agent.needs.curiosity = clamp(agent.needs.curiosity + .012);

    const dx = agent.targetX - agent.x;
    const dy = agent.targetY - agent.y;
    if (Math.abs(dx) + Math.abs(dy) > .8) {
      agent.x += dx * .19;
      agent.y += dy * .19;
      agent.path = [...agent.path.slice(-8), { x: agent.x, y: agent.y }];
    } else {
      const destination = chooseDestination(agent, state);
      const reason = reasonFor(agent, destination.key);
      agent.targetX = destination.place.x + (Math.random() * 6 - 3);
      agent.targetY = destination.place.y + (Math.random() * 5 - 2.5);
      agent.place = destination.key;
      agent.action = reason.action;
      agent.goal = reason.goal;
      agent.mood = reason.mood;
      agent.needs[reason.key] = clamp(agent.needs[reason.key] - .18);
      state.visited[destination.key] += 1;
      const event: WorldEvent = {
        id: id(), tick: state.tick,
        kind: reason.key === "curiosity" ? "curiosity" : reason.key === "affiliation" ? "social" : "need",
        title: reason.key === "curiosity" ? "自分で見つける" : `${needLabel[reason.key]}に従う`,
        description: `${agent.name}は${reason.goal}ため、${destination.place.label}へ向かった。`,
        agentIds: [agent.id], place: destination.key,
      };
      events.push(event);
      agent.memories = [{ id: id(), tick: state.tick, text: event.description, confidence: .9, salience: .48 }, ...agent.memories].slice(0, 4);
    }
  });

  const pairs: [Agent, Agent][] = [];
  for (let i = 0; i < state.agents.length; i += 1) for (let j = i + 1; j < state.agents.length; j += 1) {
    const a = state.agents[i], b = state.agents[j];
    if (Math.hypot(a.x - b.x, a.y - b.y) < 13 && Math.random() < .31) pairs.push([a, b]);
  }
  pairs.slice(0, 1).forEach(([a, b]) => {
    const aRel = a.relations[b.id]; const bRel = b.relations[a.id];
    aRel.trust = clamp(aRel.trust + .045); bRel.trust = clamp(bRel.trust + .045);
    aRel.familiarity = clamp(aRel.familiarity + .055); bRel.familiarity = clamp(bRel.familiarity + .055);
    a.needs.affiliation = clamp(a.needs.affiliation - .22); b.needs.affiliation = clamp(b.needs.affiliation - .22);
    const event: WorldEvent = { id: id(), tick: state.tick, kind: "social", title: "出会う", description: `${a.name}と${b.name}は${places[a.place].label}で立ち止まり、少し話した。`, agentIds: [a.id, b.id], place: a.place };
    events.unshift(event);
    [a, b].forEach((agent) => agent.memories = [{ id: id(), tick: state.tick, text: event.description, confidence: .94, salience: .67 }, ...agent.memories].slice(0, 4));
  });
  state.events = [...events, ...state.events].slice(0, 8);
  return state;
}
