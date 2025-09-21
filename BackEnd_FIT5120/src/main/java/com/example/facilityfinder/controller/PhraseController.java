package com.example.facilityfinder.controller;

import com.example.facilityfinder.model.Phrase;
import com.example.facilityfinder.service.PhraseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/phrases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class PhraseController {

    private final PhraseService phraseService;

    @GetMapping
    public ResponseEntity<List<Phrase>> getPhrases(
            @RequestParam(required = false) String category) {
        List<Phrase> phrases = phraseService.getPhrasesByCategory(category);
        return new ResponseEntity<>(phrases, HttpStatus.OK);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<Phrase> getPhraseById(@PathVariable Long id) {
    //     Phrase phrase = phraseService.getPhraseById(id);
    //     if (phrase != null) {
    //         return new ResponseEntity<>(phrase, HttpStatus.OK);
    //     } else {
    //         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    //     }
    // }
}

