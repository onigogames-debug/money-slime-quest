import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getSessionQuestions } from '../QuizEngine';
import { GlassCard, LETTERS } from './UIComponents';

const ChoiceButton = ({ label, index, onClick, state, disabled }) => (
  <button className={`answer-btn ${state}`} onClick={onClick} disabled={disabled}>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
        background: state === 'correct' ? 'rgba(0,255,136,0.2)' : state === 'wrong' ? 'rgba(255,68,102,0.2)' : 'rgba(0,245,255,0.08)',
        border: '1px solid',
        borderColor: state === 'correct' ? 'rgba(0,255,136,0.5)' : state === 'wrong' ? 'rgba(255,68,102,0.5)' : 'rgba(0,245,255,0.2)',
        fontFamily: "'Orbitron', monospace", fontSize: '0.68rem', fontWeight: 700,
        color: state === 'correct' ? '#00ff88' : state === 'wrong' ? '#ff4466' : '#00f5ff',
      }}>
        {LETTERS[index]}
      </span>
      {label}
    </span>
  </button>
);

const ResultModal = ({ correct, hint, answer, onNext, isLast }) => (
  <div className="result-overlay">
    <div className="glass-card result-card" style={{ maxWidth: '320px', width: '90%', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>{correct ? '✨' : '💥'}</div>
      <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.05rem', fontWeight: 900, color: correct ? '#00ff88' : '#ff4466', marginBottom: '0.6rem', textShadow: correct ? '0 0 15px rgba(0,255,136,0.6)' : '0 0 15px rgba(255,68,102,0.6)' }}>
        {correct ? 'CORRECT!' : 'WRONG...'}
      </h3>
      {!correct && (
        <>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            正解: <span style={{ color: '#00f5ff', fontWeight: 700 }}>{answer}</span>
          </div>
          {hint && (
            <div className="hint-box" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: "'Orbitron', monospace", color: '#a78bfa' }}>💡 HINT</span>
              {hint}
            </div>
          )}
        </>
      )}
      {correct && <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>スライムが成長した！✨</p>}
      <button className="next-btn" onClick={onNext} style={{ width: '100%' }}>
        {isLast ? '🏆 RESULT' : '→ NEXT'}
      </button>
    </div>
  </div>
);

const TIMER_SECONDS = 15;

const QuizSession = ({ stage, set, meta, onSessionEnd }) => {
  const questions = React.useMemo(() => getSessionQuestions(stage, set), [stage, set]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [btnStates, setBtnStates] = useState(Array(4).fill(''));
  const [answered, setAnswered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  const handleAnswer = useCallback((choiceIdx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);

    const isCorrect = choiceIdx !== null && q.options[choiceIdx] === q.answer;
    if (isCorrect) setScore(s => s + 1);
    setLastCorrect(isCorrect);

    const states = q.options.map((opt, i) => {
      if (opt === q.answer) return 'correct';
      if (i === choiceIdx && !isCorrect) return 'wrong';
      return '';
    });
    setBtnStates(states);
    setTimeout(() => setShowModal(true), 450);
  }, [answered, q]);

  // Timer
  useEffect(() => {
    // Reset timer behavior on index change
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, handleAnswer]);

  const handleModalNext = () => {
    if (isLast) {
      onSessionEnd(score);
    } else {
      // Prior to index change: reset all question-specific states for the next question
      // This ensures they update in the same batch as setIdx(i + 1)
      setTimeLeft(TIMER_SECONDS);
      setAnswered(false);
      setBtnStates(Array(4).fill(''));
      setShowModal(false);
      setIdx(i => i + 1);
    }
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 8 ? '#00f5ff' : timeLeft > 4 ? '#ffd700' : '#ff4466';

  return (
    <div>
      {/* session header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: meta.colorFrom, letterSpacing: '0.08em', marginBottom: '2px' }}>
            STAGE {stage} · SET {set} — {meta.title}
          </div>
          {/* session progress dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '4px', borderRadius: '9999px', background: i < idx ? meta.colorFrom : i === idx ? `${meta.colorFrom}80` : 'rgba(255,255,255,0.06)', boxShadow: i < idx ? `0 0 4px ${meta.colorFrom}80` : 'none', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.62rem', color: '#64748b' }}>
          {idx + 1}/{questions.length}
        </div>
      </div>

      {/* quiz card */}
      <GlassCard style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        {/* timer */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', height: '5px', overflow: 'hidden', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ width: `${timerPct}%`, height: '100%', background: timerColor, borderRadius: '9999px', transition: 'width 1s linear, background 0.5s ease', boxShadow: `0 0 6px ${timerColor}` }} />
        </div>
        <div style={{ textAlign: 'right', fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: timerColor, marginBottom: '1rem', textShadow: `0 0 5px ${timerColor}` }}>
          ⏱ {timeLeft}s
        </div>

        {/* score mini */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="stage-badge">Q.{String(idx + 1).padStart(2, '0')}</span>
          <span className="score-badge">✓ {score}</span>
        </div>

        {/* difficulty */}
        {q.difficulty && (
          <div style={{ fontSize: '0.6rem', color: q.difficulty === 'hard' ? '#ff4466' : q.difficulty === 'normal' ? '#ffd700' : '#00ff88', fontFamily: "'Orbitron', monospace", letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            {'★'.repeat(q.difficulty === 'hard' ? 3 : q.difficulty === 'normal' ? 2 : 1)} {q.difficulty?.toUpperCase()}
          </div>
        )}

        {/* question */}
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.65, marginBottom: '1.25rem' }}>
          {q.question}
        </p>

        {/* choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {q.options.map((opt, i) => (
            <ChoiceButton key={i} index={i} label={opt} onClick={() => handleAnswer(i)} state={btnStates[i]} disabled={answered} />
          ))}
        </div>
      </GlassCard>

      {showModal && (
        <ResultModal
          correct={lastCorrect}
          hint={q.hint}
          answer={q.answer}
          onNext={handleModalNext}
          isLast={isLast}
        />
      )}
    </div>
  );
};

export default QuizSession;
