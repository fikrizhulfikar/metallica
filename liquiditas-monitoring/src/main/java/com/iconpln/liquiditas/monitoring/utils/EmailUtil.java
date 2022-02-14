package com.iconpln.liquiditas.monitoring.utils;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.commons.codec.CharEncoding;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Email service.
 * @author Langkuy <contact@ardikars.com>
 */
@Service("emailService")
public class EmailUtil {

    private String from = "no-reply@lmetallica.pln.co.id";

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String body, String subject) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setFrom(from);
            helper.setTo(to);
            helper.setText(body);
            helper.setSubject(subject);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendEmailWithAttachment(String to, String body, String subject, String fileName, List<RekapPembayaran> attachment) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(message, true, CharEncoding.UTF_8);
        } catch (MessagingException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        }
        try {
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            //create temporary bayte array output stream
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            HSSFWorkbook workbook = createXsl(attachment);

            workbook.write(baos);
            //create input stream from baos
            InputStreamSource streamSource = new ByteArrayResource(baos.toByteArray());
            helper.addAttachment(fileName, streamSource);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        } catch (IOException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        }
    }

    public void sendEmailWithAttachment2(String to, String body, String subject, String fileName, List<Map<String, Object>> attachment) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(message, true, CharEncoding.UTF_8);
        } catch (MessagingException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        }
        try {
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            //create temporary bayte array output stream
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            HSSFWorkbook workbook = createXsl2(attachment);

            workbook.write(baos);
            //create input stream from baos
            InputStreamSource streamSource = new ByteArrayResource(baos.toByteArray());
            helper.addAttachment(fileName, streamSource);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        } catch (IOException e) {
            AppUtils.getLogger(this).debug(e.getMessage());
        }
    }

    public HSSFWorkbook createXsl(List<RekapPembayaran> data) {
        HSSFWorkbook workbook = new HSSFWorkbook();

        DataFormat fmt = workbook.createDataFormat();
        CellStyle textStyle = workbook.createCellStyle();
        textStyle.setDataFormat(fmt.getFormat("@"));

        /**
         * Foto
         */
        HSSFSheet sheetFoto = workbook.createSheet("JATUH TEMPO");
        List<List<Object>> dataJatuhTempo = new ArrayList<>();
        dataJatuhTempo.add(Arrays.asList(
                "VENDOR",
                "JENIS_PEMBAYARAN",
                "UNIT_ANGGARAN",
                "POS_ANGGARAN",
                "SUB_POS_ANGGARAN",
                "UNIT",
                "CURRENCY",
                "TOTAL_TAGIHAN",
                "TGL_JATUH_TEMPO",
                "KODE_BANK_TUJUAN",
                "KODE_BANK_PEMBAYAR",
                "NO_TAGIHAN",
                "TGL_TAGIHAN",
                "NO_NOTDIN",
                "TGL_NOTDIN",
                "STATUS_VALAS",
                "COUNT_DOWN",
                "DESKRIPSI",
                "TIPE_TRANSAKSI",
                "TGL_TERIMA_INVOICE",
                "TGL_LUNAS",
                "STATUS_TRACKING"));

        for (RekapPembayaran rekapPembayaran : data) {
            dataJatuhTempo.add(Arrays.asList(rekapPembayaran.getIdVendor()
                    , rekapPembayaran.getIdJenisPembayaran()
                    , rekapPembayaran.getIdUnitAnggaran()
                    , rekapPembayaran.getIdPosAnggaran()
                    , rekapPembayaran.getIdSubPosAnggaran()
                    , rekapPembayaran.getIdUnit()
                    , rekapPembayaran.getCurrency()
                    , rekapPembayaran.getTotalTagihan()
                    , rekapPembayaran.getTglJatuhTempo()
                    , rekapPembayaran.getKodeBankTujuan()
                    , rekapPembayaran.getKodeBankPembayar()
                    , rekapPembayaran.getNoTagihan()
                    , rekapPembayaran.getTglTagihan()
                    , rekapPembayaran.getNoNotDin()
                    , rekapPembayaran.getTglNotDin()
                    , rekapPembayaran.getStatusValas()
                    , rekapPembayaran.getCountdown()
                    , rekapPembayaran.getDeskripsi()
                    , rekapPembayaran.getTipeTransaksi()
                    , rekapPembayaran.getTglTerimaInvoice()
                    , rekapPembayaran.getTglLunas()
                    , rekapPembayaran.getStatusTracking()
            ));
        }
        writeRow(sheetFoto, dataJatuhTempo);
        return workbook;
    }

    public HSSFWorkbook createXsl2(List<Map<String, Object>> data) {
        HSSFWorkbook workbook = new HSSFWorkbook();

        DataFormat fmt = workbook.createDataFormat();
        CellStyle textStyle = workbook.createCellStyle();
        textStyle.setDataFormat(fmt.getFormat("@"));

        /**
         * Foto
         */
        HSSFSheet sheetFoto = workbook.createSheet("JATUH TEMPO");
        List<List<Object>> dataJatuhTempo = new ArrayList<>();
        dataJatuhTempo.add(Arrays.asList(
                "STATUS",
                "POSISI",
                "ROLE",
                "EMAIL",
                "KET",
                "COMP_CODE",
                "DOC_NO",
                "FISC_YEAR",
                "DOC_TYPE",
                "DOC_DATE",
                "DOC_DATE2",
                "POST_DATE",
                "POST_DATE2",
                "ENTRY_DATE",
                "ENTRY_DATE2",
                "REFERENCE",
                "REV_WITH",
                "REV_YEAR",
                "DOC_HDR_TXT",
                "CURRENCY",
                "EXCH_RATE",
                "REFERENCE_KEY",
                "PMT_IND",
                "TRANS_TYPE",
                "SPREAD_VAL",
                "LINE_ITEM",
                "OI_IND",
                "ACCT_TYPE",
                "SPEC_GL",
                "BUS_AREA",
                "TPBA",
                "AMT_LC",
                "AMT_TC",
                "AMT_WITH_BASE_TC",
                "AMOUNT",
                "AMT_WITH_TC",
                "ASSIGNMENT",
                "ITEM_TEXT",
                "COST_CTR",
                "GL_ACCT",
                "CUSTOMER",
                "VENDOR",
                "BASE_DATE",
                "TERM_PMT",
                "DUE_ON",
                "PMT_BLOCK",
                "HOUSE_BANK",
                "PRTNR_BANK_TYPE",
                "BANK_KEY",
                "BANK_ACCOUNT",
                "ACCOUNT_HOLDER",
                "PO_NUM",
                "PO_ITEM",
                "REF_KEY1",
                "REF_KEY2",
                "REF_KEY3",
                "INT_ORDER",
                "WBS_NUM",
                "CASH_CODE",
                "NAMA_CASH_CODE",
                "JENIS",
                "DR_CR_IND",
                "CORP_PMT",
                "AMT_WITH_BASE_LC",
                "AMT_WITH_LC",
                "METODE_PEMBAYARAN",
                "KETERANGAN",
                "STATUS_TRACKING",
                "NO_REK_HOUSE_BANK",
                "INQ_CUSTOMER_NAME",
                "INQ_ACCOUNT_NUMBER",
                "RETRIEVAL_REF_NUMBER",
                "CUSTOMER_REF_NUMBER",
                "CONFIRMATION_CODE",
                "TGL_ACT_BAYAR",
                "OSS_ID",
                "GROUP_ID",
                "SUMBER_DANA",
                "TGL_RENCANA_BAYAR",
                "BANK_BYR",
                "CURR_BAYAR",
                "PARTIAL_IND",
                "AMOUNT_BAYAR",
                "BANK_BENEF",
                "NO_REK_BENEF",
                "NAMA_BENEF",
                "VERIFIED_BY",
                "VERIFIED_ON",
                "TGL_TAGIHAN_DITERIMA",
                "NO_GIRO",
                "DRAFT_IND",
                "BANK_BYR2",
                "BASE_DATE2",
                "CREATE_DATE",
                "MAKER",
                "CHECKER",
                "APPROVER",
                "COUNTER",
                "NOMINAL_DI_BAYAR"));

        for (Map<String, Object> object : data) {
            dataJatuhTempo.add(Arrays.asList(object.get("STATUS"),
                    object.get("POSISI"),
                    object.get("ROLE"),
                    object.get("EMAIL"),
                    object.get("KET"),
                    object.get("COMP_CODE"),
                    object.get("DOC_NO"),
                    object.get("FISC_YEAR"),
                    object.get("DOC_TYPE"),
                    object.get("DOC_DATE"),
                    object.get("DOC_DATE2"),
                    object.get("POST_DATE"),
                    object.get("POST_DATE2"),
                    object.get("ENTRY_DATE"),
                    object.get("ENTRY_DATE2"),
                    object.get("REFERENCE"),
                    object.get("REV_WITH"),
                    object.get("REV_YEAR"),
                    object.get("DOC_HDR_TXT"),
                    object.get("CURRENCY"),
                    object.get("EXCH_RATE"),
                    object.get("REFERENCE_KEY"),
                    object.get("PMT_IND"),
                    object.get("TRANS_TYPE"),
                    object.get("SPREAD_VAL"),
                    object.get("LINE_ITEM"),
                    object.get("OI_IND"),
                    object.get("ACCT_TYPE"),
                    object.get("SPEC_GL"),
                    object.get("BUS_AREA"),
                    object.get("TPBA"),
                    object.get("AMT_LC"),
                    object.get("AMT_TC"),
                    object.get("AMT_WITH_BASE_TC"),
                    object.get("AMOUNT"),
                    object.get("AMT_WITH_TC"),
                    object.get("ASSIGNMENT"),
                    object.get("ITEM_TEXT"),
                    object.get("COST_CTR"),
                    object.get("GL_ACCT"),
                    object.get("CUSTOMER"),
                    object.get("VENDOR"),
                    object.get("BASE_DATE"),
                    object.get("TERM_PMT"),
                    object.get("DUE_ON"),
                    object.get("PMT_BLOCK"),
                    object.get("HOUSE_BANK"),
                    object.get("PRTNR_BANK_TYPE"),
                    object.get("BANK_KEY"),
                    object.get("BANK_ACCOUNT"),
                    object.get("ACCOUNT_HOLDER"),
                    object.get("PO_NUM"),
                    object.get("PO_ITEM"),
                    object.get("REF_KEY1"),
                    object.get("REF_KEY2"),
                    object.get("REF_KEY3"),
                    object.get("INT_ORDER"),
                    object.get("WBS_NUM"),
                    object.get("CASH_CODE"),
                    object.get("NAMA_CASH_CODE"),
                    object.get("JENIS"),
                    object.get("DR_CR_IND"),
                    object.get("CORP_PMT"),
                    object.get("AMT_WITH_BASE_LC"),
                    object.get("AMT_WITH_LC"),
                    object.get("METODE_PEMBAYARAN"),
                    object.get("KETERANGAN"),
                    object.get("STATUS_TRACKING"),
                    object.get("NO_REK_HOUSE_BANK"),
                    object.get("INQ_CUSTOMER_NAME"),
                    object.get("INQ_ACCOUNT_NUMBER"),
                    object.get("RETRIEVAL_REF_NUMBER"),
                    object.get("CUSTOMER_REF_NUMBER"),
                    object.get("CONFIRMATION_CODE"),
                    object.get("TGL_ACT_BAYAR"),
                    object.get("OSS_ID"),
                    object.get("GROUP_ID"),
                    object.get("SUMBER_DANA"),
                    object.get("TGL_RENCANA_BAYAR"),
                    object.get("BANK_BYR"),
                    object.get("CURR_BAYAR"),
                    object.get("PARTIAL_IND"),
                    object.get("AMOUNT_BAYAR"),
                    object.get("BANK_BENEF"),
                    object.get("NO_REK_BENEF"),
                    object.get("NAMA_BENEF"),
                    object.get("VERIFIED_BY"),
                    object.get("VERIFIED_ON"),
                    object.get("TGL_TAGIHAN_DITERIMA"),
                    object.get("NO_GIRO"),
                    object.get("DRAFT_IND"),
                    object.get("BANK_BYR2"),
                    object.get("BASE_DATE2"),
                    object.get("CREATE_DATE"),
                    object.get("MAKER"),
                    object.get("CHECKER"),
                    object.get("APPROVER"),
                    object.get("COUNTER"),
                    object.get("NOMINAL_DI_BAYAR")
            ));
        }
        writeRow(sheetFoto, dataJatuhTempo);
        return workbook;
    }

    private void writeRow(HSSFSheet sheet, List<List<Object>> rowData) {
        int rowNumber = 0;
        for (List<Object> result : rowData) {
            Row row = sheet.createRow(rowNumber++);
            int colNum = 0;
            for (Object field : result) {
                Cell cell = row.createCell(colNum++);
                cell.setCellValue(field != null ? field.toString() : "");
            }
        }
    }

}
