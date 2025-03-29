import React, { useState, useEffect } from 'react';
import { getMarketPriceData, getPriceTrendAnalysis, productCategories } from '../services/marketService';

function MarketAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('vegetables');
  const [priceData, setPriceData] = useState([]);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取市场价格数据
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const [priceResponse, analysisResponse] = await Promise.all([
          getMarketPriceData(selectedCategory),
          getPriceTrendAnalysis(selectedCategory)
        ]);
        
        setPriceData(priceResponse);
        setTrendAnalysis(analysisResponse);
      } catch (err) {
        console.error('获取市场数据失败:', err);
        setError('获取市场数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedCategory]);

  // 处理类别变化
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    
    Promise.all([
      getMarketPriceData(selectedCategory, true),
      getPriceTrendAnalysis(selectedCategory, true)
    ])
      .then(([priceResponse, analysisResponse]) => {
        setPriceData(priceResponse);
        setTrendAnalysis(analysisResponse);
        setLoading(false);
      })
      .catch(err => {
        console.error('刷新市场数据失败:', err);
        setError('刷新市场数据失败，请稍后重试');
        setLoading(false);
      });
  };

  // 获取价格趋势颜色
  const getTrendColor = (trend) => {
    if (trend === '上涨') return 'text-red-500';
    if (trend === '下跌') return 'text-green-500';
    return 'text-gray-500';
  };

  // 获取变化率颜色
  const getChangeColor = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return 'text-red-500';
    if (numValue < 0) return 'text-green-500';
    return 'text-gray-500';
  };

  // 渲染价格趋势图表（简化版）
  const renderPriceChart = (product) => {
    if (!product.priceTrend || product.priceTrend.length === 0) return null;
    
    const maxPrice = Math.max(...product.priceTrend.map(p => parseFloat(p.price)));
    const minPrice = Math.min(...product.priceTrend.map(p => parseFloat(p.price)));
    const range = maxPrice - minPrice;
    const baseHeight = 40; // 基础高度
    
    return (
      <div className="flex items-end h-10 space-x-1">
        {product.priceTrend.map((point, index) => {
          const height = range === 0 ? baseHeight : baseHeight * ((parseFloat(point.price) - minPrice) / range);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-3 ${
                  index === product.priceTrend.length - 1 ? 
                  'bg-blue-500' : 
                  parseFloat(point.price) > parseFloat(product.currentPrice) ? 
                  'bg-red-300' : 
                  'bg-green-300'
                }`}
                style={{ height: `${Math.max(10, height)}px` }}
                title={`${point.date}: ${point.price}元`}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">市场价格趋势</h2>
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {productCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
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
          {/* 市场分析概览 */}
          <div className="lg:col-span-1">
            {trendAnalysis && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">市场分析</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">价格趋势</span>
                    <span className={`font-semibold ${getTrendColor(trendAnalysis.trendSummary.mainTrend)}`}>
                      {trendAnalysis.trendSummary.mainTrend}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="w-8 h-4 bg-red-400 rounded-sm"></div>
                      <span className="text-xs">上涨</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-4 bg-gray-300 rounded-sm"></div>
                      <span className="text-xs">平稳</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-4 bg-green-400 rounded-sm"></div>
                      <span className="text-xs">下跌</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2 h-6 overflow-hidden rounded-md">
                    <div 
                      className="bg-red-400" 
                      style={{width: `${(trendAnalysis.trendSummary.upCount / trendAnalysis.totalProducts) * 100}%`}}
                      title={`上涨: ${trendAnalysis.trendSummary.upCount}种`}
                    ></div>
                    <div 
                      className="bg-gray-300" 
                      style={{width: `${(trendAnalysis.trendSummary.stableCount / trendAnalysis.totalProducts) * 100}%`}}
                      title={`平稳: ${trendAnalysis.trendSummary.stableCount}种`}
                    ></div>
                    <div 
                      className="bg-green-400" 
                      style={{width: `${(trendAnalysis.trendSummary.downCount / trendAnalysis.totalProducts) * 100}%`}}
                      title={`下跌: ${trendAnalysis.trendSummary.downCount}种`}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">环比变化</span>
                    <span className={`text-sm font-semibold ${getChangeColor(trendAnalysis.priceChanges.avgMonthChange)}`}>
                      {trendAnalysis.priceChanges.avgMonthChange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">同比变化</span>
                    <span className={`text-sm font-semibold ${getChangeColor(trendAnalysis.priceChanges.avgYearChange)}`}>
                      {trendAnalysis.priceChanges.avgYearChange}
                    </span>
                  </div>
                </div>
                
                {trendAnalysis.seasonalAnalysis && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">季节性分析</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      当前季节: <span className="font-medium">{trendAnalysis.seasonalAnalysis.season}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {trendAnalysis.seasonalAnalysis.analysis}
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">价格亮点</h4>
                  
                  {trendAnalysis.highlights.maxIncrease && (
                    <div className="mb-2">
                      <p className="text-sm">
                        <span className="text-gray-600">涨幅最大: </span>
                        <span className="font-semibold">{trendAnalysis.highlights.maxIncrease.name}</span>
                        <span className="text-red-500 ml-1">
                          {trendAnalysis.highlights.maxIncrease.change}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        当前价格: {trendAnalysis.highlights.maxIncrease.currentPrice}
                      </p>
                    </div>
                  )}
                  
                  {trendAnalysis.highlights.maxDecrease && (
                    <div>
                      <p className="text-sm">
                        <span className="text-gray-600">跌幅最大: </span>
                        <span className="font-semibold">{trendAnalysis.highlights.maxDecrease.name}</span>
                        <span className="text-green-500 ml-1">
                          {trendAnalysis.highlights.maxDecrease.change}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        当前价格: {trendAnalysis.highlights.maxDecrease.currentPrice}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-gray-400 text-right">
                  更新时间: {new Date(trendAnalysis.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          {/* 价格表格 */}
          <div className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      产品
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前价格
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      环比
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      同比
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      趋势
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      价格走势
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceData.map((product, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sources[0]?.market || '全国均价'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{product.currentPrice}{product.unit.replace('元/', '')}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${getChangeColor(product.monthOverMonthChange)}`}>
                          {product.monthOverMonthChange}%
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${getChangeColor(product.yearOverYearChange)}`}>
                          {product.yearOverYearChange}%
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          product.trend === '上涨' ? 'bg-red-100 text-red-800' : 
                          product.trend === '下跌' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.trend}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {renderPriceChart(product)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 数据来源说明 */}
            <div className="mt-4 text-xs text-gray-500">
              <p>数据来源: 农业农村部市场信息系统、全国农产品批发市场价格信息系统</p>
              <p>
                价格为目标市场平均批发价，仅供参考，实际交易价格可能因地区、品质等因素有所差异
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketAnalysis;