package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;

@Repository
public class UploadSaldoService {

    @Autowired
    DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){ return new JdbcTemplate(dataSource);}

    public Map uploadSaldoBank(InputStream path) throws ClassNotFoundException, SQLException, IOException, InvalidFormatException {
        Map out = new HashMap<>();
        Workbook workbook = null;
        Iterator<Row> rowIterator = null;
        Row row = null;
        try {
            try {
                workbook = WorkbookFactory.create(path);
            }catch (Exception e){
                e.printStackTrace();
            }
            Sheet sheet = workbook.getSheetAt(0);
            rowIterator = sheet.iterator();
            List<String> list = new ArrayList<>();
            int x = 0;
            while(rowIterator.hasNext()){
                row = rowIterator.next();
                Row rrow = sheet.getRow(row.getRowNum());
                int totalCell = sheet.getRow(1).getLastCellNum();
                if (!isRowEmpty(rrow, totalCell)){
                    for (int cellNum = 0; cellNum < totalCell; cellNum++){
                        if (rrow.getCell(cellNum).getCellTypeEnum() == CellType.NUMERIC) {
                            if (DateUtil.isCellDateFormatted(rrow.getCell(cellNum))) {
                                list.add(rrow.getCell(cellNum).toString());
                            } else if(cellNum == 1){
                                rrow.getCell(cellNum).setCellType(CellType.STRING);
                                list.add(rrow.getCell(cellNum).toString());
                            } else{
                                list.add(new BigDecimal(rrow.getCell(cellNum).getNumericCellValue()).toPlainString());
                            }
                        } else {
                            list.add(rrow.getCell(cellNum).getStringCellValue());
                        }
                    }
//                    AppUtils.getLogger(this).info("list bos : {}",list);
                    if (x > 0){
                        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                                .withCatalogName("PKG_CORPAY2")
                                .withFunctionName("ins_saldo_bank");
                        SqlParameterSource params = new MapSqlParameterSource()
                                .addValue("p_bank",list.get(0))
                                .addValue("p_account",list.get(1))
                                .addValue("p_currency",list.get(2))
                                .addValue("p_tanggal",list.get(3))
                                .addValue("p_debit",list.get(4))
                                .addValue("p_kredit",list.get(5))
                                .addValue("p_saldo",list.get(6))
                                .addValue("p_create_time",list.get(7))
                                .addValue("out_msg", OracleTypes.VARCHAR);
                       out = jdbcCall.execute(params);
                    }
                    list.clear();
                    x++;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    // Upload Dropping, Subsidi, dan Pinjaman
    public Map uploadPsd(InputStream path) throws ClassNotFoundException, SQLException, IOException, InvalidFormatException {
        Map out = new HashMap<>();
        Workbook workbook = null;
        Iterator<Row> rowIterator = null;
        Row row = null;
        try {
            try {
                workbook = WorkbookFactory.create(path);
            }catch (Exception e){
                e.printStackTrace();
            }
            Sheet sheet = workbook.getSheetAt(0);
            rowIterator = sheet.iterator();
            List<String> list = new ArrayList<>();
            int x = 0;
            while(rowIterator.hasNext()){
                row = rowIterator.next();
                Row rrow = sheet.getRow(row.getRowNum());
                int totalCell = sheet.getRow(1).getLastCellNum();
                if (!isRowEmpty(rrow, totalCell)){
                    for (int cellNum = 0; cellNum < totalCell; cellNum++){
                        if (rrow.getCell(cellNum).getCellTypeEnum() == CellType.NUMERIC) {
                            if (DateUtil.isCellDateFormatted(rrow.getCell(cellNum))) {
                                list.add(rrow.getCell(cellNum).toString());
                            }else{
                                list.add(new BigDecimal(rrow.getCell(cellNum).getNumericCellValue()).toPlainString());
                            }
                        } else {
                            list.add(rrow.getCell(cellNum).getStringCellValue());
                        }
                    }

                    if (x > 0){
                        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                                .withCatalogName("PKG_CORPAY2")
                                .withFunctionName("ins_transaksi_non_invoice");
                        SqlParameterSource params = new MapSqlParameterSource()
                                .addValue("p_tanggal",list.get(0))
                                .addValue("p_jenis",list.get(1))
                                .addValue("p_keterangan",list.get(2))
                                .addValue("p_nominal",list.get(3));
                        out = jdbcCall.execute(params);
                    }
                    list.clear();
                    x++;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    private boolean isRowEmpty(Row row, int rowSize){
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

    public List<Map<String, Object>> getAllTransaksi(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_transaksi");
        return simpleJdbcCall.executeFunction(ArrayList.class);
    }

    public List<Map<String, Object>> getRencanaImprest(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("xls_imprest_rencana");
        return simpleJdbcCall.executeFunction(ArrayList.class);
    }

    public List<Map<String, Object>> getRealisasiImprest(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("xls_imprest_realisasi");
        return simpleJdbcCall.executeFunction(ArrayList.class);
    }
}
