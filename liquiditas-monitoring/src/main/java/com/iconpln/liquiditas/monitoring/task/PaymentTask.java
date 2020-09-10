package com.iconpln.liquiditas.monitoring.task;

import com.iconpln.liquiditas.core.service.CorpayJobPaymentService;
import com.iconpln.liquiditas.core.service.CorpayService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class PaymentTask {
    @Autowired
    private DataSource datasource;

    @Autowired
    private CorpayJobPaymentService corpayJobPaymentService;

    @Autowired
    private CorpayService corpayService;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(datasource);}
    private SimpleDateFormat df = new SimpleDateFormat("HH:mm");

    @Scheduled(cron = "0 */30 7-23 * * *")
//    @Scheduled(fixedRate = 60000)
    public void testPayment() throws IOException, JSONException {
        Date date = new Date();
        List<Map<String, Object>> listSiapBayar = corpayJobPaymentService.corpaySiapBayarList(date);
        System.out.println("List Siap Bayar : "+listSiapBayar);
        List<Map<String, Object>> listLunas = new ArrayList<>();
        List<Map<String, Object>> listGagalLunas = new ArrayList<>();
        if (!listSiapBayar.isEmpty()){
            for (Map<String,Object> invoice : listSiapBayar){
                System.out.println("Test Ada : "+invoice.get("METODE_PEMBAYARAN").toString());
                String result = corpayService.payment(invoice.get("METODE_PEMBAYARAN").toString(), invoice.get("BANK_BYR").toString(),invoice.get("REF_NUM_BANK").toString(),
                            invoice.get("NO_REK_HOUSE_BANK").toString(),invoice.get("NO_REK_BENEF").toString(),invoice.get("CURR_BAYAR").toString(),
                            invoice.get("NOMINAL_DI_BAYAR").toString(), invoice.get("NOMINAL_DI_BAYAR").toString(),invoice.get("KETERANGAN").toString(),"temp.email@mail.com",
                            invoice.get("NAMA_BENEF").toString(),"Trunojoyo", "Trunojoyo",invoice.get("BANK_BENEF").toString(),"OUR", invoice.get("CURR_BAYAR").toString(),
                            invoice.get("RETRIEVAL_REF_NUMBER").toString(),invoice.get("KODE_BANK_PENERIMA").toString(),invoice.get("CONFIRMATION_CODE").toString());
                System.out.println(result);
                JSONObject json = new JSONObject(result);
                if (json.getString("responseMessage").equals("Sukses")){
                    listLunas.add(invoice);
                }else{
                    invoice.put("RESPONSE_CODE",json.getString("responseCode"));
                    invoice.put("RESPONSE_MESSAGE", json.getString("responseMessage"));
                    listGagalLunas.add(invoice);
                }
            }
            if (!listLunas.isEmpty()){
                for (Map<String, Object> invoiceLunas : listLunas){
                        corpayJobPaymentService.corpayLunas(
                            invoiceLunas.get("COMP_CODE").toString(),invoiceLunas.get("DOC_NO").toString(),invoiceLunas.get("FISC_YEAR").toString(),
                            invoiceLunas.get("LINE_ITEM").toString(),invoiceLunas.get("KET").toString(), "JOB PAYMENT", "", invoiceLunas.get("OSS_ID").toString(),
                            invoiceLunas.get("GROUP_ID").toString()
                        );
                }
            }

            if (!listGagalLunas.isEmpty()){
                for (Map<String, Object> invoiceGagalLunas : listGagalLunas){
                    corpayJobPaymentService.corpayGagalLunas(
                            invoiceGagalLunas.get("COMP_CODE").toString(),invoiceGagalLunas.get("DOC_NO").toString(),invoiceGagalLunas.get("FISC_YEAR").toString(), invoiceGagalLunas.get("RESPONSE_CODE").toString(),
                            invoiceGagalLunas.get("RESPONSE_MESSAGE").toString(),invoiceGagalLunas.get("LINE_ITEM").toString(),invoiceGagalLunas.get("KET").toString(), "JOB PAYMENT", "GAGAL BAYAR", invoiceGagalLunas.get("OSS_ID").toString(),
                            invoiceGagalLunas.get("GROUP_ID").toString()
                    );
                }
            }
        }
        System.out.println("Running Hour : "+df.format(date));
    }
}
