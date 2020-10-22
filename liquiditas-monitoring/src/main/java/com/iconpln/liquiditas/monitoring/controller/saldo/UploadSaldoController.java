package com.iconpln.liquiditas.monitoring.controller.saldo;

import com.iconpln.liquiditas.core.service.UploadSaldoService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.Map;

@RestController
@RequestMapping(path = "/api_master/upload_saldo_bank")
public class UploadSaldoController {

    @Autowired
    UploadSaldoService uploadSaldoService;

    @RequestMapping(path = "/upload_xls")
    public Map uploadSaldoBank(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
            ) throws IOException, InvalidFormatException, SQLException, ClassNotFoundException {
        InputStream inputStream = file.getInputStream();
        return uploadSaldoService.uploadSaldoBank(inputStream);

    }
}
