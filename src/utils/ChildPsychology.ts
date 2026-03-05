
export interface ChildPsychologyResult {
  人格类型名称: string;
  核心人格结论: string;
  性格关键词: string[];
  成长优势: string[];
  成长建议: string[];
  性格形成路径: string[];
  心理分析: {
    当前状态: string;
    人格二元性: string;
    逻辑连接: string;
  };
  error?: string;
}

export interface ChildPsychologyData {
  answers: number[];
}

export const getChildPsychologyAnalysis = async (userData: ChildPsychologyData): Promise<ChildPsychologyResult> => {
  try {
    const response = await fetch('/api/child-psychology', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    // 检查是否有错误字段
    if (data.error) {
      return {
        error: data.error,
        人格类型名称: '平衡型人格',
        核心人格结论: '分析过程中出现错误，请稍后重试。',
        性格关键词: ['灵活', '适应', '平衡', '理性', '开放'],
        成长优势: ['适应能力强', '情绪调节好', '学习能力强', '抗压能力好'],
        成长建议: ['请稍后重试测试', '保持开放心态', '关注自我成长', '建立健康习惯'],
        性格形成路径: ['分析中...', '分析中...', '分析中...', '分析中...'],
        心理分析: {
          当前状态: '分析过程中出现错误',
          人格二元性: '请稍后重试',
          逻辑连接: '请稍后重试'
        }
      } as ChildPsychologyResult;
    }
    
    return data as ChildPsychologyResult;
  } catch (error) {
    console.error('Error getting child psychology analysis:', error);
    return { 
      error: '心理分析生成失败，请稍后重试',
      人格类型名称: '平衡型人格',
      核心人格结论: '分析过程中出现错误，请稍后重试。',
      性格关键词: ['灵活', '适应', '平衡', '理性', '开放'],
      成长优势: ['适应能力强', '情绪调节好', '学习能力强', '抗压能力好'],
      成长建议: ['请稍后重试测试', '保持开放心态', '关注自我成长', '建立健康习惯'],
      性格形成路径: ['分析中...', '分析中...', '分析中...', '分析中...'],
      心理分析: {
        当前状态: '分析过程中出现错误',
        人格二元性: '请稍后重试',
        逻辑连接: '请稍后重试'
      }
    } as ChildPsychologyResult;
  }
};