/**
 * Field Notes Observatory: language layer for the browser-only simulation.
 * Translates observation UI and the authored, structured simulation vocabulary.
 */
import type { Agent, NeedKey, PlaceKey, WorldEvent } from "./simulation";

export type Language = "ja" | "en";

export const ui = {
  ja: {
    day: "DAY",
    pause: "観察を止める",
    resume: "観察を続ける",
    reset: "世界を初期状態に戻す",
    fieldLog: "LIVE FIELD LOG",
    logIntro: "世界は、指示を待たずに進行しています。理由は欲求と、見聞きした記憶に残ります。",
    note: "「命令がなくても、局所の不足が島を少しずつ動かしている。」",
    worldLabel: "A SMALL WORLD, IN MOTION",
    worldTitle: ["誰も呼んでいないのに、", "彼らは動き出す。"],
    agents: "自律NPC",
    trails: "直近の航跡",
    innerWorld: "個の内なる世界が、",
    simultaneous: "同時に進行中",
    choices: "回の場所選択が、",
    islandDrawn: "今日のNOZOMI Islandを描いた",
    recording: "観察を記録中",
    frozen: "世界を静止中",
    specimen: "SELECTED SPECIMEN",
    intent: "現在の意図",
    innerWeather: "INNER WEATHER",
    urgency: "緊急度",
    impressions: "RECENT IMPRESSIONS",
    memory: "記憶",
    intervention: "GENTLE INTERVENTION",
    weights: "欲求の重み",
    weightHelp: "観察者は、次の選択を決めずに「傾き」だけを調整できます。",
    coveEvent: "EVENT AT THE COVE",
    coveCopy: "知らない光が、まだ誰かの行動を待っている。",
    footerLabel: "HOW THIS WORLD MOVES",
    footerTitle: "これは、表示だけのモックではありません。",
    footerLead: "NOZOMI Islandの住人は、空腹・安全・つながり・好奇心という数値的な欲求を持ち、時間と出来事でその値を変化させています。いま必要なことを選び、歩き、出会い、その出来事を短期記憶として残します。",
    mechanismTitles: ["欲求が行き先を選ぶ", "出会いが関係を変える", "記憶が理由を残す"],
    mechanismCopies: ["欲求の強さと個性の重みから、食料、安全な場所、他者、未知の場所を比べます。", "近くで出会った住人どうしは、trustとfamiliarityを更新し、孤立の強さも変わります。", "選択や遭遇は、観察できる短期記憶として残り、次の物語の足跡になります。"],
    boundaryLabel: "現在の範囲:",
    boundaryCopy: "この世界はブラウザ内で進む短期シミュレーションです。ページを閉じると状態はリセットされ、長期保存・複雑な会話・LLMによる計画生成は、これから育てる層として残しています。",
  },
  en: {
    day: "DAY",
    pause: "Pause observing",
    resume: "Resume observing",
    reset: "Reset the world",
    fieldLog: "LIVE FIELD LOG",
    logIntro: "The world proceeds without waiting for instructions. Its reasons remain in drives and in what its residents notice.",
    note: '“Even without a command, a small lack can move an island.”',
    worldLabel: "A SMALL WORLD, IN MOTION",
    worldTitle: ["No one called them,", "yet they begin to move."],
    agents: "autonomous NPCs",
    trails: "recent trails",
    innerWorld: "inner worlds",
    simultaneous: "moving at once",
    choices: "place choices",
    islandDrawn: "have drawn NOZOMI Island today",
    recording: "observation recording",
    frozen: "world paused",
    specimen: "SELECTED SPECIMEN",
    intent: "CURRENT INTENT",
    innerWeather: "INNER WEATHER",
    urgency: "URGENCY",
    impressions: "RECENT IMPRESSIONS",
    memory: "MEMORY",
    intervention: "GENTLE INTERVENTION",
    weights: "DRIVE WEIGHTS",
    weightHelp: "The observer can adjust only the tendency, never choose the next action.",
    coveEvent: "EVENT AT THE COVE",
    coveCopy: "An unknown light is still waiting for someone to act.",
    footerLabel: "HOW THIS WORLD MOVES",
    footerTitle: "This is more than a display mock-up.",
    footerLead: "Residents of NOZOMI Island hold numeric drives for hunger, safety, affiliation, and curiosity. Time and events change those values; they choose what they need, walk, meet, and keep the moment as a short-term memory.",
    mechanismTitles: ["Drives choose a destination", "Meetings change relations", "Memory keeps a reason"],
    mechanismCopies: ["The strength of each drive and each resident’s traits compare food, safety, other people, and the unknown.", "Residents who meet nearby update trust and familiarity, while their sense of isolation changes too.", "Choices and encounters remain as visible short-term memories: footprints for the next story."],
    boundaryLabel: "CURRENT SCOPE:",
    boundaryCopy: "This is a short-lived simulation running in the browser. Closing the page resets it; persistence, complex conversation, and LLM planning are layers still to grow.",
  },
} as const;

const places: Record<Language, Record<PlaceKey, string>> = {
  ja: { grove: "果樹の木立", pond: "静かな池", mill: "風車の広場", lookout: "霧の見晴台", garden: "手入れされた庭", cove: "潮だまりの入江" },
  en: { grove: "Fruit Grove", pond: "Quiet Pond", mill: "Windmill Square", lookout: "Misty Lookout", garden: "Tended Garden", cove: "Tidal Cove" },
};

const needs: Record<Language, Record<NeedKey, string>> = {
  ja: { hunger: "空腹", safety: "安全", affiliation: "つながり", curiosity: "好奇心" },
  en: { hunger: "Hunger", safety: "Safety", affiliation: "Affiliation", curiosity: "Curiosity" },
};

const weather: Record<Language, Record<string, string>> = {
  ja: { "薄曇り": "薄曇り", "海風": "海風", "晴れ間": "晴れ間" },
  en: { "薄曇り": "Overcast", "海風": "Sea breeze", "晴れ間": "Clearing" },
};

const agents: Record<Language, Record<string, Pick<Agent, "name" | "role" | "mood" | "action" | "goal">>> = {
  ja: {},
  en: {
    mio: { name: "Mio", role: "Lookout", mood: "Cautious curiosity", action: "Watching beyond the mist", goal: "To check the unknown from a safe distance" },
    sora: { name: "Sora", role: "Garden keeper", mood: "Gentle", action: "Sharing fruit in the garden", goal: "To ease hunger and share with someone" },
    riku: { name: "Riku", role: "Little carrier", mood: "Warmly open", action: "Listening to the wind in the square", goal: "To spend time with someone nearby" },
  },
};

const eventTitles: Record<Language, Record<string, string>> = {
  ja: {},
  en: {
    "分け合う": "Sharing", "遠くの光": "A distant light", "風車へ": "Toward the windmill", "出会う": "A meeting",
    "自分で見つける": "Finding out", "空腹に従う": "Following hunger", "安全に従う": "Following safety", "つながりに従う": "Following affiliation",
  },
};

const eventDescriptions: Record<Language, [RegExp, string][]> = {
  ja: [],
  en: [
    [/木の実をリクに渡した/, "Sora offered Riku fruit from the garden."],
    [/知らない青い光を見つけた/, "Mio noticed an unfamiliar blue light near the cove."],
    [/人の声を探して広場へ歩いた/, "Riku walked to the square in search of company."],
    [/立ち止まり、少し話した/, "Two residents paused together and exchanged a few words."],
    [/まだ知らないことを一つ確かめるため/, "Mio moved toward a place of the unknown."],
    [/空腹を少し和らげるため/, "Sora set out to ease a little hunger."],
    [/近くにいる誰かと過ごすため/, "Riku moved toward the chance to be with someone."],
    [/安全を取り戻すため/, "A resident sought a quieter, safer place."],
  ],
};

const memoryDescriptions: Record<Language, [RegExp, string][]> = {
  ja: [],
  en: [
    [/見慣れない青い光/, "I saw an unfamiliar blue light near the cove."],
    [/温かい木の実/, "Sora gave me a warm piece of fruit."],
    [/池のそばで転び/, "Riku stumbled near the pond and seemed startled."],
    [/立ち止まり、少し話した/, "We paused together and talked for a moment."],
    [/まだ知らないことを一つ確かめるため/, "I set out toward something I had not yet understood."],
    [/空腹を少し和らげるため/, "I moved to ease a little hunger."],
    [/近くにいる誰かと過ごすため/, "I moved toward the chance to be with someone."],
  ],
};

function replaceKnown(text: string, language: Language, patterns: Record<Language, [RegExp, string][]>) {
  if (language === "ja") return text;
  return patterns.en.find(([pattern]) => pattern.test(text))?.[1] ?? text;
}

export const tPlace = (place: PlaceKey, language: Language) => places[language][place];
export const tNeed = (need: NeedKey, language: Language) => needs[language][need];
export const tWeather = (value: string, language: Language) => weather[language][value] ?? value;
export const tAgent = (agent: Agent, language: Language) => language === "ja" ? agent : (agents.en[agent.id] ?? agent);
export const tEvent = (event: WorldEvent, language: Language) => ({ title: eventTitles[language][event.title] ?? event.title, description: replaceKnown(event.description, language, eventDescriptions) });
export const tMemory = (text: string, language: Language) => replaceKnown(text, language, memoryDescriptions);
