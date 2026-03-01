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
  personality: string[];
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
    const systemPrompt = `
你是一位专业首饰顾问。
风格：温暖、专业、真实可信、可落地。
避免玄学恐吓式表达。
`;

    /**
     * ===== 强制 JSON 输出 =====
     */
    const instructionPrompt = `
你必须仅输出 JSON，不允许输出任何解释文字、Markdown、代码块或额外说明。

输出格式：

{
  "coreStone": {
    "name": "",
    "tags": ["", "", ""],
    "summary": ""
  },
  "fiveElements": [
    { "element": "金", "analysis": "" },
    { "element": "木", "analysis": "" },
    { "element": "水", "analysis": "" },
    { "element": "火", "analysis": "" },
    { "element": "土", "analysis": "" }
  ],
  "personality": ["", "", ""],
  "recommendations": [
    {
      "name": "",
      "benefits": ["", "", ""],
      "scene": ""
    },
    {
      "name": "",
      "benefits": ["", "", ""],
      "scene": ""
    }
  ],
  "materialExplanation": ""
}

要求：
- 必须是合法 JSON
- 所有字段都必须填写
- 禁止输出任何额外文本
`;

    /**
     * ===== 用户信息 =====
     */
    const userPrompt = `
用户信息：
生日：${birthday}
天干地支：${chineseCalendar.heavenlyStem}${chineseCalendar.earthlyBranch}年 ${chineseCalendar.zodiac}年 ${chineseCalendar.fiveElement}命
关注方向：${dirKey}
性别：${gender}
性格测试明细：
${qaLines}
`;

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
        temperature: 0.4, // 降低随机性
        max_tokens: 1500
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

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
        tags: ['稳健成长型', '务实理性', '长期积累者'],
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
      personality: [
        '表面冷静理性',
        '内心敏感细腻',
        'keywords关键字'
      ],
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
