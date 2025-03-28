import React from 'react';
import MarketAnalysis from './components/MarketAnalysis';
import ConsumerInsights from './components/ConsumerInsights';
import CropData from './components/CropData';
import WeatherDashboard from './components/WeatherDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">农业数据分析平台</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <WeatherDashboard />
          <MarketAnalysis />
          <ConsumerInsights />
          <CropData />
        </div>
      </main>
    </div>
  );
}

export default App;