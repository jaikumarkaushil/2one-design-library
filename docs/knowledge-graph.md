# The 2one knowledge graph — the reasoning layer

The knowledge graph is the **semantic source of truth for design decisions**; the
component library is the **implementation** of those decisions. An AI agent should
query the graph and learn not only *what exists* but *what to use, why, what to
avoid, which rule requires it, the preferred alternative, and how to compose it* —
so it does not invent a decision the 2one system already has an opinion about.

Everything is generated deterministically: same repo state → identical `graph.json`
(stable ids, sorted nodes/edges, no timestamps).

## Two layers

| Layer | Provenance | Source | Examples |
|---|---|---|---|
| **Derived** | `derived` | parsed from repo source | tokens, components, `composed_of`, `uses`, `depends_on`, contrast facts |
| **Authored** | `explicit` | `graph/decisions.json` + `rules/ux-rules.json` | intents, contexts, states, a11y requirements, rules, `preferred_for`, `preferred_over`, `inappropriate_for`, `requires` |

The derived layer describes *the design system*. The authored layer describes *how
the design system thinks* — it is the part that makes the graph valuable to AI, and
it cannot be regenerated from code, so it is authored with a real `source`/`evidence`
reference on every item.

## Ontology — [`graph/ontology.json`](../graph/ontology.json)

Node **classes**: `Foundation` (tokens), `Component` (incl. variants), `Pattern`
(templates + named UX patterns), `Rule`, `Intent`, `Context`, `State`,
`AccessibilityRequirement`, `Brand`, `Evidence` (contrast), `Package`.

Every **edge type** declares a `domain → range` (which classes it may connect) and a
single unambiguous meaning. `build-graph.mjs` validates every generated edge against
this; `npm run graph:validate` fails on any violation. Key decision edges:

`realized_by` · `preferred_for` · `preferred_over` · `appropriate_for` ·
`inappropriate_for` · `alternative_to` · `forbidden_with` · `requires` ·
`supports_state` · `preferred_composition` · `demonstrates` · `governed_by` ·
`applies_to` · `applies_when` · `overrides` · `conflicts_with` · `specializes`.

## Decision priority & conflict resolution

Rules are first-class and come from [`rules/ux-rules.json`](../rules/ux-rules.json)
— the authoritative contract. Each rule carries a **severity**
(`forbidden > must > should > may > avoid`) and a **category**. When two rules
conflict, the **category earlier in the precedence ladder wins**; within a category,
the higher severity wins:

```
accessibility  ›  brand  ›  consistency  ›  interaction  ›  layout  ›  implementation  ›  (ai preference)
```

Accessibility is never traded for brand or aesthetics. The decision engine
tier-sorts every rule set by this ladder, so conflicts resolve deterministically —
never by the agent guessing.

## Provenance & confidence

`explicit` (authored in a rule/doc/metadata) **>** `derived` (parsed from source)
**>** `inferred` (heuristic — never authoritative alone). Every authored node has a
`source`; every decision edge has an `evidence` file. `graph:validate` fails if any
provenance points at a file that does not exist — the graph can always answer *"why
does the system say this?"* with a real repository reference.

## The decision engine — [`scripts/graph-decide.mjs`](../scripts/graph-decide.mjs)

```bash
npm run graph:decide -- decide <intent> [--context <ctx>]   # full decision
npm run graph:decide -- check <component> <intent|context>  # is this valid? YES/NO
npm run graph:decide -- rules <node>                        # rules governing a node
npm run graph:decide -- alternatives <node>                 # what to use instead
npm run graph:decide -- incompatible <node>                 # forbidden compositions
npm run graph:decide -- a11y <node>                         # accessibility requirements
npm run graph:decide -- states <node>                       # supported states
npm run graph:decide -- why <source> <target>              # evidence for a relationship
```

Add `--json` to any command for machine output.

## AI decision protocol

An agent building 2one UI must follow this order — see also `AGENTS.md`:

1. Identify the **user intent** (e.g. submit a form, confirm a destructive action).
2. Identify the **context** (mobile? confirmation flow?).
3. `decide <intent> [--context]` → the preferred pattern/component + composition.
4. Treat every **MANDATORY** rule as a hard constraint; obey **PREFERRED** unless a
   higher-tier rule overrides.
5. Check **anti-patterns** (`inappropriate_for`, `forbidden_with`, `avoid` rules).
6. Resolve any rule conflict by the **precedence ladder** — not by preference.
7. Pull the **accessibility requirements** for the chosen components.
8. Compose the solution from the preferred composition.
9. Validate the proposal (`check`, `incompatible`, `rules`) before emitting UI.
10. Cite the **evidence** for important decisions when asked.

## Validation & tests

- `npm run graph:validate` — semantic soundness: ontology conformance, dangling
  refs, rules without targets, `preferred_over` cycles, missing provenance files,
  and coverage gaps (components without usage guidance) as warnings.
- `npm run graph:test` — deterministic decision tests: locks AI behaviour so a graph
  change can't silently alter a design decision. Expected answers come from the 2one
  rules, not invented values.

Both run in `npm run verify`.

## Extending the graph

- **A new rule** → add it to `rules/ux-rules.json` (id, category, severity,
  statement, rationale, `applies_to`). It becomes a `rule:` node with `governed_by`
  edges automatically.
- **A new intent / preference / anti-pattern** → add nodes/edges to
  `graph/decisions.json` with a real `source`/`source_ref`.
- Then `npm run graph && npm run graph:validate && npm run graph:test`.

Do **not** dump prose or whole documents into the graph. The graph holds
relationships, decisions, and constraints; documents hold long-form explanation;
code holds implementation; tokens hold canonical values. The graph points at those
sources rather than duplicating them.
