package com.iconpln.liquiditas.core.domain;

public class CashFlow {

    private int noUrut;
    private String tanggal;
    private double nilai;

    public int getNoUrut() {
        return noUrut;
    }

    public void setNoUrut(int noUrut) {
        this.noUrut = noUrut;
    }

    public String getTanggal() {
        return tanggal;
    }

    public void setTanggal(String tanggal) {
        this.tanggal = tanggal;
    }

    public double getNilai() {
        return nilai;
    }

    public void setNilai(double nilai) {
        this.nilai = nilai;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("CashFlow{");
        sb.append("noUrut=").append(noUrut);
        sb.append(", tanggal='").append(tanggal).append('\'');
        sb.append(", nilai=").append(nilai);
        sb.append('}');
        return sb.toString();
    }

}
