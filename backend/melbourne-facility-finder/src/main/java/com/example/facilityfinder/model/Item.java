
package com.example.facilityfinder.model;

import java.util.List;


public class Item {

    private Long id;
    private String name;
    private String type; // 具体类别（如"community center"）
    private String itemType; // 总类型："facility"或"event"
    private String description;
    private String address;
    private String phone;
    private List<String> ethnicTags; 
    private Coordinates coordinates; 
    private String startDate; 
    private String endDate;   
    private String image;

    public Item(Long id, String name, String type, String itemType, String description,
                String address, String phone, List<String> ethnicTags, Coordinates coordinates,
                String startDate, String endDate, String image) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.itemType = itemType;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.ethnicTags = ethnicTags;
        this.coordinates = coordinates;
        this.startDate = startDate;
        this.endDate = endDate;
        this.image = image;
    }

    public Item() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<String> getEthnicTags() { return ethnicTags; }
    public void setEthnicTags(List<String> ethnicTags) { this.ethnicTags = ethnicTags; }
    public Coordinates getCoordinates() { return coordinates; }
    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }


    // ----------------- Coordinates -----------------
    //public static，
    public static class Coordinates {
        private double lat;
        private double lng;

        public Coordinates(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public Coordinates() {}

        // getter 和 setter
        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
    }
}