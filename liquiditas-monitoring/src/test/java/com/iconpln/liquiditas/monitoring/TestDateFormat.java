package com.iconpln.liquiditas.monitoring;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class TestDateFormat {
    public static void main(String[] args) throws ParseException {
        String str = "200000,90";
        BigDecimal bigDecimal = new BigDecimal(str.replace(",","."));
        System.out.println(bigDecimal);
    }
}
