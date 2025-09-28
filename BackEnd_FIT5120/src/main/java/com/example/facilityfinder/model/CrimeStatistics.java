package com.example.facilityfinder.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Crime Statistics Entity
 * 犯罪统计实体类
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
@Data
@TableName("crime_statistics")
public class CrimeStatistics {
    
    /**
     * Primary key - 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    
    /**
     * Year - 年份
     */
    private Integer year;
    
    /**
     * Year ending - 年份结束时间
     */
    private String yearEnding;
    
    /**
     * Police region - 警区
     */
    private String policeRegion;
    
    /**
     * Local government area - 地方政府区域
     */
    private String localGovernmentArea;
    
    /**
     * Offence count - 犯罪数量
     */
    private Integer offenceCount;
    
    /**
     * Rate per 100,000 population - 每10万人犯罪率
     */
    private BigDecimal ratePer100000Population;
}
