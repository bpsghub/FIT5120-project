package com.example.facilityfinder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
public class CategoryConfig {

    /**
     * Category：greetings(问候)、emergency(紧急)、shopping(购物)、hobby(爱好)、body(身体部位)
     */
    @Bean
    public Map<String, String> keyToCategoryMap() {
        Map<String, String> map = new HashMap<>();

        // 1. greetings
        map.put("hello", "greetings");
        map.put("good_morning", "greetings");
        map.put("good_afternoon", "greetings");
        map.put("good_evening", "greetings");
        map.put("how_are_you", "greetings");
        map.put("i’m_fine,_thank_you", "greetings");
        map.put("what’s_your_name", "greetings");
        map.put("my_name_is_", "greetings");
        map.put("nice_to_meet_you", "greetings");
        map.put("where_are_you_from", "greetings");
        map.put("i’m_from_china", "greetings");
        map.put("please", "greetings");
        map.put("thank_you", "greetings");
        map.put("you’re_welcome", "greetings");
        map.put("excuse_me", "greetings");
        map.put("sorry", "greetings");
        map.put("yes", "greetings");
        map.put("no", "greetings");
        map.put("do_you_speak_english", "greetings");
        map.put("a_little", "greetings");
        map.put("can_you_help_me", "greetings");
        map.put("where_is_the_toilet", "greetings");
        map.put("i_don’t_understand", "greetings");
        map.put("please_speak_slowly", "greetings");
        map.put("goodbye", "greetings");

        // 2. emergency
        map.put("i_need_a_doctor", "emergency");
        map.put("i_feel_sick", "emergency");
        map.put("i_have_a_headache", "emergency");
        map.put("i_have_a_fever", "emergency");
        map.put("i_have_chest_pain", "emergency");
        map.put("i_feel_dizzy", "emergency");
        map.put("i_have_diabetes", "emergency");
        map.put("i_need_medicine", "emergency");
        map.put("call_an_ambulance", "emergency");
        map.put("where_is_the_hospital", "emergency");
        map.put("help", "emergency");
        map.put("call_the_police", "emergency");
        map.put("i_lost_my_wallet", "emergency");
        map.put("i_lost_my_phone", "emergency");
        map.put("my_bag_was_stolen", "emergency");
        map.put("where_is_the_police_station", "emergency");
        map.put("i_don’t_feel_safe", "emergency");
        map.put("please_write_it_down", "emergency");
        map.put("i_need_a_translator", "emergency");
        map.put("can_you_call_my_family", "emergency");

        // 3. shopping
        map.put("how_much_is_this", "shopping");
        map.put("it’s_too_expensive", "shopping");
        map.put("can_you_give_me_a_discount", "shopping");
        map.put("i_want_this_one", "shopping");
        map.put("do_you_have_another_size", "shopping");
        map.put("small", "shopping");
        map.put("medium", "shopping");
        map.put("large", "shopping");
        map.put("cash", "shopping");
        map.put("credit_card", "shopping");
        map.put("receipt", "shopping");
        map.put("bag", "shopping");
        map.put("where_is_the_supermarket", "shopping");
        map.put("bread", "shopping");
        map.put("rice", "shopping");
        map.put("milk", "shopping");
        map.put("water", "shopping");
        map.put("vegetables", "shopping");
        map.put("fruit", "shopping");
        map.put("meat", "shopping");
        map.put("fish", "shopping");
        map.put("egg", "shopping");
        map.put("salt", "shopping");
        map.put("sugar", "shopping");
        map.put("toilet_paper", "shopping");

        // 4. hobby
        map.put("yoga", "hobby");
        map.put("tai_chi", "hobby");
        map.put("table_tennis", "hobby");
        map.put("badminton", "hobby");
        map.put("walking", "hobby");
        map.put("dancing", "hobby");
        map.put("singing", "hobby");
        map.put("playing_chess", "hobby");
        map.put("reading", "hobby");
        map.put("watching_tv", "hobby");
        map.put("gardening", "hobby");
        map.put("cooking", "hobby");
        map.put("shopping", "hobby");
        map.put("exercise", "hobby");
        map.put("swimming", "hobby");
        map.put("playing_cards", "hobby");
        map.put("listening_to_music", "hobby");
        map.put("painting", "hobby");
        map.put("drinking_tea", "hobby");
        map.put("visiting_friends", "hobby");

        // 5. body
        map.put("head", "body");
        map.put("eye", "body");
        map.put("ear", "body");
        map.put("nose", "body");
        map.put("mouth", "body");
        map.put("stomach", "body");
        map.put("back", "body");
        map.put("arm", "body");
        map.put("leg", "body");
        map.put("foot", "body");

        return map;
    }
}
