package com.example.facilityfinder.dto;

import lombok.Data;

/**
 * Crime Statistics Data Transfer Object
 * 犯罪统计数据传输对象
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
@Data
public class CrimeStatisticsDTO {
    
    /**
     * Police region - 警区
     */
    private String policeRegion;
    
    /**
     * Local government area - 地方政府区域 (LGA)
     */
    private String lga;
    
    /**
     * Total offence count - 总犯罪数量
     */
    private Long offenceCount;
    
    /**
     * Year - 年份
     */
    private Integer year;
    
    /**
     * Constructor for basic grouping (without year)
     * 基础分组构造函数（不包含年份）
     */
    public CrimeStatisticsDTO(String policeRegion, String lga, Long offenceCount) {
        this.policeRegion = policeRegion;
        this.lga = lga;
        this.offenceCount = offenceCount;
    }
    
    /**
     * Constructor for yearly grouping
     * 年度分组构造函数
     */
    public CrimeStatisticsDTO(String policeRegion, String lga, Long offenceCount, Integer year) {
        this.policeRegion = policeRegion;
        this.lga = lga;
        this.offenceCount = offenceCount;
        this.year = year;
    }
    
    /**
     * Default constructor
     * 默认构造函数
     */
    public CrimeStatisticsDTO() {}
}
