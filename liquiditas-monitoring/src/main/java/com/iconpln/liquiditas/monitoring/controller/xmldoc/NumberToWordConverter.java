package com.iconpln.liquiditas.monitoring.controller.xmldoc;

import org.apache.chemistry.opencmis.commons.impl.json.JSONObject;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParseException;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParser;
import spark.utils.IOUtils;

import java.io.IOException;
import java.io.InputStream;

public class NumberToWordConverter {
    static String[] huruf={"","SATU ","DUA ","TIGA ","EMPAT ","LIMA ","ENAM ","TUJUH ","DELAPAN ","SEMBILAN ","SEPULUH ","SEBELAS "};

    public String toCurrency(String currency) throws IOException, JSONParseException {
        String curr = "IDR";
        if (currency.equals("IDR")){
            curr = " RUPIAH";
        }else{
            JSONParser jsonParser = new JSONParser();
            ClassLoader classLoader = NumberToWordConverter.class.getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream("files/master-currency/common-currency.json");
            assert inputStream != null;
            String res = IOUtils.toString(inputStream);
            JSONObject obj = (JSONObject) jsonParser.parse(res);

            if (obj.get(currency) != null){
                JSONObject obj2 = (JSONObject) jsonParser.parse(obj.get(currency).toString());
                curr = (String) obj2.get("name");
            }
        }
        return curr.toUpperCase();
    }

    public String toWords(Double angka){
        if(angka < 12)
            return huruf[angka.intValue()];
        if(angka >=12 && angka <= 19)
            return huruf[angka.intValue() % 10] + "BELAS ";
        if(angka >= 20 && angka <= 99)
            return toWords(angka / 10) + "PULUH " + huruf[angka.intValue() % 10];
        if(angka >= 100 && angka <= 199)
            return "SERATUS " + toWords(angka % 100);
        if(angka >= 200 && angka <= 999)
            return toWords(angka / 100) + "RATUS " + toWords(angka % 100);
        if(angka >= 1000 && angka <= 1999)
            return "SERIBU " + toWords(angka % 1000);
        if(angka >= 2000 && angka <= 999999)
            return toWords(angka / 1000) + "RIBU " + toWords(angka % 1000);
        if(angka >= 1000000 && angka <= 999999999)
            return toWords(angka / 1000000) + "JUTA " + toWords(angka % 1000000);
        if(angka >= 1000000000 && angka <= 999999999999L)
            return toWords(angka / 1000000000) + "MILIAR " + toWords(angka % 1000000000);
        if(angka >= 1000000000000L && angka <= 999999999999999L)
            return toWords(angka / 1000000000000L) + "TRILIUN " + toWords(angka % 1000000000000L);
        if(angka >= 1000000000000000L && angka <= 999999999999999999L)
            return toWords(angka / 1000000000000000L) + "QUADRILIUN " + toWords(angka % 1000000000000000L);
        return "";
    }

//    public static void main(String[] args) throws IOException, JSONParseException {
//        String n = "12400098098.10";
////        String d = String.valueOf(1000.5);
//        String[] arr = n.split("\\.");
//        System.out.println(arr.length);
//        String koma = "";
//        if (arr.length > 1){
//            koma = "TITIK ";
//            koma = koma + toWords(Double.parseDouble(arr[1]));
////            System.out.println(koma);
//        }
////        System.out.println(arr[1]);
//        System.out.println(toWords(Double.parseDouble(n))+koma+toCurrency("EUR"));
//    }
}
