
import React, { useState } from 'react';

interface CheckScorePageProps {
  config: any;
  courseLink?: string;
  onNext: () => void;
}

const CheckScorePage: React.FC<CheckScorePageProps> = ({ config, courseLink, onNext }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCheck = () => {
    window.open(config.officialLink, '_blank');
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-16 pb-44 overflow-hidden">
      <div className="w-36 h-36 bg-gradient-to-b from-[#f8bc3a] to-[#d68a0c] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(248,188,58,0.4)] border-4 border-[#8b1111] flex-shrink-0 animate-pulse">
         <svg className="w-24 h-24 text-black drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
         </svg>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 text-center w-full">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{config.heading}</h1>
        
        <div className="space-y-4 px-4">
          <p className="text-white/80 text-sm font-serif-zh leading-relaxed">
            {config.description}
          </p>
          
          <div className="relative mx-auto w-fit animate-bounce duration-1000">
            <div className="bg-gradient-to-r from-[#f8bc3a] via-[#ffda7f] to-[#d68a0c] py-2 px-6 rounded-full shadow-[0_8px_15px_rgba(0,0,0,0.3)] border border-yellow-200/50">
              <span className="text-[#8b1111] font-black text-sm tracking-tighter whitespace-nowrap">
                {config.rewardHighlight}
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-black/20 blur-sm rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-4">
        <div className="bg-[#3a0808]/80 border border-white/10 rounded-2xl h-36 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="relative w-12 h-9 bg-gray-200 rounded-sm border-2 border-gray-400">
             <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
             <div className="absolute right-1.5 bottom-1.5 w-4 h-1 bg-gray-500 rounded-full"></div>
          </div>
          <span className="text-xs text-white/90 font-bold">开启屏幕录制</span>
        </div>
        
        <div className="bg-[#3a0808]/80 border border-white/10 rounded-2xl h-36 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="text-5xl text-orange-500 drop-shadow-md">🧡</div>
          <span className="text-xs text-white/90 font-bold">保持平稳心态</span>
        </div>
        
        <div className="bg-[#3a0808]/80 border border-white/10 rounded-2xl h-36 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-12 h-8 bg-white/30 rounded border border-white/20 flex flex-col p-1 space-y-1">
             <div className="w-full h-1 bg-white/60"></div>
             <div className="w-2/3 h-1 bg-white/60"></div>
             <div className="w-1/2 h-1 bg-white/60"></div>
          </div>
          <span className="text-xs text-white/90 font-bold">备好准考证号</span>
        </div>
      </div>

      <div className="w-full max-w-sm mb-4">
        <button 
          onClick={handleCheck}
          className="w-full py-5 bg-gradient-to-b from-[#f8bc3a] to-[#d68a0c] text-red-950 rounded-full font-black text-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-yellow-800"
        >
          立即开启官方查分 🚀
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
          <div className="relative bg-[#7a1212] border-4 border-yellow-500 p-8 rounded-[40px] text-center space-y-5 animate-in zoom-in duration-300 w-full max-w-sm">
            <div className="text-5xl">🎁</div>
            <h3 className="text-2xl font-bold text-yellow-400">查完分了吗？</h3>
            <p className="text-white/80 text-sm leading-relaxed px-2">观看公开课参与互动抽奖，<br/>解锁更多上岸福利礼包！</p>
            
            {/* 插入的公开课链接入口 */}
            <div 
              onClick={() => courseLink && window.open(courseLink, '_blank')}
              className="bg-black/30 border border-yellow-500/20 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 active:bg-black/50 transition-all cursor-pointer"
            >
              <span className="text-sm">📺</span>
              <span className="text-xs font-bold text-yellow-500 underline underline-offset-4 tracking-tighter">观看：出分避坑公开课解析</span>
            </div>

            <button onClick={onNext} className="w-full py-4 bg-yellow-500 text-red-900 rounded-full font-bold text-lg shadow-lg">去给老师点赞并报喜</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckScorePage;
