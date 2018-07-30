package com.iconpln.liquiditas.core.domain;

import java.math.BigDecimal;

public class PlacementAwal {

    private String idJenis;
    private String jenis;
    private String tanggal;
    private String namaBank;
    private String kodeBank;
    private BigDecimal saldoAwal;
    private String saldoAkhir;

    public String getIdJenis() {
        return idJenis;
    }

    public void setIdJenis(String idJenis) {
        this.idJenis = idJenis;
    }

    public String getJenis() {
        return jenis;
    }

    public void setJenis(String jenis) {
        this.jenis = jenis;
    }

    public String getTanggal() {
        return tanggal;
    }

    public void setTanggal(String tanggal) {
        this.tanggal = tanggal;
    }

    public String getNamaBank() {
        return namaBank;
    }

    public void setNamaBank(String namaBank) {
        this.namaBank = namaBank;
    }

    public String getKodeBank() {
        return kodeBank;
    }

    public void setKodeBank(String kodeBank) {
        this.kodeBank = kodeBank;
    }

    public BigDecimal getSaldoAwal() {
        return saldoAwal;
    }

    public void setSaldoAwal(BigDecimal saldoAwal) {
        this.saldoAwal = saldoAwal;
    }

    public String getSaldoAkhir() {
        return saldoAkhir;
    }

    public void setSaldoAkhir(String saldoAkhir) {
        this.saldoAkhir = saldoAkhir;
    }

    @Override
    public String toString() {
        return "PlacementAwal{" +
                "idJenis='" + idJenis + '\'' +
                ", jenis='" + jenis + '\'' +
                ", tanggal='" + tanggal + '\'' +
                ", namaBank='" + namaBank + '\'' +
                ", kodeBank='" + kodeBank + '\'' +
                ", saldoAwal=" + saldoAwal +
                ", saldoAkhir='" + saldoAkhir + '\'' +
                '}';
    }
}
