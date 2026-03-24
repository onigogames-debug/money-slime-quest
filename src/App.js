import React, { useState } from 'react';

// 進化したスライム表示コンポーネント
const SlimeCard = ({ score }) => {
  const level = Math.floor(score / 10) + 1;
  const progress = (score % 10) * 10;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-b-8 border-blue-200">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="text-8xl mb-4 animate-bounce">💧</div>
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Lv.{level}
          </div>
        </div>
        <h2 className="text-xl font-black text-gray-700 mb-2">マネースライム</h2>
        
        {/* プログレスバー */}
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
          <div 
            className="bg-gradient-to-r from-blue-400 to-cyan-300 h-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Next Evolution: {10 - (score % 10)} pts</p>
      </div>
    </div>
  );
};

function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans antialiased text-slate-900">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-blue-600 drop-shadow-sm">
            MONEY SLIME<br/><span className="text-blue-400 text-2xl font-extrabold">QUEST</span>
          </h1>
        </header>

        {/* スライム表示 */}
        <SlimeCard score={score} />

        {/* クイズエリア */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-50">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Stage 1-1</span>
            <span className="text-slate-400 text-sm font-medium">Q. 01 / 10</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 leading-snug mb-8">
            昔々、お金の代わりに交換に使われていた「海の贈り物」は何でしょう？
          </h3>

          <div className="space-y-4">
            {["きれいな石", "貝殻", "真珠", "サンゴ"].map((choice, index) => (
              <button
                key={index}
                onClick={() => setScore(score + 1)}
                className="w-full py-4 px-6 text-left font-bold text-slate-700 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span className="inline-block w-8 h-8 mr-3 bg-slate-100 rounded-lg text-center leading-8 text-sm group-hover:bg-blue-200">
                  {index + 1}
                </span>
                {choice}
              </button>
            ))}
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-slate-400 text-xs mt-12 font-medium tracking-widest">
          © 2026 PRIVATE DETECTIVE AGENCY T
        </p>
      </div>
    </div>
  );
}

export default App;
