package com.example.facilityfinder.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FacilityDTO {
    private String id;
    private String name;
    private String displayName;
    private String languageCode;
    private String primaryType;
    private List<String> types;
    private String businessStatus;

    // 地址与位置信息
    private String formattedAddress;
    private List<Map<String, Object>> addressComponents;
    private Map<String, String> plusCode;
    private Map<String, Double> location;
    private Map<String, Map<String, Double>> viewport;
    private String adrFormatAddress;

    // 联系方式
    private String nationalPhoneNumber;
    private String internationalPhoneNumber;
    private String websiteUri;
    private String googleMapsUri;

    // 用户评价与评分
    private Double rating;
    private Integer userRatingCount;

    // 营业时间
    private Map<String, Object> regularOpeningHours;
    private Map<String, Object> currentOpeningHours;
    private List<Map<String, Object>> currentSecondaryOpeningHours;

    // 服务属性
    private Boolean takeout;
    private Boolean delivery;
    private Boolean dineIn;
    private Boolean curbsidePickup;
    private Boolean reservable;
    private Boolean servesLunch;
    private Boolean servesDinner;
    private Boolean servesBrunch;
    private Boolean servesBeer;
    private Boolean servesWine;

    // UI辅助
    private String iconMaskBaseUri;
    private String iconBackgroundColor;
    private Integer utcOffsetMinutes;

    // 距离信息（计算得出）
    private Double distance;

    // ⭐ 新增：图片 URL
    private String imageUrl;
}
