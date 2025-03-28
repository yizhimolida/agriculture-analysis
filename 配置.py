"""
配置文件，包含系统所需的各种参数设置
"""

# 数据路径配置
DATA_PATHS = {
    'market_data': '数据/market_data.csv',
    'price_data': '数据/price_data.csv',
    'weather_data': '数据/weather_data.csv',
    'disaster_history': '数据/disaster_history.csv',
    'land_data': '数据/land_data.csv',
    'crop_data': '数据/crop_data.csv',
    'logistics_data': '数据/logistics_data.csv',
    'inventory_data': '数据/inventory_data.csv',
    'subsidy_data': '数据/subsidy_data.csv',
    'poverty_data': '数据/poverty_data.csv',
    'environmental_data': '数据/environmental_data.csv',
    'sales_data': '数据/sales_data.csv',
    'review_data': '数据/review_data.csv'
}

# 模型参数配置
MODEL_PARAMS = {
    'market_analysis': {
        'price_prediction_window': 30,  # 价格预测窗口（天）
        'demand_forecast_horizon': 90,  # 需求预测范围（天）
        'confidence_level': 0.95  # 预测置信水平
    },
    'disaster_warning': {
        'risk_thresholds': {
            'low': 0.3,
            'medium': 0.6,
            'high': 0.8
        },
        'monitoring_frequency': 6  # 监测频率（小时）
    },
    'resource_planning': {
        'land_suitability_threshold': 0.7,  # 土地适宜性阈值
        'rotation_cycle': 3,  # 轮作周期（年）
        'min_resource_utilization': 0.8  # 最小资源利用率
    },
    'supply_chain': {
        'inventory_service_level': 0.95,  # 库存服务水平
        'max_delivery_time': 48,  # 最大配送时间（小时）
        'min_capacity_utilization': 0.7  # 最小运力利用率
    },
    'policy_analysis': {
        'impact_evaluation_period': 365,  # 政策影响评估周期（天）
        'min_benefit_cost_ratio': 1.5,  # 最小效益成本比
        'poverty_line': 4000  # 贫困线（元/月）
    },
    'consumer_behavior': {
        'customer_segment_count': 4,  # 客户细分数量
        'sentiment_threshold': 0.6,  # 情感分析阈值
        'min_market_share': 0.1  # 最小市场份额
    }
}

# 系统配置
SYSTEM_CONFIG = {
    'log_level': 'INFO',
    'data_update_frequency': 24,  # 数据更新频率（小时）
    'report_format': 'json',
    'save_path': '报告/',
    'max_threads': 4  # 最大线程数
}

# API配置
API_CONFIG = {
    'weather_api': {
        'base_url': 'http://api.weather.com',
        'api_key': 'YOUR_API_KEY',
        'request_timeout': 30
    },
    'market_api': {
        'base_url': 'http://api.market.com',
        'api_key': 'YOUR_API_KEY',
        'request_timeout': 30
    }
}

# 数据库配置
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'agriculture_ai',
    'user': 'admin',
    'password': 'YOUR_PASSWORD'
}

# 报告配置
REPORT_CONFIG = {
    'language': 'zh_CN',
    'template_path': '模板/',
    'export_formats': ['json', 'pdf', 'excel'],
    'auto_send_email': False,
    'email_recipients': []
}

# 预警配置
ALERT_CONFIG = {
    'enable_sms': False,
    'enable_email': True,
    'enable_wechat': False,
    'alert_levels': ['critical', 'warning', 'info'],
    'alert_contacts': {
        'admin': 'admin@example.com',
        'manager': 'manager@example.com'
    }
}

# 性能优化配置
PERFORMANCE_CONFIG = {
    'cache_enabled': True,
    'cache_expire_time': 3600,  # 缓存过期时间（秒）
    'batch_size': 1000,  # 批处理大小
    'use_multiprocessing': True,
    'process_pool_size': 4
} 