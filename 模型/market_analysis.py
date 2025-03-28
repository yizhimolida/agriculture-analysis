import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from prophet import Prophet
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
import xgboost as xgb
from typing import Dict, List, Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketAnalysisModel:
    def __init__(self):
        self.price_model = None
        self.demand_model = None
        self.scaler = StandardScaler()
        
    def prepare_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """准备特征工程"""
        features = data.copy()
        
        # 添加时间特征
        features['year'] = pd.to_datetime(features['date']).dt.year
        features['month'] = pd.to_datetime(features['date']).dt.month
        features['quarter'] = pd.to_datetime(features['date']).dt.quarter
        
        # 添加滞后特征
        for lag in [1, 3, 6, 12]:
            features[f'price_lag_{lag}'] = features['price'].shift(lag)
            features[f'demand_lag_{lag}'] = features['demand'].shift(lag)
            
        # 添加移动平均
        for window in [3, 6, 12]:
            features[f'price_ma_{window}'] = features['price'].rolling(window=window).mean()
            features[f'demand_ma_{window}'] = features['demand'].rolling(window=window).mean()
            
        return features.dropna()
    
    def train_price_model(self, data: pd.DataFrame):
        """训练价格预测模型"""
        features = self.prepare_features(data)
        X = features.drop(['price', 'date', 'demand'], axis=1)
        y = features['price']
        
        self.price_model = xgb.XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5
        )
        self.price_model.fit(X, y)
        logger.info("价格预测模型训练完成")
        
    def train_demand_model(self, data: pd.DataFrame):
        """训练需求预测模型"""
        # 使用Prophet模型进行需求预测
        df_prophet = data[['date', 'demand']].copy()
        df_prophet.columns = ['ds', 'y']
        
        self.demand_model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
        self.demand_model.fit(df_prophet)
        logger.info("需求预测模型训练完成")
        
    def predict_price(self, features: pd.DataFrame) -> np.ndarray:
        """预测价格"""
        if self.price_model is None:
            raise ValueError("模型未训练")
        return self.price_model.predict(features)
    
    def predict_demand(self, future_dates: pd.DataFrame) -> pd.DataFrame:
        """预测需求"""
        if self.demand_model is None:
            raise ValueError("模型未训练")
        future = self.demand_model.make_future_dataframe(periods=365)
        forecast = self.demand_model.predict(future)
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    
    def analyze_seasonality(self, data: pd.DataFrame) -> Dict:
        """分析季节性模式"""
        seasonal_patterns = {
            'yearly': data.groupby(pd.Grouper(key='date', freq='Y'))['price'].mean().to_dict(),
            'monthly': data.groupby(pd.Grouper(key='date', freq='M'))['price'].mean().to_dict(),
            'quarterly': data.groupby(pd.Grouper(key='date', freq='Q'))['price'].mean().to_dict()
        }
        return seasonal_patterns
    
    def calculate_price_volatility(self, data: pd.DataFrame, window: int = 30) -> pd.Series:
        """计算价格波动性"""
        return data['price'].rolling(window=window).std()
    
    def generate_market_report(self, data: pd.DataFrame) -> Dict:
        """生成市场分析报告"""
        report = {
            'average_price': data['price'].mean(),
            'price_trend': data['price'].diff().mean(),
            'volatility': self.calculate_price_volatility(data).mean(),
            'seasonal_patterns': self.analyze_seasonality(data),
            'year_over_year_growth': (data['price'].iloc[-1] / data['price'].iloc[0] - 1) * 100
        }
        return report 