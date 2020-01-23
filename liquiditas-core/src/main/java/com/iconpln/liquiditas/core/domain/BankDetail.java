package com.iconpln.liquiditas.core.domain;

/**
 * Created by israjhaliri on 9/27/17.
 */
public class BankDetail {

    private String pKdBank;
    private String pNamaBank;
    private String pFLag;
    private String pJenis;

    public String getpKdBank() {
        return pKdBank;
    }

    public void setpKdBank(String pKdBank) {
        this.pKdBank = pKdBank;
    }

    public String getpNamaBank() {
        return pNamaBank;
    }

    public void setpNamaBank(String pNamaBank) {
        this.pNamaBank = pNamaBank;
    }

    public String getpFLag() {
        return pFLag;
    }

    public void setpFLag(String pFLag) {
        this.pFLag = pFLag;
    }

    public String getpJenis() {
        return pJenis;
    }

    public void setpJenis(String pJenis) {
        this.pJenis = pJenis;
    }

    @Override
    public String toString() {
        return "BankDetail{" +
                "pKdBank='" + pKdBank + '\'' +
                ", pNamaBank='" + pNamaBank + '\'' +
                ", pFLag='" + pFLag + '\'' +
                ", pJenis='" + pJenis + '\'' +
                '}';
    }
}
