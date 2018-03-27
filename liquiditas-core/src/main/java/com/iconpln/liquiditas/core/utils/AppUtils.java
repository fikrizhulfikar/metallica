package com.iconpln.liquiditas.core.utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;

/**
 * Created by f.putra on 8/25/17.
 */
public class AppUtils {

    private static class AppHolder {

        private static final AppUtils INSTANCE = new AppUtils();
    }

    public static AppUtils getInstance() {
        return AppHolder.INSTANCE;
    }

    public static Logger getLogger(Object o) {
        return LoggerFactory.getLogger(o.getClass());
    }

    public static String getDateByFormat(String format){
        DateFormat dateFormat = new SimpleDateFormat(format);
        Date date = new Date();
        return dateFormat.format(date);
    }

    public static String getDateByFormat(String format, int val){
        DateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(yesterdayDate(val));
    }

    public static String getDateByPlus(int plusDay){
        Date dt = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(dt);
        c.add(Calendar.DATE, plusDay);
        return c.get(Calendar.DAY_OF_MONTH) +"/"+ (c.get(Calendar.MONTH) + 1) +"/"+ c.get(Calendar.YEAR);
    }

    private static Date yesterdayDate(int val) {
        final Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, val);
        return cal.getTime();
    }

    public static String removeString(String value, HashSet<String> character){
        for (String chr : character) {
            String tmp = value.replace(chr,"");
            value = tmp;
        }
        return value;
    }

    public static String formatDecimal(float number) {
        float epsilon = 0.004f; // 4 tenths of a cent
        if (Math.abs(Math.round(number) - number) < epsilon) {
            return String.format("%10.0f", number); // sdb
        } else {
            return String.format("%10.2f", number); // dj_segfault
        }
    }

    public static String getDateTillSecondTrim(){
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        Date date = new Date();
        return dateFormat.format(date);
    }
}
