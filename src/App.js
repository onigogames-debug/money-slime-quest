import React, { useState } from 'react';

// 仮のコンポーネント（後で別ファイルに分けます）
const SlimeView = ({ score }) => (
  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e0f7fa', borderRadius: '15px' }}>
    <div style={{ fontSize: '50px' }}>💧</div>
    <p>現在のスコア: {score}</p>
    <p>レベル: {Math.floor(score / 10) + 1}</p>
  </div>
);

function App() {
  const [score, setScore] = useState(0);

  const handleAnswer = () => {
    setScore(score + 1);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#007bff' }}>マネースライム・クエスト</h1>
        <p>〜1,200問の旅へようこそ〜</p>
      </header>

      <SlimeView score={score} />

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>第1問：お金の歴史について</h3>
        <p>昔、お金の代わりに使われていた海のものは？</p>
        <button onClick={handleAnswer} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
          貝殻
        </button>
        <button style={{ display: 'block', width: '100%', padding: '10px', cursor: 'pointer' }}>
          わかめ
        </button>
      </div>
    </div>
  );
}

export default App;