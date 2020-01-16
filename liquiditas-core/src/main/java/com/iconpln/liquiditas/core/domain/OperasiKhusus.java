package com.iconpln.liquiditas.core.domain;

import java.util.List;

public class OperasiKhusus {
    private String pIdMetallica;
    private String pDocNo;
    private String pPmtProposalId;

    private List<ValasDetail> operasiKhususDetails;

    public String getpIdMetallica() {
        return pIdMetallica;
    }

    public void setpIdMetallica(String pIdMetallica) {
        this.pIdMetallica = pIdMetallica;
    }

    public String getpDocNo() {
        return pDocNo;
    }

    public void setpDocNo(String pDocNo) {
        this.pDocNo = pDocNo;
    }

    public String getpPmtProposalId() {
        return pPmtProposalId;
    }

    public void setpPmtProposalId(String pPmtProposalId) {
        this.pPmtProposalId = pPmtProposalId;
    }

    public List<ValasDetail> getoperasiKhususDetails() {
        return operasiKhususDetails;
    }

    public void setoperasiKhususDetails(List<ValasDetail> operasiKhususDetails) {
        this.operasiKhususDetails = operasiKhususDetails;
    }

    @Override
    public String toString(){
        return "Valas{" +
                "pIdMetallica='" + pIdMetallica + '\'' +
                ", pDocNo='" + pDocNo + '\'' +
                ", pPmtProposalId='" + pPmtProposalId + '\'' +
                ", operasiKhususDetail=" + operasiKhususDetails +
                '}';
    }
}
