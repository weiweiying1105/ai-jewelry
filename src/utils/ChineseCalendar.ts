export const HeavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EarthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const ChineseZodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
export const FiveElements = ['木', '火', '土', '金', '水'];

export interface ChineseCalendarInfo {
  heavenlyStem: string;
  earthlyBranch: string;
  zodiac: string;
  fiveElement: string;
  year: number;
  month: number;
  day: number;
}

export const calculateChineseCalendar = (year: number, month: number, day: number): ChineseCalendarInfo => {
  // 计算天干地支
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  const heavenlyStem = HeavenlyStems[stemIndex];
  const earthlyBranch = EarthlyBranches[branchIndex];
  const zodiac = ChineseZodiac[branchIndex];
  
  // 计算五行（简化版）
  const elementIndex = stemIndex % 5;
  const fiveElement = FiveElements[elementIndex];
  
  return {
    heavenlyStem,
    earthlyBranch,
    zodiac,
    fiveElement,
    year,
    month,
    day
  };
};

export const formatChineseDate = (info: ChineseCalendarInfo): string => {
  return `${info.heavenlyStem}${info.earthlyBranch}年 ${info.zodiac}年 ${info.fiveElement}命`;
};