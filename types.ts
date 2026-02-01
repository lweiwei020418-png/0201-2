
export enum AppStage {
  WISH = 'WISH',           // 祈福墙 (出分前)
  CHECK_SCORE = 'CHECK',   // 查分中转 (出分当天)
  EVALUATE = 'EVALUATE',   // 评价老师 (查分后)
  SUCCESS_REPORT = 'REPORT' // 报喜上传 (核心转化)
}

export interface WishData {
  nickname: string;
  targetSchool: string;
  targetScore: string;
  message: string;
}

export interface UserReport {
  nickname: string;
  phone: string;
  screenshot?: string;
  hasVideo: boolean;
}

