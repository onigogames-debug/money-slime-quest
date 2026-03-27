import React, { useState } from 'react';
import {
  STAGE_META,
  getNextSession,
} from './QuizEngine';
import { useProgress } from './useProgress';

// Components
import LoginScreen from './components/LoginScreen';
import WorldMap from './components/WorldMap';
import SetSelect from './components/SetSelect';
import QuizSession from './components/QuizSession';
import SessionResult from './components/SessionResult';
import StageClearModal from './components/StageClearModal';
import AdminDashboard from './components/AdminDashboard';

const SCREEN = { 
  LOGIN: 'LOGIN',
  MAP: 'MAP', 
  SET_SELECT: 'SET_SELECT', 
  QUIZ: 'QUIZ', 
  RESULT: 'RESULT',
  ADMIN: 'ADMIN'
};

export default function App() {
  const { 
    progress, 
    allAccounts,
    activeName,
    completeSet, 
    advanceTo, 
    setPlayerName, 
    markStageAsCelebrated, 
    deleteAccount,
    switchAccount,
    resetAll 
  } = useProgress();
  const [screen, setScreen] = useState(() => activeName ? SCREEN.MAP : SCREEN.LOGIN);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(null); // { stage, title }

  const meta = selectedStage ? STAGE_META.find(m => m.stage === selectedStage) : null;

  const handleSelectStage = (stage) => {
    setSelectedStage(stage);
    setScreen(SCREEN.SET_SELECT);
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setScreen(SCREEN.QUIZ);
  };

  const handleSessionEnd = (score) => {
    setSessionScore(score);
    completeSet(selectedStage, selectedSet, score);
    
    // Check for stage completion (10/10 sets)
    const completedInStage = Array.from({ length: 10 }, (_, i) => i + 1)
      .filter(s => {
        // We include the current set as it might not be in the state yet
        if (s === selectedSet) return true;
        return progress.completedSets.has(`${selectedStage}-${s}`);
      }).length;

    if (completedInStage === 10 && !progress.celebratedStages.has(selectedStage)) {
      setShowCelebration({ stage: selectedStage, title: meta.title });
    }

    setScreen(SCREEN.RESULT);
  };

  const nextSession = selectedStage && selectedSet ? getNextSession(selectedStage, selectedSet) : null;

  const handleNextSession = () => {
    if (nextSession) {
      advanceTo(nextSession.stage, nextSession.set);
      setSelectedStage(nextSession.stage);
      setSelectedSet(nextSession.set);
      setScreen(SCREEN.QUIZ);
    }
  };

  const handleLogin = (name) => {
    setPlayerName(name);
    setScreen(SCREEN.MAP);
  };

  const handleGoBackToMap = () => setScreen(SCREEN.MAP);
  const handleGoToSetSelect = () => setScreen(SCREEN.SET_SELECT);

  return (
    <div className="starfield" style={{ minHeight: '100vh', padding: '1.5rem 1rem', position: 'relative' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {screen === SCREEN.LOGIN && (
          <LoginScreen onLogin={handleLogin} />
        )}

        {screen === SCREEN.MAP && (
          <WorldMap 
            progress={progress} 
            onSelectStage={handleSelectStage} 
            onReset={resetAll} 
          />
        )}

        {screen === SCREEN.SET_SELECT && selectedStage && (
          <SetSelect
            stage={selectedStage}
            progress={progress}
            onSelectSet={handleSelectSet}
            onBack={handleGoBackToMap}
          />
        )}

        {screen === SCREEN.QUIZ && selectedStage && selectedSet && (
          <>
            <button 
              onClick={handleGoToSetSelect} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: "'Orbitron', monospace", fontSize: '0.62rem', marginBottom: '0.75rem', letterSpacing: '0.08em', paddingLeft: 0 }}
            >
              ← STAGE {selectedStage}
            </button>
            <QuizSession
              key={`${selectedStage}-${selectedSet}`}
              stage={selectedStage}
              set={selectedSet}
              meta={meta}
              onSessionEnd={handleSessionEnd}
            />
          </>
        )}

        {screen === SCREEN.RESULT && (
          <SessionResult
            score={sessionScore}
            total={10}
            stage={selectedStage}
            set={selectedSet}
            nextSession={nextSession}
            onNext={handleNextSession}
            onReplay={() => setScreen(SCREEN.QUIZ)}
            onMap={handleGoBackToMap}
          />
        )}

        {screen === SCREEN.ADMIN && (
          <AdminDashboard
            allAccounts={allAccounts}
            activeName={activeName}
            onSwitch={(name) => {
              switchAccount(name);
              setScreen(SCREEN.MAP);
            }}
            onDelete={deleteAccount}
            onBack={handleGoBackToMap}
          />
        )}

        {showCelebration && (
          <StageClearModal
            stage={showCelebration.stage}
            title={showCelebration.title}
            onNext={() => {
              markStageAsCelebrated(showCelebration.stage);
              setShowCelebration(null);
            }}
          />
        )}

        <footer style={{ textAlign: 'center', fontSize: '0.55rem', color: '#1e293b', marginTop: '2rem', fontFamily: "'Orbitron', monospace", letterSpacing: '0.12em' }}>
          <div 
            onClick={() => {
              const pass = window.prompt("Admin Password?");
              if (pass === 'ONIGO') {
                setScreen(SCREEN.ADMIN);
              }
            }}
            style={{ cursor: 'pointer', display: 'inline-block', padding: '0.5rem' }}
          >
            © 2026 ONIGO GAMES
          </div>
        </footer>
      </div>
    </div>
  );
}
