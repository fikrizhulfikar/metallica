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

//    Old mapping for master vendor
//    @RequestMapping("/vendor")
//    public String vendor(){
//        return "operator/vendor";
//    }

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

    @RequestMapping("/general_bank")
    public String generalBank(){
        return "operator/master_bank_general";
    }

    @RequestMapping("/payment_house_bank")
    public String paymenthouseBank(){
        return "operator/master_payment_house_bank";
    }

    @RequestMapping("/invoice_hr_payable")
    public String invoicehrpayable(){
        return "operator/master_invoice_hr_payable";
    }

    @RequestMapping("/ap_invoice")
    public String invoiceapinvoice(){
        return "operator/master_ap_invoice";
    }

    @RequestMapping("/payment_invoice")
    public String paymentinvoice(){
        return "operator/master_payment_invoice";
    }

    @RequestMapping("/billing_invoice")
    public String billinginvoice(){
        return "operator/master_billing_invoice";
    }

    @RequestMapping("/customer")
    public String customer(){return "operator/master_customer";}

    @RequestMapping("/vendor")
    public String vendor(){
        return "operator/master_vendor";
    }

    @RequestMapping("/vendor_oss")
    public String vendorOss(){return "operator/vendor_oss";}

    @RequestMapping("/upload_saldo_bank")
    public String uploadSaldoBank(){return "operator/upload_saldo_bank";}

    @RequestMapping("/invoice_pilot")
    public String masterInvoicePilot(){return "operator/master_invoice_pilot";}

    @RequestMapping("/invoice_nonvendor_pilot")
    public String masterInvoiceNonVendorPilot(){return "operator/master_invoice_nonvendor_pilot";}

    @RequestMapping("/invoice_lunas_pilot")
    public String masterInvoiceLunasPilot(){return "operator/master_invoice_lunas_pilot";}

    @RequestMapping("/master_invoice_new")
    public String masterApInvoiceNew(){return "operator/master/master_apinvoice_new";}

    @RequestMapping("/master_hr_new")
    public String masterHrPayableNew(){return "operator/master/master_hrpayable_new";}

    @RequestMapping("/invoice_vendor_portal")
    public String masterInvoiceVendorPortal () {return "operator/master/master_invoice_vendor_portal";}

}
