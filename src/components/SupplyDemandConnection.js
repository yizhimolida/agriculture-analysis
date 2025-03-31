import React, { useState, useEffect } from 'react';
import { 
  getSupplyDemandData, 
  getSupplyDemandSummary, 
  supplyDemandCategories, 
  industryCategories 
} from '../services/supplyDemandService';

function SupplyDemandConnection() {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState('problems');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取产销对接数据
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const [detailData, summary] = await Promise.all([
          getSupplyDemandData(selectedCategory, selectedIndustry),
          getSupplyDemandSummary(selectedIndustry)
        ]);
        
        setData(detailData);
        setSummaryData(summary);
      } catch (err) {
        console.error('获取产销对接数据失败:', err);
        setError('获取产销对接数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedCategory, selectedIndustry]);
  
  // 处理类别变化
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // 处理行业变化
  const handleIndustryChange = (e) => {
    setSelectedIndustry(e.target.value);
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    
    Promise.all([
      getSupplyDemandData(selectedCategory, selectedIndustry, true),
      getSupplyDemandSummary(selectedIndustry, true)
    ])
      .then(([detailData, summary]) => {
        setData(detailData);
        setSummaryData(summary);
        setLoading(false);
      })
      .catch(err => {
        console.error('刷新产销对接数据失败:', err);
        setError('刷新产销对接数据失败，请稍后重试');
        setLoading(false);
      });
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
  
  // 获取重要性颜色
  const getImportanceColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };
  
  // 渲染不同类别的内容
  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          无数据可显示
        </div>
      );
    }
    
    switch (selectedCategory) {
      case 'problems':
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
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
        );
        
      case 'solutions':
        return (
          <div className="space-y-6">
            {data.map((solution, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">{solution.title}</h3>
                    <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200">
                      {solution.approach}
                    </span>
                  </div>
                  <div className="mt-2 text-blue-800 text-sm">
                    有效性评估: <span className="font-semibold">{solution.effectiveness}%</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-700 mb-4">{solution.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">主要收益</h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.benefits.map((benefit, i) => (
                        <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">实施细节</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">难度:</span>
                          <span className="font-medium">{solution.implementation.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">成本:</span>
                          <span className="font-medium">{solution.implementation.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">时间框架:</span>
                          <span className="font-medium">{solution.implementation.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">主要参与方</h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.implementation.keyPlayers.map((player, i) => (
                          <span key={i} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                            {player}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">参考案例: </span>
                      <span className="text-blue-600">{solution.caseReference}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">当前状态: </span>
                      <span className="text-green-600">{solution.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'cases':
        return (
          <div className="space-y-6">
            {data.map((caseItem, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="bg-green-50 p-4 border-b border-green-100">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-xl font-semibold text-green-900">{caseItem.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white text-green-700 rounded-full text-sm border border-green-200">
                        {caseItem.location}
                      </span>
                      <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200">
                        {caseItem.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">存在问题</h4>
                      <p className="text-gray-700 bg-red-50 p-3 rounded-md text-sm">{caseItem.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">解决方案</h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded-md text-sm">{caseItem.solution}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">成果与效益</h4>
                    <ul className="space-y-1 text-sm">
                      {caseItem.results.map((result, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">成功关键因素</h4>
                      <ul className="space-y-1 text-sm">
                        {caseItem.keyFactors.map((factor, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">实施情况</h4>
                      <p className="text-sm text-gray-700">{caseItem.implementation}</p>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">可复制性: </span>
                        <span className="text-sm font-medium">{caseItem.replicability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 text-sm text-gray-500">
                    联系方式: {caseItem.contact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'policy':
        return (
          <div className="space-y-6">
            {data.map((policy, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                  <h3 className="text-xl font-semibold text-indigo-900">{policy.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <div className="text-indigo-800">
                      <span className="text-indigo-600">发布机构:</span> {policy.issuer}
                    </div>
                    <div className="text-indigo-800">
                      <span className="text-indigo-600">发布时间:</span> {policy.issueDate}
                    </div>
                    <div className="text-indigo-800">
                      <span className="text-indigo-600">政策级别:</span> {policy.level}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">政策重点</h4>
                    <p className="text-gray-700 bg-indigo-50 p-3 rounded-md">{policy.focus}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">主要内容</h4>
                      <ul className="space-y-2 text-sm">
                        {policy.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-800 font-medium mr-2">
                              {i+1}
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">支持措施</h4>
                      <div className="flex flex-wrap gap-2">
                        {policy.supportMeasures.map((measure, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                            {measure}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                    <div className="text-gray-700">
                      <span className="text-gray-500">实施进度: </span>
                      {policy.implementation}
                    </div>
                    <a href={policy.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      查看详情 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'forecast':
        return (
          <div className="space-y-6">
            {data.map((forecast, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="bg-yellow-50 p-4 border-b border-yellow-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-yellow-900">{forecast.title}</h3>
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm border border-yellow-200">
                        {forecast.period}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-yellow-800 text-sm">
                    总体走势: <span className="font-semibold">{forecast.trend}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">影响因素</h4>
                    <ul className="space-y-1 text-sm">
                      {forecast.factors.map((factor, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">价格变动预测</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(forecast.priceChange).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-2 rounded-lg text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {key === 'leafy' ? '叶菜类' : 
                             key === 'fruit' ? '果菜类' :
                             key === 'root' ? '根茎类' :
                             key === 'citrus' ? '柑橘类' :
                             key === 'tropical' ? '热带水果' :
                             key === 'deciduous' ? '落叶果类' :
                             key === 'rice' ? '水稻' :
                             key === 'wheat' ? '小麦' :
                             key === 'corn' ? '玉米' :
                             key === 'overall' ? '总体' : key}
                          </div>
                          <div className={`font-medium ${value.includes('+') ? 'text-green-600' : value.includes('-') ? 'text-red-600' : 'text-gray-600'}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">潜在风险因素</h4>
                    <div className="flex flex-wrap gap-2">
                      {forecast.riskFactors.map((risk, i) => (
                        <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">建议</h4>
                    <p className="text-sm text-gray-700">{forecast.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-10 text-gray-500">
            请选择要查看的数据类别
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">农产品产销对接</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supplyDemandCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedIndustry}
            onChange={handleIndustryChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部行业</option>
            {industryCategories.map(industry => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
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

      {/* 顶部政策提示 */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm leading-5 font-medium text-green-800">
              解决"菜贵伤民、菜贱伤农"问题
            </h3>
            <div className="mt-2 text-sm leading-5 text-green-700">
              <p>中央文件强调建立产销对接机制和风险防控体系，通过市场价格波动预测与供需匹配引导，减少信息不对称，促进农民增收，推动乡村产业高质量发展。</p>
            </div>
          </div>
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
          {/* 左侧摘要 */}
          <div className="lg:col-span-1">
            {summaryData && (
              <>
                {/* 产销对接关键洞察 */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">
                    产销对接关键洞察
                  </h3>
                  <ul className="space-y-2">
                    {summaryData.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 政策亮点 */}
                {summaryData.policy && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-blue-800">最新政策指引</h3>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-blue-800">{summaryData.policy.latest}</div>
                      <div className="text-sm text-blue-600 mt-1">{summaryData.policy.focus}</div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">重点内容</h4>
                      <ul className="space-y-1">
                        {summaryData.policy.key_points.map((point, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* 核心问题和解决方案概览 */}
                {summaryData.keyProblems && summaryData.keyStrategies && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">重点问题与策略</h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">核心问题</h4>
                      <ul className="space-y-2">
                        {summaryData.keyProblems.map((problem, idx) => (
                          <li key={idx} className="text-sm bg-white p-2 rounded border border-gray-200">
                            <div className="font-medium">{problem.factor}</div>
                            <div className="text-xs text-gray-500 mt-1">{problem.description}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">解决策略</h4>
                      <ul className="space-y-2">
                        {summaryData.keyStrategies.map((strategy, idx) => (
                          <li key={idx} className="text-sm bg-white p-2 rounded border border-gray-200">
                            <div className="font-medium">{strategy.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              有效性: <span className="text-green-600 font-medium">{strategy.effectiveness}%</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-400 text-right">
                      数据更新时间: {summaryData.updatedAt ? new Date(summaryData.updatedAt).toLocaleString() : ''}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* 右侧内容区域 */}
          <div className="lg:col-span-2">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplyDemandConnection; 