package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.DashboardService;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 8/28/17.
 */
@RestController
@RequestMapping("/api_operator/api_report")
public class ReportController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/xls_example", method = RequestMethod.GET)
    public String export(HttpServletRequest request, HttpServletResponse response) {
        try {

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"report-example.xls\"");

            Map param = new HashMap();
            param.put("EXAMPLE", "israj.haliri@gmail.com");
            List<Map<String,Object>> listDetail = new ArrayList<>();
            Map detail = new HashMap();
            detail.put("VALUE","value detail No. 1");
            listDetail.add(detail);
            detail.put("VALUE","value detail No. 2");
            listDetail.add(detail);
            param.put("DETAILS",listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/report-example.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        }  catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :"+e.getMessage();
        }
    }

    @GetMapping(path = "/saldo_awal")
    public Map listDashboardSaldo(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboard(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/saldo_realisasi")
    public Map listDashboardRealisasi(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRealisasi(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/per_bank")
    public Map listDashboardPerBank(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardBank(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/proyeksi_kebutuhan_pengadaan_valas")
    public Map listProyeksiKebutuhanPengadaanValas(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getProyeksiPengadaanKebutuhanValas(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/ins_pengadaan_valas", method = RequestMethod.POST)
    public Map insPengadaanValas(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) {
        try {
            return dashboardService.insPengadaanValas(pData);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/jenis_pembayaran")
    public Map listDashboardJenisPembayaran(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardPembayaran(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/jenis_rekening")
    public Map listDashboardJenisRekening(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRekening(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(path = "/get_dashboard_real_bank")
    public Map getListRealisassiBankCurrency(@RequestParam(value = "ptanggalawal") String tgl_awal, @RequestParam(value = "ptanggalakhir") String tgl_akhir){
        List<Map<String, Object>> list =  new ArrayList<>();

        try {
            list = dashboardService.getDahsboardRealBank(tgl_awal,tgl_akhir);
        }catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    //Update Senin 17/2/2020

    @GetMapping(path = "/get_dashboard_rencana_vendor")
    public Map getListRencanaPembayaranPerVendor(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();
        try{
            list = dashboardService.getDashboardRencanaVendor(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @GetMapping(path = "/get_dashboard_real_vendor")
    public Map getListRealisasiPembayaranPerVendor(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();
        try{
            list = dashboardService.getDashboardRealVendor(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @RequestMapping(path = "/get_dashboard_real_curr")
    public Map getListRealisassiBankCurrency(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list =  new ArrayList<>();

        try {
            list = dashboardService.getDahsboardRealBankCurr(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @GetMapping(path = "/get_dashboard_real_cashcode")
    public Map getListRealisasiCashcode(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRealCashcode(tanggal);
        }catch (Exception e) {
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data",list);
        return mapData;
    }

    @GetMapping(path = "/get_dashboard_real_jenis")
    public Map getListRealisasiPembayaranJenis(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRealJenis(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @GetMapping(path = "/get_dashboard_rencana_imprest")
    public Map getListRencanaImprest(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRencanaImprest(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @GetMapping(path = "/get_dashboard_recana_valas")
    public Map getListTagihanCahscode(@RequestParam(value = "ptanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRencanaValas(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data", list);
        return mapData;
    }

    @GetMapping(path = "/valuta_asing")
    public Map listDashboardPenerimaanOperasiValutaAsing(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardPenerimaanOperasiValutaAsing(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/rupiah")
    public Map listDashboardPenerimaanOperasiRupiah(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardPenerimaanOperasiRupiah(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_valas")
    public Map listDashboardValas(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardValas(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_valas2")
    public Map listDashboardValas2(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardValas2(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_valas3")
    public Map listDashboardValas3(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardValas3(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_valas4")
    public Map listDashboardValas4(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardValas4(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah")
    public Map listDashboardRupiah(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah2")
    public Map listDashboardRupiah2(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah2(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah3")
    public Map listDashboardRupiah3(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah3(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah4")
    public Map listDashboardRupiah4(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah4(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah5")
    public Map listDashboardRupiah5(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah5(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah6")
    public Map listDashboardRupiah6(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah6(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/dash_rupiah7")
    public Map listDashboardRupiah7(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRupiah7(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/giro_special_rate")
    public Map listDashboardGiroSpesialRate(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardGiroSpesialRate(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

}
