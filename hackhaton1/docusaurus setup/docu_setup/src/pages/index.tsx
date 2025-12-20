import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures, { ChapterList } from '@site/src/components/HomepageFeatures';
import ChatbotWidget from '@site/src/components/ChatbotWidget';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Dynamic stats - chapters count is derived from ChapterList
const getStats = () => [
  { number: ChapterList.length, label: 'Chapters', suffix: '' },
  { number: 8, label: 'Workflows', suffix: '' },
  { number: 30, label: 'Questions', suffix: '' },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const stats = getStats();

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroOverlay}></div>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Physical AI & Humanoid Robotics
          </Heading>
          <p className={styles.heroSubtitle}>
            Explore the fusion of AI and robotics to create intelligent machines
            that interact with the physical world like humans.
          </p>
          <div className={styles.buttons}>
            <Link
              className={styles.heroButton}
              to="/docs/chapter-1-intro-physical-ai">
              Start Reading - Physical AI & Humanoid Robotics
            </Link>
          </div>

          {/* Stats Section */}
          <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingOrb1}></div>
        <div className={styles.floatingOrb2}></div>
        <div className={styles.floatingOrb3}></div>
      </div>
    </header>
  );
}

export default function Home(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="A comprehensive textbook on Physical AI, ROS 2, simulation, NVIDIA Isaac, and Vision-Language-Action systems">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <HomepageFeatures />
      </main>
      <ChatbotWidget />
    </Layout>
  );
}
