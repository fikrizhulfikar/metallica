package com.iconpln.liquiditas.monitoring.controller.operator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

/**
 * Created by israj on 10/4/2016.
 */
@Controller
@RequestMapping("/page_operator")
public class PageOperatorController {

    @RequestMapping("/home")
    public String home() {
        return "operator/home";
    }

    @RequestMapping("/rekapitulasi_data")
    public String rekap_data() {
        return "operator/rekapitulasi_data";
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
}
