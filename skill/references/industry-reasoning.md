# Industry Reasoning Rules for PDF (161)

Source: `ui-ux-pro-max` → `data/ui-reasoning.csv` (161 product-type → design rules). These
are gold for generating **industry-specific** PDF templates (invoices, certificates,
reports, catalogs, dashboards). The source mixes interactive effects into every rule; this
file **strips the interaction** and reduces each rule to what a static `@react-pdf/renderer`
document can act on: which `Layout` shape to use, which surviving *visual style*
(`visual-styles.md`), which *color palette* (`color-palettes.md`), and which *font pairing*
(`font-pairings.md`).

## How to read a row

| Column | Means |
|---|---|
| **Layout** | `Flow` = single `Layout` (auto-paginating text/report). `MultiPage` = `LayoutMultiPage` + `Section` (cover + back, catalogs, mixed pages). `Report` = `Layout` + `Table`/`ChartJS` (data-dense). |
| **Style** | `#` references a surviving entry in `visual-styles.md`. |
| **Palette** | Product-type name to look up in `color-palettes.md` (the `Product Type` column). |
| **Type** | `#` references a pairing in `font-pairings.md`. |
| **Notes** | Static adaptation of the source `Color_Mood` / `Typography_Mood` / `Decision_Rules` / `Anti_Patterns`, with interactive bits removed. |

> Where the source style was interactivity-only (Glassmorphism, 3D, Cyberpunk, Aurora,
> Liquid Glass, Gen Z Chaos, Biomimetic, Spatial), the **Style** column points to the
> closest *surviving* style instead — see `visual-styles.md` "Discarded" for why.

## Rules

| # | UI Category | Layout | Style | Palette | Type | Notes (static) |
|---|---|---|---|---|---|---|
| 1 | SaaS (General) | Flow | #1 | SaaS (General) | #2 | Trust blue + accent CTA; clear hierarchy; minimalism if UX-focused |
| 2 | Micro SaaS | Flow | #23 | Micro SaaS | #13 | Hero + trust; bold primaries + accent |
| 3 | E-commerce | MultiPage | #6 | E-commerce | #40 | Feature showcase; brand + success green; urgency accent for conversion |
| 4 | E-commerce Luxury | MultiPage | #1 | E-commerce Luxury | #12 | Premium dark + gold; elegant serif; no playful color |
| 5 | B2B Service | Flow | #26 | B2B Service | #16 | Feature + trust; case studies + ROI messaging; navy/professional |
| 6 | Financial Dashboard | Report | #36 | Financial Dashboard | #31 | Dark bg + red/green; KPI cards + charts; high contrast |
| 7 | Analytics Dashboard | Report | #28 | Analytics Dashboard | #42 | Cool→hot gradients + neutral; tables + charts; data export table |
| 8 | Healthcare App | Flow | #8 | Healthcare App | #30 | Calm cyan + health green; large readable type; WCAG AAA |
| 9 | Educational App | MultiPage | #6 | Educational App | #45 | Playful + clear; progress indicators; friendly type |
| 10 | Creative Agency | MultiPage | #4 | Creative Agency | #18 | Bold/brutalist; portfolio-forward; artistic freedom |
| 11 | Portfolio/Personal | MultiPage | #66 | Portfolio/Personal | #44 | Storytelling; minimal/brutalist; artistic |
| 12 | Gaming | MultiPage | #6 | Gaming | #37 | Vibrant + neon; bold impact; feature showcase |
| 13 | Government/Public Service | Flow | #8 | Government/Public Service | #16 | High contrast; WCAG AAA; clear large type; no motion |
| 14 | Fintech/Crypto | Flow | #7 | Fintech/Crypto | #36 | Navy + gold; security-first; dark if dashboard |
| 15 | Social Media App | MultiPage | #6 | Social Media App | #43 | Vibrant + engagement; bold; minimize chrome |
| 16 | Productivity Tool | Flow | #12 | Productivity Tool | #3 | Flat + micro-clean; functional colors; keyboard shortcuts listed |
| 17 | Design System/Component Library | Flow | #1 | Design System/Component Library | #13 | Minimal; code-like structure; search + examples |
| 18 | AI/Chatbot Platform | Flow | #5 | AI/Chatbot Platform | #3 | Neutral + AI purple; clean; conversational hierarchy |
| 19 | NFT/Web3 Platform | MultiPage | #7 | NFT/Web3 Platform | #36 | Dark + neon + gold; bold; transaction status table |
| 20 | Creator Economy Platform | MultiPage | #6 | Creator Economy Platform | #43 | Vibrant; creator profiles; monetization display |
| 21 | Remote Work/Collaboration | Flow | #17 | Remote Work/Collaboration | #13 | Calm indigo; clean; status indicators as legend |
| 22 | Mental Health App | Flow | #42 | Mental Health App | #8 | Calm pastels; privacy-first; readable |
| 23 | Pet Tech App | MultiPage | #6 | Pet Tech App | #45 | Playful warm; pet profiles; health charts |
| 24 | Smart Home/IoT Dashboard | Report | #36 | Smart Home/IoT Dashboard | #3 | Dark + status colors; KPI + charts; energy metrics |
| 25 | EV/Charging | MultiPage | #1 | EV/Charging Ecosystem | #3 | Electric blue + green; map/range as image + table |
| 26 | Subscription Box | MultiPage | #6 | Subscription Box Service | #43 | Brand + excitement; personalization quiz summary |
| 27 | Podcast Platform | MultiPage | #7 | Podcast Platform | #43 | Dark + waveform accent; episode list table |
| 28 | Dating App | MultiPage | #6 | Dating App | #43 | Warm romantic; profile cards grid; safety note |
| 29 | Micro-Credentials/Badges | Flow | #1 | Micro-Credentials/Badges | #32 | Trust blue + gold; badge showcase; progress |
| 30 | Knowledge Base/Docs | Flow | #1 | Knowledge Base/Documentation | #14 | Clean hierarchy; search-first TOC; version note |
| 31 | Hyperlocal Services | MultiPage | #6 | Hyperlocal Services | #3 | Location + trust; map image + provider table |
| 32 | Beauty/Spa/Wellness | MultiPage | #42 | Beauty/Spa/Wellness | #8 | Soft pastels + gold; booking summary; before/after gallery |
| 33 | Luxury/Premium Brand | MultiPage | #1 | Luxury/Premium Brand | #12 | Black + gold; elegant serif; high-quality imagery |
| 34 | Restaurant/Food | MultiPage | #6 | Restaurant/Food Service | #33 | Warm colors; menu (Playfair SC + Karla); food imagery |
| 35 | Fitness/Gym | MultiPage | #6 | Fitness/Gym App | #49 | Energetic orange + dark; progress rings as ChartJS |
| 36 | Real Estate/Property | MultiPage | #1 | Real Estate/Property | #32 | Trust blue + gold; property gallery; map image |
| 37 | Travel/Tourism | MultiPage | #42 | Travel/Tourism Agency | #3 | Vibrant sky blue; itinerary as table; destination imagery |
| 38 | Hotel/Hospitality | MultiPage | #1 | Hotel/Hospitality | #32 | Warm neutrals + gold; room gallery; booking summary |
| 39 | Wedding/Event | MultiPage | #42 | Wedding/Event Planning | #46 | Soft pink + gold; gallery; planning timeline table |
| 40 | Legal Services | Flow | #1 | Legal Services | #29 | Navy + gold; authoritative serif; case results |
| 41 | Insurance Platform | Flow | #12 | Insurance Platform | #16 | Trust blue + green; quote calculator summary |
| 42 | Banking/Traditional Finance | Flow | #1 | Banking/Traditional Finance | #31 | Navy + gold; security-first; accessibility |
| 43 | Online Course/E-learning | MultiPage | #6 | Online Course/E-learning | #45 | Vibrant + progress green; certificate; progress bar |
| 44 | Non-profit/Charity | Flow | #42 | Non-profit/Charity | #8 | Cause colors + warm; impact counters; donation transparency |
| 45 | Music Streaming | MultiPage | #7 | Music Streaming | #43 | Dark + album accents; playlist table |
| 46 | Video Streaming/OTT | MultiPage | #7 | Video Streaming/OTT | #43 | Dark + poster colors; content list |
| 47 | Job Board/Recruitment | Flow | #12 | Job Board/Recruitment | #16 | Professional blue + green; search/filter summary |
| 48 | Marketplace (P2P) | MultiPage | #6 | Marketplace (P2P) | #43 | Trust + success green; seller profiles; secure-payment note |
| 49 | Logistics/Delivery | Report | #36 | Logistics/Delivery | #3 | Blue + orange + green; tracking table; map image |
| 50 | Agriculture/Farm Tech | MultiPage | #42 | Agriculture/Farm Tech | #3 | Earth green + brown; sensor dashboard table |
| 51 | Construction/Architecture | MultiPage | #1 | Construction/Architecture | #32 | Grey + safety orange; project portfolio; timeline |
| 52 | Automotive/Dealership | MultiPage | #6 | Automotive/Car Dealership | #37 | Brand + metallic; vehicle comparison table |
| 53 | Photography Studio | MultiPage | #56 | Photography Studio | #44 | Black + white; full-bleed gallery; booking summary |
| 54 | Coworking Space | MultiPage | #6 | Coworking Space | #43 | Energetic + wood; space tour; amenity list |
| 55 | Home Services | Flow | #12 | Home Services | #16 | Trust blue + orange; emergency contact prominent |
| 56 | Childcare/Daycare | MultiPage | #6 | Childcare/Daycare | #45 | Playful pastels; parent portal; safety certs |
| 57 | Senior Care/Elderly | Flow | #8 | Senior Care/Elderly | #16 | Calm blue; large 18px+ type; family portal |
| 58 | Medical Clinic | Flow | #8 | Medical Clinic | #30 | Medical blue; appointment summary; insurance info |
| 59 | Pharmacy/Drug Store | Flow | #12 | Pharmacy/Drug Store | #30 | Pharmacy green + blue; prescription summary |
| 60 | Dental Practice | MultiPage | #42 | Dental Practice | #8 | Fresh blue; before/after gallery; testimonials |
| 61 | Veterinary Clinic | MultiPage | #6 | Veterinary Clinic | #45 | Caring blue; pet profiles; emergency contact |
| 62 | Florist/Plant Shop | MultiPage | #42 | Florist/Plant Shop | #33 | Natural green + floral; delivery schedule |
| 63 | Bakery/Cafe | MultiPage | #6 | Bakery/Cafe | #33 | Warm brown + cream; menu; online order summary |
| 64 | Brewery/Winery | MultiPage | #42 | Brewery/Winery | #33 | Amber/burgundy + gold; tasting notes; heritage |
| 65 | Airline | MultiPage | #1 | Airline | #16 | Sky blue; flight search summary; boarding pass |
| 66 | News/Media | MultiPage | #1 | News/Media Platform | #14 | High contrast; breaking-news badge; category nav |
| 67 | Magazine/Blog | MultiPage | #66 | Magazine/Blog | #35 | Editorial serif; article showcase; newsletter signup |
| 68 | Freelancer Platform | Flow | #12 | Freelancer Platform | #13 | Professional blue + green; portfolio; skill match |
| 69 | Marketing Agency | MultiPage | #4 | Marketing Agency | #18 | Bold brand; portfolio; results metrics |
| 70 | Event Management | MultiPage | #6 | Event Management | #43 | Event colors; countdown; registration summary |
| 71 | Membership/Community | MultiPage | #6 | Membership/Community | #43 | Community colors; benefits; pricing tiers |
| 72 | Newsletter Platform | Flow | #12 | Newsletter Platform | #13 | Clean; subscribe form; sample content |
| 73 | Digital Products/Downloads | MultiPage | #6 | Digital Products/Downloads | #13 | Product colors; preview; delivery confirmation |
| 74 | Church/Religious | MultiPage | #42 | Church/Religious Organization | #8 | Warm gold + purple; service times; events |
| 75 | Sports Team/Club | MultiPage | #6 | Sports Team/Club | #49 | Team colors; schedule; roster |
| 76 | Museum/Gallery | MultiPage | #1 | Museum/Gallery | #44 | Neutral + exhibition accent; virtual-tour image |
| 77 | Theater/Cinema | MultiPage | #7 | Theater/Cinema | #43 | Dark + spotlight gold; showtimes; seat map |
| 78 | Language Learning | MultiPage | #6 | Language Learning App | #45 | Playful + progress; achievement badges |
| 79 | Coding Bootcamp | MultiPage | #7 | Coding Bootcamp | #9 | Code-editor dark; curriculum; career outcomes |
| 80 | Cybersecurity Platform | MultiPage | #73 | Cybersecurity Platform | #9 | Matrix green + black; mono; threat table |
| 81 | Developer Tool / IDE | Flow | #73 | Developer Tool / IDE | #9 | Dark syntax; mono; docs + keyboard shortcuts |
| 82 | Biotech / Life Sciences | MultiPage | #42 | Biotech / Life Sciences | #47 | Sterile white + DNA blue; data viz; research notes |
| 83 | Space Tech / Aerospace | MultiPage | #7 | Space Tech / Aerospace | #9 | Deep black + star white; telemetry table; 3D image |
| 84 | Architecture / Interior | MultiPage | #47 | Architecture / Interior | #32 | Monochrome + gold; high-res gallery |
| 85 | Quantum Computing | MultiPage | #73 | Quantum Computing Interface | #9 | Quantum cyan + black; mono; data table |
| 86 | Biohacking / Longevity | Report | #42 | Biohacking / Longevity App | #47 | Cellular tones; biological data viz; privacy note |
| 87 | Autonomous Drone Fleet | Report | #73 | Autonomous Drone Fleet Manager | #9 | Tactical green + red; telemetry table; map image |
| 88 | Generative Art Platform | MultiPage | #1 | Generative Art Platform | #44 | Neutral + user content; gallery masonry |
| 89 | Spatial Computing OS | MultiPage | #1 | Spatial Computing OS / App | #5 | Neutral; product showcase; feature list |
| 90 | Sustainable Energy / Climate | Report | #42 | Sustainable Energy / Climate Tech | #3 | Earth green + sky blue; impact viz; data table |
| 91 | Personal Finance Tracker | Report | #36 | Personal Finance Tracker | #31 | Calm blue + green/red; charts; dark if needed |
| 92 | Chat & Messaging | MultiPage | #12 | Chat & Messaging App | #5 | Brand + bubble contrast; conversation export |
| 93 | Notes & Writing | Flow | #56 | Notes & Writing App | #59 | Clean cream + accent; minimal |
| 94 | Habit Tracker | MultiPage | #6 | Habit Tracker | #45 | Streak amber + green; progress charts |
| 95 | Food Delivery / On-Demand | MultiPage | #6 | Food Delivery / On-Demand | #43 | Appetizing orange + blue; map image; order summary |
| 96 | Ride Hailing / Transportation | MultiPage | #1 | Ride Hailing / Transportation | #5 | Brand + map neutral; trip summary |
| 97 | Recipe & Cooking | MultiPage | #6 | Recipe & Cooking App | #33 | Warm terracotta; recipe cards; ingredients table |
| 98 | Meditation & Mindfulness | MultiPage | #42 | Meditation & Mindfulness | #8 | Calm lavender; session log |
| 99 | Weather App | MultiPage | #7 | Weather App | #3 | Atmospheric gradient→flat tints; forecast table |
| 100 | Diary & Journal | Flow | #56 | Diary & Journal App | #59 | Warm paper; entries |
| 101 | CRM & Client Management | Report | #12 | CRM & Client Management | #13 | Professional blue; pipeline table; closed-won green |
| 102 | Inventory & Stock | Report | #12 | Inventory & Stock Management | #3 | Neutral + traffic-light; stock table |
| 103 | Flashcard & Study | MultiPage | #6 | Flashcard & Study Tool | #45 | Playful; correct/incorrect colors; progress |
| 104 | Booking & Appointment | Flow | #12 | Booking & Appointment App | #16 | Trust blue + available green; booking summary |
| 105 | Invoice & Billing Tool | Flow | #12 | Invoice & Billing Tool | #31 | Navy + paid green + overdue red; line-item table |
| 106 | Grocery & Shopping List | Flow | #12 | Grocery & Shopping List | #40 | Fresh green; checklist |
| 107 | Timer & Pomodoro | Flow | #56 | Timer & Pomodoro App | #9 | High-contrast dark; session log |
| 108 | Parenting & Baby Tracker | MultiPage | #6 | Parenting & Baby Tracker | #45 | Soft pastels; growth charts |
| 109 | Scanner & Document Manager | Flow | #1 | Scanner & Document Manager | #5 | Clean white; file-type color coding |
| 110 | Calendar & Scheduling | Flow | #12 | Calendar & Scheduling App | #16 | Clean blue; event table |
| 111 | Password Manager | Flow | #8 | Password Manager | #5 | Trust blue + green; vault summary |
| 112 | Expense Splitter | Flow | #12 | Expense Splitter / Bill Split | #31 | Success green + red; breakdown table |
| 113 | Voice Recorder & Memo | Flow | #56 | Voice Recorder & Memo | #5 | Clean; transcript |
| 114 | Bookmark & Read-Later | Flow | #56 | Bookmark & Read-Later | #59 | Paper warm; list |
| 115 | Translator App | Flow | #12 | Translator App | #25 | Global blue; translation table |
| 116 | Calculator & Unit Converter | Flow | #56 | Calculator & Unit Converter | #9 | Dark functional; results |
| 117 | Alarm & World Clock | Flow | #7 | Alarm & World Clock | #9 | Deep dark; world-clock table |
| 118 | File Manager & Transfer | Flow | #12 | File Manager & Transfer | #5 | Functional neutral; file-type colors |
| 119 | Email Client | Flow | #12 | Email Client | #5 | Clean; priority/archive as labels |
| 120 | Casual Puzzle Game | MultiPage | #6 | Casual Puzzle Game | #45 | Cheerful; progress/reward |
| 121 | Trivia & Quiz Game | MultiPage | #6 | Trivia & Quiz Game | #49 | Energetic; score table |
| 122 | Card & Board Game | MultiPage | #6 | Card & Board Game | #49 | Felt green; rules + scores |
| 123 | Idle & Clicker Game | MultiPage | #6 | Idle & Clicker Game | #43 | Coin gold; progress |
| 124 | Word & Crossword | Flow | #12 | Word & Crossword Game | #59 | Clean; puzzle grid |
| 125 | Arcade & Retro Game | MultiPage | #73 | Arcade & Retro Game | #52 | Neon on black; mono; scores |
| 126 | Photo Editor & Filters | MultiPage | #7 | Photo Editor & Filters | #9 | Dark editor; filter strip |
| 127 | Short Video Editor | MultiPage | #7 | Short Video Editor | #43 | Dark; timeline summary |
| 128 | Drawing & Sketching | MultiPage | #7 | Drawing & Sketching Canvas | #44 | Neutral canvas; gallery |
| 129 | Music Creation & Beat Maker | MultiPage | #7 | Music Creation & Beat Maker | #43 | Dark studio; track table |
| 130 | Meme & Sticker Maker | MultiPage | #6 | Meme & Sticker Maker | #43 | Bold; gallery |
| 131 | AI Photo & Avatar Generator | MultiPage | #1 | AI Photo & Avatar Generator | #3 | AI purple; before/after |
| 132 | Link-in-Bio Page Builder | MultiPage | #6 | Link-in-Bio Page Builder | #43 | Brand-customizable; link list |
| 133 | Wardrobe & Outfit Planner | MultiPage | #1 | Wardrobe & Outfit Planner | #33 | Clean fashion; item list |
| 134 | Plant Care Tracker | MultiPage | #42 | Plant Care Tracker | #8 | Nature greens; care schedule |
| 135 | Book & Reading Tracker | MultiPage | #66 | Book & Reading Tracker | #59 | Warm paper; reading progress |
| 136 | Couple & Relationship | MultiPage | #42 | Couple & Relationship App | #46 | Romantic; memory gallery |
| 137 | Family Calendar & Chores | MultiPage | #12 | Family Calendar & Chores | #45 | Warm; member color coding; chore table |
| 138 | Mood Tracker | MultiPage | #42 | Mood Tracker App | #8 | Emotion colors; mood log |
| 139 | Gift & Wishlist | MultiPage | #6 | Gift & Wishlist | #46 | Celebration; item list |
| 140 | Running & Cycling GPS | Report | #7 | Running & Cycling GPS | #49 | Energetic + pace zones; route image + stats |
| 141 | Yoga & Stretching | MultiPage | #42 | Yoga & Stretching Guide | #8 | Earth calm; pose list |
| 142 | Sleep Tracker | Report | #7 | Sleep Tracker App | #9 | Deep midnight; sleep quality table |
| 143 | Calorie & Nutrition | Report | #12 | Calorie & Nutrition Counter | #40 | Healthy green + macros; nutrition table |
| 144 | Period & Cycle Tracker | MultiPage | #42 | Period & Cycle Tracker | #46 | Rose/lavender; cycle log |
| 145 | Medication & Pill Reminder | Flow | #8 | Medication & Pill Reminder | #30 | Medical blue; schedule table; missed/red |
| 146 | Water & Hydration | MultiPage | #6 | Water & Hydration Reminder | #8 | Refreshing blue; intake log |
| 147 | Fasting & Intermittent | Report | #7 | Fasting & Intermittent Timer | #9 | Fasting dark; timeline |
| 148 | Anonymous Community | MultiPage | #7 | Anonymous Community / Confession | #9 | Dark protective; upvote table |
| 149 | Local Events & Discovery | MultiPage | #6 | Local Events & Discovery | #43 | City vibrant; event list + map |
| 150 | Study Together | MultiPage | #1 | Study Together / Virtual Coworking | #13 | Calm focus; session log |
| 151 | Coding Challenge | MultiPage | #7 | Coding Challenge & Practice | #9 | Code dark; difficulty table |
| 152 | Kids Learning | MultiPage | #6 | Kids Learning (ABC & Math) | #45 | Bright primary; reward; progress |
| 153 | Music Instrument Learning | MultiPage | #6 | Music Instrument Learning | #33 | Musical warm; lesson list |
| 154 | Parking Finder | MultiPage | #1 | Parking Finder | #16 | Trust blue + available/occupied; map |
| 155 | Public Transit Guide | Flow | #12 | Public Transit Guide | #25 | Transit line colors; schedule table |
| 156 | Road Trip Planner | MultiPage | #42 | Road Trip Planner | #3 | Adventure warm; stops table + map |
| 157 | VPN & Privacy Tool | Flow | #7 | VPN & Privacy Tool | #5 | Dark shield; connection summary |
| 158 | Emergency SOS & Safety | Flow | #8 | Emergency SOS & Safety | #16 | Alert red + safety blue; contact card |
| 159 | Wallpaper & Theme | MultiPage | #6 | Wallpaper & Theme App | #43 | Content-driven; gallery |
| 160 | White Noise & Ambient | Flow | #7 | White Noise & Ambient Sound | #9 | Calming dark; sound list |
| 161 | Home Decoration & Interior | MultiPage | #1 | Home Decoration & Interior Design | #33 | Neutral + material; project gallery |

## Static anti-patterns (apply to every industry PDF)

Distilled from the source `Anti_Patterns` after removing interaction:

- **No excessive decoration** where clarity matters (finance, legal, gov, medical).
- **No low-contrast / gray-on-gray** text — verify 4.5:1 (see `ux-guidelines.md`).
- **No AI purple/pink gradients** default for trust industries (government, banking,
  healthcare, insurance, logistics) — use the industry palette instead.
- **No pure-white background** for dark-scheme industries (cybersecurity, dev tools, trading,
  OLED dashboards) — use the dark palette.
- **Every chart/table is paired with its data** (a `<Table>` or list), never a chart alone.
- **High-quality imagery only** where the source demands it (luxury, real estate, photography,
  architecture) — and images must be absolute `https://` URLs.
