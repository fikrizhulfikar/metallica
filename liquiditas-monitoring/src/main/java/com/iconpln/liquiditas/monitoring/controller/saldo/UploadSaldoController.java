package com.iconpln.liquiditas.monitoring.controller.saldo;

import com.iconpln.liquiditas.core.service.UploadSaldoService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api_master/upload_saldo_bank")
public class UploadSaldoController {

    @Autowired
    UploadSaldoService uploadSaldoService;

    @Autowired
    ResourceLoader resourceLoader;

    @RequestMapping(path = "/upload_xls")
    public Map uploadSaldoBank(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
            ) throws IOException, InvalidFormatException, SQLException, ClassNotFoundException {
        InputStream inputStream = file.getInputStream();
        return uploadSaldoService.uploadSaldoBank(inputStream);
    }

    @RequestMapping(path = "/upload_psd")
    public Map uploadPsd(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
    ) throws IOException, InvalidFormatException, SQLException, ClassNotFoundException {
                InputStream inputStream = file.getInputStream();
                return uploadSaldoService.uploadPsd(inputStream);
    }

    @RequestMapping(path = "/cetak_all_invoice")
    public String cetakAllInvoice(HttpServletRequest request, HttpServletResponse response){
        try {
            String title = "Rekap Semua Invocie";
            String fileName = "Rekap Semua Invoice.xls";
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposistion","attachment; filename=\""+fileName+"\"");
            List<Map<String, Object>> listData = uploadSaldoService.getAllTransaksi();
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            param.put("TITLE", title);
            int no = 1;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("NO",no++);
                paramDetail.put("JENIS_TAGIHAN", data.get("KET"));
                paramDetail.put("COMP_CODE", data.get("COMP_CODE"));
                paramDetail.put("DOC_NO", data.get("DOC_NO"));
                paramDetail.put("GROUP_ID", data.get("GROUP_ID"));
                paramDetail.put("OSS_ID", data.get("OSS_ID"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE", data.get("DOC_TYPE"));
                paramDetail.put("TRANS_TYPE", data.get("TRANS_TYPE"));
                paramDetail.put("TGL_RENCANA_BAYAR", data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("TGL_LUNAS", data.get("TGL_LUNAS"));
                paramDetail.put("CURR_BAYAR", data.get("CURR_BAYAR"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("EQ_IDR", data.get("EQ_IDR"));
                paramDetail.put("ASSIGNMENT", data.get("ASSIGNMENT"));
                paramDetail.put("JENIS", data.get("JENIS"));
                paramDetail.put("ITEM_TEXT", data.get("ITEM_TEXT"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("CUSTOMER", data.get("CUSTOMER"));
                paramDetail.put("BANK_BAYAR", data.get("BANK_BAYAR"));
                paramDetail.put("CASH_CODE", data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASH_CODE", data.get("NAMA_CASH_CODE"));
                paramDetail.put("TGL_INPUT_OSS", data.get("TGL_INPUT_OSS"));
                paramDetail.put("METODE_PEMBAYARAN", data.get("METODE_PEMBAYARAN"));
                paramDetail.put("JENIS_CASH_CODE", data.get("JENIS_CASH_CODE"));
                paramDetail.put("NO_GIRO", data.get("NO_GIRO"));
                paramDetail.put("VERIFIED_ON", data.get("VERIFIED_ON"));
                paramDetail.put("STATUS", data.get("STATUS"));
                paramDetail.put("POSISI", data.get("POSISI"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_semua_invoice.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            System.out.println("List Data Excel : "+listData);
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }

    @RequestMapping(path = "/cetak_rencana_imprest")
    public String cetakRencanaImprest(HttpServletRequest request, HttpServletResponse response){
        try {
            String title = "Rekap Rencana Imprest";
            String fileName = "Rencana Imprest.xls";
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposistion","attachment; filename=\""+fileName+"\"");
            List<Map<String, Object>> listData = uploadSaldoService.getRencanaImprest();
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            param.put("TITLE", title);
            int no = 1;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER",data.get("ROW_NUMBER"));
                paramDetail.put("ID_FORM", data.get("ID_FORM"));
                paramDetail.put("UNIT_PLN", data.get("UNIT_PLN"));
                paramDetail.put("NAMA_BANK", data.get("NAMA_BANK"));
                paramDetail.put("INVESTASI", data.get("INVESTASI"));
                paramDetail.put("OPERASI", data.get("OPERASI"));
                paramDetail.put("TANGGAL_UPLOAD", data.get("TANGGAL_UPLOAD"));
                paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                paramDetail.put("TGL_APPROVE_STAFF", data.get("TGL_APPROVE_STAFF"));
                paramDetail.put("TGL_APPROVE_MSB", data.get("TGL_APPROVE_MSB"));
                paramDetail.put("TGL_APPROVE_VP", data.get("TGL_APPROVE_VP"));
                paramDetail.put("STATUS", data.get("STATUS"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_imprest.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            System.out.println("List Data Excel : "+listData);
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }

    @RequestMapping(path = "/cetak_realisasi_imprest")
    public String cetakRealisasiImprest(HttpServletRequest request, HttpServletResponse response){
        try {
            String title = "Rekap Realisasi Imprest";
            String fileName = "Realisasi Imprest.xls";
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposistion","attachment; filename=\""+fileName+"\"");
            List<Map<String, Object>> listData = uploadSaldoService.getRealisasiImprest();
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            param.put("TITLE", title);
            int no = 1;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER",data.get("ROW_NUMBER"));
                paramDetail.put("ID_FORM", data.get("ID_FORM"));
                paramDetail.put("UNIT_PLN", data.get("UNIT_PLN"));
                paramDetail.put("NAMA_BANK", data.get("NAMA_BANK"));
                paramDetail.put("INVESTASI", data.get("INVESTASI"));
                paramDetail.put("OPERASI", data.get("OPERASI"));
                paramDetail.put("TANGGAL_UPLOAD", data.get("TANGGAL_UPLOAD"));
                paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                paramDetail.put("TGL_APPROVE_STAFF", data.get("TGL_APPROVE_STAFF"));
                paramDetail.put("TGL_APPROVE_MSB", data.get("TGL_APPROVE_MSB"));
                paramDetail.put("TGL_APPROVE_VP", data.get("TGL_APPROVE_VP"));
                paramDetail.put("STATUS", data.get("STATUS"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_imprest.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            System.out.println("List Data Excel : "+listData);
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }

    @RequestMapping(path = "/cetak_all_invoice_pilot/xls/{pDateFrom}/{pDateTo}/{pCurrency}/{pCarabayar}/{pHouseBank}")
    public String cetakAllInvoicePilot(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pCurrency,
            @PathVariable String pCarabayar,
            @PathVariable String pHouseBank,
            HttpServletRequest request, HttpServletResponse response){
        try {
            String title = "Rekap Semua Invoice Pilot";
            String fileName = "Rekap Semua Invoice Pilot.xls";
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposistion","attachment; filename=\""+fileName+"\"");
            List<Map<String, Object>> listData = uploadSaldoService.getAllTransaksiPilot(pDateFrom.replace("-","/"), pDateTo.replace("-","/"), pCurrency, pCarabayar, pHouseBank, WebUtils.getUsernameLogin());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            param.put("TITLE", title);
            int no = 0;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("NO", no++);
                paramDetail.put("KET", data.get("KET").toString().replace("_"," "));
                paramDetail.put("COMP_CODE", data.get("COMP_CODE"));
                paramDetail.put("DOC_NO", data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE", data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE", data.get("DOC_DATE"));
                paramDetail.put("DOC_DATE2", data.get("DOC_DATE2"));
                paramDetail.put("POST_DATE", data.get("POST_DATE"));
                paramDetail.put("POST_DATE2", data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE", data.get("ENTRY_DATE"));
                paramDetail.put("ENTRY_DATE2", data.get("ENTRY_DATE2"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE", data.get("EXCH_RATE"));
                paramDetail.put("PMT_IND", data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE", data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL", data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM", data.get("LINE_ITEM"));
                paramDetail.put("BUS_AREA", data.get("BUS_AREA"));
                paramDetail.put("BUS_AREA_PAYMENT", data.get("BUS_AREA_PAYMENT"));
                paramDetail.put("AMT_LC", data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC", data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC", data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT", data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT", data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT", data.get("ITEM_TEXT"));
                paramDetail.put("CUSTOMER", data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME", data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("ID_VENDOR_DASH", data.get("ID_VENDOR_DASH"));
                paramDetail.put("VENDOR_NAME", data.get("VENDOR_NAME"));
                paramDetail.put("PMT_BLOCK", data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK", data.get("HOUSE_BANK"));
                paramDetail.put("PRTNR_BANK_TYPE", data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY", data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT", data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER", data.get("ACCOUNT_HOLDER"));
                paramDetail.put("CASH_CODE", data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASH_CODE", data.get("NAMA_CASH_CODE"));
                paramDetail.put("AMT_WITH_BASE_LC", data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC", data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND", data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT", data.get("CORP_PMT"));
                paramDetail.put("MAKER", data.get("MAKER"));
                paramDetail.put("CHECKER", data.get("CHECKER"));
                paramDetail.put("APPROVER", data.get("APPROVER"));
                paramDetail.put("COUNTER", data.get("COUNTER"));
                paramDetail.put("NO_REK_HOUSE_BANK", data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("OSS_ID", data.get("OSS_ID"));
                paramDetail.put("GROUP_ID", data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR", data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR", data.get("BANK_BYR"));
                paramDetail.put("BANK_BYR2", data.get("BANK_BYR2"));
                paramDetail.put("CURR_BAYAR", data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND", data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR", data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF", data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF", data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY", data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON", data.get("VERIFIED_ON"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA", data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("GROUP_ID_SAP", data.get("GROUP_ID_SAP"));
                paramDetail.put("EQ_IDR", data.get("EQ_IDR"));
                paramDetail.put("ASSIGNMENT_DEPAN", data.get("ASSIGNMENT_DEPAN"));
                paramDetail.put("HARI_KERJA", data.get("HARI_KERJA"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_semua_invoice_pilot.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            System.out.println("List Data Excel All Pilot: "+listData);
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }
}
