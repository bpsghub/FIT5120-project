package com.example.facilityfinder.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.facilityfinder.dto.CrimeStatisticsDTO;
import com.example.facilityfinder.mapper.CrimeStatisticsMapper;
import com.example.facilityfinder.model.CrimeStatistics;
import com.example.facilityfinder.service.CrimeStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Crime Statistics Service Implementation
 * 犯罪统计服务实现类
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
@Service
public class CrimeStatisticsServiceImpl extends ServiceImpl<CrimeStatisticsMapper, CrimeStatistics> 
        implements CrimeStatisticsService {

    @Autowired
    private CrimeStatisticsMapper crimeStatisticsMapper;

    @Override
    public List<CrimeStatisticsDTO> getCrimeStatisticsByLGA() {
        try {
            return crimeStatisticsMapper.getCrimeStatisticsByLGA();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get crime statistics by LGA: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CrimeStatisticsDTO> getCrimeStatisticsByLGAAndYear(Integer year) {
        if (year == null) {
            throw new IllegalArgumentException("Year cannot be null");
        }
        try {
            return crimeStatisticsMapper.getCrimeStatisticsByLGAAndYear(year);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get crime statistics by LGA and year: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CrimeStatisticsDTO> getCrimeStatisticsByPoliceRegion(String policeRegion) {
        if (policeRegion == null || policeRegion.trim().isEmpty()) {
            throw new IllegalArgumentException("Police region cannot be null or empty");
        }
        try {
            return crimeStatisticsMapper.getCrimeStatisticsByPoliceRegion(policeRegion);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get crime statistics by police region: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CrimeStatisticsDTO> getCrimeStatisticsByLGAWithYear() {
        try {
            return crimeStatisticsMapper.getCrimeStatisticsByLGAWithYear();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get crime statistics by LGA with year: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Integer> getAvailableYears() {
        try {
            return crimeStatisticsMapper.getAvailableYears();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get available years: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> getAvailablePoliceRegions() {
        try {
            return crimeStatisticsMapper.getAvailablePoliceRegions();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get available police regions: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CrimeStatisticsDTO> getCrimeStatisticsWithFilters(
            Integer page, 
            Integer size, 
            Integer year, 
            String policeRegion, 
            String lga
    ) {
        try {
            // 构建查询条件
            LambdaQueryWrapper<CrimeStatistics> queryWrapper = new LambdaQueryWrapper<>();
            
            // 添加筛选条件
            if (year != null) {
                queryWrapper.eq(CrimeStatistics::getYear, year);
            }
            if (policeRegion != null && !policeRegion.trim().isEmpty()) {
                queryWrapper.like(CrimeStatistics::getPoliceRegion, policeRegion);
            }
            if (lga != null && !lga.trim().isEmpty()) {
                queryWrapper.like(CrimeStatistics::getLocalGovernmentArea, lga);
            }
            
            // 按LGA分组
            queryWrapper.groupBy(CrimeStatistics::getPoliceRegion, CrimeStatistics::getLocalGovernmentArea);
            
            // 获取数据
            List<CrimeStatistics> crimeStatistics = this.list(queryWrapper);
            
            // 转换为DTO并聚合数据
            return crimeStatistics.stream()
                    .collect(Collectors.groupingBy(
                            cs -> cs.getPoliceRegion() + "_" + cs.getLocalGovernmentArea(),
                            Collectors.summingLong(cs -> cs.getOffenceCount().longValue())
                    ))
                    .entrySet().stream()
                    .map(entry -> {
                        String[] parts = entry.getKey().split("_", 2);
                        return new CrimeStatisticsDTO(parts[0], parts[1], entry.getValue());
                    })
                    .sorted((a, b) -> Long.compare(b.getOffenceCount(), a.getOffenceCount()))
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to get crime statistics with filters: " + e.getMessage(), e);
        }
    }
}
