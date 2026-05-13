export const quizzes = [
  {
    id: 'html',
    title: 'Quiz HTML Basics',
    subtitle: "Metti alla prova le tue conoscenze sulle basi dell'HTML",
    file: '/questions/html.json',
    icon: '🏗️',
    color: '#e44d26',
    topics: ['Tag', 'Attributi', 'Semantica', 'Link', 'Tabelle', 'Liste']
  },
  {
    id: 'intro',
    title: 'Quiz Intro Corso Web Development',
    subtitle: 'Metti alla prova le tue conoscenze sui concetti base del web development',
    file: '/questions/intro.json',
    icon: '🌐',
    color: '#6366f1',
    topics: ['Frontend', 'Backend', 'Server', 'Cloud', 'IP', 'DNS', 'VPN']
  },
  {
    id: 'css',
    title: 'Quiz CSS Basics',
    subtitle: 'Metti alla prova le tue conoscenze sui fondamenti del CSS',
    file: '/questions/css.json',
    icon: '🎨',
    color: '#3b82f6',
    topics: ['Selettori', 'Proprietà', 'Box Model', 'Unità di misura']
  },
  {
    id: 'flex',
    title: 'Quiz CSS Flexbox',
    subtitle: 'Metti alla prova le tue conoscenze su Flexbox',
    file: '/questions/flex.json',
    icon: '📐',
    color: '#8b5cf6',
    topics: ['Flex Container', 'Flex Items', 'Alignment', 'Direction']
  },
  {
    id: 'flexBasics',
    title: 'Quiz Flexbox Basics',
    subtitle: 'Impara i fondamenti di Flexbox',
    file: '/questions/flexbox-basics.json',
    icon: '📏',
    color: '#10b981',
    topics: ['Main Axis', 'Cross Axis', 'Flex Container', 'Flex Items']
  },
  {
    id: 'git',
    title: 'Quiz Git & Version Control',
    subtitle: 'Metti alla prova le tue conoscenze su Git',
    file: '/questions/git.json',
    icon: '🔀',
    color: '#f97316',
    topics: ['Commit', 'Branch', 'Merge', 'Remote']
  },
  {
    id: 'js-map-filter',
    title: 'Quiz JS map & filter',
    subtitle: 'Metti alla prova le tue conoscenze su map e filter in JS Vanilla',
    file: '/questions/js-map-filter.json',
    icon: '🔁',
    color: '#f59e0b',
    topics: ['map', 'filter', 'Array', 'Callback', 'Immutabilità']
  },
  {
    id: 'javascript',
    title: 'Quiz React useState',
    subtitle: 'Metti alla prova le tue conoscenze sugli stati in React',
    file: '/questions/react-usestate.json',
    icon: '⚛️',
    color: '#06b6d4',
    topics: ['useState', 'Re-render', 'Immutabilità', 'Array', 'Oggetti']
  },
  {
    id: 'react-useeffect',
    title: 'Quiz React useEffect',
    subtitle: 'Metti alla prova le tue conoscenze sul ciclo di vita e i side effects in React',
    file: '/questions/react-useeffect.json',
    icon: '⚡',
    color: '#7c3aed',
    topics: ['Mount/Unmount', 'Dipendenze', 'Cleanup', 'Side Effects', 'Timing', 'Memory Leak']
  },
  {
    id: 'react-router',
    title: 'Quiz React Router',
    subtitle: 'Metti alla prova le tue conoscenze su React Router',
    file: '/questions/react-router.json',
    icon: '🧭',
    color: '#e11d48',
    topics: ['BrowserRouter', 'Routes', 'NavLink', 'Outlet', 'useParams', 'useNavigate']
  },
  {
    id: 'react-router-2',
    title: 'Quiz React Router – Parte 2',
    subtitle: 'History API, navigazione imperativa, rotte private e CSS Modules',
    file: '/questions/react-router-2.json',
    icon: '🗺️',
    color: '#db2777',
    topics: ['History API', 'useNavigate', 'Navigate', 'PrivateRoute', 'CSS Modules', 'Rules of Hooks', 'useLocation', 'useSearchParams', 'NavLink end']
  }
]

export const quizMap = Object.fromEntries(quizzes.map(q => [q.id, q]))
