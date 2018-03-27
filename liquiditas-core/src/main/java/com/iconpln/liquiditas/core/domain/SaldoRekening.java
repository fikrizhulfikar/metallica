package com.iconpln.liquiditas.core.domain;

/**
 * Created by israjhaliri on 9/29/17.
 */
public class SaldoRekening {

    private String companyCode;
    private String sendingBank;
    private String statementDate;
    private String bankAccount;
    private String glAccount;
    private String chartOfAccount;
    private String currency;
    private String endingAmount;
    private String housebank;
    private String accountId;

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getSendingBank() {
        return sendingBank;
    }

    public void setSendingBank(String sendingBank) {
        this.sendingBank = sendingBank;
    }

    public String getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(String statementDate) {
        this.statementDate = statementDate;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public String getGlAccount() {
        return glAccount;
    }

    public void setGlAccount(String glAccount) {
        this.glAccount = glAccount;
    }

    public String getChartOfAccount() {
        return chartOfAccount;
    }

    public void setChartOfAccount(String chartOfAccount) {
        this.chartOfAccount = chartOfAccount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getEndingAmount() {
        return endingAmount;
    }

    public void setEndingAmount(String endingAmount) {
        this.endingAmount = endingAmount;
    }

    public String getHousebank() {
        return housebank;
    }

    public void setHousebank(String housebank) {
        this.housebank = housebank;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    @Override
    public String toString() {
        return "SaldoRekening{" +
                "companyCode='" + companyCode + '\'' +
                ", sendingBank='" + sendingBank + '\'' +
                ", statementDate='" + statementDate + '\'' +
                ", bankAccount='" + bankAccount + '\'' +
                ", glAccount='" + glAccount + '\'' +
                ", chartOfAccount='" + chartOfAccount + '\'' +
                ", currency='" + currency + '\'' +
                ", endingAmount='" + endingAmount + '\'' +
                ", housebank='" + housebank + '\'' +
                ", accountId='" + accountId + '\'' +
                '}';
    }
}
