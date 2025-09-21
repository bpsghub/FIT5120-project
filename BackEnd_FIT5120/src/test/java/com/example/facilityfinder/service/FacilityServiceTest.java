package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Facility;
import com.example.facilityfinder.model.FacilityResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.test.StepVerifier;
import java.util.List;

@SpringBootTest
public class FacilityServiceTest {

    @Autowired
    private FacilityService facilityService;

    @Test
    public void testGetAllFacilities() {
        StepVerifier.create(facilityService.getAllFacilities(1, 10))
                .expectNextMatches(response -> {
                    System.out.println("获取到的设施数量: " + response.getTotal());
                    return response.getTotal() > 0;
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testGetNearbyFacilities() {
        // 墨尔本市中心坐标
        double lat = -37.8136;
        double lng = 144.9631;
        double radius = 5; // 5公里
        
        StepVerifier.create(facilityService.getNearbyFacilities(lat, lng, radius))
                .expectNextMatches(facilities -> {
                    System.out.println("在" + radius + "公里范围内找到的设施数量: " + facilities.size());
                    return facilities.size() > 0;
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testFilterByCategory() {
        String category = "school";
        
        StepVerifier.create(facilityService.filterByCategory(category))
                .expectNextMatches(facilities -> {
                    System.out.println("类别为'" + category + "'的设施数量: " + facilities.size());
                    return facilities.size() > 0;
                })
                .expectComplete()
                .verify();
    }
}
