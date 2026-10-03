import { describe, expect, it, vi } from "vitest";
import { advanceWorld, createInitialState } from "./simulation";
import { random01 } from "./random";

function replay(seed: number, intervene = false) {
  let state = createInitialState(seed);
  const history = [];
  for (let step = 0; step < 100; step += 1) {
    if (intervene && step === 20) state.agents[0].traits.curiosity = 0.2;
    if (intervene && step === 55) state.agents[1].traits.hunger = 1.5;
    state = advanceWorld(state);
    history.push(state);
  }
  return history;
}

describe("seeded world replay", () => {
  it("replays all states and events for 100 ticks, including interventions", () => {
    for (const intervene of [false, true]) {
      expect(replay(42, intervene)).toEqual(replay(42, intervene));
    }
  });
  it("replays after reset and does not mutate previous state", () => {
    const initial = createInitialState(42);
    const snapshot = structuredClone(initial);
    advanceWorld(initial);
    expect(initial).toEqual(snapshot);
    const history = replay(initial.seed, true);
    const reset = createInitialState(history[99].seed);
    expect(reset).toEqual(initial);
    expect(replay(reset.seed, true)).toEqual(history);
    reset.agents[0].traits.hunger = 0;
    expect(createInitialState(42)).toEqual(initial);
  });
  it("varies with the seed and intervened traits", () => {
    expect(replay(42)).not.toEqual(replay(43));
    expect(replay(42)).not.toEqual(replay(42, true));
  });
  it("uses no ambient randomness and produces unique generated IDs", () => {
    const spy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("ambient randomness");
    });
    try {
      const events = new Map<string, string>();
      const memories = new Map<string, string>();
      for (const state of replay(42)) {
        for (const event of state.events) {
          const serialized = JSON.stringify(event);
          if (events.has(event.id))
            expect(events.get(event.id)).toBe(serialized);
          events.set(event.id, serialized);
        }
        for (const agent of state.agents)
          for (const memory of agent.memories) {
            const serialized = JSON.stringify(memory);
            if (memories.has(memory.id))
              expect(memories.get(memory.id)).toBe(serialized);
            memories.set(memory.id, serialized);
          }
      }
      expect(events.size).toBeGreaterThan(3);
    } finally {
      spy.mockRestore();
    }
  });
  it("keys draws by purpose and normalizes seeds to uint32", () => {
    const draw = random01(42, [13, "mio", "hunger"]);
    expect(draw).toBeGreaterThanOrEqual(0);
    expect(draw).toBeLessThan(1);
    random01(42, [13, "mio", "id"]);
    expect(random01(42, [13, "mio", "hunger"])).toBe(draw);
    expect(random01(42, [13, "mio", "target-x"])).not.toBe(draw);
    expect(createInitialState(-1).seed).toBe(4294967295);
  });
});
