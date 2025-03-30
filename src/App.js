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
          <div className="flex justify-center h-20">
            <div className="flex items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-center tracking-wider"
                  style={{
                    fontFamily: '"楷体", "STKaiti", serif',
                    color: '#000000',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(45deg,rgb(15, 16, 15),rgb(15, 16, 15))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.1em'
                  }}>
                稻 香 平 台
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <WeatherDashboard />
          <MarketAnalysis />
          <CropData />
          <ConsumerInsights />
        </div>
      </main>
    </div>
  );
}

export default App;