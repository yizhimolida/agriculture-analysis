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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">消费者洞察</h2>
        <div className="flex space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 主要内容区 */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {summaryData && (
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
              )}
            </div>
            
            {renderInsightContent()}
          </div>
          
          {/* 侧边栏 - 消费者画像 */}
          <div className="space-y-4">
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
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-md font-semibold mb-2 text-blue-800">数据来源说明</h3>
              <p className="text-sm text-blue-700">
                消费者洞察数据基于国家统计局、农业农村部及第三方研究机构的消费调研统计，
                包括全国农产品消费趋势报告、消费者行为研究和市场观察数据。
              </p>
              <p className="text-sm text-blue-700 mt-2">
                数据覆盖全国各区域、不同年龄段和收入水平的消费者，样本量超过10,000人，
                调研周期为季度和年度。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumerInsights;