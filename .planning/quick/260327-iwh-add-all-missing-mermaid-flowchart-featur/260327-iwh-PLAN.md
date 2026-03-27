---
phase: quick
plan: 260327-iwh
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/mermaid/codeUtils.ts
  - src/components/visual/ShapeToolbar.tsx
  - src/components/visual/types.ts
  - src/lib/mermaid/__tests__/codeUtils.test.ts
  - src/i18n/locales/en.json
  - src/i18n/locales/fr.json
autonomous: true
requirements: [FLOW-01, FLOW-02, FLOW-03]

must_haves:
  truths:
    - "All Mermaid v11 shapes are recognized by the parser including @{ shape: '...' } syntax"
    - "Missing toolbar shapes (parallelogram-alt, trapezoid, trapezoid-alt) appear in ShapeToolbar"
    - "New v11 shapes (doc, docs, dbl-circ, cross-circ, etc.) appear in ShapeToolbar with SVG icons"
    - "FontAwesome icon nodes (fa:fa-name) are parsed correctly"
    - "Markdown-formatted labels (backtick-wrapped like `**bold**`) are parsed and round-trip correctly"
    - "All existing ARROW_RE edge types already parse correctly; toolbar/property panel exposes them visually"
    - "Click event and direction lines are recognized without crashing the parser"
    - "All existing tests continue to pass"
  artifacts:
    - path: "src/lib/mermaid/codeUtils.ts"
      provides: "Extended NodeShape type, SHAPE_PATTERNS, shapeWrap, parseNodeLabel for v11 shapes, markdown label support"
      contains: "NodeShape"
    - path: "src/components/visual/ShapeToolbar.tsx"
      provides: "ShapePreview SVG icons and SHAPES array for all new shapes, edge type selector in toolbar"
      contains: "SHAPES"
    - path: "src/lib/mermaid/__tests__/codeUtils.test.ts"
      provides: "Tests for new shape parsing, v11 shapes, icon nodes, markdown labels, click events, direction"
      min_lines: 1000
  key_links:
    - from: "src/components/visual/ShapeToolbar.tsx"
      to: "src/components/visual/types.ts"
      via: "import NodeShape"
    - from: "src/components/visual/types.ts"
      to: "src/lib/mermaid/codeUtils.ts"
      via: "re-export NodeShape type"
---

<objective>
Add all missing Mermaid flowchart features: new v11 shapes (@{ shape: "..." } syntax), missing toolbar shapes, FontAwesome icon node parsing, markdown label support (backtick syntax), click event and direction line recognition, edge type UI exposure, and comprehensive test coverage.

Purpose: Achieve full Mermaid flowchart spec coverage so users can parse and render any valid flowchart.
Output: Extended NodeShape type, updated parser with v11 shape and markdown label support, expanded ShapeToolbar with all shapes and edge type selector, passing tests.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/mermaid/codeUtils.ts
@src/components/visual/ShapeToolbar.tsx
@src/components/visual/types.ts
@src/lib/mermaid/__tests__/codeUtils.test.ts
@src/i18n/locales/en.json
@src/i18n/locales/fr.json

<interfaces>
<!-- Key types the executor needs -->

From src/components/visual/types.ts:
```typescript
export type ToolMode = 'select' | 'connect';
// Re-exports NodeShape, NodeStyle from codeUtils
```

From src/lib/mermaid/codeUtils.ts:
```typescript
export type NodeShape =
  | 'rect' | 'round' | 'stadium' | 'subroutine' | 'cylinder'
  | 'circle' | 'asymmetric' | 'rhombus' | 'hexagon' | 'parallelogram'
  | 'parallelogram-alt' | 'trapezoid' | 'trapezoid-alt';

export interface ParsedNode {
  id: string;
  label: string;
  shape: NodeShape;
  raw: string;
  parentSubgraphId?: string | null;
}

// SHAPE_PATTERNS: Array<{ shape: NodeShape; open: string; close: string; regex: RegExp }>
// parseNodeLabel(raw: string): { label: string; shape: NodeShape; quoted: boolean }
// shapeWrap(label: string, shape: NodeShape, quoted?: boolean): string
// ARROW_RE: RegExp
// parseDiagram(source: string): ParsedDiagram
```

Current NodeShape values in codeUtils.ts type: rect, round, stadium, subroutine, cylinder, circle, asymmetric, rhombus, hexagon, parallelogram, parallelogram-alt, trapezoid, trapezoid-alt.

Current ARROW_RE already covers all standard Mermaid edge types: `-->`, `---`, `-.->`, `-.->`, `==>`, `x--x`, `.->`, `<-->`, `o--o`, `--o`, `o--`, `--|>`, `|>`, `~~~`. No regex changes needed.

ShapeToolbar SHAPES array currently has 10 entries: rect, round, stadium, rhombus, circle, hexagon, cylinder, parallelogram, subroutine, asymmetric.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Extend NodeShape type, parser, markdown labels, and add tests for v11 shapes + missing features</name>
  <files>src/lib/mermaid/codeUtils.ts, src/lib/mermaid/__tests__/codeUtils.test.ts</files>
  <behavior>
    - Test: parseDiagram recognizes A@{ shape: "doc", label: "Document" } as shape 'doc'
    - Test: parseDiagram recognizes A@{ shape: "dbl-circ", label: "Stop" } as shape 'dbl-circ'
    - Test: parseDiagram recognizes A@{ icon: "fa:user", form: "square", label: "User" } as shape 'icon'
    - Test: parseDiagram recognizes A[fa:fa-twitter Twitter] as shape 'rect' with label 'fa:fa-twitter Twitter'
    - Test: parseDiagram handles click A "https://example.com" without crash (skip line)
    - Test: parseDiagram handles direction LR inside subgraph without crash (skip line)
    - Test: parseDiagram recognizes parallelogram-alt shape from [\label\] syntax
    - Test: parseDiagram recognizes trapezoid shape from [/label\] syntax
    - Test: parseDiagram recognizes trapezoid-alt shape from [\label/] syntax
    - Test: shapeWrap produces correct output for all new v11 shapes
    - Test: parseNodeLabel detects backtick-wrapped markdown label `` `**bold**` `` and returns markdown: true
    - Test: parseNodeLabel detects `` `*italic*` `` and returns markdown: true
    - Test: parseNodeLabel on normal label "plain text" returns markdown: false
    - Test: shapeWrap with markdown=true wraps label in backticks: `` `**bold**` `` inside the shape delimiters
    - Test: ParsedNode interface includes optional boolean `markdown` field
    - Test: All existing tests still pass
  </behavior>
  <action>
    **Step 1: Extend NodeShape type and ParsedNode interface in codeUtils.ts**

    Add these new shape values to the NodeShape type union:
    ```
    | 'doc' | 'docs' | 'dbl-circ' | 'cross-circ' | 'bow-rect'
    | 'flip-tri' | 'curv-trap' | 'manual-file' | 'manual-input'
    | 'procs' | 'paper-tape' | 'icon'
    ```

    Add a `markdown` field to the ParsedNode interface:
    ```typescript
    export interface ParsedNode {
      id: string;
      label: string;
      shape: NodeShape;
      raw: string;
      parentSubgraphId?: string | null;
      markdown?: boolean;  // true if label uses Mermaid markdown syntax (backtick-wrapped)
    }
    ```

    Also update the return type of parseNodeLabel to include `markdown: boolean`:
    ```typescript
    // parseNodeLabel(raw: string): { label: string; shape: NodeShape; quoted: boolean; markdown: boolean }
    ```

    **Step 2: Add markdown label detection to parseNodeLabel**

    Mermaid supports markdown in labels via backtick syntax. A label like `A["`**bold text**`"]` renders bold text.

    At the start of parseNodeLabel, before the SHAPE_PATTERNS loop, add markdown detection:
    - After extracting the label text from shape delimiters, check if the label is wrapped in backticks: starts with `` ` `` and ends with `` ` ``
    - If so, set `markdown = true` and strip the outer backticks from the returned label
    - If not, set `markdown = false`
    - The backtick wrapping can appear inside any shape delimiter: `["`**bold**`"]`, ("`*italic*`"), etc.

    Implementation approach:
    1. After the existing SHAPE_PATTERNS loop extracts `label` and `shape`, check if `label` matches `` /^`([^`]+)`$/ ``
    2. If it matches, set `markdown = true` and extract the inner content as the label
    3. If it doesn't match, set `markdown = false`

    **Step 3: Update shapeWrap to support markdown labels**

    Add a `markdown` parameter to shapeWrap (default false for backward compatibility):
    ```typescript
    function shapeWrap(label: string, shape: NodeShape, quoted = false, markdown = false): string {
    ```

    When `markdown` is true, wrap the label in backticks before placing it inside the shape delimiters:
    ```typescript
    const displayLabel = markdown ? `\`${label}\`` : label;
    ```
    Then use `displayLabel` in all the shape cases instead of `label` directly.

    **Step 4: Add v11 shape parsing to parseNodeLabel**

    Before the existing SHAPE_PATTERNS loop, add detection for the `@{ ... }` syntax:
    - Match pattern: `@{ shape: "name", label: "Label" }` or `@{ icon: "...", form: "...", label: "..." }`
    - If `icon` key present, return shape 'icon' with label from the label field
    - Otherwise return the shape name from the `shape` field
    - Supported v11 shape names: doc, docs, dbl-circ, cross-circ, bow-rect, flip-tri, curv-trap, manual-file, manual-input, procs, paper-tape
    - For v11 shapes, also check if the label text is backtick-wrapped and set markdown accordingly

    **Step 5: Add shapeWrap cases for v11 shapes**

    Add cases to the shapeWrap switch for all new shapes. These use the `@{ shape: "name", label: "label" }` syntax:
    - `case 'doc': return \`@{ shape: "doc", label: "${displayLabel}" }\``
    - Same pattern for: docs, dbl-circ, cross-circ, bow-rect, flip-tri, curv-trap, manual-file, manual-input, procs, paper-tape
    - `case 'icon': return \`@{ icon: "fa:icon", form: "square", label: "${displayLabel}" }\`` (default icon form)

    **Step 6: Propagate markdown flag through parseDiagram**

    In parseDiagram, wherever nodes are pushed (after calling parseNodeLabel), also include the `markdown` field from the parseNodeLabel result:
    ```typescript
    const { label, shape, quoted, markdown } = parseNodeLabel(...);
    nodes.push({ id, label, shape, raw, parentSubgraphId, markdown });
    ```

    Update all call sites that destructure parseNodeLabel results to also extract `markdown`.

    **Step 7: Update parseDiagram to skip click and direction lines**

    In the parseDiagram function, add skip handlers before the edge/node parsing:
    - Skip `click ` lines: `if (trimmed.startsWith('click ')) continue;`
    - Skip `direction ` lines inside subgraphs: `if (trimmed.startsWith('direction ')) continue;`

    Also update the STANDALONE_NODE_RE skip list to include 'click' if not already excluded.

    **Step 8: Write tests FIRST (TDD RED phase)**

    Add to codeUtils.test.ts a new describe block `describe('v11 Shapes and Extended Features')` with tests for:
    1. Parsing `A@{ shape: "doc", label: "Doc" }` standalone node
    2. Parsing `A@{ shape: "dbl-circ", label: "Stop" }` on edge line
    3. Parsing `A@{ icon: "fa:user", form: "square", label: "User" }` standalone node
    4. Parsing `A[fa:fa-twitter Twitter]` as rect with full label
    5. click line does not crash parser
    6. direction line inside subgraph does not crash parser
    7. shapeWrap for v11 shapes produces correct syntax
    8. Existing parallelogram-alt, trapezoid, trapezoid-alt parsing works
    9. parseNodeLabel on `A["`**bold**`"]` returns label="**bold**", markdown=true
    10. parseNodeLabel on `A("plain")` returns label="plain", markdown=false
    11. shapeWrap("**bold**", "rect", false, true) produces `` ["`**bold**`"] ``
    12. shapeWrap("normal", "rect", false, false) produces `["normal"]` (no backticks)

    Run tests to confirm they FAIL (RED), then implement in Steps 1-7, then confirm tests PASS (GREEN).
  </action>
  <verify>
    <automated>cd D:/code/MermaidStudio && npx vitest run src/lib/mermaid/__tests__/codeUtils.test.ts --reporter=verbose 2>&1 | tail -30</automated>
  </verify>
  <done>
    - NodeShape type includes all 12 new shape names (doc, docs, dbl-circ, cross-circ, bow-rect, flip-tri, curv-trap, manual-file, manual-input, procs, paper-tape, icon)
    - ParsedNode interface includes optional `markdown` boolean field
    - parseNodeLabel returns `markdown: boolean` in its result, detecting backtick-wrapped labels
    - parseNodeLabel recognizes @{ shape: "..." } and @{ icon: "..." } syntax
    - shapeWrap accepts markdown parameter and wraps labels in backticks when true
    - shapeWrap produces correct @{ ... } syntax for all new shapes
    - parseDiagram propagates markdown flag to ParsedNode objects
    - parseDiagram skips click and direction lines without crashing
    - All new tests pass and all existing tests still pass
  </done>
</task>

<task type="auto">
  <name>Task 2: Expand ShapeToolbar with missing shapes, SVG icons, and edge type selector</name>
  <files>src/components/visual/ShapeToolbar.tsx, src/i18n/locales/en.json, src/i18n/locales/fr.json</files>
  <action>
    **Step 1: Add missing existing shapes to ShapeToolbar SHAPES array**

    Add these 3 shapes that are in NodeShape type but missing from toolbar (add after the existing parallelogram entry):
    ```typescript
    { shape: 'parallelogram-alt', label: 'Slant Alt' },
    { shape: 'trapezoid',         label: 'Trapezoid' },
    { shape: 'trapezoid-alt',     label: 'Trapezoid Alt' },
    ```

    **Step 2: Add v11 shapes to SHAPES array**

    Add after the trapezoid-alt entries:
    ```typescript
    { shape: 'doc',         label: 'Document' },
    { shape: 'docs',        label: 'Multi-Doc' },
    { shape: 'dbl-circ',    label: 'Double Circle' },
    { shape: 'cross-circ',  label: 'Cross Circle' },
    { shape: 'bow-rect',    label: 'Stored Data' },
    { shape: 'flip-tri',    label: 'Flipped Tri' },
    { shape: 'curv-trap',   label: 'Display' },
    { shape: 'manual-input', label: 'Manual Input' },
    { shape: 'paper-tape',  label: 'Paper Tape' },
    { shape: 'procs',       label: 'Process' },
    ```

    Note: Do NOT add 'icon' to the toolbar -- icon nodes are created via code editing, not a toolbar button, since they require specifying the icon name.

    **Step 3: Add ShapePreview SVG icons for all new shapes**

    Extend the switch statement in ShapePreview component. Use SVG viewBox 28x20 consistent with existing icons:

    - `parallelogram-alt`: `<polygon points="2,3 22,3 26,17 6,17" {...props} />` (mirror of parallelogram)
    - `trapezoid`: `<polygon points="6,3 22,3 26,17 2,17" {...props} />` (wider bottom)
    - `trapezoid-alt`: `<polygon points="2,3 26,3 22,17 6,17" {...props} />` (wider top)
    - `doc`: rect with wavy bottom (use path with cubic bezier for wave effect): `<path d="M2,3 L26,3 L26,14 C22,17 18,11 14,14 C10,17 6,11 2,14 Z" {...props} />`
    - `docs`: two overlapping rects with wavy bottom: two offset paths
    - `dbl-circ`: two concentric circles: `<circle cx="14" cy="10" r="8" {...props} /><circle cx="14" cy="10" r="5.5" {...props} />`
    - `cross-circ`: circle with X inside: `<circle cx="14" cy="10" r="8" {...props} /><line x1="9" y1="5" x2="19" y2="15" {...props} /><line x1="19" y1="5" x2="9" y2="15" {...props} />`
    - `bow-rect`: rectangle with inward-bowing sides (use path): `<path d="M4,3 L24,3 L22,10 L24,17 L4,17 L6,10 Z" {...props} />`
    - `flip-tri`: inverted triangle: `<polygon points="2,3 26,3 14,17" {...props} />`
    - `curv-trap`: trapezoid with curved sides (use path with slight curves): `<path d="M6,3 Q14,5 22,3 L26,17 Q14,15 2,17 Z" {...props} />`
    - `manual-input`: rectangle with wedge top-left (like a torn edge): `<polygon points="4,6 8,3 26,3 26,17 4,17" {...props} />`
    - `paper-tape`: rectangle with wavy top and bottom: `<path d="M2,5 C6,3 10,7 14,5 C18,3 22,7 26,5 L26,15 C22,13 18,17 14,15 C10,13 6,17 2,15 Z" {...props} />`
    - `procs`: rect with double vertical lines (like subroutine but different): use rect + internal dividers
    - `icon`: fallback to rect for toolbar (icon shapes don't make sense as toolbar buttons, but include a default case)

    **Step 4: Add edge type selector UI to ShapeToolbar**

    The ARROW_RE in codeUtils.ts already correctly matches all Mermaid edge types (`-->`, `---`, `-.->`, `==>`, `x--x`, `.->`, `<-->`, `o--o`, `--o`, `o--`, `--|>`, `|>`, `~~~`). No regex changes are needed.

    However, the user currently has no way to select edge types from the toolbar. Add a small "Edge Type" section below the shapes section in ShapeToolbar:

    1. Define an EDGES array constant with the main edge types:
    ```typescript
    const EDGES = [
      { arrow: '-->', label: 'Arrow' },
      { arrow: '---', label: 'Line' },
      { arrow: '-.->', label: 'Dotted' },
      { arrow: '==>', label: 'Thick' },
      { arrow: '<-->', label: 'Bidirectional' },
      { arrow: 'o--o', label: 'Circle' },
      { arrow: 'x--x', label: 'Cross' },
    ];
    ```

    2. Render these as small clickable buttons below the shape grid. Each button shows the arrow string as its label (these are short and self-explanatory in Mermaid syntax).

    3. The edge type selector is display-only for now -- it shows available edge types. If the codebase has an existing mechanism for changing edge types (e.g., in a property panel or via code manipulation), wire the onClick to that. If not, the buttons just display the available types visually. Check the existing codebase for any edge-change handlers before implementing onClick.

    **Step 5: Add i18n translations for shape labels**

    In en.json, add under a new `"shapes"` key:
    ```json
    "shapes": {
      "box": "Box", "round": "Round", "stadium": "Stadium", "diamond": "Diamond",
      "circle": "Circle", "hexagon": "Hexagon", "cylinder": "Cylinder",
      "slant": "Slant", "slantAlt": "Slant Alt", "trapezoid": "Trapezoid",
      "trapezoidAlt": "Trapezoid Alt", "subroutine": "Subroutine", "flag": "Flag",
      "document": "Document", "multiDoc": "Multi-Doc", "doubleCircle": "Double Circle",
      "crossCircle": "Cross Circle", "storedData": "Stored Data",
      "flippedTri": "Flipped Tri", "display": "Display",
      "manualInput": "Manual Input", "paperTape": "Paper Tape",
      "process": "Process"
    }
    ```

    In fr.json, add the same `"shapes"` key with French translations:
    ```json
    "shapes": {
      "box": "Rectangle", "round": "Arrondi", "stadium": "Stade", "diamond": "Losange",
      "circle": "Cercle", "hexagon": "Hexagone", "cylinder": "Cylindre",
      "slant": "Oblique", "slantAlt": "Oblique Alt", "trapezoid": "Trapeze",
      "trapezoidAlt": "Trapeze Alt", "subroutine": "Sous-routine", "flag": "Drapeau",
      "document": "Document", "multiDoc": "Multi-Doc", "doubleCircle": "Double Cercle",
      "crossCircle": "Cercle Croix", "storedData": "Stockage",
      "flippedTri": "Triangle Inv.", "display": "Affichage",
      "manualInput": "Entree Manuelle", "paperTape": "Bande Papier",
      "process": "Processus"
    }
    ```

    IMPORTANT: Keep the hardcoded English labels in ShapeToolbar.tsx for now (consistent with current pattern). The i18n keys are added for future use but the toolbar currently uses hardcoded labels. Do NOT refactor the toolbar to use i18n -- that is out of scope.
  </action>
  <verify>
    <automated>cd D:/code/MermaidStudio && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - ShapeToolbar SHAPES array contains 10 original + 3 missing + 10 v11 = 23 shape entries
    - ShapePreview renders SVG icons for all 23 shapes without TypeScript errors
    - Edge type selector section shows 7 main edge types as clickable buttons
    - i18n files have shapes section in both en.json and fr.json
    - TypeScript compiles without errors
  </done>
</task>

<task type="auto">
  <name>Task 3: Final validation -- typecheck and full test suite pass</name>
  <files>src/lib/mermaid/__tests__/codeUtils.test.ts</files>
  <action>
    Run the full typecheck and test suite to verify everything works together:
    1. Run `npx tsc --noEmit` -- must have zero errors
    2. Run `npx vitest run` -- all tests must pass (existing + new)
    3. If any type errors, fix them. Common issues:
       - NodeShape type mismatch between codeUtils.ts and types.ts (types.ts re-exports from codeUtils so should auto-update)
       - Missing ShapePreview case for new shape (add default case fallback)
       - ParsedNode.markdown field causing type errors in consumers that use object spread
    4. If any test failures, fix them. Common issues:
       - Test expects specific shape string but parser returns different value
       - Test regex doesn't match the actual output format
       - Markdown backtick detection interfering with existing label parsing
  </action>
  <verify>
    <automated>cd D:/code/MermaidStudio && npx tsc --noEmit 2>&1 && npx vitest run 2>&1 | tail -15</automated>
  </verify>
  <done>
    - `npx tsc --noEmit` exits with code 0 (no type errors)
    - `npx vitest run` exits with code 0 (all tests pass)
    - All new shapes parse correctly, markdown labels round-trip, all existing functionality preserved
  </done>
</task>

</tasks>

<verification>
1. TypeScript compilation: `npx tsc --noEmit` passes with zero errors
2. All tests pass: `npx vitest run` shows all tests green
3. New v11 shapes are parseable: manual check that `A@{ shape: "doc", label: "Doc" }` is recognized
4. Markdown labels round-trip: `A["`**bold**`"]` parses with markdown=true and shapeWrap reproduces backticks
5. ShapeToolbar shows all shapes and edge type selector without rendering errors
6. Existing diagram parsing is not broken (all original tests pass)
</verification>

<success_criteria>
- NodeShape type has 25 values (13 original + 12 new)
- ParsedNode includes optional `markdown` boolean field
- parseNodeLabel returns `markdown` flag, detecting backtick-wrapped labels
- shapeWrap accepts markdown parameter and wraps labels in backticks when true
- SHAPE_PATTERNS or parseNodeLabel handles all 25 shapes
- shapeWrap handles all 25 shapes with correct Mermaid syntax output
- parseDiagram skips click and direction lines gracefully
- ShapeToolbar renders 23 shape buttons (all except 'icon' which is code-only)
- ShapeToolbar shows edge type selector with 7 main edge types
- All existing tests pass unchanged
- New test suite covers v11 shapes, icon nodes, markdown labels, click events, direction parsing
- Zero TypeScript compilation errors
</success_criteria>

<output>
After completion, create `.planning/quick/260327-iwh-add-all-missing-mermaid-flowchart-featur/260327-iwh-SUMMARY.md`
</output>
