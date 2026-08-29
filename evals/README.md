# Evals

Proof that the guardrail still bites — in both directions.

```bash
npm run evals
```

## What this is, and is not

This is a **guardrail eval**, not a generation eval. It does not call a model:
that needs a key, costs money, and returns a different answer every run, so it
could never gate a build.

It fixes the half that *can* be deterministic — given output an agent plausibly
produces, does the checker reach the right verdict?

| | Assertion |
| --- | --- |
| `*.fail.tsx` | must trigger the rule named in its `// @expect` comment |
| `*.pass.tsx` | must be clean |

## Why the `.fail` direction is the point

A rule that silently stops firing is the failure this exists for.

`dls.config.json` did not ship, so in every consumer project `rules.wordmark`
was null and `name` fell back to `"design-system"`. The wordmark rule searched
generated code for that literal string and ignored `2one`. It reported
**"no violations"** and looked correct.

A pass-only suite would not have caught it. Nor would asserting an error
*count* — the case would simply have stopped contributing one. The assertion
has to be that a **named rule fired**.

## Scope, honestly

These run **in-repo**, where the config is always present. They prove the rules
fire *here*. They do not prove the rules fire *in a consumer* — that is
`npm run check:package`, which asserts every path a consumer command reads is
actually shipped. The two together close the gap; neither does alone.

## Adding a case

Name it `<topic>.fail.tsx` or `<topic>.pass.tsx`. A `.fail` case must declare
the rule it targets:

```tsx
// @expect typeset-wordmark
```

Prefer cases drawn from real failures. Every `.fail` here is something that
actually shipped or was actually generated.
