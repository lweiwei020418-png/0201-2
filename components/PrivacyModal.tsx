
import React from 'react';

interface PrivacyModalProps {
  onAgree: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      <div className="relative bg-red-800 border-2 border-yellow-500 p-8 rounded-3xl text-center space-y-6 max-w-sm overflow-y-auto max-h-[80vh] scrollbar-hide">
        <h3 className="text-xl font-bold text-yellow-400 tracking-widest">隐私保护与活动说明</h3>
        
        <div className="space-y-4 text-white/80 text-xs text-left leading-relaxed">
          <p className="font-bold text-yellow-200">【信息收集必要性】</p>
          <p>为了精准为您发放活动奖励（如复试礼包、奖学金等），我们需要收集您的昵称及联系方式。您的隐私安全受到有道考研的严格保护，仅用于本次活动及后续教务沟通。</p>
          
          <p className="font-bold text-yellow-200">【报喜活动大奖】</p>
          <ul className="list-decimal list-inside space-y-1">
            <li><span className="text-yellow-400">一等奖：</span>录屏被选中进入宣传片，享万元奖学金池分红或全额免单。</li>
            <li><span className="text-yellow-400">二等奖：</span>上传有效成绩截图，立得《2026复试面试真题库》。</li>
            <li><span className="text-yellow-400">三等奖：</span>发布心愿卡并分享，得10元考研课程优惠券。</li>
          </ul>
        </div>

        <button 
          onClick={onAgree}
          className="w-full py-4 bg-yellow-500 text-red-900 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          同意协议并进入
        </button>
      </div>
    </div>
  );
};

export default PrivacyModal;
