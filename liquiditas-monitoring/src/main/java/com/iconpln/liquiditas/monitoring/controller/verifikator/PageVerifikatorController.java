package com.iconpln.liquiditas.monitoring.controller.verifikator;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by israj on 10/4/2016.
 * modified by fputra on 28/08/2017
 * modified by elvan on 04/06/2018
 */
@Controller
public class PageVerifikatorController {

//    @RequestMapping("/page_verifikator/imprst_valas_and_global_bond")
//    public String imprstGlobalBond(){
//        return "operator/dashboard_valas";
//    }

    @RequestMapping("/page_verifikator/derivatif_and_deposito")
    public String derivatifDeposito(){
        return "verifikator/derivatif_and_deposito";
    }

    @RequestMapping("/page_verifikator/saldo_rekening_valuta_asing")
    public String saldoRekeningValutaAsing(){
        return "verifikator/saldo_rekening_valuta_asing";
    }

    @RequestMapping("/page_verifikator/realisasi_pembayaran_valuta_asing")
    public String realisasiPembayaranValutaAsing(){
        return "verifikator/realisasi_pembayaran_valuta_asing";
    }

    @RequestMapping("/page_verifikator/realisasi_pembelian_valuta_asing")
    public String realisasiPembelianValutaAsing(){
        return "verifikator/realisasi_pembelian_valuta_asing";
    }

    @RequestMapping("/page_verifikator/rencana_bayar_valuta_asing_mingguan_usd_jpy")
    public String rencanaBayarValutaAsingMingguanUsdJpy(){
        return "verifikator/rencana_bayar_valuta_asing_mingguan_usd_jpy";
    }

    @RequestMapping("/page_verifikator/rencana_bayar_valuta_asing_mingguan_eur_others")
    public String rencanaBayarValutaAsingMingguanEurOthers(){ return "verifikator/rencana_bayar_valuta_asing_mingguan_eur_others";
    }

    @RequestMapping("/screensaver")
    public String screensaver(){
        return "screensaver";
    }

//    idr
//    @RequestMapping("/page_idrverifikator/idr_imprest")
//    public String idrImprst(){return "verifikatoridr/idr_imprest";
//    }

    @RequestMapping("/page_idrverifikator/supply_chain_financing_giro_special_rate")
    public String idrSupplyChainGiroSpecial(){return "verifikatoridr/supply_chain_financing_dan_giro_special_rate";
    }

    @RequestMapping("/page_idrverifikator/saldo_rekening_rupiah")
    public String idrSaldoRekening(){
        return "verifikatoridr/saldo_rekening_rupiah";
    }

    @RequestMapping("/page_idrverifikator/idr_subsidi_kmk")
    public String idrSubsidiKmk(){
        return "verifikatoridr/idr_subsidi_kmk";
    }

    @RequestMapping("/page_idrverifikator/idr_receipt")
    public String idrReceipt(){
        return "verifikatoridr/idr_receipt";
    }

    @RequestMapping("/page_idrverifikator/idr_rencana_bayar_imprest_operasi_terpusat")
    public String idrRencanaBayarImprestOperasiTerpusat(){
        return "verifikatoridr/idr_rencana_bayar_imprest_operasi_terpusat";
    }

    @RequestMapping("/page_idrverifikator/rencana_bayar_equivalen_rupiah")
    public String idrRencanaBayarEquivalenRupiah(){
        return "verifikatoridr/saldo_rekening_rupiah";
    }

    @RequestMapping("/page_idrverifikator/realisasi_placement_equivalen_rupiah")
    public String idrRencanaBayarRealisasiPlacement(){
        return "verifikatoridr/realisasi_placement_equivalen_rupiah";
    }

    @RequestMapping("/page_idrverifikator/rencana_bayar_imprest_import")
    public String idrRencanaBayarImprestImport(){
        return "verifikatoridr/rencana_bayar_imprest_import";
    }

    @RequestMapping("/page_idrverifikator/jenis_pembayaran")
    public String jenis_pembayaran(){
        return "verifikatoridr/jenis_pembayaran";
    }

    @RequestMapping("/page_idrverifikator/idr_real_pembayaran")
    public String realisasiPembayaranValutaAsingIdr(){
        return "verifikator/realisasi_pembayaran_valuta_asing";
    }

    @RequestMapping("/page_idrverifikator/idr_rencana_vs_realisasi")
    public String rencanaVsRealisasiIdr(){
        return "verifikatoridr/rencana_vs_realisasi";
    }

    @RequestMapping("/page_idrverifikator/cash_flow")
    public String cashFlow(){
        return "verifikatoridr/cash_flow";
    }

    @RequestMapping("/dash_corpay/saldo_rekening")
    public String saldoRekening() { return "dashboardcorpay/saldo_rekening3";
    }

    @RequestMapping("/dash_corpay/rencana_pembayaran")
    public String rencanaPembayaran() { return "dashboardcorpay/rencana_pembayaran";
    }

    @RequestMapping("/dash_corpay/realisasi_pembayaran")
    public String realisasiPembayaran() { return "dashboardcorpay/realisasi_pembayaran";
    }

}
