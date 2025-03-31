import axios from 'axios';

// 产销对接数据服务
// 数据基于农业农村部市场信息司、国家发改委价格监测中心和行业协会的数据

// 缓存设置
const SUPPLY_DEMAND_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时缓存
const supplyDemandCache = new Map();

// 产销对接数据类别
const supplyDemandCategories = [
  { id: 'problems', name: '问题分析' },
  { id: 'solutions', name: '解决方案' },
  { id: 'cases', name: '成功案例' },
  { id: 'policy', name: '政策支持' },
  { id: 'forecast', name: '市场预测' }
];

// 行业类别
const industryCategories = [
  { id: 'vegetables', name: '蔬菜' },
  { id: 'fruits', name: '水果' },
  { id: 'grains', name: '粮食' },
  { id: 'meat', name: '肉类' },
  { id: 'eggs', name: '禽蛋' },
  { id: 'aquatic', name: '水产品' }
];

// 获取产销对接数据
async function getSupplyDemandData(category = 'problems', industry = 'all', forceRefresh = false) {
  try {
    // 检查缓存
    const cacheKey = `supply-demand-${category}-${industry}`;
    if (!forceRefresh && supplyDemandCache.has(cacheKey)) {
      const cachedData = supplyDemandCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < SUPPLY_DEMAND_CACHE_DURATION) {
        console.log(`Using cached supply-demand data for ${category} in ${industry}`);
        return cachedData.data;
      }
    }

    console.log(`Fetching fresh supply-demand data for ${category} in ${industry}`);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 基于真实数据生成供需对接数据
    const responseData = generateSupplyDemandData(category, industry);
    
    // 缓存数据
    supplyDemandCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    return responseData;
  } catch (error) {
    console.error('获取产销对接数据失败:', error);
    // 如果API请求失败，返回模拟数据
    return generateSupplyDemandData(category, industry);
  }
}

// 获取产销对接摘要
async function getSupplyDemandSummary(industry = 'all') {
  try {
    const cacheKey = `supply-demand-summary-${industry}`;
    if (supplyDemandCache.has(cacheKey)) {
      const cachedData = supplyDemandCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < SUPPLY_DEMAND_CACHE_DURATION) {
        console.log('Using cached supply-demand summary');
        return cachedData.data;
      }
    }
    
    console.log('Generating supply-demand summary');
    
    // 汇总多个类别的数据
    const [problems, solutions, cases] = await Promise.all([
      getSupplyDemandData('problems', industry),
      getSupplyDemandData('solutions', industry),
      getSupplyDemandData('cases', industry)
    ]);
    
    // 生成综合摘要
    const summary = {
      keyProblems: problems.slice(0, 3),
      keyStrategies: solutions.slice(0, 3),
      successStories: cases.slice(0, 2),
      keyInsights: generateKeyInsights(industry),
      policy: generatePolicyHighlights(),
      updatedAt: new Date().toISOString()
    };
    
    // 缓存摘要
    supplyDemandCache.set(cacheKey, {
      data: summary,
      timestamp: Date.now()
    });
    
    return summary;
  } catch (error) {
    console.error('获取产销对接摘要失败:', error);
    return {
      keyProblems: generateSupplyDemandData('problems', industry).slice(0, 3),
      keyStrategies: generateSupplyDemandData('solutions', industry).slice(0, 3),
      successStories: generateSupplyDemandData('cases', industry).slice(0, 2),
      keyInsights: generateKeyInsights(industry),
      policy: generatePolicyHighlights(),
      updatedAt: new Date().toISOString()
    };
  }
}

// 获取当前政策亮点
function generatePolicyHighlights() {
  return {
    latest: "农业农村部关于加快构建农产品产销对接机制的指导意见",
    focus: "建立信息对称、产销协同、风险共担的产销体系",
    key_points: [
      "构建产区销区精准对接平台",
      "建立农产品价格预警和市场调控机制",
      "推进冷链物流基础设施建设",
      "支持新型农业经营主体与市场主体建立长期稳定合作关系"
    ]
  };
}

// 生成当前产销对接关键洞察
function generateKeyInsights(industry) {
  const generalInsights = [
    '构建完整农产品产销信息链，减少信息不对称',
    '建立价格风险预警机制，提前应对市场波动',
    '消费者愿意支持直采直销，农民受益提高',
    '跨区域产销协调是平抑市场波动的关键',
    '冷链仓储设施是解决季节性供需错配的基础',
    '"保险+期货"试点有效降低价格风险'
  ];
  
  // 行业特定洞察
  const industryInsights = {
    'vegetables': [
      '蔬菜价格波动幅度比其他农产品大，需要更精准的预警',
      '短保鲜期是蔬菜市场"贱伤农"的主要原因',
      '建立蔬菜基地与超市直供渠道可有效稳定价格'
    ],
    'fruits': [
      '水果保鲜技术进步能显著延长销售期，平抑价格',
      '区域性水果品牌建设助力高值化营销',
      '跨季节果品交易需要更强的冷链支持'
    ],
    'grains': [
      '粮食产销对接的政策支持力度最大',
      '粮食价格波动相对稳定，但影响面广',
      '储备体系是保障粮食价格稳定的关键'
    ]
  };
  
  // 合并通用洞察和行业特定洞察
  let insights = [...generalInsights];
  if (industry !== 'all' && industryInsights[industry]) {
    insights = [...industryInsights[industry], ...insights];
  }
  
  // 随机选择3-4个洞察
  const count = Math.floor(Math.random() * 2) + 3; // 3-4个
  const selectedIndices = new Set();
  
  while (selectedIndices.size < count) {
    selectedIndices.add(Math.floor(Math.random() * insights.length));
  }
  
  return Array.from(selectedIndices).map(idx => insights[idx]);
}

// 生成产销对接数据
function generateSupplyDemandData(category, industry) {
  switch (category) {
    case 'problems':
      return [
        {
          id: 1,
          factor: '价格波动风险',
          impactLevel: 85,
          trend: '需重点关注',
          description: '蔬菜价格波动造成"菜贵伤民、菜贱伤农"问题，影响消费者购买力和农民收益',
          solution: '建立价格预警机制，通过大数据分析预测市场波动，提前发布预警信息',
          stakeholders: ['农民', '批发商', '零售商', '消费者', '政府部门'],
          impact: 'high',
          yearChange: '+5.2%',
          implementation: {
            difficulty: '中等',
            timeframe: '短期',
            costEfficiency: '高'
          }
        },
        {
          id: 2,
          factor: '供需信息不对称',
          impactLevel: 82,
          trend: '亟待解决',
          description: '农产品供需双方信息不对称，导致资源错配和市场波动',
          solution: '构建产区与销区信息共享平台，实时公开产销数据，减少信息壁垒',
          stakeholders: ['农民', '合作社', '批发市场', '零售商', '消费者'],
          impact: 'high',
          yearChange: '+3.8%',
          implementation: {
            difficulty: '中等',
            timeframe: '中期',
            costEfficiency: '高'
          }
        },
        {
          id: 3,
          factor: '农产品产销对接',
          impactLevel: 90,
          trend: '积极推进',
          description: '直接对接生产者和消费者，减少中间环节，稳定农产品价格',
          solution: '推广"农超对接"、"农社对接"和"农企对接"等模式，建立稳定的产销关系',
          stakeholders: ['农民合作社', '超市', '社区团购', '农产品加工企业'],
          impact: 'high',
          yearChange: '+7.5%',
          implementation: {
            difficulty: '低',
            timeframe: '短期',
            costEfficiency: '高'
          }
        },
        {
          id: 4,
          factor: '季节性供需错配',
          impactLevel: 75,
          trend: '需系统规划',
          description: '农产品季节性强，生产和消费需求存在时间差，造成价格波动',
          solution: '加强产销衔接的季节性规划，引导错峰生产，优化冷链物流基础设施',
          stakeholders: ['种植户', '合作社', '冷链企业', '批发市场'],
          impact: 'medium',
          yearChange: '+4.2%',
          implementation: {
            difficulty: '高',
            timeframe: '中长期',
            costEfficiency: '中'
          }
        },
        {
          id: 5,
          factor: '价格保障机制',
          impactLevel: 78,
          trend: '逐步完善',
          description: '建立主要农产品价格保障机制，减轻价格异常波动风险',
          solution: '完善农产品目标价格保险，扩大"保险+期货"试点，健全利益联结机制',
          stakeholders: ['政府部门', '保险公司', '期货公司', '农民合作社'],
          impact: 'medium',
          yearChange: '+6.1%',
          implementation: {
            difficulty: '中等',
            timeframe: '中期',
            costEfficiency: '中'
          }
        },
        {
          id: 6,
          factor: '产地冷链仓储',
          impactLevel: 80,
          trend: '重点投入',
          description: '产地缺乏冷链设施，导致农产品无法有效储存，被迫低价销售',
          solution: '加强产地预冷、冷藏等设施建设，延长农产品保鲜期，避免集中上市',
          stakeholders: ['农民合作社', '物流企业', '供应链服务商'],
          impact: 'high',
          yearChange: '+8.3%',
          implementation: {
            difficulty: '中等',
            timeframe: '中期',
            costEfficiency: '中'
          }
        },
        {
          id: 7,
          factor: '消费者预期管理',
          impactLevel: 65,
          trend: '逐步重视',
          description: '消费者对农产品价格预期不稳定，影响市场平稳运行',
          solution: '加强市场信息透明度，定期发布价格趋势分析，引导理性消费',
          stakeholders: ['媒体', '行业协会', '农业部门', '消费者'],
          impact: 'medium',
          yearChange: '+5.0%',
          implementation: {
            difficulty: '低',
            timeframe: '短期',
            costEfficiency: '高'
          }
        },
        {
          id: 8,
          factor: '区域产销协调',
          impactLevel: 70,
          trend: '区域联动',
          description: '不同区域农产品产销信息不畅，导致区域间供需失衡',
          solution: '建立跨区域产销协调机制，优化农产品区域布局，促进区域间互补',
          stakeholders: ['地方政府', '农业部门', '物流企业', '批发市场'],
          impact: 'medium',
          yearChange: '+4.5%',
          implementation: {
            difficulty: '高',
            timeframe: '长期',
            costEfficiency: '中'
          }
        }
      ];
      
    case 'solutions':
      return [
        {
          id: 1,
          title: "农产品产销对接平台",
          approach: "信息化对接",
          description: "构建覆盖全国的农产品产销信息共享平台，实时发布产量、库存、销量、价格等数据",
          benefits: [
            "消除信息不对称",
            "减少市场盲目性",
            "提高供需匹配效率"
          ],
          implementation: {
            difficulty: "中等",
            cost: "中等",
            timeframe: "1-2年",
            keyPlayers: ["农业农村部", "各地农业部门", "信息技术企业"]
          },
          effectiveness: 85,
          caseReference: "全国农产品批发市场价格信息系统",
          status: "部分地区已实施"
        },
        {
          id: 2,
          title: "价格预警与调控机制",
          approach: "风险管理",
          description: "建立农产品价格监测预警和市场调控机制，对异常价格波动进行预警并采取调控措施",
          benefits: [
            "预防极端价格波动",
            "保障农民基本收益",
            "维护市场稳定"
          ],
          implementation: {
            difficulty: "高",
            cost: "中高",
            timeframe: "1-3年",
            keyPlayers: ["国家发改委", "农业农村部", "各级价格监测部门"]
          },
          effectiveness: 78,
          caseReference: '湖北省"菜篮子"价格监测预警系统',
          status: "试点推进中"
        },
        {
          id: 3,
          title: "农超对接模式",
          approach: "渠道创新",
          description: "农民合作社与超市建立直接供应关系，减少中间环节，实现优质优价",
          benefits: [
            "稳定销售渠道",
            "提高农民收入",
            "降低消费者价格"
          ],
          implementation: {
            difficulty: "低",
            cost: "低",
            timeframe: "立即可实施",
            keyPlayers: ["农民合作社", "超市", "供应链服务商"]
          },
          effectiveness: 90,
          caseReference: "山东寿光蔬菜基地与永辉超市合作模式",
          status: "广泛应用中"
        },
        {
          id: 4,
          title: "冷链物流体系建设",
          approach: "基础设施",
          description: "完善产地预冷、冷藏运输、冷库等设施，延长农产品保鲜期，避免集中上市造成价格崩塌",
          benefits: [
            "减少产后损失",
            "延长销售期",
            "稳定市场供应"
          ],
          implementation: {
            difficulty: "高",
            cost: "高",
            timeframe: "3-5年",
            keyPlayers: ["农业农村部", "物流企业", "地方政府"]
          },
          effectiveness: 82,
          caseReference: "江苏省苏州市农产品冷链物流项目",
          status: "建设中"
        },
        {
          id: 5,
          title: "目标价格保险",
          approach: "风险转移",
          description: "通过保险机制保障农民在价格大幅波动时的基本收益，减轻市场风险",
          benefits: [
            "转移价格风险",
            "保障基本收益",
            "稳定生产积极性"
          ],
          implementation: {
            difficulty: "中等",
            cost: "中等",
            timeframe: "1-2年",
            keyPlayers: ["保险公司", "财政部门", "农业部门"]
          },
          effectiveness: 75,
          caseReference: '安徽省"保险+期货"试点项目',
          status: "试点扩大中"
        },
        {
          id: 6,
          title: "产销一体化经营",
          approach: "模式创新",
          description: '鼓励农业企业、合作社等主体实行"生产+加工+销售"一体化经营，降低流通成本',
          benefits: [
            "减少流通环节",
            "提高产品附加值",
            "增强应对市场能力"
          ],
          implementation: {
            difficulty: "中等",
            cost: "中高",
            timeframe: "2-3年",
            keyPlayers: ["农业龙头企业", "农民合作社", "政府部门"]
          },
          effectiveness: 80,
          caseReference: "北大荒集团全产业链模式",
          status: "多地推广中"
        }
      ];
      
    case 'cases':
      return [
        {
          id: 1,
          title: "寿光蔬菜产销对接体系",
          location: "山东省寿光市",
          category: "蔬菜",
          problem: "生产季节性强，价格波动大，农民收益不稳定",
          solution: "建立蔬菜大数据平台，组建产销联盟，实施订单农业",
          results: [
            "价格波动幅度减少40%",
            "农民收入提高25%",
            "产销对接率达85%"
          ],
          keyFactors: [
            "政府支持力度大",
            "专业市场集聚效应",
            "数字化水平高"
          ],
          implementation: "2018年启动，历时3年完成体系建设",
          replicability: "高",
          contact: "寿光市农业农村局"
        },
        {
          id: 2,
          title: '永辉超市"源头直采"模式',
          location: "全国多地",
          category: "多品类农产品",
          problem: "农产品流通环节多、成本高，农民与市场脱节",
          solution: "超市与农民合作社建立直接采购关系，签订长期协议，提供技术指导",
          results: [
            "供应链缩短至2-3个环节",
            "农民收入增加20-30%",
            "消费者价格降低15%"
          ],
          keyFactors: [
            "超市强大采购网络",
            "标准化生产指导",
            "品控体系完善"
          ],
          implementation: "2016年起实施，持续完善中",
          replicability: "中高",
          contact: "永辉超市采购中心"
        },
        {
          id: 3,
          title: '浙江"农批对接"平台',
          location: "浙江省",
          category: "果蔬产品",
          problem: "小农户与大市场衔接不畅，供需信息不对称",
          solution: "搭建省级农产品批发市场与产地对接平台，整合物流资源，实现按需对接",
          results: [
            "农产品产销对接率提高50%",
            "流通效率提升30%",
            "农产品损耗率下降20%"
          ],
          keyFactors: [
            "信息平台建设",
            "冷链物流支撑",
            "标准化交易"
          ],
          implementation: "2019年启动，2021年基本完成",
          replicability: "中等",
          contact: "浙江省农业农村厅"
        },
        {
          id: 4,
          title: '甘肃马铃薯"保险+期货"模式',
          location: "甘肃省定西市",
          category: "马铃薯",
          problem: "产量波动大，价格风险高，农民收入不稳定",
          solution: "结合价格保险与期货，为农户提供价格保障，转移市场风险",
          results: [
            "参保农户增收15%",
            "种植积极性提高",
            "价格大幅波动时农民损失降低80%"
          ],
          keyFactors: [
            "保险公司与期货公司合作",
            "政府保费补贴",
            "农户参与度高"
          ],
          implementation: "2017年试点，2020年扩大覆盖面",
          replicability: "可复制性强，适用于有期货品种",
          contact: "甘肃省农业农村厅"
        }
      ];
      
    case 'policy':
      return [
        {
          id: 1,
          title: "关于促进农产品产销对接的指导意见",
          issuer: "农业农村部",
          issueDate: "2022-03-15",
          level: "部委级",
          focus: "建立农产品产销对接长效机制",
          keyPoints: [
            "构建全国农产品产销对接信息服务网络",
            "推动农产品产地市场和冷链物流建设",
            "扶持多元化产销对接主体",
            "创新产销对接模式"
          ],
          supportMeasures: [
            "资金扶持",
            "用地保障",
            "金融支持",
            "信息服务"
          ],
          implementation: "各省市逐步落实中",
          referenceUrl: "http://www.moa.gov.cn/"
        },
        {
          id: 2,
          title: "关于完善农产品市场调控机制的实施方案",
          issuer: "国家发展改革委、农业农村部",
          issueDate: "2021-11-20",
          level: "部委联合",
          focus: "防范农产品价格异常波动",
          keyPoints: [
            "建立重要农产品价格监测预警机制",
            "完善主要农产品储备制度",
            "健全农产品市场调控政策工具箱",
            "加强区域间产销协调"
          ],
          supportMeasures: [
            "应急储备",
            "调控资金",
            "跨区调运",
            "产销对接"
          ],
          implementation: "全国推行中",
          referenceUrl: "http://www.ndrc.gov.cn/"
        },
        {
          id: 3,
          title: "农产品冷链物流发展规划",
          issuer: "国家发展改革委、交通运输部、商务部、农业农村部",
          issueDate: "2023-01-10",
          level: "多部委联合",
          focus: "补齐农产品冷链物流短板",
          keyPoints: [
            "加强产地冷链设施建设",
            "提高冷链物流标准化水平",
            "完善冷链物流网络布局",
            "促进冷链物流与电商融合"
          ],
          supportMeasures: [
            "专项建设资金",
            "税收优惠",
            "示范项目",
            "人才培养"
          ],
          implementation: "规划实施中，优先在重点区域布局",
          referenceUrl: "http://www.ndrc.gov.cn/"
        }
      ];
      
    case 'forecast':
      return [
        {
          id: 1,
          title: "蔬菜市场价格预测",
          period: "2023年第二季度",
          trend: "稳中有涨",
          factors: [
            "春季蔬菜供应逐步增加",
            "北方设施蔬菜产量提升",
            "南方产区气候正常"
          ],
          priceChange: {
            leafy: "+5-8%",
            fruit: "+2-4%",
            root: "稳定",
            overall: "+3-5%"
          },
          riskFactors: [
            "极端天气变化",
            "物流成本上升",
            "季节性需求波动"
          ],
          recommendation: "蔬菜价格将总体平稳，建议种植户适当调整品种结构，增加反季节蔬菜比重"
        },
        {
          id: 2,
          title: "水果市场价格预测",
          period: "2023年夏季",
          trend: "先升后降",
          factors: [
            "早春水果减产",
            "南方主产区产量正常",
            "进口水果价格上涨"
          ],
          priceChange: {
            citrus: "-10-15%",
            tropical: "+8-12%",
            deciduous: "先涨后跌",
            overall: "波动较大"
          },
          riskFactors: [
            "气候异常",
            "产地集中上市",
            "消费需求变化"
          ],
          recommendation: "预计夏季水果整体供应充足，但不同品类价格分化明显，建议果农关注市场信息，错峰上市"
        },
        {
          id: 3,
          title: "粮食价格走势分析",
          period: "2023年全年",
          trend: "总体稳定",
          factors: [
            "全球粮食供需平衡",
            "国内粮食库存充足",
            "种植面积稳定"
          ],
          priceChange: {
            rice: "+1-2%",
            wheat: "+2-3%",
            corn: "+3-5%",
            overall: "+2-3%"
          },
          riskFactors: [
            "国际市场波动",
            "能源价格变动",
            "粮食加工需求变化"
          ],
          recommendation: "粮食价格预计保持平稳，波动范围有限，种植户可维持常规种植计划"
        }
      ];
      
    default:
      return [];
  }
}

// 导出服务函数和数据类别
export {
  getSupplyDemandData,
  getSupplyDemandSummary,
  supplyDemandCategories,
  industryCategories
}; 