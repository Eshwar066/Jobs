# Eshwar — Portfolio

A distinctive, premium personal portfolio showcasing 3+ years of frontend engineering experience in fintech/wealth management, with a focus on real-time systems and AI/GenAI exploration.

## 🎯 Highlights

- **Senior Frontend Engineer** at Nuvama Wealth (2+ years)
- **Fintech Domain Expertise**: Equity trading, NCD platforms, IPO systems
- **Real-time Systems**: WebSocket infrastructure, sub-100ms latency
- **AI/GenAI Explorer**: Building RAG systems, AI agents, LLM applications
- **Full-stack Growth**: Python, FastAPI, PostgreSQL, vector databases

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animation**: Framer Motion
- **Fonts**: DM Sans, Space Grotesk, JetBrains Mono
- **Icons**: Lucide React

## 🎨 Design System

### Color Palette
- **Primary**: Wealth Gold (`#F59E0B`) — Fintech heritage
- **Accent**: Tech Cyan (`#06B6D4`) — AI/innovation
- **Background**: Deep charcoal (`#0F1115`) — Premium dark mode
- **Semantic tokens** for consistent theming

### Typography
- **Display**: Space Grotesk — Technical, distinctive headlines
- **Body**: DM Sans — Highly readable, modern
- **Mono**: JetBrains Mono — Code, technical content

### Spacing System
- Base unit: 4px (0.25rem)
- Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48
- Container max-width: 1400px (2xl)

### Animation Philosophy
- **Restrained**: One orchestrated entrance per section
- **Purposeful**: Motion answers user actions
- **Respectful**: `prefers-reduced-motion` honored
- **Performance**: Transform/opacity only, 60fps target

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main page composition
├── components/
│   ├── layout/
│   │   ├── header.tsx       # Navigation header
│   │   └── footer.tsx       # Site footer
│   ├── sections/
│   │   ├── hero.tsx         # Hero with animated terminal
│   │   ├── experience.tsx   # Work experience timeline
│   │   ├── projects.tsx     # Project showcase with tabs
│   │   ├── skills.tsx       # Skills with progress bars
│   │   ├── about.tsx        # Values & current focus
│   │   └── contact.tsx      # Contact form & links
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── portfolio-data.ts    # All portfolio content
│   └── utils.ts             # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Key Features

### Hero Section
- Animated terminal showing tech stack
- Floating gradient orbs for depth
- Staggered entrance animations
- Key metrics with icons

### Experience
- Interactive cards with product details
- Achievement highlights with checkmarks
- Technology badges
- Responsive horizontal layout

### Projects
- Tabbed interface (Featured / All)
- Category-coded badges
- Tech stack tags
- Links to code, demos, case studies

### Skills
- Category tabs (Frontend, Backend, AI, Fintech)
- Progress bars with proficiency levels
- Certifications & speaking engagements

### About
- Core values with descriptions
- Currently exploring grid
- Statistics showcase

### Contact
- Functional contact form
- Social links with hover effects
- Location card

## ♿ Accessibility

- Semantic HTML5 landmarks
- ARIA labels & roles
- Focus-visible outlines
- Color contrast ratios (WCAG AA)
- Reduced motion support
- Skip to main content link
- Screen reader optimized

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1400px
- **Wide**: > 1400px

## 🔧 Customization

### Updating Content
Edit `src/lib/portfolio-data.ts` to modify:
- Personal information
- Experience details
- Projects
- Skills & proficiency levels
- Certifications
- Speaking engagements

### Theme Colors
Modify CSS variables in `src/app/globals.css`:
```css
:root {
  --primary: 38 92% 50%;      /* Wealth gold */
  --accent: 188 94% 43%;      /* Tech cyan */
  --background: 220 25% 5%;   /* Deep charcoal */
  /* ... */
}
```

### Fonts
Change font imports in `src/app/layout.tsx`:
```typescript
const dmSans = DM_Sans({ ... });
const spaceGrotesk = Space_Grotesk({ ... });
const jetbrainsMono = JetBrains_Mono({ ... });
```

## 📄 License

MIT License — feel free to use as inspiration for your own portfolio.

## 🤝 Connect

- **Email**: eshwar@example.com
- **LinkedIn**: [linkedin.com/in/eshwar](https://linkedin.com/in/eshwar)
- **GitHub**: [github.com/eshwar](https://github.com/eshwar)
- **Twitter**: [@eshwar](https://twitter.com/eshwar)

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and shadcn/ui