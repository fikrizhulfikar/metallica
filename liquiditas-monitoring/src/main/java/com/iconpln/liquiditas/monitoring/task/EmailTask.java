package com.iconpln.liquiditas.monitoring.task;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.domain.RekapPembayaranAllInvoice;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.EmailUtil;
import com.iconpln.liquiditas.monitoring.utils.NamedMonth;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Import(ValasService.class)
public class EmailTask {

    private static final SimpleDateFormat dayFormat = new SimpleDateFormat("dd");
    private static final SimpleDateFormat monthFormat = new SimpleDateFormat("MM");
    private static final SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");

    @Autowired
    private EmailUtil emailService;

    @Autowired
    private ValasService valasService;

//    @Scheduled(fixedRate = 60000)
//    @Scheduled(cron = "0 5 17 * * ?")
    public void send() {
        Date now = new Date();
        String day = dayFormat.format(now);
        LocalDate localDate = now.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        String year = yearFormat.format(now);
        final String body =
                "<p>Yth Bapak/Ibu,</p><br/><p style=\"text-indent: 30px; text-align: justify;\">Berikut ini kami sampaikan rencana pembayaran yang akan Jatuh Tempo pada hari ini tanggal " + day + " bulan " + NamedMonth.getNamedMonth(localDate.getMonthValue()).getName() + " tahun " + year + " (Hari-H) dan besok (H-1) sesuai dengan data rekapitulasi yang telah terinput dalam Aplikasi. Kami akan melakukan reminder kepada setiap user sebelum tanggal jatuh tempo via email, apabila terdapat perubahan tanggal jatuh tempo mohon untuk dapat melakukan update pada Aplikasi.</p><p style=\"text-indent: 30px; text-align: justify;\">Apabila terdapat tagihan yang tidak terinput dengan baik dan benar dalam aplikasi maka akan berpengaruh pada pengadaan dana Rupiah dan/atau valuta asing untuk pembayaran tagihan tersebut.</p><p style=\"text-indent: 30px; text-align: justify;\">Demikianlah informasi ini kami sampaikan, apabila ada informasi yang kurang jelas Bapak/Ibu dapat menghubungi kami kembali. Atas perhatian dan kerjasamanya diucapkan terima kasih.</p><br/><br/><br>Aplikasi Metallica.";
        List<Map<String, Object>> mapList = valasService.getEmailJatuhTempo();
        List<String> emails = mapList.stream()
                .filter(stringObjectMap -> stringObjectMap.get("email") != null)
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
        emails.forEach(email -> {
            List<RekapPembayaran> rekapPembayarans = valasService.getRekapPembayaranByEmail(email);
            emailService.sendEmailWithAttachment(email, body, "Rekapitulasi Pembayaran", "REKAPITULASI_PEMBAYARAN.xls", rekapPembayarans);
        });
        AppUtils.getLogger(this).debug("Send email.");
    }

//    @Scheduled(fixedRate = 60000)
    public void sendRekapAllEmail(){ //getEmailUsers
        Date now = new Date();
        SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        String date = df.format(now);
        String day = dayFormat.format(now);
        LocalDate localDate = now.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        String year = yearFormat.format(now);
        final String bidyRekapAll = "<p>Yth Bapak/Ibu Pengguna L&rsquo;Metallica<strong>,</strong></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>Bersama ini kami sampaikan Informasi/Data Rekapitulasi Seluruh Rencana Pembayaran per tanggal <strong>"+date+"</strong> sebagaimana terlampir.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>Kami sampaikan juga rencana pembayaran yang direncanakan dibayarkan pada tanggal <strong>"+date+"</strong> untuk dapat ditindaklanjuti dalam penyediaan dana, proses verifikasi oleh user, dan/atau proses penyelesaian pembayaran.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<table width=\"0\">\n" +
                "<tbody>\n" +
                "<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-prop-change: 'Abu khalid maryam' 20200826T1234;\">\n" +
                "<td width=\"696\">\n" +
                "<p>&nbsp;</p>\n" +
                "<p><strong>Butuh Bantuan?</strong></p>\n" +
                "<p><strong>Bagaimana jika rencana pembayaran belum masuk Aplikasi?</strong></p>\n" +
                "<p>Dipastikan proses verifikasi sudah sesuai dengan SOP. Apabila masih belum diketemukan, maka&nbsp; dapat menghubungi helpdesk support LM.</p>\n" +
                "<p><strong>&nbsp;</strong></p>\n" +
                "<p><strong>Bagaimana jika rencana pembayaran tidak dilakukan di hari yang ditentukan (pending)?</strong></p>\n" +
                "<p>User dapat melakukan delete/update data di status Input Data (oss) apabila diperlukan atau merubah tanggal rencana pembayaran melalui proses verifikasi di ERP SAP PLN atas tagihan tersebut.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "</td>\n" +
                "</tr>\n" +
                "<tr style=\"mso-yfti-irow: 1; mso-yfti-lastrow: yes; mso-prop-change: 'Abu khalid maryam' 20200826T1234;\">\n" +
                "<td width=\"696\">\n" +
                "<p>&nbsp;</p>\n" +
                "<p>Email ini dikirimkan melalui system aplikasi L&rsquo;Metallica dan ditujukan kepada pihak terkait yang alamat emailnya terdaftar dalam datasbase PT PLN (Persero). Anda tidak dapat membalas Email ini. Dalam hal dibutuhkan koordinasi lebih lanjut terkait pendaftaran email atau kendala aplikasi, dapat menghubungi Helpdesk L&rsquo;Metallica.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>Pastikan email kami tidak masuk dalam daftar spam Anda dengan menambahkan corpaypln@pln.co.id di kontak Anda.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>&copy; 2020 | PT PLN (Persero)</p>\n" +
                "<p>Jl. Trunojoyo Blok M I/135 Jakarta 12160 Indonesia</p>\n" +
                "</td>\n" +
                "</tr>\n" +
                "</tbody>\n" +
                "</table>";
        List<Map<String, Object>> mapList = valasService.getEmailUsers();
        List<String> emails = mapList.stream()
                .filter(stringObjectMap -> stringObjectMap.get("email") != null)
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
        emails.forEach(email -> {
            List<Map<String, Object>> rekapAllInvoice = valasService.getRekapPembayaranAllInvoiceByEmail(email);
            emailService.sendEmailWithAttachment2(email, bidyRekapAll, "Informasi/Data Rekapitulasi Rencana Pembayaran Tanggal "+date, "REKAPITULASI_PEMBAYARAN.xls", rekapAllInvoice);
        });
        AppUtils.getLogger(this).debug("Send email.");
    }

    public void sendRekapInvoiceLunas(){ //getEmailUsers
        Date now = new Date();
        SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        String date = df.format(now);
        String day = dayFormat.format(now);
        LocalDate localDate = now.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        String year = yearFormat.format(now);
        List<Map<String, Object>> mapList = valasService.getEmailUsers();
        List<String> emails = mapList.stream()
                .filter(stringObjectMap -> stringObjectMap.get("email") != null)
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
        emails.forEach(email -> {
            final String lunasBody = "<p>Yth Bapak/Ibu <strong>"+email+"</strong></p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>Bersama ini kami sampaikan Informasi/Data Pending Persetujuan Pembayaran yang belum dilakukan oleh Approver sampai dengan tanggal <strong>$TGL$</strong> atas tagihan sebagaimana terlampir.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>Sehubungan dengan Pending Persetujuan Pembayaran oleh Approval diatas, sesuai dengan SOP, mohon tindak lanjut (persetujuan/reject/reverse) pada kesempatan pertama melalui link sebagai berikut link ($URL_METALLICA$).</p>\n" +
                    "<ul>\n" +
                    "<li>Jika Proses pembayaran sudah dilakukan, agar dilakukan approval persetujuan pada aplikasi.</li>\n" +
                    "<li>Jika Proses pembayaran dipending/ditunda, agar dilakukan reverse pada ERP SAP PLN untuk dilakukan perubahan data tagihan yang diperlukan oleh user verifikator.</li>\n" +
                    "<li>Jika proses pembayaran masih pending karena belum sampai pada tanggal rencana bayar, approval dapat dilakukan sesuai tanggal rencana bayar atau pada tanggal yang disepakati.</li>\n" +
                    "</ul>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>Sebelum melakukan approval, mohon melakukan refresh page pada aplikasi L&rsquo;Metallica untuk memastikan bahwa anda masih dalam kondisi login.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<table width=\"0\">\n" +
                    "<tbody>\n" +
                    "<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-prop-change: 'Abu khalid maryam' 20200826T1237;\">\n" +
                    "<td width=\"702\">\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p><strong>Butuh Bantuan?</strong></p>\n" +
                    "<p><strong>Bagaimana jika rencana pembayaran belum masuk Aplikasi</strong><strong> atau data tidak sesuai dengan dokumen Hardcopy</strong><strong>?</strong></p>\n" +
                    "<p>Dipastikan bahwa dokumen hardcopy sudah benar dan proses verifikasi sudah sesuai dengan SOP. Apabila masih belum diketemukan atau data salah pada aplikasi, maka&nbsp; dapat menghubungi helpdesk support LM.</p>\n" +
                    "<p><strong>&nbsp;</strong></p>\n" +
                    "<p><strong>Bagaimana jika persetujuan yang dilakukan untuk pembayaran kedepan?</strong></p>\n" +
                    "<p>Persetujuan untuk pembayaran kedepan bisa dilakukan sesuai dengan SOP dan dilaksanakan sesuai dengan wewenang persetujuan pembayaran sesuai kuasa.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p><strong>Bagaimana agar saya tidak mendapatkan email seperti ini?</strong></p>\n" +
                    "<p>Checker/Sign/Countersign telah menyelesaikan proses persetujuan di aplikasi.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "</td>\n" +
                    "</tr>\n" +
                    "<tr style=\"mso-yfti-irow: 1; mso-yfti-lastrow: yes; mso-prop-change: 'Abu khalid maryam' 20200826T1237;\">\n" +
                    "<td width=\"702\">\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>Email ini dikirimkan melalui system aplikasi L&rsquo;Metallica dan ditujukan kepada pihak terkait yang alamat emailnya terdaftar dalam datasbase PT PLN (Persero). Anda tidak dapat membalas Email ini. Dalam hal dibutuhkan koordinasi lebih lanjut terkait pendaftaran email atau kendala aplikasi, dapat menghubungi Helpdesk L&rsquo;Metallica.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>Pastikan email kami tidak masuk dalam daftar spam Anda dengan menambahkan corpaypln@pln.co.id di kontak Anda.</p>\n" +
                    "<p>&nbsp;</p>\n" +
                    "<p>&copy; 2020 | PT PLN (Persero)</p>\n" +
                    "<p>Jl. Trunojoyo Blok M I/135 Jakarta 12160 Indonesia</p>\n" +
                    "</td>\n" +
                    "</tr>\n" +
                    "</tbody>\n" +
                    "</table>\n" +
                    "<p><br /><br /></p>";
            List<Map<String, Object>> rekapAllInvoice = valasService.getRekapPembayaranAllInvoiceByEmail(email);
            emailService.sendEmailWithAttachment2(email, lunasBody, "Informasi/Data Rekapitulasi Rencana Pembayaran Tanggal "+date, "REKAPITULASI_PEMBAYARAN.xls", rekapAllInvoice);
        });
        AppUtils.getLogger(this).debug("Send email.");
    }

}
