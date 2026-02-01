
import React from 'react';

export const COLORS = {
  MAIN_RED: '#991B1B',
  GOLD: '#FFD700',
  SOFT_GOLD: '#FCD34D',
  TALISMAN_RED: '#B91C1C'
};

// 全局配置中心
export const GLOBAL_CONFIG = {
  brandName: '网易有道考研',
  adminPassword: 'youdao_admin_888',
  bgmUrl: 'https://actions.google.com/animator/media/Fx_Whoosh_01.mp3', 
  tcbEnvId: 'your-tcb-env-id',
  
  share: {
    title: '2026考研政治祈福墙 - 助你高分上岸！',
    desc: '我在有道考研祈福墙许下了心愿，快来一起沾沾喜气，领取复试礼包！',
    img: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=400'
  },

  wishPage: {
    title: '2026考研祈福墙',
    subTitle: 'MAY ALL YOUR WISHES TRUE',
    mainHeading: ['写下心愿', '高分上岸'],
    publicCourse: {
      title: '出分公开课',
      desc: '有道名师团·出分避坑指南',
      buttonText: '立即预约',
      link: 'https://ke.youdao.com/' 
    },
    syncSuccessAlert: '祈福成功！心愿已同步至祈福墙。'
  },

  checkScorePage: {
    heading: '官方查分通道已开启',
    description: '建议提前准备好准考证号及身份证号。查分时建议开启屏幕录制，记录下属于你的高光时刻！',
    rewardHighlight: '✨ 记录查分瞬间，赢取万元奖学金 ✨',
    officialLink: 'https://yz.chsi.com.cn/apply/cjcx/' 
  },

  evaluatePage: {
    heading: '名师护航 感谢有你',
    teacherImg: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&h=400&auto=format&fit=crop',
    teacherTag: '有道政治名师团 · 倾情守护',
    selfMessageLabel: '我想对自己说的话：',
    selfMessagePlaceholder: '写给2026年那个上岸后的自己...'
  },

  reportPage: {
    heading: '有道报喜领奖台',
    subHeading: '填写信息参与抽奖，解锁万元礼分',
    marqueeText: '填写信息即有机会赢取【全额免单】奖学金 | 已有 12895 位同学参与抽奖',
    promoBanner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    promoTitle: '🔥 必看：出分避坑公开课',
    promoDesc: '名师直播解析复试线，教你如何逆袭稳上岸。点击下方按钮立即预约直播，解锁专属复试资料包。',
    promoBtn: '立即跳转直播间',
    promoLink: 'https://ke.youdao.com/',
    successMsg: '抽奖登记成功！中奖信息将通过短信通知。'
  }
};

/** 
 * 九个卡片图片替换区
 * 图片要求：
 * 1. 建议比例：9:16 (如 1080x1920 像素)
 * 2. 格式：JPG / PNG / WEBP
 * 3. 建议托管在高速 CDN 或 OSS 上以保证首屏加载速度
 */
export const POSTER_TEMPLATES = [
  { id: 1, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 2, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 3, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 4, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 5, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 6, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 7, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 8, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
  { id: 9, characterImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', title: '政治80+登科符', slogan: '选择全对，大题全准，上岸稳在命中！' },
];

export const INITIAL_STATS = {
  impressions: 0,
  shares: 0,
  wishSubmits: 0,
  reportSubmits: 0,
  stageReach: { WISH: 0, CHECK: 0, EVALUATE: 0, REPORT: 0 }
};
