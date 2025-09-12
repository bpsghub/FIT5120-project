package com.example.facilityfinder.service;

import com.example.facilityfinder.dto.FacilityDTO;
import com.example.facilityfinder.service.FacilityService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FacilityServiceImpl implements FacilityService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String googlePlacesApiKey;
    private final String googlePlacesBaseUrl;

    public FacilityServiceImpl(
            RestTemplate restTemplate,
            ObjectMapper objectMapper,
            @Value("${google.places.api.key}") String apiKey,
            @Value("${google.places.api.base-url:https://places.googleapis.com/v1}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.googlePlacesApiKey = apiKey;
        this.googlePlacesBaseUrl = baseUrl;
    }

    @Override
    public List<FacilityDTO> getNearbyFacilities(double latitude, double longitude, int page, int limit) {
        // 构建搜索附近地点的API URL
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchNearby")
                .queryParam("key", googlePlacesApiKey)
                .build()
                .toUri();

        // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Double> location = new HashMap<>();
        location.put("latitude", latitude);
        location.put("longitude", longitude);
        requestBody.put("location", location);
        requestBody.put("radius", 5000); // 5公里范围，可根据前端距离参数调整
        requestBody.put("pageSize", limit);
        requestBody.put("pageToken", page > 1 ? generatePageToken(page, limit) : null);
        
        // 请求字段 - 只请求需要的字段以提高性能
        String fields = "id,name,displayName,types,businessStatus,formattedAddress," +
                        "location,rating,userRatingCount,regularOpeningHours," +
                        "nationalPhoneNumber,websiteUri,googleMapsUri";
        requestBody.put("fields", fields);

        // 调用Google Places API
        JsonNode response = restTemplate.postForObject(uri, requestBody, JsonNode.class);
        
        // 解析响应并转换为DTO列表
        List<FacilityDTO> facilities = new ArrayList<>();
        if (response != null && response.has("places")) {
            for (JsonNode place : response.get("places")) {
                FacilityDTO dto = mapToFacilityDTO(place);
                // 计算距离（公里）
                dto.setDistance(calculateDistance(
                        latitude, longitude,
                        place.get("location").get("latitude").asDouble(),
                        place.get("location").get("longitude").asDouble()
                ));
                facilities.add(dto);
            }
        }
        
        return facilities;
    }

    @Override
    public FacilityDTO getFacilityDetail(String id) {
        // 构建获取地点详情的API URL
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places/" + id)
                .queryParam("fields", "*") // 获取所有字段
                .queryParam("key", googlePlacesApiKey)
                .build()
                .toUri();

        // 调用Google Places API
        JsonNode place = restTemplate.getForObject(uri, JsonNode.class);
        
        // 转换为DTO
        return mapToFacilityDTO(place);
    }

    @Override
    public List<FacilityDTO> searchFacilities(Map<String, String> queryParams) {
        // 构建搜索地点的API URL
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchText")
                .queryParam("key", googlePlacesApiKey)
                .build()
                .toUri();

        // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("textQuery", queryParams.getOrDefault("query", ""));
        
        // 处理位置筛选
        if (queryParams.containsKey("latitude") && queryParams.containsKey("longitude")) {
            try {
                Map<String, Object> locationRestriction = new HashMap<>();
                Map<String, Double> center = new HashMap<>();
                center.put("latitude", Double.parseDouble(queryParams.get("latitude")));
                center.put("longitude", Double.parseDouble(queryParams.get("longitude")));
                
                // 处理距离筛选
                double radius = queryParams.containsKey("distance") ? 
                        Double.parseDouble(queryParams.get("distance")) * 1000 : 5000; // 转换为米
                
                locationRestriction.put("circle", Map.of("center", center, "radius", radius));
                requestBody.put("locationRestriction", locationRestriction);
            } catch (NumberFormatException e) {
                // 忽略无效的位置参数
            }
        }
        
        // 处理评分筛选
        if (queryParams.containsKey("minRating")) {
            try {
                double minRating = Double.parseDouble(queryParams.get("minRating"));
                requestBody.put("minRating", minRating);
            } catch (NumberFormatException e) {
                // 忽略无效的评分参数
            }
        }
        
        // 处理营业状态筛选
        if (queryParams.containsKey("openNow") && "true".equals(queryParams.get("openNow"))) {
            requestBody.put("openNow", true);
        }
        
        // 设置分页
        try {
            int pageSize = queryParams.containsKey("limit") ? 
                    Integer.parseInt(queryParams.get("limit")) : 20;
            requestBody.put("pageSize", pageSize);
        } catch (NumberFormatException e) {
            requestBody.put("pageSize", 20);
        }
        
        // 请求字段
        String fields = "id,name,displayName,types,businessStatus,formattedAddress," +
                        "location,rating,userRatingCount,regularOpeningHours," +
                        "nationalPhoneNumber,websiteUri,googleMapsUri";
        requestBody.put("fields", fields);

        // 调用Google Places API
        JsonNode response = restTemplate.postForObject(uri, requestBody, JsonNode.class);
        
        // 解析响应并转换为DTO列表
        List<FacilityDTO> facilities = new ArrayList<>();
        if (response != null && response.has("places")) {
            for (JsonNode place : response.get("places")) {
                FacilityDTO dto = mapToFacilityDTO(place);
                
                // 如果有位置参数，计算距离
                if (queryParams.containsKey("latitude") && queryParams.containsKey("longitude")) {
                    try {
                        double userLat = Double.parseDouble(queryParams.get("latitude"));
                        double userLng = Double.parseDouble(queryParams.get("longitude"));
                        dto.setDistance(calculateDistance(
                                userLat, userLng,
                                place.get("location").get("latitude").asDouble(),
                                place.get("location").get("longitude").asDouble()
                        ));
                    } catch (NumberFormatException e) {
                        // 忽略无效的位置参数
                    }
                }
                
                facilities.add(dto);
            }
        }
        
        return facilities;
    }

    /**
     * 将Google Places API响应转换为FacilityDTO
     */
    private FacilityDTO mapToFacilityDTO(JsonNode place) {
        if (place == null) {
            return null;
        }
        
        FacilityDTO dto = new FacilityDTO();
        
        // 基本信息
        if (place.has("id")) dto.setId(place.get("id").asText());
        if (place.has("name")) dto.setName(place.get("name").asText());
        if (place.has("displayName") && place.get("displayName").has("text")) {
            dto.setDisplayName(place.get("displayName").get("text").asText());
        }
        if (place.has("displayName") && place.get("displayName").has("languageCode")) {
            dto.setLanguageCode(place.get("displayName").get("languageCode").asText());
        }
        if (place.has("types")) {
            List<String> types = new ArrayList<>();
            place.get("types").forEach(type -> types.add(type.asText()));
            dto.setTypes(types);
        }
        if (place.has("businessStatus")) {
            dto.setBusinessStatus(place.get("businessStatus").asText());
        }
        
        // 地址与位置
        if (place.has("formattedAddress")) {
            dto.setFormattedAddress(place.get("formattedAddress").asText());
        }
        if (place.has("location")) {
            Map<String, Double> location = new HashMap<>();
            if (place.get("location").has("latitude")) {
                location.put("latitude", place.get("location").get("latitude").asDouble());
            }
            if (place.get("location").has("longitude")) {
                location.put("longitude", place.get("location").get("longitude").asDouble());
            }
            dto.setLocation(location);
        }
        
        // 联系方式
        if (place.has("nationalPhoneNumber")) {
            dto.setNationalPhoneNumber(place.get("nationalPhoneNumber").asText());
        }
        if (place.has("websiteUri")) {
            dto.setWebsiteUri(place.get("websiteUri").asText());
        }
        if (place.has("googleMapsUri")) {
            dto.setGoogleMapsUri(place.get("googleMapsUri").asText());
        }
        
        // 评分
        if (place.has("rating")) {
            dto.setRating(place.get("rating").asDouble());
        }
        if (place.has("userRatingCount")) {
            dto.setUserRatingCount(place.get("userRatingCount").asInt());
        }
        
        // 营业时间
        if (place.has("regularOpeningHours")) {
            // 简化处理，实际项目可能需要更详细的映射
            dto.setRegularOpeningHours(objectMapper.convertValue(
                    place.get("regularOpeningHours"), Map.class));
        }
        
        return dto;
    }

    /**
     * 使用Haversine公式计算两点之间的距离（公里）
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
     * 生成简单的分页令牌（实际项目可能需要更复杂的实现）
     */
    private String generatePageToken(int page, int limit) {
        // 这里只是简单实现，实际中应该使用Google返回的nextPageToken
        return "page-" + page + "-limit-" + limit;
    }
}
