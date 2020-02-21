package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.service.DboInvoiceItem;
import com.iconpln.liquiditas.core.alt.*;

import java.util.HashMap;
import java.util.Map;

public class Invoiceitem {
    public static final String TAG = Invoiceitem.class.getName();

    public AltDbRows list (AltHttpRequest request, AltHttpResponse response){
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.get(request.data);
    }

    public Map<String, Object> table (AltHttpRequest request, AltHttpResponse response){
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        int total = invoiceItem.count(request.data);
        AltDbRows list = invoiceItem.get(request.data);

        Map<String, Object> table = new HashMap<>();
        table.put("total", total);
        table.put("list", list);

        return table;
    }

    public Map<String, AltDbRow> keyval(AltHttpRequest req, AltHttpResponse res){
        DboInvoiceItem invoiceItem = new DboInvoiceItem(req);
        Map<String, AltDbRow> result = new HashMap<>();
        for (AltDbRow row: invoiceItem.get(req.data)) {
            result.put(row.get("vendor_no").toString(), row);
        }
        return result;
    }

    public int count(AltHttpRequest request, AltHttpResponse response){
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.count(request.data);
    }

    public AltDbRow retrieve (AltHttpRequest request, AltHttpResponse response) throws AltException {
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.retrieve(request.data);
    }

    public int insert (AltHttpRequest request, AltHttpResponse response ) throws AltException{
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.insert(request.data);
    }

    public int update (AltHttpRequest request, AltHttpResponse response) throws AltException{
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.update(request.data);
    }

    public int delete (AltHttpRequest request, AltHttpResponse response) throws AltException{
        DboInvoiceItem invoiceItem = new DboInvoiceItem(request);
        return invoiceItem.delete(request.data);
    }
}
