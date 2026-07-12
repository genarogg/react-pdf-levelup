# Color Palettes by Industry (161)

Source: `ui-ux-pro-max` → `data/colors.csv` (161 rows). Every palette is just hex
values organized as semantic tokens — fully portable to a static PDF. Verbatim from the
source; only reformatted. The original CSV carries 18 tokens per row
(`Primary, On Primary, Secondary, On Secondary, Accent, On Accent, Background, Foreground,
Card, Card Foreground, Muted, Muted Foreground, Border, Destructive, On Destructive, Ring,
Notes`). For PDF use you mostly need the rendering tokens below; the `On *` tokens are the
contrast text color that sits on each fill and are listed in the source CSV if you need them.

## How to consume

```jsx
// Starting point for a SaaS invoice/certificate — copy the row's tokens into a COLORS object
const COLORS = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  accent: '#EA580C',
  background: '#F8FAFC',
  foreground: '#1E293B',
  card: '#FFFFFF',
  muted: '#64748B',
  border: '#E2E8F0',
  destructive: '#DC2626',
};
```

Pick the row whose **Product Type** matches the document's industry, then feed `COLORS`
into `Layout style` / `Div` / text components. Keep contrast ≥ 4.5:1 (see
`ux-guidelines.md`). Dark-background rows (e.g. Financial Dashboard `#020617`) work as a
dark color *scheme* — fine for a PDF cover or a "dark mode" certificate, just drop any glow.

## Palettes

| Product Type | Primary | Secondary | Accent | Background | Foreground | Card | Border | Destructive |
|---|---|---|---|---|---|---|---|---|
| SaaS (General) | #2563EB | #3B82F6 | #EA580C | #F8FAFC | #1E293B | #FFFFFF | #E2E8F0 | #DC2626 |
| Micro SaaS | #6366F1 | #818CF8 | #059669 | #F5F3FF | #1E1B4B | #FFFFFF | #E0E7FF | #DC2626 |
| E-commerce | #059669 | #10B981 | #EA580C | #ECFDF5 | #064E3B | #FFFFFF | #A7F3D0 | #DC2626 |
| E-commerce Luxury | #1C1917 | #44403C | #A16207 | #FAFAF9 | #0C0A09 | #FFFFFF | #D6D3D1 | #DC2626 |
| B2B Service | #0F172A | #334155 | #0369A1 | #F8FAFC | #020617 | #FFFFFF | #E2E8F0 | #DC2626 |
| Financial Dashboard | #0F172A | #1E293B | #22C55E | #020617 | #F8FAFC | #0E1223 | #334155 | #EF4444 |
| Analytics Dashboard | #1E40AF | #3B82F6 | #D97706 | #F8FAFC | #1E3A8A | #FFFFFF | #DBEAFE | #DC2626 |
| Healthcare App | #0891B2 | #22D3EE | #059669 | #ECFEFF | #164E63 | #FFFFFF | #A5F3FC | #DC2626 |
| Educational App | #4F46E5 | #818CF8 | #EA580C | #EEF2FF | #1E1B4B | #FFFFFF | #C7D2FE | #DC2626 |
| Creative Agency | #EC4899 | #F472B6 | #0891B2 | #FDF2F8 | #831843 | #FFFFFF | #FBCFE8 | #DC2626 |
| Portfolio/Personal | #18181B | #3F3F46 | #2563EB | #FAFAFA | #09090B | #FFFFFF | #E4E4E7 | #DC2626 |
| Gaming | #7C3AED | #A78BFA | #F43F5E | #0F0F23 | #E2E8F0 | #1E1C35 | #4C1D95 | #EF4444 |
| Government/Public Service | #0F172A | #334155 | #0369A1 | #F8FAFC | #020617 | #FFFFFF | #E2E8F0 | #DC2626 |
| Fintech/Crypto | #F59E0B | #FBBF24 | #8B5CF6 | #0F172A | #F8FAFC | #222735 | #334155 | #EF4444 |
| Social Media App | #E11D48 | #FB7185 | #2563EB | #FFF1F2 | #881337 | #FFFFFF | #FECDD3 | #DC2626 |
| Productivity Tool | #0D9488 | #14B8A6 | #EA580C | #F0FDFA | #134E4A | #FFFFFF | #99F6E4 | #DC2626 |
| Design System/Component Library | #4F46E5 | #6366F1 | #EA580C | #EEF2FF | #312E81 | #FFFFFF | #C7D2FE | #DC2626 |
| AI/Chatbot Platform | #7C3AED | #A78BFA | #0891B2 | #FAF5FF | #1E1B4B | #FFFFFF | #DDD6FE | #DC2626 |
| NFT/Web3 Platform | #8B5CF6 | #A78BFA | #FBBF24 | #0F0F23 | #F8FAFC | #1E1D35 | #4C1D95 | #EF4444 |
| Creator Economy Platform | #EC4899 | #F472B6 | #EA580C | #FDF2F8 | #831843 | #FFFFFF | #FBCFE8 | #DC2626 |
| Remote Work/Collaboration Tool | #6366F1 | #818CF8 | #059669 | #F5F3FF | #312E81 | #FFFFFF | #E0E7FF | #DC2626 |
| Mental Health App | #8B5CF6 | #C4B5FD | #059669 | #FAF5FF | #4C1D95 | #FFFFFF | #EDE9FE | #DC2626 |
| Pet Tech App | #F97316 | #FB923C | #2563EB | #FFF7ED | #9A3412 | #FFFFFF | #FED7AA | #DC2626 |
| Smart Home/IoT Dashboard | #1E293B | #334155 | #22C55E | #0F172A | #F8FAFC | #1B2336 | #475569 | #EF4444 |
| EV/Charging Ecosystem | #0891B2 | #22D3EE | #16A34A | #ECFEFF | #164E63 | #FFFFFF | #A5F3FC | #DC2626 |
| Subscription Box Service | #D946EF | #E879F9 | #EA580C | #FDF4FF | #86198F | #FFFFFF | #F5D0FE | #DC2626 |
| Podcast Platform | #1E1B4B | #312E81 | #F97316 | #0F0F23 | #F8FAFC | #1B1B30 | #4338CA | #EF4444 |
| Dating App | #E11D48 | #FB7185 | #EA580C | #FFF1F2 | #881337 | #FFFFFF | #FECDD3 | #DC2626 |
| Micro-Credentials/Badges Platform | #0369A1 | #0EA5E9 | #A16207 | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Knowledge Base/Documentation | #475569 | #64748B | #2563EB | #F8FAFC | #1E293B | #FFFFFF | #E2E8F0 | #DC2626 |
| Hyperlocal Services | #059669 | #10B981 | #EA580C | #ECFDF5 | #064E3B | #FFFFFF | #A7F3D0 | #DC2626 |
| Beauty/Spa/Wellness Service | #EC4899 | #F9A8D4 | #8B5CF6 | #FDF2F8 | #831843 | #FFFFFF | #FBCFE8 | #DC2626 |
| Luxury/Premium Brand | #1C1917 | #44403C | #A16207 | #FAFAF9 | #0C0A09 | #FFFFFF | #D6D3D1 | #DC2626 |
| Restaurant/Food Service | #DC2626 | #F87171 | #A16207 | #FEF2F2 | #450A0A | #FFFFFF | #FECACA | #DC2626 |
| Fitness/Gym App | #F97316 | #FB923C | #22C55E | #1F2937 | #F8FAFC | #313742 | #374151 | #EF4444 |
| Real Estate/Property | #0F766E | #14B8A6 | #0369A1 | #F0FDFA | #134E4A | #FFFFFF | #99F6E4 | #DC2626 |
| Travel/Tourism Agency | #0EA5E9 | #38BDF8 | #EA580C | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Hotel/Hospitality | #1E3A8A | #3B82F6 | #A16207 | #F8FAFC | #1E40AF | #FFFFFF | #BFDBFE | #DC2626 |
| Wedding/Event Planning | #DB2777 | #F472B6 | #A16207 | #FDF2F8 | #831843 | #FFFFFF | #FBCFE8 | #DC2626 |
| Legal Services | #1E3A8A | #1E40AF | #B45309 | #F8FAFC | #0F172A | #FFFFFF | #CBD5E1 | #DC2626 |
| Insurance Platform | #0369A1 | #0EA5E9 | #16A34A | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Banking/Traditional Finance | #0F172A | #1E3A8A | #A16207 | #F8FAFC | #020617 | #FFFFFF | #E2E8F0 | #DC2626 |
| Online Course/E-learning | #0D9488 | #2DD4BF | #EA580C | #F0FDFA | #134E4A | #FFFFFF | #5EEAD4 | #DC2626 |
| Non-profit/Charity | #0891B2 | #22D3EE | #EA580C | #ECFEFF | #164E63 | #FFFFFF | #A5F3FC | #DC2626 |
| Music Streaming | #1E1B4B | #4338CA | #22C55E | #0F0F23 | #F8FAFC | #1B1B30 | #312E81 | #EF4444 |
| Video Streaming/OTT | #0F0F23 | #1E1B4B | #E11D48 | #000000 | #F8FAFC | #0C0C0D | #312E81 | #EF4444 |
| Job Board/Recruitment | #0369A1 | #0EA5E9 | #16A34A | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Marketplace (P2P) | #7C3AED | #A78BFA | #16A34A | #FAF5FF | #4C1D95 | #FFFFFF | #DDD6FE | #DC2626 |
| Logistics/Delivery | #2563EB | #3B82F6 | #EA580C | #EFF6FF | #1E40AF | #FFFFFF | #BFDBFE | #DC2626 |
| Agriculture/Farm Tech | #15803D | #22C55E | #A16207 | #F0FDF4 | #14532D | #FFFFFF | #BBF7D0 | #DC2626 |
| Construction/Architecture | #64748B | #94A3B8 | #EA580C | #F8FAFC | #334155 | #FFFFFF | #E2E8F0 | #DC2626 |
| Automotive/Car Dealership | #1E293B | #334155 | #DC2626 | #F8FAFC | #0F172A | #FFFFFF | #E2E8F0 | #DC2626 |
| Photography Studio | #18181B | #27272A | #F8FAFC | #000000 | #FAFAFA | #0C0C0C | #3F3F46 | #EF4444 |
| Coworking Space | #F59E0B | #FBBF24 | #2563EB | #FFFBEB | #78350F | #FFFFFF | #FDE68A | #DC2626 |
| Home Services (Plumber/Electrician) | #1E40AF | #3B82F6 | #EA580C | #EFF6FF | #1E3A8A | #FFFFFF | #BFDBFE | #DC2626 |
| Childcare/Daycare | #F472B6 | #FBCFE8 | #16A34A | #FDF2F8 | #9D174D | #FFFFFF | #FCE7F3 | #DC2626 |
| Senior Care/Elderly | #0369A1 | #38BDF8 | #16A34A | #F0F9FF | #0C4A6E | #FFFFFF | #E0F2FE | #DC2626 |
| Medical Clinic | #0891B2 | #22D3EE | #16A34A | #F0FDFA | #134E4A | #FFFFFF | #CCFBF1 | #DC2626 |
| Pharmacy/Drug Store | #15803D | #22C55E | #0369A1 | #F0FDF4 | #14532D | #FFFFFF | #BBF7D0 | #DC2626 |
| Dental Practice | #0EA5E9 | #38BDF8 | #0EA5E9 | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Veterinary Clinic | #0D9488 | #14B8A6 | #EA580C | #F0FDFA | #134E4A | #FFFFFF | #99F6E4 | #DC2626 |
| Florist/Plant Shop | #15803D | #22C55E | #EC4899 | #F0FDF4 | #14532D | #FFFFFF | #BBF7D0 | #DC2626 |
| Bakery/Cafe | #92400E | #B45309 | #92400E | #FEF3C7 | #78350F | #FFFFFF | #FDE68A | #DC2626 |
| Brewery/Winery | #7C2D12 | #B91C1C | #A16207 | #FEF2F2 | #450A0A | #FFFFFF | #FECACA | #DC2626 |
| Airline | #1E3A8A | #3B82F6 | #EA580C | #EFF6FF | #1E40AF | #FFFFFF | #BFDBFE | #DC2626 |
| News/Media Platform | #DC2626 | #EF4444 | #1E40AF | #FEF2F2 | #450A0A | #FFFFFF | #FECACA | #DC2626 |
| Magazine/Blog | #18181B | #3F3F46 | #EC4899 | #FAFAFA | #09090B | #FFFFFF | #E4E4E7 | #DC2626 |
| Freelancer Platform | #6366F1 | #818CF8 | #16A34A | #EEF2FF | #312E81 | #FFFFFF | #C7D2FE | #DC2626 |
| Marketing Agency | #EC4899 | #F472B6 | #0891B2 | #FDF2F8 | #831843 | #FFFFFF | #FBCFE8 | #DC2626 |
| Event Management | #7C3AED | #A78BFA | #EA580C | #FAF5FF | #4C1D95 | #FFFFFF | #DDD6FE | #DC2626 |
| Membership/Community | #7C3AED | #A78BFA | #16A34A | #FAF5FF | #4C1D95 | #FFFFFF | #DDD6FE | #DC2626 |
| Newsletter Platform | #0369A1 | #0EA5E9 | #EA580C | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Digital Products/Downloads | #6366F1 | #818CF8 | #16A34A | #EEF2FF | #312E81 | #FFFFFF | #C7D2FE | #DC2626 |
| Church/Religious Organization | #7C3AED | #A78BFA | #A16207 | #FAF5FF | #4C1D95 | #FFFFFF | #DDD6FE | #DC2626 |
| Sports Team/Club | #DC2626 | #EF4444 | #DC2626 | #FEF2F2 | #7F1D1D | #FFFFFF | #FECACA | #DC2626 |
| Museum/Gallery | #18181B | #27272A | #18181B | #FAFAFA | #09090B | #FFFFFF | #E4E4E7 | #DC2626 |
| Theater/Cinema | #1E1B4B | #312E81 | #CA8A04 | #0F0F23 | #F8FAFC | #1B1B30 | #4338CA | #EF4444 |
| Language Learning App | #4F46E5 | #818CF8 | #16A34A | #EEF2FF | #312E81 | #FFFFFF | #C7D2FE | #DC2626 |
| Coding Bootcamp | #0F172A | #1E293B | #22C55E | #020617 | #F8FAFC | #0E1223 | #334155 | #EF4444 |
| Cybersecurity Platform | #00FF41 | #0D0D0D | #FF3333 | #000000 | #E0E0E0 | #0C130E | #1F1F1F | #EF4444 |
| Developer Tool / IDE | #1E293B | #334155 | #22C55E | #0F172A | #F8FAFC | #1B2336 | #475569 | #EF4444 |
| Biotech / Life Sciences | #0EA5E9 | #0284C7 | #059669 | #F0F9FF | #0C4A6E | #FFFFFF | #BAE6FD | #DC2626 |
| Space Tech / Aerospace | #F8FAFC | #94A3B8 | #3B82F6 | #0B0B10 | #F8FAFC | #1E1E23 | #1E293B | #EF4444 |
| Architecture / Interior | #171717 | #404040 | #A16207 | #FFFFFF | #171717 | #FFFFFF | #E5E5E5 | #DC2626 |
| Quantum Computing Interface | #00FFFF | #7B61FF | #FF00FF | #050510 | #E0E0FF | #101823 | #333344 | #EF4444 |
| Biohacking / Longevity App | #FF4D4D | #4D94FF | #059669 | #F5F5F7 | #1C1C1E | #FFFFFF | #E5E5EA | #DC2626 |
| Autonomous Drone Fleet Manager | #00FF41 | #008F11 | #FF3333 | #0D1117 | #E6EDF3 | #182424 | #30363D | #EF4444 |
| Generative Art Platform | #18181B | #3F3F46 | #EC4899 | #FAFAFA | #09090B | #FFFFFF | #E4E4E7 | #DC2626 |
| Spatial Computing OS / App | #FFFFFF | #E5E5E5 | #FFFFFF | #888888 | #000000 | #999999 | #CCCCCC | #FF3B30 |
| Sustainable Energy / Climate Tech | #059669 | #10B981 | #059669 | #ECFDF5 | #064E3B | #FFFFFF | #A7F3D0 | #DC2626 |
| Personal Finance Tracker | #1E40AF | #3B82F6 | #059669 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Chat & Messaging App | #2563EB | #6366F1 | #059669 | #FFFFFF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Notes & Writing App | #78716C | #A8A29E | #D97706 | #FFFBEB | #0F172A | #FFFFFF | #EEEDED | #DC2626 |
| Habit Tracker | #D97706 | #F59E0B | #059669 | #FFFBEB | #0F172A | #FFFFFF | #FAEEE1 | #DC2626 |
| Food Delivery / On-Demand | #EA580C | #F97316 | #2563EB | #FFF7ED | #0F172A | #FFFFFF | #FCEAE1 | #DC2626 |
| Ride Hailing / Transportation | #1E293B | #334155 | #2563EB | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Recipe & Cooking App | #9A3412 | #C2410C | #059669 | #FFFBEB | #0F172A | #FFFFFF | #F2E6E2 | #DC2626 |
| Meditation & Mindfulness | #7C3AED | #8B5CF6 | #059669 | #FAF5FF | #0F172A | #FFFFFF | #EFE7FC | #DC2626 |
| Weather App | #0284C7 | #0EA5E9 | #F59E0B | #F0F9FF | #0F172A | #FFFFFF | #E0F0F8 | #DC2626 |
| Diary & Journal App | #92400E | #A16207 | #6366F1 | #FFFBEB | #0F172A | #FFFFFF | #F1E8E2 | #DC2626 |
| CRM & Client Management | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Inventory & Stock Management | #334155 | #475569 | #059669 | #F8FAFC | #0F172A | #FFFFFF | #E6E8EA | #DC2626 |
| Flashcard & Study Tool | #7C3AED | #8B5CF6 | #059669 | #FAF5FF | #0F172A | #FFFFFF | #EFE7FC | #DC2626 |
| Booking & Appointment App | #0284C7 | #0EA5E9 | #059669 | #F0F9FF | #0F172A | #FFFFFF | #E0F0F8 | #DC2626 |
| Invoice & Billing Tool | #1E3A5F | #2563EB | #059669 | #F8FAFC | #0F172A | #FFFFFF | #E4E7EB | #DC2626 |
| Grocery & Shopping List | #059669 | #10B981 | #D97706 | #ECFDF5 | #0F172A | #FFFFFF | #E1F2ED | #DC2626 |
| Timer & Pomodoro | #DC2626 | #EF4444 | #059669 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Parenting & Baby Tracker | #EC4899 | #F472B6 | #0284C7 | #FDF2F8 | #0F172A | #FFFFFF | #FCE9F2 | #DC2626 |
| Scanner & Document Manager | #1E293B | #334155 | #2563EB | #F8FAFC | #0F172A | #FFFFFF | #E4E5E7 | #DC2626 |
| Calendar & Scheduling App | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Password Manager | #1E3A5F | #334155 | #059669 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Expense Splitter / Bill Split | #059669 | #10B981 | #DC2626 | #F8FAFC | #0F172A | #FFFFFF | #E1F2ED | #DC2626 |
| Voice Recorder & Memo | #DC2626 | #EF4444 | #2563EB | #FFFFFF | #0F172A | #FFFFFF | #FAE4E4 | #DC2626 |
| Bookmark & Read-Later | #D97706 | #F59E0B | #2563EB | #FFFBEB | #0F172A | #FFFFFF | #FAEEE1 | #DC2626 |
| Translator App | #2563EB | #0891B2 | #EA580C | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Calculator & Unit Converter | #EA580C | #F97316 | #2563EB | #1C1917 | #FFFFFF | #262321 | rgba(255,255,255,0.08) | #DC2626 |
| Alarm & World Clock | #D97706 | #F59E0B | #6366F1 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| File Manager & Transfer | #2563EB | #3B82F6 | #D97706 | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Email Client | #2563EB | #3B82F6 | #DC2626 | #FFFFFF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Casual Puzzle Game | #EC4899 | #8B5CF6 | #F59E0B | #FDF2F8 | #0F172A | #FFFFFF | #FCE9F2 | #DC2626 |
| Trivia & Quiz Game | #2563EB | #7C3AED | #F59E0B | #EFF6FF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Card & Board Game | #15803D | #166534 | #D97706 | #0F172A | #FFFFFF | #0F1F2B | rgba(255,255,255,0.08) | #DC2626 |
| Idle & Clicker Game | #D97706 | #F59E0B | #7C3AED | #FFFBEB | #0F172A | #FFFFFF | #FCF6F0 | #DC2626 |
| Word & Crossword Game | #15803D | #059669 | #D97706 | #FFFFFF | #0F172A | #FFFFFF | #E2EFE7 | #DC2626 |
| Arcade & Retro Game | #DC2626 | #2563EB | #22C55E | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Photo Editor & Filters | #7C3AED | #6366F1 | #0891B2 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Short Video Editor | #EC4899 | #DB2777 | #2563EB | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Drawing & Sketching Canvas | #7C3AED | #8B5CF6 | #0891B2 | #1C1917 | #FFFFFF | #262321 | rgba(255,255,255,0.08) | #DC2626 |
| Music Creation & Beat Maker | #7C3AED | #6366F1 | #22C55E | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Meme & Sticker Maker | #EC4899 | #F59E0B | #2563EB | #FFFFFF | #0F172A | #FFFFFF | #FCE9F2 | #DC2626 |
| AI Photo & Avatar Generator | #7C3AED | #6366F1 | #EC4899 | #FAF5FF | #0F172A | #FFFFFF | #EFE7FC | #DC2626 |
| Link-in-Bio Page Builder | #2563EB | #7C3AED | #EC4899 | #FFFFFF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Wardrobe & Outfit Planner | #BE185D | #EC4899 | #D97706 | #FDF2F8 | #0F172A | #FFFFFF | #FBF1F5 | #DC2626 |
| Plant Care Tracker | #15803D | #059669 | #D97706 | #F0FDF4 | #0F172A | #FFFFFF | #E2EFE7 | #DC2626 |
| Book & Reading Tracker | #78716C | #92400E | #D97706 | #FFFBEB | #0F172A | #FFFFFF | #F6F6F6 | #DC2626 |
| Couple & Relationship App | #BE185D | #EC4899 | #DC2626 | #FDF2F8 | #0F172A | #FFFFFF | #FBF1F5 | #DC2626 |
| Family Calendar & Chores | #2563EB | #059669 | #D97706 | #F8FAFC | #0F172A | #FFFFFF | #F1F5FD | #DC2626 |
| Mood Tracker | #7C3AED | #6366F1 | #D97706 | #FAF5FF | #0F172A | #FFFFFF | #F7F3FD | #DC2626 |
| Gift & Wishlist | #DC2626 | #D97706 | #EC4899 | #FFF1F2 | #0F172A | #FFFFFF | #FAE4E4 | #DC2626 |
| Running & Cycling GPS | #EA580C | #F97316 | #059669 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Yoga & Stretching Guide | #6B7280 | #78716C | #0891B2 | #F5F5F0 | #0F172A | #FFFFFF | #EDEEEF | #DC2626 |
| Sleep Tracker | #4338CA | #6366F1 | #7C3AED | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Calorie & Nutrition Counter | #059669 | #10B981 | #EA580C | #ECFDF5 | #0F172A | #FFFFFF | #E1F2ED | #DC2626 |
| Period & Cycle Tracker | #BE185D | #EC4899 | #7C3AED | #FDF2F8 | #0F172A | #FFFFFF | #FBF1F5 | #DC2626 |
| Medication & Pill Reminder | #0284C7 | #0891B2 | #DC2626 | #F0F9FF | #0F172A | #FFFFFF | #E0F0F8 | #DC2626 |
| Water & Hydration Reminder | #0284C7 | #06B6D4 | #0891B2 | #F0F9FF | #0F172A | #FFFFFF | #E0F2F8 | #DC2626 |
| Fasting & Intermittent Timer | #6366F1 | #4338CA | #059669 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Anonymous Community / Confession | #475569 | #334155 | #0891B2 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Local Events & Discovery | #EA580C | #F97316 | #2563EB | #FFF7ED | #0F172A | #FFFFFF | #FCEAE1 | #DC2626 |
| Study Together / Virtual Coworking | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Coding Challenge & Practice | #22C55E | #059669 | #D97706 | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Kids Learning (ABC & Math) | #2563EB | #F59E0B | #EC4899 | #EFF6FF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Music Instrument Learning | #DC2626 | #9A3412 | #D97706 | #FFFBEB | #0F172A | #FFFFFF | #FCF1F1 | #DC2626 |
| Parking Finder | #2563EB | #059669 | #DC2626 | #F0F9FF | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Public Transit Guide | #2563EB | #0891B2 | #EA580C | #F8FAFC | #0F172A | #FFFFFF | #E4ECFC | #DC2626 |
| Road Trip Planner | #EA580C | #0891B2 | #D97706 | #FFF7ED | #0F172A | #FFFFFF | #FCEAE1 | #DC2626 |
| VPN & Privacy Tool | #1E3A5F | #334155 | #22C55E | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Emergency SOS & Safety | #DC2626 | #EF4444 | #2563EB | #FFF1F2 | #0F172A | #FFFFFF | #FAE4E4 | #DC2626 |
| Wallpaper & Theme App | #7C3AED | #EC4899 | #2563EB | #FAF5FF | #0F172A | #FFFFFF | #F7F3FD | #DC2626 |
| White Noise & Ambient Sound | #475569 | #334155 | #4338CA | #0F172A | #FFFFFF | #192134 | rgba(255,255,255,0.08) | #DC2626 |
| Home Decoration & Interior Design | #78716C | #A8A29E | #D97706 | #FAF5F2 | #0F172A | #FFFFFF | #F6F6F6 | #DC2626 |

> Full 18-token rows (including `On Primary`, `Muted Foreground`, `Ring`, and the WCAG
> adjustment notes) live in the source `data/colors.csv`. For PDF text-on-fill contrast,
> use the `On *` token of the matching row rather than guessing.
