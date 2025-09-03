package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Phrase;

import java.util.List;

public interface PhraseService {
    
    // 获取所有短语
    List<Phrase> getAllPhrases();
    
    // 根据分类获取短语
    List<Phrase> getPhrasesByCategory(String category);
}
