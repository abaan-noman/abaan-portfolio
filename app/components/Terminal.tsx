'use client';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, useDragControls } from 'framer-motion';

interface TerminalProps {
  title?: string;
}

interface CommandOutput {
  type: 'input' | 'output';
  text: string | React.ReactNode;
}

interface Project {
  name: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  liveUrl?: string;
}

const Terminal = forwardRef<any, TerminalProps>(({ title = 'Terminal' }, ref) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    { 
      type: 'output', 
      text: "Welcome to Abaan Noman's portfolio terminal.\nType 'help' to see available commands."
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('Terminal');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [zIndex, setZIndex] = useState(50);
  const [projectsZIndex, setProjectsZIndex] = useState(60);

  const projects: Project[] = [
    {
      name: 'CUExaminer',
      description: 'A full-stack web application that enhanced academic experiences of 700+ Carleton University students. Utilized PostgreSQL for data storage, Spring Boot for a RESTful API backend, and ReactJS for the user interface.',
      image: '/cuexaminer.jpg',
      technologies: ['React', 'Spring Boot', 'PostgreSQL', 'Docker'],
      link: 'https://github.com/abaan-noman/carleton-examiner-backend',
      liveUrl: 'https://cuexaminer.netlify.app/'
    },
    {
      name: 'DataWhisk',
      description: 'A neural network based sentiment analysis tool for a bakery using BERT and PyTorch, leading to a 10% increase in sales and saving 14% per month in ingredient costs. Built an automated web scraping system collecting 1,350+ customer reviews.',
      image: '/datawhisk.jpg',
      technologies: ['Python', 'PyTorch', 'NodeJS', 'Playwright'],
      link: 'https://github.com/abaan-noman/DataWhisk'
    },
    {
      name: 'Ligalytics',
      description: 'Soccer player stats analysis application that scraped and analyzed 450+ soccer players stats using Python and Pandas, integrating them into a Spring Boot app for visualization and data-driven insights.',
      image: '/ligalytics.jpg',
      technologies: ['Pandas', 'Spring Boot', 'Python'],
      link: 'https://github.com/abaan-noman/Ligalytics',
      liveUrl: 'https://laligalytics.vercel.app/'
    },
    {
      name: 'Wearhouse',
      description: 'A scalable used clothing marketplace built using Go, React, TypeScript, and PostgreSQL, enabling seamless product listings, transactions, and authentication. Integrated JWT authentication and Stripe payments.',
      image: '/wearhouse.jpg',
      technologies: ['Go', 'React', 'TypeScript', 'PostgreSQL'],
      link: 'https://github.com/abaan-noman/Wearhouse',
      liveUrl: 'https://wearhouse-brown.vercel.app/'
    }
  ];

  const scrollToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;

    if (direction === 'up') {
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
    } else {
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex] || '');
    }
  };

  const addToHistory = (cmd: string, output: string | React.ReactNode) => {
    setHistory((prev) => [
      ...prev,
      { type: 'input', text: cmd },
      { type: 'output', text: output },
    ]);

    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }
  };

  const formatOutput = (output: string): React.ReactNode => {
    // Handle multiline text
    return (
      <>
        {output.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < output.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  };

  // User information based on resume
  const userInfo = `User Information
------------------
Name: Abaan Noman
GitHub: github.com/abaan-noman
LinkedIn: linkedin.com/in/abaan-noman
Location: Ottawa, ON, Canada

Current Status: Studying CS @ Carleton University
Expected Graduation: May 2027`;

  const helpOutput = `Available commands
------------------
- help: Show this help message
- clear: Clear the terminal
- whoami: Display information about me
- about: About me and my background
- contact: Contact information
- resume: Download my resume
- open projects: Show all projects
- open [project]: Open a project's GitHub`;

  const aboutOutput = `About Me
------------------
I'm a Computer Science student at Carleton University with a minor in Mathematics.
I like building applications that solve real-world problems.

Experience:
• Incoming Software Engineer Intern @ Warner Bros. Discovery (May 2025)
• Founding Engineer at Wearhouse (April 2025 - Present)
• Teaching Assistant @ Carleton University (Sep 2024 - Dec 2024)`;

  const contactOutput = `Contact Information
------------------
Email: abaan1@yahoo.com
GitHub: github.com/abaan-noman
LinkedIn: linkedin.com/in/abaan-noman`;

  const educationOutput = `
Education
------------------
Carleton University
Honours Bachelor of Computer Science | Minor Math
• GPA: 3.94
• Expected Graduation: May 2027

Relevant Coursework:
• Data Structures and Algorithms
• Object-Oriented Programming
• Software Engineering
• Discrete Math
• Systems Programming
• Database Management Systems
`;

  const experienceOutput = `
Work Experience
------------------
Warner Bros. Discovery
Software Engineer Intern
• Incoming Software Engineer Intern at Warner Bros. Discovery
• Starting May 2025

Carleton University
Teaching Assistant - Calculus
• Sep 2024 - Dec 2024
• Facilitated learning for 100+ undergraduate students
• Graded 50+ quizzes and assignments
• Contributed to 20% improvement in student performance

Leadership
------------------
Founding Engineer, Wearhouse
• May 2025 - Present
• Built scalable used clothing marketplace using Go, React, TypeScript, and PostgreSQL
• Integrated JWT auth, Stripe payments, and Cloudinary storage
• Automated testing with Python scripting and deployed using Docker
`;

  const projectsOutput = `
Projects
------------------
1. CUExaminer
   • Full-stack web app for Carleton University students
   • ReactJS, Spring Boot, PostgreSQL, Docker
   • Deployed on AWS EC2
   • Used by 700+ students

2. DataWhisk
   • Neural network based sentiment analysis tool
   • Python, NodeJS, PyTorch, Scikit-learn, Playwright
   • Increased client sales by 10%
   • Automated web scraping of 1,350+ customer reviews

3. Ligalytics
   • Soccer player stats analysis application
   • Pandas, Spring Boot, Python
   • Analyzed 450+ soccer players statistics

4. Wearhouse
   • Scalable used clothing marketplace
   • Go, React, TypeScript, PostgreSQL
   • Integrated JWT auth, Stripe payments, and Cloudinary storage

Type 'open projects' to view project details.
`;

  const skillsOutput = `
Technical Skills
------------------
Languages: Python, Java, Go, JavaScript, C, C++, SQL, HTML, CSS
Developer Tools: AWS, Docker, Postman, Git, VirtualBox, Jira
Libraries/Frameworks: Spring Boot, ReactJS, NextJS, NodeJS, PostgreSQL, PyTorch, OpenCV, Pandas
`;

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const args = command.split(' ');
    const primaryCommand = args[0];

    switch (primaryCommand) {
      case 'help':
        addToHistory(cmd, formatOutput(helpOutput));
        break;
      case 'clear':
        setHistory([
          { 
            type: 'output', 
            text: "Type 'help' to see available commands."
          }
        ]);
        break;
      case 'whoami':
        addToHistory(cmd, formatOutput(userInfo));
        break;
      case 'about':
        addToHistory(cmd, formatOutput(aboutOutput));
        break;
      case 'contact':
        addToHistory(cmd, formatOutput(contactOutput));
        break;
      case 'resume':
        addToHistory(cmd, 'Downloading resume...');
        window.open('/resume.pdf', '_blank');
        break;
      case 'open':
        if (args.length < 2) {
          addToHistory(cmd, 'Usage: open [project] [github|live]');
        } else {
          const project = args[1].toLowerCase();
          const target = args[2]?.toLowerCase();
          
          if (project === 'projects') {
            addToHistory(cmd, 'Opening Projects Panel...');
            setShowProjects(true);
          } else {
            const projectData = projects.find(p => p.name.toLowerCase() === project);
            
            if (!projectData) {
              addToHistory(cmd, `Project not found: ${project}`);
              return;
            }

            if (target === 'live') {
              if (projectData.liveUrl) {
                addToHistory(cmd, `Opening ${projectData.name} website...`);
                window.open(projectData.liveUrl, '_blank');
              } else {
                addToHistory(cmd, `No live website available for ${projectData.name}`);
              }
            } else {
              // Default to GitHub
              addToHistory(cmd, `Opening ${projectData.name} GitHub...`);
              window.open(projectData.link, '_blank');
            }
          }
        }
        break;
      default:
        addToHistory(cmd, `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseTerminal = () => {
    setIsVisible(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setShowProjects,
    setActiveTab,
    toggleVisibility: () => setIsVisible(prev => !prev),
    setVisibility: (visible: boolean) => setIsVisible(visible),
    isVisible
  }));

  // Add function to start drag
  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  // Add function to bring terminal to front
  const bringToFront = () => {
    const newZIndex = projectsZIndex + 10;
    setZIndex(newZIndex);
    setProjectsZIndex(newZIndex - 10);
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="terminal"
          style={{ zIndex }}
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          onClick={bringToFront}
          onDragEnd={(e, info) => {
            setPosition({ x: info.point.x, y: info.point.y });
          }}
        >
          <div 
            className="terminal-header"
            onPointerDown={startDrag}
            style={{ cursor: 'grab' }}
          >
            <div className="flex">
              <div className="terminal-title">{title}</div>
            </div>
            <button className="terminal-close" onClick={handleCloseTerminal}>×</button>
          </div>

          <div ref={terminalBodyRef} className="terminal-body" onClick={handleTerminalClick}>
            {history.map((entry, index) => (
              <div key={index} className="terminal-line">
                {entry.type === 'input' ? (
                  <div>
                    <span className="prompt">$</span>{entry.text}
                  </div>
                ) : (
                  <div className="command">{entry.text}</div>
                )}
              </div>
            ))}
            <div className="terminal-line">
              <span className="prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
            </div>
          </div>
        </motion.div>
      )}

      {showProjects && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="projects-window"
          style={{ zIndex: projectsZIndex }}
          drag
          dragMomentum={false}
          dragElastic={0}
          onClick={() => {
            const newZIndex = zIndex + 10;
            setProjectsZIndex(newZIndex);
            setZIndex(newZIndex - 10);
          }}
        >
          <div className="projects-window-header">
            <div className="flex">
              <div className="projects-window-title">Projects</div>
            </div>
            <button className="terminal-close" onClick={() => setShowProjects(false)}>×</button>
          </div>

          <div className="projects-panel">
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-image">
                    <img src={project.image} alt={project.name} />
                  </div>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="project-icon">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      GitHub
                    </a>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link live-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="project-icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        View Live
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
});

export default Terminal; 