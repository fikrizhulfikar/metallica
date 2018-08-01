package com.iconpln.liquiditas.core.domain;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.math.BigDecimal;
import java.util.Date;

@JsonPropertyOrder({
        "JENIS_PEMBAYARAN",
        "JATUH_TEMPO",
        "IDR",
        "USD",
        "JPY",
        "EUR",
        "OTHER",
        "STATUS_VALAS",
        "STATUS"
})
public class RencanaVsRealisasiIdr {

    @JsonProperty("JENIS_PEMBAYARAN")
    private String jenisPembayaran;
    @JsonProperty("JATUH_TEMPO")
    private Long jatuhTempo;
    @JsonProperty("IDR")
    private String idr;
    @JsonProperty("USD")
    private String usd;
    @JsonProperty("JPY")
    private String jpy;
    @JsonProperty("EUR")
    private String eur;
    @JsonProperty("OTHER")
    private String other;
    @JsonProperty("STATUS_VALAS")
    private String stausValas;
    @JsonProperty("STATUS")
    private String status;

    public String getJenisPembayaran() {
        return jenisPembayaran;
    }

    public void setJenisPembayaran(String jenisPembayaran) {
        this.jenisPembayaran = jenisPembayaran;
    }

    public Long getJatuhTempo() {
        return jatuhTempo;
    }

    public void setJatuhTempo(Long jatuhTempo) {
        this.jatuhTempo = jatuhTempo;
    }

    public String getIdr() {
        return idr;
    }

    public void setIdr(String idr) {
        this.idr = idr;
    }

    public String getUsd() {
        return usd;
    }

    public void setUsd(String usd) {
        this.usd = usd;
    }

    public String getJpy() {
        return jpy;
    }

    public void setJpy(String jpy) {
        this.jpy = jpy;
    }

    public String getEur() {
        return eur;
    }

    public void setEur(String eur) {
        this.eur = eur;
    }

    public String getOther() {
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }

    public String getStausValas() {
        return stausValas;
    }

    public void setStausValas(String stausValas) {
        this.stausValas = stausValas;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}