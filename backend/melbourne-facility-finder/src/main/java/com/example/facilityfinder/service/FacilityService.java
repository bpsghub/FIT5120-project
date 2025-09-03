package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Facility;
import com.example.facilityfinder.model.FacilityApiResponse;
import com.example.facilityfinder.model.FacilityResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    private final WebClient webClient;
    private static final String MELBOURNE_API_URL = 
        "https://data.melbourne.vic.gov.au/api/records/1.0/search/";

    public FacilityService(WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * 获取所有设施
     */
    public Mono<FacilityResponse> getAllFacilities(int page, int size) {
        String url = MELBOURNE_API_URL + "?dataset=landmarks-and-places-of-interest-including-schools-theatres-health-services-spor&rows=100&format=json";
        
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(FacilityApiResponse.class)
                .map(this::convertToFacilityResponse)
                .map(response -> applyPagination(response, page, size));
    }

    /**
     * 根据位置获取附近设施
     */
    public Mono<List<Facility>> getNearbyFacilities(double lat, double lng, double radius) {
        return getAllFacilities(1, 100)
                .map(response -> response.getFacilities().stream()
                        .filter(facility -> {
                            double distance = calculateDistance(lat, lng, facility.getLatitude(), facility.getLongitude());
                            facility.setDistance(distance);
                            return distance <= radius;
                        })
                        .sorted((f1, f2) -> Double.compare(f1.getDistance(), f2.getDistance()))
                        .collect(Collectors.toList()));
    }

    /**
     * 根据类别筛选设施
     */
    public Mono<List<Facility>> filterByCategory(String category) {
        return getAllFacilities(1, 100)
                .map(response -> response.getFacilities().stream()
                        .filter(facility -> facility.getType() != null && 
                                facility.getType().toLowerCase().contains(category.toLowerCase()))
                        .collect(Collectors.toList()));
    }

    /**
     * 转换API响应为自定义模型
     */
    private FacilityResponse convertToFacilityResponse(FacilityApiResponse apiResponse) {
        FacilityResponse response = new FacilityResponse();
        
        if (apiResponse.getRecords() == null) {
            response.setFacilities(List.of());
            response.setTotal(0);
            return response;
        }
        
        List<Facility> facilities = apiResponse.getRecords().stream()
                .map(record -> {
                    Facility facility = new Facility();
                    if (record.getFields() == null) return null;
                    
                    facility.setId(record.getRecordId());
                    facility.setName(record.getFields().getName());
                    facility.setAddress(record.getFields().getAddress());
                    facility.setType(record.getFields().getCategory());
                    facility.setDescription(record.getFields().getDescription());
                    facility.setLatitude(record.getFields().getLatitude());
                    facility.setLongitude(record.getFields().getLongitude());
                    facility.setContact(record.getFields().getContact());
                    
                    // 模拟文化背景数据
                    facility.setCulturalBackground(determineCulturalBackground(facility.getName()));
                    
                    return facility;
                })
                .filter(facility -> facility != null)
                .collect(Collectors.toList());
        
        response.setFacilities(facilities);
        response.setTotal(facilities.size());
        return response;
    }

    /**
     * 应用分页
     */
    private FacilityResponse applyPagination(FacilityResponse response, int page, int size) {
        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, response.getFacilities().size());
        
        List<Facility> paginated = response.getFacilities().subList(
                Math.max(0, startIndex), 
                Math.max(startIndex, endIndex)
        );
        
        response.setFacilities(paginated);
        response.setPage(page);
        response.setSize(size);
        return response;
    }

    /**
     * 计算两点之间的距离（公里）
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 地球半径（公里）
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    /**
     * 简单模拟确定文化背景
     */
    private String determineCulturalBackground(String name) {
        if (name == null) return "Unknown";
        
        name = name.toLowerCase();
        
        if (name.contains("chinese") || name.contains("china")) {
            return "Chinese";
        } else if (name.contains("italian") || name.contains("italy")) {
            return "Italian";
        } else if (name.contains("greek") || name.contains("greece")) {
            return "Greek";
        } else if (name.contains("vietnamese") || name.contains("vietnam")) {
            return "Vietnamese";
        } else if (name.contains("indian") || name.contains("india")) {
            return "Indian";
        } else {
            return "Australian";
        }
    }
}
