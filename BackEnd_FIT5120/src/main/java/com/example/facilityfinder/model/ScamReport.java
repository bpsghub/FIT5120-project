package com.example.facilityfinder.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

/**
 * 诈骗报告实体类
 */
@Data
@TableName("scam_reports")
public class ScamReport {

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("StartOfMonth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startOfMonth;

    @TableField("Address_State")
    private String addressState;

    @TableField("Scam___Contact_Mode")
    private String scamContactMode;

    @TableField("Complainant_Age")
    private String complainantAge;

    @TableField("Complainant_Gender")
    private String complainantGender;

    @TableField("Category_Level_2")
    private String categoryLevel2;

    @TableField("Category_Level_3")
    private String categoryLevel3;

    @TableField("Amount_lost")
    private String amountLost;

    @TableField("Number_of_reports")
    private Integer numberOfReports;
}
