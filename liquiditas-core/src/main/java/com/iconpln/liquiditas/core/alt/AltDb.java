package com.iconpln.liquiditas.core.alt;

import com.iconpln.liquiditas.core.Alt;

import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AltDb {
    private static final String TAG = AltDb.class.getName();
    public static Map<String, AltDb> instances = new HashMap<>();
    private AltHttpRequest request;
    private Connection connect;
    private Statement statement = null;
    private PreparedStatement preparedStatement = null;
    private ResultSet resultSet = null;
    private Map<String, String> config = new HashMap<>();

    public AltDb(){
        this("default");
    }

    public AltDb(String db_instance){
        Map<String, String> config = new HashMap<>();
        config.put("persistent", AltConfig.get("db." + db_instance + ".persistent") != null ? AltConfig.get("db." + db_instance + ".persistent") : "true");
        config.put("class", AltConfig.get("db." + db_instance + ".class"));
        config.put("dsn", AltConfig.get("db." + db_instance + ".dsn"));
        config.put("username", AltConfig.get("db." + db_instance + ".username"));
        config.put("password", AltConfig.get("db." + db_instance + ".password"));

        this.config = config;
    }

    public AltDb(Map<String, String> config){
        this.config = config;
    }

    public static AltDb instance(){
        return AltDb.instance("default");
    }

    public static AltDb instance(String db_instance){
        AltDb.instances.putIfAbsent(db_instance, new AltDb(db_instance));

        return AltDb.instances.get(db_instance);
    }

    private void connect(){
        try {
            //load the driver class
            Class.forName(this.config.get("class"));

            //create the connection object
            connect = DriverManager.getConnection(this.config.get("dsn"), this.config.get("username"), this.config.get("password"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public AltDbRows query(String sql){
        Statement statement = null;
        ResultSet rs = null;
        AltDbRows res = null;

        try {
            if(this.connect == null || getConfig().getOrDefault("persistent", "false").equalsIgnoreCase("false"))
                this.connect();

            // create the statement object
            statement = this.connect.createStatement();

            // execute query
            System.out.println("SQL: " + sql);
            rs =  statement.executeQuery(this.transform(sql));



            ResultSetMetaData meta = rs.getMetaData();

            res = new AltDbRows();
            while(rs.next()){
                AltDbRow altDbRow = new AltDbRow();
                for(int i=1; i<=meta.getColumnCount(); i++){
                    altDbRow.put(meta.getColumnName(i).toLowerCase(), rs.getString(i));
                }

                res.add(altDbRow);
            }

            try{
                rs.close();
            }catch (Exception e){

            }
        }catch(Exception e){

        }finally {
            try{
                if(statement != null)
                    statement.close();
            }catch (Exception e){

            }finally {
                if(getConfig().getOrDefault("persistent", "false").equalsIgnoreCase("false"))
                    this.close();
            }

            return res == null ? new AltDbRows() : res;
        }
    }

    public int queryUpdate(String sql) throws AltException {
        int res = 0;

        try {
            if(this.connect == null || getConfig().getOrDefault("persistent", "false").equalsIgnoreCase("false"))
                this.connect();

            // create the statement object
            Statement statement = this.connect.createStatement();

            // execute query
            System.out.println("SQL: " + sql);
            res = statement.executeUpdate(sql);


            statement.close();
        }catch(Exception e){
            String errMsg = "\n-----EXCEPTION------\n";
            errMsg = errMsg + "MESSAGE: " + e.getMessage();
            if(!sql.equals("")){
                errMsg = errMsg + "SQL: " + sql;
            }
            if(this.request.data.get("__frontendurl__") != null){
                errMsg = errMsg + "\nFROM: " + this.request.data.get("__frontendurl__");
            }

            errMsg = errMsg + "\nBY: " + (Alt.get_userdata(Alt.get_token(this.request))).get("username");

            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            java.util.Date today = Calendar.getInstance().getTime();
            errMsg = errMsg + "\nAT: " + dateFormat.format(today);

            errMsg = errMsg + "\n-----END OF EXCEPTION------\n";
            System.out.println("" + errMsg);
        }finally {
            if(getConfig().getOrDefault("persistent", "false").equalsIgnoreCase("false"))
                this.close();

            return res;
        }
    }

    public int callProcedure(String name, List<Object> parameters) throws AltException {
        int res = 0;
        try {
            if(this.connect == null)
                this.connect();

            String[] tandatanya = new String[parameters.size()];
            for(int i = 0; i < tandatanya.length; i++){
                tandatanya[i] = "?";
            }

            String call = "{call "+name+" ("+String.join(",",tandatanya)+")}";
            System.out.println("CALL PROCEDURE : " + call);
            CallableStatement cstmt = this.connect.prepareCall(call);

            for(int i = 0; i < parameters.size(); i++){
                Object parameter = parameters.get(i);
                if(parameter instanceof String){
                    cstmt.setString(i+1,(String)parameter);
                }
                else if(parameter instanceof Integer){
                    cstmt.setInt(i+1, (int) parameter);
                }
                else if(parameter instanceof Float){
                    cstmt.setFloat(i+1,(float)parameter);
                }
            }

            if(cstmt.execute()) res = 1;
            cstmt.close();
        }catch(Exception e){
            throw new AltException(e);
        }finally {
            if(getConfig().getOrDefault("persistent", "false").equalsIgnoreCase("false"))
                this.close();

            return res;
        }
    }

    private void close() {
        try {
            if (connect != null) {
                connect.close();
                connect = null;
            }
        } catch (Exception e) {

        }
    }

    public Map<String, String> getConfig(){
        return this.config;
    }

    private String transform(String query){
        String sql = "";

        switch(this.config.get("class")){
            case "oracle.jdbc.driver.OracleDriver":
                query = query.replaceAll("LIMIT", "limit");
                query = query.replaceAll("OFFSET", "offset");

                String[] tmp = query.split(" limit ");
                if(tmp.length <= 1)
                    return query;

                int limit = 0;
                int offset = 0;

                String q = tmp[0].trim();
                String[] tmp2 = tmp[1].split(" offset ");
                if(tmp2.length == 1){
                    limit = Integer.valueOf(tmp2[1].trim());
                }else{
                    limit = Integer.valueOf(tmp2[0].trim());
                    offset = Integer.valueOf(tmp2[1].trim());
                }

                sql = "select * from ( select a.*, ROWNUM rnum from ( " + q + " ) a where ROWNUM <= " + (limit+offset) + " ) where rnum  > " + offset;
                break;

            default:
                sql = query;
                break;
        }

        return sql;
    }

    public String quote(int s){
        return this.quote(Integer.toString(s));
    }
    public String quote(double s){
        return this.quote(Double.toString(s));
    }
    public String quote(long s){
        return this.quote(Long.toString(s));
    }
    public String quote(float s){
        return this.quote(Float.toString(s));
    }
    public String quote(String s){
        return s == null ? "" : "'" + s + "'";
    }
}
