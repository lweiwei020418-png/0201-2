
import React, { useState } from 'react';
import { GLOBAL_CONFIG } from '../constants';

interface ReportPageProps {
  config: any;
  onReportSubmit?: () => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ config, onReportSubmit }) => {
  const [formData, setFormData] = useState({ nickname: '', phone: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    if (onReportSubmit) onReportSubmit();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 space-y-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-5xl mb-4 shadow-[0_0_50px_rgba(234,179,8,0.5)] border-4 border-red-900">🎓</div>
        <h2 className="text-4xl font-calligraphy text-yellow-400">喜报登科！</h2>
        <div className="space-y-4 text-white/90 font-serif-zh leading-relaxed bg-black/20 p-6 rounded-3xl border border-yellow-500/20">
          <p>恭喜 <span className="text-yellow-400 font-bold">{formData.nickname}</span> 同学</p>
          <p className="text-sm">{GLOBAL_CONFIG.reportPage.successMsg}</p>
        </div>
        <button 
           onClick={() => window.open(GLOBAL_CONFIG.reportPage.promoLink, '_blank')}
           className="w-full py-4 bg-white text-red-900 rounded-xl font-bold shadow-xl active:bg-gray-100 transition"
        >
          {GLOBAL_CONFIG.reportPage.promoBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-12 space-y-8 scrollbar-hide pb-32">
      <div className="text-center">
        <h1 className="text-4xl font-calligraphy font-bold gold-gradient drop-shadow-md mb-2">{config.heading}</h1>
        <p className="text-yellow-500/60 text-[10px] tracking-[0.2em] font-bold uppercase">{GLOBAL_CONFIG.reportPage.subHeading}</p>
        
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 flex items-center gap-2 overflow-hidden">
          <span className="text-xs">📢</span>
          <div className="flex-1 overflow-hidden whitespace-nowrap text-[10px] font-bold text-yellow-200">
            <span className="inline-block animate-marquee">{config.marqueeText}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
            <input required className="w-full bg-black/20 border-2 border-yellow-500/20 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition" placeholder="您的姓名" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})}/>
            <input required type="tel" pattern="[0-9]{11}" className="w-full bg-black/20 border-2 border-yellow-500/20 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition" placeholder="手机号 (用于奖励发放通知)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
        </div>

        {/* 升级后的公开课宣传板块 - 垂直扩大并增加Banner */}
        <div 
          onClick={() => window.open(GLOBAL_CONFIG.reportPage.promoLink, '_blank')}
          className="bg-gradient-to-b from-[#5c0b0b] to-[#8b1111] border-2 border-yellow-500/30 rounded-3xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all shadow-2xl group"
        >
             {/* Banner 占位图 */}
             <div className="w-full aspect-video relative bg-black/40">
                <img src={GLOBAL_CONFIG.reportPage.promoBanner} alt="Banner" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5c0b0b] to-transparent"></div>
                <div className="absolute top-3 left-3 bg-red-600 text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">Live Course</div>
             </div>
             
             {/* 宣传内容区 - 扩大垂直内边距 */}
             <div className="p-8 pt-4">
               <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-3 text-lg drop-shadow-md">
                  <span>🔥</span> {GLOBAL_CONFIG.reportPage.promoTitle}
               </h4>
               <p className="text-sm text-white/70 mb-6 leading-relaxed font-serif-zh italic">
                 {GLOBAL_CONFIG.reportPage.promoDesc}
               </p>
               <div className="w-full py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center gap-2 text-xs text-yellow-500 font-black tracking-widest uppercase">
                  {GLOBAL_CONFIG.reportPage.promoBtn} <span className="animate-pulse">>>></span>
               </div>
             </div>
        </div>

        <button type="submit" className="w-full py-5 bg-gradient-to-b from-yellow-400 to-yellow-600 text-red-900 rounded-full font-bold text-xl shadow-lg active:translate-y-1 transition-all">
          立即提交并参与抽奖
        </button>
      </form>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-150%); } }
        .animate-marquee { display: inline-block; animation: marquee 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default ReportPage;
