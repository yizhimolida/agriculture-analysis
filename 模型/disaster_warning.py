import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DisasterWarningModel:
    def __init__(self):
        self.weather_model = None
        self.pest_model = None
        self.scaler = StandardScaler()
        self.risk_thresholds = {
            'low': 0.3,
            'medium': 0.6,
            'high': 0.8
        }
        
    def prepare_weather_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """准备天气相关特征"""
        features = data.copy()
        
        # 添加气象特征
        features['temp_change'] = features['temperature'].diff()
        features['humidity_change'] = features['humidity'].diff()
        features['pressure_change'] = features['pressure'].diff()
        
        # 计算移动平均
        for window in [3, 7, 15]:
            features[f'temp_ma_{window}'] = features['temperature'].rolling(window=window).mean()
            features[f'humidity_ma_{window}'] = features['humidity'].rolling(window=window).mean()
            features[f'rainfall_ma_{window}'] = features['rainfall'].rolling(window=window).sum()
            
        # 添加极端天气指标
        features['extreme_temp'] = (features['temperature'] > features['temperature'].quantile(0.95)) | \
                                 (features['temperature'] < features['temperature'].quantile(0.05))
        features['heavy_rain'] = features['rainfall'] > features['rainfall'].quantile(0.9)
        
        return features.dropna()
    
    def prepare_pest_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """准备病虫害相关特征"""
        features = data.copy()
        
        # 添加环境条件特征
        features['temp_humidity_index'] = features['temperature'] * features['humidity']
        features['optimal_pest_conditions'] = ((features['temperature'] >= 20) & 
                                             (features['temperature'] <= 30) & 
                                             (features['humidity'] >= 60))
        
        # 添加历史发生率
        features['historical_occurrence'] = features['pest_occurrence'].rolling(window=30).mean()
        
        return features.dropna()
    
    def train_weather_model(self, data: pd.DataFrame):
        """训练天气灾害预测模型"""
        features = self.prepare_weather_features(data)
        X = features.drop(['disaster_occurrence', 'date'], axis=1)
        y = features['disaster_occurrence']
        
        self.weather_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.weather_model.fit(X, y)
        logger.info("天气灾害预测模型训练完成")
        
    def train_pest_model(self, data: pd.DataFrame):
        """训练病虫害预测模型"""
        features = self.prepare_pest_features(data)
        X = features.drop(['pest_occurrence', 'date'], axis=1)
        y = features['pest_occurrence']
        
        self.pest_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=8,
            random_state=42
        )
        self.pest_model.fit(X, y)
        logger.info("病虫害预测模型训练完成")
        
    def predict_weather_risk(self, features: pd.DataFrame) -> np.ndarray:
        """预测天气灾害风险"""
        if self.weather_model is None:
            raise ValueError("天气模型未训练")
        probabilities = self.weather_model.predict_proba(features)
        return probabilities[:, 1]  # 返回正类的概率
    
    def predict_pest_risk(self, features: pd.DataFrame) -> np.ndarray:
        """预测病虫害风险"""
        if self.pest_model is None:
            raise ValueError("病虫害模型未训练")
        probabilities = self.pest_model.predict_proba(features)
        return probabilities[:, 1]
    
    def calculate_risk_level(self, probability: float) -> str:
        """根据概率确定风险等级"""
        if probability >= self.risk_thresholds['high']:
            return '高风险'
        elif probability >= self.risk_thresholds['medium']:
            return '中风险'
        elif probability >= self.risk_thresholds['low']:
            return '低风险'
        return '安全'
    
    def generate_warning_report(self, weather_data: pd.DataFrame, pest_data: pd.DataFrame) -> Dict:
        """生成灾害预警报告"""
        weather_features = self.prepare_weather_features(weather_data)
        pest_features = self.prepare_pest_features(pest_data)
        
        weather_risk = self.predict_weather_risk(weather_features.drop(['disaster_occurrence', 'date'], axis=1))
        pest_risk = self.predict_pest_risk(pest_features.drop(['pest_occurrence', 'date'], axis=1))
        
        report = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'weather_risk': {
                'risk_level': self.calculate_risk_level(weather_risk.mean()),
                'probability': float(weather_risk.mean()),
                'high_risk_areas': weather_features[weather_risk >= self.risk_thresholds['high']]['location'].tolist()
            },
            'pest_risk': {
                'risk_level': self.calculate_risk_level(pest_risk.mean()),
                'probability': float(pest_risk.mean()),
                'high_risk_crops': pest_features[pest_risk >= self.risk_thresholds['high']]['crop_type'].tolist()
            },
            'recommendations': self.generate_recommendations(weather_risk.mean(), pest_risk.mean())
        }
        return report
    
    def generate_recommendations(self, weather_risk: float, pest_risk: float) -> List[str]:
        """生成防灾建议"""
        recommendations = []
        
        if weather_risk >= self.risk_thresholds['high']:
            recommendations.extend([
                "立即启动极端天气应急预案",
                "加强农作物保护措施",
                "准备防灾物资和设备"
            ])
        elif weather_risk >= self.risk_thresholds['medium']:
            recommendations.extend([
                "密切监控天气变化",
                "检查防灾设施状态",
                "做好防灾准备"
            ])
            
        if pest_risk >= self.risk_thresholds['high']:
            recommendations.extend([
                "立即开展病虫害防治",
                "增加监测频率",
                "准备防治药剂"
            ])
        elif pest_risk >= self.risk_thresholds['medium']:
            recommendations.extend([
                "加强田间巡查",
                "准备防治方案",
                "关注病虫害发展趋势"
            ])
            
        return recommendations 