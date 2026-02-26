import { ChineseCalendarInfo } from './ChineseCalendar';

export interface UserData {
  chineseCalendar: ChineseCalendarInfo;
  direction: string;
  answers: number[];
  birthday: string;
}

export interface Recommendation {
  coreConclusion: {
    tags: string[];
    insight: string;
  };
  personality: string;
  fatePattern: string;
  psychologicalAnalysis: {
    currentState: string;
    personalityDuality: string;
    logicConnection: string;
  };
  transportationAdvice: string;
  jewelryDecision: string;
  error?: string;
}

export const getAIRecommendation = async (userData: UserData): Promise<Recommendation> => {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    // 如果返回了错误信息
    if (data.error) {
      return {
        coreConclusion: {
          tags: [],
          insight: ''
        },
        personality: '',
        fatePattern: '',
        psychologicalAnalysis: {
          currentState: '',
          personalityDuality: '',
          logicConnection: ''
        },
        transportationAdvice: '',
        jewelryDecision: '',
        error: data.error
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    // 返回默认推荐
    return {
      coreConclusion: {
        tags: [],
        insight: ''
      },
      personality: '',
      fatePattern: '',
      psychologicalAnalysis: {
        currentState: '',
        personalityDuality: '',
        logicConnection: ''
      },
      transportationAdvice: '',
      jewelryDecision: '',
      error: '很抱歉，推荐生成失败，请稍后重试。建议您根据自己的喜好选择适合的首饰。'
    };
  }
};
