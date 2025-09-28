package com.example.facilityfinder.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.facilityfinder.model.ScamReport;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 诈骗报告服务接口
 */
public interface ScamReportService {

    /**
     * 分页查询诈骗报告（带条件筛选）
     * @param page 当前页
     * @param size 每页大小
     * @param state 州/地址
     * @param contactMode 联系方式
     * @param age 年龄段
     * @param gender 性别
     * @param categoryLevel2 二级分类
     * @param categoryLevel3 三级分类
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 分页结果
     */
    IPage<ScamReport> getScamReportsWithConditions(
            Integer page, Integer size,
            String state, String contactMode, String age, String gender,
            String categoryLevel2, String categoryLevel3,
            LocalDate startDate, LocalDate endDate
    );

    /**
     * 获取筛选条件的可选值
     * @return 筛选条件Map
     */
    Map<String, List<String>> getFilterOptions();

    /**
     * 获取统计数据
     * @return 统计数据Map
     */
    Map<String, Object> getStatistics();

    /**
     * 根据ID获取诈骗报告详情
     * @param id 报告ID
     * @return 诈骗报告
     */
    ScamReport getScamReportById(Integer id);

    /**
     * 获取热门诈骗类型（按报告数量排序）
     * @param limit 限制数量
     * @return 热门诈骗类型列表
     */
    List<ScamReport> getPopularScamTypes(Integer limit);
}
