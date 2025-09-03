package com.example.facilityfinder.model;

import lombok.Data;

// @Data
// public class Facility {
//     private String id;
//     private String name;
//     private String address;
//     private String type;
//     private String description;
//     private double latitude;
//     private double longitude;
//     private String culturalBackground;
//     private String contact;
//     private double distance; // 距离当前用户的距离（公里）
// }

import lombok.Data; 


@Data 
public class Facility {

    private String id; 
    private String name; // "Golden Dragon Restaurant"）
    private String address; // "123 Collins Street, Melbourne VIC 3000"）
    private String type; //  "restaurant"、"supermarket"）
    
 
    private String description; 
    
 
    private double latitude; 
    private double longitude; 

    private String culturalBackground; //  "Chinese,Asian"，

    private String contact; //  "03 9123 4567
    

    private double distance; 

    private String image = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/24/a2/0b/golden-dragon-restaurant.jpg?w=900&h=500&s=1"; // URL
    


    public Facility(String id, String name, String address, String type, String description,
                   double latitude, double longitude, String culturalBackground,
                   String contact, double distance, String image) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.type = type;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.culturalBackground = culturalBackground;
        this.contact = contact;
        this.distance = distance;

        this.image = (image != null && !image.isEmpty()) ? image : getDefaultImage();
    }
    

    public Facility() {
        this.image = getDefaultImage();
    }
    
    
    private String getDefaultImage() {

        return "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/24/a2/0b/golden-dragon-restaurant.jpg?w=900&h=500&s=1";
    }

}
