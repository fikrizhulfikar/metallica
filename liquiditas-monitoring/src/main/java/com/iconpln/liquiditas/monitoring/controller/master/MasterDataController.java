package com.iconpln.liquiditas.monitoring.controller.master;

import com.iconpln.liquiditas.core.domain.Bank;
import com.iconpln.liquiditas.core.domain.BankDetail;
import com.iconpln.liquiditas.core.service.MasterService;
import com.iconpln.liquiditas.core.service.Sap;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.commons.collections.map.HashedMap;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
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
    private ResourceLoader resourceLoader;

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

    @GetMapping(path = "/filter/get_list_filter_bank")
    public List<Map<String, Object>> listFilterBank(){
        try{
            return masterService.getListFilterBank();
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


    @RequestMapping(value = "/metode_bayar/get_list_metode_bayar", method = RequestMethod.GET)
    public List<Map<String,Object>> listMetodeBayar() {

        try{
            return masterService.getListMetodeBayar();
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

//    @RequestMapping(value = "/pos_anggaran/get_pos_anggaran", method = RequestMethod.GET)
//    public List<Map<String,Object>> getPosAnggaran() {
//        try {
//            return masterService.getPosAnggaran();
//        } catch (Exception e) {
//            AppUtils.getLogger(this).debug(e.getMessage());
//            return null;
//        }
//    }

    @RequestMapping(value = "/pos_anggaran/get_pos_anggaran", method = RequestMethod.GET)
    public List<Map<String,Object>> getPosAnggaran(@RequestParam(value = "pTipeTransaksi", defaultValue = "") String pTipeTransaksi) {

        try{
            return masterService.getPosAnggaran(pTipeTransaksi);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/unit_anggaran/get_unit", method = RequestMethod.GET)
    public List<Map<String,Object>> getUnit() {
        try {
            return masterService.getUnit();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/sub_pos_anggaran/get_sub_pos_anggaran", method = RequestMethod.GET)
    public List<Map<String,Object>> getSubPosAnggaran(@RequestParam(value = "pPosAnggaran", defaultValue = "") String pPosAnggaran) {

        try{
            return masterService.getSubPosAnggaran(pPosAnggaran);
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/nilai_anggaran/get_nilai_anggaran", method = RequestMethod.GET)
    public List<Map<String,Object>> getNilaiAnggaran(
            @RequestParam(value = "pSubPosAnggaran", defaultValue = "") String pSubPosAnggaran,
            @RequestParam(value = "pUnitAnggaran", defaultValue = "") String pUnitAnggaran){

        try{
            return masterService.getNilaiAnggaran(pSubPosAnggaran, pUnitAnggaran);
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
            @RequestParam(value = "pEmail", defaultValue = "") String pEmail,
            @RequestParam(value = "pIdGroup", defaultValue = "") String pIdGroup,
            @RequestParam(value = "pFlag", defaultValue = "") String pFlag
    ) {

        try{
            return masterService.insUser(pUsername,passwordEncoder.encode(pPassword), pEmail,pIdGroup,pFlag);
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


    @RequestMapping(value = "/get_id_upload", method = RequestMethod.GET)
    public Map getIdUpload() {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", masterService.getIdUpload());
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upload_xls", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdJenisFile", defaultValue = "") String pIdJenisFile,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        AppUtils.getLogger(this).info("pIdJenisFile: {}", pIdJenisFile);
        return masterService.uploadXls(inputStream, WebUtils.getUsernameLogin(), pIdJenisFile);

//        return generateReport(response,listFailed,"result");
//        return listFailed;
    }

    @RequestMapping(value = "/download/{idJenisFile}/{idUpload}", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @PathVariable String idUpload,
                         @PathVariable String idJenisFile) throws SQLException {
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download "+idJenisFile, idUpload);

        return generateReport(response,masterService.getErrorData(idUpload, idJenisFile), "download", idJenisFile);
    }

    @RequestMapping(value = "/template/{idJenisFile}", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response,
                                   @PathVariable String idJenisFile) throws SQLException {
        return generateReport(response,null, "template", idJenisFile);

    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe, String idJenisFile) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}", errorData);

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            System.out.println("value : "+value);
            String resource;
            System.out.println("resources : tripartite");
            if(idJenisFile.equals("1")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_currency.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_currency.xls";
            }else if(idJenisFile.equals("2")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_bank.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_bank.xls";
            }else if(idJenisFile.equals("3")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_vendor.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_vendor.xls";
            }else if(idJenisFile.equals("4")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_unit.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_unit.xls";
            }else if(idJenisFile.equals("5")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_tenor.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_tenor.xls";
            }else if(idJenisFile.equals("6")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_sumber_dana.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_sumber_dana.xls";
            }else if(idJenisFile.equals("7")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_keterangan.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_keterangan.xls";
            }else if(idJenisFile.equals("8")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_jenis_pembayaran.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_jenis_pembayaran.xls";
            }else {
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_user.xls\"");
                resource = "classpath:/templates/input/"+tipe+"_user.xls";
            }

            if(tipe.equals("download")){
                value.put("listFailed", errorData.get("return"));
            }

//            System.out.println("resources : "+ resource);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/general_bank/get_general_bank", method = RequestMethod.GET)
    public Map listGeneralBank() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListGeneralBank();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/general_bank/get_payment_house_bank", method = RequestMethod.GET)
    public Map listPaymentHouseBank() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListPaymentHouseBank();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/general_bank/invoice_hr_payable", method = RequestMethod.GET)
    public Map listInvoiceHRPayable() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListInvoiceHRPayable();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/general_bank/ap_invoice", method = RequestMethod.GET)
    public Map listInvoiceAPInvoice() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListInvoiceAPInvoice();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/general_bank/payment_invoice", method = RequestMethod.GET)
    public Map listPaymentInvoice() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListPaymentInvoice();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/general_bank/billing_invoice", method = RequestMethod.GET)
    public Map listBillingInvoice() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListBillingInvoice();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/customer/get_list_customer", method = RequestMethod.GET)
    public Map listCustomer() {

        try{
            List<Map<String, Object>> list = new ArrayList<>();
            list = masterService.getListCustomer();

            Map hashMap = new HashMap();
            hashMap.put("data",list);
            return hashMap;
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_ap_invoice", method = RequestMethod.GET)
    public List getApInvoice(
            @RequestParam(value = "in_Pawal", defaultValue = "") String in_Pawal,
            @RequestParam(value = "in_Pakhir", defaultValue = "") String in_Pakhir
    ) {
        try {
            return masterService.getApInvoice(in_Pawal, in_Pakhir);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "user/update_status", method = RequestMethod.POST)
    public Map<String, Object> updateStatus(
            @RequestParam(value = "p_id_group", defaultValue = "") String p_id_group,
            @RequestParam(value = "p_status", defaultValue = "") String p_status
    ) {
        AppUtils.getLogger(this).info("p_id_group update data: {}", p_id_group);
        try {
            Map<String, Object> res = masterService.updateStatus(p_id_group, p_status);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/filter/list_filter_bank")
    public List<Map<String, Object>> filterBank(){
        try{
            return masterService.getFilterBank();
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @GetMapping(path = "/filter/list_filter_cashcode")
    public List<Map<String, Object>> filterCashCode(){
        try{
            return masterService.getFilterCashCode();
        }catch (Exception e){
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }
}
