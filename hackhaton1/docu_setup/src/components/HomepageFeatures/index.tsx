import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ChapterItem = {
  title: string;
  icon: string;
  description: string;
  link: string;
  gradient: string;
};

// Exported so it can be used for dynamic chapter count in stats
export const ChapterList: ChapterItem[] = [
  {
    title: 'Introduction to Physical AI',
    icon: '🤖',
    description: 'Understand the fundamentals of Physical AI and how robots bridge the gap between digital intelligence and real-world interaction.',
    link: '/docs/chapter-1-intro-physical-ai',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'The Robotic Nervous System (ROS 2)',
    icon: '🧠',
    description: 'Master ROS 2, the communication backbone connecting perception, planning, and control in modern robotic systems.',
    link: '/docs/chapter-2-ros-nervous-system',
    gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  },
  {
    title: 'Digital Twin and Simulation',
    icon: '🌐',
    description: 'Build physics-based simulations with NVIDIA Isaac Sim and Gazebo. Generate synthetic data and bridge the sim-to-real gap.',
    link: '/docs/chapter-3-digital-twin-simulation',
    gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  },
  {
    title: 'The AI-Robot Brain (NVIDIA Isaac)',
    icon: '⚡',
    description: 'Leverage NVIDIA Isaac for GPU-accelerated robotics, from perception pipelines to motion planning and control.',
    link: '/docs/chapter-4-ai-robot-brain',
    gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
  },
  {
    title: 'Vision-Language-Action Systems',
    icon: '👁️',
    description: 'Explore VLA models and foundation models that enable robots to understand instructions and generalize to new tasks.',
    link: '/docs/chapter-5-vla-systems',
    gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
  },
];

function ChapterCard({ title, icon, description, link, gradient }: ChapterItem) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardIconWrapper} style={{ background: gradient }}>
          <span className={styles.cardIcon}>{icon}</span>
        </div>
        <div className={styles.cardContent}>
          <Heading as="h3" className={styles.cardTitle}>
            {title}
          </Heading>
          <p className={styles.cardDescription}>{description}</p>
          <Link to={link} className={styles.cardButton}>
            Start Chapter
            <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Course Chapters
          </Heading>
          <p className={styles.sectionSubtitle}>
            Dive deep into the key pillars of Physical AI and Humanoid Robotics
          </p>
        </div>
        <div className={styles.cardsGrid}>
          {ChapterList.map((props, idx) => (
            <ChapterCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
