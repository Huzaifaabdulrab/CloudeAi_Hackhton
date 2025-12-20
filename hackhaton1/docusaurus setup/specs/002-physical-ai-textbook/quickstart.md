# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

## Getting Started

This guide will help you set up the development environment for the Physical AI & Humanoid Robotics textbook project.

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control
- Text editor or IDE (VS Code recommended)
- Basic knowledge of Markdown and JavaScript/React (for custom components)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd docu_setup
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run start
   # or
   yarn start
   ```

4. Open your browser to `http://localhost:3000` to view the textbook.

### Project Structure

The textbook content is organized in 6 main chapters, each with supporting materials:

- `docs/chapter-1-intro-physical-ai/` - Introduction to Physical AI and Embodied Intelligence
- `docs/chapter-2-ros2/` - ROS 2 and its implementation in humanoid robots
- `docs/chapter-3-digital-twin/` - Digital Twin with Gazebo and Unity simulation
- `docs/chapter-4-nvidia-isaac/` - NVIDIA Isaac AI Platform applications
- `docs/chapter-5-vla/` - Vision-Language-Action systems
- `docs/chapter-6-capstone/` - Capstone project with simulated humanoid robot

### Adding New Content

To create a new page or document:

```bash
npm run create-doc -- --name "new-document-name"
# or manually create a new .md/.mdx file in the docs/ directory
```

### Building for Production

To create a production build of the textbook:

```bash
npm run build
```

This will generate a `build/` directory with statically rendered HTML that can be deployed to any web server.

### Local Development

During development, use:

```bash
npm run start
```

This command starts a local server with hot reloading, allowing you to see changes as you edit the content in real-time.

### Custom Components

The textbook includes several custom React components to enhance learning:

- Interactive code examples
- Diagrams and visualizations
- Assessment tools
- Navigation aids

These components can be found in `src/components/` and can be included in any document using standard React import syntax.

### Content Guidelines

When adding content to the textbook, follow these guidelines:

- Each chapter should be self-contained but clearly indicate prerequisites
- Include practical examples with code snippets
- Provide exercises for hands-on learning
- Use clear, accessible language
- Add visual aids where appropriate
- Include alt text for all images to ensure accessibility

### Troubleshooting

If you encounter issues during setup:

1. Ensure you have the correct Node.js version (18+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. Check that you're in the correct directory (docu_setup/)