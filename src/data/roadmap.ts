import type { RoadmapPhase } from '@/types/schedule'

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: 'PHASE 1', status: 'active',
    title: 'HTML & CSS Foundations', weeks: 'Weeks 1–4 (Current)',
    items: ['Semantic HTML5', 'CSS Flexbox', 'CSS Grid', 'Responsive Design', 'CSS Variables', 'Box Model'],
    activeItems: ['CSS Grid', 'Responsive Design'],
  },
  {
    phase: 'PHASE 2', status: 'upcoming',
    title: 'JavaScript Core', weeks: 'Weeks 5–10',
    items: ['ES6+ Syntax', 'DOM Manipulation', 'Events & Forms', 'Fetch API', 'Async/Await', 'LocalStorage'],
    activeItems: [],
  },
  {
    phase: 'PHASE 3', status: 'upcoming',
    title: 'React Fundamentals', weeks: 'Weeks 11–18',
    items: ['JSX & Components', 'Props & State', 'useEffect', 'Context API', 'React Router', 'Custom Hooks'],
    activeItems: [],
  },
  {
    phase: 'PHASE 4', status: 'upcoming',
    title: 'Tooling & Ecosystem', weeks: 'Weeks 19–24',
    items: ['Vite/Webpack', 'TypeScript', 'Git Advanced', 'Testing', 'Tailwind CSS', 'Storybook'],
    activeItems: [],
  },
  {
    phase: 'PHASE 5', status: 'upcoming',
    title: 'Advanced & Portfolio', weeks: 'Weeks 25–32',
    items: ['Next.js', 'Performance', 'Accessibility', 'CI/CD', '3 Portfolio Projects'],
    activeItems: [],
  },
]
