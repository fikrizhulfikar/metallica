package com.iconpln.liquiditas.core.domain;


import java.math.BigDecimal;

public class RekapPembayaran {

//    @JsonProperty("ID_VENDOR")
    public String idVendor;
//    @JsonProperty("ID_JENIS_PEMBAYARAN")
    public String idJenisPembayaran;
    public String idUnitAnggaran;
    public String idPosAnggaran;
    public String idSubPosAnggaran;
//    @JsonProperty("ID_UNIT")
    public String idUnit;
//    @JsonProperty("CURRENCY")
    public String currency;
//    @JsonProperty("TOTAL_TAGIHAN")
    public BigDecimal totalTagihan;
//    @JsonProperty("TGL_JATUH_TEMPO")
    public String tglJatuhTempo;
//    @JsonProperty("KODE_BANK_TUJUAN")
    public String kodeBankTujuan;
//    @JsonProperty("KODE_BANK_PEMBAYAR")
    public String kodeBankPembayar;
//    @JsonProperty("NO_TAGIHAN")
    public String noTagihan;
//    @JsonProperty("TGL_TAGIHAN")
    public String tglTagihan;
//    @JsonProperty("NO_NOTDIN")
    public String noNotDin;
//    @JsonProperty("TGL_NOTDIN")
    public String tglNotDin;
//    @JsonProperty("STATUS_VALAS")
    public String statusValas;
//    @JsonProperty("COUNT_DOWN")
    public String countdown;
//    @JsonProperty("DESKRIPSI")
    public String deskripsi;
//    @JsonProperty("TIPE_TRANSAKSI")
    public String tipeTransaksi;
//    @JsonProperty("TGL_TERIMA_INVOICE")
    public String tglTerimaInvoice;
//    @JsonProperty("TGL_LUNAS")
    public String tglLunas;
//    @JsonProperty("STATUS_TRACKING")
    public String statusTracking;

    public String getIdVendor() {
        return idVendor;
    }

    public void setIdVendor(String idVendor) {
        this.idVendor = idVendor;
    }

    public String getIdJenisPembayaran() {
        return idJenisPembayaran;
    }

    public void setIdJenisPembayaran(String idJenisPembayaran) {
        this.idJenisPembayaran = idJenisPembayaran;
    }

    public String getIdUnitAnggaran() {
        return idUnitAnggaran;
    }

    public void setIdUnitAnggaran(String idUnitAnggaran) {
        this.idUnitAnggaran = idUnitAnggaran;
    }

    public String getIdPosAnggaran() {
        return idPosAnggaran;
    }

    public void setIdPosAnggaran(String idPosAnggaran) {
        this.idPosAnggaran = idPosAnggaran;
    }

    public String getIdSubPosAnggaran() {
        return idSubPosAnggaran;
    }

    public void setIdSubPosAnggaran(String idSubPosAnggaran) {
        this.idSubPosAnggaran = idSubPosAnggaran;
    }

    public String getIdUnit() {
        return idUnit;
    }

    public void setIdUnit(String idUnit) {
        this.idUnit = idUnit;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getTotalTagihan() {
        return totalTagihan;
    }

    public void setTotalTagihan(BigDecimal totalTagihan) {
        this.totalTagihan = totalTagihan;
    }

    public String getTglJatuhTempo() {
        return tglJatuhTempo;
    }

    public void setTglJatuhTempo(String tglJatuhTempo) {
        this.tglJatuhTempo = tglJatuhTempo;
    }

    public String getKodeBankTujuan() {
        return kodeBankTujuan;
    }

    public void setKodeBankTujuan(String kodeBankTujuan) {
        this.kodeBankTujuan = kodeBankTujuan;
    }

    public String getKodeBankPembayar() {
        return kodeBankPembayar;
    }

    public void setKodeBankPembayar(String kodeBankPembayar) {
        this.kodeBankPembayar = kodeBankPembayar;
    }

    public String getNoTagihan() {
        return noTagihan;
    }

    public void setNoTagihan(String noTagihan) {
        this.noTagihan = noTagihan;
    }

    public String getTglTagihan() {
        return tglTagihan;
    }

    public void setTglTagihan(String tglTagihan) {
        this.tglTagihan = tglTagihan;
    }

    public String getNoNotDin() {
        return noNotDin;
    }

    public void setNoNotDin(String noNotDin) {
        this.noNotDin = noNotDin;
    }

    public String getTglNotDin() {
        return tglNotDin;
    }

    public void setTglNotDin(String tglNotDin) {
        this.tglNotDin = tglNotDin;
    }

    public String getStatusValas() {
        return statusValas;
    }

    public void setStatusValas(String statusValas) {
        this.statusValas = statusValas;
    }

    public String getCountdown() {
        return countdown;
    }

    public void setCountdown(String countdown) {
        this.countdown = countdown;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getTipeTransaksi() {
        return tipeTransaksi;
    }

    public void setTipeTransaksi(String tipeTransaksi) {
        this.tipeTransaksi = tipeTransaksi;
    }

    public String getTglTerimaInvoice() {
        return tglTerimaInvoice;
    }

    public void setTglTerimaInvoice(String tglTerimaInvoice) {
        this.tglTerimaInvoice = tglTerimaInvoice;
    }

    public String getTglLunas() {
        return tglLunas;
    }

    public void setTglLunas(String tglLunas) {
        this.tglLunas = tglLunas;
    }

    public String getStatusTracking() {
        return statusTracking;
    }

    public void setStatusTracking(String statusTracking) {
        this.statusTracking = statusTracking;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("RekapPembayaran{");
        sb.append("idVendor='").append(idVendor).append('\'');
        sb.append(", idJenisPembayaran='").append(idJenisPembayaran).append('\'');
        sb.append(", idUnitAnggaran='").append(idUnitAnggaran).append('\'');
        sb.append(", idPosAnggaran='").append(idPosAnggaran).append('\'');
        sb.append(", idSubPosAnggaran='").append(idSubPosAnggaran).append('\'');
        sb.append(", idUnit='").append(idUnit).append('\'');
        sb.append(", currency='").append(currency).append('\'');
        sb.append(", totalTagihan=").append(totalTagihan);
        sb.append(", tglJatuhTempo='").append(tglJatuhTempo).append('\'');
        sb.append(", kodeBankTujuan='").append(kodeBankTujuan).append('\'');
        sb.append(", kodeBankPembayar='").append(kodeBankPembayar).append('\'');
        sb.append(", noTagihan='").append(noTagihan).append('\'');
        sb.append(", tglTagihan='").append(tglTagihan).append('\'');
        sb.append(", noNotDin='").append(noNotDin).append('\'');
        sb.append(", tglNotDin='").append(tglNotDin).append('\'');
        sb.append(", statusValas='").append(statusValas).append('\'');
        sb.append(", countdown=").append(countdown);
        sb.append(", deskripsi='").append(deskripsi).append('\'');
        sb.append(", tipeTransaksi='").append(tipeTransaksi).append('\'');
        sb.append(", tglTerimaInvoice='").append(tglTerimaInvoice).append('\'');
        sb.append(", tglLunas='").append(tglLunas).append('\'');
        sb.append(", statusTracking='").append(statusTracking).append('\'');
        sb.append('}');
        return sb.toString();
    }

}