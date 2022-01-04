package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.KebutuhanImprestUnitService;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping(path = "/get_detail_imprest_unit")
    public Map listDetailKebutuhanImprestUnit(
            @RequestParam(value = "pFormId") String pFormId
    ){
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = imprestUnitService.getDetailImprestUnit(pFormId);
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
//        return getTemplateDropping();
    }

    @RequestMapping(value = "/upload_xls_imprest", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "idForm") String pIdForm,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        return imprestUnitService.uploadXlsImprestUnit(inputStream, WebUtils.getUsernameLogin(), "1", "", pIdForm);
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

    public ResponseEntity getTemplateDropping(){
        Path path = Paths.get("templates/report/template_dropping.xls");
        Resource resource = null;
        try{
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+ resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping(path = "/delete_imprest")
    public Map<String, Object> deleteDetailImprest(@RequestParam(value = "pIdForm") String pIdForm){
        Map<String, Object> delete = new HashMap<>();
        try {
            delete = imprestUnitService.deleteDetailImprest(pIdForm);
        } catch (Exception e){
            e.printStackTrace();
        }
        return delete;
    }

    @PostMapping(path = "/upd_status_imprest")
    public Map<String, Object> updStatusImprest(
            @RequestParam(value = "pIdForm") String pIdForm,
            @RequestParam(value = "pStatus") String pStatus
    ){
        Map<String, Object> update = new HashMap<>();
        try {
            update = imprestUnitService.updateStatusImprest(pIdForm, WebUtils.getUsernameLogin(), pStatus);
        } catch (Exception e){
            e.printStackTrace();
        }
        return update;
    }

    @PostMapping(path = "/reverse_status_imprest")
    public Map<String, Object> reverseStatusImprest(
            @RequestParam(value = "pIdForm") String pIdForm,
            @RequestParam(value = "pStatus") String pStatus
    ){
        Map<String, Object> reverse = new HashMap<>();
        try {
            reverse = imprestUnitService.revereStatusImprest(pIdForm, WebUtils.getUsernameLogin(), pStatus);
        } catch (Exception e){
            e.printStackTrace();
        }
        return reverse;
    }

    @PostMapping(path = "/delete_header_imprest")
    public Map<String, Object> deleteHeaderImprest(
            @RequestParam(value = "pIdForm") String pIdForm
    ){
        Map<String, Object> delete = new HashMap<>();
        try {
            delete = imprestUnitService.deleteHeaderImprestUnit(pIdForm);
        } catch (Exception e){
            e.printStackTrace();
        }
        return delete;
    }

    @PostMapping(path = "/insert_header_imprest")
    public Map<String, Object> insertHeaderImprest(
            @RequestParam(value = "pHeadTglJatuhTempo") String pHeadTglJatuhTempo,
            @RequestParam(value = "pIdImprestHeader") String pIdImprestHeader
    ){
        Map<String, Object> reverse = new HashMap<>();
        try {
            reverse = imprestUnitService.insHeaderImprest(pIdImprestHeader, WebUtils.getUsernameLogin(), pHeadTglJatuhTempo);
        } catch (Exception e){
            e.printStackTrace();
        }
        return reverse;
    }

    @RequestMapping(value = "/get_imprest_header", method = RequestMethod.GET)
    public Map listImprestHeader(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = imprestUnitService.getHeaderImprestUnit(((start / length) + 1), length, pTglAwal, pTglAkhir,WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        AppUtils.getLogger(this).info("list data : {}", list.toString());
        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }
        return mapData;
    }

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "COMP_CODE";
            case 2:
                return "DOC_NO";
            case 3:
                return "FISC_YEAR";
            case 4:
                return "DOC_TYPE";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getDataInvoiceBy(
            @RequestParam(value = "pIdForm") String pIdForm
    ) {
        try {
            return imprestUnitService.getHeaderImprestUnitById(pIdForm);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

}
