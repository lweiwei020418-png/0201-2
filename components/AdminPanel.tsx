
import React, { useState, useEffect } from 'react';
import { INITIAL_STATS } from '../constants';

interface AdminPanelProps {
  config: any;
  onUpdateConfig: (newConfig: any) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'DATA' | 'CONFIG'>('DASHBOARD');
  const [jsonInput, setJsonInput] = useState(JSON.stringify(config, null, 2));

  useEffect(() => {
    const rawData = localStorage.getItem('yidao_data') || '[]';
    setData(JSON.parse(rawData).reverse());
    const rawStats = localStorage.getItem('yidao_stats') || JSON.stringify(INITIAL_STATS);
    setStats(JSON.parse(rawStats));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('密码错误，请联系系统管理员。');
    }
  };

  const handleSaveConfig = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      onUpdateConfig(parsed);
      alert('配置已应用！');
    } catch (e) {
      alert('JSON 格式错误！');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-slate-900 border border-white/10 p-8 rounded-[32px] shadow-2xl space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🔐</div>
            <h2 className="text-xl font-bold text-white">管理后台登录</h2>
            <p className="text-xs text-white/40 mt-1">仅授权管理者可访问敏感数据</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" autoFocus className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500/50" placeholder="管理员密码" value={password} onChange={e => setPassword(e.target.value)}/>
            <button type="submit" className="w-full py-4 bg-yellow-600 text-white rounded-2xl font-bold">进入后台</button>
            <button type="button" onClick={onClose} className="w-full text-white/30 text-xs py-2">取消并返回</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 text-white flex flex-col p-6 font-sans overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setActiveTab('DASHBOARD')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'DASHBOARD' ? 'bg-yellow-600' : 'text-white/40'}`}>仪表盘</button>
          <button onClick={() => setActiveTab('DATA')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'DATA' ? 'bg-yellow-600' : 'text-white/40'}`}>数据管理</button>
          <button onClick={() => setActiveTab('CONFIG')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'CONFIG' ? 'bg-yellow-600' : 'text-white/40'}`}>UI 配置</button>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded">关闭</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black">{stats.impressions}</div>
                 <div className="text-[10px] text-white/40 uppercase">总曝光 (PV)</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black">{stats.shares}</div>
                 <div className="text-[10px] text-white/40 uppercase">转发分享</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black">{stats.wishSubmits}</div>
                 <div className="text-[10px] text-white/40 uppercase">心愿提交</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black">{stats.reportSubmits}</div>
                 <div className="text-[10px] text-white/40 uppercase">报喜领奖</div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
              <h3 className="text-sm font-bold mb-4">漏斗转化流向图</h3>
              <div className="space-y-4">
                {[
                  { label: '进入页面', key: 'WISH', color: 'bg-emerald-500' },
                  { label: '点击查分', key: 'CHECK', color: 'bg-blue-500' },
                  { label: '名师评价', key: 'EVALUATE', color: 'bg-yellow-500' },
                  { label: '报喜领奖', key: 'REPORT', color: 'bg-purple-500' },
                ].map((step, i) => {
                  const val = stats.stageReach[step.key] || 0;
                  const max = stats.stageReach['WISH'] || 1;
                  const pct = Math.round((val / max) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-white/60">{step.label}</span>
                        <span>{val} 人 ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${step.color}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DATA' && (
          <div className="space-y-4">
            {data.length === 0 ? <div className="text-center text-white/30 py-20">暂无提交数据</div> : data.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 text-xs">
                <div className="flex justify-between text-yellow-500 mb-2 font-bold"><span>{item.type}</span><span>{item.timestamp}</span></div>
                <p>昵称: {item.nickname} | 分数: {item.targetScore}</p>
                <p>目标: {item.targetSchool}</p>
                {item.message && <p className="mt-2 text-white/60 italic">"{item.message}"</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CONFIG' && (
          <div className="flex flex-col space-y-4 h-full">
            <textarea className="flex-1 min-h-[400px] bg-black p-4 rounded-lg font-mono text-[10px] text-emerald-400 outline-none border border-white/10" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}/>
            <button onClick={handleSaveConfig} className="w-full py-4 bg-emerald-600 rounded-xl font-bold">应用热更新配置</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
