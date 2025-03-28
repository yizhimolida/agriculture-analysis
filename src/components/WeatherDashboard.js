import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateWeatherData, get24HourForecast } from '../services/weatherService';

// 添加省份数据
const provinces = [
  { name: '北京市', cities: ['北京'] },
  { name: '上海市', cities: ['上海'] },
  { name: '天津市', cities: ['天津'] },
  { name: '重庆市', cities: ['重庆'] },
  { name: '河北省', cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'] },
  { name: '山西省', cities: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'] },
  { name: '内蒙古自治区', cities: ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布'] },
  { name: '辽宁省', cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'] },
  { name: '吉林省', cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城'] },
  { name: '黑龙江省', cities: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化'] },
  { name: '江苏省', cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'] },
  { name: '浙江省', cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'] },
  { name: '安徽省', cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'] },
  { name: '福建省', cities: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'] },
  { name: '江西省', cities: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'] },
  { name: '山东省', cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'] },
  { name: '河南省', cities: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'] },
  { name: '湖北省', cities: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州'] },
  { name: '湖南省', cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底'] },
  { name: '广东省', cities: ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'] },
  { name: '广西壮族自治区', cities: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'] },
  { name: '海南省', cities: ['海口', '三亚'] },
  { name: '四川省', cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳'] },
  { name: '贵州省', cities: ['贵阳', '六盘水', '遵义', '安顺', '铜仁', '毕节', '黔西南', '黔东南', '黔南'] },
  { name: '云南省', cities: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧'] },
  { name: '西藏自治区', cities: ['拉萨', '昌都', '山南', '日喀则', '那曲', '阿里', '林芝'] },
  { name: '陕西省', cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'] },
  { name: '甘肃省', cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南'] },
  { name: '青海省', cities: ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西'] },
  { name: '宁夏回族自治区', cities: ['银川', '石嘴山', '吴忠', '固原', '中卫'] },
  { name: '新疆维吾尔自治区', cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密'] },
  { name: '台湾省', cities: ['台北', '高雄', '基隆', '台中', '台南', '新竹', '嘉义'] },
  { name: '香港特别行政区', cities: ['香港'] },
  { name: '澳门特别行政区', cities: ['澳门'] }
];

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('北京');
  const [selectedCity, setSelectedCity] = useState('北京');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState('day');

  useEffect(() => {
    const updateData = async () => {
      try {
        setLoading(true);
        const data = await generateWeatherData(selectedProvince, selectedCity);
        const hourly = await get24HourForecast(selectedProvince, selectedCity);
        setWeatherData(data);
        setHourlyData(hourly);
        setError(null);
      } catch (err) {
        console.error('获取天气数据失败:', err);
        setError('获取天气数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, 300000); // 每5分钟更新一次
    return () => clearInterval(interval);
  }, [selectedProvince, selectedCity]);

  const getWeatherStatusClass = (status) => {
    const statusClasses = {
      '晴': 'bg-yellow-100 text-yellow-800',
      '多云': 'bg-gray-100 text-gray-800',
      '小雨': 'bg-blue-100 text-blue-800',
      '中雨': 'bg-blue-200 text-blue-800',
      '大雨': 'bg-blue-300 text-blue-800',
      '阴': 'bg-gray-200 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="ml-4 text-gray-500">正在获取天气数据...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">天气监测</h2>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="day">24小时</option>
              <option value="week">近7天</option>
              <option value="month">近30天</option>
              <option value="year">全年</option>
            </select>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {showDetails ? '收起详情' : '查看详情'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">省份</label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity(null);
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {provinces.map(province => (
                <option key={province.name} value={province.name}>{province.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {selectedProvince && provinces.find(p => p.name === selectedProvince)?.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {weatherData && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{weatherData.地区}</h3>
                  <p className="text-blue-100">{weatherData.省份}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{weatherData.温度}°C</div>
                  <p className="text-blue-100">体感温度 {weatherData.体感温度}°C</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full ${getWeatherStatusClass(weatherData.天气状况)}`}>
                  {weatherData.天气状况}
                </span>
              </div>
            </div>

            {/* 温度趋势图 */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">温度趋势</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="时间" tickFormatter={(time) => new Date(time).getHours() + '时'} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                    <Legend />
                    <Line type="monotone" dataKey="温度" stroke="#8884d8" name="温度 (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {showDetails && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">相对湿度</div>
                    <div className="text-xl font-semibold">{weatherData.相对湿度}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">风速</div>
                    <div className="text-xl font-semibold">{weatherData.风速} m/s</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">降水量</div>
                    <div className="text-xl font-semibold">{weatherData.降水量} mm</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">空气质量</div>
                    <div className="text-xl font-semibold">
                      {weatherData.空气质量}
                      <span className="text-sm text-gray-500 ml-1">
                        ({weatherData.空气质量等级})
                      </span>
                    </div>
                  </div>
                </div>

                {weatherData.预警信息 && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v5a1 1 0 11-2 0V7zm1 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">天气预警</h3>
                        <div className="mt-2 text-sm text-red-700 whitespace-pre-line">{weatherData.预警信息}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard; 