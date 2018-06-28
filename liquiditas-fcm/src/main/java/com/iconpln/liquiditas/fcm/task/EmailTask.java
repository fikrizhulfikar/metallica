package com.iconpln.liquiditas.fcm.task;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.fcm.service.EmailService;
import java.text.SimpleDateFormat;
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
    private EmailService emailService;

    @Autowired
    private ValasService valasService;

    @Scheduled(cron = "0 0 7 * * ?")
    public void send() {
        Date now = new Date();
        String day = dayFormat.format(now);
        String month =  monthFormat.format(now);
        String year = yearFormat.format(now);
        final String body =
                "Yth Bapak/Ibu,\n" +
                "\n" +
                "Berikut ini kami sampaikan rencana pembayaran yang akan Jatuh Tempo pada hari ini tanggal "+day+" bulan "+month+" Tahun "+year+" (Hari - H) dan besok (H-1) sesuai dengan data rekapitulasi yang telah terinput dalam Aplikasi. Kami akan melakukan reminder kepada setiap user sebelum tanggal jatuh tempo via email, apabila terdapat perubahan tanggal jatuh tempo mohon untuk dapat melakukan update pada Aplikasi.\n" +
                "Apabila terdapat tagihan yang tidak terinput dengan baik dan benar dalam aplikasi maka akan berpengaruh pada pengadaan dana Rupiah dan/atau valuta asing untuk pembayaran tagihan tersebut\n" +
                "\n" +
                "Demikianlah informasi ini kami sampaikan, apabila ada informasi yang kurang jelas Bapak/Ibu dapat menghubungi kami kembali.\n" +
                "\n" +
                "Atas perhatian dan kerjasamanya diucapkan terima kasih.\n" +
                "\n" +
                "Aplikasi Metallica.";
        List<Map<String, Object>> mapList = valasService.getEmailJatuhTempo();
        List<String> emails = mapList.stream()
                .filter(stringObjectMap -> stringObjectMap.get("email") != null)
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
            emails.stream().forEach(email -> {
            List<RekapPembayaran> rekapPembayarans = valasService.getRekapPembayaranByEmail(email);
            emailService.sendEmailWithAttachment(email, body, "Rekap Pembayaran", "REKAP_PEMBAYARAN.xls", rekapPembayarans);
        });
    }

}
