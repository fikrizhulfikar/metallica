package com.iconpln.liquiditas.fcm.service;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.service.ValasService;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.apache.commons.codec.CharEncoding;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Email service.
 * @author Langkuy <contact@ardikars.com>
 */
@Service("emailService")
@PropertySource("classpath:application.properties")
public class EmailService {

    @Value("${mail.sender}")
    private String from;

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
            e.printStackTrace();
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
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
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
