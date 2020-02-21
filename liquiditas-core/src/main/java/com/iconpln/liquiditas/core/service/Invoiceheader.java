package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.service.DboInvoiceHeader;
import com.iconpln.liquiditas.core.alt.*;

import java.util.HashMap;
import java.util.Map;

public class Invoiceheader {
    public static final String TAG = Invoiceheader.class.getName();

    public AltDbRows list (AltHttpRequest request, AltHttpResponse response){
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.get(request.data);
    }

    public Map<String, Object> table (AltHttpRequest request, AltHttpResponse response){
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        int total = invoiceHeader.count(request.data);
        AltDbRows list = invoiceHeader.get(request.data);

        Map<String, Object> table = new HashMap<>();
        table.put("total", total);
        table.put("list", list);

        return table;
    }

    public Map<String, AltDbRow> keyval(AltHttpRequest req, AltHttpResponse res){
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(req);
        Map<String, AltDbRow> result = new HashMap<>();
        for (AltDbRow row: invoiceHeader.get(req.data)) {
            result.put(row.get("doc_no").toString(), row);
        }
        return result;
    }

    public int count(AltHttpRequest request, AltHttpResponse response){
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.count(request.data);
    }

    public AltDbRow retrieve (AltHttpRequest request, AltHttpResponse response) throws AltException {
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.retrieve(request.data);
    }

    public int insert (AltHttpRequest request, AltHttpResponse response ) throws AltException{
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.insert(request.data);
    }

    public int update (AltHttpRequest request, AltHttpResponse response) throws AltException{
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.update(request.data);
    }

    public int delete (AltHttpRequest request, AltHttpResponse response) throws AltException{
        DboInvoiceHeader invoiceHeader = new DboInvoiceHeader(request);
        return invoiceHeader.delete(request.data);
    }
}
