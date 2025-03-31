import React, { useState, useEffect } from 'react';
import { getConsumerInsights, getConsumerSummary, getConsumerPersonas, consumerDataTypes } from '../services/consumerService';

function ConsumerInsights() {
  const [selectedType, setSelectedType] = useState('preferences');
  const [insightData, setInsightData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [personaData, setPersonaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePersona, setActivePersona] = useState(null);

  // 获取消费者洞察数据
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const [insights, summary, personas] = await Promise.all([
          getConsumerInsights(selectedType),
          getConsumerSummary(),
          getConsumerPersonas()
        ]);
        
        setInsightData(insights);
        setSummaryData(summary);
        setPersonaData(personas);
        
        // 默认选中第一个消费者画像
        if (personas && personas.length > 0 && activePersona === null) {
          setActivePersona(0);
        }
      } catch (err) {
        console.error('获取消费者洞察数据失败:', err);
        setError('获取消费者洞察数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedType]);
  
  // 处理数据类型变化
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    
    Promise.all([
      getConsumerInsights(selectedType, true),
      getConsumerSummary(true)
    ])
      .then(([insights, summary]) => {
        setInsightData(insights);
        setSummaryData(summary);
        setLoading(false);
      })
      .catch(err => {
        console.error('刷新消费者数据失败:', err);
        setError('刷新消费者数据失败，请稍后重试');
        setLoading(false);
      });
  };
  
  // 选择消费者画像
  const handlePersonaSelect = (index) => {
    setActivePersona(index);
  };
  
  // 获取趋势颜色
  const getTrendColor = (trend) => {
    if (trend === '上升' || trend === '上涨') return 'text-green-500';
    if (trend === '下降' || trend === '下跌') return 'text-red-500';
    return 'text-gray-500';
  };
  
  // 获取重要性颜色
  const getImportanceColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };
  
  // 获取影响力标签样式
  const getImpactStyle = (impact) => {
    switch(impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // 渲染消费者洞察内容
  const renderInsightContent = () => {
    if (!insightData || insightData.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          无数据可显示
        </div>
      );
    }
    
    switch (selectedType) {
      case 'preferences':
        return (
          <div className="space-y-4">
            {insightData.map((pref, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{pref.factor}</h4>
                  <div className={`px-2 py-1 rounded text-sm ${getTrendColor(pref.trend)}`}>
                    {pref.trend} {pref.yearChange}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">重要性</span>
                    <span className="text-sm font-medium">{pref.importance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getImportanceColor(pref.importance)}`} 
                      style={{ width: `${pref.importance}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{pref.description}</p>
                
                {pref.demographics && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-2">人群差异</h5>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">城市</div>
                        <div className="font-medium">{pref.demographics.urban}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">农村</div>
                        <div className="font-medium">{pref.demographics.rural}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">年轻人</div>
                        <div className="font-medium">{pref.demographics.young}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">中年</div>
                        <div className="font-medium">{pref.demographics.middleAge}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">老年</div>
                        <div className="font-medium">{pref.demographics.senior}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'channels':
        return (
          <div className="space-y-4">
            {insightData.map((channel, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{channel.channel}</h4>
                  <div className={`px-2 py-1 rounded text-sm ${getTrendColor(channel.trend)}`}>
                    {channel.trend} {channel.yearChange}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">市场份额</span>
                    <span className="text-sm font-medium">{channel.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${channel.percentage * 2}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                
                {channel.advantages && (
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {channel.advantages.map((adv, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {adv}
                      </span>
                    ))}
                  </div>
                )}
                
                {channel.demographics && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-2">人群偏好</h5>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">城市</div>
                        <div className="font-medium">{channel.demographics.urban}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">农村</div>
                        <div className="font-medium">{channel.demographics.rural}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">年轻人</div>
                        <div className="font-medium">{channel.demographics.young}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">中年</div>
                        <div className="font-medium">{channel.demographics.middleAge}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">老年</div>
                        <div className="font-medium">{channel.demographics.senior}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'trends':
        return (
          <div className="space-y-4">
            {insightData.map((trend, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{trend.trend}</h4>
                  <div className={`px-2 py-1 rounded text-sm border ${getImpactStyle(trend.impact)}`}>
                    {trend.impact === 'high' ? '高影响' : 
                     trend.impact === 'medium' ? '中等影响' : '低影响'}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                
                <div className="flex items-center text-sm mb-3">
                  <span className="text-gray-600 mr-2">年增长率:</span>
                  <span className="font-medium text-green-600">{trend.yearChange}</span>
                </div>
                
                {trend.relatedProducts && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-1">相关产品</h5>
                    <div className="flex flex-wrap gap-2">
                      {trend.relatedProducts.map((product, i) => (
                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {trend.forecast && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <h5 className="text-sm font-medium mb-1">未来预测</h5>
                    <p className="text-sm text-gray-600">{trend.forecast}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'organic':
        return (
          <div className="space-y-4">
            {insightData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{item.category}</h4>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">增长率:</span>
                    <span className="font-medium text-green-600">{item.growthRate}%</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">市场份额</span>
                    <span className="text-sm font-medium">{item.marketShare}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${item.marketShare * 5}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">主要消费群体</span>
                    <p className="text-sm">{item.demographics}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">价格指数</span>
                    <p className="text-sm">{item.priceIndex} <span className="text-xs text-gray-500">(普通=100)</span></p>
                  </div>
                </div>
                
                {item.barriers && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-1">购买障碍</h5>
                    <div className="flex flex-wrap gap-2">
                      {item.barriers.map((barrier, i) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                          {barrier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'regions':
        return (
          <div className="space-y-4">
            {insightData.map((region, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{region.region}</h4>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">消费指数:</span>
                    <span className={`font-medium ${region.spendingIndex > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {region.spendingIndex}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{region.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <h5 className="text-sm font-medium mb-1">区域特征</h5>
                    <p className="text-sm">{region.characteristics}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-1">线上购买比例</h5>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${region.onlineRatio}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{region.onlineRatio}%</span>
                    </div>
                  </div>
                </div>
                
                {region.preferences && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-1">消费偏好</h5>
                    <div className="flex flex-wrap gap-2">
                      {region.preferences.map((pref, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {region.topProducts && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">热门产品</h5>
                    <div className="flex flex-wrap gap-2">
                      {region.topProducts.map((product, i) => (
                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'supplyDemand':
        return (
          <div>
            {/* 产销对接模块顶部说明 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm leading-5 font-medium text-blue-800">
                    解决"菜贵伤民、菜贱伤农"问题
                  </h3>
                  <div className="mt-2 text-sm leading-5 text-blue-700">
                    <p>中央文件强调建立产销对接机制和风险防控体系，通过市场价格波动预测与供需匹配引导，减少信息不对称，促进农民增收，推动乡村产业高质量发展。</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 产销对接方案列表 */}
            <div className="space-y-4">
              {insightData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg text-gray-800">{item.factor}</h4>
                    <div className={`px-2 py-1 rounded text-sm border ${getImpactStyle(item.impact)}`}>
                      {item.trend}
                    </div>
                  </div>
                  
                  {/* 问题描述 */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-1">问题描述</h5>
                    <p className="text-sm text-gray-800">{item.description}</p>
                  </div>
                  
                  {/* 解决方案 */}
                  <div className="mb-4 bg-green-50 p-3 rounded-md">
                    <h5 className="text-sm font-medium text-green-700 mb-1">解决方案</h5>
                    <p className="text-sm text-green-800">{item.solution}</p>
                  </div>
                  
                  {/* 重要性指标 */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">影响程度</span>
                      <span className="text-sm font-medium">{item.impactLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getImportanceColor(item.impactLevel)}`} 
                        style={{ width: `${item.impactLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* 相关方 */}
                  {item.stakeholders && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">相关方</h5>
                      <div className="flex flex-wrap gap-2">
                        {item.stakeholders.map((stakeholder, i) => (
                          <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {stakeholder}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 实施评估 */}
                  {item.implementation && (
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">实施难度</div>
                        <div className="font-medium text-gray-800">{item.implementation.difficulty}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">时间框架</div>
                        <div className="font-medium text-gray-800">{item.implementation.timeframe}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">成本效益</div>
                        <div className="font-medium text-gray-800">{item.implementation.costEfficiency}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-400 text-right">
                    年度关注度变化: {item.yearChange}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // 渲染消费者画像
  const renderConsumerPersona = () => {
    if (!personaData || personaData.length === 0 || activePersona === null) {
      return null;
    }
    
    const persona = personaData[activePersona];
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-3 pb-2 border-b">{persona.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">年龄段</div>
            <div className="font-medium">{persona.age}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">收入水平</div>
            <div className="font-medium">{persona.income}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">主要地区</div>
            <div className="font-medium">{persona.location}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">特征</div>
          <div className="flex flex-wrap gap-2">
            {persona.characteristics.map((char, i) => (
              <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                {char}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">购买偏好</div>
            <div className="flex flex-wrap gap-2">
              {persona.preferences.map((pref, i) => (
                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {pref}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">主要购买渠道</div>
            <div className="flex flex-wrap gap-2">
              {persona.channels.map((channel, i) => (
                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">购买频率</div>
            <div className="font-medium">{persona.purchaseFrequency}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">消费水平</div>
            <div className="font-medium">{persona.spendingLevel}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">占消费人群比例</div>
            <div className="font-medium">{persona.percentage}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-purple-500 h-2.5 rounded-full" 
              style={{ width: `${persona.percentage * 2}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">消费者洞察</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {consumerDataTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            disabled={loading}
          >
            {loading ? '加载中...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新数据
              </>
            )}
          </button>
        </div>
      </div>

      {/* 如果选择了产销对接，显示特殊的产销对接优先banner */}
      {selectedType === 'supplyDemand' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm leading-5 text-green-700">
                农业农村部正推进建立农产品产销对接和价格预警系统，促进农业增效、农民增收、消费者受益
              </p>
              <p className="mt-3 text-sm leading-5 md:mt-0 md:ml-6">
                <a href="#" className="whitespace-nowrap font-medium text-green-700 hover:text-green-600">
                  详情 →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

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
          {/* 左侧摘要和画像 */}
          <div className="lg:col-span-1">
            {/* 如果是产销对接类型，显示特殊的摘要卡片 */}
            {selectedType === 'supplyDemand' && summaryData && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  产销对接关键洞察
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">构建完整农产品产销信息链，减少信息不对称</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">建立价格风险预警机制，提前应对市场波动</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">消费者愿意支持直采直销，农民受益提高</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-blue-100">
                  <div className="flex items-center">
                    <span className="text-xs text-blue-600 font-medium">最受关注解决方案:</span>
                    <span className="ml-2 text-sm font-semibold text-blue-800">农产品产销对接平台</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 常规摘要 */}
            {summaryData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">消费者趋势摘要</h3>
                  <p className="text-sm text-gray-600 mb-4">{summaryData.overallAnalysis}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">主要消费偏好</h4>
                      <ul className="space-y-2">
                        {summaryData.topPreferences && summaryData.topPreferences.map((pref, i) => (
                          <li key={i} className="text-sm flex justify-between">
                            <span>{pref.factor}</span>
                            <span className={`${getTrendColor(pref.trend)}`}>{pref.trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">主要购买渠道</h4>
                      <ul className="space-y-2">
                        {summaryData.mainChannels && summaryData.mainChannels.map((channel, i) => (
                          <li key={i} className="text-sm flex justify-between">
                            <span>{channel.channel}</span>
                            <span>{channel.percentage}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">关键趋势</h4>
                      <ul className="space-y-2">
                        {summaryData.keyTrends && summaryData.keyTrends.map((trend, i) => (
                          <li key={i} className="text-sm">
                            <div>{trend.trend}</div>
                            <div className="text-xs text-green-600">{trend.yearChange}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400 text-right">
                    数据更新时间: {summaryData.updatedAt ? new Date(summaryData.updatedAt).toLocaleString() : ''}
                  </div>
                </div>
              </div>
            )}
            
            {/* 消费者画像 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">消费者画像</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {personaData.map((persona, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1.5 rounded text-sm ${activePersona === index ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                    onClick={() => handlePersonaSelect(index)}
                  >
                    {persona.name}
                  </button>
                ))}
              </div>
              
              {renderConsumerPersona()}
            </div>
          </div>
          
          {/* 右侧内容区域 */}
          <div className="lg:col-span-2">
            {renderInsightContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumerInsights;