package com.example.facilityfinder.controller;

import com.example.facilityfinder.dto.FacilityDTO;
import com.example.facilityfinder.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
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
        
        List<FacilityDTO> facilities = facilityService.getNearbyFacilities(latitude, longitude, page, limit);
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityDTO> getFacilityDetail(@PathVariable String id) {
        FacilityDTO facility = facilityService.getFacilityDetail(id);
        return ResponseEntity.ok(facility);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FacilityDTO>> searchFacilities(
            @RequestParam Map<String, String> queryParams) {
        
        List<FacilityDTO> facilities = facilityService.searchFacilities(queryParams);
        return ResponseEntity.ok(facilities);
    }
}

