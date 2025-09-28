package com.example.facilityfinder.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.facilityfinder.model.ScamReport;
import org.apache.ibatis.annotations.Mapper;

/**
 * 诈骗报告Mapper接口
 */
@Mapper
public interface ScamReportMapper extends BaseMapper<ScamReport> {
    // 使用LambdaQueryWrapper，无需自定义SQL方法
}
