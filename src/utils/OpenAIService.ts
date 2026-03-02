import { questionsByDirection } from '../data/questions20';
import type { Direction } from '../data/questions20';

/**
 * ===== 返回结构 =====
 */
export interface JewelryResult {
  coreStone: {
    name: string;
    tags: string[];
    summary: string;
  };
  fiveElements: {
    element: string;
    analysis: string;
  }[];
  fiveElementScore: {
    金: number;
    木: number;
    水: number;
    火: number;
    土: number;
  };
  personality: {
    surface: {
      title: string;
      description: string;
    };
    innerCore: {
      title: string;
      description: string;
    };
    truth: {
      title: string;
      description: string;
    };
  };
  recommendations: {
    name: string;
    benefits: string[];
    scene: string;
  }[];
  materialExplanation: string;
}

class OpenAIService {
  async generateJewelryRecommendation(userData: any): Promise<JewelryResult> {
    const { chineseCalendar, direction, answers, birthday, gender } = userData;

    /**
     * ===== 方向安全校验 =====
     */
    const keys = Object.keys(questionsByDirection) as Direction[];
    const dirKey: Direction = keys.includes(direction as Direction)
      ? (direction as Direction)
      : keys[0];

    const qs = questionsByDirection[dirKey];

    /**
     * ===== QA 明细生成 =====
     */
    const qaLines = answers
      .map((ans: number, idx: number) => {
        const q = qs[idx];
        if (!q) return null;
        const picked = ans !== -1 ? q.options[ans] : '未作答';
        return `第${idx + 1}题：${q.question} -> ${picked}`;
      })
      .filter(Boolean)
      .join('\n');

    /**
     * ===== System Prompt =====
     */
    const systemPrompt = `专业首饰顾问，温暖专业，避免玄学恐吓。`;

    const instructionPrompt = `输出JSON：{"coreStone":{"name":"","tags":["","",""],"summary":""},"fiveElements":[{"element":"金","analysis":""},{"element":"木","analysis":""},{"element":"水","analysis":""},{"element":"火","analysis":""},{"element":"土","analysis":""}],"fiveElementScore":{"金":0,"木":0,"水":0,"火":0,"土":0},"personality":{"surface":{"title":"","description":""},"innerCore":{"title":"","description":""},"truth":{"title":"","description":""}},"recommendations":[{"name":"","benefits":["","",""],"scene":""},{"name":"","benefits":["","",""],"scene":""},{"name":"","benefits":["","",""],"scene":""}],"materialExplanation":""}
要求：tags风格如"天生贵人命、晚熟爆发型"；analysis简洁有画面感如"火元素偏弱-行动力易受情绪影响"；五行分数根据八字时辰计算(0-100)；personality三层次(surface/innerCore/truth)需具体场景；recommendations必须是首饰类产品（如手链、项链、戒指、耳环、胸针等），不得推荐非首饰产品；所有字段必填`;

    const userPrompt = `生日：${birthday}
八字：${chineseCalendar.heavenlyStem}${chineseCalendar.earthlyBranch}年${chineseCalendar.zodiac}${chineseCalendar.fiveElement}命，${chineseCalendar.hourStem}${chineseCalendar.hourBranch}时${chineseCalendar.hourZodiac}
方向：${dirKey}，性别：${gender}
答题：${qaLines}`;

    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

      const body = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: instructionPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty model response');
      }

      return this.safeJsonParse(content);

    } catch (error) {
      console.error('Error generating recommendation:', error);
      return this.getDefaultRecommendation();
    }
  }

  /**
   * ===== JSON 解析保护 =====
   */
  private safeJsonParse(content: string): JewelryResult {
    try {
      return JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Invalid JSON response');
    }
  }

  /**
   * ===== 默认降级方案 =====
   */
  private getDefaultRecommendation(): JewelryResult {
    return {
      coreStone: {
        name: '黄水晶',
        tags: ['天生贵人命', '厚积薄发型', '财富积累者'],
        summary: '你属于稳扎稳打型人格，适合长期布局型能量。'
      },
      fiveElements: [
        { element: '火', analysis: '行动力需要目标驱动。' },
        { element: '水', analysis: '思考较多，偶尔内耗。' },
        { element: '木', analysis: '成长潜力稳定。' }
      ],
      fiveElementScore: {
        金: 60,
        木: 70,
        水: 55,
        火: 45,
        土: 80
      },
      personality: {
        surface: {
          title: '理性克制',
          description: '你给人的第一印象是冷静、稳重、有条理。在工作和社交场合中，你总是能够保持情绪稳定，用逻辑分析问题，很少冲动行事。同事和朋友都认为你是一个可靠的人，遇到困难时，你总是能够冷静地找到解决方案。'
        },
        innerCore: {
          title: '渴望认可',
          description: '在内心深处，你其实非常在意他人的看法和评价。你努力追求完美，希望得到周围人的认可和赞赏。当你感到被忽视或批评时，内心会产生强烈的焦虑和不安。你常常为了满足他人的期待而压抑自己的真实感受。'
        },
        truth: {
          title: '平衡之道',
          description: '你的表面理性和内核敏感看似矛盾，实则是一种平衡。理性是你的保护色，让你在复杂的环境中生存；而敏感是你的天赋，让你能够深刻地理解他人。真正的成长不是抛弃其中任何一面，而是学会在理性与感性之间找到平衡，既保持冷静的判断力，又接纳自己真实的情感需求。'
        }
      },
      recommendations: [
        {
          name: '黄水晶手链',
          benefits: ['稳定财气', '增强专注力', '提升执行力'],
          scene: '适合日常通勤佩戴'
        },
        {
          name: '细金链项链',
          benefits: ['增强气场', '提升存在感', '加强决断力'],
          scene: '适合重要场合佩戴'
        }
      ],
      materialExplanation: '黄水晶象征稳定与积累，适合长期发展型人格。'
    };
  }
}

export default new OpenAIService();
