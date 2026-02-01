
import React, { useState, useEffect, useRef } from 'react';
import { WishData } from '../types';
import { POSTER_TEMPLATES, GLOBAL_CONFIG } from '../constants';

interface WishPageProps {
  config: any;
  onWishSubmit: (data: WishData) => void;
  onNext: () => void;
}

const WishPage: React.FC<WishPageProps> = ({ config, onWishSubmit, onNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showShareGuide, setShowShareGuide] = useState(false);
  const [formData, setFormData] = useState<WishData>({ nickname: '', targetSchool: '', targetScore: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [danmakuRows, setDanmakuRows] = useState<string[][]>([
    ['政治85+！', '考神附体', '一战成硕', '研友顶峰相见', '有道政治必胜', '谢谢米老师'],
    ['稳住能赢', '研招网一通百通', '26考研上岸', '有道政治太牛了', '必胜必胜', '政治一定要过'],
    ['梦想成真', '上岸上岸', '考研人加油', '政治80+稳了', '谢谢有道名师团', '成功录取']
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 核心持久化逻辑：页面加载时自动回填
    const saved = localStorage.getItem('yidao_last_wish');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      setIsSubmitted(true);
    }
    
    const savedWall = localStorage.getItem('yidao_wishes_wall');
    if (savedWall) setDanmakuRows(JSON.parse(savedWall));
    
    audioRef.current = new Audio(GLOBAL_CONFIG.bgmUrl);
    audioRef.current.loop = true;
  }, []);

  const startBgm = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log("音频播放需交互"));
    }
  };

  const handleConfirmSync = () => {
    const newDanmaku = `${formData.nickname}: ${formData.message}`;
    const newRows = [...danmakuRows];
    newRows[0] = [newDanmaku, ...newRows[0]];
    setDanmakuRows(newRows);
    localStorage.setItem('yidao_wishes_wall', JSON.stringify(newRows));
    setShowPoster(false);
    alert(config.syncSuccessAlert);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startBgm();
    
    // 保存到本地持久化，即使页面更新，重新进入也会存在
    localStorage.setItem('yidao_last_wish', JSON.stringify(formData));
    setIsSubmitted(true);
    
    onWishSubmit(formData);
    setShowPoster(true);
    setShowForm(false);
  };

  const handleViewCard = () => {
    startBgm();
    if (isSubmitted) {
      setShowPoster(true);
    } else {
      setShowForm(true);
    }
  };

  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIdx < POSTER_TEMPLATES.length - 1) setCurrentIdx(prev => prev + 1);
      else if (diff < 0 && currentIdx > 0) setCurrentIdx(prev => prev - 1);
    }
  };

  const nextCard = () => currentIdx < POSTER_TEMPLATES.length - 1 && setCurrentIdx(prev => prev + 1);
  const prevCard = () => currentIdx > 0 && setCurrentIdx(prev => prev - 1);

  if (showPoster) {
    return (
      <div className="flex flex-col items-center h-full pt-[55px] px-4 overflow-hidden animate-in slide-in-from-bottom duration-500 bg-[#5c0b0b]">
        
        {/* 文字标题 - 行书风格 */}
        <div className="text-center mb-1 flex-shrink-0">
          <h2 className="text-3xl font-calligraphy text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-widest">请选择你的英雄</h2>
        </div>

        {/* 卡片核心容器 - 高度进一步缩减至 310px，确保全机型不挡操作栏 */}
        <div className="relative w-full h-[310px] flex items-center justify-center perspective-1000 mt-2 mb-1 flex-shrink-0">
          
          {currentIdx > 0 && (
            <button 
              onClick={prevCard}
              className="absolute left-[-5px] z-[50] w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all text-yellow-500/60 shadow-lg"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
          )}

          {POSTER_TEMPLATES.map((t, i) => {
            const offset = i - currentIdx;
            const isCenter = i === currentIdx;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            return (
              <div 
                key={t.id}
                className={`absolute w-[185px] h-[300px] transition-all duration-500 ease-out rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-[1.5px] border-white/10 bg-white/5 backdrop-blur-sm`}
                style={{
                  transform: `translateX(${offset * 200}px) rotateY(${offset * 15}deg) scale(${isCenter ? 1 : 0.8})`,
                  opacity: isCenter ? 1 : 0.5,
                  zIndex: POSTER_TEMPLATES.length - Math.abs(offset)
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${t.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
                    <h3 className="text-white text-sm font-bold tracking-wider mb-1 drop-shadow-md">
                      {t.title}
                    </h3>
                    <p className="text-yellow-400 text-xs drop-shadow-md">
                      {t.description}
                    </p>
                  </div>
            );
          })

          {currentIdx < POSTER_TEMPLATES.length - 1 && (
            <button 
              onClick={nextCard}
              className="absolute right-[-5px] z-[50] w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all text-yellow-500/60 shadow-lg"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          )}
        </div>

        <div className="mt-1 flex flex-col items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => {
              setShowPoster(false);
              setShowShareGuide(true);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full text-white text-sm font-bold tracking-wider active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            {config.shareButton}
          </button>
          <button 
            onClick={() => setShowPoster(false)}
            className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold active:scale-95 transition-all border border-white/20"
          >
            {config.backButton}
          </button>
        </div>

        {showShareGuide && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full">
              <h3 className="text-center text-lg font-bold text-gray-800 mb-3">
                {config.shareGuideTitle}
              </h3>
              <p className="text-gray-600 text-sm text-center mb-5 leading-relaxed">
                {config.shareGuideText}
              </p>
              <div className="flex justify-center mb-5">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </div>
              </div>
              <button 
                onClick={() => setShowShareGuide(false)}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full text-white font-bold active:scale-95 transition-all"
              >
                {config.gotItButton}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex flex-col items-center h-full pt-[55px] px-4 overflow-hidden bg-[#5c0b0b]">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">{config.formTitle}</h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">{config.nicknameLabel}</label>
            <input 
              type="text" 
              value={formData.nickname} 
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder={config.nicknamePlaceholder}
              maxLength={10}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">{config.schoolLabel}</label>
            <input 
              type="text" 
              value={formData.targetSchool} 
              onChange={(e) => setFormData({...formData, targetSchool: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder={config.schoolPlaceholder}
              maxLength={20}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">{config.scoreLabel}</label>
            <input 
              type="text" 
              value={formData.targetScore} 
              onChange={(e) => setFormData({...formData, targetScore: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder={config.scorePlaceholder}
              maxLength={10}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">{config.messageLabel}</label>
            <textarea 
              value={formData.message} 
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              placeholder={config.messagePlaceholder}
              rows={3}
              maxLength={50}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full text-white font-bold active:scale-95 transition-all shadow-lg"
          >
            {config.submitButton}
          </button>
        </form>
        
        <button 
          onClick={() => setShowForm(false)}
          className="mt-4 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold active:scale-95 transition-all border border-white/20"
        >
          {config.backButton}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full pt-[55px] px-4 overflow-hidden bg-[#5c0b0b]">
      {/* 顶部标题 */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-calligraphy text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-widest">
          {config.pageTitle}
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {config.pageSubtitle}
        </p>
      </div>

      {/* 动态弹幕 - 三行滚动 */}
      <div className="w-full h-[120px] mb-6 relative overflow-hidden">
        {danmakuRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="absolute w-full h-7 top-[${rowIndex * 40}px] overflow-hidden"
          >
            {row.map((text, idx) => (
              <div 
                key={idx}
                className="absolute whitespace-nowrap text-white text-sm font-bold py-1 px-3 bg-black/30 backdrop-blur-sm rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `danmaku ${15 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              >
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 核心操作区 */}
      <div className="flex flex-col items-center gap-3 flex-1 justify-center">
        <button 
          onClick={handleViewCard}
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full text-white text-sm font-bold tracking-wider active:scale-95 transition-all shadow-lg hover:shadow-xl"
        >
          {isSubmitted ? config.viewCardButton : config.writeWishButton}
        </button>
        
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold active:scale-95 transition-all border border-white/20"
        >
          {config.nextButton}
        </button>
      </div>

      {/* 底部版权 */}
      <div className="mt-auto mb-4 text-center text-white/60 text-xs">
        <p>{config.footerText}</p>
      </div>

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes danmaku {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default WishPage;
