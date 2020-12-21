package com.iconpln.liquiditas.monitoring.controller.saldo;

import com.iconpln.liquiditas.core.service.UploadSaldoService;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
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
            System.out.println("List Data Excel : "+listData);
            int no = 1;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("NO",no++);
                paramDetail.put("KET", data.get("JENIS_TAGIHAN"));
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
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }
}
