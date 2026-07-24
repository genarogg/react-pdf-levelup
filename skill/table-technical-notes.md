# Table — Technical Notes & Limits

Implementation-level facts about `Table`/`Thead`/`Tbody`/`Tr`/`Th`/`Td` that aren't visible from the prop tables in `core-components.md` and were only found by reading the component source directly. Read this before touching `borderRadius`, `grid`, `colSpan`/`rowSpan`, or non-text cell content on a `Table`.

## `borderRadius` has a hard practical limit of ~12

`Table`'s `style.borderRadius` triggers an internal border-radius workaround (see next section). Even with that workaround active, **`borderRadius` should not exceed 12**. Past that, the curvature stops lining up with the simulated border padding and the table's corners render distorted or misaligned. Keep `borderRadius <= 12` in `Table`'s `style`.

## The border you see is not a real border — it's a background color

This only applies when `style.borderRadius` is set (i.e. the workaround above is active). In that case:

- `Table` renders **two nested containers**, both using real `borderRadius`.
- The **outer** container gets `backgroundColor: <border color>` and `padding: <border width>`. There is no `borderWidth`/`borderColor` stroke anywhere in this path.
- The **inner** container holds the actual content and the user's real `backgroundColor`.
- The "border" you see is the outer container's solid fill showing through the padding ring the inner container doesn't cover.

Why: `@react-pdf/renderer` has a known rendering bug (upstream issue #395) when a real `borderWidth` stroke and `borderRadius` are combined on the same `View` — the curve geometry comes out distorted. This project avoids the bug entirely by never combining them: `borderRadius` alone (no stroke) on each of the two nested containers, with the "border" faked via background + padding instead of an actual stroke.

Practical implications:
- Don't expect `borderTopColor`/`borderRightColor`/etc. to independently show through when `borderRadius` is set — the simulated border is one uniform color for all four sides (first non-empty side color found is used as that uniform color; see `extractBorderColor` in `border-radius-fix.ts` for the exact priority order).
- The `backgroundColor` you pass to `Table`'s `style` is **not** applied to the outer container in this mode — it's reserved for the inner content container, since the outer one is already using its `backgroundColor` slot to fake the border.
- If `style.borderRadius` is not set (`0` or omitted), none of this applies — `Table` behaves like an ordinary `@react-pdf/renderer` `View` with whatever border props you passed through untouched.

## `grid` has three modes, not two

`core-components.md` currently documents `"grid"` and `"modern"`. There is also `"not-grid"`:

- **`"grid"`**: full borders — 1px table-level border plus per-cell right/bottom borders.
- **`"modern"`**: bottom-borders-only — a bottom rule under `Thead` and under each `Tr`.
- **`"not-grid"`**: no visible border at all. `@react-pdf/renderer` doesn't resolve `"transparent"` or alpha-channel colors as a real "no border," so instead of faking transparency, `not-grid` compensates with `padding` on the affected cell edges — this keeps cell sizing identical across all three grid modes even though `not-grid` draws no line.

## `zebra` striping is `Td`-only

The `zebra`/`zebraColor` alternating background never applies to `Th`. Header rows always render as a single flat `headerBackground`, regardless of `zebra`.

## `colSpan` is supported; `rowSpan` is not

- **`colSpan` works** and is the supported way to merge cells horizontally — it's a real proportional-width calculation done by `Tr` (based on each row's total column units), not a true cell merge. Pass it directly on `Th`/`Td`.
- **`rowSpan` is intentionally unsupported.** `@react-pdf/renderer` has no table engine — every `Tr` is an independent flex row with no visibility into what the previous or next `Tr` rendered, so there's no way to mark a column as "already occupied" across rows without shared state and out-of-flow positioning. If a vertical-merge look is required, it has to be built as a manually-positioned `View` layered outside the normal `Tr`/`Td` flow — not a `Table` prop.

## Non-text cell content: the `text` prop

`Th`/`Td` wrap `children` in a `Text` by default (`text={true}`) — correct for strings, numbers, or `Strong`/`Em`-style inline text components. Set `text={false}` when `children` is a `View`-based component (e.g. a `Badge`): `@react-pdf/renderer`'s `Text` cannot contain a `View`, and nesting them breaks the render. With `text={false}`, the cell renders `children` directly, with no intermediate `Text`.
