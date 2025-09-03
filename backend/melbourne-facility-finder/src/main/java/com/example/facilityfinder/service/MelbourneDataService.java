package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Item;
import com.example.facilityfinder.model.Item.Coordinates;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MelbourneDataService {
    private static final Logger logger = LoggerFactory.getLogger(MelbourneDataService.class);
    
    private static final String MELBOURNE_DATA_API = "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/records?limit=20";
    
    private final RestTemplate restTemplate;

    public MelbourneDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public List<Item> fetchFacilitiesFromOpenData() {
        List<Item> facilities = new ArrayList<>();
        
        try {
            Map<String, Object> apiResponse = restTemplate.getForObject(MELBOURNE_DATA_API, Map.class);
            if (apiResponse == null) {
                logger.warn("API返回空响应");
                return facilities;
            }
            

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) apiResponse.get("results");
            if (dataList == null || dataList.isEmpty()) {
                logger.warn("API返回的设施列表为空");
                return facilities;
            }
            

            for (int i = 0; i < dataList.size(); i++) {
                Map<String, Object> data = dataList.get(i);
                Item item = new Item();
                

                item.setId((long) (i + 1)); 
                item.setName((String) data.get("feature_name")); 
                item.setType((String) data.get("sub_theme")); 
                item.setItemType((String) data.get("theme")); 
                item.setDescription(buildDescription(data)); 
                item.setAddress(getAddressFromData(data)); 
                item.setImage("https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/24/a2/0b/golden-dragon-restaurant.jpg?w=900&h=500&s=1");
                Map<String, Object> coordinatesMap = (Map<String, Object>) data.get("co_ordinates");
                if (coordinatesMap != null) {
                    Double lat = parseDouble(coordinatesMap.get("lat")); 
                    Double lng = parseDouble(coordinatesMap.get("lon"));   
                    if (lat != null && lng != null) {
                        item.setCoordinates(new Coordinates(lat, lng));
                    }
                }
                
                item.setEthnicTags(inferEthnicTags(item.getItemType(), item.getType()));
                
                facilities.add(item);
            }
            
            logger.info("成功从API获取 {} 个设施数据", facilities.size());
            
        } catch (Exception e) {
            logger.error("获取墨尔本开放数据失败", e);
        }
        
        return facilities;
    }


    private String buildDescription(Map<String, Object> data) {
        String theme = (String) data.get("主题");
        String subTheme = (String) data.get("sub_theme");
        if (theme != null && subTheme != null) {
            return theme + " - " + subTheme;
        }
        return theme != null ? theme : subTheme;
    }


    private String getAddressFromData(Map<String, Object> data) {

        return "No detailed address available"; 
    }

    /**
     * 根据主主题和子主题推断文化标签（优化原逻辑，适配中文分类）
     */
    private List<String> inferEthnicTags(String mainTheme, String subTheme) {
        List<String> tags = new ArrayList<>();
        if (mainTheme == null) return tags;

        // 根据中文主题推断标签
        switch (mainTheme) {
            case "教育中心":
                tags.add("Educational");
                break;
            case "休闲/康乐":
                tags.add("Australian");
                tags.add("Multicultural");
                break;
            case "集会地点":
                tags.add("Cultural");
                break;
            case "健康服务":
                tags.add("Healthcare");
                break;
            default:
                tags.add("General");
        }

        // 补充子主题标签（例如"美术馆/博物馆"增加"Cultural"）
        if (subTheme != null && subTheme.contains("美术馆") || subTheme.contains("博物馆")) {
            tags.add("Cultural");
        }

        return tags;
    }

    private Double parseDouble(Object value) {
        if (value == null) return null;
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            logger.warn("转换Double失败：{}", value);
            return null;
        }
    }
}