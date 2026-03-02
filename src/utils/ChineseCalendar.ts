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
  hour: number;
  hourStem: string;
  hourBranch: string;
  hourZodiac: string;
}

export const calculateChineseCalendar = (year: number, month: number, day: number, hour: number = 12): ChineseCalendarInfo => {
  // 计算天干地支
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  const heavenlyStem = HeavenlyStems[stemIndex];
  const earthlyBranch = EarthlyBranches[branchIndex];
  const zodiac = ChineseZodiac[branchIndex];
  
  // 计算五行（简化版）
  const elementIndex = stemIndex % 5;
  const fiveElement = FiveElements[elementIndex];
  
  // 计算时柱（时辰的天干地支）
  // 时支：根据小时数确定（0-23点对应12地支）
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourBranch = EarthlyBranches[hourBranchIndex];
  const hourZodiac = ChineseZodiac[hourBranchIndex];
  
  // 时干：根据日干和时支计算（五鼠遁）
  // 日干甲、己 -> 子时从甲子开始
  // 日干乙、庚 -> 子时从丙子开始
  // 日干丙、辛 -> 子时从戊子开始
  // 日干丁、壬 -> 子时从庚子开始
  // 日干戊、癸 -> 子时从壬子开始
  const dayStemIndex = stemIndex;
  const hourStemOffsetMap: Record<number, number> = {
    0: 0, // 甲 -> 甲子
    1: 2, // 乙 -> 丙子
    2: 4, // 丙 -> 戊子
    3: 6, // 丁 -> 庚子
    4: 8, // 戊 -> 壬子
    5: 0, // 己 -> 甲子
    6: 2, // 庚 -> 丙子
    7: 4, // 辛 -> 戊子
    8: 6, // 壬 -> 庚子
    9: 8  // 癸 -> 壬子
  };
  const hourStemOffset = hourStemOffsetMap[dayStemIndex];
  const hourStemIndex = (hourStemOffset + hourBranchIndex) % 10;
  const hourStem = HeavenlyStems[hourStemIndex];
  
  return {
    heavenlyStem,
    earthlyBranch,
    zodiac,
    fiveElement,
    year,
    month,
    day,
    hour,
    hourStem,
    hourBranch,
    hourZodiac
  };
};

export const formatChineseDate = (info: ChineseCalendarInfo): string => {
  return `${info.heavenlyStem}${info.earthlyBranch}年 ${info.zodiac}年 ${info.fiveElement}命`;
};