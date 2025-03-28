import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, ComposedChart, Scatter, Area
} from 'recharts';
import { fetchData } from '../services/dataService';

function MarketAnalysis() {
  const [marketData, setMarketData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState('水稻');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [showDetails, setShowDetails] = useState(false);
  const [chartType, setChartType] = useState('kline'); // 'kline' or 'line'

  useEffect(() => {
    const updateData = async () => {
      try {
        setLoading(true);
        const data = await fetchData.market(timeRange);
        setMarketData(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error('获取市场数据失败:', err);
        setError('获取市场数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, [selectedProduct, timeRange]);

  const products = ['水稻', '小麦', '玉米'];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="ml-4 text-gray-500">正在获取市场数据...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  // 计算价格变化率
  const calculatePriceChange = () => {
    if (marketData.length < 2) return 0;
    const currentPrice = parseFloat(marketData[marketData.length - 1][`${selectedProduct}_收盘`]);
    const previousPrice = parseFloat(marketData[0][`${selectedProduct}_收盘`]);
    return ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);
  };

  // 计算交易量统计
  const calculateVolumeStats = () => {
    if (marketData.length === 0) return { total: 0, average: 0 };
    const total = marketData.reduce((sum, item) => sum + item[`${selectedProduct}_成交量`], 0);
    return {
      total,
      average: (total / marketData.length).toFixed(0)
    };
  };

  // 自定义K线图提示框
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="text-gray-600">{new Date(data.时间戳).toLocaleString()}</p>
          <p className="text-gray-900">开盘：{data[`${selectedProduct}_开盘`]}</p>
          <p className="text-gray-900">最高：{data[`${selectedProduct}_最高`]}</p>
          <p className="text-gray-900">最低：{data[`${selectedProduct}_最低`]}</p>
          <p className="text-gray-900">收盘：{data[`${selectedProduct}_收盘`]}</p>
          <p className="text-gray-900">成交量：{data[`${selectedProduct}_成交量`]}</p>
          <div className="mt-2 pt-2 border-t">
            <p className="text-gray-900">MA5：{data[`${selectedProduct}_MA5`]}</p>
            <p className="text-gray-900">MA10：{data[`${selectedProduct}_MA10`]}</p>
            <p className="text-gray-900">MA20：{data[`${selectedProduct}_MA20`]}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const volumeStats = calculateVolumeStats();
  const priceChange = calculatePriceChange();

  // 生成K线图数据点
  const generateScatterData = (item) => {
    if (!item) return [];
    
    const open = parseFloat(item[`${selectedProduct}_开盘`]);
    const close = parseFloat(item[`${selectedProduct}_收盘`]);
    const high = parseFloat(item[`${selectedProduct}_最高`]);
    const low = parseFloat(item[`${selectedProduct}_最低`]);
    
    if (isNaN(open) || isNaN(close) || isNaN(high) || isNaN(low)) {
      return [];
    }
    
    return [{
      x: item.时间戳,
      open,
      close,
      high,
      low,
      y: (high + low) / 2 // 中间价作为 y 值
    }];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h3 className="text-lg font-medium text-gray-900">农产品价格趋势分析</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
            >
              <option value="day">24小时</option>
              <option value="week">近7天</option>
              <option value="month">近30天</option>
              <option value="year">全年</option>
            </select>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
            >
              <option value="kline">K线图</option>
              <option value="line">分时图</option>
            </select>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
            >
              {showDetails ? '收起详情' : '查看详情'}
            </button>
          </div>
        </div>

        {/* 产品选择器 */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 md:space-x-4 min-w-max">
            {products.map((product) => (
              <button
                key={product}
                onClick={() => setSelectedProduct(product)}
                className={`px-3 md:px-4 py-2 rounded-lg transition-all text-sm md:text-base ${
                  selectedProduct === product
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {product}
              </button>
            ))}
          </div>
        </div>

        {/* 价格走势图 */}
        <div className="h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'kline' ? (
              <ComposedChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="时间戳"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeRange === 'day' ?
                      date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0') :
                      (date.getMonth() + 1) + '/' + date.getDate();
                  }}
                />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {/* K线图主体 */}
                {marketData.map((item, index) => (
                  <Scatter
                    key={index}
                    data={generateScatterData(item)}
                    fill={item[`${selectedProduct}_收盘`] >= item[`${selectedProduct}_开盘`] ? '#52c41a' : '#ff4d4f'}
                    line={false}
                    shape={(props) => {
                      const { cx, payload, yAxis } = props;
                      const data = payload;
                      if (!data || !data.length) return null;
                      
                      const candleWidth = 8;
                      const color = data[0].close >= data[0].open ? '#52c41a' : '#ff4d4f';
                      
                      // 使用 yAxis.scale 进行坐标转换
                      const getY = (value) => yAxis.scale(value);
                      
                      return (
                        <g>
                          {/* 上下影线 */}
                          <line
                            x1={cx}
                            y1={getY(data[0].high)}
                            x2={cx}
                            y2={getY(data[0].low)}
                            stroke={color}
                            strokeWidth={1}
                          />
                          {/* 实体 */}
                          <rect
                            x={cx - candleWidth / 2}
                            y={getY(Math.max(data[0].open, data[0].close))}
                            width={candleWidth}
                            height={Math.abs(getY(data[0].open) - getY(data[0].close))}
                            fill={color}
                          />
                        </g>
                      );
                    }}
                  />
                ))}
                {/* 移动平均线 */}
                <Line
                  type="monotone"
                  dataKey={`${selectedProduct}_MA5`}
                  stroke="#8884d8"
                  dot={false}
                  name="MA5"
                  strokeWidth={2}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey={`${selectedProduct}_MA10`}
                  stroke="#82ca9d"
                  dot={false}
                  name="MA10"
                  strokeWidth={2}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey={`${selectedProduct}_MA20`}
                  stroke="#ffc658"
                  dot={false}
                  name="MA20"
                  strokeWidth={2}
                  connectNulls={true}
                />
              </ComposedChart>
            ) : (
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="时间戳"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeRange === 'day' ?
                      date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0') :
                      (date.getMonth() + 1) + '/' + date.getDate();
                  }}
                />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={`${selectedProduct}_收盘`}
                  stroke="#8884d8"
                  name="价格"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 交易量和MACD */}
        <div className="h-32 md:h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={marketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="时间戳"
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return timeRange === 'day' ?
                    date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0') :
                    (date.getMonth() + 1) + '/' + date.getDate();
                }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={[0, 'auto']}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={['auto', 'auto']}
              />
              <Tooltip 
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleTimeString();
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey={`${selectedProduct}_成交量`}
                fill="#8884d8"
                name="成交量"
                opacity={0.5}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={`${selectedProduct}_MACD`}
                stroke="#82ca9d"
                name="MACD"
                dot={false}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={`${selectedProduct}_DIF`}
                stroke="#ffc658"
                name="DIF"
                dot={false}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={`${selectedProduct}_DEA`}
                stroke="#ff7300"
                name="DEA"
                dot={false}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 市场数据统计 */}
        <div className="mt-4 md:mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">市场数据统计</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="text-xs md:text-sm text-gray-500">最新价格</div>
              <div className="text-base md:text-xl font-semibold text-gray-900">
                ¥{marketData[marketData.length - 1]?.[`${selectedProduct}_收盘`] || '-'}/kg
              </div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="text-xs md:text-sm text-gray-500">涨跌幅</div>
              <div className={`text-base md:text-xl font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange}%
              </div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="text-xs md:text-sm text-gray-500">总成交量</div>
              <div className="text-base md:text-xl font-semibold text-gray-900">
                {volumeStats.total}吨
              </div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="text-xs md:text-sm text-gray-500">均成交量</div>
              <div className="text-base md:text-xl font-semibold text-gray-900">
                {volumeStats.average}吨
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketAnalysis; 