import React, { useState, useEffect } from 'react';
import { generateWeatherData, provinces } from '../services/weatherService';

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('北京');
  const [selectedCity, setSelectedCity] = useState('北京');
  const [cities, setCities] = useState([]);

  // 当省份变化时更新城市列表
  useEffect(() => {
    if (selectedProvince && provinces[selectedProvince]) {
      setCities(provinces[selectedProvince]);
      setSelectedCity(provinces[selectedProvince][0]);
    }
  }, [selectedProvince]);

  // 获取天气数据
  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`获取天气数据: ${selectedProvince} - ${selectedCity}`);
        const data = await generateWeatherData(selectedProvince, selectedCity);
        console.log('获取的天气数据:', data);
        setWeatherData(data);
      } catch (err) {
        console.error('获取天气数据失败:', err);
        setError('获取天气数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    if (selectedProvince && selectedCity) {
      fetchWeatherData();
    }
  }, [selectedProvince, selectedCity]);

  // 处理省份变化
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  // 处理城市变化
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // 刷新天气数据
  const handleRefresh = () => {
    setLoading(true);
    generateWeatherData(selectedProvince, selectedCity, true)
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('刷新天气数据失败:', err);
        setError('刷新天气数据失败，请稍后重试');
        setLoading(false);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">天气监测</h2>
        <div className="flex space-x-4">
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(provinces).map(province => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? '加载中...' : '刷新数据'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : weatherData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6 col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div>
                <h3 className="text-3xl font-bold mb-1">{weatherData.地区}</h3>
                <p className="text-lg opacity-90">{weatherData.省份}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-5xl font-bold">{weatherData.温度}°C</p>
                <p className="text-lg">体感温度 {weatherData.体感温度}°C</p>
              </div>
            </div>
            
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">天气状况</p>
                <p className="text-xl font-medium">{weatherData.天气状况}</p>
              </div>
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">风向</p>
                <p className="text-xl font-medium">{weatherData.风向} {weatherData.风力等级}</p>
              </div>
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">相对湿度</p>
                <p className="text-xl font-medium">{weatherData.相对湿度}%</p>
              </div>
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">降水量</p>
                <p className="text-xl font-medium">{weatherData.降水量} mm</p>
              </div>
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">空气质量</p>
                <p className="text-xl font-medium">{weatherData.空气质量等级}</p>
              </div>
              <div className="px-2 w-1/2 md:w-1/3 mb-4">
                <p className="text-sm opacity-75">能见度</p>
                <p className="text-xl font-medium">{weatherData.能见度} km</p>
              </div>
            </div>
            
            {weatherData.预警信息 && (
              <div className="mt-4 bg-red-100 bg-opacity-20 p-3 rounded-lg">
                <p className="text-sm font-bold">⚠️ 预警信息</p>
                <p>{weatherData.预警信息}</p>
              </div>
            )}
            
            <div className="mt-6 text-right text-sm opacity-75">
              <p>数据来源: {weatherData.数据来源}</p>
              <p>观测时间: {new Date(weatherData.数据观测时间).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">农业气象指数</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-600">干旱指数</p>
                  <p className="text-sm font-medium">{calculateDroughtIndex(weatherData)}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${calculateDroughtIndex(weatherData) * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-600">生长适宜度</p>
                  <p className="text-sm font-medium">{calculateGrowthIndex(weatherData)}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${calculateGrowthIndex(weatherData) * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-600">病虫害风险</p>
                  <p className="text-sm font-medium">{calculatePestRiskIndex(weatherData)}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${calculatePestRiskIndex(weatherData) * 10}%` }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 mt-4">
                <h4 className="text-lg font-medium mb-2 text-gray-800">农事建议</h4>
                <p className="text-gray-600">{generateFarmingAdvice(weatherData)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          无天气数据可显示
        </div>
      )}
    </div>
  );
}

// 计算干旱指数（0-10）
function calculateDroughtIndex(weatherData) {
  if (!weatherData) return 5;
  
  // 根据湿度、降水量和温度计算
  const humidity = parseInt(weatherData.相对湿度) || 50;
  const precipitation = parseFloat(weatherData.降水量) || 0;
  const temperature = parseInt(weatherData.温度) || 25;
  
  // 简单公式：高温低湿低降水 = 高干旱风险
  let index = 10 - (humidity / 20) - (precipitation * 2);
  index = index + (temperature > 30 ? 2 : temperature > 25 ? 1 : 0);
  
  return Math.max(0, Math.min(10, Math.round(index)));
}

// 计算生长适宜度（0-10）
function calculateGrowthIndex(weatherData) {
  if (!weatherData) return 5;
  
  const temperature = parseInt(weatherData.温度) || 25;
  const humidity = parseInt(weatherData.相对湿度) || 50;
  
  // 温度适宜性（15-25℃最佳）
  const tempScore = temperature >= 15 && temperature <= 25 ? 5 : 
                    temperature > 25 && temperature <= 30 ? 4 :
                    temperature > 30 || (temperature >= 10 && temperature < 15) ? 3 :
                    temperature < 0 ? 0 : 2;
  
  // 湿度适宜性（50-80%最佳）
  const humidityScore = humidity >= 50 && humidity <= 80 ? 5 :
                       humidity > 80 ? 4 :
                       humidity >= 30 && humidity < 50 ? 3 : 1;
  
  return Math.round((tempScore + humidityScore) / 2);
}

// 计算病虫害风险（0-10）
function calculatePestRiskIndex(weatherData) {
  if (!weatherData) return 5;
  
  const temperature = parseInt(weatherData.温度) || 25;
  const humidity = parseInt(weatherData.相对湿度) || 50;
  const precipitation = parseFloat(weatherData.降水量) || 0;
  
  // 温湿度综合评分
  let risk = 0;
  
  // 高温高湿是病虫害高发条件
  if (temperature > 25 && humidity > 70) {
    risk += 4;
  } else if (temperature > 20 && humidity > 60) {
    risk += 3;
  } else if (temperature > 15 && humidity > 50) {
    risk += 2;
  } else {
    risk += 1;
  }
  
  // 降水增加病害风险
  risk += precipitation > 10 ? 3 : precipitation > 5 ? 2 : precipitation > 0 ? 1 : 0;
  
  // 根据季节调整（简化）
  const month = new Date().getMonth() + 1;
  const seasonFactor = (month >= 6 && month <= 8) ? 1.5 : 1; // 夏季风险更高
  
  risk = risk * seasonFactor;
  
  return Math.min(10, Math.round(risk));
}

// 生成农事建议
function generateFarmingAdvice(weatherData) {
  if (!weatherData) return "暂无建议";
  
  const temperature = parseInt(weatherData.温度);
  const weatherCondition = weatherData.天气状况;
  const droughtIndex = calculateDroughtIndex(weatherData);
  const pestRisk = calculatePestRiskIndex(weatherData);
  
  let advice = "";
  
  // 根据天气状况
  if (weatherCondition.includes("雨")) {
    advice += "雨天不宜进行露天作业，注意田间积水排涝；";
  } else if (weatherCondition.includes("晴")) {
    if (temperature > 30) {
      advice += "高温天气注意防暑降温，早晚进行田间管理；";
    } else {
      advice += "晴好天气适宜田间作业和收获；";
    }
  }
  
  // 根据干旱指数
  if (droughtIndex > 7) {
    advice += "当前干旱风险较高，建议增加灌溉频次；";
  } else if (droughtIndex < 3) {
    advice += "土壤水分充足，减少灌溉次数；";
  }
  
  // 根据病虫害风险
  if (pestRisk > 7) {
    advice += "病虫害风险高，注意加强田间监测和预防；";
  } else if (pestRisk > 4) {
    advice += "适当进行病虫害防治；";
  }
  
  return advice || "今日气象条件总体适宜农事活动";
}

export default WeatherDashboard;