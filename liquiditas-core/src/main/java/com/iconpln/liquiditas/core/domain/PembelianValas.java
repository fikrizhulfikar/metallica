package com.iconpln.liquiditas.core.domain;

/**
 * Created by israjhaliri on 9/29/17.
 */
public class PembelianValas {
    private String idBeliValas;
    private String currency;
    private String tglPosting;
    private String bankPengirim;
    private String bankPenerima;
    private String pembelian;
    private String kurs;
    private String konversiIdr;
    private int noSettlement;
    private int payReq;
    private int doc1;
    private int doc2;
    private String createDate;
    private String createBy;
    private String updateDate;
    private String updateBy;

    public String getIdBeliValas() {
        return idBeliValas;
    }

    public void setIdBeliValas(String idBeliValas) {
        this.idBeliValas = idBeliValas;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTglPosting() {
        return tglPosting;
    }

    public void setTglPosting(String tglPosting) {
        this.tglPosting = tglPosting;
    }

    public String getBankPengirim() {
        return bankPengirim;
    }

    public void setBankPengirim(String bankPengirim) {
        this.bankPengirim = bankPengirim;
    }

    public String getBankPenerima() {
        return bankPenerima;
    }

    public void setBankPenerima(String bankPenerima) {
        this.bankPenerima = bankPenerima;
    }

    public String getPembelian() {
        return pembelian;
    }

    public void setPembelian(String pembelian) {
        this.pembelian = pembelian;
    }

    public String getKurs() {
        return kurs;
    }

    public void setKurs(String kurs) {
        this.kurs = kurs;
    }

    public String getKonversiIdr() {
        return konversiIdr;
    }

    public void setKonversiIdr(String konversiIdr) {
        this.konversiIdr = konversiIdr;
    }

    public int getNoSettlement() {
        return noSettlement;
    }

    public void setNoSettlement(int noSettlement) {
        this.noSettlement = noSettlement;
    }

    public int getPayReq() {
        return payReq;
    }

    public void setPayReq(int payReq) {
        this.payReq = payReq;
    }

    public int getDoc1() {
        return doc1;
    }

    public void setDoc1(int doc1) {
        this.doc1 = doc1;
    }

    public int getDoc2() {
        return doc2;
    }

    public void setDoc2(int doc2) {
        this.doc2 = doc2;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    @Override
    public String toString() {
        return "PembelianValas{" +
                "idBeliValas='" + idBeliValas + '\'' +
                ", currency='" + currency + '\'' +
                ", tglPosting='" + tglPosting + '\'' +
                ", bankPengirim='" + bankPengirim + '\'' +
                ", bankPenerima='" + bankPenerima + '\'' +
                ", pembelian='" + pembelian + '\'' +
                ", kurs='" + kurs + '\'' +
                ", konversiIdr='" + konversiIdr + '\'' +
                ", noSettlement='" + noSettlement + '\'' +
                ", payReq='" + payReq + '\'' +
                ", doc1='" + doc1 + '\'' +
                ", doc2='" + doc2 + '\'' +
                ", createDate='" + createDate + '\'' +
                ", createBy='" + createBy + '\'' +
                ", updateDate='" + updateDate + '\'' +
                ", updateBy='" + updateBy + '\'' +
                '}';
    }
}
