package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.PlacementLclService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_operator/placement_lcl")
public class PlacementLclController {

    @Autowired
    PlacementLclService placementLclService;

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

    @GetMapping(path = "/test")
    public Map test(){
        return placementLclService.test();
    }
}
