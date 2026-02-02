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

  // BGM 音频引用
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 读取最近一次提交的心愿
    const saved = localStorage.getItem('yidao_last_wish');
    if (saved) {
      try { // 修复：增加 JSON 解析容错
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setIsSubmitted(true);
      } catch (e) {
        console.error('解析本地心愿数据失败:', e);
        localStorage.removeItem('yidao_last_wish'); // 清理损坏数据
      }
    }
    
    const savedWall = localStorage.getItem('yidao_wishes_wall');
    if (savedWall) {
      try { // 修复：增加 JSON 解析容错
        setDanmakuRows(JSON.parse(savedWall));
      } catch (e) {
        console.error('解析祈福墙数据失败:', e);
        localStorage.removeItem('yidao_wishes_wall'); // 清理损坏数据
      }
    }
    
    // 预加载音频并尝试播放（由首屏交互触发）
    audioRef.current = new Audio(GLOBAL_CONFIG.bgmUrl);
    audioRef.current.loop = true;

    // 修复：组件卸载时清理音频，防止内存泄漏
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const startBgm = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log("音频播放需交互:", err)); // 修复：完善错误日志
    }
  };

  const handleConfirmSync = () => {
    const newDanmaku = `${formData.nickname || '考研人'}: ${formData.message || '愿一战成硕，前程似锦！'}`; // 修复：空值兜底
    const newRows = [...danmakuRows];
    newRows[0] = [newDanmaku, ...newRows[0]];
    setDanmakuRows(newRows);
    localStorage.setItem('yidao_wishes_wall', JSON.stringify(newRows));
    setShowPoster(false);
    alert(config.syncSuccessAlert || '发布成功！已同步至祈福墙~'); // 修复：文案兜底
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startBgm();
    
    // 保存到本地持久化
    try { // 修复：增加 localStorage 存储容错
      localStorage.setItem('yidao_last_wish', JSON.stringify(formData));
    } catch (e) {
      console.error('保存心愿数据失败:', e);
      alert('本地存储不足，暂无法保存心愿~');
    }
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
  const handleTouchStart = (e: React.TouchEvent) => { 
    touchStart.current = e.touches[0].clientX; 
    // 修复：触摸时停止动画，提升滑动体验
    const danmakuElements = document.querySelectorAll('.animate-scroll-left, .animate-scroll-right');
    danmakuElements.forEach(el => (el as HTMLElement).style.animationPlayState = 'paused');
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIdx < POSTER_TEMPLATES.length - 1) setCurrentIdx(prev => prev + 1);
      else if (diff < 0 && currentIdx > 0) setCurrentIdx(prev => prev - 1);
    }
    // 修复：触摸结束恢复动画
    const danmakuElements = document.querySelectorAll('.animate-scroll-left, .animate-scroll-right');
    danmakuElements.forEach(el => (el as HTMLElement).style.animationPlayState = 'running');
  };

  const nextCard = () => {
    if (currentIdx < POSTER_TEMPLATES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };
  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  if (showPoster) {
    return (
      <div className="flex flex-col items-center h-full pt-[60px] px-4 overflow-hidden animate-in slide-in-from-bottom duration-500 bg-[#5c0b0b]">
        
        {/* 文字提示 - 行书风格 */}
        <div className="text-center mb-1">
          <h2 className="text-2xl font-calligraphy text-yellow-400 drop-shadow-md tracking-widest">请选择你的英雄</h2>
        </div>

        {/* 卡片核心容器 - 缩减高度至 350px 确保下方按钮可见 */}
        <div className="relative w-full h-[350px] flex items-center justify-center perspective-1000 mb-2">
          
          {/* 左切换箭头 */}
          {currentIdx > 0 && (
            <button 
              onClick={prevCard}
              className="absolute left-[-10px] z-[50] w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all text-yellow-500/60"
              aria-label="上一张卡片" // 修复：增加无障碍标签
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
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
                className={`absolute w-[210px] h-[330px] transition-all duration-500 ease-out rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] border-[1px] border-yellow-500/30 overflow-hidden flex flex-col bg-red-900
                  ${isCenter ? 'z-30 scale-100 opacity-100 translate-x-0' : 'z-10 scale-[0.82] opacity-30'}
                  ${offset < 0 ? '-translate-x-28' : offset > 0 ? 'translate-x-28' : ''}
                `}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ WebkitTouchCallout: 'default' }} 
                aria-hidden={!isCenter} // 修复：增加无障碍属性
              >
                <div className="absolute inset-0 z-0">
                   <img 
                     src={t.characterImg} 
                     alt={`${t.title} - ${t.slogan}`} // 修复：完善图片 alt 文本
                     className="w-full h-full object-cover" 
                     loading="lazy" // 修复：图片懒加载
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#8b1111]/90 pointer-events-none"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 pt-6 text-center pointer-events-none">
                   <div className="space-y-1">
                     <h2 className="text-yellow-400 font-calligraphy text-3xl tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight">
                        {t.title}
                     </h2>
                     <p className="text-yellow-200/90 text-[7px] font-bold tracking-[0.2em] drop-shadow-md">{t.slogan}</p>
                   </div>

                   <div className="w-full bg-white/95 rounded-lg p-3 mb-1 shadow-inner flex flex-col items-center border-[2px] border-yellow-500/40">
                      <div className="w-full flex justify-between items-center text-[8px] text-red-900 font-black mb-0.5 opacity-70">
                         <span>TO: {formData.nickname || '考研人'}</span>
                         <span>GOAL: {formData.targetScore || '400'}+</span>
                      </div>
                      <div className="w-full h-px bg-red-900/10 mb-1.5"></div>
                      <p className="text-red-900 text-[10px] font-serif-zh font-bold leading-tight text-center">
                        “{formData.message || '愿一战成硕，前程似锦！'}”
                      </p>
                      <div className="mt-1 text-[6px] text-red-700/40 uppercase tracking-widest font-black italic">Youdao Kaoyan 2026</div>
                   </div>
                </div>
              </div>
            );
          })}

          {/* 右切换箭头 */}
          {currentIdx < POSTER_TEMPLATES.length - 1 && (
            <button 
              onClick={nextCard}
              className="absolute right-[-10px] z-[50] w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all text-yellow-500/60"
              aria-label="下一张卡片" // 修复：增加无障碍标签
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
            </button>
          )}
        </div>
        
        {/* 保存提示小字 */}
        <div className="text-yellow-500/60 text-[9px] mb-3 font-bold tracking-widest animate-pulse">
           💡 长按卡片区域，可保存专属上岸符到本地
        </div>

        {/* 底部功能按钮 */}
        <div className="w-full space-y-3 px-4 flex flex-col items-center flex-shrink-0 z-50">
           <button 
             onClick={handleConfirmSync}
             className="w-full py-3.5 bg-[#e62e2d] text-white rounded-full font-bold shadow-[0_10px_20px_rgba(230,46,45,0.4)] active:scale-95 transition"
             aria-label="确定发布并同步到祈福墙" // 修复：增加无障碍标签
           >确定发布 · 同步祈福墙</button>
           
           <div className="flex gap-3 w-full">
             <button 
               onClick={() => setShowShareGuide(true)}
               className="flex-1 py-3.5 bg-white/10 border border-white/20 text-white rounded-full font-bold text-[11px] flex items-center justify-center gap-2 active:scale-95 transition"
               aria-label="分享到朋友圈" // 修复：增加无障碍标签
             >
               <span>🔗</span> 分享朋友圈
             </button>
             <button 
               onClick={onNext}
               className="flex-[1.5] py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-950 rounded-full font-bold text-[11px] shadow-lg active:scale-95 transition"
               aria-label="继续查分之旅" // 修复：增加无障碍标签
             >
               {'继续查分之旅 >'}
             </button>
           </div>
        </div>

        {showShareGuide && (
          <div 
            className="fixed inset-0 z-[500] bg-black/85 flex flex-col items-end p-6" 
            onClick={() => setShowShareGuide(false)}
            aria-modal="true" // 修复：增加无障碍属性
            role="dialog" // 修复：增加无障碍属性
          >
            <div className="animate-bounce mb-4 mr-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2"><path d="M7 17l10-10M17 17l-10-10"/></svg>
            </div>
            <p className="text-yellow-500 text-xl font-bold font-calligraphy text-right">
              点击右上角菜单<br/>选择“发送给朋友”或“分享到朋友圈”<br/>将登科福气传达给研友！
            </p>
          </div>
        )}
      </div>
    );
  }

  const BTN_STYLE = "w-full py-6 bg-gradient-to-b from-[#f8bc3a] to-[#d68a0c] text-red-950 rounded-[40px] font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all";

  return (
    <div className="flex flex-col h-full pt-16 overflow-y-auto scrollbar-hide pb-32">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-5xl font-black text-white drop-shadow-lg">{config.title || '考研上岸祈福'}</h1> {/* 修复：文案兜底 */}
        <p className="text-yellow-500/80 text-[10px] font-bold uppercase tracking-[0.5em]">{config.subTitle || '2026 有道考研'}</p> {/* 修复：文案兜底 */}
      </div>

      <div className="flex-1 flex flex-col items-center px-6">
        <div className="text-center mb-6">
           <h1 className="text-4xl font-calligraphy font-bold gold-gradient flex items-center justify-center gap-4">
             <span>{config.mainHeading?.[0] || '研途有你'}</span> {/* 修复：可选链+兜底 */}
             <span className="w-px h-8 bg-yellow-500/30"></span>
             <span>{config.mainHeading?.[1] || '一战成硕'}</span> {/* 修复：可选链+兜底 */}
           </h1>
        </div>

        <div 
          onClick={() => config.publicCourse?.link && window.open(config.publicCourse.link, '_blank', 'noopener noreferrer')} // 修复：可选链+noopener
          className="w-full mb-6 bg-gradient-to-r from-[#5c0b0b] to-[#8b1111] border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.4)] cursor-pointer active:scale-[0.99] transition-all"
          style={{ cursor: config.publicCourse?.link ? 'pointer' : 'default' }} // 修复：无链接时禁用指针样式
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex-shrink-0 flex items-center justify-center text-2xl shadow-inner">📺</div>
            <div className="flex flex-col truncate">
              <span className="text-yellow-400 font-black text-sm truncate">{config.publicCourse?.title || '有道考研公开课'}</span> {/* 修复：可选链+兜底 */}
              <span className="text-white/50 text-[9px] mt-0.5 truncate">{config.publicCourse?.desc || '名师带你冲刺高分'}</span> {/* 修复：可选链+兜底 */}
            </div>
          </div>
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-950 px-5 py-2.5 rounded-full text-xs font-black shadow-[0_4px_15px_rgba(245,166,35,0.4)] whitespace-nowrap">
            {config.publicCourse?.buttonText || '立即观看'} {/* 修复：可选链+兜底 */}
          </div>
        </div>

        <div className="w-full h-48 relative mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-black/20 flex flex-col justify-around py-4">
          {danmakuRows.map((row, idx) => (
            <div key={idx} className={`flex gap-6 whitespace-nowrap ${idx % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
              {[...row, ...row, ...row].map((t, i) => (
                <div key={`${idx}-${i}`} className="px-5 py-2 rounded-full border border-white/5 text-[11px] font-bold bg-white/10 backdrop-blur-sm"> {/* 修复：key 唯一性 */}
                  {t}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full space-y-5">
          <button 
            onClick={() => setShowForm(true)} 
            className={BTN_STYLE}
            aria-label={isSubmitted ? '修改我的心愿' : '许下上岸心愿'} // 修复：增加无障碍标签
          >{isSubmitted ? '修改我的心愿' : '许下上岸心愿'}</button>
          <button 
            onClick={handleViewCard} 
            className={BTN_STYLE}
            aria-label="查看我的心愿卡" // 修复：增加无障碍标签
          >查看我的心愿卡</button>
        </div>
      </div>

      {showForm && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center px-6 animate-in fade-in duration-300"
          aria-modal="true" // 修复：增加无障碍属性
          role="dialog" // 修复：增加无障碍属性
        >
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            onClick={() => setShowForm(false)}
            aria-label="关闭表单" // 修复：增加无障碍标签
          ></div>
          <form 
            onSubmit={handleSubmit} 
            className="relative bg-[#3a0808] border-2 border-yellow-500/30 p-8 rounded-[40px] w-full max-w-sm space-y-4"
            aria-labelledby="form-title" // 修复：增加无障碍关联
          >
            <h3 id="form-title" className="text-2xl font-calligraphy text-yellow-500 text-center mb-4">诚心所愿 必有回响</h3>
            <input 
              required 
              className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500" 
              placeholder="您的昵称" 
              value={formData.nickname} 
              onChange={e => setFormData({...formData, nickname: e.target.value.trim()})} // 修复：输入去空格
              aria-label="您的昵称" // 修复：增加无障碍标签
            />
            <input 
              required 
              className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500" 
              placeholder="目标分数 (如: 400+)" 
              value={formData.targetScore} 
              onChange={e => setFormData({...formData, targetScore: e.target.value.trim()})} // 修复：输入去空格
              aria-label="目标分数" // 修复：增加无障碍标签
            />
            <input 
              required 
              className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500" 
              placeholder="目标院校" 
              value={formData.targetSchool} 
              onChange={e => setFormData({...formData, targetSchool: e.target.value.trim()})} // 修复：输入去空格
              aria-label="目标院校" // 修复：增加无障碍标签
            />
            <textarea 
              required 
              className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl text-white h-24 outline-none focus:border-yellow-500" 
              placeholder="写下你的考研宣言..." 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value.trim()})} // 修复：输入去空格
              aria-label="考研宣言" // 修复：增加无障碍标签
            ></textarea>
            <button 
              type="submit" 
              className="w-full py-4 bg-yellow-500 text-red-900 rounded-full font-black text-xl shadow-lg"
              aria-label="生成上岸符" // 修复：增加无障碍标签
            >生成上岸符</button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes scroll-right { 0% { transform: translateX(-33.33%); } 100% { transform: translateX(0); } }
        .animate-scroll-left { animation: scroll-left 12s linear infinite; }
        .animate-scroll-right { animation: scroll-right 14s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
        /* 修复：动画兼容性 */
        @-webkit-keyframes scroll-left { 0% { -webkit-transform: translateX(0); } 100% { -webkit-transform: translateX(-33.33%); } }
        @-webkit-keyframes scroll-right { 0% { -webkit-transform: translateX(-33.33%); } 100% { -webkit-transform: translateX(0); } }
        .animate-scroll-left { -webkit-animation: scroll-left 12s linear infinite; }
        .animate-scroll-right { -webkit-animation: scroll-right 14s linear infinite; }
      `}</style>
    </div>
  );
};

export default WishPage;
