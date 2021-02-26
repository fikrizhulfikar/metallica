package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.KebutuhanImprestUnitService;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api_operator/kebutuhan_imprest_unit")
public class KebutuhanImprestUnitController {

    @Autowired
    KebutuhanImprestUnitService imprestUnitService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping(path = "/get_imprest_unit")
    public Map listKebutuhanImprestUnit(
            @RequestParam(value = "periode") String periode
    ){
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = imprestUnitService.getImprestUnit(periode, WebUtils.getUsernameLogin());
        } catch (Exception e){
            e.printStackTrace();
        }
        Map mapData = new HashMap();
        mapData.put("data",list);

        return mapData;
    }

    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response) throws SQLException {
        return generateReport(response, null, "template");

    }

    @RequestMapping(value = "/upload_xls_imprest", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        return imprestUnitService.uploadXlsImprestUnit(inputStream, WebUtils.getUsernameLogin(), "1", "");
    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe) {
        try {
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            String resource;
            response.setHeader("Content-Disposition", "attachment; filename=\"" + tipe + "_dropping.xls\"");
            resource = "classpath:/templates/report/" + tipe + "_dropping.xls";
            if (tipe.equals("download")) {
                value.put("listFailed", errorData.get("return"));
                System.out.println("error return :"+errorData.get("return"));
            }
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping(path = "/delete_periode")
    public Map<String, Object> deletePeriodeImprest(@RequestParam(value = "periode") String periode){
        Map<String, Object> delete = new HashMap<>();
        try {
            delete = imprestUnitService.deletePeriodeImprest(periode);
        } catch (Exception e){
            e.printStackTrace();
        }
        return delete;
    }

    @PostMapping(path = "/upd_status_imprest")
    public Map<String, Object> updStatusImprest(
            @RequestParam(value = "tanggal") String tanggal,
            @RequestParam(value = "status") String status
    ){
        Map<String, Object> update = new HashMap<>();
        try {
            update = imprestUnitService.updateStatusImprest(tanggal, WebUtils.getUsernameLogin(), status);
        } catch (Exception e){
            e.printStackTrace();
        }
        return update;
    }

    @PostMapping(path = "/reverse_status_imprest")
    public Map<String, Object> reverseStatusImprest(
            @RequestParam(value = "tanggal") String tanggal,
            @RequestParam(value = "status") String status
    ){
        Map<String, Object> reverse = new HashMap<>();
        try {
            reverse = imprestUnitService.revereStatusImprest(tanggal, WebUtils.getUsernameLogin(), status);
        } catch (Exception e){
            e.printStackTrace();
        }
        return reverse;
    }
}
