package com.example.facilityfinder.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class FacilityApiResponse {
    @JsonProperty("records")
    private List<Record> records;
    
    @Data
    public static class Record {
        @JsonProperty("fields")
        private Fields fields;
        
        @JsonProperty("recordid")
        private String recordId;
    }
    
    @Data
    public static class Fields {
        @JsonProperty("id")
        private String id;
        
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("address")
        private String address;
        
        @JsonProperty("category")
        private String category;
        
        @JsonProperty("description")
        private String description;
        
        @JsonProperty("latitude")
        private double latitude;
        
        @JsonProperty("longitude")
        private double longitude;
        
        @JsonProperty("contact")
        private String contact;
    }
}
