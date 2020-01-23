package com.iconpln.liquiditas.core.domain;

public class ValasDetail {
    private String pPostDate ;
    private String pDocNo ;
    private String pCashCode;
    private String pAmount ;
    private String pBusArea ;
    private String pReference ;
    private String pCompCode ;
    private String pCurrency ;
    private String pDrCrInd ;
    private String pExchangeRate ;
    private String pFiscYear ;
    private String pGlAccount ;
    private String pLineNo ;
    private String pPmtProposalId ;
    private String pRemarks ;
    private String pCostCtr;
    private String pFlag ;

    public String getpCostCtr() {
        return pCostCtr;
    }

    public void setpCostCtr(String pCostCtr) {
        this.pCostCtr = pCostCtr;
    }

    public String getpPostDate() {
        return pPostDate;
    }

    public void setpPostDate(String pPostDate) {
        this.pPostDate = pPostDate;
    }

    public String getpDocNo() {
        return pDocNo;
    }

    public void setpDocNo(String pDocNo) {
        this.pDocNo = pDocNo;
    }

    public String getpAmount() {
        return pAmount;
    }

    public void setpAmount(String pAmount) {
        this.pAmount = pAmount;
    }

    public String getpBusArea() {
        return pBusArea;
    }

    public void setpBusArea(String pBusArea) {
        this.pBusArea = pBusArea;
    }

    public String getpReference() {
        return pReference;
    }

    public void setpReference(String pReference) {
        this.pReference = pReference;
    }

    public String getpCompCode() {
        return pCompCode;
    }

    public void setpCompCode(String pCompCode) {
        this.pCompCode = pCompCode;
    }

    public String getpCashCode() {return this.pCashCode;}

    public void setpCashCode(String pCashCode){ this.pCashCode = pCashCode;}

    public String getpCurrency() {
        return pCurrency;
    }

    public void setpCurrency(String pCurrency) {
        this.pCurrency = pCurrency;
    }

    public String getpDrCrInd() {
        return pDrCrInd;
    }

    public void setpDrCrInd(String pDrCrInd) {
        this.pDrCrInd = pDrCrInd;
    }

    public String getpExchangeRate() {
        return pExchangeRate;
    }

    public void setpExchangeRate(String pExchangeRate) {
        this.pExchangeRate = pExchangeRate;
    }

    public String getpFiscYear() {
        return pFiscYear;
    }

    public void setpFiscYear(String pFiscYear) {
        this.pFiscYear = pFiscYear;
    }

    public String getpGlAccount() {
        return pGlAccount;
    }

    public void setpGlAccount(String pGlAccount) {
        this.pGlAccount = pGlAccount;
    }

    public String getpLineNo() {
        return pLineNo;
    }

    public void setpLineNo(String pLineNo) {
        this.pLineNo = pLineNo;
    }

    public String getpPmtProposalId() {
        return pPmtProposalId;
    }

    public void setpPmtProposalId(String pPmtProposalId) {
        this.pPmtProposalId = pPmtProposalId;
    }

    public String getpRemarks() {
        return pRemarks;
    }

    public void setpRemarks(String pRemarks) {
        this.pRemarks = pRemarks;
    }

    public String getpFlag(){return this.pFlag;}

    public void setpFlag(String pFlag){this.pFlag = pFlag;}

    @Override
    public String toString(){
        return "ValasDetail{" +
                "pPostDate='" + pPostDate + '\'' +
                ", pDocNo='" + pDocNo + '\'' +
                ", pAmount='" + pAmount + '\'' +
                ", pBusArea='" + pBusArea + '\'' +
                ", pReference='" + pReference + '\'' +
                ", pCompCode='" + pCompCode + '\'' +
                ", pCurrency='" + pCurrency + '\'' +
                ", pDrCrInd='" + pDrCrInd + '\'' +
                ", pExchangeRate='" + pExchangeRate + '\'' +
                ", pFiscYear='" + pFiscYear + '\'' +
                ", pGlAccount='" + pGlAccount + '\'' +
                ", pLineNo='" + pLineNo + '\'' +
                ", pPmtProposalId='" + pPmtProposalId + '\'' +
                ", pRemarks='" + pRemarks + '\'' +
                ", pFlag='" + pFlag + '\'' +
                '}';
    }
}
