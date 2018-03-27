package com.iconpln.liquiditas.scheduler.service;

import com.iconpln.liquiditas.core.domain.PembelianValas;
import com.iconpln.liquiditas.core.domain.SaldoRekening;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/**
 * Created by israjhaliri on 9/29/17.
 */
@Service
public class FtpService {

    @Value("${server.ftp}")
    String server;

    @Value("${port.ftp}")
    int port;

    @Value("${username.ftp}")
    String user;

    @Value("${password.ftp}")
    String pass;

    @Value("${path.file.saldo}")
    String pathSaldo;

    @Value("${path.file.trvalas}")
    String pathValas;

    public List<SaldoRekening> processingFtpSaldo(String delimiter) {

        List<SaldoRekening> saldoRekeningList = new ArrayList<>();
        FTPClient ftpClient = new FTPClient();
        try {

            AppUtils.getLogger(this).info("SERVER : {} PORT  : {}", server, port);

            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

            String date = AppUtils.getDateByFormat("yyyyMMdd");
            String remoteFile = pathSaldo+File.separator+"TransaksiSaldo_"+date+".txt";
            InputStream inputStream = ftpClient.retrieveFileStream(remoteFile);
            if (inputStream == null) {
                AppUtils.getLogger(this).info("NO FILE SALDO FOR: {}", remoteFile);
            } else {
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                String value;
                while ((value = reader.readLine()) != null) {
                    String valueArr[];
                    valueArr = value.split(delimiter);

                    HashSet<String> charToRmv = new HashSet<>();
                    charToRmv.add(".");
                    charToRmv.add(",");

                    SaldoRekening saldoRekening = new SaldoRekening();
                    saldoRekening.setCompanyCode(valueArr[0]);
                    saldoRekening.setSendingBank(valueArr[1]);
                    saldoRekening.setStatementDate(valueArr[2]);
                    saldoRekening.setBankAccount(valueArr[3]);
                    saldoRekening.setGlAccount(valueArr[4]);
                    saldoRekening.setChartOfAccount(valueArr[5]);
                    saldoRekening.setCurrency(valueArr[6]);
                    saldoRekening.setEndingAmount(valueArr[7]);
                    saldoRekening.setHousebank(valueArr[8]);
                    saldoRekening.setAccountId(valueArr[9]);

                    AppUtils.getLogger(this).info("SALDO REKENING OUT : {}", saldoRekening.toString());
                    saldoRekeningList.add(saldoRekening);
                }
            }

        } catch (IOException ex) {
            AppUtils.getLogger(this).error(ex.getMessage());

        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (IOException ex) {
                AppUtils.getLogger(this).error(ex.getMessage());
            }
        }

        return saldoRekeningList;
    }

    public List<PembelianValas> processingFtpValas(String delimiter, String date) {

        List<PembelianValas> pembelianValaseList = new ArrayList<>();
        FTPClient ftpClient = new FTPClient();
        try {

            AppUtils.getLogger(this).info("SERVER : {} PORT  : {}", server, port);

            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

            String dateFile = AppUtils.getDateByFormat("yyyyMMdd");
            String remoteFile = pathValas+File.separator+"TransaksiValas_"+dateFile+".txt";
            InputStream inputStream = ftpClient.retrieveFileStream(remoteFile);

            if (inputStream == null) {
                AppUtils.getLogger(this).info("NO FILE TR VALAS FOR: {}", remoteFile);
            } else {
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                String value;
                while ((value = reader.readLine()) != null) {
                    String valueArr[];
                    valueArr = value.split(delimiter);

                    HashSet<String> charToRmv = new HashSet<>();
                    charToRmv.add(".");
                    charToRmv.add(",");

                    PembelianValas pembelianValas = new PembelianValas();
                    pembelianValas.setIdBeliValas(null);
                    pembelianValas.setCurrency(valueArr[7]);
                    pembelianValas.setTglPosting(valueArr[1].replace(".", "-"));
                    pembelianValas.setBankPengirim(valueArr[3]);
                    pembelianValas.setBankPenerima(valueArr[5]);
                    pembelianValas.setPembelian(valueArr[6]);
                    pembelianValas.setKurs(valueArr[8]);
                    pembelianValas.setKonversiIdr(valueArr[9]);
                    pembelianValas.setNoSettlement(Integer.parseInt(valueArr[10]));
                    pembelianValas.setPayReq(Integer.parseInt(valueArr[11]));
                    pembelianValas.setDoc1(Integer.parseInt(valueArr[12]));
                    pembelianValas.setDoc2(Integer.parseInt(valueArr[13]));
                    pembelianValas.setCreateDate(date);
                    pembelianValas.setCreateBy("VALAS SCHEDULER");
                    pembelianValas.setUpdateDate(null);
                    pembelianValas.setUpdateBy(null);

                    AppUtils.getLogger(this).info("PEMBELIAN VALAS OUT : {}", pembelianValas);
                    pembelianValaseList.add(pembelianValas);

                }
            }

        } catch (IOException ex) {
            AppUtils.getLogger(this).error(ex.getMessage());

        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (IOException ex) {
                AppUtils.getLogger(this).error(ex.getMessage());
            }
        }
        return pembelianValaseList;
    }
}
