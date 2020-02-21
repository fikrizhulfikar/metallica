package com.iconpln.liquiditas.core.domain;

import java.util.List;

public class PindahBuku {
    private String pIdMetallica;
    private String pDocNo;
    private String pPmtProposalId;

    private List<PindahBukuDetail> pindahBukuDetails;

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

    public List<PindahBukuDetail> getPindahBukuDetails() {
        return pindahBukuDetails;
    }

    public void setPindahBukuDetails(List<PindahBukuDetail> pindahBukuDetails) {
        this.pindahBukuDetails = pindahBukuDetails;
    }

    @Override
    public String toString(){
        return "Valas{" +
                "pIdMetallica='" + pIdMetallica + '\'' +
                ", pDocNo='" + pDocNo + '\'' +
                ", pPmtProposalId='" + pPmtProposalId + '\'' +
                ", pindahBukuDetail=" + pindahBukuDetails +
                '}';
    }
}
