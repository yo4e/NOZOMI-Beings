import { describe, expect, it } from "vitest";
import { runExperiment } from "./experiment";
import { advanceWorld, createInitialState } from "./simulation";

describe("measurement baseline", () => {
  it("exports four reproducible branches without changing the starting state", () => {
    const initial = createInitialState(42);
    const before = structuredClone(initial);
    const result = runExperiment(initial);
    expect(initial).toEqual(before);
    expect(JSON.parse(JSON.stringify(result))).toEqual(runExperiment(initial));
    for (const run of result.runs) {
      expect(run.history).toHaveLength(100);
      expect(run.history[99].tick).toBe(112);
      expect(run.summary.decisions).toBeGreaterThan(0);
      for (const state of run.history)
        for (const d of state.decisions) {
          expect(d.candidates).toHaveLength(6);
          expect(d.selected).toBe(
            [...d.candidates].sort((a, b) => b.score - a.score)[0].key,
          );
          if (run.policy !== "normal")
            expect(d.candidates.every((c) => c.drive === 0)).toBe(true);
          if (run.policy === "fixed-policy") expect(d.selected).toBe("grove");
        }
    }
    expect(result.runs[0].history).not.toEqual(result.runs[1].history);
  });
  it("records numeric score components before needs are relieved", () => {
    const next = advanceWorld(createInitialState(42));
    expect(next.decisions).toHaveLength(3);
    for (const d of next.decisions)
      for (const c of d.candidates)
        expect(c.score).toBe(c.base + c.drive + c.penalty);
  });
});
