import { TimelineEvent } from './types';

export const COLORS = {
  primary: '#d4af37',
  bright: '#f4cf47',
  warm: '#c9a961',
  deep: '#b8943a',
  black: '#000000',
  overlayBg: 'rgba(0, 0, 0, 0.8)',
};

// The path is now a winding journey through space
// Coordinates expanded for a larger map feel (approx 250 units Z distance between events)
export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '2022',
    title: 'Foundation & First Steps',
    subtitle: "St. Xavier's College - Beginning",
    date: '2022',
    description: 'Started web development journey. Learned HTML5, CSS3, JavaScript basics. Practiced responsive design with Bootstrap and Tailwind. Built first static websites and established coding habits.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Tailwind'],
    position: [0, 0, -200],
  },
  {
    id: '2023-core',
    title: 'Algorithmic Thinking',
    subtitle: 'Academic Coursework - Core CS',
    date: '2023',
    description: 'Focused on C/C++ programming and data structures. Studied algorithms, complexity analysis, discrete math. Developed strong problem-solving foundation through academic projects and practice.',
    tags: ['C/C++', 'DSA', 'Algorithms', 'Mathematics'],
    position: [-50, 20, -450],
  },
  {
    id: '2023-react',
    title: 'Modern Web & React',
    subtitle: 'Framework Transition',
    date: '2023 - 2024',
    description: 'Transitioned to React and TypeScript. Learned component architecture, hooks, state management. Built interactive single-page applications with modern development patterns.',
    tags: ['React', 'TypeScript', 'Hooks', 'Components'],
    position: [60, -30, -700],
  },
  {
    id: '2024-backend',
    title: 'Backend & Systems',
    subtitle: 'Full-Stack Expansion',
    date: '2024',
    description: 'Expanded into Node.js and database systems. Studied computer networks, MySQL, Python. Built RESTful APIs and designed database schemas for web applications.',
    tags: ['Node.js', 'Python', 'MySQL', 'REST API', 'DBMS'],
    position: [-40, 40, -950],
  },
  {
    id: '2024-fullstack',
    title: 'Full-Stack Integration',
    subtitle: 'End-to-End Development',
    date: '2024',
    description: 'Connected frontend and backend. Implemented authentication, handled real-time data, deployed applications. Learned CI/CD basics and version control workflows.',
    tags: ['Full-Stack', 'Auth', 'Deployment', 'Git', 'CI/CD'],
    position: [30, -50, -1200],
  },
  {
    id: '2024-hackathon',
    title: 'SXC Sandbox Victory',
    subtitle: "St. Xavier's College Hackathon - 1st Place",
    date: '2024 - 2025',
    description: 'Achieved glory with team at Sandbox 2.0 hackathon. Built functional prototype in 24 hours. Collaborated effectively under pressure and presented technical solution to judges.',
    tags: ['Hackathon', 'Team', 'Prototyping', 'First Place'],
    position: [-70, 0, -1450],
  },
  {
    id: '2025-aiml',
    title: 'AI/ML Specialization',
    subtitle: 'Bootcamp Training',
    date: '2025',
    description: 'Intensive AI/ML bootcamp covering neural networks and computer vision. Learned OpenCV for image processing, explored NLP basics. Applied frameworks to practical problems.',
    tags: ['Python', 'OpenCV', 'Neural Networks', 'Vision', 'NLP'],
    position: [50, 60, -1700],
  },
  {
    id: '2025-projects',
    title: 'Chitragupta AI & Trade Heaven',
    subtitle: 'Project Development',
    date: '2025',
    description: 'Built Chitragupta AI, a RAG-based document assistant for intelligent responses. Developed Trade Heaven, a trading analytics tool. Focused on practical, user-friendly applications.',
    tags: ['RAG', 'LLM', 'FastAPI', 'React', 'Analytics'],
    position: [-20, -20, -1950],
  },
  {
    id: '2025-ccna',
    title: 'Cisco CCNA Training',
    subtitle: 'Network Infrastructure Bootcamp',
    date: '2025',
    description: 'Completed Cisco CCNA bootcamp. Studied networking fundamentals, routing protocols, TCP/IP. Enhanced understanding of how web applications communicate over networks.',
    tags: ['CCNA', 'Networking', 'TCP/IP', 'Cisco', 'Infrastructure'],
    position: [80, 30, -2200],
  },
  {
    id: 'present',
    title: 'Innovation & Impact',
    subtitle: 'Continuous Growth',
    date: 'Present',
    description: 'Exploring cutting-edge technologies in AI/ML and full-stack development. Contributing to projects, learning new tools, building solutions. The journey continues.',
    tags: ['AI/ML', 'Full-Stack', 'Open Source', 'Innovation'],
    position: [0, 0, -2450],
  },
];

export const Z_LIMIT = -2600; // Extended limit to fit all events
