package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Item;
import com.example.facilityfinder.service.ItemService;
import com.example.facilityfinder.service.MelbourneDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService {
    private static final Logger logger = LoggerFactory.getLogger(ItemServiceImpl.class);
    private final List<Item> facilities;
    
    // 注入墨尔本数据服务
    public ItemServiceImpl(MelbourneDataService melbourneDataService) {
        // 从开放数据加载设施列表
        this.facilities = melbourneDataService.fetchFacilitiesFromOpenData();
    }

    @Override
    public List<Item> getAllItems(double lat, double lng) {
        return facilities;
    }

    @Override
    public List<Item> filterItems(String itemType, String type, String ethnicTag, double lat, double lng) {
        return facilities.stream()
                .filter(item -> (itemType == null || item.getItemType().equals(itemType)))
                .filter(item -> (type == null || item.getType().toLowerCase().contains(type.toLowerCase())))
                .filter(item -> (ethnicTag == null || item.getEthnicTags().stream()
                        .anyMatch(tag -> tag.toLowerCase().contains(ethnicTag.toLowerCase()))))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Double> geocodeAddress(String address) {
        // 简单实现：可替换为更精确的地理编码服务
        Map<String, Double> coords = new HashMap<>();
        if (address.contains("melbourne")) {
            coords.put("lat", -37.8136); // 墨尔本CBD纬度
            coords.put("lng", 144.9631); // 墨尔本CBD经度
        } else {
            // 对于其他地址，返回默认坐标或调用第三方地理编码API
            coords.put("lat", -37.8136);
            coords.put("lng", 144.9631);
        }
        return coords;
    }

    @Override
    public Item getItemById(Long id) {
        return facilities.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
    