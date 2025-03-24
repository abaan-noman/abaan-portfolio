'use client';

import React, { useRef } from 'react';
import Terminal from './components/Terminal';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';

export default function Home() {
  const terminalRef = useRef<any>(null);

  const handleShowProjects = () => {
    if (terminalRef.current) {
      terminalRef.current.setShowProjects(true);
      terminalRef.current.setActiveTab('Projects');
      
      // Make sure terminal is visible if it was hidden
      terminalRef.current.setVisibility(true);
    }
  };

  const handleToggleTerminal = () => {
    if (terminalRef.current) {
      // If the terminal is not visible, make it visible
      if (!terminalRef.current.isVisible) {
        terminalRef.current.setVisibility(true);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative pl-[60px]">
      <Navbar 
        onShowProjects={handleShowProjects} 
        onToggleTerminal={handleToggleTerminal}
      />
      <Terminal ref={terminalRef} title="Terminal" />
    </main>
  );
} 