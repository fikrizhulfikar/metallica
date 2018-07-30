package com.iconpln.liquiditas.core.domain;

import java.math.BigDecimal;

public class SumberPlacement {

    private String bank;
    private BigDecimal receipt;
    private BigDecimal subsidi;
    private BigDecimal kmk;
    private BigDecimal potensi;

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public BigDecimal getReceipt() {
        return receipt;
    }

    public void setReceipt(BigDecimal receipt) {
        this.receipt = receipt;
    }

    public BigDecimal getSubsidi() {
        return subsidi;
    }

    public void setSubsidi(BigDecimal subsidi) {
        this.subsidi = subsidi;
    }

    public BigDecimal getKmk() {
        return kmk;
    }

    public void setKmk(BigDecimal kmk) {
        this.kmk = kmk;
    }

    public BigDecimal getPotensi() {
        return potensi;
    }

    public void setPotensi(BigDecimal potensi) {
        this.potensi = potensi;
    }

    @Override
    public String toString() {
        return "SumberPlacement{" +
                "bank='" + bank + '\'' +
                ", receipt=" + receipt +
                ", subsidi=" + subsidi +
                ", kmk=" + kmk +
                ", potensi=" + potensi +
                '}';
    }

}
