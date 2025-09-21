package com.example.facilityfinder.service;

import com.example.facilityfinder.dto.FacilityDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

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
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchNearby")
                .build()
                .toUri();

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> locationRestriction = new HashMap<>();
        Map<String, Object> circle = new HashMap<>();
        Map<String, Double> center = new HashMap<>();
        center.put("latitude", latitude);
        center.put("longitude", longitude);
        circle.put("center", center);
        circle.put("radius", 5000.0);
        locationRestriction.put("circle", circle);
        requestBody.put("locationRestriction", locationRestriction);

        requestBody.put("maxResultCount", limit);

        org.springframework.http.HttpHeaders headers = buildHeaders();

        org.springframework.http.HttpEntity<Map<String, Object>> request =
                new org.springframework.http.HttpEntity<>(requestBody, headers);

        try {
            org.springframework.http.ResponseEntity<JsonNode> responseEntity =
                    restTemplate.postForEntity(uri, request, JsonNode.class);

            JsonNode response = responseEntity.getBody();
            return extractFacilitiesFromResponse(response, Map.of(
                    "latitude", String.valueOf(latitude),
                    "longitude", String.valueOf(longitude)
            ));

        } catch (Exception e) {
            throw new RuntimeException("设施查询失败", e);
        }
    }

    @Override
    public FacilityDTO getFacilityDetail(String id) {
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places/" + id)
                .queryParam("fields", "*")
                .queryParam("key", googlePlacesApiKey)
                .build()
                .toUri();

        JsonNode place = restTemplate.getForObject(uri, JsonNode.class);

        return mapToFacilityDTO(place);
    }

    @Override
    public List<FacilityDTO> searchFacilities(Map<String, String> queryParams) {
        try {
            int maxResults = queryParams.containsKey("limit") ?
                    Integer.parseInt(queryParams.get("limit")) : 20;

            org.springframework.http.HttpHeaders headers = buildHeaders();

            // ✅ Handle category-specific searches using text query + locationRestriction
            String category = queryParams.get("category");
            if (category != null && !category.isBlank()) {
                String textQuery;
                switch (category.toLowerCase()) {
                    case "supermarket":
                        textQuery = "supermarket near Melbourne"; break;
                    case "clinic":
                        textQuery = "clinic near Melbourne"; break;
                    case "chinese_restaurant":
                        textQuery = "chinese restaurant near Melbourne"; break;
                    case "vietnamese_restaurant":
                        textQuery = "vietnamese restaurant near Melbourne"; break;
                    case "indonesian_restaurant":
                        textQuery = "indonesian restaurant near Melbourne"; break;
                    case "shopping_mall":
                        textQuery = "shopping mall near Melbourne"; break;
                    default:
                        textQuery = category;
                }
                return searchByLanguage2(textQuery, maxResults, headers, queryParams);
            }

            // ✅ 默认走 searchNearby
            URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchNearby")
                    .build()
                    .toUri();

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> locationRestriction = new HashMap<>();
            Map<String, Object> circle = new HashMap<>();
            Map<String, Double> center = new HashMap<>();
            center.put("latitude", Double.parseDouble(queryParams.get("latitude")));
            center.put("longitude", Double.parseDouble(queryParams.get("longitude")));

            double distanceInKm = queryParams.containsKey("distance") ?
                    Double.parseDouble(queryParams.get("distance")) : 5.0;
            double radiusInMeters = distanceInKm * 1000;

            circle.put("center", center);
            circle.put("radius", radiusInMeters);
            locationRestriction.put("circle", circle);
            requestBody.put("locationRestriction", locationRestriction);
            requestBody.put("maxResultCount", maxResults);

            org.springframework.http.HttpEntity<Map<String, Object>> request =
                    new org.springframework.http.HttpEntity<>(requestBody, headers);

            org.springframework.http.ResponseEntity<JsonNode> responseEntity =
                    restTemplate.postForEntity(uri, request, JsonNode.class);

            JsonNode response = responseEntity.getBody();
            return extractFacilitiesFromResponse(response, queryParams);

        } catch (Exception e) {
            throw new RuntimeException("设施搜索失败", e);
        }
    }


    // 新的搜索方法，使用用户的实际位置
    private List<FacilityDTO> searchByLanguage2(String restaurantType, int maxResults,
                                                           org.springframework.http.HttpHeaders headers,
                                                           Map<String, String> queryParams) {
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchText")
                .build()
                .toUri();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("textQuery", restaurantType);  // 不再硬编码位置
        requestBody.put("maxResultCount", maxResults);

        // 添加位置偏置，使用用户的实际坐标（Text Search 使用 locationBias）
        if (queryParams.containsKey("latitude") && queryParams.containsKey("longitude")) {
            double latitude = Double.parseDouble(queryParams.get("latitude"));
            double longitude = Double.parseDouble(queryParams.get("longitude"));
            double distanceInKm = queryParams.containsKey("distance") ?
                    Double.parseDouble(queryParams.get("distance")) : 5.0;
            double radiusInMeters = distanceInKm * 1000;

            Map<String, Object> circle = new HashMap<>();
            Map<String, Double> center = new HashMap<>();
            center.put("latitude", latitude);
            center.put("longitude", longitude);
            circle.put("center", center);
            circle.put("radius", radiusInMeters);
            Map<String, Object> locationBias = new HashMap<>();
            locationBias.put("circle", circle);
            requestBody.put("locationBias", locationBias);
        }

        org.springframework.http.HttpEntity<Map<String, Object>> request =
                new org.springframework.http.HttpEntity<>(requestBody, headers);

        org.springframework.http.ResponseEntity<JsonNode> responseEntity =
                restTemplate.postForEntity(uri, request, JsonNode.class);

        JsonNode response = responseEntity.getBody();
        return extractFacilitiesFromResponse(response, queryParams);
    }


    // ✅ 公共的提取方法
    private List<FacilityDTO> extractFacilitiesFromResponse(JsonNode response, Map<String, String> queryParams) {
        List<FacilityDTO> facilities = new ArrayList<>();
        if (response != null && response.has("places")) {
            for (JsonNode place : response.get("places")) {
                FacilityDTO dto = mapToFacilityDTO(place);

                if (place.has("location") &&
                        queryParams.containsKey("latitude") &&
                        queryParams.containsKey("longitude")) {
                    double userLat = Double.parseDouble(queryParams.get("latitude"));
                    double userLng = Double.parseDouble(queryParams.get("longitude"));
                    dto.setDistance(calculateDistance(
                            userLat, userLng,
                            place.get("location").get("latitude").asDouble(),
                            place.get("location").get("longitude").asDouble()
                    ));
                   //
                    Map<String,Double> location = new HashMap<>();
                     location.put("latitude",place.get("location").get("latitude").asDouble());
                     location.put("longitude",place.get("location").get("longitude").asDouble());
                    dto.setLocation(location);
                }

                facilities.add(dto);
            }
        }
        return applyClientSideFilters(facilities, queryParams);
    }

    private List<FacilityDTO> applyClientSideFilters(List<FacilityDTO> facilities, Map<String, String> queryParams) {
        return facilities.stream()
                .filter(facility -> {
                    if (queryParams.containsKey("minRating")) {
                        try {
                            double minRating = Double.parseDouble(queryParams.get("minRating"));
                            if (minRating > 0 && (facility.getRating() == null || facility.getRating() < minRating)) {
                                return false;
                            }
                        } catch (NumberFormatException ignored) {}
                    }

                    if (queryParams.containsKey("openNow") && "true".equals(queryParams.get("openNow"))) {
                        if (!"OPERATIONAL".equals(facility.getBusinessStatus())) {
                            return false;
                        }
                    }

                    // ✅ Category filtering on types if still using nearby
                    String category = queryParams.get("category");
                    if (category != null && !category.isBlank()) {
                        List<String> types = facility.getTypes();
                        if (types == null) return false;
                        switch (category.toLowerCase()) {
                            case "supermarket":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("supermarket") || t.equalsIgnoreCase("grocery_store"));
                            case "clinic":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("clinic") || t.equalsIgnoreCase("doctor") || t.equalsIgnoreCase("medical_clinic"));
                            case "chinese_restaurant":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("chinese_restaurant") || t.equalsIgnoreCase("restaurant") || t.equalsIgnoreCase("asian_restaurant"));
                            case "vietnamese_restaurant":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("vietnamese_restaurant") || t.equalsIgnoreCase("restaurant") || t.equalsIgnoreCase("asian_restaurant"));
                            case "indonesian_restaurant":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("indonesian_restaurant") || t.equalsIgnoreCase("restaurant") || t.equalsIgnoreCase("asian_restaurant"));
                            case "shopping_mall":
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase("shopping_mall"));
                            default:
                                return types.stream().anyMatch(t -> t.equalsIgnoreCase(category));
                        }
                    }

                    return true;
                })
                .toList();
    }

    private FacilityDTO mapToFacilityDTO(JsonNode place) {
        if (place == null) return null;

        FacilityDTO dto = new FacilityDTO();

        if (place.has("id")) dto.setId(place.get("id").asText());

        if (place.has("displayName") && place.get("displayName").has("text")) {
            dto.setName(place.get("displayName").get("text").asText());
        } else if (place.has("name")) {
            dto.setName(place.get("name").asText());
        }

        if (place.has("types")) {
            List<String> types = new ArrayList<>();
            place.get("types").forEach(type -> types.add(type.asText()));
            dto.setTypes(types);
        }

        if (place.has("businessStatus")) {
            dto.setBusinessStatus(place.get("businessStatus").asText());
        }

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

        if (place.has("nationalPhoneNumber")) {
            dto.setNationalPhoneNumber(place.get("nationalPhoneNumber").asText());
        }
        if (place.has("websiteUri")) {
            dto.setWebsiteUri(place.get("websiteUri").asText());
        }
        if (place.has("googleMapsUri")) {
            dto.setGoogleMapsUri(place.get("googleMapsUri").asText());
        }

        if (place.has("rating")) {
            dto.setRating(place.get("rating").asDouble());
        }
        if (place.has("userRatingCount")) {
            dto.setUserRatingCount(place.get("userRatingCount").asInt());
        }

        if (place.has("regularOpeningHours")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> openingHours = objectMapper.convertValue(
                    place.get("regularOpeningHours"), Map.class);
            dto.setRegularOpeningHours(openingHours);
        }

        // ⭐ 处理 Google Places Photos
        if (place.has("photos") && place.get("photos").isArray() && place.get("photos").size() > 0) {
            JsonNode photo = place.get("photos").get(0); // 取第一张
            if (photo.has("name")) {
                String photoName = photo.get("name").asText(); // e.g. "places/ChIJ.../photos/AbCdEf123"
                String photoUrl = String.format(
                        "https://places.googleapis.com/v1/%s/media?maxHeightPx=800&key=%s",
                        photoName,
                        googlePlacesApiKey
                );
                dto.setImageUrl(photoUrl);
            }
        }

        return dto;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private List<FacilityDTO> searchByLanguage(String textQuery, int maxResults,
                                              org.springframework.http.HttpHeaders headers,
                                              Map<String, String> queryParams) {
        URI uri = UriComponentsBuilder.fromUriString(googlePlacesBaseUrl + "/places:searchText")
                .build()
                .toUri();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("textQuery", textQuery);
        requestBody.put("maxResultCount", maxResults);

        org.springframework.http.HttpEntity<Map<String, Object>> request =
                new org.springframework.http.HttpEntity<>(requestBody, headers);

        org.springframework.http.ResponseEntity<JsonNode> responseEntity =
                restTemplate.postForEntity(uri, request, JsonNode.class);

        JsonNode response = responseEntity.getBody();
        return extractFacilitiesFromResponse(response, queryParams);
    }

    private org.springframework.http.HttpHeaders buildHeaders() {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("X-Goog-Api-Key", googlePlacesApiKey);
        headers.set("X-Goog-FieldMask",
                "places.id,places.name,places.displayName,places.types,places.businessStatus," +
                        "places.formattedAddress,places.location,places.rating,places.userRatingCount," +
                        "places.regularOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri," +
                        "places.photos"); // ⭐ 加上 photos
        return headers;
    }
}
