import { advanceWorld, type Policy, type WorldState } from "./simulation";

export const policies: Policy[] = [
  "normal",
  "no-drive",
  "random",
  "fixed-policy",
];
/** Each branch starts from exactly the supplied state; no observer interventions. */
export function runExperiment(initial: WorldState) {
  return {
    schema: "nozomi-experiment-v1",
    engine: "keyed-rng-v1-observatory-v1",
    initial: structuredClone(initial),
    steps: 100,
    runs: policies.map((policy) => {
      let state = structuredClone(initial);
      const history: WorldState[] = [];
      for (let i = 0; i < 100; i++) {
        state = advanceWorld(state, policy);
        history.push(state);
      }
      const choices = history.flatMap((s) => s.decisions);
      return {
        policy,
        history,
        summary: {
          decisions: choices.length,
          destinations: Object.fromEntries(
            initial.agents.map((a) => [
              a.id,
              Object.fromEntries(
                Object.keys(initial.visited).map((place) => [
                  place,
                  choices.filter(
                    (d) => d.agentId === a.id && d.selected === place,
                  ).length,
                ]),
              ),
            ]),
          ),
          meanNeed: Object.fromEntries(
            initial.agents.map((a) => [
              a.id,
              Object.fromEntries(
                Object.keys(a.needs).map((need) => [
                  need,
                  history.reduce(
                    (sum, s) =>
                      sum +
                      s.agents.find((agent) => agent.id === a.id)!.needs[
                        need as keyof typeof a.needs
                      ],
                    0,
                  ) / history.length,
                ]),
              ),
            ]),
          ),
        },
      };
    }),
  };
}
