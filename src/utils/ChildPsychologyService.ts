import { childQuestions } from '../data/childQuestions';
import { ChildPsychologyResult } from './ChildPsychology';

class ChildPsychologyService {
  async generatePsychologyAnalysis(userData: { answers: number[] }): Promise<ChildPsychologyResult> {
    const { answers } = userData;

    // 生成答题明细
    const qaLines = answers
      .map((ans: number, idx: number) => {
        const q = childQuestions[idx];
        if (!q) return null;
        const picked = ans !== -1 ? q.options[ans] : '未作答';
        return `第${idx + 1}题（${q.dimension}）：${q.question} -> ${picked}`;
      })
      .filter(Boolean)
      .join('\n');

    // System Prompt
    const systemPrompt = `专业心理咨询师，温暖专业，避免负面标签，注重积极心理学。`;

    // Instruction Prompt
    const instructionPrompt = `输出JSON：{"人格类型名称":"","核心人格结论":"","性格关键词":["","","","",""],"成长优势":["","","","",""],"成长建议":["","","","",""],"性格形成路径":["","","",""],"心理分析":{"当前状态":"","人格二元性":"","逻辑连接":""}}。要求：1.人格类型命名要积极正面，如"责任型成长者"、"独立型人格"等；2.核心人格结论要解释性格成因，避免负面评价；3.性格关键词要准确反映性格特质，5个词；4.成长优势要具体，5条；5.成长建议要实用可操作，4条；6.性格形成路径要体现成长历程，4个阶段；7.心理分析要深入，体现当前状态、性格矛盾和内在逻辑；8.所有字段必填。`;

    // User Prompt
    const userPrompt = `心理调查问卷（50题，5个维度：童年安全感、父母养育方式、情感忽视、家庭冲突、依恋模式）
答题明细：
${qaLines}

请根据以上答题情况，分析用户的性格特点、成长经历和心理状态。`;

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
        temperature: 0.7,
        max_tokens: 1500
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

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
      console.error('Error generating psychology analysis:', error);
      throw error;
    }
  }

  /**
   * JSON 解析保护
   */
  private safeJsonParse(content: string): ChildPsychologyResult {
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

export default new ChildPsychologyService();
