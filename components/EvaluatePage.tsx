
import React, { useState } from 'react';
import { GLOBAL_CONFIG } from '../constants';

interface EvaluatePageProps {
  config: any;
  onNext: () => void;
}

const EvaluatePage: React.FC<EvaluatePageProps> = ({ config, onNext }) => {
  const [teacherComment, setTeacherComment] = useState('');
  const [juniorComment, setJuniorComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = () => {
    if (!teacherComment && !juniorComment) {
      alert('请先填写内容哦');
      return;
    }
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setSubmitted(true);
      setTimeout(onNext, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full px-6 pt-24 overflow-y-auto scrollbar-hide pb-40">
      <div className="flex flex-col items-center space-y-6 flex-shrink-0">
        <h2 className="text-3xl font-calligraphy text-yellow-400 text-center drop-shadow-md">{config.heading}</h2>
        
        <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-yellow-500/50 shadow-2xl relative bg-black/20">
          <img src={config.teacherImg} alt="Teacher Group" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="bg-red-600/80 text-white text-[10px] px-3 py-1 rounded-full border border-yellow-500/30 font-bold tracking-widest uppercase">{config.teacherTag}</span>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <p className="text-yellow-500/80 text-xs font-bold ml-1">致敬名师：</p>
            <textarea 
              className="w-full bg-black/30 border-2 border-yellow-500/10 p-4 rounded-2xl text-white h-28 focus:border-yellow-500 outline-none transition font-serif-zh placeholder:text-white/20 text-sm"
              placeholder="最想对哪位老师说声谢谢？（如：谢谢米老师的考前三套卷！）"
              value={teacherComment}
              onChange={e => setTeacherComment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-yellow-500/80 text-xs font-bold ml-1">{GLOBAL_CONFIG.evaluatePage.selfMessageLabel}</p>
            <textarea 
              className="w-full bg-black/30 border-2 border-yellow-500/10 p-4 rounded-2xl text-white h-28 focus:border-yellow-500 outline-none transition font-serif-zh placeholder:text-white/20 text-sm"
              placeholder={GLOBAL_CONFIG.evaluatePage.selfMessagePlaceholder}
              value={juniorComment}
              onChange={e => setJuniorComment(e.target.value)}
            />
          </div>
          
          <button onClick={handleSubmit} className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 rounded-full font-bold text-lg shadow-lg active:scale-95 transition">传达这份喜悦</button>
        </div>
      </div>

      {showSavedToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-black/80 backdrop-blur-md px-8 py-4 rounded-3xl border border-yellow-500 flex flex-col items-center gap-2 animate-in zoom-in duration-200">
           <span className="text-3xl">✅</span>
           <span className="text-white font-bold">内容已保存并传达</span>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#8b1111]/98 animate-in fade-in">
          <div className="text-center space-y-6 animate-bounce">
            <div className="text-7xl">🏮</div>
            <h3 className="text-3xl font-calligraphy text-yellow-400">福报已至</h3>
            <p className="text-white/60 font-serif-zh tracking-widest">正在跳转报喜领奖台...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluatePage;
