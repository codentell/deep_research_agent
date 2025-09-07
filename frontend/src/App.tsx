import React from 'react';
import ResearchInterface from './components/ResearchInterface';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ResearchInterface />
    </ThemeProvider>
  );
}

export default App;