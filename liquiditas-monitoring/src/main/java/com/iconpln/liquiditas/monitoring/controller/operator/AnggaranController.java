package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Bank;
import com.iconpln.liquiditas.core.domain.BankDetail;
import com.iconpln.liquiditas.core.service.AnggaranService;
import com.iconpln.liquiditas.core.service.MasterService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.commons.collections.map.HashedMap;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/anggaran")
public class AnggaranController {

    @Autowired
    AnggaranService anggaranService;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @RequestMapping(value = "/get_all_anggaran", method = RequestMethod.GET)
    public List getAllAnggaran(
            @RequestParam(value = "pUnitAnggaran", defaultValue = "ALL") String pUnitAnggaran
    ) {
        try {
            return anggaranService.getAllAnggaran(pUnitAnggaran);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_sisa_anggaran", method = RequestMethod.GET)
    public String getSisaAnggaran(
            @RequestParam(value = "pNilaiAnggaran", defaultValue = "") String pNilaiAnggaran,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pNilaiTagihan", defaultValue = "") String pNilaiTagihan
    ) {
        try {
            return anggaranService.getSisaAnggaran(pNilaiAnggaran, pCurrency, pNilaiTagihan);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

//    @RequestMapping(value = "/get_sisa_anggaran", method = RequestMethod.GET)
//    public List<Map<String,Object>> getSisaAnggaran(
//            @RequestParam(value = "pNilaiAnggaran", defaultValue = "") String pNilaiAnggaran,
//            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
//            @RequestParam(value = "pNilaiTagihan", defaultValue = "") String pNilaiTagihan){
//
//        try{
//            return anggaranService.getSisaAnggaran(pNilaiAnggaran, pCurrency, pNilaiTagihan);
//        }catch (Exception e){
//            AppUtils.getLogger(this).debug(e.getMessage());
//            return null;
//        }
//    }

//    @RequestMapping(value = "anggaran/get_all_anggaran", method = RequestMethod.GET)
//    public Map getAllAnggaran() {
//        try {
//            return anggaranService.getAllAnggaran();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//
//    }

        @RequestMapping(value = "/get_data", method = RequestMethod.GET)
        public Map listRekapData(
        @RequestParam(value = "draw", defaultValue = "0") int draw,
        @RequestParam(value = "start", defaultValue = "0") int start,
        @RequestParam(value = "length", defaultValue = "10") int length,
        @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
        @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
        @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
        @RequestParam(value = "pUnitAnggaran", defaultValue = "ALL") String pUnitAnggaran,
        @RequestParam(value = "search[value]", defaultValue = "") String pSearch

    ) {

            List<Map<String, Object>> list = new ArrayList<>();
            try {
                String sortBy = parseColumn(sortIndex);
                if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
                    sortDir = "DESC";
                }
                list = anggaranService.getListAnggaran(((start / length) + 1), length, pUnitAnggaran, sortBy, sortDir, pSearch);
            } catch (Exception e) {
                e.printStackTrace();
            }


            Map mapData = new HashMap();
            mapData.put("draw", draw);
            mapData.put("data", list);
            AppUtils.getLogger(this).info("size data : {}", list.size());
            if (list.size() < 1 || list.isEmpty()) {
                mapData.put("recordsTotal", 0);
                mapData.put("recordsFiltered", 0);
            } else {
                mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
                mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            }

            return mapData;
        }

    public String parseColumn(int index) {
        switch (index) {
            case 1:
                return "TAHUN";
            case 2:
                return "KODE_UNIT_EBUDGET";
            case 3:
                return "KODE_UNIT_EBUDGET";
            case 4:
                return "SUB_POS_ANGGARAN";
            case 5:
                return "PENETAPAN";
            case 6:
                return "TOTAL_REALISASI";
            case 7:
                return "SISA_ANGGARAN";
            default:
                return "TAHUN";
        }
    }
}

