package com.example.facilityfinder.controller;

import com.example.facilityfinder.dto.FacilityDTO;
import com.example.facilityfinder.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    @Autowired
    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<FacilityDTO>> getNearbyFacilities(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        try {
            System.out.println("📍 Controller: 接收到附近设施请求");
            System.out.println("  - 位置: (" + latitude + ", " + longitude + ")");
            System.out.println("  - 分页: page=" + page + ", limit=" + limit);

            if (latitude < -90 || latitude > 90) {
                throw new IllegalArgumentException("纬度必须在-90到90之间");
            }
            if (longitude < -180 || longitude > 180) {
                throw new IllegalArgumentException("经度必须在-180到180之间");
            }
            if (limit <= 0 || limit > 100) {
                throw new IllegalArgumentException("结果数量必须在1到100之间");
            }

            List<FacilityDTO> facilities = facilityService.getNearbyFacilities(latitude, longitude, page, limit);

            System.out.println("✅ Controller: 成功返回 " + facilities.size() + " 个附近设施");
            return ResponseEntity.ok(facilities);

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Controller: 参数验证失败 - " + e.getMessage());
            return ResponseEntity.badRequest().body(List.of());
        } catch (Exception e) {
            System.err.println("❌ Controller: 获取附近设施失败 - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityDTO> getFacilityDetail(@PathVariable String id) {
        FacilityDTO facility = facilityService.getFacilityDetail(id);
        return ResponseEntity.ok(facility);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FacilityDTO>> searchFacilities(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") String distance,
            @RequestParam(defaultValue = "0") String minRating,
            @RequestParam(defaultValue = "false") String openNow,
            @RequestParam(defaultValue = "1") String page,
            @RequestParam(defaultValue = "20") String limit,
            @RequestParam(defaultValue = "") String category
    ) {
        try {
            System.out.println("🔍 Controller: 接收到筛选请求");
            System.out.println("  - 位置: (" + latitude + ", " + longitude + ")");
            System.out.println("  - 距离: " + distance + "km");
            System.out.println("  - 最低评分: " + minRating + "星");
            System.out.println("  - 仅营业中: " + openNow);
            System.out.println("  - 类别: " + (category.isEmpty() ? "任意" : category));
            System.out.println("  - 分页: page=" + page + ", limit=" + limit);

            if (latitude < -90 || latitude > 90) {
                throw new IllegalArgumentException("纬度必须在-90到90之间");
            }
            if (longitude < -180 || longitude > 180) {
                throw new IllegalArgumentException("经度必须在-180到180之间");
            }

            Map<String, String> queryParams = new HashMap<>();
            queryParams.put("latitude", String.valueOf(latitude));
            queryParams.put("longitude", String.valueOf(longitude));
            queryParams.put("distance", distance);
            queryParams.put("minRating", minRating);
            queryParams.put("openNow", openNow);
            queryParams.put("page", page);
            queryParams.put("limit", limit);
            queryParams.put("category", category);

            List<FacilityDTO> facilities = facilityService.searchFacilities(queryParams);

            System.out.println("✅ Controller: 成功返回 " + facilities.size() + " 个设施");
            return ResponseEntity.ok(facilities);

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Controller: 参数验证失败 - " + e.getMessage());
            return ResponseEntity.badRequest().body(List.of());
        } catch (RuntimeException e) {
            System.err.println("❌ Controller: 业务逻辑错误 - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of());
        } catch (Exception e) {
            System.err.println("❌ Controller: 设施搜索失败 - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of());
        }
    }
}
