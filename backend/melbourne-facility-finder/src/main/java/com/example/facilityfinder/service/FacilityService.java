package com.example.facilityfinder.service;

import com.example.facilityfinder.dto.FacilityDTO;

import java.util.List;
import java.util.Map;

public interface FacilityService {
    List<FacilityDTO> getNearbyFacilities(double latitude, double longitude, int page, int limit);
    
    FacilityDTO getFacilityDetail(String id);
    
    List<FacilityDTO> searchFacilities(Map<String, String> queryParams);
}
