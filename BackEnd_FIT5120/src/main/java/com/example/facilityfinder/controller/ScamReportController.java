package com.example.facilityfinder.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.facilityfinder.model.ScamReport;
import com.example.facilityfinder.service.ScamReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 诈骗报告控制器
 */
@RestController
@RequestMapping("/scam-reports")
@CrossOrigin(origins = "*")
public class ScamReportController {

    @Autowired
    private ScamReportService scamReportService;

    /**
     * 分页查询诈骗报告（带条件筛选）
     * @param page 当前页，默认1
     * @param size 每页大小，默认10
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


    @GetMapping
    public ResponseEntity<Map<String, Object>> getScamReports(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String contactMode,
            @RequestParam(required = false) String age,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String categoryLevel2,
            @RequestParam(required = false) String categoryLevel3,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        try {
            IPage<ScamReport> result = scamReportService.getScamReportsWithConditions(
                    page, size, state, contactMode, age, gender,
                    categoryLevel2, categoryLevel3, startDate, endDate
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", result.getRecords());
            response.put("total", result.getTotal());
            response.put("currentPage", result.getCurrent());
            response.put("pageSize", result.getSize());
            response.put("totalPages", result.getPages());
            response.put("hasNext", result.getCurrent() < result.getPages());
            response.put("hasPrevious", result.getCurrent() > 1);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取诈骗报告失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 获取筛选条件的可选值
     * @return 筛选条件列表
     */
    @GetMapping("/filter-options")
    public ResponseEntity<Map<String, Object>> getFilterOptions() {
        try {
            Map<String, List<String>> filterOptions = scamReportService.getFilterOptions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filterOptions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取筛选选项失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 获取统计数据
     * @return 统计数据
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            Map<String, Object> statistics = scamReportService.getStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取统计数据失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 根据ID获取诈骗报告详情
     * @param id 报告ID
     * @return 诈骗报告详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getScamReportById(@PathVariable Integer id) {
        try {
            ScamReport scamReport = scamReportService.getScamReportById(id);
            
            Map<String, Object> response = new HashMap<>();
            if (scamReport != null) {
                response.put("success", true);
                response.put("data", scamReport);
            } else {
                response.put("success", false);
                response.put("message", "未找到ID为 " + id + " 的诈骗报告");
                return ResponseEntity.status(404).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取诈骗报告详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 获取热门诈骗类型
     * @param limit 限制数量，默认10
     * @return 热门诈骗类型列表
     */
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularScamTypes(
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<ScamReport> popularScams = scamReportService.getPopularScamTypes(limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", popularScams);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取热门诈骗类型失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
