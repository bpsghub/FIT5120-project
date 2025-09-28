package com.example.facilityfinder.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.facilityfinder.dto.CrimeStatisticsDTO;
import com.example.facilityfinder.model.CrimeStatistics;

import java.util.List;

/**
 * Crime Statistics Service Interface
 * 犯罪统计服务接口
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
public interface CrimeStatisticsService extends IService<CrimeStatistics> {
    
    /**
     * Get crime statistics grouped by LGA for all years
     * 按LGA分组统计所有年份的犯罪数据
     * 
     * @return List of crime statistics DTOs
     */
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGA();
    
    /**
     * Get crime statistics grouped by LGA for a specific year
     * 按LGA分组统计指定年份的犯罪数据
     * 
     * @param year 年份
     * @return List of crime statistics DTOs
     */
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGAAndYear(Integer year);
    
    /**
     * Get crime statistics grouped by LGA for a specific police region
     * 按LGA分组统计指定警区的犯罪数据
     * 
     * @param policeRegion 警区名称
     * @return List of crime statistics DTOs
     */
    List<CrimeStatisticsDTO> getCrimeStatisticsByPoliceRegion(String policeRegion);
    
    /**
     * Get crime statistics grouped by LGA and year
     * 按LGA和年份分组统计犯罪数据
     * 
     * @return List of crime statistics DTOs with year information
     */
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGAWithYear();
    
    /**
     * Get available years in the database
     * 获取数据库中可用的年份
     * 
     * @return List of available years
     */
    List<Integer> getAvailableYears();
    
    /**
     * Get available police regions
     * 获取可用的警区列表
     * 
     * @return List of police regions
     */
    List<String> getAvailablePoliceRegions();
    
    /**
     * Get crime statistics with pagination and filtering
     * 获取带分页和过滤的犯罪统计数据
     * 
     * @param page 页码
     * @param size 每页大小
     * @param year 年份（可选）
     * @param policeRegion 警区（可选）
     * @param lga LGA名称（可选）
     * @return Paginated crime statistics
     */
    List<CrimeStatisticsDTO> getCrimeStatisticsWithFilters(
            Integer page, 
            Integer size, 
            Integer year, 
            String policeRegion, 
            String lga
    );
}
