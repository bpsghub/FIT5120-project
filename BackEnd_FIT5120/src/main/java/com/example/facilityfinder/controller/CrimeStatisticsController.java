package com.example.facilityfinder.controller;

import com.example.facilityfinder.dto.CrimeStatisticsDTO;
import com.example.facilityfinder.service.CrimeStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Crime Statistics Controller
 * 犯罪统计控制器122
 * 
 * @author FIT5120 Team
 * @since 2024-12-26
 */
@RestController
@RequestMapping("/crime-statistics")
@CrossOrigin(origins = "*")
public class CrimeStatisticsController {

    @Autowired
    private CrimeStatisticsService crimeStatisticsService;

    /**
     * Get crime statistics grouped by LGA for all years
     * 获取按LGA分组的所有年份犯罪统计数据
     * 
     * @return ResponseEntity with crime statistics data
     */
    @GetMapping("/by-lga")
    public ResponseEntity<Map<String, Object>> getCrimeStatisticsByLGA() {
        try {
            List<CrimeStatisticsDTO> data = crimeStatisticsService.getCrimeStatisticsByLGA();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crime statistics retrieved successfully");
            response.put("data", data);
            response.put("total", data.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve crime statistics: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get crime statistics grouped by LGA for a specific year
     * 获取指定年份按LGA分组的犯罪统计数据
     * 
     * @param year 年份
     * @return ResponseEntity with crime statistics data
     */
    @GetMapping("/by-lga/{year}")
    public ResponseEntity<Map<String, Object>> getCrimeStatisticsByLGAAndYear(@PathVariable Integer year) {
        try {
            List<CrimeStatisticsDTO> data = crimeStatisticsService.getCrimeStatisticsByLGAAndYear(year);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crime statistics for year " + year + " retrieved successfully");
            response.put("data", data);
            response.put("total", data.size());
            response.put("year", year);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid parameter: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve crime statistics: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get crime statistics grouped by LGA for a specific police region
     * 获取指定警区按LGA分组的犯罪统计数据
     * 
     * @param policeRegion 警区名称
     * @return ResponseEntity with crime statistics data
     */
    @GetMapping("/by-police-region/{policeRegion}")
    public ResponseEntity<Map<String, Object>> getCrimeStatisticsByPoliceRegion(@PathVariable String policeRegion) {
        try {
            List<CrimeStatisticsDTO> data = crimeStatisticsService.getCrimeStatisticsByPoliceRegion(policeRegion);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crime statistics for police region '" + policeRegion + "' retrieved successfully");
            response.put("data", data);
            response.put("total", data.size());
            response.put("policeRegion", policeRegion);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid parameter: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve crime statistics: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get crime statistics with filters and pagination
     * 获取带筛选条件和分页的犯罪统计数据
     * 
     * @param page 页码 (默认: 1)
     * @param size 每页大小 (默认: 10)
     * @param year 年份 (可选)
     * @param policeRegion 警区 (可选)
     * @param lga LGA名称 (可选)
     * @return ResponseEntity with filtered crime statistics data
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> getCrimeStatisticsWithFilters(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String policeRegion,
            @RequestParam(required = false) String lga
    ) {
        try {
            List<CrimeStatisticsDTO> data = crimeStatisticsService.getCrimeStatisticsWithFilters(
                    page, size, year, policeRegion, lga
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Filtered crime statistics retrieved successfully");
            response.put("data", data);
            response.put("total", data.size());
            response.put("page", page);
            response.put("size", size);
            
            // 添加筛选条件到响应中
            Map<String, Object> filters = new HashMap<>();
            if (year != null) filters.put("year", year);
            if (policeRegion != null) filters.put("policeRegion", policeRegion);
            if (lga != null) filters.put("lga", lga);
            response.put("filters", filters);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve filtered crime statistics: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get crime statistics grouped by LGA with year information
     * 获取包含年份信息的按LGA分组犯罪统计数据
     * 
     * @return ResponseEntity with crime statistics data including years
     */
    @GetMapping("/by-lga-with-year")
    public ResponseEntity<Map<String, Object>> getCrimeStatisticsByLGAWithYear() {
        try {
            List<CrimeStatisticsDTO> data = crimeStatisticsService.getCrimeStatisticsByLGAWithYear();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crime statistics with year information retrieved successfully");
            response.put("data", data);
            response.put("total", data.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve crime statistics with year: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get available years in the database
     * 获取数据库中可用的年份列表
     * 
     * @return ResponseEntity with available years
     */
    @GetMapping("/available-years")
    public ResponseEntity<Map<String, Object>> getAvailableYears() {
        try {
            List<Integer> years = crimeStatisticsService.getAvailableYears();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Available years retrieved successfully");
            response.put("data", years);
            response.put("total", years.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve available years: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get available police regions
     * 获取可用的警区列表
     * 
     * @return ResponseEntity with available police regions
     */
    @GetMapping("/available-police-regions")
    public ResponseEntity<Map<String, Object>> getAvailablePoliceRegions() {
        try {
            List<String> policeRegions = crimeStatisticsService.getAvailablePoliceRegions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Available police regions retrieved successfully");
            response.put("data", policeRegions);
            response.put("total", policeRegions.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve available police regions: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
