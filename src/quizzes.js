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
  }
]

export const quizMap = Object.fromEntries(quizzes.map(q => [q.id, q]))
