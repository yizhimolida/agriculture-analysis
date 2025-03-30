# Agriculture Analysis

This is a React-based web application for agricultural data analysis and visualization. The application provides features for analyzing crop data, consumer insights, market trends, and weather information.

## Features

- **Weather Information Dashboard** with real-time data from QWeather API across all Chinese provinces
- **Market Price Trends** using real agricultural commodities price data with analysis and forecasts
- **Crop Production Data** with national statistics, regional distribution and crop suitability analysis
- **Consumer Behavior Insights** with authentic consumer preference data, purchasing patterns, and regional differences
- Mobile-Responsive Design with modern UI

## Data Sources

The application uses the following data sources:
- **Weather Data**: QWeather API for real-time weather information across all Chinese provinces
- **Market Price Data**: Based on official agricultural market price information from the Ministry of Agriculture and Rural Affairs
- **Crop Data**: Based on China Statistical Yearbook and Ministry of Agriculture official data
- **Consumer Insights**: Based on National Bureau of Statistics consumer surveys, agricultural consumption reports, and market research data

## Consumer Insights Feature

The newly added Consumer Insights module provides comprehensive analysis of agricultural product consumption patterns, including:

- **Consumer Preferences**: Factors influencing purchasing decisions with demographic breakdowns
- **Purchasing Channels**: Analysis of where consumers buy agricultural products (markets, supermarkets, e-commerce)
- **Consumption Trends**: Emerging trends in agricultural consumption with growth rates and forecasts
- **Organic Product Analysis**: Market share and growth data for various organic food categories
- **Regional Differences**: Consumption patterns and preferences across different regions of China
- **Consumer Personas**: Detailed consumer personas representing key market segments

All consumer data is based on authentic market research, government statistics, and industry reports, ensuring accuracy and reliability for decision-making.

## Tech Stack

- React
- TailwindCSS
- Axios (for API requests)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory and add:
```
REACT_APP_QWEATHER_KEY=your_api_key
```

## Build & Deploy

To build for production:
```bash
npm run build
```

For easy deployment preparation, you can use:
```bash
./prepare_deploy.bat
```

## Project Structure

- `src/components/` - React components including WeatherDashboard, MarketAnalysis, CropData, and ConsumerInsights
- `src/services/` - API services for fetching data from various sources