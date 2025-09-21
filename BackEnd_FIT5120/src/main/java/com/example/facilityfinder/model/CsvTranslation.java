package com.example.facilityfinder.model;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class CsvTranslation {
    @CsvBindByName(column = "translation_id") 
    private Long translationId;

    @CsvBindByName(column = "key") 
    private String key;

    @CsvBindByName(column = "lang_code") 
    private String langCode;

    @CsvBindByName(column = "text") 
    private String text;
}