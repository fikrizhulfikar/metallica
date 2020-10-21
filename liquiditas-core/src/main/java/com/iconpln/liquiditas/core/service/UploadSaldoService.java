package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

@Repository
public class UploadSaldoService {

    public Map uploadSaldoBank(InputStream path) throws ClassNotFoundException, SQLException, IOException, InvalidFormatException {
        Class.forName("oracle.jdbc.OracleDriver");
        String oracleUrl = "jdbc:oracle:thin:@10.14.152.5:1598:CISQA";
        Connection con = DriverManager.getConnection(oracleUrl, "CORPAY", "corpay");
        CallableStatement statement =  con.prepareCall("{?=call PKG_CORPAY2.ins_saldo_bank(?,?,?,?,?,?,?,?)}");
        System.out.println("Connected to Oracle database.....");
        Map out = new HashMap<>();
        Workbook workbook = null;
        Iterator<Row> rowIterator = null;
        Row row = null;
        String result = null;
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
                        statement.registerOutParameter(1, OracleTypes.VARCHAR);
                        statement.setString(2,list.get(0));
                        statement.setString(3,list.get(1));
                        statement.setString(4,list.get(2));
                        statement.setString(5,list.get(3));
                        statement.setString(6,list.get(4));
                        statement.setString(7,list.get(5));
                        statement.setString(8,list.get(6));
                        statement.setString(9,list.get(7));
                        statement.execute();
                        result = statement.getString(1);
                    }
                    list.clear();
                    x++;
                }
            }

            assert false;
            out.put("result",result);
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
}
