package com.iconpln.liquiditas.core.xmldoc;

import com.iconpln.liquiditas.core.alt.AltException;
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
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * Created by athia on 27-Nov-15.
 */
public class DocGenerator {

    Map<String,String> variables = new HashMap<>();
    Map<String,String> headerVariables = new HashMap<>();
    ArrayList<String> emptyVariables = new ArrayList<>();
    ArrayList<String> removeVariables = new ArrayList<>();
    Map<String,List<String>> listVariables = new HashMap<>();
    List<List<Map<String,String>>> tableVariables = new ArrayList<>();

    public void addVariable(String name, String value){
        addVariable(name, value, false);
    }

    public void addVariable(String name, String value, boolean isHeader){
        if(value == null || value.equals("")){
            emptyVariables.add(name);
        }
        else {
            if (isHeader) {
                headerVariables.put(name, value);
            } else {
                variables.put(name, value);
            }
        }
    }

    public void addListVariable(String name, List<String> values){
        if(values == null || values.isEmpty()){
            emptyVariables.add(name);
        }
        else {
            listVariables.put(name, values);
        }
    }

    public void addTableVariables(List<Map<String,String>> values){
        if(values != null && !values.isEmpty()) {
            tableVariables.add(values);
        }
    }

    public void removeVariable(String name){
        removeVariables.add(name);
    }

    //pakai xmldocx
    public void createDocFromTemplate(String templateFileName, String outputFileName) throws AltException{
        String filesPath = "tempcorpay/xmldocx" + (new Date()).getTime() + "/";
        File filedir = new File(filesPath);
        filedir.mkdirs();
        filedir.setExecutable(true);
        filedir.setReadable(true);
        filedir.setWritable(true);

        File output = new File(outputFileName);
        output.getParentFile().mkdirs();
        output.getParentFile().setExecutable(true);
        output.getParentFile().setReadable(true);
        output.getParentFile().setWritable(true);

        PrintWriter writer = null;

        //create file config
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edocument = dom.createElement("pdx:document");
            edocument.setAttribute("xmlns:pdx","http://www.phpdocx.com/main");

            Element econfig = dom.createElement("pdx:config");

            Element etemplate = dom.createElement("pdx:template");
//            etemplate.setAttribute("pdx:path",templateFileName);
            etemplate.setAttribute("pdx:path","upload/template/"+templateFileName+".docx");

            Element eoutput = dom.createElement("pdx:output");
            eoutput.setAttribute("pdx:name",outputFileName);
            eoutput.setAttribute("pdx:type","docx");

//            eoutput.setAttribute("pdx:type","pdf");

            econfig.appendChild(etemplate);
            econfig.appendChild(eoutput);
            edocument.appendChild(econfig);
            dom.appendChild(edocument);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "config.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();

        } catch (Exception e) {
            throw new AltException("Gagal membuat file config.");
        }

        //create file content
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document dom = db.newDocument();

            Element edocument = dom.createElement("pdx:document");
            edocument.setAttribute("xmlns:pdx","http://www.phpdocx.com/main");

            Element etempvar = dom.createElement("pdx:templateVariables");
            etempvar.setAttribute("pdx:preprocessedTemplate","false");

            if(!variables.isEmpty()){
                Element ereplace = dom.createElement("pdx:replaceVariableByText");
                ereplace.setAttribute("pdx:parseLineBreaks","true");
                for(Map.Entry<String,String> v : variables.entrySet()){
                    Element evar = dom.createElement("pdx:variable");
                    evar.setAttribute("pdx:variableName",v.getKey());

                    Element edata = dom.createElement("pdx:data");
                    edata.setAttribute("pdx:dataId","");
                    edata.setAttribute("pdx:dataType","text");

                    edata.appendChild(dom.createTextNode(v.getValue()));
                    evar.appendChild(edata);
                    ereplace.appendChild(evar);
                }
                etempvar.appendChild(ereplace);
            }

            if(!headerVariables.isEmpty()){
                Element ereplace = dom.createElement("pdx:replaceVariableByText");
                ereplace.setAttribute("pdx:parseLineBreaks","true");
                ereplace.setAttribute("pdx:target","header");
                for(Map.Entry<String,String> v : headerVariables.entrySet()){
                    Element evar = dom.createElement("pdx:variable");
                    evar.setAttribute("pdx:variableName",v.getKey());

                    Element edata = dom.createElement("pdx:data");
                    edata.setAttribute("pdx:dataId","");
                    edata.setAttribute("pdx:dataType","text");

                    edata.appendChild(dom.createTextNode(v.getValue()));
                    evar.appendChild(edata);
                    ereplace.appendChild(evar);
                }
                etempvar.appendChild(ereplace);
            }

            if(!listVariables.isEmpty()){}  //todo create xml for list variables

            if(!tableVariables.isEmpty()){
                for(List<Map<String,String>> tableVariable : tableVariables) {
                    Element ereplace = dom.createElement("pdx:replaceTableVariable");
                    ereplace.setAttribute("pdx:parseLineBreaks", "true");

                    Element edata = dom.createElement("pdx:data");
                    edata.setAttribute("pdx:dataId", "");
                    edata.setAttribute("pdx:type", "table");

                    for (Map<String, String> var : tableVariable) {
                        Element erow = dom.createElement("pdx:row");

                        for (Map.Entry<String, String> v : var.entrySet()) {
                            Element eitem = dom.createElement("pdx:item");
                            eitem.setAttribute("pdx:variableName", v.getKey());
                            eitem.setAttribute("pdx:wordFragmentName", "");
                            eitem.appendChild(dom.createTextNode(v.getValue()));
                            erow.appendChild(eitem);
                        }

                        edata.appendChild(erow);
                    }
                    ereplace.appendChild(edata);
                    etempvar.appendChild(ereplace);
                }
            }

            if(!removeVariables.isEmpty()){
                for(String s : removeVariables){
                    Element eremove = dom.createElement("pdx:removeTemplateVariable");
                    eremove.setAttribute("pdx:removeType","block");
                    eremove.setAttribute("pdx:variableName",s);
                    etempvar.appendChild(eremove);
                }
            }

            if(!emptyVariables.isEmpty()){

            }

            edocument.appendChild(etempvar);
            dom.appendChild(edocument);

            Transformer tr = TransformerFactory.newInstance().newTransformer();
            tr.setOutputProperty(OutputKeys.METHOD, "xml");
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            FileOutputStream fos = new FileOutputStream(filesPath + "content.xml");
            tr.transform(new DOMSource(dom), new StreamResult(fos));
            fos.close();

        } catch (Exception e) {
            throw new AltException("Gagal membuat file content.");
        }

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
            throw new AltException("Gagal membuat file setting.");
        }

        //create docx
        try {
            XmlDocx docx = new XmlDocx(filesPath + "config.xml", true);
            docx.setDocumentProperties(filesPath + "settings.xml");
            docx.addContent(filesPath + "content.xml");
            docx.render();
        } catch (Exception e){
            throw new AltException(e.getMessage());
        }

        //remove settings file
        try {
            Files.delete(Paths.get(filesPath + "config.xml"));
            Files.delete(Paths.get(filesPath + "settings.xml"));
            Files.delete(Paths.get(filesPath + "content.xml"));
            filedir.delete();
        } catch (Exception e){
            System.out.println("Gagal menghapus file temp.");
        }
    }

    public static void main(String[] args){
        System.out.println("test");
        try {
            XmlDocx docx = new XmlDocx("temp/test/config.xml", true);
            docx.setDocumentProperties("temp/test/settings.xml");
            docx.addContent("temp/test/content.xml");
            docx.render();
            System.out.printf("selesai");
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }
}
