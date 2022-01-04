package com.iconpln.liquiditas.core.xmldoc;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class NotaPinbukDocGenerator {
    protected List<List<Map<String, String>>> tableRowList = new ArrayList<>();
    protected List<List<Map<String, String>>> sectionList = new ArrayList<>();
    protected final String filesPath = "tempcorpay/xmldocx" + (new Date()).getTime() + "/";

    public void addTable (List<Map<String, String>> tableRow){
        tableRowList.add(tableRow);
    }

    public void createConfigFile(){
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edocument = dom.createElement("pdx:document");
            edocument.setAttribute("xmlns:pdx", "http://www.phpdocx.com/main");

            Element econfig = dom.createElement("pdx:template");

            Element eoutput = dom.createElement("pdx:output");
            eoutput.setAttribute("pdx:name", "output");
            eoutput.setAttribute("pdx:type", "docx");

            econfig.appendChild(eoutput);
            edocument.appendChild(econfig);
            dom.appendChild(edocument);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.METHOD, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "config.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public void createSettingFile(){
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
            e.getMessage();
        }
    }

    public Element addSection(Document dom){
        Element sectionElement = dom.createElement("pdx:addSection");
        sectionElement.setAttribute("pdx:type", "nextPage");
        sectionElement.setAttribute("pdx:paperType", "A4");
        return sectionElement;
    }

    public Element addHeaderText (Document dom, String text){
        Element etext = dom.createElement("pdx:addText");
        Element etextrun = dom.createElement("pdx:textRun");
        Element edata = dom.createElement("pdx:data");
        edata.setAttribute("pdx:dataId","");
        edata.setAttribute("pdx:dataType","text");
        Element etextRunStyle = dom.createElement("pdx:paragraphStyle");
        Element epartextAlign = dom.createElement("pdx:textAlign");
        epartextAlign.setAttribute("pdx:value", "center");
        Element ebold = dom.createElement("pdx:bold");
        ebold.setAttribute("pdx:value", "true");

        etextRunStyle.appendChild(epartextAlign);
        epartextAlign.appendChild(ebold);
        edata.appendChild(dom.createTextNode(text));
        etextrun.appendChild(edata);
        etext.appendChild(etextrun);
        return etext;
    }

    public void createDocFromTemplate(Map data) throws ParserConfigurationException {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document dom = db.newDocument();

        Element edocument = dom.createElement("pdx:document");
        edocument.setAttribute("xmlns:pdx","http://www.phpdocx.com/main");

        Element econtent = dom.createElement("pdx:content");
        Element eheading = addHeaderText(dom,data.get("header").toString());

        if (!data.isEmpty()){
            List<Map<String, List<Map<String, String>>>> list = (List<Map<String, List<Map<String, String>>>>) data.get("data");
            Element euppertable = dom.createElement("pdx:addTable");
            Element tableId = dom.createElement("pdx:data");
            tableId.setAttribute("pdx:type", "table");
            for (Map<String, List<Map<String, String>>> objList : list){
                Map<String, String> object = objList.get("upper").get(0);
                Element uptableRow = dom.createElement("pdx:row");
                Element rowData = dom.createElement("pdx:data");
                rowData.setAttribute("pdx:type", "row");
                Element rowCell11 = dom.createElement("pdx:cell");
                rowCell11.setNodeValue("Bank Asal");
                Element rowCell12 = dom.createElement("pdx:cell");
                rowCell12.setNodeValue("Bank Asal");
                Element rowCell21 = dom.createElement("pdx:cell");
                rowCell21.setNodeValue("Bank Asal");
                Element rowCell22 = dom.createElement("pdx:cell");
                rowCell22.setNodeValue("Bank Asal");
                Element rowCell31 = dom.createElement("pdx:cell");
                rowCell31.setNodeValue("Bank Asal");
                Element rowCell32 = dom.createElement("pdx:cell");
                rowCell32.setNodeValue("Bank Asal");
            }
        }
    }
}
