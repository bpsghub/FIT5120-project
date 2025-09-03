package com.example.facilityfinder.service;

import com.example.facilityfinder.model.*;
import org.springframework.stereotype.Repository;
import com.example.facilityfinder.config.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor; 
/**
 * 基于API接口的短语数据访问实现（不使用数据库）
 */
@Repository
@RequiredArgsConstructor 
public class PhraseRepository {

    // 注入CSV读取工具和分类映射（从配置类注入）
    private final CsvReaderUtil csvReaderUtil;
    private final Map<String, String> keyToCategoryMap;

    // 内存缓存：key -> 该key的多语言翻译（langCode -> text）
    // 例如："hello" -> {"en":"Hello", "zh":"你好", "vi":"Xin chào", "id":"Halo"}
    private Map<String, Map<String, String>> phraseCache;

    /**
     * 应用启动时初始化：读取CSV并加载到内存缓存
     * @PostConstruct：Spring容器初始化后自动执行
     */
    @PostConstruct
    public void initCsvDataSource() {
        // 1. 读取CSV文件数据
        List<CsvTranslation> csvData = csvReaderUtil.readCsvData();
   

        // 2. 按key分组，构建多语言翻译的内存缓存
        phraseCache = csvData.stream()
                .collect(Collectors.groupingBy(
                        CsvTranslation::getKey, // 按key分组
                        // 每个key对应的翻译：langCode -> text（去重，若有重复key+langCode则取最后一条）
                        Collectors.toMap(
                                CsvTranslation::getLangCode,
                                CsvTranslation::getText,
                                (oldText, newText) -> newText
                        )
                ));


    }

    /**
     * 获取所有短语（按分类整理）
     */
    public List<Phrase> findAll() {
        // 校验缓存是否初始化
        checkCacheInitialized();

        // 将缓存转换为前端需要的Phrase列表（含分类）
        return phraseCache.entrySet().stream()
                .map(entry -> {
                    String key = entry.getKey();
                    Map<String, String> translations = entry.getValue();
                    // 根据key获取分类，未配置的key归为"other"
                    String category = keyToCategoryMap.getOrDefault(key, "other");
                    return new Phrase(key, category, translations);
                })
                .collect(Collectors.toList());
    }

    /**
     * 按分类获取短语
     * @param category 分类名称（如"greetings"、"emergency"）
     * @return 该分类下的所有短语
     */
    public List<Phrase> findByCategory(String category) {
        // 校验缓存是否初始化
        checkCacheInitialized();

        // 若分类为空，返回所有短语
        if (category == null || category.trim().isEmpty()) {
            return findAll();
        }

        // 筛选指定分类的短语
        return phraseCache.entrySet().stream()
                .filter(entry -> {
                    String key = entry.getKey();
                    // 匹配分类（忽略大小写，如"Greetings"和"greetings"视为同一分类）
                    String phraseCategory = keyToCategoryMap.getOrDefault(key, "other");
                    return phraseCategory.equalsIgnoreCase(category);
                })
                .map(entry -> new Phrase(
                        entry.getKey(),
                        category.toLowerCase(), // 统一返回小写分类
                        entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 按key获取单个短语的多语言翻译
     * @param key 短语标识（如"hello"）
     */
    public Phrase findByKey(String key) {
        checkCacheInitialized();
        if (key == null || !phraseCache.containsKey(key)) {
            return null; // 未找到返回null
        }
        Map<String, String> translations = phraseCache.get(key);
        String category = keyToCategoryMap.getOrDefault(key, "other");
        return new Phrase(key, category, translations);
    }

    /**
     * 校验缓存是否已初始化（避免未加载完成就被调用）
     */
    private void checkCacheInitialized() {
        if (phraseCache == null || phraseCache.isEmpty()) {
            throw new IllegalStateException("CSV数据源未初始化，请检查CSV文件是否存在或格式是否正确");
        }
    }
}


