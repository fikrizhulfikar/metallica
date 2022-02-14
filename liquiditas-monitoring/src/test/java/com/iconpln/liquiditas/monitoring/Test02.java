package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.xmldoc.XmlDocx;
import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Test02 {
    @Autowired
    Environment env;

    @Test
    public void ini() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("menu_id", NamedIdentifier.REKAP_PEMBAYARAN.getValue());
        jsonObject.put("data_id", "d");
        System.out.println(jsonObject);
    }

    @Test
    public void test(){
        String tes="\\\"asda\\\"";
        System.out.println(tes.replaceAll("\\\\\"", ""));

    }

    @Test
    public void assistant(){
        String col[] = {"NOMOR",	"KET",	"COMP_CODE",	"DOC_NO",	"GROUP_ID",	"OSS_ID",	"FISC_YEAR",	"DOC_TYPE",	"DOC_DATE2",	"POST_DATE2",	"ENTRY_DATE2",	"REFERENCE",	"REV_WITH",	"REV_YEAR",	"DOC_HDR_TXT",	"CURRENCY",	"CURR_BAYAR",	"EXCH_RATE",	"REFERENCE_KEY",	"PMT_IND",	"TRANS_TYPE",	"SPREAD_VAL",	"LINE_ITEM",	"OI_IND",	"ACCT_TYPE",	"SPEC_GL",	"BUS_AREA",	"TPBA",	"AMT_LC",	"AMT_TC",	"AMT_WITH_BASE_TC",	"AMT_WITH_TC",	"AMOUNT",	"AMOUNT_BAYAR",	"ASSIGNMENT",	"ITEM_TEXT",	"COST_CTR",	"GL_ACCT",	"CUSTOMER",	"VENDOR",	"BASE_DATE",	"TERM_PMT",	"DUE_ON",	"PMT_BLOCK",	"BANK_BYR",	"NO_REK_HOUSE_BANK",	"PRTNR_BANK_TYPE",	"BANK_KEY",	"BANK_ACCOUNT",	"ACCOUNT_HOLDER",	"NAMA_BENEF",	"NO_REK_BENEF",	"BANK_BENEF",	"REF_NUM_BANK",	"PO_NUM",	"PO_ITEM",	"REF_KEY1",	"REF_KEY2",	"REF_KEY3",	"INT_ORDER",	"WBS_NUM",	"CASH_CODE",	"DR_CR_IND",	"PARTIAL_IND",	"AMT_WITH_BASE_LC",	"AMT_WITH_LC",	"METODE_PEMBAYARAN",	"NO_GIRO",	"TGL_TAGIHAN_DITERIMA",	"TGL_REVERSE",	"TGL_RENCANA_BAYAR",	"SUMBER_DANA",	"KETERANGAN",	"VERIFIED_BY",	"VERIFIED_ON",	"STATUS_TRACKING",};
        for (int index = 0; index < col.length; index++){
            System.out.println("{\n" +
                    "                    \"aTargets\": ["+index+"],\n" +
                    "                    \"mRender\": function (data, type, full) {\n" +
                    "                        return full."+col[index].trim()+";\n" +
                    "                    }\n" +
                    "\n" +
                    "                },");
        }
    }

    @Test
    public void createRef(){
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String refnum = format.format(date.getTime())+"101";
        System.out.println("refnum : "+refnum);
    }

    @Test
    public void cetakDocxHtml(){
        String filesPath = "tempcorpay/xmldocx" + (new Date()).getTime() + "/";
        File filedir = new File(filesPath);
        filedir.mkdirs();
        filedir.setExecutable(true);
        filedir.setReadable(true);
        filedir.setWritable(true);

        try {

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edoc = dom.createElement("pdx:document");
            edoc.setAttribute("xmlns:pdx", "http://www.phpdocx.com/main");

            Element econfig = dom.createElement("pdx:config");
            Element eoutput = dom.createElement("pdx:output");
            eoutput.setAttribute("pdx:name", "output");
            eoutput.setAttribute("pdx:type", "docx");

            econfig.appendChild(eoutput);
            edoc.appendChild(econfig);
            dom.appendChild(edoc);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "config.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        //file content
        try{
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edoc = dom.createElement("pdx:document");
            edoc.setAttribute("xmlns:pdx", "http://www.phpdocx.com/main");

            Element econtent = dom.createElement("pdx:content");
            Element embedHtml = dom.createElement("pdx:embedHTML");
            Element edata = dom.createElement("pdx:data");
            edata.setAttribute("pdx:dataId", "");
            edata.setAttribute("pdx:type", "HTML");
            edata.appendChild(dom.createTextNode("<![CDATA[<style>\n" +
                    "            ul {color: blue; font-size: 14pt; font-family: Cambria}\n" +
                    "            table {border: 1px solid green}\n" +
                    "            td {font-family: Arial}\n" +
                    "            #redBG {background-color: red; color: #f0f0f0}\n" +
                    "            .firstP {margin-left: 220px}\n" +
                    "            </style>\n" +
                    "\n" +
                    "            <p class=\"firstP\">This is a simple paragraph with <strong>text in bold</strong>.</p>\n" +
                    "            <p>Now we include a list:</p>\n" +
                    "            <ul>\n" +
                    "                <li>First item.</li>\n" +
                    "                <li>Second item with subitems:\n" +
                    "                    <ul>\n" +
                    "                        <li style=\"color: red\">First subitem.</li>\n" +
                    "                        <li>Second subitem.</li>\n" +
                    "                    </ul>\n" +
                    "                </li>\n" +
                    "                <li id=\"redBG\">Third subitem.</li>\n" +
                    "            </ul>\n" +
                    "            <p>And now a table:</p>\n" +
                    "            <table>\n" +
                    "                <tbody><tr>\n" +
                    "                    <td style=\"background-color: #ffff00\">Cell 1 1</td>\n" +
                    "                    <td>Cell 1 2</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td>Cell 2 1</td>\n" +
                    "                    <td>Cell 2 2</td>\n" +
                    "                </tr>\n" +
                    "            </tbody></table>]]>"));
            embedHtml.appendChild(edata);
            econtent.appendChild(embedHtml);
            edoc.appendChild(econtent);
            dom.appendChild(edoc);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "content.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();
        }
        catch (Exception e){
            e.printStackTrace();
        }

        //file setting
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edocument = dom.createElement("pdx:document");
            edocument.setAttribute("xmlns:pdx","http://www.phpdocx.com/main");

            Element esettings = dom.createElement("pdx:settings");

            edocument.appendChild(esettings);
            dom.appendChild(edocument);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "settings.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        //create docx
        try {
            XmlDocx docx = new XmlDocx(filesPath + "config.xml", true);
            docx.setDocumentProperties(filesPath + "settings.xml");
            docx.addContent(filesPath + "content.xml");
            docx.render();
        } catch (Exception e){
            e.printStackTrace();
        }
//
//        //remove settings file
//        try {
//            Files.delete(Paths.get(filesPath + "config.xml"));
//            Files.delete(Paths.get(filesPath + "settings.xml"));
//            Files.delete(Paths.get(filesPath + "content.xml"));
//            filedir.delete();
//        } catch (Exception e){
//            System.out.println("Gagal menghapus file temp.");
//        }
    }
}
