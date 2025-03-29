import React, { useState, useEffect } from 'react';
import { getCropProductionData, getCropTrendAnalysis, cropTypes } from '../services/cropDataService';

function CropData() {
  const [selectedCropType, setSelectedCropType] = useState('grains');
  const [cropData, setCropData] = useState([]);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCrop, setExpandedCrop] = useState(null);

  // 获取农作物数据
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const [dataResponse, analysisResponse] = await Promise.all([
          getCropProductionData(selectedCropType),
          getCropTrendAnalysis(selectedCropType)
        ]);
        
        setCropData(dataResponse);
        setTrendAnalysis(analysisResponse);
        setExpandedCrop(null); // 重置展开状态
      } catch (err) {
        console.error('获取农作物数据失败:', err);
        setError('获取农作物数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedCropType]);

  // 处理作物类型变化
  const handleCropTypeChange = (e) => {
    setSelectedCropType(e.target.value);
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    
    Promise.all([
      getCropProductionData(selectedCropType, true),
      getCropTrendAnalysis(selectedCropType, true)
    ])
      .then(([dataResponse, analysisResponse]) => {
        setCropData(dataResponse);
        setTrendAnalysis(analysisResponse);
        setLoading(false);
      })
      .catch(err => {
        console.error('刷新农作物数据失败:', err);
        setError('刷新农作物数据失败，请稍后重试');
        setLoading(false);
      });
  };

  // 切换展开状态
  const toggleExpand = (index) => {
    setExpandedCrop(expandedCrop === index ? null : index);
  };

  // 获取变化率颜色
  const getChangeColor = (value) => {
    if (!value) return 'text-gray-500';
    const numValue = parseFloat(value);
    if (numValue > 0) return 'text-green-500';
    if (numValue < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  // 渲染区域分布图表（简化版）
  const renderRegionChart = (regions) => {
    if (!regions || regions.length === 0) return null;
    
    return (
      <div className="mt-2">
        <div className="flex h-6 overflow-hidden rounded-md">
          {regions.map((region, index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={index}
                className={`${color}`}
                style={{ width: `${region.percentage}%` }}
                title={`${region.name}: ${region.percentage}%`}
              ></div>
            );
          })}
        </div>
        
        <div className="flex flex-wrap mt-1 text-xs">
          {regions.map((region, index) => (
            <div key={index} className="mr-3 mb-1 flex items-center">
              <div 
                className={`w-3 h-3 mr-1 ${['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'][index % 6]}`}
              ></div>
              <span>{region.name} {region.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">农作物数据</h2>
        <div className="flex space-x-4">
          <select
            value={selectedCropType}
            onChange={handleCropTypeChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cropTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 趋势分析 */}
          <div className="lg:col-span-1">
            {trendAnalysis && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">生产趋势分析</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">总产量</span>
                    <span className="text-sm font-semibold">{trendAnalysis.summary.totalProduction}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">平均单产</span>
                    <span className="text-sm font-semibold">{trendAnalysis.summary.avgYield}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">产量变化</span>
                    <span className={`text-sm font-semibold ${getChangeColor(trendAnalysis.summary.avgProductionChange)}`}>
                      {trendAnalysis.summary.avgProductionChange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">种植面积变化</span>
                    <span className={`text-sm font-semibold ${getChangeColor(trendAnalysis.summary.avgAreaChange)}`}>
                      {trendAnalysis.summary.avgAreaChange}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">生产亮点</h4>
                  
                  <div className="mb-2">
                    <p className="text-sm">
                      <span className="text-gray-600">最大种植面积: </span>
                      <span className="font-semibold">{trendAnalysis.highlights.largestArea.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      种植面积: {trendAnalysis.highlights.largestArea.area}
                      <span className="ml-1">({trendAnalysis.highlights.largestArea.percentage})</span>
                    </p>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm">
                      <span className="text-gray-600">最高产量: </span>
                      <span className="font-semibold">{trendAnalysis.highlights.highestProduction.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      产量: {trendAnalysis.highlights.highestProduction.production}
                      <span className="ml-1">({trendAnalysis.highlights.highestProduction.percentage})</span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-600">最高单产: </span>
                      <span className="font-semibold">{trendAnalysis.highlights.highestYield.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      单产: {trendAnalysis.highlights.highestYield.yield}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">行业分析</h4>
                  <p className="text-sm text-gray-600">
                    {trendAnalysis.analysis}
                  </p>
                </div>
                
                <div className="mt-4 text-xs text-gray-400 text-right">
                  数据更新时间: {new Date(trendAnalysis.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          {/* 农作物数据 */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cropData.map((crop, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div 
                    className={`p-4 cursor-pointer ${expandedCrop === index ? 'bg-blue-50' : 'bg-white'}`}
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                        <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                          <span>总产量: {crop.production.value.toLocaleString()} {crop.production.unit}</span>
                          <span>
                            <span className={getChangeColor(crop.annualChange.production)}>
                              {crop.annualChange.production}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">种植面积</div>
                        <div className="font-medium">{crop.area.value.toLocaleString()} {crop.area.unit}</div>
                      </div>
                    </div>
                  </div>
                  
                  {expandedCrop === index && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-2">生产数据</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">单产:</span>
                              <span className="text-sm font-medium">{crop.yield.value.toLocaleString()} {crop.yield.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">产量变化:</span>
                              <span className={`text-sm font-medium ${getChangeColor(crop.annualChange.production)}`}>
                                {crop.annualChange.production}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">种植面积变化:</span>
                              <span className={`text-sm font-medium ${getChangeColor(crop.annualChange.area)}`}>
                                {crop.annualChange.area}
                              </span>
                            </div>
                            {crop.economicValue && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">经济价值:</span>
                                <span className="text-sm font-medium">{crop.economicValue.totalValue}</span>
                              </div>
                            )}
                          </div>
                          
                          <h4 className="text-md font-medium text-gray-700 mt-4 mb-2">主要种植区域</h4>
                          {renderRegionChart(crop.regions)}
                        </div>
                        
                        <div>
                          {crop.suitabilityAnalysis && (
                            <>
                              <h4 className="text-md font-medium text-gray-700 mb-2">种植适宜性</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-gray-600">适宜气候:</span>
                                  <span className="text-sm ml-2">{crop.suitabilityAnalysis.climate}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">适宜土壤:</span>
                                  <span className="text-sm ml-2">{crop.suitabilityAnalysis.soil}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">温度要求:</span>
                                  <span className="text-sm ml-2">{crop.suitabilityAnalysis.temperature}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">水分要求:</span>
                                  <span className="text-sm ml-2">{crop.suitabilityAnalysis.water}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">主要产区:</span>
                                  <span className="text-sm ml-2">{crop.suitabilityAnalysis.regions.join('、')}</span>
                                </div>
                              </div>
                            </>
                          )}
                          
                          {crop.economicValue && (
                            <div className="mt-4">
                              <h4 className="text-md font-medium text-gray-700 mb-2">经济价值</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">市场价格:</span>
                                  <span className="text-sm font-medium">{crop.economicValue.price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">总产值:</span>
                                  <span className="text-sm font-medium">{crop.economicValue.totalValue}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 数据来源说明 */}
            <div className="mt-4 text-xs text-gray-500">
              <p>数据来源: 中国统计年鉴、农业农村部官方数据</p>
              <p>数据为年度统计数据，生产预测基于历史趋势和季节性因素分析</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropData;