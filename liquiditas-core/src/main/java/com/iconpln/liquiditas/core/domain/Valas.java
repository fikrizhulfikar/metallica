package com.iconpln.liquiditas.core.domain;

import java.util.List;

public class Valas {
    private String pIdMetallica;
    private String pDocNo;
    private String pPmtProposalId;

    private List<ValasDetail> valasDetails;

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

    public List<ValasDetail> getValasDetails() {
        return valasDetails;
    }

    public void setValasDetails(List<ValasDetail> valasDetails) {
        this.valasDetails = valasDetails;
    }

    @Override
    public String toString(){
        return "Valas{" +
                "pIdMetallica='" + pIdMetallica + '\'' +
                ", pDocNo='" + pDocNo + '\'' +
                ", pPmtProposalId='" + pPmtProposalId + '\'' +
                ", valasDetail=" + valasDetails +
                '}';
    }
}