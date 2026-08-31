// @ts-nocheck
// Knowledge-graph explorer, loaded as a Vite module (data imported directly).
import '../src/styles/globals.css' // DLS tokens + audited dark theme + Inter/Satoshi — single source, no hard-coded palette
import graph from '../graph.json'
import { gt, currentLang, setLang } from './i18n/graph-i18n'
const GRAPH = graph as any

// i18n helpers — labels come from graph.* in dev/i18n/*.json; TYPES/REL below stay
// the source for colour/family/direction, with the English text as a safe default.
const typeLabel = (t: string) => gt('graph.type.' + t, { defaultValue: (TYPES[t]?.label ?? t) })
const familyLabel = (f: string) => gt('graph.family.' + f, { defaultValue: f })
const srcLabel = (t: string) => gt('graph.src.' + t, { defaultValue: (TYPES[t]?.src ?? '') })
const relName = (type: string, out: boolean) =>
  gt('graph.rel.' + type + '.' + (out ? 'out' : 'in'), { defaultValue: ((REL[type] || {})[out ? 'out' : 'in'] || type) })

// lucide icons only (no mixed icon set): raw path data → an inline SVG string
const IC: Record<string, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  externalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
}
const lucide = (name: string, size = 15) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[name]}</svg>`

// Node families — the ordered grouping shared by the filter chips AND the legend
const FAMILY_ORDER = ['Identity', 'Governance', 'Reasoning', 'Renders on screen', 'Templates', 'Patterns', 'Raw token values', 'External', 'Accessibility', 'Other']

// Categorical palette drawn from a Japanese ukiyo-e woodblock print (bonsai pine on a
// sea cliff under a red sun). Each node family borrows a colour eyedropped from a region
// of that painting — see the guide's "Why these colours?" note. `src` names the region.
// (The DLS *product* is grayscale; this explorer is an internal wayfinding tool, so it may
//  use hue to separate the node families — nothing here ships as a token.)
const TYPES: Record<string, any> = {
  'brand': { label: 'Brand', light: '#e8431c', dark: '#ff6b47', family: 'Identity', src: 'the setting sun' },
  'rule': { label: 'Rule', light: '#c0341a', dark: '#f26a4e', ring: true, family: 'Governance', src: "the sun's deep-red band" },
  'component': { label: 'Component', light: '#2e5f86', dark: '#6ba0cc', family: 'Renders on screen', src: 'the ocean waves' },
  'component-2one': { label: '2one-only', light: '#16324f', dark: '#4e80b0', family: 'Renders on screen', src: 'the bonsai pine' },
  'template-block': { label: 'Block', light: '#e8822f', dark: '#f4a65c', family: 'Templates', src: 'the sunset clouds' },
  'template-chart': { label: 'Chart', light: '#c98a3f', dark: '#e3b079', family: 'Templates', src: 'the pale horizon glow' },
  'token-color': { label: 'Colour token', light: '#8a5a2b', dark: '#c08a50', family: 'Raw token values', src: 'the cliff rock' },
  'ramp': { label: 'Ramp step', light: '#5a3d28', dark: '#9a6e4a', family: 'Raw token values', src: "the rock's shadow" },
  'token-radius': { label: 'Radius', light: '#5a87a6', dark: '#8fb4ce', family: 'Raw token values', src: 'the mid-tone swell' },
  'token-type': { label: 'Type', light: '#6e97a3', dark: '#a6c4cd', family: 'Raw token values', src: 'the sea-foam' },
  'package': { label: 'Package', light: '#77736c', dark: '#a8a199', family: 'External', src: 'the weathered stone' },
  'contrast': { label: 'Contrast', light: '#15803d', dark: '#4ade80', semantic: true, family: 'Accessibility', src: 'kept green — it flags pass / fail' },
  // Decision / reasoning layer — the semantic graph the AI reasons over. These extend
  // the painting palette (they are not eyedropped from it) so the reasoning nodes are
  // distinguishable rather than an undifferentiated grey.
  'intent': { label: 'Intent', light: '#caa63d', dark: '#e3c25e', family: 'Reasoning', src: "the user's goal" },
  'context': { label: 'Context', light: '#b5766a', dark: '#d29a8e', family: 'Reasoning', src: 'when it applies' },
  'state': { label: 'State', light: '#6f6f9c', dark: '#9a9ad0', family: 'Reasoning', src: 'interaction state' },
  'pattern': { label: 'Pattern', light: '#2f8f83', dark: '#5ec4b6', family: 'Patterns', src: 'a composed solution' },
  'variant': { label: 'Variant', light: '#4d7ea8', dark: '#8bb5d6', family: 'Renders on screen', src: 'a component variant' },
  'a11y': { label: 'Requirement', light: '#15803d', dark: '#4ade80', family: 'Accessibility', src: 'an a11y requirement' },
}
const REL: Record<string, any> = {
  composed_of: { out: 'Composed of', in: 'Used by' }, uses: { out: 'Uses', in: 'Used by' },
  derived_from: { out: 'Derived from', in: 'Source of' }, governed_by: { out: 'Governed by', in: 'Governs' },
  has_contrast: { out: 'Contrast', in: 'Contrast of' }, embodies: { out: 'Embodies', in: 'Embodied by' },
  serves: { out: 'Serves', in: 'Served by' }, depends_on: { out: 'Depends on', in: 'Depended on by' },
  // decision / reasoning edges (the semantic layer)
  preferred_for: { out: 'Preferred for', in: 'Preferred choice for' },
  appropriate_for: { out: 'Appropriate for', in: 'Appropriate use' },
  inappropriate_for: { out: 'Inappropriate for', in: 'Inappropriate use' },
  preferred_over: { out: 'Preferred over', in: 'Superseded by' },
  alternative_to: { out: 'Alternative to', in: 'Alternative' },
  forbidden_with: { out: 'Forbidden with', in: 'Forbidden with' },
  requires: { out: 'Requires', in: 'Required by' },
  supports_state: { out: 'Supports state', in: 'State of' },
  preferred_composition: { out: 'Preferred composition', in: 'Composed into' },
  realized_by: { out: 'Realized by', in: 'Realizes' },
  demonstrates: { out: 'Demonstrates', in: 'Demonstrated by' },
  applies_when: { out: 'Applies when', in: 'Applies' },
  overrides: { out: 'Overrides', in: 'Overridden by' },
  specializes: { out: 'Specializes', in: 'Specialized by' },
}

const root = document.documentElement
const cvarv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim()
const theme = () => (root.classList.contains('dark') ? 'dark' : 'light') // DLS drives dark via the .dark class
const nodeColor = (t: string) => { const m = TYPES[t] || { light: '#888', dark: '#888' }; return theme() === 'dark' ? m.dark : m.light }
const el = (tag: string, cls?: string) => { const e = document.createElement(tag); if (cls) e.className = cls; return e }
// Paint a legend/chip swatch so it matches how the node renders on the canvas:
// ring types (Rule) are a hollow ring (transparent + coloured border), everything
// else is a solid fill. Keeps the key and the graph in sync.
const paintSwatch = (dot: any, t: string) => {
  const m = TYPES[t] || {}
  if (m.ring) { dot.style.background = 'transparent'; dot.style.border = '2px solid ' + nodeColor(t) }
  else { dot.style.background = m.semantic ? cvarv('--ok') : nodeColor(t); dot.style.border = '0' }
}

const nodes = GRAPH.nodes.map((n: any) => ({ ...n }))
const byId = new Map(nodes.map((n: any) => [n.id, n]))
const edges = GRAPH.edges.filter((e: any) => byId.has(e.source) && byId.has(e.target))
  .map((e: any) => ({ ...e, s: byId.get(e.source), t: byId.get(e.target) }))
const deg = new Map(); nodes.forEach((n: any) => deg.set(n.id, 0))
edges.forEach((e: any) => { deg.set(e.source, deg.get(e.source) + 1); deg.set(e.target, deg.get(e.target) + 1) })
nodes.forEach((n: any) => { n.r = 4 + Math.sqrt(deg.get(n.id)) * 1.7; n.deg = deg.get(n.id) })
const adj = new Map(nodes.map((n: any) => [n.id, new Set()]))
edges.forEach((e: any) => { adj.get(e.source).add(e.target); adj.get(e.target).add(e.source) })

let W = innerWidth, H = innerHeight
nodes.forEach((n: any, i: number) => { const a = (i / nodes.length) * Math.PI * 2; n.x = Math.cos(a) * 260 + (Math.random() - 0.5) * 40; n.y = Math.sin(a) * 260 + (Math.random() - 0.5) * 40; n.vx = 0; n.vy = 0 })

let alpha = 1
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
let dragNode: any = null
function tick() {
  const rep = 2200, spring = 0.02, link = 46, grav = 0.015
  for (let i = 0; i < nodes.length; i++) { const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j]
      const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy || 0.01; if (d2 > 90000) continue
      const d = Math.sqrt(d2), f = rep / d2, fx = dx / d * f, fy = dy / d * f
      a.vx += fx * alpha; a.vy += fy * alpha; b.vx -= fx * alpha; b.vy -= fy * alpha
    }
    a.vx -= a.x * grav * alpha; a.vy -= a.y * grav * alpha
  }
  edges.forEach((e: any) => { const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01, f = (d - link) * spring, fx = dx / d * f, fy = dy / d * f
    e.s.vx += fx * alpha; e.s.vy += fy * alpha; e.t.vx -= fx * alpha; e.t.vy -= fy * alpha })
  nodes.forEach((n: any) => { if (n === dragNode) return; n.vx *= 0.85; n.vy *= 0.85; n.x += n.vx; n.y += n.vy })
  alpha *= 0.994; if (alpha < 0.03) alpha = 0.03
}

let scale = 1, ox = 0, oy = 0
const cv = document.getElementById('c') as HTMLCanvasElement, ctx = cv.getContext('2d')!
const DPR = Math.min(devicePixelRatio || 1, 2)
function resize() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR }
addEventListener('resize', resize)

let selected: any = null, hover: any = null
const hidden = new Set<string>()          // hidden by node TYPE (Graph Controls filter)
const hiddenComp = new Set<string>()      // hidden by individual component (All Components filter)
const nodeHidden = (n: any) => hidden.has(n.type) || hiddenComp.has(n.id)
const edgeHidden = (e: any) => nodeHidden(e.s) || nodeHidden(e.t)
const screenX = (x: number) => x * scale + W / 2 + ox
const screenY = (y: number) => y * scale + H / 2 + oy
const worldX = (sx: number) => (sx - W / 2 - ox) / scale
const worldY = (sy: number) => (sy - H / 2 - oy) / scale

function draw() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H)
  const neigh = selected ? adj.get(selected.id) : null
  ctx.lineWidth = 1
  edges.forEach((e: any) => {
    if (edgeHidden(e)) return
    const on = selected && (e.source === selected.id || e.target === selected.id)
    ctx.globalAlpha = selected ? (on ? 0.9 : 0.06) : 0.35
    ctx.strokeStyle = on ? cvarv('--edge-hi') : cvarv('--edge')
    const sx = screenX(e.s.x), sy = screenY(e.s.y), tx = screenX(e.t.x), ty = screenY(e.t.y)
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke()
    // Direction: draw an arrowhead near the TARGET end. The edge reads source → target
    // = "user → used", so the arrow always points at the thing being used. On a selected
    // node: arrows pointing OUT of it = what it uses; arrows pointing INTO it = who uses it.
    if (on) {
      const ang = Math.atan2(ty - sy, tx - sx)
      const tr = e.t.r * Math.min(scale, 1.4) + 2.5           // sit just outside the target node
      const ax = tx - Math.cos(ang) * tr, ay = ty - Math.sin(ang) * tr
      const h = 7, w = 0.42
      ctx.fillStyle = cvarv('--edge-hi')
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(ax - Math.cos(ang - w) * h, ay - Math.sin(ang - w) * h)
      ctx.lineTo(ax - Math.cos(ang + w) * h, ay - Math.sin(ang + w) * h)
      ctx.closePath(); ctx.fill()
    }
  })
  ctx.globalAlpha = 1
  nodes.forEach((n: any) => {
    if (nodeHidden(n)) return
    const px = screenX(n.x), py = screenY(n.y), r = n.r * Math.min(scale, 1.4)
    const dim = selected && n !== selected && !(neigh && neigh.has(n.id))
    ctx.globalAlpha = dim ? 0.15 : 1
    const meta = TYPES[n.type] || {}
    ctx.beginPath(); ctx.arc(px, py, r, 0, 7)
    if (meta.semantic) ctx.fillStyle = n.passes === false ? cvarv('--bad') : cvarv('--ok')
    else ctx.fillStyle = nodeColor(n.type)
    if (meta.ring) ctx.fillStyle = cvarv('--bg')
    ctx.fill()
    ctx.lineWidth = n === selected ? 2.5 : 1.2
    ctx.strokeStyle = n === selected ? cvarv('--sel') : (meta.ring ? nodeColor(n.type) : cvarv('--node-stroke'))
    ctx.stroke()
    if (!dim && (n === selected || n === hover || (neigh && neigh.has(n.id)) || n.deg >= 14)) {
      ctx.fillStyle = cvarv('--ink'); ctx.font = (n === selected ? '600 12px' : '500 10.5px') + ' "Inter Variable",Inter,system-ui,sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(n.label, px, py - r - 5)
    }
  })
  ctx.globalAlpha = 1
}
function loop() { if (!reduced) { tick(); tick() } draw(); requestAnimationFrame(loop) }

function pick(sx: number, sy: number) { let best: any = null, bd = 1e9; nodes.forEach((n: any) => { if (nodeHidden(n)) return
  const dx = screenX(n.x) - sx, dy = screenY(n.y) - sy, d = dx * dx + dy * dy, rr = Math.pow(n.r * Math.min(scale, 1.4) + 6, 2)
  if (d < rr && d < bd) { bd = d; best = n } }); return best }
let panning = false, px0 = 0, py0 = 0, moved = false
cv.addEventListener('mousedown', (e) => { const n = pick(e.offsetX, e.offsetY); moved = false
  if (n) dragNode = n; else { panning = true; cv.classList.add('drag') } px0 = e.offsetX; py0 = e.offsetY })
addEventListener('mousemove', (e) => {
  const rect = cv.getBoundingClientRect(), sx = e.clientX - rect.left, sy = e.clientY - rect.top
  if (dragNode) { dragNode.x = worldX(sx); dragNode.y = worldY(sy); dragNode.vx = dragNode.vy = 0; alpha = Math.max(alpha, 0.2); moved = true }
  else if (panning) { ox += sx - px0; oy += sy - py0; px0 = sx; py0 = sy; moved = true }
  else { hover = pick(sx, sy); const tip = document.getElementById('tip')!
    if (hover) { tip.style.opacity = '1'; tip.style.left = sx + 'px'; tip.style.top = sy + 'px'; tip.textContent = hover.label; cv.style.cursor = 'pointer' }
    else { tip.style.opacity = '0'; cv.style.cursor = '' } }
})
addEventListener('mouseup', () => { if (dragNode && !moved) select(dragNode); else if (panning && !moved) select(null); dragNode = null; panning = false; cv.classList.remove('drag') })
cv.addEventListener('wheel', (e) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.12 : 0.89, rect = cv.getBoundingClientRect(),
  mx = e.clientX - rect.left - W / 2, my = e.clientY - rect.top - H / 2; ox = mx - (mx - ox) * f; oy = my - (my - oy) * f; scale = Math.max(0.2, Math.min(4, scale * f)) }, { passive: false })

function centerOn(n: any) { ox = -n.x * scale; oy = -n.y * scale }

function select(n: any) {
  selected = n
  // keep the All Components list in sync with whatever is selected (DOM queried at
  // call-time, so it is safe even though the list is built later during init)
  Array.prototype.forEach.call(document.querySelectorAll('.comp-item'), (it: any) => it.classList.toggle('sel', !!n && it.dataset.id === n.id))
  // sync selection to the URL so a node is shareable / deep-linkable from the catalog
  history.replaceState(null, '', n ? '?node=' + encodeURIComponent(n.id) : location.pathname)
  const panel = document.getElementById('panel')!; panel.replaceChildren()
  if (!n) { panel.className = 'empty'; panel.textContent = gt('graph.panel.empty'); return }
  panel.className = ''
  const meta = TYPES[n.type] || {}
  const col = meta.semantic ? (n.passes === false ? cvarv('--bad') : cvarv('--ok')) : nodeColor(n.type)
  const trow = el('div', 'n-type'); const d0 = el('span', 'dot'); d0.style.background = col; trow.appendChild(d0); trow.appendChild(document.createTextNode(typeLabel(n.type))); panel.appendChild(trow)
  const lab = el('div', 'n-label'); lab.textContent = n.label; panel.appendChild(lab)
  const m = el('div', 'n-meta')
  const chip = (txt: string, swatch?: string) => { const s = el('span'); if (swatch) { const sw = el('span', 'sw'); sw.style.background = swatch; s.appendChild(sw) } s.appendChild(document.createTextNode(txt)); m.appendChild(s) }
  if (n.hex) chip(n.hex, n.hex)
  if (n.value) chip(n.value)
  if (n.px) chip(n.px + 'px')
  if (n.apca_lc !== undefined) chip('APCA Lc ' + n.apca_lc + ' · WCAG ' + n.wcag_ratio + ':1 · ' + (n.passes ? gt('graph.panel.pass') : gt('graph.panel.fail')))
  if (n.path) chip(n.path)
  chip(n.deg + ' ' + gt(n.deg === 1 ? 'graph.panel.connectionOne' : 'graph.panel.connectionOther'))
  panel.appendChild(m)
  // back-link to the live catalog for components (closes the app ↔ graph loop)
  if (n.type === 'component' || n.type === 'component-2one') {
    const a = el('a') as HTMLAnchorElement
    a.href = '/#index'; a.innerHTML = gt('graph.panel.viewInCatalog') + ' ' + lucide('externalLink', 13)
    a.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 0 12px;font-family:var(--sans);font-size:12px;color:var(--ink-2);text-decoration:none;border:1px solid var(--line);border-radius:var(--r-pill);padding:6px 12px'
    panel.appendChild(a)
  }
  const groups: Record<string, any[]> = {}
  const outNames = new Set<string>()
  edges.forEach((e: any) => { if (e.source !== n.id && e.target !== n.id) return; const out = e.source === n.id, other = out ? e.t : e.s
    const name = relName(e.type, out); if (out) outNames.add(name); (groups[name] = groups[name] || []).push(other) })
  if (Object.keys(groups).length) {
    const cap = el('div', 'rel-cap')
    cap.textContent = gt('graph.panel.relCap')
    panel.appendChild(cap)
  }
  // Show outgoing (this element → others) first, then incoming — so "what it uses" and
  // "what uses it" never blur together. A direction tag makes each group unambiguous.
  Object.keys(groups).sort((a, b) => (outNames.has(b) ? 1 : 0) - (outNames.has(a) ? 1 : 0) || groups[b].length - groups[a].length).forEach((name) => {
    const isOut = outNames.has(name)
    const arr = groups[name]; const rel = el('div', 'rel'); const h = el('h4')
    const tag = el('span', 'dir ' + (isOut ? 'out' : 'in')); tag.innerHTML = lucide(isOut ? 'arrowRight' : 'arrowLeft', 12)
    tag.setAttribute('aria-label', isOut ? gt('graph.dir.outAria') : gt('graph.dir.inAria'))
    tag.title = isOut ? gt('graph.dir.outTitle') : gt('graph.dir.inTitle')
    h.appendChild(tag); h.appendChild(document.createTextNode(name))
    const cnt = el('span', 'cnt'); cnt.textContent = String(arr.length); h.appendChild(cnt); rel.appendChild(h)
    const ul = el('ul'); arr.forEach((o: any) => { const li = el('li'); li.textContent = o.label; li.addEventListener('click', () => { select(o); centerOn(o) }); ul.appendChild(li) })
    rel.appendChild(ul); panel.appendChild(rel)
  })
}

const chipsEl = document.getElementById('chips')!
const types = Array.from(new Set(nodes.map((n: any) => n.type))) as string[]
const chipByType = new Map<string, HTMLElement>()
const makeChip = (t: string) => {
  const chip = el('div', 'chip'); chip.dataset.t = t
  const dot = el('span', 'dot'); paintSwatch(dot, t)
  chip.appendChild(dot); chip.appendChild(document.createTextNode(typeLabel(t)))
  chip.addEventListener('click', () => { if (hidden.has(t)) { hidden.delete(t); chip.classList.remove('off') } else { hidden.add(t); chip.classList.add('off') } })
  chipByType.set(t, chip); return chip
}
// Group the type filters by family — same grouping as the Colors Inspiration legend
const chipFamilies: Record<string, string[]> = {}
types.forEach((t) => { const f = (TYPES[t] || {}).family || 'Other'; (chipFamilies[f] = chipFamilies[f] || []).push(t) })
FAMILY_ORDER.filter((f) => chipFamilies[f]).forEach((f) => {
  const grp = el('div', 'chip-fam'); const ft = el('div', 'chip-fam-title'); ft.textContent = familyLabel(f); grp.appendChild(ft)
  const row = el('div', 'chip-row')
  chipFamilies[f].sort((a, b) => typeLabel(a).localeCompare(typeLabel(b))).forEach((t) => row.appendChild(makeChip(t)))
  grp.appendChild(row); chipsEl.appendChild(grp)
})

// Select all / Deselect all — toggle every type filter at once
document.getElementById('selall')!.addEventListener('click', () => {
  hidden.clear(); chipByType.forEach((chip) => chip.classList.remove('off'))
})
document.getElementById('deselall')!.addEventListener('click', () => {
  types.forEach((t) => hidden.add(t)); chipByType.forEach((chip) => chip.classList.add('off')); select(null)
})

// Collapsible rail panels (Selection, Inspiration) — click a header to fold/unfold
Array.prototype.forEach.call(document.querySelectorAll('.pnl-head'), (head: any) => {
  head.addEventListener('click', () => {
    const pnl = head.closest('.pnl'); const open = !pnl.classList.toggle('collapsed')
    head.setAttribute('aria-expanded', String(open))
  })
})

// All Components — an index of every component that jumps to its node in the graph
// (the reverse of the per-node "View in catalog" link: catalog list → graph position)
const compListEl = document.getElementById('comp-list')!
const compSearch = document.getElementById('comp-search') as HTMLInputElement
const compNodes = nodes
  .filter((n: any) => n.type === 'component' || n.type === 'component-2one')
  .sort((a: any, b: any) => a.label.localeCompare(b.label))
document.getElementById('comp-count')!.textContent = String(compNodes.length)
// Each row is a filter (checkbox = show/hide on the canvas) AND a jump (label →
// select + centre the node). All / None toggle every component's visibility at once
// — the DLS rule "filters offer Select all + Deselect all" (rule:filter-select-all).
const compItems: { node: any; row: HTMLElement; box: HTMLInputElement }[] = []
const setCompVisible = (n: any, box: HTMLInputElement, row: HTMLElement, vis: boolean) => {
  box.checked = vis
  if (vis) hiddenComp.delete(n.id); else hiddenComp.add(n.id)
  row.classList.toggle('off', !vis)
}
compNodes.forEach((n: any) => {
  const row = el('div', 'comp-item'); row.dataset.id = n.id
  const box = el('input') as HTMLInputElement; box.type = 'checkbox'; box.className = 'comp-check'; box.checked = true
  box.dataset.type = n.type; box.style.accentColor = nodeColor(n.type) // the checkbox carries the node's colour
  box.setAttribute('aria-label', gt('graph.components.showAria', { label: n.label }))
  box.addEventListener('change', () => setCompVisible(n, box, row, box.checked))
  const jump = el('button', 'comp-jump'); jump.title = gt('graph.components.jumpTitle', { label: n.label })
  const name = el('span', 'comp-name'); name.textContent = n.label
  jump.appendChild(name)
  if (n.type === 'component-2one') { const tag = el('span', 'ctag'); tag.textContent = '2one'; jump.appendChild(tag) }
  // Jumping to a hidden component reveals it first, so the focus is never invisible.
  jump.addEventListener('click', () => { if (hiddenComp.has(n.id)) setCompVisible(n, box, row, true); select(n); centerOn(n); scale = Math.max(scale, 1.3); alpha = Math.max(alpha, 0.5) })
  row.appendChild(box); row.appendChild(jump)
  compListEl.appendChild(row); compItems.push({ node: n, row, box })
})
const setAllComp = (vis: boolean) => compItems.forEach(({ node, row, box }) => setCompVisible(node, box, row, vis))
document.getElementById('comp-all')!.addEventListener('click', () => { setAllComp(true); alpha = Math.max(alpha, 0.3) })
document.getElementById('comp-none')!.addEventListener('click', () => setAllComp(false))
compSearch.addEventListener('input', () => {
  const q = compSearch.value.trim().toLowerCase()
  let shown = 0
  compItems.forEach(({ node, row }) => { const hit = !q || node.label.toLowerCase().indexOf(q) >= 0; row.classList.toggle('hidden', !hit); if (hit) shown++ })
  document.getElementById('comp-count')!.textContent = q ? shown + '/' + compItems.length : String(compItems.length)
})

// Inspiration image lives at dev/assets/painting.avif — degrade gracefully if absent
const paintImg = document.getElementById('paint-img') as HTMLImageElement | null
const paintMissing = () => {
  const fig = document.getElementById('paint')!
  fig.classList.add('missing')
  fig.textContent = 'Add the painting at dev/assets/painting.avif to show it here.'
}
if (paintImg) {
  paintImg.addEventListener('error', paintMissing)
  // the error event may have already fired before this handler attached — catch that case
  if (paintImg.complete && paintImg.naturalWidth === 0) paintMissing()
}

// Build the Inspiration colour legend from the same TYPES map (single source of truth)
const guideLegend = document.getElementById('guide-legend')!
const families: Record<string, string[]> = {}
types.forEach((t) => { const f = (TYPES[t] || {}).family || 'Other'; (families[f] = families[f] || []).push(t) })
FAMILY_ORDER.filter((f) => families[f]).forEach((f) => {
  const grp = el('div', 'g-fam'); const ft = el('div', 'g-fam-title'); ft.textContent = familyLabel(f); grp.appendChild(ft)
  families[f].forEach((t) => {
    const meta = TYPES[t] || { label: t }; const row = el('div', 'g-row'); row.dataset.t = t
    const dot = el('span', 'g-dot'); paintSwatch(dot, t)
    const name = el('span', 'g-name'); name.textContent = typeLabel(t)
    row.appendChild(dot); row.appendChild(name)
    if (meta.src) { const s = el('span', 'g-src'); s.textContent = srcLabel(t); row.appendChild(s) }
    grp.appendChild(row)
  })
  guideLegend.appendChild(grp)
})

document.getElementById('search')!.addEventListener('input', (e: any) => {
  const q = e.target.value.trim().toLowerCase(); if (!q) return
  const n = nodes.find((n: any) => n.label.toLowerCase().indexOf(q) >= 0)
  if (n) { select(n); centerOn(n); scale = Math.max(scale, 1) }
})
document.getElementById('reset')!.addEventListener('click', () => { scale = 1; ox = 0; oy = 0; select(null); alpha = 0.6 })

const tb = document.getElementById('theme')!
function setT(t: string) { root.classList.toggle('dark', t === 'dark'); try { localStorage.setItem('theme', t) } catch {} const isDark = t === 'dark'; tb.innerHTML = lucide(isDark ? 'sun' : 'moon') + '<span>' + (isDark ? gt('common.light') : gt('common.dark')) + '</span>'
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), (c: any) => paintSwatch(c.querySelector('.dot'), c.dataset.t))
  Array.prototype.forEach.call(document.querySelectorAll('.g-row'), (row: any) => { const t2 = row.dataset.t; if (t2) paintSwatch(row.querySelector('.g-dot'), t2) })
  Array.prototype.forEach.call(document.querySelectorAll('.comp-check'), (b: any) => { if (b.dataset.type) b.style.accentColor = nodeColor(b.dataset.type) })
  if (selected) select(selected) }
// Default to LIGHT. Honour a theme the app pages persisted (localStorage 'theme',
// written by the ThemeProvider) so navigating from a dark app page keeps dark — but
// a first, standalone visit always opens light (never the OS dark preference).
setT(localStorage.getItem('theme') || 'light')
tb.addEventListener('click', () => setT(theme() === 'dark' ? 'light' : 'dark'))

// Language toggle — mirrors the React LanguageToggle. Two languages, so it flips and
// reloads (simplest for a plain-TS page that builds much of its DOM up front).
const lb = document.getElementById('lang')!
const lang = currentLang()
const nextLang = lang === 'fr' ? 'en' : 'fr'
lb.innerHTML = lucide('globe') + '<span>' + lang.toUpperCase() + '</span>'
lb.setAttribute('aria-label', gt('common.switchLanguageTo', { lang: nextLang === 'fr' ? 'Français' : 'English' }))
lb.addEventListener('click', () => { setLang(nextLang); location.reload() })

document.documentElement.lang = lang
tb.setAttribute('aria-label', gt('graph.themeAria'))
document.getElementById('stats')!.textContent = gt('graph.stats', { nodes: GRAPH.stats.nodes, edges: GRAPH.stats.edges })
translateStatic()

// Localise the static HTML chrome (nav, panel headers, placeholders, buttons, hint).
function translateStatic() {
  const set = (sel: string, text: string) => { const e = document.querySelector(sel); if (e) e.textContent = text }
  const setFirstText = (sel: string, text: string) => { const e = document.querySelector(sel); if (e && e.firstChild) e.firstChild.nodeValue = text }
  const ph = (sel: string, text: string) => { const e = document.querySelector(sel) as HTMLInputElement | null; if (e) e.placeholder = text }
  // Global nav (mirrors dev/global-nav.tsx). `.topnav a` order: the flat
  // destinations, then the three links inside the Help menu.
  const navKeys = ['nav.overview', 'nav.components', 'nav.graph', 'nav.dls', 'overview.sidebar.faq', 'overview.sidebar.support']
  document.querySelectorAll('.topnav-flat a').forEach((a, i) => { if (navKeys[i]) a.textContent = gt(navKeys[i]) })
  set('.nav-help summary span', gt('common.help'))
  // Mobile menu (same order as navKeys): label its links + the current-page trigger.
  document.querySelectorAll('.nav-menu .nav-help-menu a').forEach((a, i) => { if (navKeys[i]) a.textContent = gt(navKeys[i]) })
  set('.nav-menu-label', gt('nav.graph'))
  const brand = document.querySelector('.brandlink'); if (brand) brand.setAttribute('aria-label', gt('common.dashboardAria'))
  // Inspiration panel
  set('#pnl-inspiration .pnl-head span', gt('graph.inspiration.title'))
  set('#paint figcaption', gt('graph.inspiration.caption'))
  const insp = document.querySelector('.insp-text'); if (insp) insp.innerHTML = gt('graph.inspiration.body')
  set('#pnl-inspiration .pnl-label', gt('graph.inspiration.legendLabel'))
  // All Components panel
  set('#pnl-components .pnl-head span', gt('graph.components.title'))
  ph('#comp-search', gt('graph.components.filter'))
  setFirstText('#pnl-components .pnl-label', gt('graph.components.showOnCanvas') + ' ')
  set('#comp-all', gt('graph.all')); set('#comp-none', gt('graph.none'))
  // Graph Controls panel
  set('#pnl-selection .pnl-head span', gt('graph.controls.title'))
  ph('#search', gt('graph.controls.find'))
  setFirstText('#pnl-selection .pnl-label', gt('graph.controls.filterByType') + ' ')
  set('#selall', gt('graph.all')); set('#deselall', gt('graph.none'))
  set('#reset', gt('graph.controls.resetView'))
  set('.pnl-cues', gt('graph.controls.cues'))
  // Canvas overlays
  const panelEl = document.getElementById('panel'); if (panelEl && panelEl.classList.contains('empty')) panelEl.textContent = gt('graph.panel.empty')
  set('.hint', gt('graph.hint'))
}

// Help menu: close the <details> disclosure when clicking outside it (mirrors
// the React DropdownMenu's dismiss-on-outside-click).
document.querySelectorAll('.nav-help').forEach((el) => {
  const d = el as HTMLDetailsElement
  document.addEventListener('click', (e) => { if (d.open && !d.contains(e.target as Node)) d.open = false })
})

// deep-link: /graph.html?node=<id> opens focused on that node (from the catalog)
const initId = new URLSearchParams(location.search).get('node')
if (initId && byId.has(initId)) { const n0 = byId.get(initId); select(n0); centerOn(n0); scale = Math.max(scale, 1.2); alpha = 0.5 }

resize(); loop()
