import React, { useState } from 'react';
import Background from './components/Background.tsx';
import LetterCard from './components/LetterCard.tsx';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <main className="relative z-10">
        <LetterCard language={language} onToggleLanguage={toggleLanguage} />
      </main>
      
      {/* Simple footer credit */}
      <footer className="absolute bottom-2 left-0 right-0 text-center text-slate-400/30 text-xs font-sans pointer-events-none">
        &copy; {new Date().getFullYear()} Heartfelt Letters
      </footer>
    </div>
  );
};

export default App;