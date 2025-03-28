import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { fetchData } from '../services/dataService';

function CropData() {
  const [cropData, setCropData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateData = async () => {
      try {
        setLoading(true);
        const data = await fetchData.crop();
        if (!Array.isArray(data)) {
          throw new Error('返回的数据格式不正确');
        }
        setCropData(data);
        setLastUpdate(new Date());
        if (!selectedCrop && data.length > 0) {
          setSelectedCrop(data[0]);
        }
        setError(null);
      } catch (err) {
        console.error('获取作物数据失败:', err);
        setError('获取作物数据失败：' + (err.message || '请稍后重试'));
        setCropData([]);
      } finally {
        setLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, [selectedCrop]);

  // 转换数据为雷达图格式
  const getRadarData = (crop) => {
    if (!crop) return [];
    return [
      { subject: '产量', A: crop.当前产量 / 6 },
      { subject: '收益', A: crop.预期收益 / 30 },
      { subject: '生长周期', A: 100 - crop.生长周期 / 2 },
      { subject: '水分需求', A: crop.水分需求 === '充足' ? 90 : crop.水分需求 === '中等' ? 70 : 50 },
      { subject: '适应性', A: 80 }
    ];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">正在获取作物数据...</div>
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

  return (
    <div className="space-y-6">
      {/* 作物选择器 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">作物数据分析</h3>
          <span className="text-sm text-gray-500">
            最后更新: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.isArray(cropData) && cropData.map((crop) => (
            <button
              key={crop.作物}
              onClick={() => setSelectedCrop(crop)}
              className={`p-4 rounded-lg transition-all ${
                selectedCrop?.作物 === crop.作物
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {crop.作物}
            </button>
          ))}
        </div>
      </div>

      {selectedCrop && (
        <>
          {/* 作物详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-4">基本信息</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">生长周期</span>
                  <span className="text-gray-900">{selectedCrop.生长周期}天</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">适宜温度</span>
                  <span className="text-gray-900">{selectedCrop.适宜温度}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">水分需求</span>
                  <span className="text-gray-900">{selectedCrop.水分需求}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">当前产量</span>
                  <span className="text-gray-900">{selectedCrop.当前产量}kg/亩</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">预期收益</span>
                  <span className="text-gray-900">¥{selectedCrop.预期收益}/亩</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-4">综合评估</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData(selectedCrop)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={selectedCrop.作物} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 种植建议 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-4">种植建议</h4>
            <div className="prose max-w-none">
              <p className="text-gray-600">{selectedCrop.种植建议}</p>
            </div>
          </div>
        </>
      )}

      {/* 产量对比 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium text-gray-900 mb-4">作物产量对比</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="作物" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="当前产量" fill="#8884d8" name="当前产量" />
              <Bar yAxisId="right" dataKey="预期收益" fill="#82ca9d" name="预期收益" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CropData; 