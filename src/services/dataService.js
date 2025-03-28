// 模拟实时数据
import { generateWeatherData } from './weatherService';

const generateMarketData = () => {
  const baseDate = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    data.push({
      日期: date.toISOString().split('T')[0],
      水稻: (3.5 + Math.random() * 0.3).toFixed(2),
      小麦: (4.2 + Math.random() * 0.2).toFixed(2),
      玉米: (2.8 + Math.random() * 0.4).toFixed(2),
      交易量: Math.floor(800 + Math.random() * 400)
    });
  }
  return data;
};

const generateConsumerData = () => {
  const products = ['有机水稻', '普通小麦', '玉米', '大豆', '蔬菜'];
  const groups = ['高端消费者', '普通家庭', '加工企业', '养殖户'];
  const data = [];

  products.forEach(product => {
    const basePrice = Math.floor(5 + Math.random() * 15);
    const baseSales = Math.floor(1000 + Math.random() * 2000);
    
    groups.forEach(group => {
      data.push({
        产品: product,
        消费群体: group,
        销量: Math.floor(baseSales * (0.8 + Math.random() * 0.4)),
        价格: (basePrice * (0.9 + Math.random() * 0.2)).toFixed(2),
        满意度: Math.floor(85 + Math.random() * 15),
        增长率: ((Math.random() * 20) - 5).toFixed(1)
      });
    });
  });
  
  return data;
};

const generateCropData = () => {
  const crops = [
    { name: '水稻', cycle: 120, temp: '25-30', water: '充足' },
    { name: '小麦', cycle: 150, temp: '15-20', water: '中等' },
    { name: '玉米', cycle: 100, temp: '20-25', water: '中等' },
    { name: '大豆', cycle: 90, temp: '18-22', water: '适中' },
    { name: '马铃薯', cycle: 80, temp: '15-20', water: '适中' }
  ];

  return crops.map(crop => ({
    作物: crop.name,
    生长周期: crop.cycle,
    适宜温度: crop.temp,
    水分需求: crop.water,
    当前产量: Math.floor(400 + Math.random() * 200),
    预期收益: Math.floor(2000 + Math.random() * 1000),
    种植建议: generatePlantingAdvice(crop)
  }));
};

const generatePlantingAdvice = (crop) => {
  const advices = {
    水稻: ['选择优质品种', '科学育秧', '合理施肥', '水分调控'],
    小麦: ['适期播种', '合理密植', '防寒保温', '病虫害防治'],
    玉米: ['适时播种', '科学施肥', '及时除草', '注意防旱'],
    大豆: ['合理密植', '科学轮作', '适时中耕', '防治病虫'],
    马铃薯: ['选用良种', '合理施肥', '科学灌溉', '及时除草']
  };
  
  return advices[crop.name].join('，') + '。';
};

const market = {
  async getData(timeRange = 'day') {
    const now = new Date();
    const data = [];
    let startDate;
    let interval; // 数据间隔

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        interval = 30; // 30分钟
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        interval = 120; // 2小时
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        interval = 24 * 60; // 1天
        break;
      default: // day
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        interval = 5; // 5分钟
    }

    const basePrice = {
      '水稻': 2.8,
      '小麦': 2.5,
      '玉米': 2.2
    };

    // 生成时间序列数据
    for (let date = new Date(startDate); date <= now; date.setMinutes(date.getMinutes() + interval)) {
      // 基础波动因子
      const month = date.getMonth();
      const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 0.2;
      const hourFactor = Math.sin((date.getHours() / 24) * 2 * Math.PI) * 0.1;
      
      const entry = {
        时间: date.toLocaleString(),
        时间戳: date.getTime(),
        交易量: Math.floor(Math.random() * 1000 + 500),
        成交笔数: Math.floor(Math.random() * 100 + 50)
      };

      // 为每个产品生成K线数据
      Object.entries(basePrice).forEach(([product, base]) => {
        const baseWithFactors = base * (1 + seasonalFactor + hourFactor);
        const volatility = base * 0.02; // 2%的波动率

        // 生成开盘价、最高价、最低价、收盘价
        const open = baseWithFactors * (1 + (Math.random() - 0.5) * 0.01);
        const maxChange = Math.random() * volatility;
        const minChange = Math.random() * volatility;
        
        const high = open * (1 + maxChange / base);
        const low = open * (1 - minChange / base);
        const close = (low + (high - low) * Math.random()).toFixed(3);

        // 计算技术指标
        const ma5 = data.slice(-4).concat([{ [`${product}_收盘`]: close }])
          .reduce((sum, item) => sum + parseFloat(item[`${product}_收盘`]), 0) / 5;
        const ma10 = data.slice(-9).concat([{ [`${product}_收盘`]: close }])
          .reduce((sum, item) => sum + parseFloat(item[`${product}_收盘`]), 0) / 10;
        const ma20 = data.slice(-19).concat([{ [`${product}_收盘`]: close }])
          .reduce((sum, item) => sum + parseFloat(item[`${product}_收盘`]), 0) / 20;

        // 计算MACD指标
        const ema12 = calculateEMA(data, 12, product, parseFloat(close));
        const ema26 = calculateEMA(data, 26, product, parseFloat(close));
        const dif = ema12 - ema26;
        const dea = calculateDEA(data, product, dif);
        const macd = (dif - dea) * 2;

        entry[`${product}_开盘`] = parseFloat(open.toFixed(3));
        entry[`${product}_最高`] = parseFloat(high.toFixed(3));
        entry[`${product}_最低`] = parseFloat(low.toFixed(3));
        entry[`${product}_收盘`] = parseFloat(close);
        entry[`${product}_MA5`] = parseFloat(ma5.toFixed(3));
        entry[`${product}_MA10`] = parseFloat(ma10.toFixed(3));
        entry[`${product}_MA20`] = parseFloat(ma20.toFixed(3));
        entry[`${product}_EMA12`] = parseFloat(ema12.toFixed(3));
        entry[`${product}_EMA26`] = parseFloat(ema26.toFixed(3));
        entry[`${product}_DIF`] = parseFloat(dif.toFixed(3));
        entry[`${product}_DEA`] = parseFloat(dea.toFixed(3));
        entry[`${product}_MACD`] = parseFloat(macd.toFixed(3));
        entry[`${product}_成交量`] = Math.floor(entry.交易量 * (0.8 + Math.random() * 0.4));
      });

      data.push(entry);
    }

    return data;
  }
};

// 计算EMA指标
function calculateEMA(data, period, product, currentPrice) {
  if (data.length === 0) return currentPrice;
  
  const prices = data.map(item => parseFloat(item[`${product}_收盘`])).filter(price => !isNaN(price));
  if (prices.length === 0) return currentPrice;
  
  let multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  // 计算当前价格的 EMA
  ema = (currentPrice - ema) * multiplier + ema;
  return ema;
}

// 计算DEA指标
function calculateDEA(data, product, currentDIF) {
  if (data.length === 0) return currentDIF;
  
  const difs = data.map(item => parseFloat(item[`${product}_DIF`])).filter(dif => !isNaN(dif));
  if (difs.length === 0) return currentDIF;
  
  let dea = difs[0];
  const alpha = 0.2; // MACD 中的平滑系数
  
  for (let i = 1; i < difs.length; i++) {
    dea = alpha * difs[i] + (1 - alpha) * dea;
  }
  
  // 计算当前 DIF 的 DEA
  dea = alpha * currentDIF + (1 - alpha) * dea;
  return dea;
}

const consumer = {
  async getData(timeRange = 'day') {
    return generateConsumerData();
  }
};

const crop = {
  async getData(timeRange = 'day') {
    return generateCropData();
  }
};

export const fetchData = {
  market: (timeRange) => market.getData(timeRange),
  consumer: async () => {
    try {
      return Promise.resolve(generateConsumerData());
    } catch (error) {
      console.error('获取消费者数据失败:', error);
      return Promise.resolve([]);
    }
  },
  crop: async () => {
    try {
      return Promise.resolve(generateCropData());
    } catch (error) {
      console.error('获取作物数据失败:', error);
      return Promise.resolve([]);
    }
  },
  weather: generateWeatherData
};