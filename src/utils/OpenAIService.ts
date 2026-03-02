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
要求：tags风格如"天生贵人命、晚熟爆发型"；analysis简洁有画面感如"火元素偏弱-行动力易受情绪影响"；五行分数根据八字年柱计算(0-100)；personality三层次(surface/innerCore/truth)需具体场景；recommendations必须是首饰类产品（如手链、项链、戒指、耳环、胸针等），不得推荐非首饰产品；所有字段必填`;

    const userPrompt = `生日：${birthday}
八字：${chineseCalendar.heavenlyStem}${chineseCalendar.earthlyBranch}年${chineseCalendar.zodiac}${chineseCalendar.fiveElement}命
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
      throw error;
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

}

export default new OpenAIService();
