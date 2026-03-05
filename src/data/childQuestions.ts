// 心理调查问卷数据（50题）
export interface ChildQuestionItem {
  question: string;
  options: string[];
  dimension: string;
}

// 评分选项
export const ratingOptions = ['完全不符合', '不太符合', '比较符合', '非常符合'];

// 心理调查问卷（50题，5个维度）
export const childQuestions: ChildQuestionItem[] = [
  // 第一部分：童年安全感
  {
    question: '小时候家里整体氛围是温暖的',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '父母会耐心听我表达想法',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '我小时候很少担心家庭会出问题',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '遇到困难时父母会支持我',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '我小时候感觉自己是被爱的',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '父母之间关系比较稳定',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '家里很少发生激烈争吵',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '父母会鼓励我尝试新事情',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '我小时候觉得家是安全的地方',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  {
    question: '父母尊重我的感受',
    options: ratingOptions,
    dimension: '童年安全感'
  },
  
  // 第二部分：父母养育方式
  {
    question: '父母对我的要求非常高',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '我小时候经常被批评',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '父母希望我按照他们的方式生活',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '父母很少认可我的努力',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '犯错时父母会严厉指责',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '父母会干涉我的很多选择',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '父母希望我成为"他们想要的人"',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '父母很在意成绩或表现',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '我需要很努力才能得到认可',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  {
    question: '我常常担心让父母失望',
    options: ratingOptions,
    dimension: '父母养育方式'
  },
  
  // 第三部分：情感忽视
  {
    question: '我小时候很少和父母聊内心想法',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '父母不太理解我的情绪',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '当我难过时很少有人安慰',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '我习惯自己消化情绪',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '父母很少表达爱',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '家庭里不太讨论情绪',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '我小时候经常感到孤单',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '父母更关注成绩而不是感受',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '我不太习惯向家人求助',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  {
    question: '我觉得自己情绪不重要',
    options: ratingOptions,
    dimension: '情感忽视'
  },
  
  // 第四部分：家庭冲突
  {
    question: '父母经常吵架',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '家庭气氛经常紧张',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '我小时候害怕家庭冲突',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '家庭里经常有人发脾气',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '我需要小心避免惹人生气',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '家庭关系不太稳定',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '我小时候常常担心家庭问题',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '家庭成员之间沟通困难',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '我经常感到家庭压力',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  {
    question: '家里有过让我难忘的冲突事件',
    options: ratingOptions,
    dimension: '家庭冲突'
  },
  
  // 第五部分：依恋模式
  {
    question: '我很害怕被别人拒绝',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我在人际关系中容易讨好别人',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我不太容易信任别人',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我害怕亲密关系',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我很在意别人怎么看我',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我不太擅长表达真实想法',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我经常担心别人离开',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我习惯自己承担问题',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我在人际关系中容易退缩',
    options: ratingOptions,
    dimension: '依恋模式'
  },
  {
    question: '我很难完全放松做自己',
    options: ratingOptions,
    dimension: '依恋模式'
  }
];

// 维度信息
export const dimensions = [
  { id: '童年安全感', name: '童年安全感', questions: 10, maxScore: 40 },
  { id: '父母养育方式', name: '父母养育方式', questions: 10, maxScore: 40 },
  { id: '情感忽视', name: '情感忽视', questions: 10, maxScore: 40 },
  { id: '家庭冲突', name: '家庭冲突', questions: 10, maxScore: 40 },
  { id: '依恋模式', name: '依恋模式', questions: 10, maxScore: 40 }
];

// 结果类型
export interface ResultType {
  type: number;
  name: string;
  characteristics: string[];
  description: string;
}

export const resultTypes: ResultType[] = [
  {
    type: 1,
    name: '安全型成长',
    characteristics: ['家庭稳定', '情感支持强', '性格安全感高'],
    description: '你的性格形成于相对稳定和支持性的成长环境。童年时期获得的安全感让你更容易建立健康的人际关系。'
  },
  {
    type: 2,
    name: '控制型家庭影响',
    characteristics: ['完美主义', '自我要求高', '害怕失败'],
    description: '你可能成长于要求较高的家庭环境。这种环境让你具备责任感，但也可能让你对自己过于苛刻。'
  },
  {
    type: 3,
    name: '情感忽视型',
    characteristics: ['不善表达情绪', '独立但孤独', '难以求助'],
    description: '你的成长经历可能缺少情绪层面的支持。你学会了独立，但也可能习惯独自承受情绪。'
  },
  {
    type: 4,
    name: '冲突型家庭',
    characteristics: ['高敏感', '容易焦虑', '回避冲突'],
    description: '成长环境中的紧张关系可能让你对情绪和冲突更敏感。这种经历让你更警觉，但也可能增加心理压力。'
  },
  {
    type: 5,
    name: '焦虑依恋型',
    characteristics: ['害怕被抛弃', '讨好型人格', '情感依赖'],
    description: '你在人际关系中可能更加渴望安全感。这种模式通常与早期关系经验有关。'
  }
];

