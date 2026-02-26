class OpenAIService {
  async generateJewelryRecommendation(userData: any): Promise<string> {
    const {
      chineseCalendar,
      direction,
      answers,
      birthday
    } = userData;

    const prompt = `
    基于以下用户信息，为用户提供详细的首饰推荐分析：
    
    1. 生日：${birthday}
    2. 天干地支：${chineseCalendar.heavenlyStem}${chineseCalendar.earthlyBranch}年 ${chineseCalendar.zodiac}年 ${chineseCalendar.fiveElement}命
    3. 关注方向：${direction}
    4. 性格测试答案分布：${this.analyzeAnswers(answers)}
    
    请按照以下格式提供详细分析，每个部分都要有明确的标题：
    
    【核心结论：开运守护石】
    推荐关键词标签（3-4个）
    一句话点睛
    
    【性格画像】
    基于日干（日主）和性格测试结果分析用户的性格特质
    
    【命理格局】
    基于八字组合分析用户的命理格局，包括先天优势和挑战
    
    【深度心理行为分析】
    当前状态：基于测试结果分析用户在关注方向的表现
    性格双面性：分析显性性格和隐性性格
    逻辑关联：分析八字特质与测试结果的关联
    
    【专属转运建议】
    个性化的首饰推荐（至少3种）
    每种推荐的详细理由，结合用户的天干地支、关注方向和性格特点
    佩戴建议和注意事项
    
    【首饰定案与材质解读】
    推荐的首饰定案
    材质解读和能量说明
    
    分析要详细、专业，语言要温暖、友好。
    `;

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
    const recommendations = {
      '姻缘': {
        '木': '翡翠项链 - 象征着爱情的纯洁与永恒，有助于增进感情和谐。\n和田玉手镯 - 温润养人，能够稳定感情，促进婚姻美满。\n粉晶手链 - 招桃花，提升异性缘。',
        '火': '红宝石戒指 - 热情似火，能够吸引异性缘，增强魅力。\n红玛瑙手串 - 增强自信，提升个人魅力。\n石榴石吊坠 - 促进感情升温。',
        '土': '黄水晶手链 - 稳定感情，促进婚姻美满。\n琥珀项链 - 温和包容，增进人缘。\n和田玉挂件 - 守护感情。',
        '金': '黄金耳环 - 富贵吉祥，提升女性魅力。\n钻石戒指 - 象征永恒的爱情。\n铂金项链 - 高贵典雅。',
        '水': '珍珠吊坠 - 温柔典雅，象征着纯洁的爱情。\n海蓝宝石手链 - 平静心灵，改善人际关系。\n月光石戒指 - 增进感情和谐。'
      },
      '事业': {
        '木': '绿幽灵水晶 - 助力事业发展，增强创造力。\n小叶紫檀手串 - 招财纳福，事业有成。\n绿松石吊坠 - 促进人际关系和谐。',
        '火': '红玛瑙手链 - 增强自信，提升领导力。\n红碧玺吊坠 - 热情奔放，财运亨通。\n太阳石手串 - 增强正能量。',
        '土': '黄玉吊坠 - 稳定事业，招财进宝。\n黄水晶聚宝盆 - 聚财招财，财富增长。\n和田玉印章 - 提升权威。',
        '金': '钻石胸针 - 象征成功，提升职场地位。\n黄金转运珠 - 转运招财，吉祥如意。\n铂金戒指 - 高贵优雅。',
        '水': '蓝纹石手串 - 冷静思考，做出明智决策。\n海蓝宝石吊坠 - 增强沟通能力。\n黑曜石手链 - 辟邪化煞。'
      },
      '财运': {
        '木': '小叶紫檀手串 - 招财纳福，事业有成。\n绿幽灵水晶 - 助力事业发展，增强财运。\n黄花梨手串 - 保值增值。',
        '火': '红碧玺吊坠 - 热情奔放，财运亨通。\n红玛瑙手链 - 增强自信，提升财运。\n太阳石手串 - 增强正能量，吸引财富。',
        '土': '黄水晶聚宝盆 - 聚财招财，财富增长。\n黄玉吊坠 - 稳定财运，招财进宝。\n琥珀项链 - 招财纳福。',
        '金': '黄金转运珠 - 转运招财，吉祥如意。\n钻石戒指 - 象征财富和成功。\n铂金手链 - 高贵典雅，提升财运。',
        '水': '黑曜石手链 - 辟邪化煞，招财进宝。\n海蓝宝石吊坠 - 增强沟通能力，促进财运。\n珍珠项链 - 招财纳福。'
      },
      '健康': {
        '木': '沉香手串 - 静心安神，促进身心健康。\n绿松石手链 - 促进身体健康。\n小叶紫檀手串 - 养生保健。',
        '火': '红珊瑚项链 - 活血养颜，身体健康。\n红玛瑙手链 - 增强活力。\n太阳石手串 - 增强正能量。',
        '土': '和田玉手镯 - 温润养人，保健养生。\n琥珀项链 - 缓解压力。\n黄玉吊坠 - 平衡能量。',
        '金': '纯银手镯 - 杀菌消炎，促进血液循环。\n黄金手链 - 保健养生。\n铂金戒指 - 高贵典雅。',
        '水': '珍珠项链 - 美容养颜，延缓衰老。\n海蓝宝石吊坠 - 平静心灵。\n月光石手链 - 促进睡眠。'
      },
      '人际关系': {
        '木': '绿松石手链 - 促进人际关系和谐，增强沟通能力。\n小叶紫檀手串 - 提升个人魅力。\n绿幽灵水晶 - 促进人缘。',
        '火': '红珊瑚项链 - 热情友好，容易与人相处。\n红玛瑙手链 - 增强自信，提升魅力。\n太阳石手串 - 增强正能量。',
        '土': '琥珀项链 - 温和包容，增进人缘。\n黄玉吊坠 - 平衡人际关系。\n和田玉挂件 - 提升个人魅力。',
        '金': '铂金戒指 - 高贵优雅，提升个人气质。\n黄金耳环 - 富贵吉祥，提升魅力。\n钻石胸针 - 提升个人品味。',
        '水': '海蓝宝石吊坠 - 平静心灵，改善人际关系。\n珍珠项链 - 温柔典雅，提升人缘。\n月光石手链 - 增进和谐。'
      },
      '学业': {
        '木': '文昌塔挂件 - 助力学业，增强记忆力。\n绿幽灵水晶 - 增强创造力，提升学习能力。\n绿松石手链 - 促进思维清晰。',
        '火': '紫水晶吊坠 - 增强智慧，提高学习能力。\n红玛瑙手链 - 增强专注力。\n太阳石手串 - 增强学习动力。',
        '土': '黄玉吊坠 - 稳定学习状态，提高效率。\n琥珀项链 - 缓解学习压力。\n和田玉挂件 - 提升专注力。',
        '金': '钛钢书签 - 象征知识，提升学习效率。\n黄金转运珠 - 转运提升学业。\n铂金戒指 - 提升学习专注力。',
        '水': '蓝水晶手串 - 思维清晰，逻辑推理能力强。\n海蓝宝石吊坠 - 增强沟通能力。\n珍珠项链 - 提升学习效率。'
      }
    };

    const element = chineseCalendar.fiveElement;
    const baseRecommendation = recommendations[direction]?.[element] || recommendations[direction]?.['金'] || '建议佩戴适合自己的首饰，保持积极乐观的心态。';

    return `基于您的信息，推荐以下首饰：\n\n${baseRecommendation}\n\n佩戴建议：选择适合自己风格的首饰，定期清洁保养，保持积极乐观的心态。\n\n祝您生活愉快，心想事成！`;
  }
}

export default new OpenAIService();
