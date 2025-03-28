import pandas as pd
import logging
from datetime import datetime
from typing import Dict, List
from pathlib import Path

from 模型.market_analysis import MarketAnalysisModel
from 模型.disaster_warning import DisasterWarningModel
from 模型.resource_planning import ResourcePlanningModel
from 模型.supply_chain import SupplyChainModel
from 模型.policy_analysis import PolicyAnalysisModel
from 模型.consumer_behavior import ConsumerBehaviorModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgricultureAISystem:
    def __init__(self):
        self.market_model = MarketAnalysisModel()
        self.disaster_model = DisasterWarningModel()
        self.resource_model = ResourcePlanningModel()
        self.supply_chain_model = SupplyChainModel()
        self.policy_model = PolicyAnalysisModel()
        self.consumer_model = ConsumerBehaviorModel()
        
    def load_data(self, data_dir: str = "数据") -> Dict[str, pd.DataFrame]:
        """加载所有数据"""
        data_path = Path(data_dir)
        data = {}
        
        try:
            # 市场数据
            data['market'] = pd.read_csv(data_path / 'market_data.csv')
            data['price'] = pd.read_csv(data_path / 'price_data.csv')
            
            # 灾害数据
            data['weather'] = pd.read_csv(data_path / 'weather_data.csv')
            data['disaster'] = pd.read_csv(data_path / 'disaster_history.csv')
            
            # 资源数据
            data['land'] = pd.read_csv(data_path / 'land_data.csv')
            data['crop'] = pd.read_csv(data_path / 'crop_data.csv')
            
            # 供应链数据
            data['logistics'] = pd.read_csv(data_path / 'logistics_data.csv')
            data['inventory'] = pd.read_csv(data_path / 'inventory_data.csv')
            
            # 政策数据
            data['subsidy'] = pd.read_csv(data_path / 'subsidy_data.csv')
            data['poverty'] = pd.read_csv(data_path / 'poverty_data.csv')
            data['environmental'] = pd.read_csv(data_path / 'environmental_data.csv')
            
            # 消费者数据
            data['sales'] = pd.read_csv(data_path / 'sales_data.csv')
            data['reviews'] = pd.read_csv(data_path / 'review_data.csv')
            
            logger.info("所有数据加载成功")
            
        except FileNotFoundError as e:
            logger.error(f"数据文件不存在: {e}")
            raise
        except Exception as e:
            logger.error(f"数据加载错误: {e}")
            raise
            
        return data
    
    def generate_comprehensive_report(self, data: Dict[str, pd.DataFrame]) -> Dict:
        """生成综合分析报告"""
        try:
            # 市场分析
            market_report = self.market_model.generate_market_report(
                data['market'],
                data['price']
            )
            
            # 灾害预警
            disaster_report = self.disaster_model.generate_warning_report(
                data['weather'],
                data['disaster']
            )
            
            # 资源规划
            resource_report = self.resource_model.generate_planning_report(
                data['land'],
                data['crop']
            )
            
            # 供应链优化
            supply_chain_report = self.supply_chain_model.generate_supply_chain_report(
                data['logistics'],
                data['inventory']
            )
            
            # 政策分析
            policy_report = self.policy_model.generate_policy_report(
                data['subsidy'],
                data['poverty'],
                data['environmental']
            )
            
            # 消费者行为分析
            consumer_report = self.consumer_model.generate_consumer_report(
                data['sales'],
                data['reviews']
            )
            
            # 整合所有报告
            comprehensive_report = {
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'market_analysis': market_report,
                'disaster_warning': disaster_report,
                'resource_planning': resource_report,
                'supply_chain_optimization': supply_chain_report,
                'policy_analysis': policy_report,
                'consumer_behavior': consumer_report,
                'integrated_recommendations': self.generate_integrated_recommendations([
                    market_report,
                    disaster_report,
                    resource_report,
                    supply_chain_report,
                    policy_report,
                    consumer_report
                ])
            }
            
            logger.info("综合报告生成成功")
            return comprehensive_report
            
        except Exception as e:
            logger.error(f"报告生成错误: {e}")
            raise
            
    def generate_integrated_recommendations(self, reports: List[Dict]) -> List[str]:
        """生成综合建议"""
        all_recommendations = []
        priorities = {
            'high': [],
            'medium': [],
            'low': []
        }
        
        # 收集所有建议
        for report in reports:
            if 'recommendations' in report:
                all_recommendations.extend(report['recommendations'])
                
        # 优先级分类
        for rec in all_recommendations:
            # 紧急灾害预警相关
            if any(keyword in rec.lower() for keyword in ['立即', '紧急', '警告']):
                priorities['high'].append(rec)
            # 重要但不紧急的建议
            elif any(keyword in rec.lower() for keyword in ['优化', '提高', '加强']):
                priorities['medium'].append(rec)
            # 长期发展建议
            else:
                priorities['low'].append(rec)
                
        # 整合建议
        integrated_recommendations = []
        integrated_recommendations.extend([f"紧急事项: {rec}" for rec in priorities['high']])
        integrated_recommendations.extend([f"重要事项: {rec}" for rec in priorities['medium']])
        integrated_recommendations.extend([f"长期规划: {rec}" for rec in priorities['low']])
        
        return integrated_recommendations

def main():
    """主程序入口"""
    try:
        # 初始化系统
        system = AgricultureAISystem()
        logger.info("农业AI系统初始化成功")
        
        # 加载数据
        data = system.load_data()
        logger.info("数据加载完成")
        
        # 生成报告
        report = system.generate_comprehensive_report(data)
        logger.info("综合报告生成完成")
        
        # 保存报告
        import json
        with open('综合分析报告.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        logger.info("报告已保存到'综合分析报告.json'")
        
    except Exception as e:
        logger.error(f"系统运行错误: {e}")
        raise

if __name__ == "__main__":
    main() 