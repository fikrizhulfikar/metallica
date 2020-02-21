package com.iconpln.liquiditas.core.domain;

import java.util.List;

public class Cashcode {
    private String pCashcode;
    private String pCashdesc;
    private List<Cashcode> cashcodesDetail;

    public String getpCashcode() {
        return pCashcode;
    }

    public void setpCashcode(String pCashcode) {
        this.pCashcode = pCashcode;
    }

    public String getpCashdesc() {
        return pCashdesc;
    }

    public void setpCashdesc(String pCashdesc) {
        this.pCashdesc = pCashdesc;
    }

    public List<Cashcode> getCashcodesDetail() {
        return cashcodesDetail;
    }

    public void setCashcodesDetail(List<Cashcode> cashcodesDetail) {
        this.cashcodesDetail = cashcodesDetail;
    }

    public String toString(){
        return "Cashcode{" +
                "pCashcode='" + getpCashcode() + '\'' +
                ", pCashdesc='" + getpCashdesc() + '\'' +
                '}';
    }
}
