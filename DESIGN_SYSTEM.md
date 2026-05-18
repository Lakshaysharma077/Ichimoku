# ICHIMOKU EDGE — DESIGN SYSTEM REFERENCE

| Desktop Version | Edge | Light | Dark | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Page level standard (HEX code colour)** | | | | |
| Page background color | `#0c101f` | `#ffffff` | `#0e0e0e` | Foundation of each mode |
| Card / Box / table background color | `#111627` | `#f7f7f5` | `#161616` | For features box, cards, pricing box, faq, table |
| Table background colour | `#161d30` | `#efefec` | `#1e1e1e` | Deepest layer for tables |
| Chart background color | `#0c101f` | `#ffffff` | `#0e0e0e` | Screen / Multiply blend modes |
| Card / box / table border colour | `rgba(251,225,120,0.15)` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.08)` | |
| Chart border color | `rgba(251,225,120,0.15)` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.08)` | |
| Divider line colour | `rgba(251,225,120,0.15)` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.08)` | Line between FAQ, or text line divider (if any) |
| Overlay colour | `rgba(12,16,31,0.9)` | `rgba(255,255,255,0.9)` | `rgba(14,14,14,0.9)` | Japanese caracter or pictures aimed in the background |
| **Typography standards size** | | | | |
| Hero titles | 56 px | 56 px | 56 px | Main title on every page |
| Hero subtitle | 20 px | 20 px | 20 px | Sub title (if any) |
| Section title 1 | 48 px | 48 px | 48 px | |
| Section title 2 | 30 px | 30 px | 30 px | |
| Body text | 16 px | 16 px | 16 px | Main reading text |
| Small text | 14 px | 14 px | 14 px | Captions, labels, footnotes |
| Table text first line | 14 px (Bold) | 14 px (Bold) | 14 px (Bold) | Header rows / (columns) |
| Table text all other lines | 14 px | 14 px | 14 px | Every other raws |
| Chart text / label | 12 px | 12 px | 12 px | Numbers, explanations, line names, candle notes |
| Hover text | 14 px | 14 px | 14 px | |
| **Text colours standards** | | | | |
| Hero titles colour | `#fbe178` | `#0a0a0a` | `#f0f0ee` | |
| Hero subtitle colour | `#AFA27A` | `#3a3a3a` | `#b0b0a8` | |
| Section title 1 colour | `#fbe178` | `#0a0a0a` | `#f0f0ee` | |
| Section title 2 colour | `#fbe178` | `#0a0a0a` | `#f0f0ee` | |
| Body text colour | `#AFA27A` | `#3a3a3a` | `#b0b0a8` | |
| Small text colour | `#8a7a3a` | `#888880` | `#606058` | |
| Table text first line colour | `#fbe178` | `#0a0a0a` | `#f0f0ee` | |
| Table text all other lines colour | `#AFA27A` | `#3a3a3a` | `#b0b0a8` | |
| Chart text / label colour | `#8a7a3a` | `#888880` | `#606058` | |
| Hover text colour | `#fbe178` | `#0a0a0a` | `#f0f0ee` | Usually with brightness-110 |
| Button border colour for login | `rgba(251,225,120,0.8)` | `rgba(10,10,10,0.8)` | `rgba(240,240,238,0.8)` | |
| Button border colour for small navigation icon | `rgba(251,225,120,0.4)` | `rgba(10,10,10,0.4)` | `rgba(240,240,238,0.4)` | |
| | | | | |
| Chart size | Max 500kb per chart | Max 500kb per chart | Max 500kb per chart | |
| | | | | |
| Spacing ? Between lines and text and title ? | 24px to 48px | 24px to 48px | 24px to 48px | |

---

## SEMANTIC TYPOGRAPHY UTILITY TOKENS

To ensure absolute global consistency across Edge/Signature, Light, and Dark modes without hardcoding HEX values or using arbitrary Tailwind colors, always apply these semantic utility classes:

| Class Token | Semantic Target | Edge / Signature Color | Light Mode Color | Dark Mode Color | Description / Examples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.txt-heading` | Dominant Titles & Headers | `#fbe178` (Gold) | `#0a0a0a` (Pure dark) | `#f0f0ee` (Bright off-white) | Instantly stands out with maximum hierarchy contrast. |
| `.txt-body` | Standard Body Copy & Descriptions | `#AFA27A` (Muted Gold) | `#3a3a3a` (Soft grey) | `#b0b0a8` (Muted off-white) | Used for primary reading sections and paragraphs. |
| `.txt-muted` | Softer Secondary & Card Texts | `#8a7a3a` (Dark Gold) | `#888880` (Medium grey) | `#606058` (Deep grey) | Perfect for card body, FAQ items, and tertiary explanations. |
| `.txt-small` | Auxiliary Info & Captions | `#8a7a3a` (12px) | `#888880` (12px) | `#606058` (12px) | Used for small metadata, copyright text, and field notes. |
| `.txt-label` | Small Monospaced Elements | `#8a7a3a` (10px Mono) | `#888880` (10px Mono) | `#606058` (10px Mono) | Styled as uppercase monospaced `tracking-widest` labels. |
