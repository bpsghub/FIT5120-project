package com.example.facilityfinder.controller;

import com.example.facilityfinder.model.Facility;
import com.example.facilityfinder.model.FacilityResponse;
import com.example.facilityfinder.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "http://localhost:5566") 
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }


    @GetMapping
    public Mono<ResponseEntity<FacilityResponse>> getAllFacilities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return facilityService.getAllFacilities(page, size)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }


    @GetMapping("/nearby")
    public Mono<ResponseEntity<List<Facility>>> getNearbyFacilities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius) {
        return facilityService.getNearbyFacilities(lat, lng, radius)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }


    @GetMapping("/filter")
    public Mono<ResponseEntity<List<Facility>>> filterByCategory(
            @RequestParam String category) {
        return facilityService.filterByCategory(category)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }
}
