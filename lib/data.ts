export interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
  stargazers_count?: number;
  forks_count?: number;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  imageUrl?: string;
}

export const mockRepos: Repo[] = [
  {
    id: 1,
    name: 'autonomous-drone-nav',
    description: 'Deep learning based autonomous navigation system for quadcopters using PyTorch and ROS.',
    html_url: 'https://github.com/Slayr/autonomous-drone-nav',
    language: 'Python',
    updated_at: new Date().toISOString(),
    stargazers_count: 14,
    forks_count: 3,
  },
  {
    id: 2,
    name: 'stratbeans-api',
    description: 'Scalable enterprise backend services built with ExpressJS and PostgreSQL.',
    html_url: 'https://github.com/Slayr/stratbeans-api',
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    stargazers_count: 5,
    forks_count: 1,
  },
  {
    id: 3,
    name: 'bio-stat-predictor',
    description: 'Machine learning models for predicting patient outcomes based on clinical data.',
    html_url: 'https://github.com/Slayr/bio-stat-predictor',
    language: 'Jupyter Notebook',
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    stargazers_count: 8,
    forks_count: 2,
  }
];

export const mockPhotos: Photo[] = [
  { id: '1', url: 'https://picsum.photos/seed/photo1/800/800', title: 'Urban Geometry', description: 'Concrete and glass reflections.', createdAt: new Date().toISOString() },
  { id: '2', url: 'https://picsum.photos/seed/photo2/800/600', title: 'Neon Nights', description: 'Cyberpunk vibes in the city.', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', url: 'https://picsum.photos/seed/photo3/600/800', title: 'Minimalist Workspace', description: 'Clean desk setup.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '4', url: 'https://picsum.photos/seed/photo4/1200/600', title: 'Abstract Architecture', description: 'Brutalist structures.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'De-centralized Autonomous Systems in Drone Swarms',
    content: 'Exploring the boundary between local edge computation and swarm consensus models. Using ROS2 and PyTorch for local obstacle avoidance and coordination dynamics. Solid concrete structures demand solid local computation systems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Industrial Web Synthesis & Brutalist Aesthetics',
    content: 'Neo-Brutalism is not just a styling choice; it is a declaration of code transparency. Thick black borders, raw layout structures, and high contrast typography reflect system realism.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    title: 'Machine Learning on Edge Architectures',
    content: 'Running quantized tensor models on low power microcontrollers. Investigating latency variables under raw metal optimization.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export interface Skill {
  label: string;
  category: string;
}

export const cvSkills: Skill[] = [
  { label: 'Python', category: 'Languages' },
  { label: 'R', category: 'Languages' },
  { label: 'SQL', category: 'Languages' },
  { label: 'C++', category: 'Languages' },
  { label: 'Java', category: 'Languages' },
  { label: 'Javascript', category: 'Languages' },
  { label: 'TypeScript', category: 'Languages' },
  { label: 'PHP', category: 'Languages' },
  { label: 'Go', category: 'Languages' },
  { label: 'Bash', category: 'Languages' },
  { label: 'Laravel', category: 'Frameworks' },
  { label: 'React', category: 'Frameworks' },
  { label: 'Next.js', category: 'Frameworks' },
  { label: 'Express', category: 'Frameworks' },
  { label: 'Node.js', category: 'Frameworks' },
  { label: 'FastAPI', category: 'Frameworks' },
  { label: 'PostgreSQL', category: 'Frameworks' },
  { label: 'MongoDB', category: 'Frameworks' },
  { label: 'Redis', category: 'Frameworks' },
  { label: 'Docker', category: 'Frameworks' },
  { label: 'Apache', category: 'Frameworks' },
  { label: 'NGINX', category: 'Frameworks' },
  { label: 'Svelte', category: 'Frameworks' },
  { label: 'Tailwind CSS', category: 'Frameworks' },
  { label: 'PyTorch', category: 'AI & ML' },
  { label: 'TensorFlow', category: 'AI & ML' },
  { label: 'scikit-learn', category: 'AI & ML' },
  { label: 'OpenCV', category: 'AI & ML' },
  { label: 'HuggingFace', category: 'AI & ML' },
  { label: 'CNNs', category: 'AI & ML' },
  { label: 'NLP', category: 'AI & ML' },
  { label: 'Deep Learning', category: 'AI & ML' },
  { label: 'Computer Vision', category: 'AI & ML' },
  { label: 'RL', category: 'AI & ML' },
  { label: 'YOLOv8', category: 'AI & ML' },
  { label: 'ROS2', category: 'AI & ML' },
  { label: 'Transformers', category: 'AI & ML' },
  { label: 'Git', category: 'Tools' },
  { label: 'AWS', category: 'Tools' },
  { label: 'GCP', category: 'Tools' },
  { label: 'Power BI', category: 'Tools' },
  { label: 'Tableau', category: 'Tools' },
  { label: 'Linux', category: 'Tools' },
];

export const experiences = [
  {
    role: "SDE Intern",
    company: "Stratbeans",
    duration: "July 2024 — Dec 2024",
    location: "Gurgaon, India",
    summary: "Full-stack development on enterprise Learning Management System serving 10K+ users.",
    highlights: [
      "Built and shipped 12+ Laravel modules for course management, analytics dashboards, and user onboarding flows.",
      "Prototyped responsive UI components using Tailwind CSS, reducing page load times by 35%.",
      "Integrated RESTful APIs with PostgreSQL backend for real-time progress tracking.",
    ],
    stack: ['PHP', 'Laravel', 'PostgreSQL', 'Tailwind CSS', 'REST API'],
    color: 'bg-neo-orange',
  },
  {
    role: "Senior Intern",
    company: "HopDrones",
    duration: "July 2023 — Nov 2023",
    location: "Remote",
    summary: "Computer vision R&D for autonomous drone surveillance and object tracking systems.",
    highlights: [
      "Led a team of 4 interns on motion detection pipeline development using YOLOv8 and ByteTrack.",
      "Achieved 94% mAP on custom aerial object detection dataset with real-time inference at 30 FPS.",
      "Designed ROS2 integration for autonomous waypoint navigation on DJI Tello EDU drones.",
    ],
    stack: ['Python', 'PyTorch', 'YOLOv8', 'ROS2', 'OpenCV', 'C++'],
    color: 'bg-neo-cyan',
  },
  {
    role: "Campus Ambassador",
    company: "Gemini Solutions",
    duration: "2022 — May 2025",
    location: "NorthCap University",
    summary: "Corporate liaison and brand representative driving tech community engagement on campus.",
    highlights: [
      "Organized 5+ technical workshops and hackathon events reaching 200+ students.",
      "Managed social media campaigns increasing event participation by 60%.",
      "Coordinated with HR and engineering teams for campus recruitment drives.",
    ],
    stack: ['Community', 'Event Management', 'Outreach'],
    color: 'bg-neo-green',
  }
];

export const education = [
  {
    degree: "B.Tech Computer Science & Engineering",
    specialization: "Artificial Intelligence & Machine Learning",
    school: "NorthCap University",
    location: "Gurgaon, Haryana",
    status: "Completed",
    duration: "2021 — 2025",
    highlights: [
      "Specialized coursework in Deep Learning, NLP, Computer Vision, and Reinforcement Learning.",
      "Capstone project: Autonomous drone navigation system using deep RL and ROS.",
      "Published research on edge-optimized CNN architectures for embedded systems.",
    ],
    color: 'bg-neo-pink',
  },
  {
    degree: "M.Sc Data Science",
    specialization: "Applied Statistics & Machine Learning",
    school: "Manipal Academy of Higher Education (PSPH)",
    location: "Online / Manipal",
    status: "In Progress",
    duration: "2025 — Present",
    highlights: [
      "Advanced coursework in Bayesian inference, time-series forecasting, and causal modeling.",
      "Research focus: Large-scale biostatistical modeling for clinical trial outcomes.",
    ],
    color: 'bg-neo-purple',
  }
];

export const JOURNAL_CARD_COLORS = [
  'bg-neo-pink text-white',
  'bg-neo-orange text-white',
  'bg-neo-purple text-white',
];

export const PHOTO_STAMP_COLORS = [
  'bg-neo-yellow text-black border-neo-yellow',
  'bg-neo-cyan text-black border-neo-cyan',
  'bg-neo-green text-black border-neo-green',
  'bg-neo-pink text-white border-neo-pink',
];

export const PHOTO_CARD_COLORS = [
  'bg-neo-yellow text-black border-black',
  'bg-neo-cyan text-black border-black',
  'bg-neo-green text-black border-black',
  'bg-neo-pink text-white border-black',
];
