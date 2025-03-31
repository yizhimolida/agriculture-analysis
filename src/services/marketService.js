import axios from 'axios';

// 从农业农村部市场信息系统获取数据
// 由于没有直接的API，我们使用代理服务或模拟一个API响应
const MARKET_DATA_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时缓存
const marketDataCache = new Map();

// 省份列表 - 添加支持省份筛选
const provinces = [
  { id: 'all', name: '全国' },
  { id: 'beijing', name: '北京' },
  { id: 'tianjin', name: '天津' },
  { id: 'hebei', name: '河北' },
  { id: 'shanxi', name: '山西' },
  { id: 'neimenggu', name: '内蒙古' },
  { id: 'liaoning', name: '辽宁' },
  { id: 'jilin', name: '吉林' },
  { id: 'heilongjiang', name: '黑龙江' },
  { id: 'shanghai', name: '上海' },
  { id: 'jiangsu', name: '江苏' },
  { id: 'zhejiang', name: '浙江' },
  { id: 'anhui', name: '安徽' },
  { id: 'fujian', name: '福建' },
  { id: 'jiangxi', name: '江西' },
  { id: 'shandong', name: '山东' },
  { id: 'henan', name: '河南' },
  { id: 'hubei', name: '湖北' },
  { id: 'hunan', name: '湖南' },
  { id: 'guangdong', name: '广东' },
  { id: 'guangxi', name: '广西' },
  { id: 'hainan', name: '海南' },
  { id: 'chongqing', name: '重庆' },
  { id: 'sichuan', name: '四川' },
  { id: 'guizhou', name: '贵州' },
  { id: 'yunnan', name: '云南' },
  { id: 'xizang', name: '西藏' },
  { id: 'shaanxi', name: '陕西' },
  { id: 'gansu', name: '甘肃' },
  { id: 'qinghai', name: '青海' },
  { id: 'ningxia', name: '宁夏' },
  { id: 'xinjiang', name: '新疆' }
];

// 主要农产品类别
const productCategories = [
  { id: 'grains', name: '粮食' },
  { id: 'vegetables', name: '蔬菜' },
  { id: 'fruits', name: '水果' },
  { id: 'meat', name: '肉类' },
  { id: 'eggs', name: '禽蛋' },
  { id: 'aquatic', name: '水产品' }
];

// 获取市场价格数据 - 修改支持省份参数
async function getMarketPriceData(category = 'vegetables', province = 'all', forceRefresh = false) {
  try {
    // 检查缓存 - 修改缓存键包含省份
    const cacheKey = `market-prices-${category}-${province}`;
    if (!forceRefresh && marketDataCache.has(cacheKey)) {
      const cachedData = marketDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < MARKET_DATA_CACHE_DURATION) {
        console.log(`Using cached market data for ${category} in ${province}`);
        return cachedData.data;
      }
    }

    // 以蔬菜为例，从正规开放的农产品价格API获取数据
    // 这里使用的是第三方API，在实际项目中可能需要替换为实际可用的API
    // 例如中国农业信息网、农业农村部网站等提供的数据
    console.log(`Fetching fresh market data for ${category} in ${province}`);
    
    // 注：在实际项目中，这里需要替换为实际可用的API端点
    // 由于直接API可能受限，我们可以使用公开的农产品批发价格信息
    // 以下是模拟API请求，实际环境中应替换为真实API
    // const response = await axios.get(`https://api.example.com/agricultural-prices/${category}?province=${province}`);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 由于直接API访问可能有限制，我们这里生成一些基于真实数据的模拟数据
    // 在实际项目中，这部分应替换为真实API调用
    const simulatedData = generateMarketData(category, province);
    
    // 缓存数据
    marketDataCache.set(cacheKey, {
      data: simulatedData,
      timestamp: Date.now()
    });
    
    return simulatedData;
  } catch (error) {
    console.error('获取市场价格数据失败:', error);
    // 如果API请求失败，返回模拟数据
    return generateMarketData(category, province);
  }
}

// 生成基于真实价格范围的农产品价格数据 - 修改支持省份差异
function generateMarketData(category, province = 'all') {
  // 省份系数 - 模拟不同省份的价格差异
  const provinceFactors = {
    'all': 1.0,      // 全国平均
    'beijing': 1.15, // 北京价格略高
    'tianjin': 1.12, // 天津价格较高
    'hebei': 0.97,   // 河北价格略低
    'shanxi': 0.95,  // 山西价格略低
    'neimenggu': 0.93, // 内蒙古价格较低
    'liaoning': 1.02, // 辽宁价格适中
    'jilin': 0.97,   // 吉林价格略低
    'heilongjiang': 0.96, // 黑龙江价格略低
    'shanghai': 1.18, // 上海价格较高
    'jiangsu': 1.05,  // 江苏价格适中
    'zhejiang': 1.10,  // 浙江价格较高
    'anhui': 0.90,   // 安徽价格较低
    'fujian': 1.05,  // 福建价格适中
    'jiangxi': 0.92, // 江西价格较低
    'shandong': 0.95, // 山东价格略低(农产品主产区)
    'henan': 0.88,   // 河南价格低(农产品主产区)
    'hubei': 0.92,   // 湖北价格较低
    'hunan': 0.93,   // 湖南价格较低
    'guangdong': 1.08, // 广东价格适中偏高
    'guangxi': 0.95, // 广西价格略低
    'hainan': 1.10,  // 海南价格较高 (岛屿运输成本)
    'chongqing': 0.98, // 重庆价格适中偏低
    'sichuan': 0.90,  // 四川价格较低
    'guizhou': 0.92, // 贵州价格较低
    'yunnan': 0.94,  // 云南价格较低
    'xizang': 1.25,  // 西藏价格高 (运输成本高)
    'shaanxi': 0.96, // 陕西价格略低
    'gansu': 0.93,   // 甘肃价格较低
    'qinghai': 1.10, // 青海价格较高 (高原地区)
    'ningxia': 0.98, // 宁夏价格适中偏低
    'xinjiang': 1.05 // 新疆价格适中 (水果价格低，其他较高)
  };
  
  // 获取省份价格系数
  const provinceFactor = provinceFactors[province] || 1.0;
  
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
  
  // 为每个产品生成当前价格、历史价格和预测价格，应用省份价格系数
  return products.map(product => {
    const [min, max] = product.priceRange;
    // 应用省份价格系数
    const adjustedMin = min * provinceFactor;
    const adjustedMax = max * provinceFactor;
    const currentPrice = (adjustedMin + Math.random() * (adjustedMax - adjustedMin)).toFixed(2);
    
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
    
    // 生成市场来源，包括特定省份的批发市场
    const marketsByProvince = {
      'beijing': ['北京新发地', '北京大洋路', '北京昌平水屯'],
      'tianjin': ['天津韩家墅', '天津红旗农贸', '天津西青区王兰庄'],
      'hebei': ['石家庄桥西', '唐山路南', '保定竞秀'],
      'shanxi': ['太原河西', '大同云冈', '长治潞州'],
      'neimenggu': ['呼和浩特赛罕', '包头青山', '鄂尔多斯东胜'],
      'liaoning': ['沈阳沈北', '大连沙河口', '鞍山铁东'],
      'jilin': ['长春绿园', '吉林船营', '延边延吉'],
      'heilongjiang': ['哈尔滨香坊', '齐齐哈尔建华', '牡丹江东安'],
      'shanghai': ['上海江桥', '上海江杨', '上海浦东'],
      'jiangsu': ['南京江北', '苏州南环桥', '无锡朝阳'],
      'zhejiang': ['杭州良渚', '宁波江北', '温州瓯海'],
      'anhui': ['合肥裕溪', '芜湖镜湖', '蚌埠蚌山'],
      'fujian': ['福州马尾', '厦门湖里', '泉州丰泽'],
      'jiangxi': ['南昌东湖', '九江庐山', '赣州章贡'],
      'shandong': ['济南堤口', '青岛抚顺', '烟台芝罘'],
      'henan': ['郑州万邦', '洛阳涧西', '南阳卧龙'],
      'hubei': ['武汉白沙洲', '宜昌伍家岗', '襄阳襄城'],
      'hunan': ['长沙马王堆', '株洲荷塘', '湘潭雨湖'],
      'guangdong': ['广州江南', '深圳布吉', '佛山桂城'],
      'guangxi': ['南宁兴宁', '柳州鱼峰', '桂林象山'],
      'hainan': ['海口龙华', '三亚天涯', '琼海嘉积'],
      'chongqing': ['重庆双福', '重庆观音桥', '重庆九龙坡'],
      'sichuan': ['成都农产品', '绵阳涪城', '德阳旌阳'],
      'guizhou': ['贵阳观山湖', '遵义红花岗', '安顺西秀'],
      'yunnan': ['昆明官渡', '大理下关', '丽江古城'],
      'xizang': ['拉萨城关', '日喀则桑珠孜', '林芝巴宜'],
      'shaanxi': ['西安未央', '宝鸡金台', '咸阳秦都'],
      'gansu': ['兰州城关', '天水秦州', '酒泉肃州'],
      'qinghai': ['西宁城中', '海东平安', '海西德令哈'],
      'ningxia': ['银川兴庆', '石嘴山大武口', '中卫沙坡头'],
      'xinjiang': ['乌鲁木齐天山', '克拉玛依独山子', '喀什疏附']
    };
    
    // 获取特定省份的市场，如果不存在使用默认市场
    const provinceMarkets = marketsByProvince[province] || 
      ['北京新发地', '上海江桥', '广州江南', '成都农产品', '武汉白沙洲', '沈阳八家子'];
    
    // 为全国数据混合使用各省市场
    const marketsToUse = province === 'all' ? 
      ['北京新发地', '上海江桥', '广州江南', '成都农产品', '武汉白沙洲', '沈阳八家子'] : 
      provinceMarkets;
    
    const sources = [];
    for (let i = 0; i < Math.min(3, marketsToUse.length); i++) {
      const marketPrice = (parseFloat(currentPrice) * (0.9 + Math.random() * 0.2)).toFixed(2);
      sources.push({
        market: marketsToUse[i],
        price: marketPrice
      });
    }
    
    return {
      ...product,
      province: provinces.find(p => p.id === province)?.name || '全国',
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

// 为省份特定价格趋势分析
async function getPriceTrendAnalysis(category = 'vegetables', province = 'all', forceRefresh = false) {
  try {
    // 使用包含省份的缓存键
    const cacheKey = `price-trends-${category}-${province}`;
    if (!forceRefresh && marketDataCache.has(cacheKey)) {
      const cachedData = marketDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < MARKET_DATA_CACHE_DURATION) {
        return cachedData.data;
      }
    }
    
    // 获取产品价格数据
    const priceData = await getMarketPriceData(category, province, forceRefresh);
    
    // 分析价格趋势
    const upCount = priceData.filter(p => p.trend === '上涨').length;
    const downCount = priceData.filter(p => p.trend === '下跌').length;
    const stableCount = priceData.filter(p => p.trend === '平稳').length;
    
    // 确定主要趋势
    let mainTrend = '平稳';
    if (upCount > downCount && upCount > stableCount) mainTrend = '上涨';
    if (downCount > upCount && downCount > stableCount) mainTrend = '下跌';
    
    // 计算平均价格变化
    const avgMonthChange = (priceData.reduce((sum, p) => sum + parseFloat(p.monthOverMonthChange), 0) / priceData.length).toFixed(1);
    const avgYearChange = (priceData.reduce((sum, p) => sum + parseFloat(p.yearOverYearChange), 0) / priceData.length).toFixed(1);
    
    // 获取价格变化最大的产品
    priceData.sort((a, b) => parseFloat(b.monthOverMonthChange) - parseFloat(a.monthOverMonthChange));
    const maxIncrease = priceData[0];
    const maxDecrease = priceData[priceData.length - 1];
    
    // 添加省份特定的季节性分析
    const seasonalAnalysis = getSeasonalFactors(category, province);
    
    const analysis = {
      province: provinces.find(p => p.id === province)?.name || '全国',
      totalProducts: priceData.length,
      trendSummary: {
        mainTrend,
        upCount,
        downCount,
        stableCount
      },
      priceChanges: {
        avgMonthChange: `${avgMonthChange}%`,
        avgYearChange: `${avgYearChange}%`
      },
      highlights: {
        maxIncrease: {
          name: maxIncrease.name,
          change: `${maxIncrease.monthOverMonthChange}%`,
          currentPrice: `${maxIncrease.currentPrice}${maxIncrease.unit}`
        },
        maxDecrease: {
          name: maxDecrease.name,
          change: `${maxDecrease.monthOverMonthChange}%`,
          currentPrice: `${maxDecrease.currentPrice}${maxDecrease.unit}`
        }
      },
      seasonalAnalysis,
      updatedAt: new Date().toISOString()
    };
    
    // 缓存分析结果
    marketDataCache.set(cacheKey, {
      data: analysis,
      timestamp: Date.now()
    });
    
    return analysis;
    
  } catch (error) {
    console.error('获取价格趋势分析失败:', error);
    return {
      province: provinces.find(p => p.id === province)?.name || '全国',
      totalProducts: 0,
      trendSummary: {
        mainTrend: '平稳',
        upCount: 0,
        downCount: 0,
        stableCount: 0
      },
      priceChanges: {
        avgMonthChange: '0.0%',
        avgYearChange: '0.0%'
      },
      highlights: {},
      seasonalAnalysis: getSeasonalFactors(category, province),
      updatedAt: new Date().toISOString()
    };
  }
}

// 获取季节性因素分析 - 添加省份差异
function getSeasonalFactors(category, province = 'all') {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  // 根据月份确定季节
  let season = '春季';
  if (month >= 6 && month <= 8) season = '夏季';
  if (month >= 9 && month <= 11) season = '秋季';
  if (month === 12 || month <= 2) season = '冬季';
  
  // 不同省份的季节性分析
  const provincialAnalysis = {
    'beijing': {
      'vegetables': {
        '春季': '北方春季蔬菜供应逐渐增加，价格趋于稳定，但早春仍有价格波动',
        '夏季': '夏季高温，蔬菜生长迅速，北京地区供应充足，价格普遍较低',
        '秋季': '秋季是蔬菜丰收季，北京地区菜价处于全年低位',
        '冬季': '冬季北方蔬菜大棚种植成本增加，价格上涨明显'
      },
      'fruits': {
        '春季': '春季水果种类相对较少，以苹果、梨等耐储存水果为主，价格适中',
        '夏季': '夏季北京地区水果种类增多，价格开始下降',
        '秋季': '秋季水果品种丰富，北京地区水果价格处于较低水平',
        '冬季': '冬季水果供应减少，以进口和储存水果为主，价格有所上升'
      }
    },
    'guangdong': {
      'vegetables': {
        '春季': '南方春季蔬菜生长良好，广东地区蔬菜供应充足，价格相对稳定',
        '夏季': '夏季高温多雨，广东地区部分叶菜类受影响，价格波动较大',
        '秋季': '秋季广东地区蔬菜供应充足，价格处于适中水平',
        '冬季': '冬季广东气候温和，蔬菜供应依然充足，价格波动不大'
      },
      'fruits': {
        '春季': '春季广东本地水果上市，品种多样，价格相对稳定',
        '夏季': '夏季是岭南水果盛产期，荔枝、龙眼等水果大量上市，价格较低',
        '秋季': '秋季水果种类依然丰富，价格保持稳定',
        '冬季': '冬季广东柑橘类水果上市，价格适中'
      }
    },
    'sichuan': {
      'vegetables': {
        '春季': '四川春季蔬菜产量大，尤其是叶菜类供应充足，价格较低',
        '夏季': '夏季高温多雨，四川盆地蔬菜生长良好，价格处于全年低位',
        '秋季': '秋季是四川蔬菜丰收期，各类蔬菜价格平稳',
        '冬季': '冬季四川地区大棚蔬菜占比增加，价格略有上升但波动不大'
      },
      'fruits': {
        '春季': '春季四川柑橘、猕猴桃等供应充足，价格适中',
        '夏季': '夏季四川水蜜桃、李子等上市，价格逐渐降低',
        '秋季': '秋季是四川水果丰收季，价格较低，品种丰富',
        '冬季': '冬季柑橘类水果大量上市，价格处于全年低位'
      }
    },
    'neimenggu': {
      'vegetables': {
        '春季': '内蒙古春季蔬菜主要依赖温室大棚，价格偏高',
        '夏季': '夏季短暂，蔬菜生长期集中，价格快速下降',
        '秋季': '秋季是收获季节，蔬菜价格处于全年低位',
        '冬季': '冬季严寒，蔬菜主要依靠储存或外地调运，价格显著上升'
      },
      'grains': {
        '春季': '春季小麦、玉米等价格平稳，受上年产量影响',
        '夏季': '夏季小麦收获，价格略有下降',
        '秋季': '秋季是粮食集中上市期，价格处于全年低点',
        '冬季': '冬季农户惜售心理增强，粮价略有回升'
      }
    },
    'xinjiang': {
      'fruits': {
        '春季': '春季新疆水果供应较少，以储藏水果为主，价格偏高',
        '夏季': '夏季瓜果逐渐上市，价格开始下降',
        '秋季': '秋季是新疆瓜果上市高峰期，葡萄、哈密瓜等价格最低',
        '冬季': '冬季主要为储藏水果，价格逐渐回升'
      },
      'grains': {
        '春季': '春季粮食价格平稳，受上年产量影响',
        '夏季': '夏季小麦收获，价格略有下降',
        '秋季': '秋季粮食作物集中收获，价格处于全年低点',
        '冬季': '冬季粮食交易减少，价格小幅上涨'
      }
    }
  };
  
  // 默认季节性分析
  const defaultAnalysis = {
    'vegetables': {
      '春季': '春季蔬菜供应逐渐增加，价格趋于稳定，但北方地区早春仍有价格波动',
      '夏季': '夏季蔬菜供应充足，价格普遍较低，但高温多雨地区可能出现短期涨价',
      '秋季': '秋季是蔬菜丰收季，全国各地价格处于全年低位',
      '冬季': '冬季北方蔬菜价格上涨明显，南方地区波动较小'
    },
    'fruits': {
      '春季': '春季水果种类相对较少，以苹果、梨等耐储存水果为主，价格适中',
      '夏季': '夏季水果种类增多，价格开始下降，南方水果率先上市',
      '秋季': '秋季水果品种丰富，价格处于较低水平',
      '冬季': '冬季水果供应减少，以进口和储存水果为主，价格有所上升'
    },
    'grains': {
      '春季': '春季粮食价格相对稳定，受上年度库存和新季播种影响',
      '夏季': '夏季小麦等夏粮上市，价格略有下降',
      '秋季': '秋季是粮食收获季节，价格处于全年低点',
      '冬季': '冬季粮食交易减少，价格小幅回升'
    },
    'meat': {
      '春季': '春季肉类消费稳定，价格变化不大',
      '夏季': '夏季高温影响肉类消费，价格可能略有下降',
      '秋季': '秋季肉类消费开始增加，价格略有上升',
      '冬季': '冬季是肉类消费高峰，尤其节假日期间价格上涨明显'
    },
    'eggs': {
      '春季': '春季蛋鸡产蛋率提高，价格趋于稳定',
      '夏季': '夏季高温影响蛋鸡产蛋，价格可能有所上升',
      '秋季': '秋季气温适宜，蛋类供应充足，价格相对稳定',
      '冬季': '冬季节假日蛋类需求增加，价格有所上涨'
    },
    'aquatic': {
      '春季': '春季水产品开始增多，价格略有下降',
      '夏季': '夏季是水产品丰收季节，价格处于全年低位',
      '秋季': '秋季水产品供应依然充足，价格保持低位',
      '冬季': '冬季水产品减少，价格明显上升，北方地区尤为明显'
    }
  };
  
  // 查找省份特定分析，如果没有则使用默认分析
  const provinceAnalysis = provincialAnalysis[province];
  if (provinceAnalysis && provinceAnalysis[category]) {
    return {
      season,
      analysis: provinceAnalysis[category][season] || defaultAnalysis[category][season]
    };
  }
  
  // 使用默认分析
  return {
    season,
    analysis: defaultAnalysis[category] ? defaultAnalysis[category][season] : 
      '当前季节市场供需基本平衡，价格波动不大。'
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

// 导出新增的省份数据
export {
  getMarketPriceData,
  getPriceTrendAnalysis,
  productCategories,
  provinces
};