package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.*;

import org.springframework.core.io.ResourceLoader;

/**
 * Created by Elvan.D on 1/23/2018
 */
@RestController
@RequestMapping("/api_operator/placement")
public class PlacementController {

    @Autowired
    ValasService valasService;

    @Autowired
    DashboardService dashboardService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_placement_awal", method = RequestMethod.GET)
    public Map getData(@RequestParam(value = "tglAkhir", defaultValue = "") String tglAkhir) {
        try {
            return valasService.getPlacementAwal(tglAkhir);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //potensi pendapatan
    @RequestMapping(value = "/get_potensi", method = RequestMethod.GET)
    public Map getListPotensi() {
        try {
            return valasService.getListPotensi();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_saldo_potensi", method = RequestMethod.POST)
    public Map insSaldoPotensi(
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pJumlah", defaultValue = "") String pJumlah
    ) {
        try {
            return valasService.insSaldoPotensi(pKodeBank, pJumlah);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //penarikan kmk
    @RequestMapping(value = "/get_list_penarikan_kmk", method = RequestMethod.GET)
    public Map getListPenarikanKmk() {
        try {
            return valasService.getListKmk();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_saldo_penarikan_kmk", method = RequestMethod.POST)
    public Map insSaldoPenarikanKmk(
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pJumlah", defaultValue = "") String pJumlah
    ) {
        try {
            return valasService.insSaldoKmk(pKodeBank, pJumlah);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    //penerimaan subsidi
   /* @RequestMapping(value = "/get_penerimaan_subsidi", method = RequestMethod.GET)
    public Map getListPenerimaanSubsidi(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ) {
        try {
            return valasService.getListKmkSubsidi(pJenis);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }*/

    @RequestMapping(value = "/ins_saldo_penerimaan_subsidi", method = RequestMethod.POST)
    public Map insSaldoPenerimaanSubsidi(
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank,
            @RequestParam(value = "pJumlah", defaultValue = "") String pJumlah
    ) {
        try {
            return valasService.insSaldoKmk(pKodeBank, pJumlah);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    @RequestMapping(value = "/get_sumber_placement", method = RequestMethod.GET)
    public Map getSumberPlacement() {
        try {
            return valasService.getSumberPlacement();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_list_placement", method = RequestMethod.GET)
    public Map getListPlacement() {
        try {
            return valasService.getListPlacement();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_detil_sumber_dana", method = RequestMethod.GET)
    public Map getDetilSumberDana(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pJenisSumberDana", defaultValue = "") String pJenisSumberDana
    ) {
        try {
            return valasService.getDetilSumberdana(pJenis, pJenisSumberDana);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_placement", method = RequestMethod.POST)
    public Map insPlacement(
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pReceipt", defaultValue = "") String pReceipt,
            @RequestParam(value = "pKmk", defaultValue = "") String pKmk,
            @RequestParam(value = "pSubsidi", defaultValue = "") String pSubsidi
    ) {
        try {
            return valasService.insPlacement(pBank, pReceipt, pKmk, pSubsidi);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_history_placement", method = RequestMethod.POST)
    public Map insHistoryPlacement(
            @RequestParam(value = "pBankTujuan", defaultValue = "") String pBankTujuan,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pJenisSumberDana", defaultValue = "") String pJenisSumberDana,
            @RequestParam(value = "pNilai", defaultValue = "") String pNilai,
            @RequestParam(value = "pBankSumberDana", defaultValue = "") String pBankSumberDana,
            @RequestParam(value = "sessionId", defaultValue = "") String sessionId
    ) {
        try {
            return valasService.insHistoryPlacementTmp(pBankTujuan, pJenis, pJenisSumberDana, pNilai, pBankSumberDana, sessionId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_history_placement_main", method = RequestMethod.POST)
    public Map insHistoryPlacementMain(
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "sessionId", defaultValue = "") String sessionId,
            @RequestParam(value = "pJenisSumber", defaultValue = "") String pJenisSumber
    ) {
        try {
            return valasService.insHistoryPlacementMain(pJenis, pJenisSumber, sessionId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/xls", method = RequestMethod.GET)
    public String export(
            HttpServletResponse response) {
        try {

            String title;
            String namaFile;
            title = "PLACEMENT";
            namaFile = "placement.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            Map<String, Object> dataSumberPlacement = valasService.getSumberPlacement();
            List<Map<String, Object>> tempMapPlacement = (List<Map<String, Object>>) valasService.getListPlacement().get("return");

            Map<String, Object> mapPlacement; // Untuk memastika data di buat ulang maka di inisialisai di dalam FOR
            Map<String, Object> mapValas = new HashMap<>();
            Map<String, Object> mapImprest = new HashMap<>();
            Map<String, Object> mapImpor = new HashMap<>();
            Map<String, Object> mapInvestasi = new HashMap<>();
            Map<String, Object> mapOperasi = new HashMap<>();
            List<Map<String, Object>> impress = new ArrayList<>();
            List<Map<String, Object>> valas = new ArrayList<>();
            List<Map<String, Object>> investasi = new ArrayList<>();
            List<Map<String, Object>> impor = new ArrayList<>();
            List<Map<String, Object>> operasi = new ArrayList<>();
            for (Map<String, Object> param : tempMapPlacement) {
                //mapPlacement = new HashMap<>();
                for (Map.Entry<String, Object> entry : param.entrySet()) {
                    String bank = param.get("NAMA_BANK").toString();
                    //mapPlacement.put(entry.getKey(), entry.getValue());
                    if (param.get("JENIS").equals("imprest" )) {
                        mapImprest.put(entry.getKey()+"_"+bank, entry.getValue());
                    }

                    if (param.get("JENIS").equals("valas")) {
                        mapValas.put(entry.getKey()+"_"+bank, entry.getValue());
                    }

                    if (param.get("JENIS").equals("investasi")) {
                        mapInvestasi.put(entry.getKey()+"_"+bank, entry.getValue());
                    }

                    if (param.get("JENIS").equals("impor")) {
                        mapImpor.put(entry.getKey()+"_"+bank, entry.getValue());
                    }

                    if (param.get("JENIS").equals("operasi")) {
                        mapOperasi.put(entry.getKey()+"_"+bank, entry.getValue());
                    }
                }
            }
            if(!mapValas.isEmpty()){
                valas.add(mapValas);
            }
            if(!mapInvestasi.isEmpty()){
                investasi.add(mapInvestasi);
            }
            if(!mapImprest.isEmpty()){
                impress.add(mapImprest);
            }
            if(!mapOperasi.isEmpty()){
                operasi.add(mapOperasi);
            }
            if(!mapImpor.isEmpty()){
                impor.add(mapImpor);
            }

            Map<String, Object> params = valasService.getPlacementAwal("");
            List<Map<String, Object>> maps = (List<Map<String, Object>>) params.get("return");
            //list untuk saldo awal
            List<Map<String, Object>> listPlacementValas = new ArrayList<>();
            List<Map<String, Object>> listPlacementAwalValas = new ArrayList<>(1);
            List<Map<String, Object>> listPlacementAwalImpor = new ArrayList<>(1);
            List<Map<String, Object>> listPlacementAwalImprest = new ArrayList<>(1);
            List<Map<String, Object>> listPlacementAwalInvestasi = new ArrayList<>(1);
            List<Map<String, Object>> listPlacementAwalOperasi = new ArrayList<>(1);
            Map<String, Object> tempValasAwal = new HashMap<>();
            //list untuk saldo pertanggal
            List<Map<String, Object>> listPlacementImprest = new ArrayList<>();
            List<Map<String, Object>> listPlacementImpor = new ArrayList<>();
            List<Map<String, Object>> listPlacementOperasi = new ArrayList<>();
            List<Map<String, Object>> listPlacementInvestasi = new ArrayList<>();
            AppUtils.getLogger(this).info("data rekap : {}, report : {}", "sana", "sini");
            for (Map<String, Object> param : maps) {
                Map<String, Object> temp = new HashMap<>();
                String bank = param.get("NAMA_BANK").toString();
                if (bank.equals("MANDIRI")) {
                    tempValasAwal.put("SALDO_AWAL_MANDIRI", param.get("SALDO_AWAL"));
                }
                if (bank.equals("BNI")) {
                    tempValasAwal.put("SALDO_AWAL_BNI", param.get("SALDO_AWAL"));
                }
                if (bank.equals("BRI")) {
                    tempValasAwal.put("SALDO_AWAL_BRI", param.get("SALDO_AWAL"));
                }
                if (bank.equals("BUKOPIN")) {
                    tempValasAwal.put("SALDO_AWAL_BUKOPIN", param.get("SALDO_AWAL"));
                }
                for (Map.Entry<String, Object> entry : param.entrySet()) {
                    temp.put(bank + "_" + entry.getKey(), entry.getValue());
                }

                if (param.get("JENIS").toString().equals("valas")) {
                    listPlacementValas.add(temp);
                    if (listPlacementAwalValas.size() == 0) {
                        listPlacementAwalValas.add(tempValasAwal);
                    }
                }
                if (param.get("JENIS").toString().equals("imprest")) {
                    listPlacementImprest.add(temp);
                    if (listPlacementAwalImprest.size() == 0) {
                        listPlacementAwalImprest.add(tempValasAwal);
                    }
                }
                if (param.get("JENIS").toString().equals("impor")) {
                    listPlacementImpor.add(temp);
                    if (listPlacementAwalImpor.size() == 0) {
                        listPlacementAwalImpor.add(tempValasAwal);
                    }
                }
                if (param.get("JENIS").toString().equals("investasi")) {
                    listPlacementInvestasi.add(temp);
                    if (listPlacementAwalInvestasi.size() == 0) {
                        listPlacementAwalInvestasi.add(tempValasAwal);
                    }
                }
                if (param.get("JENIS").toString().equals("operasi")) {
                    listPlacementOperasi.add(temp);
                    if (listPlacementAwalOperasi.size() == 0) {
                        listPlacementAwalOperasi.add(tempValasAwal);
                    }
                }
            }
            Map param = new HashMap();
            param.put("TITLE", title);
            param.put("LISTPLACEMENT", tempMapPlacement);
            param.put("VALAS", valas);
            param.put("IMPOR", impor);
            param.put("IMPREST", impress);
            param.put("INVESTASI", investasi);
            param.put("OPERASI", operasi);
            param.put("LISTSUMBERPLACEMENT", dataSumberPlacement.get("return"));
            param.put("LISTPLACEMENTVALAS", listPlacementValas);
            param.put("LISTPLACEMENTIMPOR", listPlacementImpor);
            param.put("LISTPLACEMENTIMPREST", listPlacementImprest);
            param.put("LISTPLACEMENTOPERASI", listPlacementOperasi);
            param.put("LISTPLACEMENTINVESTASI", listPlacementInvestasi);
            param.put("LISTPLACEMENTAWALVALAS", listPlacementAwalValas);
            param.put("LISTPLACEMENTAWALIMPOR", listPlacementAwalImpor);
            param.put("LISTPLACEMENTAWALIMPREST", listPlacementAwalImprest);
            param.put("LISTPLACEMENTAWALINVESTASI", listPlacementAwalInvestasi);
            param.put("LISTPLACEMENTAWALOPERASI", listPlacementAwalOperasi);
            AppUtils.getLogger(this).info("data rekap : {}, report : {}", "ISI LIST PLACEMENT VALAS", listPlacementValas + "");
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/placement.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls_detail", method = RequestMethod.GET)
    public String export(
            HttpServletResponse response, @RequestParam(value = "idJenis", defaultValue = "") String idJenis) {
        try {

            String title;
            String namaFile;

            String[] jenisArray = {"", "OPERASI", "INVESTASI", "IMPREST", "IMPOR", "VALAS"};
            title = "PLACEMENT DETAIL " + jenisArray[Integer.parseInt(idJenis)];
            namaFile = "PLACEMENT_DETAIL_" + jenisArray[Integer.parseInt(idJenis)] + ".xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listDetailPlacement = (List<Map<String, Object>>) dashboardService.getReportDetailPlacement(idJenis).get("return");

            AppUtils.getLogger(this).info("data rekap : {}, report : {}", "sana", "sini");
            Map param = new HashMap();
            param.put("TITLE", title);
            param.put("LISTDETAILPLACEMENT", listDetailPlacement);
            AppUtils.getLogger(this).info("data rekap : {}, report : {}", "ISI LIST DETAIL PLACEMENT", listDetailPlacement + "");
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/placement_detail.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }
}
