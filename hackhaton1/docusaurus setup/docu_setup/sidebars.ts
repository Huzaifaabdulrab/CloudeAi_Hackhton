import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Physical AI Fundamentals - Sidebar Configuration
 *
 * This configuration defines the navigation structure for the textbook.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapters',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 1: Introduction to Physical AI',
          link: {
            type: 'doc',
            id: 'chapter-1-intro-physical-ai/index',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Chapter 2: The Robotic Nervous System (ROS 2)',
          link: {
            type: 'doc',
            id: 'chapter-2-ros-nervous-system/index',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Chapter 3: Digital Twin and Simulation',
          link: {
            type: 'doc',
            id: 'chapter-3-digital-twin-simulation/index',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Chapter 4: The AI-Robot Brain (NVIDIA Isaac)',
          link: {
            type: 'doc',
            id: 'chapter-4-ai-robot-brain/index',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Chapter 5: Vision-Language-Action Systems',
          link: {
            type: 'doc',
            id: 'chapter-5-vla-systems/index',
          },
          items: [],
        },
      ],
    },
  ],
};

export default sidebars;
