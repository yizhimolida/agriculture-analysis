import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime
import statsmodels.api as sm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PolicyAnalysisModel:
    def __init__(self):
        self.impact_model = None
        self.scaler = StandardScaler()
        
    def analyze_subsidy_impact(self, data: pd.DataFrame) -> Dict:
        """分析补贴政策影响"""
        # 准备特征
        features = data.copy()
        features['subsidy_per_area'] = features['total_subsidy'] / features['cultivated_area']
        features['time_since_policy'] = (pd.to_datetime(features['date']) - 
                                       pd.to_datetime(features['policy_start_date'])).dt.days
        
        # 计算政策效果
        before_policy = features[features['time_since_policy'] < 0]
        after_policy = features[features['time_since_policy'] >= 0]
        
        impact_analysis = {
            'yield_change': {
                'before': before_policy['yield'].mean(),
                'after': after_policy['yield'].mean(),
                'percentage_change': ((after_policy['yield'].mean() - 
                                     before_policy['yield'].mean()) / 
                                    before_policy['yield'].mean() * 100)
            },
            'income_change': {
                'before': before_policy['farmer_income'].mean(),
                'after': after_policy['farmer_income'].mean(),
                'percentage_change': ((after_policy['farmer_income'].mean() - 
                                     before_policy['farmer_income'].mean()) / 
                                    before_policy['farmer_income'].mean() * 100)
            },
            'participation_rate': len(features[features['participated']]) / len(features) * 100,
            'cost_effectiveness': (after_policy['farmer_income'].sum() - 
                                 before_policy['farmer_income'].sum()) / features['total_subsidy'].sum()
        }
        
        return impact_analysis
    
    def analyze_poverty_alleviation(self, data: pd.DataFrame) -> Dict:
        """分析扶贫政策效果"""
        # 准备特征
        features = data.copy()
        features['time_in_program'] = (pd.to_datetime(features['date']) - 
                                     pd.to_datetime(features['program_start_date'])).dt.days / 365
        
        # 构建回归模型
        X = features[['time_in_program', 'support_amount', 'training_hours']]
        y = features['household_income']
        
        model = sm.OLS(y, sm.add_constant(X))
        results = model.fit()
        
        # 分析政策效果
        poverty_analysis = {
            'income_improvement': {
                'average_increase': (features['household_income'].mean() - 
                                   features['baseline_income'].mean()),
                'percentage_improved': (features['household_income'] > 
                                     features['poverty_line']).mean() * 100
            },
            'program_effectiveness': {
                'r_squared': results.rsquared,
                'coefficients': results.params.to_dict(),
                'p_values': results.pvalues.to_dict()
            },
            'cost_benefit_ratio': ((features['household_income'].sum() - 
                                  features['baseline_income'].sum()) / 
                                 features['program_cost'].sum())
        }
        
        return poverty_analysis
    
    def analyze_environmental_policy(self, data: pd.DataFrame) -> Dict:
        """分析环境政策效果"""
        # 准备特征
        features = data.copy()
        features['months_since_implementation'] = (pd.to_datetime(features['date']) - 
                                                 pd.to_datetime(features['policy_start_date'])).dt.months
        
        # 分析环境指标变化
        environmental_impact = {
            'soil_quality': {
                'before': features[features['months_since_implementation'] < 0]['soil_quality'].mean(),
                'after': features[features['months_since_implementation'] >= 0]['soil_quality'].mean(),
                'improvement': ((features[features['months_since_implementation'] >= 0]['soil_quality'].mean() - 
                               features[features['months_since_implementation'] < 0]['soil_quality'].mean()) / 
                              features[features['months_since_implementation'] < 0]['soil_quality'].mean() * 100)
            },
            'water_quality': {
                'before': features[features['months_since_implementation'] < 0]['water_quality'].mean(),
                'after': features[features['months_since_implementation'] >= 0]['water_quality'].mean(),
                'improvement': ((features[features['months_since_implementation'] >= 0]['water_quality'].mean() - 
                               features[features['months_since_implementation'] < 0]['water_quality'].mean()) / 
                              features[features['months_since_implementation'] < 0]['water_quality'].mean() * 100)
            },
            'biodiversity_index': {
                'before': features[features['months_since_implementation'] < 0]['biodiversity'].mean(),
                'after': features[features['months_since_implementation'] >= 0]['biodiversity'].mean(),
                'change': ((features[features['months_since_implementation'] >= 0]['biodiversity'].mean() - 
                           features[features['months_since_implementation'] < 0]['biodiversity'].mean()) / 
                          features[features['months_since_implementation'] < 0]['biodiversity'].mean() * 100)
            }
        }
        
        return environmental_impact
    
    def generate_policy_report(self, subsidy_data: pd.DataFrame,
                             poverty_data: pd.DataFrame,
                             environmental_data: pd.DataFrame) -> Dict:
        """生成政策分析报告"""
        subsidy_analysis = self.analyze_subsidy_impact(subsidy_data)
        poverty_analysis = self.analyze_poverty_alleviation(poverty_data)
        environmental_analysis = self.analyze_environmental_policy(environmental_data)
        
        report = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'subsidy_impact': subsidy_analysis,
            'poverty_alleviation': poverty_analysis,
            'environmental_impact': environmental_analysis,
            'recommendations': self.generate_recommendations(
                subsidy_analysis,
                poverty_analysis,
                environmental_analysis
            )
        }
        return report
    
    def generate_recommendations(self,
                               subsidy_analysis: Dict,
                               poverty_analysis: Dict,
                               environmental_analysis: Dict) -> List[str]:
        """生成政策建议"""
        recommendations = []
        
        # 补贴政策建议
        if subsidy_analysis['cost_effectiveness'] < 1.5:
            recommendations.extend([
                "优化补贴分配机制，提高资金使用效率",
                "加强补贴政策宣传，提高农户参与度",
                "建立补贴效果评估机制"
            ])
            
        # 扶贫政策建议
        if poverty_analysis['income_improvement']['percentage_improved'] < 60:
            recommendations.extend([
                "加强技能培训力度，提高脱贫能力",
                "发展特色产业，增加收入来源",
                "完善帮扶机制，精准识别帮扶对象"
            ])
            
        # 环境政策建议
        if (environmental_analysis['soil_quality']['improvement'] < 10 or
            environmental_analysis['water_quality']['improvement'] < 10):
            recommendations.extend([
                "加强环境监测，及时发现问题",
                "推广环保技术，减少农业污染",
                "建立生态补偿机制"
            ])
            
        return recommendations 