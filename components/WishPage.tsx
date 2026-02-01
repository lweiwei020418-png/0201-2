
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
                className={`absolute w-[185px] h-[300px] transition-all duration-500 ease-out rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-[1.5px] border
