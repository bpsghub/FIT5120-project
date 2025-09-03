package com.example.facilityfinder.config;

import com.example.facilityfinder.model.CsvTranslation;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;


@Component
@Slf4j
public class CsvReaderUtil {

    // CSVfile src/main/resources
    private static final String CSV_FILE_PATH = "epic 2 data.csv";


    public List<CsvTranslation> readCsvData() {
        try {

            Resource resource = new ClassPathResource(CSV_FILE_PATH);
            Reader reader = new InputStreamReader(resource.getInputStream(), "UTF-8");


            return new CsvToBeanBuilder<CsvTranslation>(reader)
                    .withType(CsvTranslation.class) 
                    .withIgnoreLeadingWhiteSpace(true) 
                    .build()
                    .parse();
        } catch (Exception e) {
            log.error("CSV File Read Failed！Path：{}，errMsg：{}", CSV_FILE_PATH, e.getMessage(), e);
            throw new RuntimeException("init CSV dataSource failed", e);
        }
    }
}
