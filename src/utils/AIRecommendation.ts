import { ChineseCalendarInfo } from './ChineseCalendar';

export interface UserData {
  chineseCalendar: ChineseCalendarInfo;
  direction: string;
  answers: number[];
  birthday: string;
}

export const getAIRecommendation = async (userData: UserData): Promise<string> => {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data.recommendation;
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    // 返回默认推荐
    return '很抱歉，推荐生成失败，请稍后重试。建议您根据自己的喜好选择适合的首饰。';
  }
};
