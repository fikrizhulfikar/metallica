package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.service.PlacementLclService;
import com.iconpln.liquiditas.core.xmldoc.DocGenerator;
import com.iconpln.liquiditas.core.xmldoc.NotaPinbukDocGenerator;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.apache.commons.compress.archivers.dump.InvalidFormatException;
import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.json.JsonObject;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api_operator/placement_lcl")
public class PlacementLclController {

    @Autowired
    PlacementLclService placementLclService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping(path = "/placement_lcl_header")
    public Map listPlacementlclHeader(
            @RequestParam(value = "start", defaultValue = "1") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "pTanggal", defaultValue = "ALL") String pTanggal,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = placementLclService.getPlacementlclHeader(start, length, pTanggal, pSearch);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/placement_lcl_detail")
    public Map<String, Object> listPlacementlclDetail(
            @RequestParam(value = "pIdForm", defaultValue = "1") String pIdForm
    ){
        try {
            return placementLclService.getPlacementlclDetail(pIdForm);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/placement_lcl_sepuluh")
    public Map<String, Object> listPlacementlclSepuluh(
            @RequestParam(value = "pIdForm", defaultValue = "1") String pIdForm
    ){
        try {
            return placementLclService.getPlacementlclSepuluh(pIdForm);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/rangkuman")
    public Map<String, Object> listPlacementlclRangkuman(
            @RequestParam(value = "pIdForm", defaultValue = "1") String pIdForm
    ){
        try {
            return placementLclService.getPlacementlclRangkuman(pIdForm);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/lembar_kerja")
    public Map<String, Object> listPlacementlclLembarKerja(
            @RequestParam(value = "pIdForm", defaultValue = "1") String pIdForm
    ){
        try {
            return placementLclService.getPlacementlclLembarKerja(pIdForm);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/nota")
    public Map<String, Object> listPlacementlclNotaDinas(
            @RequestParam(value = "pIdForm", defaultValue = "1") String pIdForm
    ){
        try {
            return placementLclService.getNotaDinas(pIdForm);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/ins_lcl_valas")
    public Map<String, Object> insLclValas(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String uob = jsonObject.getString("uob");
            String bca = jsonObject.getString("bca");
            String bank_dki = jsonObject.getString("bank_dki");
            String danamons = jsonObject.getString("danamon");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclValas(bank, mandiri, bri, bni, bank_dki, bca, uob, danamons, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_receipt")
    public Map<String, Object> insLclReceipt(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            String danamons = jsonObject.getString("danamon");
            String cimb = jsonObject.getString("cimb");
            String uob = jsonObject.getString("uob");
            String maybank = jsonObject.getString("maybank");
            String bank_dki = jsonObject.getString("bank_dki");
            out = placementLclService.insLclReceipt(bank, mandiri, bri, bni, bukopin, danamons, cimb, uob, maybank, bank_dki, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_imprest_ops_pusat")
    public Map<String, Object> insLclImprestOperasiPusat(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclImprestOpsPusat(bank, mandiri, bri, bni, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_imprest_inv_pusat")
    public Map<String, Object> insLclImprestInvestPusat(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclImprestInvPusat(bank, mandiri, bri, bni, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_imprest_pusat")
    public Map<String, Object> insLclImprestPusat(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclImprestPusat(bank, mandiri, bri, bni, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_impor")
    public Map<String, Object> insLclImpor(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclImpor(bank, mandiri, bri, bni, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_scf")
    public Map<String, Object> insLclScf(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            out = placementLclService.insLclScf(bank, mandiri, bri, bni, bukopin, pIdForm);
        }
        return out;
    }

    @PostMapping(path = "/ins_lcl_optimasi_dana")
    public Map<String, Object> insLclOptimasiDana(
            @RequestParam(value = "pData") String pData,
            @RequestParam(value = "pIdForm") String pIdForm
    ) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("bank");
            String mandiri = jsonObject.getString("mandiri");
            String bri = jsonObject.getString("bri");
            String bni = jsonObject.getString("bni");
            String bukopin = jsonObject.getString("bukopin");
            String uob = jsonObject.getString("uob");
            String btn = jsonObject.getString("btn");
            String danamons = jsonObject.getString("danamons");
            out = placementLclService.insLcOptimasiDana(bank, mandiri, bri, bni, bukopin, uob, btn, danamons, pIdForm);
        }
        return out;
    }
//
    @PostMapping(path = "/export_nota")
    public String exportNotaPinbuk(@RequestParam("dataNota") String dataNota){
        Map output = new HashMap();
        List<Map<String, String>> tableRow = new ArrayList<>();
        List<Map<String, List<Map<String, String>>>> sectionList = new ArrayList<>();

        NotaPinbukDocGenerator npdg = new NotaPinbukDocGenerator();
        ZonedDateTime t = ZonedDateTime.now();
        String strDate = DateTimeFormatter.ofPattern("yyyyMMdd").format(t);
        String filename = "uploadcorpay/temp/lcl_nota_pinbuk_"+strDate;
        Map out = new HashMap();
        try {
            JSONObject jsonObject = new JSONObject(dataNota);
            //FileOutputStream out = new FileOutputStream(new File("nota_pinbuk.docx"));
//            Date date = new Date();
//            SimpleDateFormat df = new SimpleDateFormat("dd MMMMM yyyy");
            Iterator<String> keys = jsonObject.keys();
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edocument = dom.createElement("pdx:document");
            edocument.setAttribute("xmlns:pdx","http://www.phpdocx.com/main");

            Element econtent = dom.createElement("pdx:content");
            output.put("header","NOTA PEMINDAH BUKUAN PADA TANGGAL 20 MEI 2021");
            while(keys.hasNext()){
                Map<String, List<Map<String, String>>> section = new HashMap<>();
                String key = keys.next();
                System.out.println("Key : "+key);
                if (jsonObject.get(key) instanceof JSONArray){
                    JSONArray jsonArray = jsonObject.getJSONArray(key);
                    JSONObject o = jsonArray.getJSONObject(0);
                    Map<String, String> upperRow = new HashMap<>();
                    upperRow.put("BANK_SUMBER",o.getString("BANK_SUMBER"));
                    upperRow.put("NAMA_REK", o.getString("NAMA_REKENING"));
                    upperRow.put("NO_REK", o.getString("NO_REK_SUMBER"));
                    List<Map<String, String>> upperTableRow = new ArrayList<>();
                    upperTableRow.add(upperRow);
                    section.put("upper",upperTableRow);
                    if (jsonArray.length() > 0){
                        for (int i = 0; i < jsonArray.length();i++){
                            Map<String, String> row = new HashMap<>();
                            row.put("NAMA_BANK",jsonArray.getJSONObject(i).getString("BANK_ASAL"));
                            row.put("NO_REK",jsonArray.getJSONObject(i).getString("NO_REKENING"));
                            row.put("NOMINAL",jsonArray.getJSONObject(i).getString("NOMINAL"));
                            row.put("NO_SAP",jsonArray.getJSONObject(i).getString("NO_SAP"));
                            row.put("KET",jsonArray.getJSONObject(i).getString("KETERANGAN"));
                            tableRow.add(row);
                        }
                        section.put("lower", tableRow);
                    }
                }
                sectionList.add(section);
                output.put("data",sectionList);
            }
            try {
                npdg.createDocFromTemplate(output);
                out.put("success", true);
            } catch (Exception e){
                e.printStackTrace();
            }
            out.put("createdoc",checkfile(filename + ".docx")) ;
            return null;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    private Map checkfile(String filename) throws AltException {
        File f = new File(filename);
        Map oke = new HashMap();
        if(f.exists()){
            oke.put("status",01);
            oke.put("filename",filename);
            oke.put("info","File Created");
            return oke;
        }
        else{
            throw new AltException("File tidak ditemukan");
        }
    }

    @GetMapping(path = "/test")
    public Map test(){
        return placementLclService.test();
    }
}
