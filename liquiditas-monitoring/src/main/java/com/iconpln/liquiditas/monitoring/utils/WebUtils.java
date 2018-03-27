package com.iconpln.liquiditas.monitoring.utils;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by israjhaliri on 8/23/17.
 */
public class WebUtils {

    public static final String FOLDER_NAME = "valas-admin-files";

    public static String getUsernameLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public static String uploadFile(MultipartFile multipartFile, String idValas, String jenis) {
        if (multipartFile != null) {
            try {
                byte[] bytes = multipartFile.getBytes();

                File dir = new File(getRootPath() + File.separator + FOLDER_NAME + File.separator + idValas + jenis);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                // Create the file on server
                File serverFile = new File(dir.getAbsolutePath() + File.separator + multipartFile.getOriginalFilename());
                AppUtils.getLogger(WebUtils.class).debug("FILE UPLOADED TO : {}", serverFile);
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                stream.write(bytes);
                stream.close();
                return multipartFile.getOriginalFilename();
            } catch (IOException e) {
                return "";
            }
        } else {
            return "";
        }
    }

    public static void deleteFile(String idValas) throws IOException {
        File dir = new File(getRootPath() + File.separator + FOLDER_NAME + File.separator + idValas);
        FileUtils.deleteDirectory(dir);
    }

    private static String getRootPath() {
        return System.getProperty("user.dir");
    }

    public static String getFilePath() {
        String filePath = "file:" + System.getProperty("user.dir") + File.separator + FOLDER_NAME + File.separator;
        return filePath;
    }
}
