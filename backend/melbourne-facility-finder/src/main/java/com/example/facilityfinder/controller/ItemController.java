package com.example.facilityfinder.controller;

import com.example.facilityfinder.model.Item;
import com.example.facilityfinder.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }


    @GetMapping("/AllItem")
    public ResponseEntity<List<Item>> getAllItems(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(itemService.getAllItems(lat, lng));
    }

 
    @GetMapping("/filter")
    public ResponseEntity<List<Item>> getFilteredItems(
            @RequestParam(required = false) String itemType,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String ethnicTag,
            @RequestParam double lat,
            @RequestParam double lng) {
        
        return ResponseEntity.ok(itemService.filterItems(
                itemType, type, ethnicTag, lat, lng));
    }

    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Double>> geocode(
            @RequestParam String address) {
        return ResponseEntity.ok(itemService.geocodeAddress(address));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemDetails(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }
}
