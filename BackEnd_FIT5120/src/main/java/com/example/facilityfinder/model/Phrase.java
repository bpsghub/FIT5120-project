package com.example.facilityfinder.model;

import lombok.Data;

import lombok.AllArgsConstructor;

import java.util.Map;

/**
 */
@Data
@AllArgsConstructor
public class Phrase {
    private String key; // 短语标识（如"hello"）
    private String category; // 分类（如"greetings/emergency/shopping"）
    private Map<String, String> translations; // 多语言翻译（key: langCode, value: text）
}

