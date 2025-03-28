import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchData } from '../services/dataService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function ConsumerInsights() {
  const [consumerData, setConsumerData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateData = async () => {
      try {
        setLoading(true);
        const data = await fetchData.consumer();
        if (!Array.isArray(data)) {
          throw new Error('返回的数据格式不正确');
        }
        setConsumerData(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error('获取消费者数据失败:', err);
        setError('获取消费者数据失败：' + (err.message || '请稍后重试'));
        setConsumerData([]);
      } finally {
        setLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">正在获取消费者数据...</div>
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

  // 计算产品市场份额
  const calculateMarketShare = () => {
    if (!Array.isArray(consumerData) || consumerData.length === 0) {
      return [];
    }
    const productSales = consumerData.reduce((acc, curr) => {
      acc[curr.产品] = (acc[curr.产品] || 0) + curr.销量;
      return acc;
    }, {});

    return Object.entries(productSales).map(([name, value]) => ({
      name,
      value
    }));
  };

  // 计算消费群体分析
  const calculateConsumerGroups = () => {
    if (!Array.isArray(consumerData) || consumerData.length === 0) {
      return {};
    }
    return consumerData.reduce((acc, curr) => {
      if (!acc[curr.消费群体]) {
        acc[curr.消费群体] = {
          群体: curr.消费群体,
          总消费: 0,
          平均满意度: 0,
          数量: 0
        };
      }
      acc[curr.消费群体].总消费 += curr.销量 * parseFloat(curr.价格);
      acc[curr.消费群体].平均满意度 += curr.满意度;
      acc[curr.消费群体].数量 += 1;
      return acc;
    }, {});
  };

  const marketShare = calculateMarketShare();
  const consumerGroups = Object.values(calculateConsumerGroups()).map(group => ({
    ...group,
    平均满意度: (group.平均满意度 / group.数量).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      {/* 市场份额分析 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">产品市场份额分析</h3>
          <span className="text-sm text-gray-500">
            最后更新: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketShare}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 消费群体分析 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">消费群体分析</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumerGroups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="群体" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="总消费" fill="#8884d8" name="总消费额" />
              <Bar yAxisId="right" dataKey="平均满意度" fill="#82ca9d" name="满意度" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 消费趋势分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consumerData.filter(item => item.消费群体 === '高端消费者').map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">{item.产品}</h4>
              <span className={`px-2 py-1 rounded text-sm ${
                parseFloat(item.增长率) >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.增长率}%
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">销量</span>
                <span className="text-gray-900">{item.销量}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">价格</span>
                <span className="text-gray-900">¥{item.价格}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">满意度</span>
                <div className="flex items-center">
                  <span className="text-gray-900">{item.满意度}%</span>
                  <div className="ml-2 w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${item.满意度}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsumerInsights; 