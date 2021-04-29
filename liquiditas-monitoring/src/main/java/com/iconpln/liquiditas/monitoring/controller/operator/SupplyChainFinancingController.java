package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.core.service.SupplyChainFinancingService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import groovy.util.IFileNameFinder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_operator/supply_chain_financing")
public class SupplyChainFinancingController {

    @Autowired
    SupplyChainFinancingService scf;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping(path = "/get_scf_data")
    public Map listDataScf(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "ALL") String pJenisPemabayran
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATA")){
            sortDir = "DESC";
        }

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = scf.getListScf(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pJenisPemabayran);
        } catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);

        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }
        return mapData;

    }

    private String parseColumn(int index){
        switch (index) {
            case 1:
                return "COMP_CODE";
            case 2:
                return "DOC_NO";
            case 3:
                return "FISC_YEAR";
            case 4:
                return "DOC_TYPE";
            case 5:
                return "DOC_DATE2";
            case 6:
                return "POST_DATE2";
            case 7:
                return "ENTRY_DATE2";
            case 8:
                return "REFERENCE";
            case 9:
                return "REV_WITH";
            case 10:
                return "REV_YEAR";
            case 11:
                return "DOC_HDR_TXT";
            case 12:
                return "CURRENCY";
            case 13:
                return "EXCH_RATE";
            case 14:
                return "REFERENCE_KEY";
            case 15:
                return "PMT_ID";
            case 16:
                return "TRANS_TYPE";
            case 17:
                return "SPREAD_VAL";
            case 18:
                return "LINE_ITEM";
            case 19:
                return "OI_IND";
            case 20:
                return "ACCT_TYPE";
            case 21:
                return "SPEC_GL";
            case 22:
                return "BUS_AREA";
            case 23:
                return "TPBA";
            case 24:
                return "AMT_LC";
            case 25:
                return "AMT_MC";
            case 26:
                return "AMT_WITH_BASE_TC";
            case 27:
                return "AMT_WITH_TC";
            case 28:
                return "AMOUNT";
            case 29:
                return "ASSIGNMENT";
            case 30:
                return "ITEM_TEXT";
            case 31:
                return "COST_CTR";
            case 32:
                return "GL_ACCT";
            case 33:
                return "CUSTOMER";
            case 34:
                return "VENDOR";
            case 35:
                return "BASE_DATE";
            case 36:
                return "TERM_PMT";
            case 37:
                return "DUE_ON";
            case 38:
                return "PMT_BLOCK";
            case 39:
                return "HOUSE_BANK";
            case 40:
                return "PRTNR_BANK_TYPE";
            case 41:
                return "BANK_KEY";
            case 42:
                return "BANK_ACCOUNT";
            case 43:
                return "ACCOUNT_HOLDER";
            case 44:
                return "PO_NUM";
            case 45:
                return "PO_ITEM";
            case 46:
                return "REF_KEY1";
            case 47:
                return "REF_KEY2";
            case 48:
                return "REF_KEY3";
            case 49:
                return "INT_ORDER";
            case 50:
                return "WBS_NUM";
            case 51:
                return "CASH_CODE";
            case 52:
                return "DR_CR_IND";
            case 53:
                return "AMT_WITH_BASE_LC";
            case 54:
                return "AMT_WITH_LC";
            case 55:
                return "METODE_PEMBAYARAN";
            case 56:
                return "TGL_RENCANA_BAYAR";
            case 57:
                return "SUMBER_DANA";
            case 58:
                return "KETERANGAN";
            case 59:
                return "STATUS_TRACKING";
            default:
                return "UPDATE_DATE";
        }
    }

    @PostMapping(path = "/ins_scf")
    public Map<String, Object> insScf(
            @RequestParam(value = "pIdScf", defaultValue = "") String pIdScf,
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pTglTransaksi", defaultValue = "") String pTglTransaksi,
            @RequestParam(value = "pJatuhTempo", defaultValue = "") String pJatuhTempo,
            @RequestParam(value = "pVendor", defaultValue = "") String pVendor,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "") String pJenisPembayaran,
            @RequestParam(value = "pKodeCurrency", defaultValue = "") String pKodeCurrency,
            @RequestParam(value = "pNominal", defaultValue = "") String pNominal,
            @RequestParam(value = "pSukuBunga", defaultValue = "") String pSukuBunga,
            @RequestParam(value = "pProvisi", defaultValue = "") String pProvisi
    ){
        try {
            Map<String, Object> result = scf.insScf(pIdScf, pKodeBank, pTglTransaksi, pJatuhTempo, pVendor, pJenisPembayaran, pKodeCurrency, pNominal, pSukuBunga, pProvisi, WebUtils.getUsernameLogin());
            return result;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/delete_scf_data")
    public Map<String, Object> deleteScf(@RequestParam(value = "pIdScf") String pIdScf){
        try{
            Map<String, Object> out = scf.deleteScf(pIdScf);
            return out;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_scf_byId")
    public List<Map<String, Object>> getScfById(@RequestParam(value = "pIdScf") String pIdScf){
        List<Map<String, Object>> result;
        try {
            return scf.getScfById(pIdScf);
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upload_files_pembayaran", method = RequestMethod.POST)
    public Map uploadFileRekap(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdScf", defaultValue = "") String pIdScf,
            @RequestParam(value = "pJenisFile", defaultValue = "") String pJenisFile,
            @RequestParam(value = "pFileSize", defaultValue = "") String pFileSize
    ) {
        try {
            String pFileName = WebUtils.uploadFile(file, pIdScf, pJenisFile);
            if (!pFileName.equals("")) {
                //String idJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
                try {
                    Map<String, Object> result = scf.uploadFileRekap(pIdScf, pJenisFile, new BigDecimal(pFileSize), pIdScf + pJenisFile + File.separator + pFileName, WebUtils.getUsernameLogin());
//                    Notification notification = Notification.builder()
//                            .topic(idJenisPembayaran)
//                            .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
//                            .message(WebUtils.getUsernameLogin() + " telah menambahkan data (xls).")
//                            .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas)
//                            .build();
//                    notificationUtil.notifyMessage(notification);
                    return result;
                } catch (Exception e) {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_list_file_scf")
    public Map getListFileScf(@RequestParam(value = "pIdScf") String pIdScf){
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("file_scf", scf.getListFilesScf(pIdScf));
            return data;
        }catch (Exception e){
            e.printStackTrace();
            return null ;
        }
    }

    @GetMapping(path = "/get_scf_collateral_data")
    public Map listDataScfCollateral(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "ALL") String pJenisPemabayran
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATA")){
            sortDir = "DESC";
        }

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = scf.getListScfCollateral(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pJenisPemabayran);
        } catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);

        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }
        return mapData;
    }

    @PostMapping(path = "/ins_scf_collateral")
    public Map<String, Object> insScfCollateral(
            @RequestParam(value = "pIdScfCol", defaultValue = "") String pIdScf,
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pTglTransaksi", defaultValue = "") String pTglTransaksi,
            @RequestParam(value = "pJatuhTempo", defaultValue = "") String pJatuhTempo,
            @RequestParam(value = "pVendor", defaultValue = "") String pVendor,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "") String pJenisPembayaran,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pOriCurr", defaultValue = "") String pOriCurr,
            @RequestParam(value = "pKurs", defaultValue = "") String pKurs,
            @RequestParam(value = "pFeeTransaksi", defaultValue = "") String pFeeTransaksi,
            @RequestParam(value = "pCashCollateral", defaultValue = "") String pCashCollateral,
            @RequestParam(value = "pPajak", defaultValue = "") String pPajak,
            @RequestParam(value = "pJasaGiro", defaultValue = "") String pJasaGiro,
            @RequestParam(value = "pPajakBank", defaultValue = "") String pPajakBank
    ){
        try {
            Map<String, Object> result = scf.insScfCollateral(pIdScf, pKodeBank, pTglTransaksi, pJatuhTempo, pVendor, pJenisPembayaran, pCurrency, pOriCurr, pKurs, pFeeTransaksi, pCashCollateral, pPajak, pPajakBank, pJasaGiro, WebUtils.getUsernameLogin());
            return result;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_scf_collateral_byId")
    public List<Map<String, Object>> getScfCollateralById(@RequestParam(value = "pIdScfCollateral") String pIdScf){
        List<Map<String, Object>> result;
        try {
            return scf.getScfCollateralById(pIdScf);
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/delete_scf_collateral_data")
    public Map<String, Object> deleteScfCollateral(@RequestParam(value = "pIdScfCollateral") String pIdScf){
        try{
            Map<String, Object> out = scf.deleteScfCollateral(pIdScf);
            return out;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
