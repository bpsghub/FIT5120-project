package com.example.facilityfinder.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.facilityfinder.mapper.ScamReportMapper;
import com.example.facilityfinder.model.ScamReport;
import com.example.facilityfinder.service.ScamReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 诈骗报告服务实现类
 */
@Service
public class ScamReportServiceImpl implements ScamReportService {

    @Autowired
    private ScamReportMapper scamReportMapper;

    @Override
    public IPage<ScamReport> getScamReportsWithConditions(
            Integer page, Integer size,
            String state, String contactMode, String age, String gender,
            String categoryLevel2, String categoryLevel3,
            LocalDate startDate, LocalDate endDate) {
        
        // 创建分页对象
        Page<ScamReport> pageObj = new Page<>(page, size);
        
        // 使用LambdaQueryWrapper构建查询条件
        LambdaQueryWrapper<ScamReport> queryWrapper = new LambdaQueryWrapper<>();
        
        // 添加筛选条件 - 使用Lambda方式，类型安全
        queryWrapper.eq(StringUtils.hasText(state), ScamReport::getAddressState, state)
                   .eq(StringUtils.hasText(contactMode), ScamReport::getScamContactMode, contactMode)
                   .eq(StringUtils.hasText(age), ScamReport::getComplainantAge, age)
                   .eq(StringUtils.hasText(gender), ScamReport::getComplainantGender, gender)
                   .eq(StringUtils.hasText(categoryLevel2), ScamReport::getCategoryLevel2, categoryLevel2)
                   .eq(StringUtils.hasText(categoryLevel3), ScamReport::getCategoryLevel3, categoryLevel3)
                   .ge(startDate != null, ScamReport::getStartOfMonth, startDate)
                   .le(endDate != null, ScamReport::getStartOfMonth, endDate)
                   // 排序：按日期倒序，报告数量倒序
                   .orderByDesc(ScamReport::getStartOfMonth)
                   .orderByDesc(ScamReport::getNumberOfReports);
        
        // 执行分页查询
        return scamReportMapper.selectPage(pageObj, queryWrapper);
    }

    @Override
    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> filterOptions = new HashMap<>();
        
        try {
            // 使用LambdaQueryWrapper获取不重复的值
            
            // 获取所有州/地址
            LambdaQueryWrapper<ScamReport> stateWrapper = new LambdaQueryWrapper<>();
            stateWrapper.select(ScamReport::getAddressState)
                       .isNotNull(ScamReport::getAddressState)
                       .groupBy(ScamReport::getAddressState)
                       .orderByAsc(ScamReport::getAddressState);
            List<String> states = scamReportMapper.selectList(stateWrapper)
                    .stream()
                    .map(ScamReport::getAddressState)
                    .distinct()
                    .collect(Collectors.toList());
            filterOptions.put("states", states);
            
            // 获取所有联系方式
            LambdaQueryWrapper<ScamReport> contactWrapper = new LambdaQueryWrapper<>();
            contactWrapper.select(ScamReport::getScamContactMode)
                         .isNotNull(ScamReport::getScamContactMode)
                         .groupBy(ScamReport::getScamContactMode)
                         .orderByAsc(ScamReport::getScamContactMode);
            List<String> contactModes = scamReportMapper.selectList(contactWrapper)
                    .stream()
                    .map(ScamReport::getScamContactMode)
                    .distinct()
                    .collect(Collectors.toList());
            filterOptions.put("contactModes", contactModes);
            
            // 获取所有年龄段
            LambdaQueryWrapper<ScamReport> ageWrapper = new LambdaQueryWrapper<>();
            ageWrapper.select(ScamReport::getComplainantAge)
                     .isNotNull(ScamReport::getComplainantAge)
                     .groupBy(ScamReport::getComplainantAge)
                     .orderByAsc(ScamReport::getComplainantAge);
            List<String> ages = scamReportMapper.selectList(ageWrapper)
                    .stream()
                    .map(ScamReport::getComplainantAge)
                    .distinct()
                    .collect(Collectors.toList());
            filterOptions.put("ages", ages);
            
            // 获取所有二级分类
            LambdaQueryWrapper<ScamReport> category2Wrapper = new LambdaQueryWrapper<>();
            category2Wrapper.select(ScamReport::getCategoryLevel2)
                           .isNotNull(ScamReport::getCategoryLevel2)
                           .groupBy(ScamReport::getCategoryLevel2)
                           .orderByAsc(ScamReport::getCategoryLevel2);
            List<String> categoryLevel2 = scamReportMapper.selectList(category2Wrapper)
                    .stream()
                    .map(ScamReport::getCategoryLevel2)
                    .distinct()
                    .collect(Collectors.toList());
            filterOptions.put("categoryLevel2", categoryLevel2);
            
            // 获取所有三级分类
            LambdaQueryWrapper<ScamReport> category3Wrapper = new LambdaQueryWrapper<>();
            category3Wrapper.select(ScamReport::getCategoryLevel3)
                           .isNotNull(ScamReport::getCategoryLevel3)
                           .groupBy(ScamReport::getCategoryLevel3)
                           .orderByAsc(ScamReport::getCategoryLevel3);
            List<String> categoryLevel3 = scamReportMapper.selectList(category3Wrapper)
                    .stream()
                    .map(ScamReport::getCategoryLevel3)
                    .distinct()
                    .collect(Collectors.toList());
            filterOptions.put("categoryLevel3", categoryLevel3);
            
        } catch (Exception e) {
            // 如果获取失败，返回空Map
            System.err.println("获取筛选选项失败: " + e.getMessage());
            e.printStackTrace();
            // 返回空列表而不是null
            filterOptions.put("states", new ArrayList<>());
            filterOptions.put("contactModes", new ArrayList<>());
            filterOptions.put("ages", new ArrayList<>());
            filterOptions.put("categoryLevel2", new ArrayList<>());
            filterOptions.put("categoryLevel3", new ArrayList<>());
        }
        
        return filterOptions;
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            // 总报告数 - 使用LambdaQueryWrapper
            LambdaQueryWrapper<ScamReport> countWrapper = new LambdaQueryWrapper<>();
            Long totalReports = scamReportMapper.selectCount(countWrapper);
            statistics.put("totalReports", totalReports);
            
            // 最近的报告日期
            LambdaQueryWrapper<ScamReport> latestWrapper = new LambdaQueryWrapper<>();
            latestWrapper.orderByDesc(ScamReport::getStartOfMonth)
                        .last("LIMIT 1");
            ScamReport latestReport = scamReportMapper.selectOne(latestWrapper);
            statistics.put("latestReportDate", latestReport != null ? latestReport.getStartOfMonth() : null);
            
            // 按月统计报告数量
            LambdaQueryWrapper<ScamReport> monthlyWrapper = new LambdaQueryWrapper<>();
            monthlyWrapper.select(ScamReport::getStartOfMonth, ScamReport::getNumberOfReports)
                         .orderByDesc(ScamReport::getStartOfMonth)
                         .last("LIMIT 12"); // 最近12个月
            List<ScamReport> monthlyData = scamReportMapper.selectList(monthlyWrapper);
            statistics.put("monthlyReports", monthlyData);
            
        } catch (Exception e) {
            System.err.println("获取统计数据失败: " + e.getMessage());
            e.printStackTrace();
            statistics.put("totalReports", 0L);
            statistics.put("latestReportDate", null);
            statistics.put("monthlyReports", new ArrayList<>());
        }
        
        return statistics;
    }

    @Override
    public ScamReport getScamReportById(Integer id) {
        if (id == null) {
            return null;
        }
        
        // 使用LambdaQueryWrapper查询单个记录
        LambdaQueryWrapper<ScamReport> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ScamReport::getId, id);
        
        return scamReportMapper.selectOne(queryWrapper);
    }

    @Override
    public List<ScamReport> getPopularScamTypes(Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10; // 默认返回前10条
        }
        
        // 使用LambdaQueryWrapper获取热门诈骗类型
        LambdaQueryWrapper<ScamReport> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(ScamReport::getNumberOfReports)
                   .orderByDesc(ScamReport::getStartOfMonth)
                   .last("LIMIT " + limit);
        
        return scamReportMapper.selectList(queryWrapper);
    }
}
