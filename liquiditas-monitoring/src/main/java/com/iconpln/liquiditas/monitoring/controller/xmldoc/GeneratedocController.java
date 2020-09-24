package com.iconpln.liquiditas.monitoring.controller.xmldoc;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.service.GenerateDocService;
import com.iconpln.liquiditas.core.xmldoc.DocGenerator;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParseException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Created by athia on 07-Dec-15.
 * rev by Rochmat 19-MAR-2017
 * 1st-modify by zhulfikar79 14-MAY-2020
 */
@RestController
@RequestMapping(path = "/generate_doc/cetak")
public class GeneratedocController {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){ return new JdbcTemplate(dataSource);}

    @Autowired
    private GenerateDocService generateDocService;

    private boolean isgeneratedoc = true;
    private SimpleDateFormat localFormatter = new SimpleDateFormat("dd MMMM yyyy", new Locale("id"));
    private NumberFormat numberFormat = NumberFormat.getNumberInstance(new Locale("in","ID"));
    private String pattern = "###,###.00";

    public GeneratedocController() throws SQLException {
    }

    private Map checkfile(String filename) throws AltException {
        File f = new File(filename);
        Map oke = new HashMap();
        if(f.exists()){
            oke.put("status",01);
            oke.put("filename",filename);
            oke.put("info","File Created");
            return oke;
        }
        else{
            throw new AltException("File tidak ditemukan");
        }
    }

    private void aksiNonaktif() throws AltException{
        throw new AltException("Fitur generate document tidak diaktifkan");
    }

    @RequestMapping(path = "/bukti_kas_multiple")
    public Map buktiKas(@RequestParam("pDocNumbers") String pDocumentNumbers) throws AltException, SQLException, JSONException, ParseException, IOException, JSONParseException {
        Map out = new HashMap();
        if (!isgeneratedoc) aksiNonaktif();
        NumberToWordConverter conv = new NumberToWordConverter();
        JSONArray jsonArray = new JSONArray(pDocumentNumbers);
        String filename = "";
        List<Map<String, Object>> list = new ArrayList<>();
        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            if (jsonObject.getString("metode_pembayaran").equals("GIRO") || jsonObject.getString("metode_pembayaran").equals("INTERNETBANKING")){
                filename = "uploadcorpay/temp/laporan_"+jsonObject.getString("pDocNo");
            }else{
                filename = "uploadcorpay/temp/laporan_corpay_"+jsonObject.getString("pDocNo");
            }

            DocGenerator dg = new DocGenerator();
            System.out.println("Doc Numbers : "+pDocumentNumbers);

            if (jsonObject.getString("metode_pembayaran").equals("GIRO") || jsonObject.getString("metode_pembayaran").equals("INTERNETBANKING")){
                SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                        .withCatalogName("PKG_CORPAY")
                        .withFunctionName("cetak_bukti_kas");
                SqlParameterSource param = new MapSqlParameterSource()
                        .addValue("p_comp_code",jsonObject.getString("pCompCode"))
                        .addValue("p_doc_no", jsonObject.getString("pDocNo"))
                        .addValue("p_fisc_year", jsonObject.getString("pFiscYear"))
                        .addValue("p_line_item", jsonObject.getString("pLineItem"))
                        .addValue("p_ket",jsonObject.getString("pKet"));
                list = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,param);
            }else {
                list = generateDocService.getCetakLampiranCorpay(jsonObject.getString("pCompCode"), jsonObject.getString("pDocNo"), jsonObject.getString("pFiscYear"), jsonObject.getString("pLineItem"),jsonObject.getString("pKet"));

            }

            System.out.println("Hasil Select : "+list);
            JSONObject object = new JSONObject(list.get(0));
            String no_giro = object.getString("NO_GIRO");
            String rawDate = object.getString("TGL_RENCANA_BAYAR");
            Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
            System.out.println("Object Hasil Select : "+object);
            Date n_print_date = new Date();
            SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            dg.addVariable("FISCAL_YEAR", object.getString("FISCAL_YEAR"));
            dg.addVariable("METODE_PEMBAYARAN", (object.getString("METODE_PEMBAYARAN") == null) ? "-" : object.getString("METODE_PEMBAYARAN"));
            dg.addVariable("ALAMAT_HOUSE_BANK", (object.getString("ALAMAT_BANK") == null) ? "-" : object.getString("ALAMAT_BANK"));
            dg.addVariable("REF_NUM", (object.getString("REF_NUM_BANK") == null) ? "-" : object.getString("REF_NUM_BANK"));

            dg.addVariable("NO_URUT","1");
            dg.addVariable("COMP_CODE",object.getString("COMP_CODE"));
            dg.addVariable("DOC_NO", object.getString("DOCUMENT_NUMBER"));
            dg.addVariable("ITEM_TEXT", object.getString("ITEM_TEXT"));
            dg.addVariable("CURR_BAYAR", object.getString("CURR_BAYAR"));
            DecimalFormat decimalFormat = (DecimalFormat) numberFormat;
            decimalFormat.applyPattern(pattern);
            String amount = decimalFormat.format(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",",".")));
            dg.addVariable("AMOUNT_BAYAR", amount);
            dg.addVariable("ID_GROUP", object.getString("ID_GROUP"));
            dg.addVariable("NO_REK_BENEF", object.getString("NO_REK_BENEF"));
            dg.addVariable("BANK_BENEF",object.getString("BANK_BENEF"));
            dg.addVariable("ALAMAT_BANK_BENEF", object.getString("ALAMAT_BANK_BENEF"));
            dg.addVariable("NAMA_VENDOR", object.getString("NAMA_VENDOR"));
            dg.addVariable("ACCOUNT_NAME",object.getString("ACCOUNT_NAME"));
            dg.addVariable("ALAMAT_VENDOR", object.getString("ALAMAT_VENDOR"));
            dg.addVariable("EMAIL_VENDOR", object.getString("EMAIL_VENDOR"));
            if (object.getString("JABATAN").equals("MSB")){
                dg.addVariable("NAMA_APPROVER_SURAT",object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_APPROVER_SURAT",object.getString("DETAIL_COUNTER_SIGNER"));
                dg.addVariable("NAMA_COUNTER_SIGNER_SURAT"," ");
                dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT"," ");
            }else{
                dg.addVariable("NAMA_APPROVER_SURAT", object.getString("NAMA_APPROVER"));
                dg.addVariable("DETAIL_APPROVER_SURAT", object.getString("DETAIL_APPROVER"));
                dg.addVariable("NAMA_COUNTER_SIGNER_SURAT", object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT", object.getString("DETAIL_COUNTER_SIGNER"));
            }
            dg.addVariable("HOUSE_BANK", object.getString("HOUSE_BANK"));
            dg.addVariable("ALAMAT_BANK",object.getString("ALAMAT_BANK"));
            dg.addVariable("NAMA_APPROVER", object.getString("NAMA_APPROVER"));
            dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
            dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
            dg.addVariable("DETAIL_COUNTER_SIGNER", object.getString("DETAIL_COUNTER_SIGNER"));
            dg.addVariable("NO_REK_HOUSE_BANK", object.getString("NO_REK_HOUSE_BANK"));
            String amt = object.getString("AMOUNT_BAYAR").replace(",",".");
            String[] arr = amt.split("\\.");
            String koma = "";
            if (arr.length > 1){
                if (arr[1].equals("00")){
                    koma = "";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }else{
                    koma = "TITIK ";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }
            }
            dg.addVariable("NOMINAL_TERBILANG", conv.toWords(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",",".")))+koma+conv.toCurrency(object.getString("CURR_BAYAR")));
            dg.addVariable("NO_GIRO", object.getString("NO_GIRO"));
            dg.addVariable("TGL_RENCANA_BAYAR", localFormatter.format(tgl_rencana_bayar));
            dg.addVariable("TGL_CETAK",print_df.format(n_print_date));

            String pathtodownload = "";
            String filenamereal = "laporan";
            System.err.println();

            String resultId = null;
            try {
                if(jsonObject.getString("metode_pembayaran").equals("GIRO")) {
                    dg.createDocFromTemplate("template_laporan_giro", filename);
                }else if (jsonObject.getString("metode_pembayaran").equals("INTERNETBANKING")){
                    dg.createDocFromTemplate("template_laporan_cms", filename);
                }else{
                    dg.createDocFromTemplate("template_pembayaran_corpay", filename);
                }
            } catch (Exception e) {
                throw new AltException("Tidak dapat membuat dokumen. " + e.getMessage());
            }

            out.put("createdoc["+index+"]",checkfile(filename + ".docx")) ;
        }
        return out;
    }

    @RequestMapping(path = "/bukti_kas_grouping_multiple")
    public Map buktiKasGroupingMultiple(@RequestParam("pDocNumbers") String pDocumentNumbers) throws AltException, SQLException, JSONException, ParseException, IOException, JSONParseException {
        Map out = new HashMap();
        if (!isgeneratedoc) aksiNonaktif();
        NumberToWordConverter conv = new NumberToWordConverter();
        JSONArray jsonArray = new JSONArray(pDocumentNumbers);
        List<Map<String, Object>> list = new ArrayList<>();
        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String filename = "uploadcorpay/temp/laporan_bkg"+jsonObject.getString("DOC_NO");
            DocGenerator dg = new DocGenerator();
            System.out.println("Doc Numbers : "+pDocumentNumbers);
            System.out.println("Object Loop : "+jsonObject);
            if (jsonObject.getString("METODE_PEMBAYARAN").equals("GIRO") || jsonObject.getString("METODE_PEMBAYARAN").equals("interetbanking")){
                list = generateDocService.getCetakBuktiKasGrouping(jsonObject.getString("COMP_CODE"), jsonObject.getString("DOC_NO"), jsonObject.getString("FISC_YEAR"), jsonObject.getString("KET"));
            }else{
                list = generateDocService.cetakBuktiKasGroupingCorpay(jsonObject.getString("COMP_CODE"), jsonObject.getString("DOC_NO"), jsonObject.getString("FISC_YEAR"), jsonObject.getString("KET"));
            }
            System.out.println("Hasil Select : "+list);
            JSONObject object = new JSONObject(list.get(0));
            System.out.println("Object Hasil Select : "+object);
//            String no_giro = object.getString("NO_GIRO");
            String rawDate = object.getString("TGL_RENCANA_BAYAR");
            Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
            Date n_print_date = new Date();
            SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            dg.addVariable("COMP_CODE",object.getString("COMP_CODE"));
            dg.addVariable("DOC_NO", object.getString("DOC_NO"));
            dg.addVariable("ITEM_TEXT", object.getString("ITEM_TEXT"));
            dg.addVariable("CURR_BAYAR", object.getString("CURR_BAYAR"));
            dg.addVariable("AMOUNT_BAYAR",numberFormat.format(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",","."))));
            dg.addVariable("ID_GROUP", object.getString("ID_GROUP_SAP"));
            dg.addVariable("HOUSE_BANK", object.getString("HOUSE_BANK"));
            dg.addVariable("NAMA_VENDOR", object.getString("VENDOR_NAME"));
            dg.addVariable("NAMA_APPROVER", object.getString("NAMA_APPROVER"));
            dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
            dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
            dg.addVariable("DETAIL_COUNTER_SIGNER", object.getString("DETAIL_COUNTER_SIGNER"));
            dg.addVariable("NO_REK_HOUSE_BANK", object.getString("NO_REK_HOUSE_BANK"));
            String amt = object.getString("AMOUNT_BAYAR").replace(",",".");
            String[] arr = amt.split("\\.");
            String koma = "";
            if (arr.length > 1){
                if (arr[1].equals("00")){
                    koma = "";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }else{
                    koma = "TITIK ";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }
            }
            dg.addVariable("NOMINAL_TERBILANG", conv.toWords(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",",".")))+koma+conv.toCurrency(object.getString("CURR_BAYAR")));
            dg.addVariable("TGL_RENCANA_BAYAR", localFormatter.format(tgl_rencana_bayar));
            dg.addVariable("TGL_CETAK",print_df.format(n_print_date));

            String pathtodownload = "";
            String filenamereal = "laporan";
            System.err.println();

            String resultId = null;
            try {
                dg.createDocFromTemplate("template_laporan_bukti_kas_grouping", filename);
            } catch (Exception e) {
                throw new AltException("Tidak dapat membuat dokumen. " + e.getMessage());
            }

            out.put("createdoc["+index+"]",checkfile(filename + ".docx")) ;
        }
        return out;
    }

    @RequestMapping(path = "/surat_group")
    public Map suratnGroup(@RequestParam("pIdGroup") String pIdGroup, @RequestParam("pMetodePembayaran") String pMetodePembayaran) throws AltException, JSONException, ParseException, IOException, JSONParseException {
        Map out = new HashMap();
        List<Map<String, Object>> list = new ArrayList<>();
        if (!isgeneratedoc) aksiNonaktif();
            String filename = null;
            NumberToWordConverter conv = new NumberToWordConverter();
            DocGenerator dg = new DocGenerator();
            System.out.println("Id Groups : "+pIdGroup);
            list = generateDocService.getCetakSuratGrouping(pIdGroup);
            if (pMetodePembayaran.equals("GIRO") || pMetodePembayaran.equals("INTERNETBANKING")){
                filename = "uploadcorpay/temp/surat_group_"+pIdGroup;
            }else {
                filename = "uploadcorpay/temp/surat_group_corpay_"+pIdGroup;
            }
            System.out.println("Hasil Select : "+list);
            JSONObject object = new JSONObject(list.get(0));
            String no_giro = object.getString("NO_GIRO");
            String rawDate = object.getString("TGL_RENCANA_BAYAR");
            Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
            System.out.println("Object Hasil Select : "+object);
            Date n_print_date = new Date();
            SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            dg.addVariable("TOTAL_TAGIHAN", numberFormat.format(Double.parseDouble(object.getString("TOTAL_TAGIHAN").replace(",","."))));
            dg.addVariable("ID_GROUP", object.getString("ID_GROUP"));
            if (object.getString("JABATAN").equals("MSB")){
                dg.addVariable("NAMA_APPROVER",object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_APPROVER",object.getString("DETAIL_COUNTER_SIGNER"));
                dg.addVariable("NAMA_COUNTER_SIGNER"," ");
                dg.addVariable("DETAIL_COUNTER_SIGNER"," ");
            }else{
                dg.addVariable("NAMA_APPROVER", object.getString("NAMA_APPROVER"));
                dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
                dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_COUNTER_SIGNER", object.getString("DETAIL_COUNTER_SIGNER"));
            }
            dg.addVariable("HOUSE_BANK", (object.getString("HOUSE_BANK") == null ? "-" : object.getString("HOUSE_BANK")));
            dg.addVariable("NO_REK_HOUSE_BANK", (object.getString("NO_REK_HOUSE_BANK") == null) ? "-" : object.getString("NO_REK_HOUSE_BANK"));
            String amt = object.getString("TOTAL_TAGIHAN").replace(",",".");
            String[] arr = amt.split("\\.");
            String koma = "";
            if (arr.length > 1){
                koma = "TITIK ";
                koma = koma + conv.toWords(Double.parseDouble(arr[1]));
            }
            dg.addVariable("NOMINAL_TERBILANG", conv.toWords(Double.parseDouble(object.getString("TOTAL_TAGIHAN").replace(",",".")))+koma+conv.toCurrency(object.getString("CURR_BAYAR")));
            dg.addVariable("BANK_BYR", object.getString("HOUSE_BANK"));
            dg.addVariable("ALAMAT_BANK",object.getString("ALAMAT_BANK"));
            dg.addVariable("NO_GIRO", object.getString("NO_GIRO"));
            dg.addVariable("FISCAL_YEAR", object.getString("FISCAL_YEAR"));
            dg.addVariable("CURR_BAYAR", object.getString("CURR_BAYAR"));
            dg.addVariable("TGL_RENCANA_BAYAR", localFormatter.format(tgl_rencana_bayar));
            dg.addVariable("TGL_CETAK", print_df.format(n_print_date));


            String pathtodownload = "";
            String filenamereal = "laporan";
            System.err.println();
            try {
                if (pMetodePembayaran.equals("GIRO")){
                    dg.createDocFromTemplate("template_surat_giro_group", filename);
                }else if (pMetodePembayaran.equals("INTERNETBANKING")){
                    dg.createDocFromTemplate("template_surat_cms_group", filename);
                }else{
                    dg.createDocFromTemplate("template_surat_corpay_group", filename);
                }
            } catch (Exception e) {
                e.printStackTrace();
//                throw new AltException("Tidak dapat membuat dokumen. " + e.getMessage());
            }

            out.put("result",checkfile(filename + ".docx")) ;
            return out;
    }

    @RequestMapping(path = "/lampiran_group")
    public Map lampiranGroup(@RequestParam("pIdGroup") String pIdGroup) throws AltException, JSONException, ParseException, IOException, JSONParseException {
        Map out = new HashMap();
        if (!isgeneratedoc) aksiNonaktif();
        String filename = "uploadcorpay/temp/lampiran_group_"+pIdGroup;
        NumberToWordConverter converter = new NumberToWordConverter();
        DocGenerator dg = new DocGenerator();
        System.out.println("Id Groups : "+pIdGroup);
        Date n_print_date = new Date();
        SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        Map<String, Object> ini = generateDocService.getLampiranGroup(pIdGroup);

        JSONObject jj = new JSONObject(ini);
        JSONArray total_tagihan =  new JSONArray(jj.getString("OUT_TOTAL"));
        JSONObject kk =  total_tagihan.getJSONObject(0);
        String tagihan = kk.getString("TOTAL_TAGIHAN");

        List<Map<String, Object>> list = (List<Map<String, Object>>) ini.get("return");
        System.out.println("Array List : "+list);
        System.out.println("Hasil Out:"+ini);

        JSONObject object = new JSONObject(list.get(0));
        String no_giro = object.getString("NO_GIRO"); // belum ada NO_GIRO
        String rawDate = object.getString("TGL_RENCANA_BAYAR");
        Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
        System.out.println("Object Hasil Select : "+object);

        dg.addVariable("NO_GIRO",no_giro);
        dg.addVariable("HOUSE_BANK",object.getString("HOUSE_BANK"));
        dg.addVariable("ALAMAT_BANK", object.getString("ALAMAT_BANK"));
        dg.addVariable("CURR_BYR", object.getString("CURR_BAYAR"));
        dg.addVariable("NO_REK_HOUSE_BANK", object.getString("NO_REK_HOUSE_BANK"));
        dg.addVariable("NAMA_APPROVER", object.getString("NAMA_APPROVER"));
        dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
        dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
        dg.addVariable("DETAIL_COUNTER_SIGNER", object.getString("DETAIL_COUNTER_SIGNER"));
        dg.addVariable("TGL_CETAK", print_df.format(n_print_date));

        DecimalFormat df = (DecimalFormat) numberFormat;
        df.applyPattern(pattern);
        String tg = df.format(Double.parseDouble(tagihan));

        dg.addVariable("TOTAL_TAGIHAN",tg);
        String amt = converter.toIndoLocale(tagihan);
        String[] arr = amt.split(",");
        String koma = "";
        if (arr.length > 1){
            System.out.println("Ini Bissmillaah : "+arr[1]);
            if (arr[1].equals("00")){
                koma = "";
                koma = koma + converter.toWords(Double.parseDouble(arr[1]));
            }else{
                koma = "TITIK ";
                koma = koma + converter.toWords(Double.parseDouble(arr[1]));
            }
        }
        dg.addVariable("NOMINAL_TERBILANG", converter.toWords(Double.parseDouble(amt.replace(",",".")))+koma+converter.toCurrency(object.getString("CURR_BAYAR")));

        int no = 1;
        List<Map<String, String>> tabledoc = new ArrayList<>();
            for (Map<String, Object> p : list){
                System.out.println("JJJJL : "+p);

                String comp_code = (String) ((p.get("COMP_CODE") == null) ? "-" : p.get("COMP_CODE"));
                String doc_no = (String) (p.get("DOC_NO") == null ? "-" : p.get("DOC_NO"));
                String item_text = (String) (p.get("ITEM_TEXT") == null ? "-" : p.get("ITEM_TEXT"));
//                String curr_bayar = (String) (p.get("CURR_BAYAR") == null ? "-" : p.get("CURR_BAYAR"));
                DecimalFormat decimalFormat = (DecimalFormat) numberFormat;
                decimalFormat.applyPattern(pattern);
                String amount_bayar = decimalFormat.format(Double.parseDouble(p.get("AMOUNT_BAYAR").toString().replace(",",".")));

                String no_benef = (String) (p.get("NO_REK_BENEF") == null ? "-" : p.get("NO_REK_BENEF"));
                String alamat_bank_benef = (String) (p.get("ALAMAT_BANK_BENEF") == null ? "-" : p.get("ALAMAT_BANK_BENEF"));
                String nama_vendor = (String) (p.get("VENDOR_NAME") == null ? "-" : p.get("VENDOR_NAME"));
                String email_vendor = (String) (p.get("EMAIL_VENDOR") == null ? "-" : p.get("EMAIL_VENDOR"));
                String alamat_vendor = (String) (p.get("ALAMAT_VENDOR") == null ? "-" : p.get("ALAMAT_VENDOR"));
                String bank_byr = (String)(p.get("BANK_BENEF") == null ? "-" : p.get("BANK_BENEF"));
                String group_id = (String)(p.get("ID_GROUP_SAP") == null ? "-" : p.get("ID_GROUP_SAP"));

                Map<String, String> row = new HashMap<>();
                row.put("NO_URUT",String.valueOf(no++));
                row.put("ID_GROUP", group_id);
                row.put("NAMA_VENDOR", nama_vendor);
                row.put("ALAMAT_VENDOR", alamat_vendor);
                row.put("BANK_BENEF", bank_byr);
                row.put("ALAMAT_BANK_BENEF",alamat_bank_benef);
                row.put("NO_REK_BENEF", no_benef);
                row.put("AMOUNT_BAYAR", amount_bayar);
                row.put("ITEM_TEXT", item_text);
                row.put("EMAIL_VENDOR", email_vendor);
                tabledoc.add(row);
            }
            System.out.println("Ini Table Doc : "+tabledoc);
            dg.addTableVariables(tabledoc);
        String pathtodownload = "";
        String filenamereal = "laporan";
        System.err.println();
        try {
            if (!no_giro.equals("-")){
                dg.createDocFromTemplate("template_lampiran_giro_group", filename);
            }else{
                dg.createDocFromTemplate("template_lampiran_cms_group", filename);
            }
        } catch (Exception e) {
//            e.printStackTrace();
                throw new AltException("Tidak dapat membuat dokumen. " + e.getMessage());
        }

        out.put("result",checkfile(filename + ".docx")) ;
        return out;
    }

    @RequestMapping(path = "/bukti_kas_single")
    public Map buktiKasSingle(
            @RequestParam("pDocNumbers") String pDocumentNumbers,
            @RequestParam("pCompCode") String pCompCode,
            @RequestParam("pFiscYear") String pFiscalYear,
            @RequestParam("pLineItem") String pLineItem,
            @RequestParam("pKet") String pKet,
            @RequestParam("pMetodeBayar") String pMetodeBayar
    ) throws AltException, SQLException, JSONException, ParseException, IOException, JSONParseException {
        Map out = new HashMap();
        if (!isgeneratedoc) aksiNonaktif();
            String filename = "uploadcorpay/temp/laporan_"+pDocumentNumbers;
            NumberToWordConverter conv = new NumberToWordConverter();
            DocGenerator dg = new DocGenerator();
            System.out.println("Doc Numbers : "+pDocumentNumbers);
            Date n_print_date = new Date();
            SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            List<Map<String, Object>> list = generateDocService.getCetakBuktiKasSingle(pCompCode, pDocumentNumbers, pFiscalYear, pLineItem, pKet);
            System.out.println("Hasil Select : "+list);
            JSONObject object = new JSONObject(list.get(0));
            String no_giro = object.getString("NO_GIRO");
            String rawDate = object.getString("TGL_RENCANA_BAYAR");
            Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
            System.out.println("Object Hasil Select : "+object);

            dg.addVariable("NO_URUT","1");
            dg.addVariable("COMP_CODE",object.getString("COMP_CODE"));
            dg.addVariable("DOC_NO", object.getString("DOCUMENT_NUMBER"));
            dg.addVariable("ITEM_TEXT", object.getString("ITEM_TEXT"));
            dg.addVariable("CURR_BAYAR", object.getString("CURR_BAYAR"));

            DecimalFormat decimalFormat = (DecimalFormat) numberFormat;
            decimalFormat.applyPattern(pattern);
            String amount = decimalFormat.format(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",",".")));

            dg.addVariable("AMOUNT_BAYAR",amount); //Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",","."))
            dg.addVariable("ID_GROUP", object.getString("ID_GROUP"));
            dg.addVariable("NO_REK_BENEF", object.getString("NO_REK_BENEF"));
            dg.addVariable("BANK_BENEF",object.getString("BANK_BENEF"));
            dg.addVariable("ALAMAT_BANK_BENEF", object.getString("ALAMAT_BANK_BENEF"));
            dg.addVariable("NAMA_VENDOR", object.getString("NAMA_VENDOR"));
            dg.addVariable("ACCOUNT_NAME",object.getString("ACCOUNT_NAME"));
            dg.addVariable("ALAMAT_VENDOR", object.getString("ALAMAT_VENDOR"));
            dg.addVariable("EMAIL_VENDOR", object.getString("EMAIL_VENDOR"));
            if (object.getString("JABATAN").equals("MSB")){
                dg.addVariable("NAMA_APPROVER_SURAT",object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_APPROVER_SURAT",object.getString("DETAIL_COUNTER_SIGNER"));
                dg.addVariable("NAMA_COUNTER_SIGNER_SURAT"," ");
                dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT"," ");
            }else{
                dg.addVariable("NAMA_APPROVER_SURAT", object.getString("NAMA_APPROVER"));
                dg.addVariable("DETAIL_APPROVER_SURAT", object.getString("DETAIL_APPROVER"));
                dg.addVariable("NAMA_COUNTER_SIGNER_SURAT", object.getString("NAMA_COUNTER_SIGNER"));
                dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT", object.getString("DETAIL_COUNTER_SIGNER"));
            }
            dg.addVariable("NAMA_APPROVER", object.getString("NAMA_APPROVER"));
            dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
            dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
            dg.addVariable("DETAIL_COUNTER_SIGNER", object.getString("DETAIL_COUNTER_SIGNER"));
            String amt = conv.toIndoLocale(object.getString("AMOUNT_BAYAR")) ;
            String[] arr = amt.split(",");
            String koma = "";
            if (arr.length > 1){
                if (arr[1].equals("00")){
                    koma = "";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }else{
                    koma = "TITIK ";
                    koma = koma + conv.toWords(Double.parseDouble(arr[1]));
                }
            }

            dg.addVariable("HOUSE_BANK", object.getString("HOUSE_BANK"));
            dg.addVariable("NO_REK_HOUSE_BANK", object.getString("NO_REK_HOUSE_BANK"));
            dg.addVariable("NOMINAL_TERBILANG", conv.toWords(Double.parseDouble(amt.replace(",",".")))+koma+conv.toCurrency(object.getString("CURR_BAYAR")));
            dg.addVariable("BANK_BYR", object.getString("BANK_BYR"));
            dg.addVariable("ALAMAT_BANK",object.getString("ALAMAT_BANK"));
            dg.addVariable("NO_GIRO", object.getString("NO_GIRO"));
            dg.addVariable("FISCAL_YEAR", object.getString("FISCAL_YEAR"));
            dg.addVariable("TGL_RENCANA_BAYAR", localFormatter.format(tgl_rencana_bayar));
            dg.addVariable("AMOUNT_BAYAR", numberFormat.format(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",","."))));
            dg.addVariable("TGL_CETAK",print_df.format(n_print_date));

            String pathtodownload = "";
            String filenamereal = "laporan";
            System.err.println();

            String resultId = null;
            try {
                if(pMetodeBayar.equals("GIRO")) {
                    dg.createDocFromTemplate("template_laporan_giro", filename);
                }else if (pMetodeBayar.equals("INTERNETBANKING")){
                    dg.createDocFromTemplate("template_laporan_cms", filename);
                }
                System.out.println("Berhasil Generate Doc");
            } catch (Exception e) {
                throw new AltException("Tidak dapat membuat dokumen. " + e.getMessage());
            }
//            return checkfile(filename + ".docx");
            System.out.println("Check File :"+filename);
            out.put("createdoc",checkfile(filename + ".docx")) ;
        return out;
    }

    @RequestMapping(path = "/cetak_lampiran_corpay_single")
    public Map cetakLampiranCorpay(
            @RequestParam("pDocNumbers") String pDocumentNumbers,
            @RequestParam("pCompCode") String pCompCode,
            @RequestParam("pFiscYear") String pFiscalYear,
            @RequestParam("pLineItem") String pLineItem,
            @RequestParam("pKet") String pKet,
            @RequestParam("pMetodeBayar") String pMetodeBayar
    ) throws JSONException, ParseException, IOException, JSONParseException, AltException {
        String filename = "uploadcorpay/temp/laporan_corpay_"+pDocumentNumbers;
        NumberToWordConverter conv = new NumberToWordConverter();
        DocGenerator dg = new DocGenerator();
        System.out.println("Doc Numbers : "+pDocumentNumbers);
        Date n_print_date = new Date();
        SimpleDateFormat print_df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Map out = new HashMap();

        List<Map<String, Object>> list =  generateDocService.getCetakLampiranCorpay(pCompCode, pDocumentNumbers, pFiscalYear, pLineItem,pKet);
        JSONObject object = new JSONObject(list.get(0));
        String rawDate = object.getString("TGL_RENCANA_BAYAR");
        Date tgl_rencana_bayar = new SimpleDateFormat("dd/MM/yyyy").parse(rawDate);
        System.out.println("Hasil List Corpay : "+list);

        dg.addVariable("NO_URUT", "1");
        dg.addVariable("ID_GROUP",object.getString("ID_GROUP"));
        dg.addVariable("HOUSE_BANK", object.getString("HOUSE_BANK"));
        dg.addVariable("NO_REK_HOUSE_BANK", object.getString("NO_REK_HOUSE_BANK"));
        dg.addVariable("NAMA_VENDOR",object.getString("NAMA_VENDOR"));
        dg.addVariable("ALAMAT_VENDOR", object.getString("ALAMAT_VENDOR"));
        dg.addVariable("ITEM_TEXT",object.getString("ITEM_TEXT"));
        dg.addVariable("DOC_NO",object.getString("DOCUMENT_NUMBER"));
        dg.addVariable("CURR_BAYAR",object.getString("CURR_BAYAR"));
        dg.addVariable("DETAIL_COUNTER_SIGNER",object.getString("DETAIL_COUNTER_SIGNER"));
        dg.addVariable("NAMA_COUNTER_SIGNER", object.getString("NAMA_COUNTER_SIGNER"));
        dg.addVariable("DETAIL_APPROVER", object.getString("DETAIL_APPROVER"));
        dg.addVariable("NAMA_APPROVER",object.getString("NAMA_APPROVER"));
        dg.addVariable("ALAMAT_HOUSE_BANK", object.getString("ALAMAT_BANK"));
        dg.addVariable("FISCAL_YEAR",object.getString("FISCAL_YEAR"));
        dg.addVariable("METODE_PEMBAYARAN", object.getString("METODE_PEMBAYARAN"));
        if (object.getString("JABATAN").equals("MSB")){
            dg.addVariable("NAMA_APPROVER_SURAT",object.getString("NAMA_COUNTER_SIGNER"));
            dg.addVariable("DETAIL_APPROVER_SURAT",object.getString("DETAIL_COUNTER_SIGNER"));
            dg.addVariable("NAMA_COUNTER_SIGNER_SURAT"," ");
            dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT"," ");
        }else{
            dg.addVariable("NAMA_APPROVER_SURAT", object.getString("NAMA_APPROVER"));
            dg.addVariable("DETAIL_APPROVER_SURAT", object.getString("DETAIL_APPROVER"));
            dg.addVariable("NAMA_COUNTER_SIGNER_SURAT", object.getString("NAMA_COUNTER_SIGNER"));
            dg.addVariable("DETAIL_COUNTER_SIGNER_SURAT", object.getString("DETAIL_COUNTER_SIGNER"));
        }

        dg.addVariable("REF_NUM",(object.getString("REF_NUM_BANK") == null) ? "-" : object.getString("REF_NUM_BANK"));
        dg.addVariable("BANK_BENEF",object.getString("BANK_BENEF"));
        dg.addVariable("ACCOUNT_NAME",object.getString("ACCOUNT_NAME"));
        dg.addVariable("NO_REK_BENEF",object.getString("NO_REK_BENEF"));
        String amt = conv.toIndoLocale(object.getString("AMOUNT_BAYAR")) ;
        String[] arr = amt.split(",");
        String koma = "";
        if (arr.length > 1){
            if (arr[1].equals("00")){
                koma = "";
                koma = koma + conv.toWords(Double.parseDouble(arr[1]));
            }else{
                koma = "TITIK ";
                koma = koma + conv.toWords(Double.parseDouble(arr[1]));
            }
        }
        dg.addVariable("NOMINAL_TERBILANG", conv.toWords(Double.parseDouble(amt.replace(",",".")))+koma+conv.toCurrency(object.getString("CURR_BAYAR")));
        dg.addVariable("TGL_RENCANA_BAYAR", localFormatter.format(tgl_rencana_bayar));
        dg.addVariable("AMOUNT_BAYAR", numberFormat.format(Double.parseDouble(object.getString("AMOUNT_BAYAR").replace(",","."))));
        dg.addVariable("ALAMAT_BANK_BENEF", object.getString("ALAMAT_BANK_BENEF"));
        dg.addVariable("EMAIL_VENDOR", object.getString("EMAIL_VENDOR"));
        dg.addVariable("TGL_CETAK",print_df.format(n_print_date));
        try {
            dg.createDocFromTemplate("template_pembayaran_corpay",filename);
            out.put("success", true);
        } catch (Exception e){
            e.printStackTrace();
        }
        out.put("createdoc",checkfile(filename + ".docx")) ;
        return out;
    }

    @RequestMapping(path = "/cetak_struk_corpay")
    public Map cetakStrukCorpaySingle(
            @RequestParam("pCompCode") String pCompCode,
            @RequestParam("pDocNo") String pDocNo,
            @RequestParam("pFiscalYear") String pFiscalYear,
            @RequestParam("pLineItem") String pLineItem,
            @RequestParam("pKet") String pKet
    ) throws JSONException, AltException{
        String filename = "uploadcorpay/temp/corpay_lunas_"+pDocNo;
        DocGenerator dg = new DocGenerator();
        Map out = new HashMap();
        List<Map<String, Object>> list = generateDocService.cetakStrukCorpay(pCompCode, pDocNo, pFiscalYear, pLineItem, pKet);
        JSONObject object = new JSONObject(list.get(0));
        dg.addVariable("TRX_STATUS", object.getString("TRX_STATUS"));
        dg.addVariable("REF_NUM_BANK", object.getString("REF_NUM_BANK"));
        dg.addVariable("FROM_ACCOUNT", object.getString("FROM_ACCOUNT"));
        dg.addVariable("AMOUNT", object.getString("AMOUNT"));
        dg.addVariable("TRANSACTION_PURPOSE", object.getString("TRANSACTION_PURPOSE"));
        dg.addVariable("REMARKS", object.getString("REMARKS"));
        dg.addVariable("FINALIZE_PAYMENT_FLAG", object.getString("FINALIZE_PAYMENT_FLAG"));
        dg.addVariable("BENEF_REFERENCE_NO", object.getString("BENEF_REFERENCE_NO"));
        dg.addVariable("TO_ACCOUNT", object.getString("NO_REK_BENEF")+"/"+object.getString("NAMA_BENEF"));
        dg.addVariable("TO_ACCOUNT_TYPE", object.getString("TO_ACCOUNT_TYPE"));
        dg.addVariable("NOTIFICATION_FLAG", object.getString("NOTIFICATION_FLAG"));
        dg.addVariable("REMITTER_REFERENCE_NO", object.getString("REMITTER_REFERENCE_NO"));
        dg.addVariable("EMAIL_BENEF", object.getString("EMAIL_BENEF"));
        dg.addVariable("TGL_PAYMENT", object.getString("TGL_LUNAS"));
        dg.addVariable("PAYMENT_MODE", "SCHEDULED");
        dg.addVariable("METODE_PEMBAYARAN", object.getString("METODE_PEMBAYARAN"));
        dg.addVariable("INSTRUCTION_MODE", object.getString("INSTRUCTION_MODE"));
        try {
            dg.createDocFromTemplate("template_struk_corpay",filename);
        }catch (Exception err){
            err.printStackTrace();
        }
        out.put("createdoc",checkfile(filename + ".docx")) ;
        return out;
    }


    @GetMapping(path = "/downloadfile/{fileName:.+}")
    public ResponseEntity downloadSingleFile(@PathVariable String fileName){
        Path path = Paths.get("uploadcorpay/temp/"+fileName);
        Resource resource = null;
        try{
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+ resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping(path = "/downloadfile/zip",produces = "application/zip")
    public void zipDownload(@RequestParam List<String> name, HttpServletResponse response) throws IOException {
        Date date = new Date();
        String zipFileName = String.valueOf(date.getTime())+".zip";
        FileOutputStream fos = new FileOutputStream("reportCompressed.zip");
        ZipOutputStream zipout = new ZipOutputStream(fos);
        for (String filename : name){
            FileSystemResource systemResource = new FileSystemResource("uploadcorpay/temp/"+filename);
            FileInputStream fis = new FileInputStream(systemResource.getFilename());
            ZipEntry zipEntry = new ZipEntry(systemResource.getFilename());
            zipEntry.setSize(systemResource.contentLength());
            zipout.putNextEntry(zipEntry);
            StreamUtils.copy(systemResource.getInputStream(), zipout);
            zipout.closeEntry();
        }
        zipout.finish();
        zipout.close();
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+ zipFileName +"\"");
    }

}
