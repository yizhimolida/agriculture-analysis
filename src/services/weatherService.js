import axios from 'axios';

const QWEATHER_KEY = process.env.REACT_APP_QWEATHER_KEY || 'e582f3e79d334487a8b2bd74689a5729';
const QWEATHER_API_URL = 'https://devapi.qweather.com/v7';
const GEO_API_URL = 'https://geoapi.qweather.com/v2';

// 省份和城市数据 - 包含所有省份
const provinces = {
  '北京': ['北京', '朝阳区', '海淀区', '丰台区', '昌平区'],
  '上海': ['上海', '浦东新区', '徐汇区', '静安区', '黄浦区'],
  '天津': ['天津', '和平区', '河东区', '河西区', '南开区'],
  '重庆': ['重庆', '渝中区', '江北区', '沙坪坝区', '九龙坡区'],
  '广东': ['广州', '深圳', '珠海', '东莞', '佛山', '中山', '惠州'],
  '四川': ['成都', '绵阳', '德阳', '宜宾', '泸州', '乐山', '南充'],
  '浙江': ['杭州', '宁波', '温州', '绍兴', '金华', '台州', '湖州'],
  '江苏': ['南京', '苏州', '无锡', '常州', '扬州', '镇江', '南通'],
  '山东': ['济南', '青岛', '烟台', '威海', '潍坊', '临沂', '济宁'],
  '河南': ['郑州', '洛阳', '开封', '新乡', '许昌', '平顶山', '安阳'],
  '湖北': ['武汉', '宜昌', '襄阳', '十堰', '荆州', '黄石', '孝感'],
  '湖南': ['长沙', '株洲', '湘潭', '衡阳', '岳阳', '常德', '郴州'],
  '河北': ['石家庄', '唐山', '秦皇岛', '保定', '邯郸', '廊坊', '沧州'],
  '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '黄山', '安庆', '阜阳'],
  '江西': ['南昌', '九江', '景德镇', '萍乡', '赣州', '吉安', '宜春'],
  '福建': ['福州', '厦门', '泉州', '漳州', '三明', '莆田', '南平'],
  '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '锦州', '丹东'],
  '吉林': ['长春', '吉林', '四平', '通化', '白山', '松原', '白城'],
  '黑龙江': ['哈尔滨', '齐齐哈尔', '牡丹江', '佳木斯', '大庆', '鸡西', '绥化'],
  '海南': ['海口', '三亚', '三沙', '儋州', '文昌', '琼海', '万宁'],
  '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中'],
  '贵州': ['贵阳', '遵义', '六盘水', '安顺', '毕节', '铜仁', '黔东南'],
  '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱'],
  '陕西': ['西安', '宝鸡', '咸阳', '铜川', '渭南', '延安', '汉中'],
  '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖'],
  '青海': ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树'],
  '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔'],
  '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '钦州', '贵港'],
  '西藏': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'],
  '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
  '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '阿克苏', '喀什', '伊犁'],
  '香港': ['香港'],
  '澳门': ['澳门'],
  '台湾': ['台北', '高雄', '台中', '台南', '基隆', '新竹', '嘉义']
};

// 用于处理API请求的缓存设置
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
const weatherCache = new Map();
const cityCodeCache = new Map();
const errorCache = new Map(); // 记录错误次数，避免频繁重试失败的城市

// 为缓存和请求生成唯一键
const getLocationKey = (province, city) => `${province}-${city}`;

// 获取城市ID - 基于省份和城市名称
async function getCityId(province, city) {
  try {
    const cacheKey = getLocationKey(province, city);
    if (cityCodeCache.has(cacheKey)) {
      return cityCodeCache.get(cacheKey);
    }

    // 处理直辖市
    const searchCity = ['北京', '上海', '天津', '重庆'].includes(province) ? province : city;
    const searchProvince = ['北京', '上海', '天津', '重庆'].includes(province) ? '' : province;

    const response = await axios.get(`${GEO_API_URL}/city/lookup`, {
      params: {
        location: searchCity,
        adm: searchProvince,
        key: QWEATHER_KEY
      },
      timeout: 5000 // 5秒超时
    });
    
    if (response.data.code === '200' && response.data.location && response.data.location.length > 0) {
      const cityId = response.data.location[0].id;
      cityCodeCache.set(cacheKey, cityId);
      return cityId;
    }
    console.warn(`未找到城市ID: ${province}-${city}`);
    return null;
  } catch (error) {
    console.error(`获取城市ID失败:${province}-${city}`, error.message);
    return null;
  }
}

// 获取实时天气数据
async function getRealTimeWeather(cityId, province, city) {
  if (!cityId) return null;
  
  try {
    const response = await axios.get(`${QWEATHER_API_URL}/weather/now`, {
      params: {
        location: cityId,
        key: QWEATHER_KEY
      },
      timeout: 5000 // 5秒超时
    });
    
    if (response.data.code === '200' && response.data.now) {
      return {
        温度: parseInt(response.data.now.temp),
        体感温度: parseInt(response.data.now.feelsLike),
        天气状况: response.data.now.text,
        风向: response.data.now.windDir,
        风力等级: response.data.now.windScale,
        风速: response.data.now.windSpeed,
        相对湿度: parseInt(response.data.now.humidity),
        降水量: parseFloat(response.data.now.precip),
        大气压强: response.data.now.pressure,
        能见度: response.data.now.vis,
        云量: response.data.now.cloud,
        数据观测时间: response.data.now.obsTime
      };
    }
    return null;
  } catch (error) {
    console.error(`获取天气数据失败:${province}-${city}`, error.message);
    
    // 记录错误
    const errorKey = getLocationKey(province, city);
    const errorCount = errorCache.get(errorKey) || 0;
    errorCache.set(errorKey, errorCount + 1);
    
    return null;
  }
}

// 获取空气质量数据
async function getAirQuality(cityId, province, city) {
  if (!cityId) return null;
  
  try {
    const response = await axios.get(`${QWEATHER_API_URL}/air/now`, {
      params: {
        location: cityId,
        key: QWEATHER_KEY
      },
      timeout: 5000 // 5秒超时
    });
    
    if (response.data.code === '200' && response.data.now) {
      return {
        空气质量指数: response.data.now.aqi,
        空气质量等级: response.data.now.category,
        PM2_5: response.data.now.pm2p5,
        PM10: response.data.now.pm10,
        二氧化氮: response.data.now.no2,
        二氧化硫: response.data.now.so2,
        一氧化碳: response.data.now.co,
        臭氧: response.data.now.o3
      };
    }
    return null;
  } catch (error) {
    console.error(`获取空气质量失败:${province}-${city}`, error.message);
    return null;
  }
}

// 获取天气预警信息
async function getWarning(cityId, province, city) {
  if (!cityId) return [];
  
  try {
    const response = await axios.get(`${QWEATHER_API_URL}/warning/now`, {
      params: {
        location: cityId,
        key: QWEATHER_KEY
      },
      timeout: 5000 // 5秒超时
    });
    
    if (response.data.code === '200' && response.data.warning && response.data.warning.length > 0) {
      return response.data.warning.map(w => ({
        预警类型: w.typeName,
        预警等级: w.level,
        预警标题: w.title,
        预警内容: w.text,
        发布时间: w.pubTime
      }));
    }
    return [];
  } catch (error) {
    console.error(`获取天气预警失败:${province}-${city}`, error.message);
    return [];
  }
}

// 生成天气数据 - 主函数
async function generateWeatherData(province, city) {
  // 规范化参数，确保始终有默认值
  const formattedProvince = province || '北京';
  let formattedCity = city;
  
  // 如果未提供城市，选择省份的第一个城市
  if (!formattedCity && provinces[formattedProvince]) {
    formattedCity = provinces[formattedProvince][0];
  } else if (!formattedCity) {
    formattedCity = '北京'; // 默认值
  }
  
  // 特殊地区处理（港澳台）
  if (['香港', '澳门', '台湾'].includes(formattedProvince)) {
    return createPlaceholderData(formattedProvince, formattedCity, '暂不开放');
  }

  // 检查缓存
  const cacheKey = getLocationKey(formattedProvince, formattedCity);
  const cachedData = weatherCache.get(cacheKey);
  
  // 如果缓存有效且未过期，直接返回缓存数据
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  // 检查错误缓存，如果某个城市已经连续失败3次以上，使用模拟数据并延长缓存时间
  if (errorCache.get(cacheKey) >= 3) {
    const simulatedData = createSimulatedData(formattedProvince, formattedCity);
    // 30分钟后重置错误计数，再次尝试真实数据
    setTimeout(() => errorCache.delete(cacheKey), 30 * 60 * 1000);
    return simulatedData;
  }

  try {
    // 获取城市ID
    const cityId = await getCityId(formattedProvince, formattedCity);
    if (!cityId) {
      throw new Error(`未找到城市ID: ${formattedProvince}-${formattedCity}`);
    }

    // 并行请求天气数据
    const [weather, air, warnings] = await Promise.all([
      getRealTimeWeather(cityId, formattedProvince, formattedCity),
      getAirQuality(cityId, formattedProvince, formattedCity),
      getWarning(cityId, formattedProvince, formattedCity)
    ]);

    if (!weather) {
      throw new Error(`获取天气数据失败: ${formattedProvince}-${formattedCity}`);
    }

    // 组装数据
    const weatherData = {
      省份: formattedProvince,
      地区: formattedCity,
      城市代码: cityId,
      数据来源: '和风天气',
      ...weather,
      空气质量: air ? air.空气质量指数 : '暂无数据',
      空气质量等级: air ? air.空气质量等级 : '暂无数据',
      预警信息: warnings.length > 0 ? 
        warnings.map(w => `${w.预警类型}${w.预警等级}预警`).join(',') : ''
    };

    // 更新缓存
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    // 成功获取数据，清除错误计数
    errorCache.delete(cacheKey);
    
    return weatherData;
  } catch (error) {
    console.error(`处理天气数据失败 ${formattedProvince}-${formattedCity}:`, error.message);
    
    // 记录错误并使用模拟数据
    const errorCount = errorCache.get(cacheKey) || 0;
    errorCache.set(cacheKey, errorCount + 1);
    
    // 生成模拟数据
    return createSimulatedData(formattedProvince, formattedCity);
  }
}

// 创建占位数据（用于暂不支持的地区）
function createPlaceholderData(province, city, message) {
  return {
    省份: province,
    地区: city,
    温度: message,
    体感温度: message,
    天气状况: message,
    风向: message,
    风力等级: message,
    风速: message,
    相对湿度: message,
    降水量: message,
    大气压强: message,
    能见度: message,
    云量: message,
    数据观测时间: message,
    空气质量: message,
    空气质量等级: message,
    预警信息: '',
    数据来源: '模拟数据'
  };
}

// 创建模拟天气数据
function createSimulatedData(province, city) {
  // 根据季节和地理位置生成更真实的随机数据
  const now = new Date();
  const month = now.getMonth() + 1;
  
  // 根据地理位置确定气候特点
  const isNorth = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江'].includes(province);
  const isSouth = ['广东', '广西', '海南', '福建', '台湾', '香港', '澳门'].includes(province);
  
  // 根据月份和地区调整温度范围
  let tempBase, tempRange;
  if (month >= 11 || month <= 2) { // 冬季
    tempBase = isNorth ? -5 : (isSouth ? 15 : 5);
    tempRange = isNorth ? 10 : (isSouth ? 8 : 15);
  } else if (month >= 6 && month <= 8) { // 夏季
    tempBase = isNorth ? 25 : (isSouth ? 30 : 28);
    tempRange = 8;
  } else { // 春秋季节
    tempBase = isNorth ? 15 : (isSouth ? 22 : 18);
    tempRange = 10;
  }
  
  const temp = Math.floor(tempBase + Math.random() * tempRange);
  const feelsLike = temp + Math.floor(Math.random() * 3) - 1;
  
  // 天气状况根据季节和地区设置概率
  let weatherConditions;
  if (month >= 11 || month <= 2) { // 冬季
    weatherConditions = isNorth ? 
      ['晴', '多云', '阴', '小雪', '中雪'] : 
      ['晴', '多云', '阴', '小雨'];
  } else if (month >= 6 && month <= 8) { // 夏季
    weatherConditions = isSouth ? 
      ['晴', '多云', '阴', '小雨', '中雨', '大雨', '雷阵雨'] : 
      ['晴', '多云', '阴', '小雨', '中雨', '雷阵雨'];
  } else { // 春秋季节
    weatherConditions = ['晴', '多云', '阴', '小雨', '中雨'];
  }
  
  const weatherStatus = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  // 根据天气状况调整其他参数
  const humidity = weatherStatus.includes('雨') || weatherStatus.includes('雪') ? 
    Math.floor(80 + Math.random() * 15) : 
    Math.floor(40 + Math.random() * 30);
  
  const precipitation = weatherStatus.includes('小雨') ? Math.random() * 5 :
    weatherStatus.includes('中雨') ? 5 + Math.random() * 10 :
    weatherStatus.includes('大雨') ? 15 + Math.random() * 25 :
    weatherStatus.includes('小雪') ? Math.random() * 3 :
    weatherStatus.includes('中雪') ? 3 + Math.random() * 7 :
    0;
  
  // 生成模拟数据
  const weatherData = {
    省份: province,
    地区: city,
    温度: temp,
    体感温度: feelsLike,
    天气状况: weatherStatus,
    风向: ['东风', '南风', '西风', '北风', '东南风', '西南风', '东北风', '西北风'][Math.floor(Math.random() * 8)],
    风力等级: Math.floor(1 + Math.random() * 5) + '级',
    风速: (1 + Math.random() * 5).toFixed(1),
    相对湿度: humidity,
    降水量: precipitation.toFixed(1),
    大气压强: Math.floor(1000 + Math.random() * 15),
    能见度: weatherStatus.includes('雨') || weatherStatus.includes('雪') ? 
      (1 + Math.random() * 9).toFixed(1) : 
      (10 + Math.random() * 20).toFixed(1),
    云量: weatherStatus === '晴' ? 
      Math.floor(Math.random() * 20) : 
      Math.floor(50 + Math.random() * 50),
    数据观测时间: new Date().toISOString(),
    空气质量: Math.floor(50 + Math.random() * 150),
    空气质量等级: Math.random() > 0.7 ? '良' : (Math.random() > 0.4 ? '轻度污染' : '中度污染'),
    预警信息: Math.random() > 0.9 ? 
      (weatherStatus.includes('雨') ? '暴雨蓝色预警' : 
       weatherStatus.includes('雪') ? '暴雪蓝色预警' : '') : '',
    数据来源: '模拟数据(真实气候特点)'
  };

  // 更新缓存
  weatherCache.set(getLocationKey(province, city), {
    data: weatherData,
    timestamp: Date.now()
  });

  return weatherData;
}

// 获取24小时天气预报
async function get24HourForecast(province, city) {
  // 规范化参数
  const formattedProvince = province || '北京';
  let formattedCity = city;
  
  // 如果未提供城市，选择省份的第一个城市
  if (!formattedCity && provinces[formattedProvince]) {
    formattedCity = provinces[formattedProvince][0];
  } else if (!formattedCity) {
    formattedCity = '北京'; // 默认值
  }
  
  // 特殊地区处理（港澳台）
  if (['香港', '澳门', '台湾'].includes(formattedProvince)) {
    return generateSimulated24HourData();
  }

  try {
    const cityId = await getCityId(formattedProvince, formattedCity);
    if (!cityId) {
      throw new Error(`未找到城市ID: ${formattedProvince}-${formattedCity}`);
    }

    const response = await axios.get(`${QWEATHER_API_URL}/weather/24h`, {
      params: {
        location: cityId,
        key: QWEATHER_KEY
      },
      timeout: 5000 // 5秒超时
    });

    if (response.data.code === '200' && response.data.hourly) {
      return response.data.hourly.map(hour => ({
        时间: hour.fxTime,
        温度: parseInt(hour.temp),
        天气状况: hour.text,
        风向: hour.windDir,
        风力等级: hour.windScale,
        风速: hour.windSpeed,
        相对湿度: parseInt(hour.humidity),
        降水量: parseFloat(hour.precip),
        降水概率: parseInt(hour.pop),
        数据来源: '和风天气'
      }));
    }
    throw new Error('获取24小时预报数据失败');
  } catch (error) {
    console.error(`获取24小时预报失败:${formattedProvince}-${formattedCity}`, error.message);
    return generateSimulated24HourData();
  }
}

// 生成模拟的24小时预报数据
function generateSimulated24HourData() {
  const hourlyData = [];
  const now = new Date();
  const baseTemp = 15 + Math.random() * 10;
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now);
    hour.setHours(now.getHours() + i);
    
    // 温度随时间波动，白天高晚上低
    const hourOfDay = hour.getHours();
    const tempVariation = Math.sin((hourOfDay - 6) * Math.PI / 12) * 5; // 最高温出现在下午
    const temp = Math.round(baseTemp + tempVariation);
    
    const weatherStatuses = ['晴', '多云', '小雨', '中雨', '阴'];
    const weatherIndex = Math.min(Math.floor(Math.random() * weatherStatuses.length), weatherStatuses.length - 1);
    
    hourlyData.push({
      时间: hour.toISOString(),
      温度: temp,
      天气状况: weatherStatuses[weatherIndex],
      风向: ['东风', '南风', '西风', '北风'][Math.floor(Math.random() * 4)],
      风力等级: (1 + Math.floor(Math.random() * 3)) + '级',
      风速: (1 + Math.random() * 4).toFixed(1),
      相对湿度: Math.floor(60 + Math.random() * 30),
      降水量: weatherStatuses[weatherIndex].includes('雨') ? (Math.random() * 5).toFixed(1) : '0',
      降水概率: weatherStatuses[weatherIndex].includes('雨') ? Math.floor(50 + Math.random() * 50) : Math.floor(Math.random() * 20),
      数据来源: '模拟数据'
    });
  }
  
  return hourlyData;
}

// 导出函数和数据
export { 
  generateWeatherData, 
  get24HourForecast, 
  provinces 
};