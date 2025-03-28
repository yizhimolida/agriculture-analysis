import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime
from sklearn.decomposition import PCA
from textblob import TextBlob
import jieba
import jieba.analyse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConsumerBehaviorModel:
    def __init__(self):
        self.preference_model = None
        self.sentiment_model = None
        self.scaler = StandardScaler()
        
    def analyze_consumption_patterns(self, data: pd.DataFrame) -> Dict:
        """分析消费模式"""
        # 准备特征
        features = data.copy()
        features['purchase_frequency'] = features.groupby('customer_id')['date'].transform('count')
        features['average_spending'] = features.groupby('customer_id')['amount'].transform('mean')
        
        # 客户分群
        X = features[['purchase_frequency', 'average_spending', 'basket_size']].values
        X_scaled = self.scaler.fit_transform(X)
        
        kmeans = KMeans(n_clusters=4, random_state=42)
        features['customer_segment'] = kmeans.fit_predict(X_scaled)
        
        # 分析消费特征
        consumption_patterns = {
            'customer_segments': {
                segment: {
                    'size': len(features[features['customer_segment'] == segment]),
                    'avg_frequency': features[features['customer_segment'] == segment]['purchase_frequency'].mean(),
                    'avg_spending': features[features['customer_segment'] == segment]['average_spending'].mean(),
                    'preferred_categories': features[features['customer_segment'] == segment]['category'].value_counts().head(3).to_dict()
                }
                for segment in range(4)
            },
            'seasonal_trends': self._analyze_seasonal_trends(features),
            'product_affinity': self._calculate_product_affinity(features)
        }
        
        return consumption_patterns
    
    def _analyze_seasonal_trends(self, data: pd.DataFrame) -> Dict:
        """分析季节性趋势"""
        data['month'] = pd.to_datetime(data['date']).dt.month
        data['season'] = pd.to_datetime(data['date']).dt.quarter
        
        seasonal_trends = {
            'monthly_sales': data.groupby('month')['amount'].sum().to_dict(),
            'seasonal_preferences': {
                season: data[data['season'] == season]['category'].value_counts().head(5).to_dict()
                for season in range(1, 5)
            },
            'peak_seasons': data.groupby('season')['amount'].sum().nlargest(2).index.tolist()
        }
        
        return seasonal_trends
    
    def _calculate_product_affinity(self, data: pd.DataFrame) -> Dict:
        """计算产品关联性"""
        # 构建购物篮分析
        transactions = data.groupby(['transaction_id', 'product_id'])['quantity'].sum().unstack().fillna(0)
        
        # 计算支持度和置信度
        support = (transactions > 0).sum() / len(transactions)
        confidence = {}
        
        for prod1 in transactions.columns:
            for prod2 in transactions.columns:
                if prod1 != prod2:
                    confidence[(prod1, prod2)] = (
                        ((transactions[prod1] > 0) & (transactions[prod2] > 0)).sum() /
                        (transactions[prod1] > 0).sum()
                    )
        
        return {
            'product_support': support.to_dict(),
            'product_confidence': {f"{k[0]}->{k[1]}": v for k, v in confidence.items() if v > 0.1}
        }
    
    def analyze_brand_perception(self, data: pd.DataFrame) -> Dict:
        """分析品牌感知"""
        # 情感分析
        data['sentiment_score'] = data['review_text'].apply(self._analyze_sentiment)
        
        # 关键词提取
        all_reviews = ' '.join(data['review_text'].fillna(''))
        keywords = jieba.analyse.extract_tags(all_reviews, topK=20, withWeight=True)
        
        brand_perception = {
            'sentiment_distribution': {
                'positive': (data['sentiment_score'] > 0).mean(),
                'neutral': (data['sentiment_score'] == 0).mean(),
                'negative': (data['sentiment_score'] < 0).mean()
            },
            'average_rating': data['rating'].mean(),
            'key_topics': {word: weight for word, weight in keywords},
            'brand_attributes': self._extract_brand_attributes(data)
        }
        
        return brand_perception
    
    def _analyze_sentiment(self, text: str) -> float:
        """分析文本情感"""
        if pd.isna(text):
            return 0
        return TextBlob(text).sentiment.polarity
    
    def _extract_brand_attributes(self, data: pd.DataFrame) -> Dict:
        """提取品牌属性"""
        # 提取评论中提到的产品属性
        attributes = {
            'quality': len(data[data['review_text'].str.contains('质量|品质', na=False)]) / len(data),
            'price': len(data[data['review_text'].str.contains('价格|便宜|贵', na=False)]) / len(data),
            'service': len(data[data['review_text'].str.contains('服务|态度', na=False)]) / len(data),
            'packaging': len(data[data['review_text'].str.contains('包装|外观', na=False)]) / len(data)
        }
        
        return attributes
    
    def analyze_market_trends(self, data: pd.DataFrame) -> Dict:
        """分析市场趋势"""
        # 准备特征
        features = data.copy()
        features['year_month'] = pd.to_datetime(features['date']).dt.to_period('M')
        
        # 计算增长率
        monthly_sales = features.groupby('year_month')['amount'].sum()
        growth_rate = monthly_sales.pct_change()
        
        # 产品组合分析
        product_mix = features.groupby('category').agg({
            'amount': 'sum',
            'quantity': 'sum',
            'profit_margin': 'mean'
        })
        
        market_trends = {
            'sales_growth': {
                'monthly_growth': growth_rate.mean() * 100,
                'growth_stability': growth_rate.std(),
                'top_growing_categories': features.groupby('category')['amount'].sum().pct_change().nlargest(5).to_dict()
            },
            'product_portfolio': {
                'category_contribution': (product_mix['amount'] / product_mix['amount'].sum()).to_dict(),
                'profit_margins': product_mix['profit_margin'].to_dict(),
                'volume_share': (product_mix['quantity'] / product_mix['quantity'].sum()).to_dict()
            },
            'market_concentration': self._calculate_market_concentration(features)
        }
        
        return market_trends
    
    def _calculate_market_concentration(self, data: pd.DataFrame) -> Dict:
        """计算市场集中度"""
        total_sales = data['amount'].sum()
        brand_sales = data.groupby('brand')['amount'].sum()
        
        # 计算赫芬达尔指数
        hhi = ((brand_sales / total_sales) ** 2).sum()
        
        # 计算CR4（前4大品牌集中度）
        cr4 = brand_sales.nlargest(4).sum() / total_sales
        
        return {
            'hhi': hhi,
            'cr4': cr4,
            'top_brands': brand_sales.nlargest(10).to_dict()
        }
    
    def generate_consumer_report(self, sales_data: pd.DataFrame,
                               review_data: pd.DataFrame) -> Dict:
        """生成消费者行为分析报告"""
        consumption_patterns = self.analyze_consumption_patterns(sales_data)
        brand_perception = self.analyze_brand_perception(review_data)
        market_trends = self.analyze_market_trends(sales_data)
        
        report = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'consumption_patterns': consumption_patterns,
            'brand_perception': brand_perception,
            'market_trends': market_trends,
            'recommendations': self.generate_recommendations(
                consumption_patterns,
                brand_perception,
                market_trends
            )
        }
        return report
    
    def generate_recommendations(self,
                               consumption_patterns: Dict,
                               brand_perception: Dict,
                               market_trends: Dict) -> List[str]:
        """生成消费者洞察建议"""
        recommendations = []
        
        # 消费者细分建议
        high_value_segment = max(
            consumption_patterns['customer_segments'].items(),
            key=lambda x: x[1]['avg_spending']
        )[0]
        recommendations.append(f"重点关注消费者群体{high_value_segment}，制定个性化营销策略")
        
        # 品牌建设建议
        if brand_perception['sentiment_distribution']['positive'] < 0.6:
            recommendations.extend([
                "加强品牌形象建设，提升消费者好感度",
                "重视消费者反馈，改善产品质量和服务"
            ])
            
        # 市场策略建议
        if market_trends['sales_growth']['monthly_growth'] < 5:
            recommendations.extend([
                "开发新产品类别，扩大市场份额",
                "优化产品结构，提高盈利能力"
            ])
            
        # 季节性策略
        peak_seasons = consumption_patterns['seasonal_trends']['peak_seasons']
        recommendations.append(f"在第{peak_seasons}季度加大营销力度，把握销售旺季")
        
        return recommendations 