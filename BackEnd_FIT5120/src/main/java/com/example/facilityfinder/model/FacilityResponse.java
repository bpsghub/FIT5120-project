package com.example.facilityfinder.model;

import lombok.Data;
import java.util.List;

@Data
public class FacilityResponse {
    private List<Facility> facilities;
    private int total;
    private int page;
    private int size;
}
