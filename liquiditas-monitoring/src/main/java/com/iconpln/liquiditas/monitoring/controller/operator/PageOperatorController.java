package com.iconpln.liquiditas.monitoring.controller.operator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;

/**
 * Created by israj on 10/4/2016.
 * Updated by Mr.Diaz on 31/10/2019.
 * Updated by adikoesoemah on 31/10/2019
 */
@Controller
@RequestMapping("/page_operator")
public class PageOperatorController {

    @RequestMapping("/home")
    public String home() { return "operator/home";
    }

    @RequestMapping("/pengelolaan_likuiditas")
    public String pengelolaan_likuiditas() { return "operator/pengelolaan_likuiditas";
    }

    @RequestMapping("/dashboard")
    public String dashboard() { return "operator/dashboard2";
    }

    @RequestMapping("/dash_rencana")
    public String dash_rencana() { return "operator/dash_rencana";
    }

    @RequestMapping("/dash_realisasi")
    public String dash_realisasi() { return "operator/dash_realisasi";
    }

    @RequestMapping("/rekapitulasi_data")
    public String rekap_data() {
        return "operator/rekapitulasi_data";
    }

    @RequestMapping("/rekapitulasi_data_kasir")
    public String rekap_data_kasir() {
        return "operator/rekap_kasir";
    }


    @RequestMapping("/rekap_belum")
    public String rekapDataBelumVerifikasi() {
        return "operator/rekap_belum";
    }

    @RequestMapping("/rekap_sudah")
    public String rekapDataSudahVerifikasi() {
        return "operator/rekap_sudah";
    }

    @RequestMapping("/realisasi_pembayaran")
    public String realisasi_pembayaran() {
        return "operator/realisasi_pembayaran";
    }

    @RequestMapping("/derivatif_forward")
    public String deviratifFwd() {
        return "operator/derivatif_forward";
    }

    @RequestMapping("/derivatif_swap")
    public String deviratifSwap() {
        return "operator/derivatif_swap";
    }

    @RequestMapping("/derivatif_cso")
    public String deviratifCso() {
        return "operator/derivatif_cso";
    }

    @RequestMapping("/derivatif_ccs")
    public String deviratifCss() {
        return "operator/derivatif_ccs";
    }

    @RequestMapping("/deposito")
    public String deposito() {
        return "operator/deposito";
    }

    @RequestMapping("/tripartite")
    public String tripartite() {
        return "operator/tripartite";
    }

    @RequestMapping("/pembelian_valas")
    public String pembelian_valas() {
        return "operator/pembelian_valas";
    }

    @RequestMapping("/kurs")
    public String kurs() {
        return "operator/kurs";
    }

    @RequestMapping("/tracking")
    public String tracking() {
        return "operator/tracking";
    }

    @RequestMapping("/placement")
    public String placement() {
        return "operator/placement";
    }

    @RequestMapping("/potensi_pendapatan")
    public String potensi_pendapatan() {
        return "operator/potensi_pendapatan";
    }

    @RequestMapping("/penarikan_kmk")
    public String penarikan_kmk() {
        return "operator/penarikan_kmk";
    }

    @RequestMapping("/penerimaan_subsidi")
    public String penerimaan_subsidi() {
        return "operator/penerimaan_subsidi";
    }

    @RequestMapping("/rekap_reject")
    public String rekapReject() {
        return "operator/rekap_reject";
    }

    @RequestMapping("/anggaran")
    public String anggaran() {
        return "operator/anggaran";
    }

    @RequestMapping("/rekap_invoice_draft")
    public String rekap_invoice_draft(){return "operator/rekap_invoice_draft";}

    @RequestMapping("/rekap_invoice_belum")
    public String rekap_invoice_belum() {
        return "operator/rekap_invoice_belum";
    }

    @RequestMapping("/rekap_invoice_siap_bayar")
    public String rekap_invoice_siap_bayar(){return "operator/rekap_invoice_siap_bayar";}

    @RequestMapping("/rekap_invoice_realisasi")
    public String rekap_invoice_realisasi() {
        return "operator/rekap_invoice_realisasi";
    }

    @RequestMapping("/rekap_invoice_sudah")
    public String rekap_invoice_sudah() {
        return "operator/rekap_invoice_sudah";
    }

    @RequestMapping("/rekap_invoice_group")
    public String rekap_invoice_group() {
        return "operator/rekap_invoice_group";
    }

    @RequestMapping("/rekap_invoice_group_verified")
    public String rekap_invoice_group_verified() {
        return "operator/rekap_invoice_group_verified";
    }

    @RequestMapping("/rekap_invoice_group_lunas")
    public String rekap_invoice_group_lunas() {
        return "operator/rekap_invoice_group_lunas";
    }

    @RequestMapping("/rekap_invoice_group_siap_bayar")
    public String rekap_invoice_group_siap_bayar(){return "operator/rekap_invoice_group_siap_bayar";}

    @RequestMapping("/rekap_invoice_reject")
    public String rekap_invoice_reject() {
        return "operator/rekap_invoice_reject";
    }

    @RequestMapping("/rekap_realisasi_pembayaran")
    public String rekap_realisasi_pembayaran() {
        return "operator/rekap_realisasi_pembayaran";
    }

    @RequestMapping("/rekap_invoice_admin")
    public String rekap_invoice_admin() {return "operator/rekap_invoice_admin"; }

    @RequestMapping("/rekap_invoice_oss")
    public String rekap_invoice_oss(){return "operator/rekap_invoice_oss";}

    @RequestMapping("/rekap_invoice_reverse")
    public String rekap_invoice_reverse(){return "operator/rekap_invoice_reverse";}

    @RequestMapping("/rekap_invoice_salah")
    public String rekap_invoice_salah(){return "operator/rekap_invoice_salah";}

    @RequestMapping("/rekap_invoice_oss_verifikator")
    public String rekap_invoice_verifikator() {
        return "operator/rekap_invoice_oss_verifikator";
    }

    @RequestMapping("/rekap_invoice_sap")
    public String invoice_verifikator() {
        return "operator/invoice_verifikator";
    }

    @RequestMapping("/verifikasi_tanggal")
    public String verifikasi_tanggal() {
        return "operator/invoice_verifikasi_tgl";
    }

//    @RequestMapping("/metallica_trx")
//    public String metallica_trx() {
//        return "operator/metallica_trx";
//    }
//
//    @RequestMapping("/pembelian_valas_trx")
//    public String pembelian_valas_trx() {
//        return "operator/pembelian_valas_trx";
//    }

    @RequestMapping("/rekap_invoice_lcl")
    public String rekap_invoice_lcl() {
        return "operator/rekap_invoice_lcl";
    }

    @RequestMapping("/rekap_invoice_lcl2")
    public String rekap_invoice_lcl2() {
        return "operator/rekap_invoice_lcl2";
    }

    @RequestMapping("/pembelian_valas_trx")
    public String pembelian_valas_trx() {
        return "operator/pembelian_valas_trx";
    }

    @RequestMapping("/proyeksi_pengadaan_valas_trx")
    public String proyeksi_pengadaan_valas_trx() {
        return "operator/proyeksi_pengadaan_valas_trx";
    }

    @RequestMapping("/pindah_buku_trx")
    public String pindah_buku_trx() {
        return "operator/pindah_buku_trx";
    }

    @RequestMapping("/operasi_khusus_trx")
    public String operasi_khusus_trx() {
        return "operator/operasi_khusus_trx";
    }

    @RequestMapping("/pembelian_valas_trx_verified")
    public String pembelian_valas_trx_verified() {
        return "operator/pembelian_valas_trx_verified";
    }

    @RequestMapping("/pembelian_valas_trx_lunas")
    public String pembelian_valas_trx_lunas() {
        return "operator/pembelian_valas_trx_lunas";
    }

    @RequestMapping("/pindah_buku_trx_verified")
    public String pindah_buku_trx_verified() {
        return "operator/pindah_buku_trx_verified";
    }

    @RequestMapping("/pindah_buku_trx_lunas")
    public String pindah_buku_trx_lunas() {
        return "operator/pindah_buku_trx_lunas";
    }

    @RequestMapping("/operasi_khusus_trx_verified")
    public String operasi_khusus_trx_verified() {
        return "operator/operasi_khusus_trx_verified";
    }

    @RequestMapping("/operasi_khusus_trx_lunas")
    public String operasi_khusus_trx_lunas() {
        return "operator/operasi_khusus_trx_lunas";
    }

    @RequestMapping("/financial_talk")
    public String financial_talk(){return "dashboardcorpay/financial_talk";}

    @RequestMapping("/dashboard_deposito")
    public String dashboard_deposito(){return "operator/dashboard_deposito";}

    @RequestMapping("/kebutuhan_imprest_unit")
    public String dashboard_dropping_imprest_unit(){return "dashboardcorpay/imprest_unit";}
}
