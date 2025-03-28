import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime
import geopandas as gpd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResourcePlanningModel:
    def __init__(self):
        self.land_model = None
        self.crop_rotation_model = None
        self.scaler = StandardScaler()
        
    def analyze_land_suitability(self, data: pd.DataFrame) -> pd.DataFrame:
        """分析土地适宜性"""
        features = data.copy()
        
        # 计算土地评分
        features['soil_score'] = (
            features['organic_matter'] * 0.3 +
            features['ph_value'] * 0.2 +
            features['nitrogen_content'] * 0.2 +
            features['phosphorus_content'] * 0.15 +
            features['potassium_content'] * 0.15
        )
        
        # 地形适宜性
        features['terrain_score'] = (
            (features['slope'] <= 15).astype(int) * 0.4 +
            (features['elevation'] <= 1000).astype(int) * 0.3 +
            features['drainage_condition'] * 0.3
        )
        
        # 综合评分
        features['suitability_score'] = (
            features['soil_score'] * 0.6 +
            features['terrain_score'] * 0.4
        )
        
        return features
    
    def optimize_crop_rotation(self, data: pd.DataFrame) -> Dict:
        """优化作物轮作方案"""
        # 分析土壤养分消耗
        nutrient_consumption = data.groupby('crop_type').agg({
            'nitrogen_consumption': 'mean',
            'phosphorus_consumption': 'mean',
            'potassium_consumption': 'mean'
        })
        
        # 计算作物互补性
        crop_compatibility = pd.DataFrame(index=data['crop_type'].unique(),
                                        columns=data['crop_type'].unique())
        
        for crop1 in crop_compatibility.index:
            for crop2 in crop_compatibility.columns:
                if crop1 != crop2:
                    # 计算养分互补性得分
                    nutrient_balance = 1 - abs(
                        nutrient_consumption.loc[crop1] -
                        nutrient_consumption.loc[crop2]
                    ).mean()
                    
                    # 考虑病虫害防治效果
                    pest_control = data[
                        (data['previous_crop'] == crop1) &
                        (data['current_crop'] == crop2)
                    ]['pest_occurrence'].mean()
                    
                    crop_compatibility.loc[crop1, crop2] = (
                        nutrient_balance * 0.7 +
                        (1 - pest_control) * 0.3
                    )
        
        return {
            'nutrient_consumption': nutrient_consumption.to_dict(),
            'crop_compatibility': crop_compatibility.to_dict(),
            'recommended_rotation': self._generate_rotation_sequence(crop_compatibility)
        }
    
    def _generate_rotation_sequence(self, compatibility_matrix: pd.DataFrame) -> List[str]:
        """生成最优轮作序列"""
        crops = compatibility_matrix.index.tolist()
        sequence = [crops[0]]  # 从第一个作物开始
        
        for _ in range(len(crops) - 1):
            current_crop = sequence[-1]
            next_crop = compatibility_matrix.loc[current_crop].idxmax()
            
            if next_crop in sequence:
                # 如果最佳作物已在序列中，选择次优
                next_crop = compatibility_matrix.loc[current_crop].nlargest(2).index[1]
            
            sequence.append(next_crop)
        
        return sequence
    
    def analyze_resource_distribution(self, data: pd.DataFrame) -> Dict:
        """分析资源分布情况"""
        # 土地资源聚类
        land_features = data[['latitude', 'longitude', 'suitability_score']]
        kmeans = KMeans(n_clusters=5, random_state=42)
        data['land_cluster'] = kmeans.fit_predict(self.scaler.fit_transform(land_features))
        
        # 统计各区域特征
        cluster_stats = data.groupby('land_cluster').agg({
            'suitability_score': 'mean',
            'area': 'sum',
            'water_resource': 'mean',
            'soil_type': lambda x: x.mode()[0]
        }).to_dict()
        
        return {
            'cluster_centers': kmeans.cluster_centers_.tolist(),
            'cluster_stats': cluster_stats,
            'resource_distribution': self._calculate_resource_distribution(data)
        }
    
    def _calculate_resource_distribution(self, data: pd.DataFrame) -> Dict:
        """计算资源分布指标"""
        return {
            'water_resources': {
                'total': data['water_resource'].sum(),
                'per_area': data['water_resource'].mean(),
                'distribution': data.groupby('region')['water_resource'].mean().to_dict()
            },
            'soil_resources': {
                'types': data['soil_type'].value_counts().to_dict(),
                'quality_distribution': data.groupby('soil_type')['suitability_score'].mean().to_dict()
            },
            'infrastructure': {
                'irrigation_coverage': (data['irrigation_system'] == 1).mean(),
                'road_accessibility': data['road_distance'].describe().to_dict()
            }
        }
    
    def generate_planning_report(self, land_data: pd.DataFrame, crop_data: pd.DataFrame) -> Dict:
        """生成资源规划报告"""
        land_analysis = self.analyze_land_suitability(land_data)
        rotation_plan = self.optimize_crop_rotation(crop_data)
        resource_distribution = self.analyze_resource_distribution(land_analysis)
        
        report = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'land_suitability': {
                'high_potential_areas': land_analysis[
                    land_analysis['suitability_score'] >= 0.8
                ]['location'].tolist(),
                'average_score': float(land_analysis['suitability_score'].mean()),
                'score_distribution': land_analysis['suitability_score'].describe().to_dict()
            },
            'crop_rotation': rotation_plan,
            'resource_distribution': resource_distribution,
            'recommendations': self.generate_recommendations(land_analysis, rotation_plan)
        }
        return report
    
    def generate_recommendations(self, land_analysis: pd.DataFrame, rotation_plan: Dict) -> List[str]:
        """生成资源规划建议"""
        recommendations = []
        
        # 土地利用建议
        if land_analysis['suitability_score'].mean() < 0.6:
            recommendations.extend([
                "加强土壤改良措施",
                "增加有机质投入",
                "改善排水系统"
            ])
        
        # 轮作建议
        recommendations.append(f"建议轮作顺序：{' -> '.join(rotation_plan['recommended_rotation'])}")
        
        # 资源利用建议
        if 'irrigation_coverage' in land_analysis.columns:
            if land_analysis['irrigation_coverage'].mean() < 0.7:
                recommendations.append("扩大灌溉系统覆盖范围")
        
        return recommendations 