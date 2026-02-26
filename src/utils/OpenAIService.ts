class OpenAIService {
  async generateJewelryRecommendation(userData: any): Promise<string> {
    const {
      chineseCalendar,
      direction,
      answers,
      birthday,
      gender,
    } = userData;

    const prompt = `
    基于以下用户信息，为用户提供详细的首饰推荐分析：
    
    1. 生日：${birthday}
    2. 天干地支：${chineseCalendar.heavenlyStem}${chineseCalendar.earthlyBranch}年 ${chineseCalendar.zodiac}年 ${chineseCalendar.fiveElement}命
    3. 关注方向：${direction}
    4. 性格测试答案分布：${this.analyzeAnswers(answers)}
    5. 性别：${gender}
    
    请按照以下格式提供详细分析，每个部分都要有明确的标题：
    
    【核心结论：开运守护石】
    推荐关键词标签（3-4个）
    一句话点睛
    
    【性格画像】
    基于日干（日主）和性格测试结果分析用户的性格特质（结合性别，避免刻板印象，侧重风格偏好差异）
    
    【命理格局】
    基于八字组合分析用户的命理格局，包括先天优势和挑战
    
    【深度心理行为分析】
    当前状态：基于测试结果分析用户在关注方向的表现
    性格双面性：分析显性性格和隐性性格
    逻辑关联：分析八字特质与测试结果的关联
    
    【专属转运建议】
    个性化的首饰推荐（至少3种）
    每种推荐的详细理由，结合用户的天干地支、关注方向和性格特点，并参考性别在佩戴习惯/风格上的差异（如配饰尺寸、线条、颜色偏好等）
    佩戴建议和注意事项
    
    【首饰定案与材质解读】
    推荐 legit 的首饰定案
    材质解读和能量说明
    
    分析要详细、专业，语言要温暖、友好。
    `;
    console.log('@@@', prompt);
    try {
      // 获取API密钥
      let apiKey = process.env.DEEPSEEK_API_KEY;
      let apiUrl = 'https://api.deepseek.com/v1/chat/completions';

      // 构建请求体
      const body = {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的首饰顾问，擅长根据用户的生辰八字、性格特点和需求提供个性化的首饰推荐。'
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      // 调用API生成推荐
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content || '生成推荐失败，请重试';
    } catch (error) {
      console.error('Error generating recommendation:', error);
      // 返回默认推荐
      return this.getDefaultRecommendation(chineseCalendar, direction);
    }
  }

  private analyzeAnswers(answers: number[]): string {
    const optionCounts = Array(4).fill(0);
    answers.forEach(answer => {
      if (answer !== -1) {
        optionCounts[answer]++;
      }
    });

    const traits = [
      '外向活泼、自信果断',
      '内向沉稳、理性思考',
      '传统保守、注重实际',
      '创新独特、追求个性'
    ];

    let analysis = '';
    optionCounts.forEach((count, index) => {
      if (count > 0) {
        analysis += `${traits[index]}: ${count}次，`;
      }
    });

    return analysis.slice(0, -1);
  }

  private getDefaultRecommendation(chineseCalendar: any, direction: string): string {
    const recommendations: Record<string, Record<string, string>> = {
      '爱情': {
        '金': '建议佩戴玫瑰金或粉色系宝石，如粉晶、摩根石，提升人缘与柔和魅力。',
        '木': '建议佩戴祖母绿或碧玺等绿色系宝石，增强亲和力与耐心。',
        '水': '建议佩戴海蓝宝、蓝宝石等水属性宝石，提升沟通表达与包容力。',
        '火': '建议佩戴红宝石、石榴石等火系宝石，增强热情与吸引力。',
        '土': '建议佩戴黄水晶、琥珀等土系宝石，稳定关系与提升安全感。'
      },
      '事业': {
        '金': '建议佩戴金属质感强的首饰，如白金、钛钢，增强决断力与气场。',
        '木': '建议佩戴翡翠、绿幽灵等，增强执行力与成长动力。',
        '水': '建议佩戴黑曜石、黑玛瑙等，增强抗压与专注。',
        '火': '建议佩戴红玉髓、石榴石等，提升影响力与表现力。',
        '土': '建议佩戴黄虎眼石、黄水晶等，增强稳定性与务实。'
      },
      '财运': {
        '金': '建议佩戴金属材质或金色系，提升偏财运与机会敏锐度。',
        '木': '建议佩戴绿发晶、绿幽灵等，聚财稳财，贵人相助。',
        '水': '建议佩戴蓝宝石、海蓝宝等，提升智慧理财与流通性。',
        '火': '建议佩戴南红、红玛瑙等，提升正财运与行动力。',
        '土': '建议佩戴黄水晶、黄虎眼，强化守财与稳定收益。'
      }
    };

    const element = chineseCalendar.fiveElement;
    const baseRecommendation = recommendations[direction]?.[element] || recommendations[direction]?.['金'] || '建议佩戴适合自己的首饰，保持积极乐观的心态。';

    return `基于您的信息，推荐以下首饰：\n\n${baseRecommendation}\n\n佩戴建议：选择适合自己风格的首饰，定期清洁保养，保持积极乐观的心态。\n\n祝您生活愉快，心想事成！`;
  }
}

export default new OpenAIService();
