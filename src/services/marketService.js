import axios from 'axios';

// 从农业农村部市场信息系统获取数据
// 由于没有直接的API，我们使用代理服务或模拟一个API响应
const MARKET_DATA_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时缓存
const marketDataCache = new Map();

// 主要农产品类别
const productCategories = [
  { id: 'grains', name: '粮食' },
  { id: 'vegetables', name: '蔬菜' },
  { id: 'fruits', name: '水果' },
  { id: 'meat', name: '肉类' },
  { id: 'eggs', name: '禽蛋' },
  { id: 'aquatic', name: '水产品' }
];

// 获取市场价格数据
async function getMarketPriceData(category = 'vegetables') {
  try {
    // 检查缓存
    const cacheKey = `market-prices-${category}`;
    if (marketDataCache.has(cacheKey)) {
      const cachedData = marketDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < MARKET_DATA_CACHE_DURATION) {
        console.log(`Using cached market data for ${category}`);
        return cachedData.data;
      }
    }

    // 以蔬菜为例，从正规开放的农产品价格API获取数据
    // 这里使用的是第三方API，在实际项目中可能需要替换为实际可用的API
    // 例如中国农业信息网、农业农村部网站等提供的数据
    console.log(`Fetching fresh market data for ${category}`);
    
    // 注：在实际项目中，这里需要替换为实际可用的API端点
    // 由于直接API可能受限，我们可以使用公开的农产品批发价格信息
    // 以下是模拟API请求，实际环境中应替换为真实API
    // const response = await axios.get(`https://api.example.com/agricultural-prices/${category}`);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 由于直接API访问可能有限制，我们这里生成一些基于真实数据的模拟数据
    // 在实际项目中，这部分应替换为真实API调用
    const simulatedData = generateMarketData(category);
    
    // 缓存数据
    marketDataCache.set(cacheKey, {
      data: simulatedData,
      timestamp: Date.now()
    });
    
    return simulatedData;
  } catch (error) {
    console.error('获取市场价格数据失败:', error);
    // 如果API请求失败，返回模拟数据
    return generateMarketData(category);
  }
}

// 生成基于真实价格范围的农产品价格数据
function generateMarketData(category) {
  // 基于真实市场价格范围的模拟数据
  const productsMap = {
    'vegetables': [
      { name: '白菜', unit: '元/公斤', priceRange: [1.2, 3.5], trend: getRandomTrend() },
      { name: '土豆', unit: '元/公斤', priceRange: [1.5, 4.2], trend: getRandomTrend() },
      { name: '西红柿', unit: '元/公斤', priceRange: [3.0, 8.5], trend: getRandomTrend() },
      { name: '黄瓜', unit: '元/公斤', priceRange: [2.8, 7.5], trend: getRandomTrend() },
      { name: '茄子', unit: '元/公斤', priceRange: [3.2, 7.8], trend: getRandomTrend() },
      { name: '青椒', unit: '元/公斤', priceRange: [3.5, 9.0], trend: getRandomTrend() },
      { name: '胡萝卜', unit: '元/公斤', priceRange: [1.8, 4.5], trend: getRandomTrend() },
      { name: '大蒜', unit: '元/公斤', priceRange: [5.0, 15.0], trend: getRandomTrend() },
      { name: '生姜', unit: '元/公斤', priceRange: [8.0, 25.0], trend: getRandomTrend() },
      { name: '菠菜', unit: '元/公斤', priceRange: [3.5, 10.0], trend: getRandomTrend() }
    ],
    'fruits': [
      { name: '苹果', unit: '元/公斤', priceRange: [5.0, 15.0], trend: getRandomTrend() },
      { name: '香蕉', unit: '元/公斤', priceRange: [3.5, 8.0], trend: getRandomTrend() },
      { name: '橙子', unit: '元/公斤', priceRange: [4.0, 12.0], trend: getRandomTrend() },
      { name: '梨', unit: '元/公斤', priceRange: [4.5, 10.0], trend: getRandomTrend() },
      { name: '葡萄', unit: '元/公斤', priceRange: [8.0, 25.0], trend: getRandomTrend() },
      { name: '西瓜', unit: '元/公斤', priceRange: [2.0, 6.0], trend: getRandomTrend() },
      { name: '桃子', unit: '元/公斤', priceRange: [6.0, 18.0], trend: getRandomTrend() },
      { name: '猕猴桃', unit: '元/公斤', priceRange: [10.0, 30.0], trend: getRandomTrend() },
      { name: '草莓', unit: '元/公斤', priceRange: [15.0, 45.0], trend: getRandomTrend() },
      { name: '柚子', unit: '元/公斤', priceRange: [5.0, 12.0], trend: getRandomTrend() }
    ],
    'grains': [
      { name: '大米', unit: '元/公斤', priceRange: [4.0, 10.0], trend: getRandomTrend() },
      { name: '小麦', unit: '元/公斤', priceRange: [2.4, 3.8], trend: getRandomTrend() },
      { name: '玉米', unit: '元/公斤', priceRange: [2.0, 3.5], trend: getRandomTrend() },
      { name: '大豆', unit: '元/公斤', priceRange: [4.5, 8.5], trend: getRandomTrend() },
      { name: '高粱', unit: '元/公斤', priceRange: [2.8, 4.5], trend: getRandomTrend() },
      { name: '燕麦', unit: '元/公斤', priceRange: [3.5, 7.0], trend: getRandomTrend() },
      { name: '黑米', unit: '元/公斤', priceRange: [8.0, 15.0], trend: getRandomTrend() },
      { name: '糯米', unit: '元/公斤', priceRange: [5.0, 10.0], trend: getRandomTrend() },
      { name: '小米', unit: '元/公斤', priceRange: [4.0, 8.0], trend: getRandomTrend() },
      { name: '薏米', unit: '元/公斤', priceRange: [6.0, 12.0], trend: getRandomTrend() }
    ],
    'meat': [
      { name: '猪肉', unit: '元/公斤', priceRange: [18.0, 40.0], trend: getRandomTrend() },
      { name: '牛肉', unit: '元/公斤', priceRange: [50.0, 120.0], trend: getRandomTrend() },
      { name: '羊肉', unit: '元/公斤', priceRange: [55.0, 130.0], trend: getRandomTrend() },
      { name: '鸡肉', unit: '元/公斤', priceRange: [12.0, 30.0], trend: getRandomTrend() },
      { name: '鸭肉', unit: '元/公斤', priceRange: [15.0, 35.0], trend: getRandomTrend() },
      { name: '猪肝', unit: '元/公斤', priceRange: [15.0, 30.0], trend: getRandomTrend() },
      { name: '排骨', unit: '元/公斤', priceRange: [30.0, 60.0], trend: getRandomTrend() },
      { name: '猪蹄', unit: '元/公斤', priceRange: [20.0, 40.0], trend: getRandomTrend() },
      { name: '牛腩', unit: '元/公斤', priceRange: [45.0, 90.0], trend: getRandomTrend() },
      { name: '羊排', unit: '元/公斤', priceRange: [60.0, 140.0], trend: getRandomTrend() }
    ],
    'eggs': [
      { name: '鸡蛋', unit: '元/公斤', priceRange: [8.0, 15.0], trend: getRandomTrend() },
      { name: '鸭蛋', unit: '元/公斤', priceRange: [10.0, 18.0], trend: getRandomTrend() },
      { name: '鹅蛋', unit: '元/公斤', priceRange: [25.0, 45.0], trend: getRandomTrend() },
      { name: '鹌鹑蛋', unit: '元/公斤', priceRange: [20.0, 40.0], trend: getRandomTrend() },
      { name: '皮蛋', unit: '元/公斤', priceRange: [15.0, 30.0], trend: getRandomTrend() },
      { name: '咸蛋', unit: '元/公斤', priceRange: [12.0, 25.0], trend: getRandomTrend() }
    ],
    'aquatic': [
      { name: '草鱼', unit: '元/公斤', priceRange: [10.0, 25.0], trend: getRandomTrend() },
      { name: '鲤鱼', unit: '元/公斤', priceRange: [12.0, 28.0], trend: getRandomTrend() },
      { name: '鲫鱼', unit: '元/公斤', priceRange: [15.0, 30.0], trend: getRandomTrend() },
      { name: '带鱼', unit: '元/公斤', priceRange: [25.0, 50.0], trend: getRandomTrend() },
      { name: '黄鱼', unit: '元/公斤', priceRange: [30.0, 70.0], trend: getRandomTrend() },
      { name: '虾', unit: '元/公斤', priceRange: [40.0, 120.0], trend: getRandomTrend() },
      { name: '蟹', unit: '元/公斤', priceRange: [50.0, 200.0], trend: getRandomTrend() },
      { name: '贝类', unit: '元/公斤', priceRange: [15.0, 35.0], trend: getRandomTrend() },
      { name: '海参', unit: '元/公斤', priceRange: [200.0, 500.0], trend: getRandomTrend() },
      { name: '墨鱼', unit: '元/公斤', priceRange: [30.0, 60.0], trend: getRandomTrend() }
    ]
  };

  const products = productsMap[category] || productsMap['vegetables'];
  
  // 为每个产品生成当前价格、历史价格和预测价格
  return products.map(product => {
    const [min, max] = product.priceRange;
    const currentPrice = (min + Math.random() * (max - min)).toFixed(2);
    
    // 根据趋势生成合理的历史数据和预测数据
    const trendFactor = product.trend === '上涨' ? 0.95 : (product.trend === '下跌' ? 1.05 : 1);
    const lastMonthPrice = (currentPrice * trendFactor).toFixed(2);
    const lastYearPrice = (currentPrice * (Math.random() * 0.3 + 0.85)).toFixed(2);
    
    // 同比和环比计算
    const monthOverMonthChange = (((currentPrice - lastMonthPrice) / lastMonthPrice) * 100).toFixed(1);
    const yearOverYearChange = (((currentPrice - lastYearPrice) / lastYearPrice) * 100).toFixed(1);
    
    // 生成价格预测
    const predictedPrice = (currentPrice * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2);
    
    // 生成历史价格趋势（最近7天）
    const priceTrend = generatePriceTrend(currentPrice, product.trend);
    
    // 生成市场来源
    const markets = ['北京新发地', '上海江桥', '广州江南', '成都农产品', '武汉白沙洲', '沈阳八家子'];
    const sources = [];
    for (let i = 0; i < 3; i++) {
      const marketIndex = Math.floor(Math.random() * markets.length);
      const marketPrice = (parseFloat(currentPrice) * (0.9 + Math.random() * 0.2)).toFixed(2);
      sources.push({
        market: markets[marketIndex],
        price: marketPrice
      });
      // 避免重复
      markets.splice(marketIndex, 1);
      if (markets.length === 0) break;
    }
    
    return {
      ...product,
      currentPrice,
      lastMonthPrice,
      lastYearPrice,
      monthOverMonthChange,
      yearOverYearChange,
      predictedPrice,
      priceTrend,
      sources,
      updatedAt: new Date().toISOString()
    };
  });
}

// 生成随机价格趋势
function getRandomTrend() {
  const trends = ['上涨', '平稳', '下跌'];
  const weights = [0.3, 0.4, 0.3]; // 各趋势的权重
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < trends.length; i++) {
    sum += weights[i];
    if (random < sum) return trends[i];
  }
  return '平稳';
}

// 生成7天价格趋势数据
function generatePriceTrend(currentPrice, trend) {
  const days = 7;
  const result = [];
  let price = parseFloat(currentPrice);
  
  // 根据趋势生成合理的价格变化
  const volatility = 0.03; // 日波动率
  const drift = trend === '上涨' ? 0.01 : (trend === '下跌' ? -0.01 : 0); // 趋势漂移
  
  // 从今天往前生成7天的数据
  for (let i = 0; i < days; i++) {
    // 使用简化的随机游走模型生成价格
    const change = price * (drift + volatility * (Math.random() * 2 - 1));
    price = parseFloat(price) - change; // 往前推，所以是减
    price = Math.max(price, 0.1); // 确保价格为正
    
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: price.toFixed(2)
    });
  }
  
  // 添加当天价格
  result.push({
    date: new Date().toISOString().split('T')[0],
    price: currentPrice
  });
  
  return result;
}

// 获取农产品价格趋势分析
async function getPriceTrendAnalysis(category = 'vegetables') {
  try {
    // 获取最新价格数据
    const priceData = await getMarketPriceData(category);
    
    // 计算综合趋势
    const trends = priceData.map(p => p.trend);
    const upCount = trends.filter(t => t === '上涨').length;
    const stableCount = trends.filter(t => t === '平稳').length;
    const downCount = trends.filter(t => t === '下跌').length;
    
    // 计算平均价格变化
    const avgMonthChange = priceData.reduce((sum, p) => sum + parseFloat(p.monthOverMonthChange), 0) / priceData.length;
    const avgYearChange = priceData.reduce((sum, p) => sum + parseFloat(p.yearOverYearChange), 0) / priceData.length;
    
    // 找出涨幅最大和降幅最大的产品
    let maxIncreaseProduct = null;
    let maxDecreaseProduct = null;
    let maxIncrease = -Infinity;
    let maxDecrease = Infinity;
    
    priceData.forEach(product => {
      const change = parseFloat(product.monthOverMonthChange);
      if (change > maxIncrease) {
        maxIncrease = change;
        maxIncreaseProduct = product;
      }
      if (change < maxDecrease) {
        maxDecrease = change;
        maxDecreaseProduct = product;
      }
    });
    
    // 获取季节性分析（基于月份）
    const month = new Date().getMonth() + 1;
    const seasonalFactors = getSeasonalFactors(category, month);
    
    return {
      category,
      totalProducts: priceData.length,
      trendSummary: {
        upCount,
        stableCount,
        downCount,
        mainTrend: upCount > downCount ? (upCount > stableCount ? '上涨' : '平稳') : (downCount > stableCount ? '下跌' : '平稳')
      },
      priceChanges: {
        avgMonthChange: avgMonthChange.toFixed(1) + '%',
        avgYearChange: avgYearChange.toFixed(1) + '%'
      },
      highlights: {
        maxIncrease: maxIncreaseProduct ? {
          name: maxIncreaseProduct.name,
          change: maxIncreaseProduct.monthOverMonthChange + '%',
          currentPrice: maxIncreaseProduct.currentPrice + maxIncreaseProduct.unit
        } : null,
        maxDecrease: maxDecreaseProduct ? {
          name: maxDecreaseProduct.name,
          change: maxDecreaseProduct.monthOverMonthChange + '%',
          currentPrice: maxDecreaseProduct.currentPrice + maxDecreaseProduct.unit
        } : null
      },
      seasonalAnalysis: seasonalFactors,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取价格趋势分析失败:', error);
    return {
      category,
      error: '分析数据获取失败'
    };
  }
}

// 获取季节性因素分析
function getSeasonalFactors(category, month) {
  // 基于真实的季节性供需关系
  const seasonalData = {
    'vegetables': {
      spring: ['菠菜', '芹菜', '春笋', '蒜苗'],
      summer: ['黄瓜', '茄子', '西红柿', '辣椒'],
      autumn: ['白菜', '萝卜', '南瓜', '豆角'],
      winter: ['大白菜', '白萝卜', '土豆', '卷心菜']
    },
    'fruits': {
      spring: ['草莓', '枇杷', '樱桃', '杨梅'],
      summer: ['西瓜', '桃子', '葡萄', '荔枝'],
      autumn: ['苹果', '梨', '柿子', '柚子'],
      winter: ['橙子', '柑橘', '猕猴桃', '火龙果']
    }
  };
  
  // 根据月份确定季节
  let season;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';
  
  // 获取当季和非当季产品
  const seasonalProducts = seasonalData[category] ? seasonalData[category][season] : [];
  
  // 生成季节性分析文本
  let analysis = '';
  if (seasonalProducts.length > 0) {
    if (category === 'vegetables') {
      analysis = `当前季节(${getSeasonName(season)})适合种植和收获的蔬菜有${seasonalProducts.join('、')}等，价格相对较低。非季节性蔬菜价格可能偏高。`;
    } else if (category === 'fruits') {
      analysis = `当前季节(${getSeasonName(season)})盛产的水果有${seasonalProducts.join('、')}等，新鲜度高且价格相对合理。`;
    } else {
      analysis = `当前季节(${getSeasonName(season)})市场供应充足，价格总体稳定。`;
    }
  } else {
    analysis = `当前季节(${getSeasonName(season)})市场供应正常，价格随供需变化。`;
  }
  
  return {
    season: getSeasonName(season),
    seasonalProducts,
    analysis
  };
}

// 根据英文季节名返回中文季节名
function getSeasonName(season) {
  const seasonMap = {
    'spring': '春季',
    'summer': '夏季',
    'autumn': '秋季',
    'winter': '冬季'
  };
  return seasonMap[season] || '当前季节';
}

export {
  getMarketPriceData,
  getPriceTrendAnalysis,
  productCategories
};