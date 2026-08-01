import React, { useState } from 'react';
import '../../../components-css/Zone2.css';

const PROJECTS_DATA = {
  'first-year': [
    {
      name: 'Eco-Sort Smart Bin',
      icon: '♻️',
      year: '2024',
      tags: ['IoT', 'AI', 'Hardware'],
      shortDesc: 'Automatic waste segregation using real-time image recognition.',
      problemStatement: 'Improper waste segregation at the source leads to severe recycling inefficiencies and environmental harm, with over 60% of recyclables ending up in landfills.',
      solutionOverview: 'An IoT-enabled bin using real-time image recognition to automatically sort waste into recyclable, organic, and hazardous compartments using a Raspberry Pi and a trained CNN model.',
      techStack: ['Raspberry Pi', 'Google Coral', 'Python', 'React', 'TensorFlow Lite', 'OpenCV'],
      teamMembers: [
        { name: 'Noah Evans', role: 'Hardware Engineer', initials: 'NE', color: '#6366f1' },
        { name: 'Olivia Garcia', role: 'ML Engineer', initials: 'OG', color: '#10b981' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'IoT Smart Plant Waterer',
      icon: '💧',
      year: '2024',
      tags: ['IoT', 'Arduino', 'Automation'],
      shortDesc: 'Automated plant watering triggered by soil moisture sensors.',
      problemStatement: 'Houseplants frequently wither when owners travel or forget to water them on schedule, costing millions in replacements annually.',
      solutionOverview: 'A simple Arduino-based soil moisture monitoring system that triggers an automated micro-pump when dryness threshold is detected, with remote override via Bluetooth.',
      techStack: ['Arduino', 'C++', 'Soil Sensors', 'Micro-pump', 'Bluetooth LE'],
      teamMembers: [
        { name: 'Emma Watson', role: 'Embedded Systems', initials: 'EW', color: '#f59e0b' },
        { name: 'Rupert Grint', role: 'App Developer', initials: 'RG', color: '#ef4444' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'Campus Energy Monitor',
      icon: '⚡',
      year: '2024',
      tags: ['Web', 'Analytics', 'IoT'],
      shortDesc: 'Real-time energy usage dashboard for campus buildings.',
      problemStatement: 'Campus administrators lack real-time visibility into energy usage patterns, leading to significant wastage and high electricity bills.',
      solutionOverview: 'A networked smart-meter system with a React dashboard providing real-time energy analytics, historical trends, and anomaly alerts for department administrators.',
      techStack: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana', 'Raspberry Pi'],
      teamMembers: [
        { name: 'Arjun Mehta', role: 'Full-Stack Dev', initials: 'AM', color: '#06b6d4' },
        { name: 'Priya Singh', role: 'Data Analyst', initials: 'PS', color: '#8b5cf6' },
        { name: 'Rahul Das', role: 'IoT Engineer', initials: 'RD', color: '#10b981' },
      ],
      demoLink: 'https://example.com',
    },
  ],
  'mini': [
    {
      name: 'Smart Campus Navigator',
      icon: '🧭',
      year: '2024',
      tags: ['AR', 'Mobile', 'Unity'],
      shortDesc: 'AR-based indoor navigation for campus buildings.',
      problemStatement: 'Students and visitors frequently get lost while trying to find specific laboratories or classrooms in large, complex campus buildings.',
      solutionOverview: 'An interactive AR-based mobile application that helps individuals navigate indoor campus environments seamlessly using smartphone cameras and pre-mapped floor plans.',
      techStack: ['Unity', 'AR Foundation', 'C#', 'React Native', 'Node.js', 'Firebase'],
      teamMembers: [
        { name: 'Alice Johnson', role: 'AR Developer', initials: 'AJ', color: '#6366f1' },
        { name: 'Bob Smith', role: 'Backend Dev', initials: 'BS', color: '#10b981' },
        { name: 'Charlie Davis', role: 'UI/UX Designer', initials: 'CD', color: '#f59e0b' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'Sign2Text Translator',
      icon: '🧤',
      year: '2024',
      tags: ['Wearable', 'ML', 'Accessibility'],
      shortDesc: 'Glove that translates sign language to text in real-time.',
      problemStatement: 'There is a significant communication barrier between sign language users and non-users in everyday interactions, isolating the hearing-impaired community.',
      solutionOverview: 'A wearable glove equipped with flex sensors and accelerometers that translates ASL hand signs into text and speech in real-time via Bluetooth to a mobile app.',
      techStack: ['Arduino', 'Bluetooth LE', 'Flutter', 'Firebase', 'TensorFlow', 'Python'],
      teamMembers: [
        { name: 'Paul Vance', role: 'Hardware Lead', initials: 'PV', color: '#ec4899' },
        { name: 'Quinn Ahn', role: 'ML Engineer', initials: 'QA', color: '#06b6d4' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'Voice-Controlled Wheelchair',
      icon: '👩‍🦼',
      year: '2024',
      tags: ['Accessibility', 'NLP', 'Robotics'],
      shortDesc: 'Offline speech-controlled wheelchair for mobility assistance.',
      problemStatement: 'Physically challenged individuals find physical joystick controls exhausting and difficult to operate, reducing their independence.',
      solutionOverview: 'A localized offline speech-recognition controller that interfaces with wheelchair motors to execute direction commands without internet dependency.',
      techStack: ['Arduino', 'Python SpeechRecognition', 'H-Bridge Drivers', 'Raspberry Pi', 'PocketSphinx'],
      teamMembers: [
        { name: 'Sophia Miller', role: 'Robotics Engineer', initials: 'SM', color: '#f59e0b' },
        { name: 'Ryan Clark', role: 'NLP Developer', initials: 'RC', color: '#6366f1' },
      ],
      demoLink: 'https://example.com',
    },
  ],
  'capstone': [
    {
      name: 'AI Crop Disease Predictor',
      icon: '🌱',
      year: '2024',
      tags: ['Computer Vision', 'Drone', 'AI'],
      shortDesc: 'Drone-based CNN system predicting crop diseases weeks in advance.',
      problemStatement: 'Farmers suffer massive crop losses due to late detection of plant diseases before visual symptoms appear, resulting in billions in agricultural losses annually.',
      solutionOverview: 'A drone-based image capture system paired with a CNN model to predict diseases weeks in advance from subtle leaf discolorations invisible to the naked eye.',
      techStack: ['Python', 'TensorFlow', 'React', 'AWS EC2', 'OpenCV', 'DJI SDK', 'PostgreSQL'],
      teamMembers: [
        { name: 'Ivy Kim', role: 'ML Research Lead', initials: 'IK', color: '#10b981' },
        { name: 'Jack Martinez', role: 'Drone Systems', initials: 'JM', color: '#6366f1' },
        { name: 'Ken Adams', role: 'Cloud Architect', initials: 'KA', color: '#f59e0b' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'Decentralized Voting System',
      icon: '🗳️',
      year: '2024',
      tags: ['Blockchain', 'Web3', 'Security'],
      shortDesc: 'Blockchain-based e-voting for transparent university elections.',
      problemStatement: 'Current electronic voting systems are vulnerable to tampering and lack transparent verification mechanisms for voters to verify their own votes.',
      solutionOverview: 'A blockchain-based e-voting platform ensuring anonymous, verifiable, and immutable votes using smart contracts on Ethereum, with a user-friendly Next.js frontend.',
      techStack: ['Solidity', 'Ethereum', 'Next.js', 'Web3.js', 'IPFS', 'MetaMask'],
      teamMembers: [
        { name: 'Liam Brown', role: 'Blockchain Dev', initials: 'LB', color: '#6366f1' },
        { name: 'Mia Chen', role: 'Frontend Dev', initials: 'MC', color: '#ec4899' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'Autonomous Delivery Rover',
      icon: '🤖',
      year: '2024',
      tags: ['Robotics', 'SLAM', 'Computer Vision'],
      shortDesc: 'LiDAR-guided self-navigating campus delivery robot.',
      problemStatement: 'Last-mile package and mail distribution within large corporate or academic campuses is highly resource-intensive and time-consuming.',
      solutionOverview: 'A self-navigating electric rover using LiDAR-based SLAM and computer vision to deliver packages autonomously while avoiding dynamic obstacles in real time.',
      techStack: ['ROS', 'LiDAR', 'OpenCV', 'Python', 'C++', 'SLAM', 'Raspberry Pi 4'],
      teamMembers: [
        { name: 'Ethan Hunt', role: 'Robotics Lead', initials: 'EH', color: '#ef4444' },
        { name: 'Benji Dunn', role: 'Computer Vision', initials: 'BD', color: '#06b6d4' },
        { name: 'Sara Ross', role: 'ROS Engineer', initials: 'SR', color: '#8b5cf6' },
      ],
      demoLink: 'https://example.com',
    },
  ],
  'hackathon': [
    {
      name: 'MedConnect Disaster Relief',
      icon: '🏥',
      year: '2024',
      tags: ['BLE Mesh', 'Offline-first', 'Emergency'],
      shortDesc: 'Offline Bluetooth-mesh app for disaster victim mapping.',
      problemStatement: 'During natural disasters, centralized cellular networks collapse, preventing emergency responders from locating victims or coordinating relief efforts.',
      solutionOverview: 'A decentralized Bluetooth-mesh messaging app that maps victim locations and medical statuses without any internet connection, syncing when connectivity resumes.',
      techStack: ['Flutter', 'BLE Mesh API', 'SQLite', 'Node.js', 'Dart', 'OpenStreetMap'],
      teamMembers: [
        { name: 'Alex Mercer', role: 'Mobile Lead', initials: 'AM', color: '#f59e0b' },
        { name: 'Clara Oswald', role: 'BLE Systems', initials: 'CO', color: '#10b981' },
      ],
      demoLink: 'https://example.com',
    },
    {
      name: 'AR Interactive Chemistry Lab',
      icon: '🧪',
      year: '2024',
      tags: ['AR', 'EdTech', 'Unity'],
      shortDesc: 'Augmented reality sandbox for 3D molecular chemistry reactions.',
      problemStatement: 'Traditional chemistry classes fail to convey complex 3D spatial interactions of elements, making abstract concepts difficult to grasp for most students.',
      solutionOverview: 'An immersive AR sandbox where students scan physical element cards to see molecular reactions and compound formations appear in 3D, layered over the real world.',
      techStack: ['Unity', 'Vuforia SDK', 'C#', 'Android', 'Blender', 'Firebase'],
      teamMembers: [
        { name: 'Tony Stark', role: 'AR Architect', initials: 'TS', color: '#ef4444' },
        { name: 'Bruce Banner', role: '3D Modeler', initials: 'BB', color: '#6366f1' },
        { name: 'Natasha R.', role: 'UX Lead', initials: 'NR', color: '#ec4899' },
      ],
      demoLink: 'https://example.com',
    },
  ],
};

const sanitizeIcon = (icon) => {
  if (!icon) return '';
  return icon.replace(/[^ -]/g, '') || '•';
};

const CategoryPage = ({ category, onBack, onProjectClick }) => {
  const projects = PROJECTS_DATA[category.id] || [];
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="z2-catpage slide-up">
      {/* Page header */}
      <div className="z2-catpage-header" style={{ '--accent': category.accentColor }}>
        <div className="z2-catpage-meta">
          <span className="z2-catpage-num">{category.number}</span>
          <div>
            <span className="z2-catpage-eyebrow" style={{ color: category.accentColor }}>
              {category.count} Active Projects
            </span>
            <h1 className="z2-catpage-title">{category.name}</h1>
            <p className="z2-catpage-desc">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Project list */}
      <div className="z2-project-list">
        {projects.map((proj, i) => (
          <button
            key={i}
            className={`z2-proj-row ${hoveredIdx === i ? 'hovered' : ''}`}
            style={{ '--accent': category.accentColor, animationDelay: `${i * 0.07}s` }}
            onClick={() => onProjectClick(proj)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="z2-proj-row-left">
              <span className="z2-proj-idx">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="z2-proj-icon-sm">{sanitizeIcon(proj.icon)}</span>
              <div className="z2-proj-info">
                <span className="z2-proj-name">{proj.name}</span>
                <span className="z2-proj-short">{proj.shortDesc}</span>
              </div>
            </div>
            <div className="z2-proj-row-right">
              <div className="z2-proj-tags">
                {proj.tags.map((tag, ti) => (
                  <span key={ti} className="z2-proj-tag" style={{ borderColor: `${category.accentColor}30`, color: category.accentColor }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="z2-proj-arrow" style={{ color: category.accentColor }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { PROJECTS_DATA };
export default CategoryPage;
