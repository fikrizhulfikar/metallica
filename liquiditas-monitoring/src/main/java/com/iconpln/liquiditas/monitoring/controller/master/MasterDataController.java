package com.iconpln.liquiditas.monitoring.controller.master;

import com.iconpln.liquiditas.core.domain.Bank;
import com.iconpln.liquiditas.core.domain.BankDetail;
import com.iconpln.liquiditas.core.service.MasterService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_master")
public class MasterDataController {

    @Autowired
    MasterService masterService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/bank/get_data_bank", method = RequestMethod.GET)
    public List<Map<String,Object>> listBank(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pJenisBank", defaultValue = "") String pJenisBank,
            @RequestParam(value = "pForm", defaultValue = "") String pForm
    ) {

        try{
            return masterService.getListBank(pJenis,pJenisBank,pForm);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/bank/ins_bank_valas", method = RequestMethod.POST)
    public Map<String,Object> insBankValas(@RequestBody Bank bank) {

        AppUtils.getLogger(this).info("param : {}",bank.toString());
        try{
            String pSessionid = WebUtils.getUsernameLogin()+ AppUtils.getDateTillSecondTrim();
            Map<String,Object> resTmp = new HashedMap();
            for (BankDetail b : bank.getBankDetails()){
                if(b.getpNamaBank() == null){
                    resTmp = masterService.insBankValasTmp(null,null,null,null,pSessionid);
                    break;
                }else{
                    resTmp = masterService.insBankValasTmp(b.getpKdBank(),b.getpNamaBank(),b.getpJenis(),b.getpFLag(),pSessionid);
                }
            }
            AppUtils.getLogger(this).info("res tmp return : {}",resTmp.get("return") == "1");
            AppUtils.getLogger(this).info("res tmp return : {}",resTmp.get("return").equals(1));
            AppUtils.getLogger(this).info("res tmp return : {}",resTmp.get("return").equals("1"));
            AppUtils.getLogger(this).info("res tmp : {}",resTmp);
            String sts = resTmp.get("return").toString();
            if(sts.equals("1")){
                Map<String,Object> res = masterService.insBankValas(bank.getpKdBank(),bank.getpNamaBank(),bank.getpJenis(),bank.getpFLag(),pSessionid);
                AppUtils.getLogger(this).info("res : {}",res);
                return res;
            }else{
                return null;
            }
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/bank/get_bank_valas_pss", method = RequestMethod.GET)
    public Map bankValasPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getBankValasPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/bank/get_bank_valas_byid", method = RequestMethod.GET)
    public Map<String, Object> getBankValasById(
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ) {
        AppUtils.getLogger(this).info("kode bank: {}", pKodeBank);
        AppUtils.getLogger(this).info("pJenis: {}", pJenis);
        try {
            return masterService.getBankValasById(pKodeBank,pJenis);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }



    @RequestMapping(value = "/bank/ins_bank", method = RequestMethod.GET)
    public Map<String,Object> insBank(
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pNamaBank", defaultValue = "") String pNamaBank,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insBank(pKodeBank,pNamaBank,pJenis,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/bank/get_bank_pss", method = RequestMethod.GET)
    public Map bankPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getBankPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/bank/get_bank_byid", method = RequestMethod.GET)
    public List getBankById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id bank: {}", pid);
        try {
            return masterService.getBankById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/curr/get_data_curr", method = RequestMethod.GET)
    public List<Map<String,Object>> listCurrency(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pForm", defaultValue = "") String pForm
    ) {

        try{
            return masterService.getListCurrency(pJenis,pForm);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }


    @RequestMapping(value = "/curr/ins_curr", method = RequestMethod.GET)
    public Map<String,Object> insCurr(
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insCurr(pCurr,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/curr/get_curr_pss", method = RequestMethod.GET)
    public Map CurrPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getCurrPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/curr/get_curr_byid", method = RequestMethod.GET)
    public List getCurrById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id curr: {}", pid);
        try {
            return masterService.getCurrById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    @RequestMapping(value = "/vendor/get_data_vendor", method = RequestMethod.GET)
    public List<Map<String,Object>> listVendor(@RequestParam(value = "pJenis", defaultValue = "") String pJenis) {

        try{
            return masterService.getListVendor(pJenis);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/vendor/ins_vendor", method = RequestMethod.GET)
    public Map<String,Object> insVendor(
            @RequestParam(value = "pIdVendor", defaultValue = "") String pIdVendor,
            @RequestParam(value = "pNamaVendor", defaultValue = "") String pNamaVendor,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "") String pJenisPembayaran,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insVendor(pIdVendor,pNamaVendor,pJenisPembayaran,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/vendor/get_vendor_pss", method = RequestMethod.GET)
    public Map vendorPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getVendorPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/vendor/get_vendor_byid", method = RequestMethod.GET)
    public List getVendorById(
            @RequestParam(value = "pId", defaultValue = "") String pid,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ) {
        AppUtils.getLogger(this).info("id vendor : {}", pid);
        try {
            return masterService.getVendorById(pid,pJenis);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/jenis_pembayaran/get_data_list_pembayaran", method = RequestMethod.GET)
    public List<Map<String,Object>> listJenisPembayaran(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ) {

        try{
            return masterService.getListJenisPembayaran(pJenis, WebUtils.getUsernameLogin());
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }



    @RequestMapping(value = "/jenis_pembayaran/ins_jenis_pembayaran", method = RequestMethod.GET)
    public Map<String,Object> insJenisPembayaran(
            @RequestParam(value = "pIdJenisPembayaran", defaultValue = "") String pIdJenisPembayaran,
            @RequestParam(value = "pNamaJenisPembayaran", defaultValue = "") String pNamaJenisPembayaran,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pGroup", defaultValue = "") String pGroup,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {
        AppUtils.getLogger(this).info("pGroup : {}",pGroup);
        try{
            return masterService.insJenisPembayaran(pIdJenisPembayaran,pNamaJenisPembayaran,pFlag,pGroup,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/jenis_pembayaran/get_jenis_pembayaran_pss", method = RequestMethod.GET)
    public Map jenisPembayaranPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getJenisPembayaranPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/jenis_pembayaran/get_jenis_pembayaran_byid", method = RequestMethod.GET)
    public Map<String, Object> getPembayarById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id jenis pembayran : {}", pid);
        try {
            return masterService.getJenisPembayaranById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/unit/get_data_list_unit_penerima", method = RequestMethod.GET)
    public List<Map<String,Object>> listUnitPenerima(@RequestParam(value = "pJenis", defaultValue = "") String pJenis) {

        try{
            return masterService.getListUnitPenerima(pJenis);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }


    @RequestMapping(value = "/unit/ins_unit", method = RequestMethod.GET)
    public Map<String,Object> insUnit(
            @RequestParam(value = "pIdUnit", defaultValue = "") String pIdUnit,
            @RequestParam(value = "pNamaUnit", defaultValue = "") String pNamaUnit,
            @RequestParam(value = "pIdJenisPembayaran", defaultValue = "") String pIdJenisPembayaran,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insUnit(pIdUnit,pNamaUnit,pIdJenisPembayaran,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/unit/get_unit_pss", method = RequestMethod.GET)
    public Map unitPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getUnitPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/unit/get_unit_byid", method = RequestMethod.GET)
    public List getUnitById(
            @RequestParam(value = "pId", defaultValue = "") String pid,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ) {
        AppUtils.getLogger(this).info("id unit : {}", pid);
        try {
            return masterService.getUnitById(pid, pJenis);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    @RequestMapping(value = "/tenor/get_data_list_tenor", method = RequestMethod.GET)
    public List<Map<String,Object>> listUnitTenor(@RequestParam(value = "pJenis", defaultValue = "") String pJenis) {

        try{
            return masterService.getListTenor(pJenis);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }


    @RequestMapping(value = "/tenor/ins_tenor", method = RequestMethod.GET)
    public Map<String,Object> insTenor(
            @RequestParam(value = "pIdTenor", defaultValue = "") String pIdTenor,
            @RequestParam(value = "pNamaTenor", defaultValue = "") String pNamaTenor,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insTenor(pIdTenor,pNamaTenor,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/tenor/get_tenor_pss", method = RequestMethod.GET)
    public Map tenorPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getTenorPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/tenor/get_tenor_byid", method = RequestMethod.GET)
    public List getTenorById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id tenor : {}", pid);
        try {
            return masterService.getTenorById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/sumber_dana/ins_sumber_dana", method = RequestMethod.GET)
    public Map<String,Object> insSumberDana(
            @RequestParam(value = "pIdSumberDana", defaultValue = "") String pIdSumberDana,
            @RequestParam(value = "pNama", defaultValue = "") String pNama,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {

        try{
            return masterService.insSumberDana(pIdSumberDana,pNama,pFlag,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }


    @RequestMapping(value = "/sumber_dana/get_data_list_sumber_dana", method = RequestMethod.GET)
    public List<Map<String,Object>> listSumberDana() {

        try{
            return masterService.getListSumberDana();
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }


    @RequestMapping(value = "/sumber_dana/get_sumber_dana_pss", method = RequestMethod.GET)
    public Map sumberDanaPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getSumberDanaPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/sumber_dana/get_sumber_dana_byid", method = RequestMethod.GET)
    public List getSbById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id sumber dana : {}", pid);
        try {
            return masterService.getSumberDanaById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/keterangan/get_data_list_keterangan", method = RequestMethod.GET)
    public List<Map<String,Object>> listUnitKet(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pForm", defaultValue = "") String pForm
    ) {

        try{
            return masterService.getListKeterangan(pJenis,pForm);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/keterangan/ins_ket", method = RequestMethod.GET)
    public Map<String,Object> insKeterangan(
            @RequestParam(value = "pIdKeterangan", defaultValue = "") String pIdKeterangan,
            @RequestParam(value = "pNama", defaultValue = "") String pNama,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag,
            @RequestParam(value = "pIsUpdate", defaultValue = "") String pIsUpdate
    ) {
        AppUtils.getLogger(this).info("pJenis Keterangan ctrl: {}",pJenis);

        try{
            return masterService.insKeterangan(pIdKeterangan,pNama,pFlag,pJenis,pIsUpdate);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/keterangan/get_ket_pss", method = RequestMethod.GET)
    public Map ketPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getKeteranganPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/keterangan/get_ket_byid", method = RequestMethod.GET)
    public List getKetById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id ket : {}", pid);
        try {
            return masterService.getKetById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    @RequestMapping(value = "/peruntukan_dana/get_data_list_peruntukan_dana", method = RequestMethod.GET)
    public List<Map<String,Object>> listPeuntukanDana() {
        try{
            return masterService.getListPeruntukanDana();
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/kurs/get_data_list_kurs_jidor", method = RequestMethod.GET)
    public List<Map<String,Object>> listKursJidor() {
        try{
            return masterService.getListKursJidor();
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }



    @RequestMapping(value = "/user/ins_user", method = RequestMethod.GET)
    public Map<String,Object> inUser(
            @RequestParam(value = "pUsername", defaultValue = "") String pUsername,
            @RequestParam(value = "pPassword", defaultValue = "") String pPassword,
            @RequestParam(value = "pIdGroup", defaultValue = "") String pIdGroup,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag
    ) {

        try{
            return masterService.insUser(pUsername,passwordEncoder.encode(pPassword),pIdGroup,pFlag);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/user/get_user_pss", method = RequestMethod.GET)
    public Map userPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "order[0][column]", defaultValue = "") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = masterService.getUserPss(((start / length) + 1), length, sortIndex, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/user/get_user_byid", method = RequestMethod.GET)
    public List getUserById(
            @RequestParam(value = "pId", defaultValue = "") String pid
    ) {
        AppUtils.getLogger(this).info("id user : {}", pid);
        try {
            return masterService.getUserById(pid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/user/get_role", method = RequestMethod.GET)
    public List getRole(
            @RequestParam(value = "pParent", defaultValue = "") String pParent,
            @RequestParam(value = "pisMaster", defaultValue = "0") String pIsMaster
    ) {
        try {
            return masterService.getRole(pParent, pIsMaster);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/upload_file", method = RequestMethod.POST)
    public Map uploadFile(@RequestParam String jenisFile, @RequestParam MultipartFile uploadFile){
        Map map = new HashMap();
        String file_upload = null;
        if (uploadFile != null) {
            try {
                byte[] bytes = uploadFile.getBytes();

                // Creating the directory to store file
                String rootPath = System.getProperty("catalina.base");
                File dir = new File(rootPath + File.separator + "upload_file");
                if (!dir.exists())
                    dir.mkdirs();
                // Create the file on server
                File serverFile = new File(dir.getAbsolutePath()+ File.separator + uploadFile.getOriginalFilename());
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                stream.write(bytes);
                stream.close();
                file_upload = uploadFile.getOriginalFilename().toString();
                map.put("RC","00");
                map.put("TIPE",jenisFile);
                map.put("PESAN","DATA SUCCESS DI UPLOAD");

            } catch (Exception e2) {
                e2.printStackTrace();
                System.out.println("ERRROR");
                map.put("RC","01");
                map.put("TIPE",jenisFile);
                map.put("PESAN","DATA GAGAL UPLOAD");
            }
        } else if (uploadFile == null) {
            file_upload = "";
        }
        return map;
    }

    @RequestMapping(value = "downloadFile", method = RequestMethod.GET)
    public StreamingResponseBody getSteamingFile(HttpServletResponse response,String  namafile) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\""+namafile+"\"");
        System.out.println("NAMA FILE :"+namafile);
        try{
            String rootPath = System.getProperty("catalina.home");
            InputStream inputStream = new FileInputStream(new File(rootPath + File.separator + "upload_file/" + namafile));
            return outputStream -> {
                int nRead;
                byte[] data = new byte[1024];
                while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                    System.out.println("Writing some bytes..");
                    outputStream.write(data, 0, nRead);
                }
            };
        } catch (Exception e){
            return null;
        }
    }
}
