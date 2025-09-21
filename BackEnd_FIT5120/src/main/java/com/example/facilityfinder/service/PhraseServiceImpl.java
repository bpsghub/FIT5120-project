package com.example.facilityfinder.service;

import com.example.facilityfinder.model.Phrase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhraseServiceImpl implements PhraseService {
    
    private final PhraseRepository phraseRepository;
    
    @Override
    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();
    }
    
    @Override
    public List<Phrase> getPhrasesByCategory(String category) {
        return phraseRepository.findByCategory(category);
    }
}
