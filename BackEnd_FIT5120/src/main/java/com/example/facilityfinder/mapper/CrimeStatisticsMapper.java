package com.example.facilityfinder.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.facilityfinder.dto.CrimeStatisticsDTO;
import com.example.facilityfinder.model.CrimeStatistics;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Crime Statistics Mapper
 * 犯罪统计数据访问层
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
@Mapper
public interface CrimeStatisticsMapper extends BaseMapper<CrimeStatistics> {
    
    /**
     * Get crime statistics grouped by LGA for all years
     * 按LGA分组统计所有年份的犯罪数据
     * 
     * @return List of crime statistics DTOs
     */
    @Select("SELECT " +
            "police_region as policeRegion, " +
            "local_government_area as lga, " +
            "SUM(offence_count) as offenceCount " +
            "FROM crime_statistics " +
            "GROUP BY police_region, local_government_area " +
            "ORDER BY SUM(offence_count) DESC")
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGA();
    
    /**
     * Get crime statistics grouped by LGA for a specific year
     * 按LGA分组统计指定年份的犯罪数据
     * 
     * @param year 年份
     * @return List of crime statistics DTOs
     */
    @Select("SELECT " +
            "police_region as policeRegion, " +
            "local_government_area as lga, " +
            "SUM(offence_count) as offenceCount, " +
            "year " +
            "FROM crime_statistics " +
            "WHERE year = #{year} " +
            "GROUP BY police_region, local_government_area, year " +
            "ORDER BY SUM(offence_count) DESC")
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGAAndYear(@Param("year") Integer year);
    
    /**
     * Get crime statistics grouped by LGA for a specific police region
     * 按LGA分组统计指定警区的犯罪数据
     * 
     * @param policeRegion 警区名称
     * @return List of crime statistics DTOs
     */
    @Select("SELECT " +
            "police_region as policeRegion, " +
            "local_government_area as lga, " +
            "SUM(offence_count) as offenceCount " +
            "FROM crime_statistics " +
            "WHERE police_region = #{policeRegion} " +
            "GROUP BY police_region, local_government_area " +
            "ORDER BY SUM(offence_count) DESC")
    List<CrimeStatisticsDTO> getCrimeStatisticsByPoliceRegion(@Param("policeRegion") String policeRegion);
    
    /**
     * Get crime statistics grouped by LGA and year
     * 按LGA和年份分组统计犯罪数据
     * 
     * @return List of crime statistics DTOs with year information
     */
    @Select("SELECT " +
            "police_region as policeRegion, " +
            "local_government_area as lga, " +
            "SUM(offence_count) as offenceCount, " +
            "year " +
            "FROM crime_statistics " +
            "GROUP BY police_region, local_government_area, year " +
            "ORDER BY year DESC, SUM(offence_count) DESC")
    List<CrimeStatisticsDTO> getCrimeStatisticsByLGAWithYear();
    
    /**
     * Get available years in the database
     * 获取数据库中可用的年份
     * 
     * @return List of available years
     */
    @Select("SELECT DISTINCT year FROM crime_statistics ORDER BY year DESC")
    List<Integer> getAvailableYears();
    
    /**
     * Get available police regions
     * 获取可用的警区列表
     * 
     * @return List of police regions
     */
    @Select("SELECT DISTINCT police_region FROM crime_statistics ORDER BY police_region")
    List<String> getAvailablePoliceRegions();
}
