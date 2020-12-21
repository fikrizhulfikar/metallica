package com.iconpln.liquiditas.core.service;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Repository
public class KebutuhanImprestUnitService {
    @Autowired
    DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getImprestUnit(String pPeriode, String pUserId){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("invoice_get_status2");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_tanggal", pPeriode)
                .addValue("p_user_id", pUserId);
        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("imprest_unit_get_param : {}",params);
        AppUtils.getLogger(this).info("imprest_unit_get : {}",result);
        return result;
    }

    public Map<String, Object> uploadXlsImprestUnit(InputStream path, String user, String jenisFile, String idImprest) throws IOException {
        Map<String, Object> out = new HashMap<>();
        Workbook workbook = null;
        Iterator<Row> rowIterator;
        Row row = null;
        Cell cell = null;

        Map<String, Object> param = new HashMap<>();
        int i = 0;
        List<Map<String, Object>> failedList = new ArrayList<>();
        try {
            workbook = WorkbookFactory.create(path);
        }catch (InvalidFormatException | org.apache.poi.openxml4j.exceptions.InvalidFormatException e){
            e.printStackTrace();
        }
        Sheet sheet = workbook.getSheetAt(0);
        rowIterator = sheet.iterator();
        List<String> list = new ArrayList<>();
        int x = 0;
        rowIterator.next();
        rowIterator.next();
        while(rowIterator.hasNext()){
            row = rowIterator.next();
            if (row.getCell(0).getCellTypeEnum() == CellType.STRING){
                break;
            }
            System.out.println(row.getCell(0).getCellTypeEnum() == CellType.STRING);
            Iterator<Cell> cellIterator = row.cellIterator();
            Row rrow = sheet.getRow(row.getRowNum());
            int totalCell = sheet.getRow(10).getLastCellNum();

            if (!isRowEmpty(rrow, totalCell)){
                for (int cellNum = 0; cellNum < totalCell; cellNum++){
                    if (row.getCell(cellNum) == null){
                        list.add(null);
                    }else if (row.getCell(cellNum).getCellTypeEnum() == CellType.NUMERIC){
                        list.add(String.valueOf(row.getCell(cellNum).getNumericCellValue()));
                    }else if (row.getCell(cellNum).getCellTypeEnum() == CellType.STRING){
                        list.add(row.getCell(cellNum).getStringCellValue());
                    }
                }
                AppUtils.getLogger(this).info("list_cell_value : {}",list);
                if (x >= 0){
                    if (!list.get(4).equals("0.0") || !list.get(5).equals("0.0") || !list.get(6).equals("0.0")){
                        SqlParameterSource params;
                        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                                .withCatalogName("PKG_CORPAY2")
                                .withFunctionName("ins_imprest_unit");
                        params = new MapSqlParameterSource()
                                .addValue("p_unit_pln",list.get(2))
                                .addValue("p_nama_bank", list.get(3))
                                .addValue("p_investasi_rutin", list.get(4))
                                .addValue("p_investasi_non_rutin", list.get(5))
                                .addValue("p_operasi", list.get(6))
                                .addValue("out_msg", OracleTypes.VARCHAR);
                        out = simpleJdbcCall.execute(params);
                    }
                }
                list.clear();
                x++;
            }
        }
        System.out.println("Ini Out yaa : "+out);
        return out;
    }

    public boolean isRowEmpty(Row row, int rowSize){
        System.out.println("ROWSIZE ; "+rowSize);
        for(int x = 0; x < rowSize; x++){
            System.out.println("ISI ROW : "+ row.getCell(x));
            if(row.getCell(x) != null && row.getCell(x).toString().length() > 0){
                System.out.println("PANJANG :"+ row.getCell(x).toString().length());
                return false;
            }
        }
        return true;
    }

    public Map<String, Object> deletePeriodeImprest(String pPeriode){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("del_imprest_unit");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tanggal", pPeriode)
                .addValue("out_msg", OracleTypes.VARCHAR);
        return simpleJdbcCall.execute(param);
    }

    public Map<String, Object> updateStatusImprest(String pTanggal, String pUserId, String pStatus){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("upd_status_imprest");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_tanggal", pTanggal, OracleTypes.VARCHAR)
                .addValue("p_user_id", pUserId, OracleTypes.VARCHAR)
                .addValue("p_status", pStatus, OracleTypes.VARCHAR)
                .addValue("out_msg", OracleTypes.VARCHAR);
        return simpleJdbcCall.execute(params);
    }

    public Map<String, Object> revereStatusImprest(String pTanggal, String pUserId, String pStatus){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("reverse_status_imprest");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_tanggal", pTanggal)
                .addValue("p_user_id", pUserId)
                .addValue("p_status", pStatus)
                .addValue("out_msg", OracleTypes.VARCHAR);
        return simpleJdbcCall.execute(params);
    }
}
