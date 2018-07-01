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

    @Autowired
    ValasService valasService;

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
        AppUtils.getLogger(this).info("pprutntukan dana : {}", pPeruntukanDana);
        try {
            return valasService.insDeviratif(pIdProduct, pIdDeviratif, pTglDeal, pBank, pTglJatuhTempo,
                    pTenor, pCurr, pNationalAmount, pDealRate,
                    pForwardPoint, pKursJisdor1, pBungaDeposito,
                    pSumberDana, pPeruntukanDana, pFixingRate, pKursJisdor2,
                    pSwapPoint, pStrikePrice, pStrikePrice2, pSettlementRate,
                    pKeterangan, pStatusDeviratif, pBiayaPremi, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Derivatif CCS
    ////////////////
    ////////////////
    @RequestMapping(value = "/ins_derivatif_ccs", method = RequestMethod.POST)
    public Map<String, Object> insDerivatifCcs(
            @RequestParam(value = "pIdCcs", defaultValue = "") String pIdCcs,
            @RequestParam(value = "pStartDate", defaultValue = "") String pStartDate,
            @RequestParam(value = "pEndDate", defaultValue = "") String pEndDate,
            @RequestParam(value = "pPayDate", defaultValue = "") String pPayDate,
            @RequestParam(value = "pNotionalUsd", defaultValue = "") String pNotionalUsd,
            @RequestParam(value = "pLibor", defaultValue = "") String pLibor,
            @RequestParam(value = "pReceiveUsd", defaultValue = "") String pReceiveUsd,
            @RequestParam(value = "pResetDate", defaultValue = "") String pResetDate,
            @RequestParam(value = "pDiscountUsd", defaultValue = "") String pDiscountUsd,
            @RequestParam(value = "pReceiveIdr", defaultValue = "") String pReceiveIdr,
            @RequestParam(value = "pDiscountIdr", defaultValue = "") String pDiscountIdr,
            @RequestParam(value = "pSukuBungaIdr", defaultValue = "") String pSukuBungaIdr,
            @RequestParam(value = "pPrincipal", defaultValue = "") String pPrincipal,
            @RequestParam(value = "pCreateBy", defaultValue = "") String pCreateBy,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pJatuhTempo", defaultValue = "") String pJatuhTempo,
            @RequestParam(value = "pTenor", defaultValue = "") String pTenor
    ) {
        AppUtils.getLogger(this).info("ins derivative ccs.");
        try {
            return valasService.insDerivatifCcs(
                    pIdCcs, pStartDate, pEndDate, pPayDate, pNotionalUsd, pLibor, pReceiveUsd,
                    pResetDate, pDiscountUsd, pReceiveIdr, pDiscountIdr,
                    pSukuBungaIdr, pPrincipal, pCreateBy, pBank, pJatuhTempo, pTenor
            );
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
            String sortBy = parseColumn2(sortIndex);
            list = valasService.getListDeviratif(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pStatusDerivatif, sortBy, sortDir, pSearch);
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


    // Derivatif CCS
    ////////////////
    ////////////////
    @RequestMapping(value = "/get_derivatif_ccs_pss", method = RequestMethod.GET)
    public Map getDerivatifCcsPss(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "1") int pStart,
            @RequestParam(value = "length", defaultValue = "10") int pLength,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {
        String pSortBy = parseColumn(sortIndex);
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getDerivatifCcsPss(((pStart / pLength) + 1), pLength, pTglAwal, pTglAkhir, pBank, pTenor, pSortBy, sortDir, pSearch);
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

    @RequestMapping(value = "/get_all_derivatif_ccs", method = RequestMethod.GET)
    public List<Map<String, Object>> getAllDerivatifCcs(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "pStart", defaultValue = "1") int pStart,
            @RequestParam(value = "pLength", defaultValue = "10") int pLength,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "pSearch", defaultValue = "") String pSearch,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir
    ) {
        AppUtils.getLogger(this).info("get_derivatif_ccs_pss");
        try {
            String pSortBy = parseColumn(sortIndex);
            return valasService.getDerivatifCcsPss(pStart, pLength,
                    pTglAwal, pTglAkhir, pBank, pTenor, pSortBy, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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
        AppUtils.getLogger(this).info("pIdProduct : {}", pIdProduct);
        try {
            return valasService.getAllDerivatif(pIdProduct, pTglAwal, pTglAkhir, pBank, pCurr, pTenor);
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

        AppUtils.getLogger(this).debug("pIdProduct : {} ", pIdProduct);
        AppUtils.getLogger(this).debug("pIdDerivatif : {} ", pIdDerivatif);
        try {
            return valasService.deleteDerivatif(pIdProduct, pIdDerivatif);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/delete_data_ccs", method = RequestMethod.POST)
    public Map<String, Object> deleteDataCcs(
            @RequestParam(value = "pIdCcs", defaultValue = "") String pIdCcs
    ) {

        AppUtils.getLogger(this).debug("pIdCCS : {} ", pIdCcs);
        try {
            return valasService.deleteDerivatifCcs(pIdCcs);
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
        AppUtils.getLogger(this).info("pId edit data: {}", pIdProduct);
        AppUtils.getLogger(this).info("pId edit data: {}", pIdDerivatif);
        try {
            return valasService.getDerivatifbyId(pIdProduct, pIdDerivatif);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/edit_data_ccs", method = RequestMethod.GET)
    public List getDerivatifCcsbyId(
            @RequestParam(value = "pIdCcs", defaultValue = "") String pIdCcs) {
        AppUtils.getLogger(this).info("pId edit data: {}", pIdCcs);
        try {
            return valasService.getDerivatifCcsbyId(pIdCcs);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/xls-ccs/{pTglAwal}/{pTglAkhir}/{pBank}/{pTenor}", method = RequestMethod.GET)
    public String exportCcs(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pBank,
            @PathVariable String pTenor,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {

            String title = "DERIVATIF CCS";
            String namaFile = "derivatif-ccs.xls";

            String tglAwal = "";
            String tglAkhir = "";

            if(!pTglAwal.equals("null")){
                tglAwal = pTglAwal;
            }
            if(!pTglAkhir.equals("null")){
                tglAkhir = pTglAkhir;
            }

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllDerivatifCcs(tglAwal,tglAkhir,pBank,pTenor);
            AppUtils.getLogger(this).info("data report : {}", listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();

                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                paramDetail.put("TENOR", data.get("TENOR"));
                paramDetail.put("JATUH_TEMPO", data.get("JATUH_TEMPO"));
                paramDetail.put("START_DATE", data.get("START_DATE"));
                paramDetail.put("END_DATE", data.get("END_DATE"));
                paramDetail.put("PAY_DATE", data.get("PAY_DATE"));
                paramDetail.put("JUMLAH_HARI", data.get("JUMLAH_HARI"));
                paramDetail.put("NOTIONAL_USD", data.get("NOTIONAL_USD"));
                paramDetail.put("LIBOR", data.get("LIBOR"));
                paramDetail.put("SUKU_BUNGA_USD", data.get("SUKU_BUNGA_USD"));
                paramDetail.put("SUKU_BUNGA_USD", data.get("SUKU_BUNGA_USD"));
                paramDetail.put("RECEIVE_PRINCIPAL", data.get("RECEIVE_PRINCIPAL"));
                paramDetail.put("RECEIVE_COUPON", data.get("RECEIVE_COUPON"));
                paramDetail.put("TOTAL_PENERIMAAN", data.get("TOTAL_PENERIMAAN"));
                paramDetail.put("RESET_DATE", data.get("RESET_DATE"));
                paramDetail.put("DISCOUNT_FACTOR_USD", data.get("DISCOUNT_FACTOR_USD"));
                paramDetail.put("PV_USD", data.get("PV_USD"));
                paramDetail.put("NOTIONAL_IDR", data.get("NOTIONAL_IDR"));
                paramDetail.put("SUKU_BUNGA_IDR", data.get("SUKU_BUNGA_IDR"));
                paramDetail.put("PAY_PRINCIPAL", data.get("PAY_PRINCIPAL"));
                paramDetail.put("PAY_COUPON", data.get("PAY_COUPON"));
                paramDetail.put("TOTAL_PEMBAYARAN", data.get("TOTAL_PEMBAYARAN"));
                paramDetail.put("DISCOUNT_FACTOR_IDR", data.get("DISCOUNT_FACTOR_IDR"));
                paramDetail.put("PV_IDR", data.get("PV_IDR"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/derivatif-ccs.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
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

            if (!pTglAwal.equals("null")) {
                tglAwal = pTglAwal;
            }
            if (!pTglAkhir.equals("null")) {
                tglAkhir = pTglAkhir;
            }

            List<Map<String, Object>> listData = valasService.getAllDerivatif(pStatusValas.toString(), tglAwal, tglAkhir, pBank, pCurr, pTenor);

            AppUtils.getLogger(this).debug("data rekap : {}, report : {}", pStatusValas, listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            String title;
            String namaFile;
            String tempalte;
            if (pStatusValas.equals(1) || pStatusValas == 1) {
                title = "DERIVATIF FORWARD";
                namaFile = "derivatif_forward.xls";
                tempalte = "derivatif-forward.xls";

                for (Map data : listData) {
                    Map paramDetail = new HashMap();
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
                param.put("DETAILS", listDetail);
            } else if (pStatusValas.equals(2) || pStatusValas == 2) {
                title = "DERIVATIF SWAP";
                namaFile = "derivatif_swap.xls";
                tempalte = "derivatif-swap.xls";

                for (Map data : listData) {
                    Map paramDetail = new HashMap();
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
                param.put("DETAILS", listDetail);

            } else {
                title = "DERIVATIF CALL SPREAD OPTION";
                namaFile = "derivatif_cso.xls";
                tempalte = "derivatif-cso.xls";

                for (Map data : listData) {
                    Map paramDetail = new HashMap();
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
                param.put("DETAILS", listDetail);
            }
            param.put("TITLE", title);

            AppUtils.getLogger(this).info("data report : {}", param.toString());

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/" + tempalte + "").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
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
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download " + idDerivatif, idUpload);

        return generateReport(response, valasService.getErrorData(idUpload, "3"), "download", idDerivatif);
    }

    @RequestMapping(value = "/template/{idDerivatif}", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response,
                                   @PathVariable String idDerivatif) throws SQLException {
        return generateReport(response, null, "template", idDerivatif);

    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe, String idDerivatif) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}", errorData);

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            System.out.println("value : " + value);
            String resource;
            System.out.println("resources : tripartite");
            if (idDerivatif.equals("1")) {
                response.setHeader("Content-Disposition", "attachment; filename=\"" + tipe + "_derivatif_forward.xls\"");
                resource = "classpath:/templates/report/" + tipe + "_derivatif_forward.xls";
            } else if (idDerivatif.equals("2")) {
                response.setHeader("Content-Disposition", "attachment; filename=\"" + tipe + "_derivatif_swap.xls\"");
                resource = "classpath:/templates/report/" + tipe + "_derivatif_swap.xls";
            } else {
                response.setHeader("Content-Disposition", "attachment; filename=\"" + tipe + "_derivatif_cso.xls\"");
                resource = "classpath:/templates/report/" + tipe + "_derivatif_cso.xls";
            }

            if (tipe.equals("download")) {
                value.put("listFailed", errorData.get("return"));
            }

            System.out.println("resources : " + resource);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String parseColumn(int index) {
        switch (index) {
            case 1:
                return "BANK_CONTERPARTY";
            case 2:
                return "TENOR";
            case 3:
                return "JATUH_TEMPO";
            case 4:
                return "START_DATE";
            case 5:
                return "END_DATE";
            case 6:
                return "PAY_DATE";
            case 7:
                return "JUMLAH_HARI";
            case 8:
                return "NOTIONAL_USD";
            case 9:
                return "LIBOR";
            case 10:
                return "SUKU_BUNGA_USD";
            case 11:
                return "SUKU_BUNGA_USD";
            case 12:
                return "RECEIVE_PRINCIPAL";
            case 13:
                return "RECEIVE_COUPON";
            case 14:
                return "TOTAL_PENERIMAAN";
            case 15:
                return "RESET_DATE";
            case 16:
                return "DISCOUNT_FACTOR_USD";
            case 17:
                return "PV_USD";
            case 18:
                return "NOTIONAL_IDR";
            case 19:
                return "SUKU_BUNGA_IDR";
            case 20:
                return "PAY_PRINCIPAL";
            case 21:
                return "PAY_COUPON";
            case 22:
                return "TOTAL_PEMBAYARAN";
            case 23:
                return "DISCOUNT_FACTOR_IDR";
            case 24:
                return "PV_IDR";
            default:
                return "BANK_CONTERPARTY";
        }
    }

    public String parseColumn2(int index) {
        switch (index) {
            case 1:
                return "BANK_CONTERPARTY";
            case 2:
                return "CURRENCY";
            case 3:
                return "TANGGAL_DEAL";
            case 4:
                return "JAM";
            case 5:
                return "TGL_JATUH_TEMPO";
            case 6:
                return "TENOR";
            case 7:
                return "NOTIONAL_AMOUNT_USD";
            case 8:
                return "DEAL_RATE";
            case 9:
                return "FORWARD_POINT";
            case 10:
                return "FORWARD_RATE";
            case 11:
                return "KURS_JISDOR";
            case 12:
                return "PENDAPATAN";
            case 13:
                return "BIAYA_HEDGING";
            case 14:
                return "BUNGA_DEPOSITO";
            case 15:
                return "NET_BIAYA_HEDGING";
            case 16:
                return "NET_BUY_NOTIONAL_AMOUNT";
            case 17:
                return "SUMBER_DANA";
            case 18:
                return "PERUNTUKAN_DANA";
            case 19:
                return "LEG1_FIXING_RATE";
            case 20:
                return "LEG1_NOTIONAL_AMOUNT";
            case 21:
                return "LEG2_SWAP_POINT";
            case 22:
                return "BIAYA_SWAP";
            case 23:
                return "NET_BIAYA_SWAP";
            case 24:
                return "STRIKE_PRICE1";
            case 25:
                return "STRIKE_PRICE2";
            case 26:
                return "SETTLEMENT_RATE";
            case 27:
                return "BIAYA_PREMI";
            case 28:
                return "NET_BIAYA_PREMI";
            case 29:
                return "KETERANGAN";
            case 40:
                return "STATUS";
            default:
                return "BANK_CONTERPARTY";
        }
    }

}
