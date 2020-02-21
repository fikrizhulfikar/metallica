package com.iconpln.liquiditas.core.domain;

import java.util.List;

public class Invoice {
    List<InvoiceDetail> invoiceDetails;

    public List<InvoiceDetail> getInvoiceDetails() {
        return invoiceDetails;
    }

    public void setInvoiceDetails(List<InvoiceDetail> invoiceDetails) {
        this.invoiceDetails = invoiceDetails;
    }
}
