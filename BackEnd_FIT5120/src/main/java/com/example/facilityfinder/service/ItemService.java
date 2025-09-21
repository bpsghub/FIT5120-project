package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Item;
import java.util.List;
import java.util.Map;

public interface ItemService {
    // 获取所有设施/事件
    List<Item> getAllItems(double lat, double lng);
    
    // 筛选设施/事件
    List<Item> filterItems(String itemType, String type, String ethnicTag, double lat, double lng);
    
    // 地址转坐标（地理编码）
    Map<String, Double> geocodeAddress(String address);
    
    // 根据ID获取详情
    Item getItemById(Long id);
}