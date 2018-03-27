package com.iconpln.liquiditas.monitoring.controller.master;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by israj on 10/4/2016.
 */
@Controller
@RequestMapping("/page_master/")
public class PageMasterController {

    @RequestMapping("/currency")
    public String currency(){
        return "operator/currency";
    }

    @RequestMapping("/bank")
    public String bank(){
        return "operator/bank";
    }

    @RequestMapping("/vendor")
    public String vendor(){
        return "operator/vendor";
    }

    @RequestMapping("/jenis_pembayaran")
    public String jenisPembayaran(){
        return "operator/jenis_pembayaran";
    }

    @RequestMapping("/unit")
    public String unit(){
        return "operator/unit";
    }

    @RequestMapping("/tenor")
    public String tenor(){
        return "operator/tenor";
    }

    @RequestMapping("/sumber_dana")
    public String sumberDana(){
        return "operator/sumber_dana";
    }

    @RequestMapping("/keterangan")
    public String keterangan(){
        return "operator/keterangan";
    }

    @RequestMapping("/user")
    public String user(){
        return "operator/user";
    }
}
