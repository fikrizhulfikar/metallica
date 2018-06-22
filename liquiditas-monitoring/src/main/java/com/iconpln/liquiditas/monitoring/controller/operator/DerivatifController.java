package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
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
@RequestMapping("/api_operator/derivatif")
public class DerivatifController {

    @Autowired ValasService valasService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/ins_data", method = RequestMethod.POST)
    public Map<String, Object> insData(
            @RequestParam(value = "pIdProduct", defaultValue = "") String pIdProduct,
            @RequestParam(value = "pIdDeviratif", defaultValue = "") String pIdDeviratif,
            @RequestParam(value = "pTglDeal", defaultValue = "") String pTglDeal,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pTenor", defaultValue = "") String pTenor,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pNationalAmount", defaultValue = "") String pNationalAmount,
            @RequestParam(value = "pDealRate", defaultValue = "") String pDealRate,
            @RequestParam(value = "pForwardPoint", defaultValue = "") String pForwardPoint,
            @RequestParam(value = "pKursJisdor1", defaultValue = "") String pKursJisdor1,
            @RequestParam(value = "pBungaDeposito", defaultValue = "") String pBungaDeposito,
            @RequestParam(value = "pPeruntukanDana", defaultValue = "") String pPeruntukanDana,
            @RequestParam(value = "pFixingRate", defaultValue = "") String pFixingRate,
            @RequestParam(value = "pSumberDana", defaultValue = "") String pSumberDana,
            @RequestParam(value = "pKursJisdor2", defaultValue = "") String pKursJisdor2,
            @RequestParam(value = "pSwapPoint", defaultValue = "") String pSwapPoint,
            @RequestParam(value = "pStrikePrice", defaultValue = "") String pStrikePrice,
            @RequestParam(value = "pStrikePrice2", defaultValue = "") String pStrikePrice2,
            @RequestParam(value = "PSettlementRate", defaultValue = "") String pSettlementRate,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pStatusDeviratif", defaultValue = "") String pStatusDeviratif,
            @RequestParam(value = "pBiayaPremi", defaultValue = "") String pBiayaPremi,
            @RequestParam(value = "pForwardRate", defaultValue = "") String pForwardRate
    ) {
        AppUtils.getLogger(this).info("pprutntukan dana : {}",pPeruntukanDana);
        try {
            return valasService.insDeviratif(pIdProduct,pIdDeviratif,pTglDeal,pBank,pTglJatuhTempo,
                    pTenor,pCurr,pNationalAmount,pDealRate,
                    pForwardPoint,pKursJisdor1,pBungaDeposito,
                    pSumberDana,pPeruntukanDana,pFixingRate,pKursJisdor2,
                    pSwapPoint,pStrikePrice,pStrikePrice2,pSettlementRate,
                    pKeterangan,pStatusDeviratif,pBiayaPremi, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
    public Map listRekapData(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "pStatusDerivatif", defaultValue = "0") String pStatusDerivatif,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch

    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListDeviratif(((start / length) + 1), length,pTglAwal,pTglAkhir,pBank,pCurrency,pTenor,pStatusDerivatif,pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data",list);
        AppUtils.getLogger(this).info("size data : {}",list.size());
        if(list.size() < 1 || list.isEmpty()){
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        }else
        {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/get_all_derivatif", method = RequestMethod.GET)
    public List getAllpembayaran(
            @RequestParam(value = "pIdProduct", defaultValue = "") String pIdProduct,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "ALL") String pCurr,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor
    ) {
        AppUtils.getLogger(this).info("pIdProduct : {}",pIdProduct);
        try {
            return valasService.getAllDerivatif(pIdProduct,pTglAwal,pTglAkhir,pBank,pCurr,pTenor);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deleteData(
            @RequestParam(value = "pIdProduct", defaultValue = "") String pIdProduct,
            @RequestParam(value = "pIdDerivatif", defaultValue = "") String pIdDerivatif
    ) {

        AppUtils.getLogger(this).debug("pIdProduct : {} ",pIdProduct);
        AppUtils.getLogger(this).debug("pIdDerivatif : {} ",pIdDerivatif);
        try {
            return valasService.deleteDerivatif(pIdProduct,pIdDerivatif);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getRekapDataById(
            @RequestParam(value = "pIdProduct", defaultValue = "") String pIdProduct,
            @RequestParam(value = "pIdDerivatif", defaultValue = "") String pIdDerivatif
    ) {
        AppUtils.getLogger(this).info("pId edit data: {}",pIdProduct);
        AppUtils.getLogger(this).info("pId edit data: {}",pIdDerivatif);
        try {
            return valasService.getDerivatifbyId(pIdProduct,pIdDerivatif);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    @RequestMapping(value = "/xls/{pStatusValas}/{pTglAwal}/{pTglAkhir}/{pBank}/{pCurr}/{pTenor}", method = RequestMethod.GET)
    public String export(@PathVariable Integer pStatusValas,
                         @PathVariable String pTglAwal,
                         @PathVariable String pTglAkhir,
                         @PathVariable String pBank,
                         @PathVariable String pCurr,
                         @PathVariable String pTenor,
                         HttpServletRequest request,
                         HttpServletResponse response) {
        try {

            String tglAwal = "";
            String tglAkhir = "";

            if(!pTglAwal.equals("null")){
                tglAwal = pTglAwal;
            }
            if(!pTglAkhir.equals("null")){
                tglAkhir = pTglAkhir;
            }

            List<Map<String,Object>> listData =  valasService.getAllDerivatif(pStatusValas.toString(),tglAwal,tglAkhir,pBank,pCurr,pTenor);

            AppUtils.getLogger(this).debug("data rekap : {}, report : {}",pStatusValas,listData.toString());
            Map param = new HashMap();
            List<Map<String,Object>> listDetail = new ArrayList<>();

            String title;
            String namaFile;
            String tempalte;
            if(pStatusValas.equals(1) || pStatusValas == 1){
                title = "DERIVATIF FORWARD";
                namaFile = "derivatif_forward.xls";
                tempalte = "derivatif-forward.xls";

                for (Map data : listData){
                    Map paramDetail  =  new HashMap();
                    paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                    paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                    paramDetail.put("CURRENCY", data.get("CURRENCY"));
                    paramDetail.put("TGL_DEAL", data.get("TGL_DEAL"));
                    paramDetail.put("JAM_DEAL", data.get("JAM_DEAL"));
                    paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                    paramDetail.put("TENOR", data.get("TENOR"));
                    paramDetail.put("NATIONAL_AMOUNT1", data.get("NATIONAL_AMOUNT"));
                    paramDetail.put("DEAL_RATE", data.get("DEAL_RATE"));
                    paramDetail.put("FORWARD_POINT", data.get("FORWARD_POINT"));
                    paramDetail.put("FORWARD_RATE", data.get("FORWARD_RATE"));
                    paramDetail.put("KURS_JISDOR1", data.get("KURS_JISDOR1"));
                    paramDetail.put("PENDAPATAN1", data.get("PENDAPATAN1"));
                    paramDetail.put("BIAYA_HEDGING", data.get("BIAYA_HEDGING"));
                    paramDetail.put("BUNGA_DEPOSITE_HEDGING", data.get("BUNGA_DEPOSITE_HEDGING"));
                    paramDetail.put("NET_BIAYA_HEDGING", data.get("NET_BIAYA_HEDGING"));
                    paramDetail.put("NET_BUY_NATIONAL_AMOUNT", data.get("NET_BUY_NATIONAL_AMOUNT"));
                    paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                    paramDetail.put("PERUNTUKAN_DANA", data.get("PERUNTUKAN_DANA"));
                    paramDetail.put("STATUS_DERIVATIF", data.get("STATUS_DERIVATIF"));
                    listDetail.add(paramDetail);
                }
                param.put("DETAILS",listDetail);
            }
            else if(pStatusValas.equals(2) || pStatusValas == 2){
                title = "DERIVATIF SWAP";
                namaFile = "derivatif_swap.xls";
                tempalte = "derivatif-swap.xls";

                for (Map data : listData){
                    Map paramDetail  =  new HashMap();
                    paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                    paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                    paramDetail.put("CURRENCY", data.get("CURRENCY"));
                    paramDetail.put("TGL_DEAL", data.get("TGL_DEAL"));
                    paramDetail.put("JAM_DEAL", data.get("JAM_DEAL"));
                    paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                    paramDetail.put("TENOR", data.get("TENOR"));
                    paramDetail.put("NATIONAL_AMOUNT", data.get("NATIONAL_AMOUNT"));
                    paramDetail.put("FIXING_RATE", data.get("FIXING_RATE"));
                    paramDetail.put("NATIONAL_AMOUNT1", data.get("NATIONAL_AMOUNT1"));
                    paramDetail.put("KURS_JISDOR1", data.get("KURS_JISDOR1"));
                    paramDetail.put("PENDAPATAN1", data.get("PENDAPATAN1"));
                    paramDetail.put("SWAP_POINT", data.get("SWAP_POINT"));
                    paramDetail.put("SWAP_RATE", data.get("SWAP_RATE"));
                    paramDetail.put("NATIONAL_AMOUNT2", data.get("NATIONAL_AMOUNT2"));
                    paramDetail.put("KURS_JISDOR2", data.get("KURS_JISDOR2"));
                    paramDetail.put("PENDAPATAN2", data.get("PENDAPATAN2"));
                    paramDetail.put("BIAYA_SWAP", data.get("BIAYA_SWAP"));
                    paramDetail.put("BUNGA_DEPOSITE_HEDGING", data.get("BUNGA_DEPOSITE_HEDGING"));
                    paramDetail.put("NET_BIAYA_SWAP", data.get("NET_BIAYA_SWAP"));
                    paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                    paramDetail.put("PERUNTUKAN_DANA", data.get("PERUNTUKAN_DANA"));
                    paramDetail.put("STATUS_DERIVATIF", data.get("STATUS_DERIVATIF"));
                    listDetail.add(paramDetail);
                }
                param.put("DETAILS",listDetail);

            }else
            {
                title = "DERIVATIF CALL SPREAD OPTION";
                namaFile = "derivatif_cso.xls";
                tempalte = "derivatif-cso.xls";

                for (Map data : listData){
                    Map paramDetail  =  new HashMap();
                    paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                    paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                    paramDetail.put("CURRENCY", data.get("CURRENCY"));
                    paramDetail.put("TGL_DEAL", data.get("TGL_DEAL"));
                    paramDetail.put("JAM_DEAL", data.get("JAM_DEAL"));
                    paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                    paramDetail.put("TENOR", data.get("TENOR"));
                    paramDetail.put("NATIONAL_AMOUNT", data.get("NATIONAL_AMOUNT"));
                    paramDetail.put("STRIKE_PRICE1", data.get("STRIKE_PRICE1"));
                    paramDetail.put("STRIKE_PRICE2", data.get("STRIKE_PRICE2"));
                    paramDetail.put("SETTLEMENT_RATE", data.get("SETTLEMENT_RATE"));
                    paramDetail.put("BIAYA_PREMI", data.get("BIAYA_PREMI"));
                    paramDetail.put("BUNGA_DEPOSITE_HEDGING", data.get("BUNGA_DEPOSITE_HEDGING"));
                    paramDetail.put("NET_BIAYA_PREMI", data.get("NET_BIAYA_PREMI"));
                    paramDetail.put("NET_BUY_NATIONAL_AMOUNT", data.get("NET_BUY_NATIONAL_AMOUNT"));
                    paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                    paramDetail.put("PERUNTUKAN_DANA", data.get("PERUNTUKAN_DANA"));
                    paramDetail.put("KETERANGAN", data.get("KETERANGAN"));
                    paramDetail.put("STATUS_DERIVATIF", data.get("STATUS_DERIVATIF"));
                    listDetail.add(paramDetail);
                }
                param.put("DETAILS",listDetail);
            }
            param.put("TITLE",title);

            AppUtils.getLogger(this).info("data report : {}",param.toString());

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\""+namaFile+"\"");

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/"+tempalte+"").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        }  catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :"+e.getMessage();
        }
    }


    @RequestMapping(value = "/get_id_upload", method = RequestMethod.GET)
    public Map getIdUpload() {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", valasService.getIdUpload());
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upload_xls", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdDerivatif", defaultValue = "") String pIdDerivatif,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        AppUtils.getLogger(this).info("pIdDerivatif: {}", pIdDerivatif);
        return valasService.uploadXls(inputStream, WebUtils.getUsernameLogin(), "3", pIdDerivatif);

//        return generateReport(response,listFailed,"result");
//        return listFailed;
    }

    @RequestMapping(value = "/download/{idDerivatif}/{idUpload}", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @PathVariable String idUpload,
                         @PathVariable String idDerivatif) throws SQLException {
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download "+idDerivatif, idUpload);

        return generateReport(response,valasService.getErrorData(idUpload, "3"), "download", idDerivatif);
    }

    @RequestMapping(value = "/template/{idDerivatif}", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response,
                         @PathVariable String idDerivatif) throws SQLException {
        return generateReport(response,null, "template", idDerivatif);

    }

    @RequestMapping(value = "/get_derivatif_ccs_pss", method = RequestMethod.GET)
    public Map getDerivatifCcsPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "pStart", defaultValue = "1") int pStart,
            @RequestParam(value = "pLength", defaultValue = "10") int pLength,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "pSearch", defaultValue = "ALL") String pSearch
            ) {
        AppUtils.getLogger(this).info("get_derivatif_ccs_pss");
        Map<String, Object> mapData = new HashMap<>();
        try {
            List<Map<String, Object>> list = valasService.getDerivatifCcsPss(pStart, pLength,
                    pTglAwal, pTglAkhir, pBank, pTenor, pSearch);
            mapData.put("draw", draw);
            mapData.put("data", list);
            AppUtils.getLogger(this).info("size data : {}",list.size());
            if(list.size() < 1 || list.isEmpty()){
                mapData.put("recordsTotal", 0);
                mapData.put("recordsFiltered", 0);
            }else
            {
                mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
                mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            }
            return mapData;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mapData;

    }

    @RequestMapping(value = "/ins_derivatif_ccs", method = RequestMethod.POST)
    public Map<String, Object> insDerivatifCcs(
            String pIdCcs,
            String pStartDate,
            String pEndDate,
            String pPayDate,
            String pNotionalUsd,
            String pLibor,
            String pReceiveUsd,
            String pResetDate,
            String pDiscountUsd,
            String pReceiveIdr,
            String pDiscountIdr,
            String pSukuBungaIdr,
            String pPrincipal,
            String pCreateBy,
            String pBank,
            String pJatuhTempo,
            String pTenor
    ) {
        AppUtils.getLogger(this).info("ins derivative ccs.");
        try {
            return valasService.insDerivatifCcs(
                    pIdCcs,
                    pStartDate,
                    pEndDate,
                    pPayDate,
                    pNotionalUsd,
                    pLibor,
                    pReceiveUsd,
                    pResetDate,
                    pDiscountUsd,
                    pReceiveIdr,
                    pDiscountIdr,
                    pSukuBungaIdr,
                    pPrincipal,
                    pCreateBy,
                    pBank,
                    pJatuhTempo,
                    pTenor
            );
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe, String idDerivatif) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}", errorData);

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            System.out.println("value : "+value);
            String resource;
            System.out.println("resources : tripartite");
            if(idDerivatif.equals("1")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_derivatif_forward.xls\"");
                resource = "classpath:/templates/report/"+tipe+"_derivatif_forward.xls";
            }else if(idDerivatif.equals("2")){
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_derivatif_swap.xls\"");
                resource = "classpath:/templates/report/"+tipe+"_derivatif_swap.xls";
            }else {
                response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_derivatif_cso.xls\"");
                resource = "classpath:/templates/report/"+tipe+"_derivatif_cso.xls";
            }

            if(tipe.equals("download")){
                value.put("listFailed", errorData.get("return"));
            }

            System.out.println("resources : "+ resource);
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

}
