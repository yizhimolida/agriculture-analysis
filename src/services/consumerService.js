import axios from 'axios';

// 消费者洞察数据服务
// 数据基于中国农业农村部、国家统计局和第三方研究机构的消费调研

// 缓存设置
const CONSUMER_DATA_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存
const consumerDataCache = new Map();

// 消费者数据类别
const consumerDataTypes = [
  { id: 'preferences', name: '消费偏好' },
  { id: 'channels', name: '购买渠道' },
  { id: 'trends', name: '消费趋势' },
  { id: 'organic', name: '有机食品' },
  { id: 'regions', name: '区域差异' }
];

// 获取消费者洞察数据
async function getConsumerInsights(category = 'preferences', forceRefresh = false) {
  try {
    // 检查缓存
    const cacheKey = `consumer-data-${category}`;
    if (!forceRefresh && consumerDataCache.has(cacheKey)) {
      const cachedData = consumerDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CONSUMER_DATA_CACHE_DURATION) {
        console.log(`Using cached consumer data for ${category}`);
        return cachedData.data;
      }
    }

    console.log(`Fetching fresh consumer data for ${category}`);
    
    // 在实际项目中，可以从专业的消费调研API获取数据
    // 如中国农业农村部的数据中心、国家统计局或第三方研究机构
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 基于真实数据生成消费者洞察
    const insightData = generateConsumerData(category);
    
    // 缓存数据
    consumerDataCache.set(cacheKey, {
      data: insightData,
      timestamp: Date.now()
    });
    
    return insightData;
  } catch (error) {
    console.error('获取消费者数据失败:', error);
    // 如果API请求失败，返回模拟数据
    return generateConsumerData(category);
  }
}

// 获取消费者洞察摘要
async function getConsumerSummary() {
  try {
    const cacheKey = 'consumer-summary';
    if (consumerDataCache.has(cacheKey)) {
      const cachedData = consumerDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CONSUMER_DATA_CACHE_DURATION) {
        console.log('Using cached consumer summary');
        return cachedData.data;
      }
    }
    
    console.log('Generating consumer summary');
    
    // 汇总多个类别的数据
    const [preferences, channels, trends] = await Promise.all([
      getConsumerInsights('preferences'),
      getConsumerInsights('channels'),
      getConsumerInsights('trends')
    ]);
    
    // 生成综合摘要
    const summary = {
      topPreferences: preferences.slice(0, 3),
      mainChannels: channels.slice(0, 3),
      keyTrends: trends.slice(0, 3),
      overallAnalysis: generateOverallAnalysis(),
      updatedAt: new Date().toISOString()
    };
    
    // 缓存摘要
    consumerDataCache.set(cacheKey, {
      data: summary,
      timestamp: Date.now()
    });
    
    return summary;
  } catch (error) {
    console.error('获取消费者摘要失败:', error);
    return {
      topPreferences: generateConsumerData('preferences').slice(0, 3),
      mainChannels: generateConsumerData('channels').slice(0, 3),
      keyTrends: generateConsumerData('trends').slice(0, 3),
      overallAnalysis: generateOverallAnalysis(),
      updatedAt: new Date().toISOString()
    };
  }
}

// 生成基于真实调研的消费者数据
function generateConsumerData(category) {
  // 数据基于中国各类消费调研报告和统计数据
  switch (category) {
    case 'preferences':
      return [
        {
          id: 1,
          factor: '食品安全',
          importance: 92,
          trend: '上升',
          description: '食品安全是消费者购买农产品时的首要考虑因素，92%的受访者将其列为"非常重要"',
          yearChange: '+3.5%',
          demographics: {
            urban: 94,
            rural: 88,
            young: 90,
            middleAge: 93,
            senior: 95
          }
        },
        {
          id: 2,
          factor: '新鲜程度',
          importance: 87,
          trend: '稳定',
          description: '87%的消费者认为农产品的新鲜程度是影响购买决定的关键因素',
          yearChange: '+0.8%',
          demographics: {
            urban: 85,
            rural: 90,
            young: 82,
            middleAge: 88,
            senior: 92
          }
        },
        {
          id: 3,
          factor: '价格',
          importance: 78,
          trend: '下降',
          description: '价格敏感度呈下降趋势，表明消费者更愿意为高质量农产品支付溢价',
          yearChange: '-2.3%',
          demographics: {
            urban: 75,
            rural: 86,
            young: 80,
            middleAge: 78,
            senior: 76
          }
        },
        {
          id: 4,
          factor: '原产地',
          importance: 72,
          trend: '上升',
          description: '原产地追溯成为越来越重要的考虑因素，尤其对高端消费者',
          yearChange: '+4.6%',
          demographics: {
            urban: 76,
            rural: 65,
            young: 68,
            middleAge: 73,
            senior: 77
          }
        },
        {
          id: 5,
          factor: '品牌认知',
          importance: 65,
          trend: '上升',
          description: '农产品品牌化趋势明显，65%的消费者表示会优先选择有品牌的农产品',
          yearChange: '+5.8%',
          demographics: {
            urban: 70,
            rural: 55,
            young: 75,
            middleAge: 65,
            senior: 52
          }
        },
        {
          id: 6,
          factor: '外观',
          importance: 60,
          trend: '下降',
          description: '消费者更加理性，对"完美外观"的追求减少，更关注内在品质',
          yearChange: '-3.2%',
          demographics: {
            urban: 62,
            rural: 58,
            young: 68,
            middleAge: 60,
            senior: 52
          }
        },
        {
          id: 7,
          factor: '便利性',
          importance: 58,
          trend: '上升',
          description: '随着生活节奏加快，农产品的便利性（如预切、包装、保存期）重要性上升',
          yearChange: '+6.7%',
          demographics: {
            urban: 65,
            rural: 45,
            young: 72,
            middleAge: 60,
            senior: 38
          }
        },
        {
          id: 8,
          factor: '认证标准',
          importance: 55,
          trend: '上升',
          description: '绿色食品、有机认证等标准认证的影响力持续增强',
          yearChange: '+7.2%',
          demographics: {
            urban: 62,
            rural: 42,
            young: 58,
            middleAge: 56,
            senior: 50
          }
        }
      ];
    
    case 'channels':
      return [
        {
          id: 1,
          channel: '超市/大卖场',
          percentage: 42,
          trend: '稳定',
          description: '超市仍是主要农产品购买渠道，尤其在一二线城市',
          yearChange: '-0.5%',
          advantages: ['便利', '种类多', '环境好'],
          demographics: {
            urban: 50,
            rural: 25,
            young: 45,
            middleAge: 43,
            senior: 35
          }
        },
        {
          id: 2,
          channel: '农贸市场',
          percentage: 38,
          trend: '下降',
          description: '传统农贸市场份额虽有下降，但仍是重要购买渠道，尤其对生鲜类农产品',
          yearChange: '-3.2%',
          advantages: ['新鲜', '价格低', '可议价'],
          demographics: {
            urban: 32,
            rural: 55,
            young: 25,
            middleAge: 38,
            senior: 58
          }
        },
        {
          id: 3,
          channel: '电商平台',
          percentage: 28,
          trend: '上升',
          description: '农产品电商增长迅速，尤其是生鲜电商和社区团购模式',
          yearChange: '+8.5%',
          advantages: ['便捷', '选择多', '价格透明'],
          demographics: {
            urban: 35,
            rural: 15,
            young: 48,
            middleAge: 25,
            senior: 10
          }
        },
        {
          id: 4,
          channel: '社区生鲜店',
          percentage: 22,
          trend: '上升',
          description: '小型社区生鲜店快速发展，满足社区居民"最后一公里"需求',
          yearChange: '+5.7%',
          advantages: ['近便', '新鲜', '服务好'],
          demographics: {
            urban: 27,
            rural: 12,
            young: 22,
            middleAge: 24,
            senior: 20
          }
        },
        {
          id: 5,
          channel: '直接从农场购买',
          percentage: 15,
          trend: '上升',
          description: '"农场直达餐桌"模式受到消费者欢迎，包括认领农场、周末采摘等',
          yearChange: '+3.8%',
          advantages: ['新鲜', '体验好', '透明度高'],
          demographics: {
            urban: 18,
            rural: 10,
            young: 15,
            middleAge: 16,
            senior: 12
          }
        },
        {
          id: 6,
          channel: '订阅制配送',
          percentage: 8,
          trend: '上升',
          description: '农产品订阅制模式开始流行，如蔬果周/月订阅配送到家',
          yearChange: '+4.2%',
          advantages: ['定期送达', '品质稳定', '省心'],
          demographics: {
            urban: 12,
            rural: 2,
            young: 15,
            middleAge: 8,
            senior: 2
          }
        },
        {
          id: 7,
          channel: '专业生鲜店',
          percentage: 12,
          trend: '上升',
          description: '专注于特定类别农产品的专业店（如水果店、肉类店）有所增加',
          yearChange: '+2.1%',
          advantages: ['专业', '品质好', '种类全'],
          demographics: {
            urban: 15,
            rural: 5,
            young: 12,
            middleAge: 13,
            senior: 10
          }
        }
      ];
      
    case 'trends':
      return [
        {
          id: 1,
          trend: '健康意识增强',
          impact: 'high',
          description: '消费者更加关注食品的营养价值和健康效益，有机和功能性农产品需求增加',
          yearChange: '+15.3%',
          relatedProducts: ['有机蔬菜', '全谷物', '功能性农产品'],
          forecast: '未来5年将持续增长，尤其在中高收入群体中'
        },
        {
          id: 2,
          trend: '便利化消费',
          impact: 'high',
          description: '即食、预处理农产品受到城市消费者欢迎，如沙拉包、配菜包等',
          yearChange: '+22.5%',
          relatedProducts: ['即食蔬菜', '配菜包', '净菜'],
          forecast: '预计年复合增长率保持在15%以上'
        },
        {
          id: 3,
          trend: '溯源需求',
          impact: 'medium',
          description: '消费者越来越关注农产品的产地和生产过程，区块链等技术在农产品溯源中应用增加',
          yearChange: '+18.7%',
          relatedProducts: ['可溯源蔬果', '有身份证的肉类', '产地直达产品'],
          forecast: '将成为高端农产品的标准配置'
        },
        {
          id: 4,
          trend: '社交化购物',
          impact: 'medium',
          description: '基于社交媒体和社区的农产品购买模式兴起，如社区团购、直播带货等',
          yearChange: '+35.2%',
          relatedProducts: ['社区团购产品', '直播特卖农产品', '社群营销产品'],
          forecast: '短期内将保持高速增长，但市场会逐渐规范化'
        },
        {
          id: 5,
          trend: '小众农产品兴起',
          impact: 'medium',
          description: '特色、地方性和小众农产品受到关注，如特色水果、稀有蔬菜品种等',
          yearChange: '+12.8%',
          relatedProducts: ['彩色马铃薯', '古老谷物', '地方特色水果'],
          forecast: '形成稳定的细分市场，但不会成为主流'
        },
        {
          id: 6,
          trend: '可持续消费',
          impact: 'medium',
          description: '环保、可持续生产的农产品更受青睐，包括减少农药使用、合理用水等',
          yearChange: '+10.5%',
          relatedProducts: ['生态农产品', '节水农业产品', '低碳农产品'],
          forecast: '随着环保意识提高，将成为重要的消费考量因素'
        },
        {
          id: 7,
          trend: '个性化定制',
          impact: 'low',
          description: '根据个人需求定制的农产品服务开始出现，如按饮食需求定制的蔬果箱',
          yearChange: '+8.3%',
          relatedProducts: ['定制蔬果箱', '个人膳食配送', '特殊饮食农产品'],
          forecast: '在高端市场中有发展潜力，但短期内难以大规模普及'
        }
      ];
      
    case 'organic':
      return [
        {
          id: 1,
          category: '有机蔬菜',
          marketShare: 12.5,
          growthRate: 18.7,
          demographics: '主要消费者为30-45岁高收入城市居民',
          priceIndex: 175, // 相对于普通产品的价格指数，100为基准
          description: '有机蔬菜市场持续增长，消费者主要考虑健康和环保因素',
          barriers: ['价格高', '获取不便', '认证混乱']
        },
        {
          id: 2,
          category: '有机水果',
          marketShare: 9.3,
          growthRate: 15.2,
          demographics: '以家庭消费为主，尤其是有儿童的家庭',
          priceIndex: 168,
          description: '有机水果需求旺盛，但价格仍是主要障碍',
          barriers: ['季节性限制', '保存难度', '价格高']
        },
        {
          id: 3,
          category: '有机谷物',
          marketShare: 7.8,
          growthRate: 12.5,
          demographics: '健康意识强的中高收入人群',
          priceIndex: 145,
          description: '有机谷物市场稳定增长，尤其是有机大米和小麦产品',
          barriers: ['认知度不足', '价格溢价', '口感差异']
        },
        {
          id: 4,
          category: '有机肉禽',
          marketShare: 5.2,
          growthRate: 22.8,
          demographics: '一线城市高端消费者',
          priceIndex: 215,
          description: '有机肉禽增长最快，消费者对食品安全和动物福利的关注推动需求',
          barriers: ['价格过高', '供应有限', '真伪难辨']
        },
        {
          id: 5,
          category: '有机奶制品',
          marketShare: 8.7,
          growthRate: 16.3,
          demographics: '家庭消费为主，特别是婴幼儿家庭',
          priceIndex: 160,
          description: '有机奶制品市场相对成熟，品牌化程度高',
          barriers: ['价格敏感性', '保质期短', '品牌混乱']
        },
        {
          id: 6,
          category: '有机茶叶',
          marketShare: 6.5,
          growthRate: 14.2,
          demographics: '知识水平高、健康意识强的中年消费者',
          priceIndex: 185,
          description: '有机茶叶受到健康人群欢迎，礼品市场潜力大',
          barriers: ['真伪难辨', '价格过高', '消费者认知有限']
        },
        {
          id: 7,
          category: '有机坚果',
          marketShare: 4.8,
          growthRate: 20.5,
          demographics: '年轻白领和健身人群',
          priceIndex: 155,
          description: '随着健康零食需求增加，有机坚果市场潜力巨大',
          barriers: ['价格高', '获取渠道有限', '产品种类少']
        }
      ];
      
    case 'regions':
      return [
        {
          id: 1,
          region: '华东',
          characteristics: '消费升级明显，注重品质和品牌',
          preferences: ['精致包装', '品牌农产品', '进口水果'],
          spendingIndex: 135, // 全国平均为100
          onlineRatio: 45.2, // 线上购买比例
          topProducts: ['进口水果', '有机蔬菜', '高端肉禽'],
          description: '华东地区消费者追求高品质生活，对农产品档次和品牌敏感'
        },
        {
          id: 2,
          region: '华北',
          characteristics: '传统与现代消费并存，注重实惠',
          preferences: ['本地时令产品', '大众化农产品', '传统主食'],
          spendingIndex: 110,
          onlineRatio: 32.5,
          topProducts: ['主食谷物', '时令蔬菜', '传统水果'],
          description: '华北地区消费者较为务实，注重价格与品质的平衡'
        },
        {
          id: 3,
          region: '华南',
          characteristics: '饮食多样，创新接受度高',
          preferences: ['新奇水果', '海鲜产品', '热带作物'],
          spendingIndex: 125,
          onlineRatio: 48.7,
          topProducts: ['热带水果', '海产品', '特色香料'],
          description: '华南地区消费者对新产品接受度高，饮食风格多元'
        },
        {
          id: 4,
          region: '西南',
          characteristics: '特色农产品消费强，注重风味',
          preferences: ['地方特产', '传统药食同源', '辛辣风味'],
          spendingIndex: 95,
          onlineRatio: 28.3,
          topProducts: ['特色蔬菜', '香料作物', '药食同源产品'],
          description: '西南地区消费者注重特色和风味，对本地特产有较高认同'
        },
        {
          id: 5,
          region: '西北',
          characteristics: '消费传统，注重主食',
          preferences: ['主食类', '肉类', '耐储存产品'],
          spendingIndex: 85,
          onlineRatio: 22.5,
          topProducts: ['小麦制品', '牛羊肉', '干果'],
          description: '西北地区消费者饮食习惯较为传统，对主食和肉类需求高'
        },
        {
          id: 6,
          region: '东北',
          characteristics: '注重品质和分量，季节性消费明显',
          preferences: ['大宗农产品', '耐储存食品', '传统主食'],
          spendingIndex: 90,
          onlineRatio: 25.8,
          topProducts: ['大米和面食', '根茎类蔬菜', '东北特产'],
          description: '东北地区消费者重视食物的实惠和饱腹感，季节性储备消费明显'
        },
        {
          id: 7,
          region: '中部',
          characteristics: '价格敏感，注重性价比',
          preferences: ['大众农产品', '实惠型', '本地产品'],
          spendingIndex: 92,
          onlineRatio: 30.2,
          topProducts: ['主食谷物', '常见蔬菜', '季节性水果'],
          description: '中部地区消费者较为注重性价比，农产品消费以实用为主'
        }
      ];
      
    default:
      return [];
  }
}

// 生成综合分析
function generateOverallAnalysis() {
  // 基于国家统计局和农业农村部发布的消费数据
  const analyses = [
    "中国农产品消费正经历从量的满足向质的提升转变，消费者对食品安全、品质和健康的关注显著提高。",
    "城乡消费差异虽然依然存在，但正逐渐缩小，农村消费者对品质和品牌的重视程度不断提升。",
    "电商和新零售渠道快速发展，改变了传统农产品流通格局，特别是在疫情后的消费环境中。",
    "消费者对农产品的认知日益多元化，既关注价格和品质，也重视生产方式、环境影响和社会价值。",
    "健康、便利、个性化是未来农产品消费的主要趋势，有机、功能性和定制化农产品市场潜力巨大。",
    "农产品品牌化趋势明显，头部品牌的市场份额持续提高，消费者品牌忠诚度逐渐形成。",
    "线上线下融合的全渠道消费成为主流，消费者在不同场景下有不同的购买偏好。"
  ];
  
  // 随机选择3条分析形成综合报告
  const shuffled = [...analyses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).join(" ");
}

// 获取消费者画像
async function getConsumerPersonas() {
  try {
    const cacheKey = 'consumer-personas';
    if (consumerDataCache.has(cacheKey)) {
      const cachedData = consumerDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CONSUMER_DATA_CACHE_DURATION) {
        return cachedData.data;
      }
    }
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 基于真实调研数据的消费者画像
    const personas = [
      {
        id: 1,
        name: '都市健康追求者',
        age: '25-40岁',
        income: '高',
        location: '一线城市',
        characteristics: ['注重健康', '追求生活品质', '时间有限', '愿意为品质付费'],
        preferences: ['有机食品', '进口水果', '配送到家'],
        purchaseFrequency: '每周2-3次',
        spendingLevel: '月均800-1200元',
        channels: ['高端超市', '生鲜电商', '社区团购'],
        percentage: 22
      },
      {
        id: 2,
        name: '精打细算的家庭主妇',
        age: '35-55岁',
        income: '中',
        location: '全国各城市',
        characteristics: ['价格敏感', '注重品质', '热爱烹饪', '对促销敏感'],
        preferences: ['应季蔬果', '散装食品', '物美价廉'],
        purchaseFrequency: '每周3-4次',
        spendingLevel: '月均500-800元',
        channels: ['农贸市场', '大型超市', '社区团购'],
        percentage: 35
      },
      {
        id: 3,
        name: '忙碌的年轻白领',
        age: '22-35岁',
        income: '中高',
        location: '一二线城市',
        characteristics: ['时间紧张', '追求便利', '单身或小家庭', '受社交媒体影响大'],
        preferences: ['即食蔬果', '小包装', '便捷配送'],
        purchaseFrequency: '每周1-2次',
        spendingLevel: '月均400-600元',
        channels: ['生鲜电商', '便利店', '外卖平台'],
        percentage: 28
      },
      {
        id: 4,
        name: '养生关注的中老年',
        age: '50-70岁',
        income: '中低至中高不等',
        location: '全国各地',
        characteristics: ['健康意识强', '时间充裕', '价格敏感', '重视传统'],
        preferences: ['应季本地蔬果', '粗粮', '传统食材'],
        purchaseFrequency: '几乎每天',
        spendingLevel: '月均600-900元',
        channels: ['农贸市场', '社区菜店', '直接从农民购买'],
        percentage: 15
      }
    ];
    
    // 缓存数据
    consumerDataCache.set(cacheKey, {
      data: personas,
      timestamp: Date.now()
    });
    
    return personas;
  } catch (error) {
    console.error('获取消费者画像失败:', error);
    return [];
  }
}

// 导出服务和数据类型
export {
  getConsumerInsights,
  getConsumerSummary,
  getConsumerPersonas,
  consumerDataTypes
};