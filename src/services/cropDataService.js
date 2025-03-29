import axios from 'axios';

// 农作物数据服务 - 用于获取中国各地区农作物种植、产量和价值数据
// 数据基于中国统计年鉴和农业农村部公开数据

// 缓存设置
const CROP_DATA_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存
const cropDataCache = new Map();

// 主要农作物类型
const cropTypes = [
  { id: 'grains', name: '粮食作物' },
  { id: 'economic', name: '经济作物' },
  { id: 'vegetables', name: '蔬菜作物' },
  { id: 'fruits', name: '水果作物' },
];

// 获取农作物生产数据
async function getCropProductionData(cropType = 'grains') {
  try {
    // 检查缓存
    const cacheKey = `crop-production-${cropType}`;
    if (cropDataCache.has(cacheKey)) {
      const cachedData = cropDataCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CROP_DATA_CACHE_DURATION) {
        console.log(`Using cached crop data for ${cropType}`);
        return cachedData.data;
      }
    }

    console.log(`Fetching fresh crop data for ${cropType}`);
    
    // 注：在实际项目中，这里需要替换为实际可用的API端点
    // 由于农业数据API可能受限，我们可以使用公开的统计数据或第三方服务
    // 以下是模拟API请求，实际环境中应替换为真实API
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 生成基于真实数据的模拟数据
    const simulatedData = generateCropData(cropType);
    
    // 缓存数据
    cropDataCache.set(cacheKey, {
      data: simulatedData,
      timestamp: Date.now()
    });
    
    return simulatedData;
  } catch (error) {
    console.error('获取农作物数据失败:', error);
    // 如果API请求失败，返回模拟数据
    return generateCropData(cropType);
  }
}

// 生成基于真实数据的农作物生产数据
function generateCropData(cropType) {
  // 基于中国统计年鉴的真实数据范围
  // 包括主要作物的产量、种植面积和单产数据
  const cropsMap = {
    'grains': [
      { 
        name: '水稻', 
        area: { value: 29850, unit: '千公顷' }, 
        production: { value: 207640, unit: '千吨' },
        yield: { value: 6957, unit: '公斤/公顷' },
        regions: [
          { name: '湖南', percentage: 13.5 },
          { name: '江西', percentage: 11.2 },
          { name: '黑龙江', percentage: 10.8 },
          { name: '江苏', percentage: 9.6 },
          { name: '湖北', percentage: 8.9 }
        ]
      },
      { 
        name: '小麦', 
        area: { value: 23730, unit: '千公顷' }, 
        production: { value: 134250, unit: '千吨' },
        yield: { value: 5658, unit: '公斤/公顷' },
        regions: [
          { name: '河南', percentage: 25.3 },
          { name: '山东', percentage: 15.8 },
          { name: '河北', percentage: 10.6 },
          { name: '安徽', percentage: 9.2 },
          { name: '江苏', percentage: 8.4 }
        ]
      },
      { 
        name: '玉米', 
        area: { value: 42429, unit: '千公顷' }, 
        production: { value: 272550, unit: '千吨' },
        yield: { value: 6423, unit: '公斤/公顷' },
        regions: [
          { name: '黑龙江', percentage: 16.2 },
          { name: '吉林', percentage: 12.8 },
          { name: '河南', percentage: 10.5 },
          { name: '山东', percentage: 9.7 },
          { name: '内蒙古', percentage: 9.3 }
        ]
      },
      { 
        name: '大豆', 
        area: { value: 9516, unit: '千公顷' }, 
        production: { value: 19600, unit: '千吨' },
        yield: { value: 2060, unit: '公斤/公顷' },
        regions: [
          { name: '黑龙江', percentage: 42.5 },
          { name: '内蒙古', percentage: 11.8 },
          { name: '吉林', percentage: 7.6 },
          { name: '河南', percentage: 5.3 },
          { name: '安徽', percentage: 4.9 }
        ]
      },
      { 
        name: '薯类', 
        area: { value: 8120, unit: '千公顷' }, 
        production: { value: 136430, unit: '千吨' },
        yield: { value: 16801, unit: '公斤/公顷' },
        regions: [
          { name: '四川', percentage: 14.2 },
          { name: '贵州', percentage: 10.5 },
          { name: '甘肃', percentage: 8.7 },
          { name: '云南', percentage: 7.9 },
          { name: '河南', percentage: 6.8 }
        ]
      }
    ],
    'economic': [
      { 
        name: '棉花', 
        area: { value: 3170, unit: '千公顷' }, 
        production: { value: 5900, unit: '千吨' },
        yield: { value: 1861, unit: '公斤/公顷' },
        regions: [
          { name: '新疆', percentage: 76.3 },
          { name: '河北', percentage: 5.8 },
          { name: '山东', percentage: 4.7 },
          { name: '江苏', percentage: 3.2 },
          { name: '湖北', percentage: 2.5 }
        ]
      },
      { 
        name: '油菜籽', 
        area: { value: 6700, unit: '千公顷' }, 
        production: { value: 13500, unit: '千吨' },
        yield: { value: 2015, unit: '公斤/公顷' },
        regions: [
          { name: '湖北', percentage: 17.5 },
          { name: '湖南', percentage: 15.2 },
          { name: '四川', percentage: 13.8 },
          { name: '江苏', percentage: 10.9 },
          { name: '安徽', percentage: 9.7 }
        ]
      },
      { 
        name: '花生', 
        area: { value: 4640, unit: '千公顷' }, 
        production: { value: 17830, unit: '千吨' },
        yield: { value: 3842, unit: '公斤/公顷' },
        regions: [
          { name: '河南', percentage: 22.3 },
          { name: '山东', percentage: 20.5 },
          { name: '河北', percentage: 10.7 },
          { name: '广东', percentage: 8.3 },
          { name: '江西', percentage: 6.2 }
        ]
      },
      { 
        name: '甘蔗', 
        area: { value: 1590, unit: '千公顷' }, 
        production: { value: 107650, unit: '千吨' },
        yield: { value: 67704, unit: '公斤/公顷' },
        regions: [
          { name: '广西', percentage: 62.7 },
          { name: '云南', percentage: 18.3 },
          { name: '广东', percentage: 14.9 },
          { name: '海南', percentage: 3.5 },
          { name: '福建', percentage: 0.6 }
        ]
      },
      { 
        name: '茶叶', 
        area: { value: 3060, unit: '千公顷' }, 
        production: { value: 2960, unit: '千吨' },
        yield: { value: 967, unit: '公斤/公顷' },
        regions: [
          { name: '福建', percentage: 18.6 },
          { name: '云南', percentage: 16.8 },
          { name: '贵州', percentage: 11.5 },
          { name: '浙江', percentage: 11.2 },
          { name: '湖南', percentage: 8.7 }
        ]
      }
    ],
    'vegetables': [
      { 
        name: '蔬菜总计', 
        area: { value: 20510, unit: '千公顷' }, 
        production: { value: 721040, unit: '千吨' },
        yield: { value: 35156, unit: '公斤/公顷' },
        regions: [
          { name: '山东', percentage: 12.8 },
          { name: '河南', percentage: 10.6 },
          { name: '河北', percentage: 8.9 },
          { name: '江苏', percentage: 7.3 },
          { name: '四川', percentage: 6.7 }
        ]
      },
      { 
        name: '番茄', 
        area: { value: 983, unit: '千公顷' }, 
        production: { value: 63750, unit: '千吨' },
        yield: { value: 64850, unit: '公斤/公顷' },
        regions: [
          { name: '新疆', percentage: 19.5 },
          { name: '山东', percentage: 14.7 },
          { name: '河北', percentage: 9.8 },
          { name: '内蒙古', percentage: 6.3 },
          { name: '江苏', percentage: 5.9 }
        ]
      },
      { 
        name: '黄瓜', 
        area: { value: 1230, unit: '千公顷' }, 
        production: { value: 70850, unit: '千吨' },
        yield: { value: 57602, unit: '公斤/公顷' },
        regions: [
          { name: '山东', percentage: 18.3 },
          { name: '河北', percentage: 12.7 },
          { name: '河南', percentage: 10.2 },
          { name: '辽宁', percentage: 7.5 },
          { name: '江苏', percentage: 6.8 }
        ]
      },
      { 
        name: '白菜', 
        area: { value: 1560, unit: '千公顷' }, 
        production: { value: 61750, unit: '千吨' },
        yield: { value: 39583, unit: '公斤/公顷' },
        regions: [
          { name: '山东', percentage: 15.3 },
          { name: '河北', percentage: 12.8 },
          { name: '辽宁', percentage: 10.6 },
          { name: '河南', percentage: 8.9 },
          { name: '内蒙古', percentage: 7.3 }
        ]
      },
      { 
        name: '辣椒', 
        area: { value: 1750, unit: '千公顷' }, 
        production: { value: 42730, unit: '千吨' },
        yield: { value: 24417, unit: '公斤/公顷' },
        regions: [
          { name: '湖南', percentage: 14.7 },
          { name: '贵州', percentage: 12.3 },
          { name: '河南', percentage: 9.8 },
          { name: '四川', percentage: 8.6 },
          { name: '山东', percentage: 7.5 }
        ]
      }
    ],
    'fruits': [
      { 
        name: '水果总计', 
        area: { value: 12780, unit: '千公顷' }, 
        production: { value: 286520, unit: '千吨' },
        yield: { value: 22419, unit: '公斤/公顷' },
        regions: [
          { name: '山东', percentage: 11.5 },
          { name: '广东', percentage: 8.9 },
          { name: '广西', percentage: 8.3 },
          { name: '湖北', percentage: 7.6 },
          { name: '四川', percentage: 6.8 }
        ]
      },
      { 
        name: '苹果', 
        area: { value: 2320, unit: '千公顷' }, 
        production: { value: 44770, unit: '千吨' },
        yield: { value: 19297, unit: '公斤/公顷' },
        regions: [
          { name: '陕西', percentage: 25.3 },
          { name: '山东', percentage: 19.6 },
          { name: '甘肃', percentage: 12.8 },
          { name: '河南', percentage: 8.7 },
          { name: '河北', percentage: 7.9 }
        ]
      },
      { 
        name: '柑橘', 
        area: { value: 2610, unit: '千公顷' }, 
        production: { value: 44860, unit: '千吨' },
        yield: { value: 17188, unit: '公斤/公顷' },
        regions: [
          { name: '湖北', percentage: 16.8 },
          { name: '广西', percentage: 15.7 },
          { name: '四川', percentage: 14.3 },
          { name: '浙江', percentage: 11.5 },
          { name: '湖南', percentage: 8.9 }
        ]
      },
      { 
        name: '香蕉', 
        area: { value: 420, unit: '千公顷' }, 
        production: { value: 11250, unit: '千吨' },
        yield: { value: 26786, unit: '公斤/公顷' },
        regions: [
          { name: '广东', percentage: 28.5 },
          { name: '广西', percentage: 24.7 },
          { name: '海南', percentage: 20.3 },
          { name: '云南', percentage: 18.6 },
          { name: '福建', percentage: 7.9 }
        ]
      },
      { 
        name: '葡萄', 
        area: { value: 820, unit: '千公顷' }, 
        production: { value: 14320, unit: '千吨' },
        yield: { value: 17463, unit: '公斤/公顷' },
        regions: [
          { name: '新疆', percentage: 22.6 },
          { name: '河北', percentage: 12.8 },
          { name: '山东', percentage: 11.5 },
          { name: '辽宁', percentage: 8.3 },
          { name: '河南', percentage: 7.6 }
        ]
      }
    ]
  };

  // 根据作物类型返回对应数据，加入随机波动以模拟最新数据
  const crops = cropsMap[cropType] || cropsMap['grains'];
  
  return crops.map(crop => {
    // 添加5%以内的随机波动，模拟最新数据
    const variationFactor = 1 + (Math.random() * 0.1 - 0.05);
    
    // 深拷贝数据并应用变化
    const updatedCrop = { ...crop };
    
    // 更新产量数据
    updatedCrop.production = { 
      ...crop.production,
      value: Math.round(crop.production.value * variationFactor)
    };
    
    // 更新种植面积
    updatedCrop.area = {
      ...crop.area,
      value: Math.round(crop.area.value * (1 + (Math.random() * 0.06 - 0.03)))
    };
    
    // 更新单产
    updatedCrop.yield = {
      ...crop.yield,
      value: Math.round(updatedCrop.production.value / updatedCrop.area.value * 1000)
    };
    
    // 添加年度变化率
    updatedCrop.annualChange = {
      production: ((variationFactor - 1) * 100).toFixed(1) + '%',
      area: ((Math.random() * 0.08 - 0.02) * 100).toFixed(1) + '%'
    };
    
    // 添加种植适宜区域分析
    updatedCrop.suitabilityAnalysis = getCropSuitabilityAnalysis(crop.name);
    
    // 添加经济价值分析
    const pricePerTon = getCropPriceEstimate(crop.name);
    updatedCrop.economicValue = {
      price: pricePerTon.toFixed(0) + '元/吨',
      totalValue: ((updatedCrop.production.value * pricePerTon) / 1000000).toFixed(1) + '亿元'
    };
    
    return updatedCrop;
  });
}

// 生成农作物适宜种植区域分析
function getCropSuitabilityAnalysis(cropName) {
  // 根据作物名称返回适宜种植的区域和气候条件
  const cropSuitabilityData = {
    '水稻': {
      climate: '温暖湿润',
      soil: '粘重土壤，保水性强',
      regions: ['华南', '华东', '华中', '东北'],
      temperature: '15-35°C，生育期间平均气温需高于20°C',
      water: '全生育期需水量为800-1000mm'
    },
    '小麦': {
      climate: '温和干燥',
      soil: '肥沃的壤土或轻粘土',
      regions: ['华北', '西北', '华东', '西南'],
      temperature: '15-25°C，越冬期需在0°C以上',
      water: '全生育期需水量为450-650mm'
    },
    '玉米': {
      climate: '温暖',
      soil: '疏松肥沃的壤土',
      regions: ['东北', '华北', '西南', '西北'],
      temperature: '20-30°C，不耐霜冻',
      water: '全生育期需水量为500-800mm'
    },
    '大豆': {
      climate: '温暖湿润',
      soil: '排水良好的壤土或砂壤土',
      regions: ['东北', '华北', '华中', '西南'],
      temperature: '15-30°C，不耐霜冻',
      water: '全生育期需水量为450-700mm'
    },
    '棉花': {
      climate: '温暖干燥',
      soil: '排水良好的壤土',
      regions: ['西北', '华北', '华中', '华东'],
      temperature: '25-35°C，生育期长，无霜期需在200天以上',
      water: '全生育期需水量为500-700mm'
    }
  };
  
  // 如果没有特定作物的数据，返回通用分析
  if (!cropSuitabilityData[cropName]) {
    return {
      climate: '温和适宜',
      soil: '肥沃土壤，排水良好',
      regions: ['多数地区均可种植'],
      temperature: '因地区而异',
      water: '需适量灌溉'
    };
  }
  
  return cropSuitabilityData[cropName];
}

// 获取农作物价格估计
function getCropPriceEstimate(cropName) {
  // 基于实际市场的农作物价格范围（元/吨）
  const cropPriceRanges = {
    '水稻': [2600, 3000],
    '小麦': [2400, 2800],
    '玉米': [2200, 2600],
    '大豆': [4000, 5200],
    '薯类': [1000, 1500],
    '棉花': [14000, 16000],
    '油菜籽': [4500, 5500],
    '花生': [8000, 10000],
    '甘蔗': [500, 700],
    '茶叶': [40000, 100000],
    '番茄': [1500, 3000],
    '黄瓜': [2000, 4000],
    '白菜': [1000, 2000],
    '辣椒': [3000, 6000],
    '苹果': [4000, 8000],
    '柑橘': [3000, 6000],
    '香蕉': [3500, 5500],
    '葡萄': [5000, 12000]
  };
  
  // 如果没有特定作物的价格范围，返回平均价格
  if (!cropPriceRanges[cropName]) {
    return 3000 + Math.random() * 2000;
  }
  
  // 从价格范围中随机选择一个价格
  const [min, max] = cropPriceRanges[cropName];
  return min + Math.random() * (max - min);
}

// 获取农作物生产趋势分析
async function getCropTrendAnalysis(cropType = 'grains') {
  try {
    // 获取最新作物生产数据
    const cropData = await getCropProductionData(cropType);
    
    // 计算总产量和平均单产
    const totalProduction = cropData.reduce((sum, crop) => sum + crop.production.value, 0);
    const avgYield = cropData.reduce((sum, crop) => sum + crop.yield.value, 0) / cropData.length;
    
    // 计算平均增长率
    const avgProductionChange = cropData.reduce((sum, crop) => {
      return sum + parseFloat(crop.annualChange.production);
    }, 0) / cropData.length;
    
    const avgAreaChange = cropData.reduce((sum, crop) => {
      return sum + parseFloat(crop.annualChange.area);
    }, 0) / cropData.length;
    
    // 获取种植面积最大的作物
    let largestAreaCrop = cropData[0];
    for (let i = 1; i < cropData.length; i++) {
      if (cropData[i].area.value > largestAreaCrop.area.value) {
        largestAreaCrop = cropData[i];
      }
    }
    
    // 获取产量最高的作物
    let highestProductionCrop = cropData[0];
    for (let i = 1; i < cropData.length; i++) {
      if (cropData[i].production.value > highestProductionCrop.production.value) {
        highestProductionCrop = cropData[i];
      }
    }
    
    // 获取单产最高的作物
    let highestYieldCrop = cropData[0];
    for (let i = 1; i < cropData.length; i++) {
      if (cropData[i].yield.value > highestYieldCrop.yield.value) {
        highestYieldCrop = cropData[i];
      }
    }
    
    // 生成趋势分析
    return {
      cropType,
      summary: {
        totalProduction: totalProduction.toLocaleString() + ' ' + (cropData[0]?.production?.unit || '千吨'),
        avgYield: Math.round(avgYield).toLocaleString() + ' ' + (cropData[0]?.yield?.unit || '公斤/公顷'),
        avgProductionChange: avgProductionChange.toFixed(1) + '%',
        avgAreaChange: avgAreaChange.toFixed(1) + '%',
        cropCount: cropData.length
      },
      highlights: {
        largestArea: {
          name: largestAreaCrop.name,
          area: largestAreaCrop.area.value.toLocaleString() + ' ' + largestAreaCrop.area.unit,
          percentage: ((largestAreaCrop.area.value / cropData.reduce((sum, c) => sum + c.area.value, 0)) * 100).toFixed(1) + '%'
        },
        highestProduction: {
          name: highestProductionCrop.name,
          production: highestProductionCrop.production.value.toLocaleString() + ' ' + highestProductionCrop.production.unit,
          percentage: ((highestProductionCrop.production.value / totalProduction) * 100).toFixed(1) + '%'
        },
        highestYield: {
          name: highestYieldCrop.name,
          yield: highestYieldCrop.yield.value.toLocaleString() + ' ' + highestYieldCrop.yield.unit
        }
      },
      trends: {
        production: avgProductionChange > 0 ? '增长' : '下降',
        area: avgAreaChange > 0 ? '扩大' : '缩减',
        overall: avgProductionChange > 1 ? 
                 '产量显著增长' : 
                 (avgProductionChange > 0 ? '产量稳中有升' : '产量略有下降')
      },
      analysis: generateCropAnalysis(cropType, avgProductionChange, avgAreaChange),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取农作物趋势分析失败:', error);
    return {
      cropType,
      error: '分析数据获取失败'
    };
  }
}

// 生成农作物趋势分析文本
function generateCropAnalysis(cropType, productionChange, areaChange) {
  let analysis = '';
  
  // 根据作物类型生成不同的分析
  switch (cropType) {
    case 'grains':
      if (productionChange > 2) {
        analysis = '粮食作物产量显著增长，主要得益于良种推广和农业科技进步。单产提升是增产的主要因素，种植面积变化不大。预计未来产量将保持稳定增长，国家粮食安全有保障。';
      } else if (productionChange > 0) {
        analysis = '粮食作物生产总体稳定，产量略有增长。农业基础设施改善和机械化水平提高促进了生产效率提升。建议继续加强科技投入，提高产量潜力。';
      } else {
        analysis = '粮食作物产量略有下降，可能受极端天气、种植结构调整等因素影响。建议加大农业支持力度，提高农民种粮积极性，确保粮食安全。';
      }
      break;
      
    case 'economic':
      if (productionChange > 3) {
        analysis = '经济作物生产迅速增长，市场需求旺盛。高附加值作物种植面积扩大，农民收入明显提高。产业链延伸和加工能力提升为增长提供了动力。';
      } else if (productionChange > 0) {
        analysis = '经济作物生产稳中有升，市场价格总体平稳。种植结构持续优化，区域特色优势进一步凸显。建议加强品牌建设，提高产品附加值。';
      } else {
        analysis = '经济作物生产面临挑战，产量和种植面积有所下降。国际市场竞争加剧和成本上升是主要影响因素。建议调整种植结构，发展特色高效农业。';
      }
      break;
      
    case 'vegetables':
      if (productionChange > 3) {
        analysis = '蔬菜产量大幅增长，设施农业发展迅速。消费升级推动了多样化、高品质蔬菜需求增加。种植技术进步和标准化生产推动了单产提高和品质改善。';
      } else if (productionChange > 0) {
        analysis = '蔬菜生产总体稳定，区域布局更加合理。季节性供应结构改善，反季节蔬菜生产能力增强。建议发展绿色有机蔬菜，满足消费升级需求。';
      } else {
        analysis = '蔬菜生产出现波动，局部地区受灾害天气影响较大。劳动力成本上升和环保压力加大是产业面临的主要挑战。建议加强科技投入，推进蔬菜生产现代化。';
      }
      break;
      
    case 'fruits':
      if (productionChange > 3) {
        analysis = '水果产量显著增长，优质果品比例提高。新品种引进和种植技术改进促进了产业升级。水果加工和冷链物流体系建设加快，产业链更加完善。';
      } else if (productionChange > 0) {
        analysis = '水果生产保持稳定增长，品质持续提升。区域特色果品发展良好，品牌效应逐步显现。建议加强病虫害综合防治，提高果品质量安全水平。';
      } else {
        analysis = '水果产量略有下降，市场竞争加剧。气候变化和自然灾害对产量和品质造成一定影响。建议调整品种结构，增强抗风险能力，提高果品附加值。';
      }
      break;
      
    default:
      analysis = '农作物总体生产情况稳定，结构持续优化。科技创新和政策支持为农业发展提供了有力保障。建议进一步提高农业现代化水平，增强农业竞争力。';
  }
  
  return analysis;
}

export {
  getCropProductionData,
  getCropTrendAnalysis,
  cropTypes
};