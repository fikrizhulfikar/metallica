package com.iconpln.liquiditas.core;

import spark.utils.IOUtils;

import java.io.InputStream;

public class ReadFIleTest {
    public static void main(String[] args) {
        ClassLoader classLoader = ReadFIleTest.class.getClassLoader();
        try {
            InputStream inputStream = classLoader.getResourceAsStream("files/JSONApInvoice.json");
            String result = IOUtils.toString(inputStream);
            System.out.println(result);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
