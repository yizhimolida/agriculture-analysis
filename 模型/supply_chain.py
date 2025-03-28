import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime
from sklearn.cluster import DBSCAN
import networkx as nx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupplyChainModel:
    def __init__(self):
        self.logistics_model = None
        self.inventory_model = None
        self.scaler = StandardScaler()
        
    def optimize_logistics_routes(self, data: pd.DataFrame) -> Dict:
        """优化物流路线"""
        # 构建运输网络
        G = nx.Graph()
        
        # 添加节点和边
        for _, row in data.iterrows():
            G.add_edge(
                row['origin'],
                row['destination'],
                weight=row['transport_cost'],
                time=row['transport_time'],
                capacity=row['transport_capacity']
            )
            
        # 计算最优路径
        optimal_routes = {}
        for origin in G.nodes():
            for destination in G.nodes():
                if origin != destination:
                    try:
                        path = nx.shortest_path(
                            G, origin, destination,
                            weight='weight'
                        )
                        path_time = nx.shortest_path_length(
                            G, origin, destination,
                            weight='time'
                        )
                        optimal_routes[f"{origin}-{destination}"] = {
                            'path': path,
                            'total_cost': nx.shortest_path_length(
                                G, origin, destination,
                                weight='weight'
                            ),
                            'total_time': path_time
                        }
                    except nx.NetworkXNoPath:
                        continue
                        
        return {
            'optimal_routes': optimal_routes,
            'network_stats': self._calculate_network_stats(G)
        }
    
    def _calculate_network_stats(self, G: nx.Graph) -> Dict:
        """计算网络统计指标"""
        return {
            'total_nodes': G.number_of_nodes(),
            'total_edges': G.number_of_edges(),
            'average_degree': sum(dict(G.degree()).values()) / G.number_of_nodes(),
            'density': nx.density(G),
            'average_clustering': nx.average_clustering(G),
            'connected_components': nx.number_connected_components(G)
        }
    
    def optimize_inventory(self, data: pd.DataFrame) -> Dict:
        """优化库存管理"""
        inventory_stats = data.groupby('warehouse').agg({
            'inventory_level': ['mean', 'std', 'min', 'max'],
            'demand': ['mean', 'std'],
            'lead_time': 'mean',
            'storage_cost': 'mean'
        })
        
        optimal_inventory = {}
        for warehouse in inventory_stats.index:
            stats = inventory_stats.loc[warehouse]
            
            # 计算安全库存
            service_level = 0.95  # 95%服务水平
            z_score = 1.645  # 对应95%服务水平的z值
            safety_stock = z_score * np.sqrt(
                stats[('lead_time', 'mean')] * stats[('demand', 'std')]**2 +
                stats[('demand', 'mean')]**2 * stats[('lead_time', 'mean')]
            )
            
            # 计算经济订货量(EOQ)
            annual_demand = stats[('demand', 'mean')] * 365
            order_cost = 100  # 假设固定订货成本
            holding_cost = stats[('storage_cost', 'mean')] / 365
            eoq = np.sqrt((2 * annual_demand * order_cost) / holding_cost)
            
            optimal_inventory[warehouse] = {
                'safety_stock': safety_stock,
                'eoq': eoq,
                'reorder_point': safety_stock + stats[('demand', 'mean')] * stats[('lead_time', 'mean')],
                'max_inventory': safety_stock + eoq
            }
            
        return {
            'warehouse_stats': inventory_stats.to_dict(),
            'optimal_inventory': optimal_inventory
        }
    
    def analyze_distribution_network(self, data: pd.DataFrame) -> Dict:
        """分析配送网络"""
        # 使用DBSCAN聚类分析配送中心位置
        locations = data[['latitude', 'longitude']].values
        clustering = DBSCAN(eps=0.5, min_samples=5).fit(self.scaler.fit_transform(locations))
        
        data['cluster'] = clustering.labels_
        
        cluster_stats = data.groupby('cluster').agg({
            'demand': 'sum',
            'transport_cost': 'mean',
            'service_radius': 'mean'
        }).to_dict()
        
        return {
            'clusters': cluster_stats,
            'coverage_analysis': self._analyze_coverage(data),
            'network_efficiency': self._calculate_network_efficiency(data)
        }
    
    def _analyze_coverage(self, data: pd.DataFrame) -> Dict:
        """分析服务覆盖范围"""
        return {
            'total_coverage': data['service_radius'].sum(),
            'average_coverage': data['service_radius'].mean(),
            'coverage_by_region': data.groupby('region')['service_radius'].mean().to_dict(),
            'population_covered': data.groupby('region').agg({
                'population': 'sum',
                'service_radius': 'mean'
            }).to_dict()
        }
    
    def _calculate_network_efficiency(self, data: pd.DataFrame) -> Dict:
        """计算网络效率指标"""
        return {
            'average_delivery_time': data['delivery_time'].mean(),
            'delivery_reliability': (data['actual_delivery_time'] <= data['promised_delivery_time']).mean(),
            'cost_efficiency': (data['revenue'] - data['transport_cost']).sum() / data['transport_cost'].sum(),
            'capacity_utilization': data['actual_load'].sum() / data['transport_capacity'].sum()
        }
    
    def generate_supply_chain_report(self, logistics_data: pd.DataFrame, inventory_data: pd.DataFrame) -> Dict:
        """生成供应链分析报告"""
        logistics_optimization = self.optimize_logistics_routes(logistics_data)
        inventory_optimization = self.optimize_inventory(inventory_data)
        network_analysis = self.analyze_distribution_network(logistics_data)
        
        report = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'logistics_optimization': logistics_optimization,
            'inventory_optimization': inventory_optimization,
            'network_analysis': network_analysis,
            'recommendations': self.generate_recommendations(
                logistics_optimization,
                inventory_optimization,
                network_analysis
            )
        }
        return report
    
    def generate_recommendations(self,
                               logistics_opt: Dict,
                               inventory_opt: Dict,
                               network_analysis: Dict) -> List[str]:
        """生成供应链优化建议"""
        recommendations = []
        
        # 物流优化建议
        if network_analysis['network_efficiency']['delivery_reliability'] < 0.9:
            recommendations.extend([
                "优化配送路线，提高准时交付率",
                "考虑增加物流节点，减少配送距离",
                "加强物流追踪系统建设"
            ])
            
        # 库存优化建议
        for warehouse, stats in inventory_opt['optimal_inventory'].items():
            if stats['safety_stock'] > stats['max_inventory'] * 0.4:
                recommendations.append(f"仓库{warehouse}安全库存过高，建议优化补货策略")
                
        # 网络结构优化建议
        if network_analysis['network_efficiency']['capacity_utilization'] < 0.7:
            recommendations.extend([
                "整合物流资源，提高运力利用率",
                "优化仓储布局，减少运输成本",
                "考虑引入智能调度系统"
            ])
            
        return recommendations 