package com.iconpln.liquiditas.core.domain;

public class Placement {

    private String idJenis;
    private String jenis;
    private String tanggal;
    private String namaBank;
    private String kodeBank;
    private String receipt;
    private String kmk;
    private String subsidi;

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

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public String getKmk() {
        return kmk;
    }

    public void setKmk(String kmk) {
        this.kmk = kmk;
    }

    public String getSubsidi() {
        return subsidi;
    }

    public void setSubsidi(String subsidi) {
        this.subsidi = subsidi;
    }

    @Override
    public String toString() {
        return "Placement{" +
                "idJenis='" + idJenis + '\'' +
                ", jenis='" + jenis + '\'' +
                ", tanggal='" + tanggal + '\'' +
                ", namaBank='" + namaBank + '\'' +
                ", kodeBank='" + kodeBank + '\'' +
                ", receipt='" + receipt + '\'' +
                ", kmk='" + kmk + '\'' +
                ", subsidi='" + subsidi + '\'' +
                '}';
    }

}
