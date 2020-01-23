package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.Role;
import com.iconpln.liquiditas.core.domain.User;
import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Created by israjhaliri on 8/25/17.
 */
@Repository
public class UserService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public User loadByUsername(String username) {

        try{
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_SECMAN")
                    .withFunctionName("get_login_new");

            SqlParameterSource in = new MapSqlParameterSource()
                    .addValue("p_user_id", username)
                    .addValue("out_role", OracleTypes.VARCHAR)
                    .addValue("out_topics", OracleTypes.VARCHAR);
            Map<String, Object> out = simpleJdbcCall.execute(in);
            AppUtils.getLogger(this).info("data get_login : {}", out);

            List<Map<String,Object>> roleList = (List<Map<String, Object>>) out.get("OUT_ROLE");
            Set<Role> roleSet =  new HashSet<>();

            for (Map<String,Object> roles :  roleList) {
                Role role = new Role();
                role.setId(roles.get("ID_PARENT_GROUP").toString());
                role.setRole("ROLE_"+roles.get("ID_GROUP").toString());
                roleSet.add(role);
            }

            List<Map<String,Object>> userlist = (List<Map<String, Object>>) out.get("return");
            Map users = userlist.get(0);
            User user =  new User();
//            user.setId(Long.valueOf(users.get("ID").toString()));
            user.setUsername(users.get("USERNAME").toString());
            user.setPassword(users.get("PASSWORD").toString());
            user.setRoles(roleSet);

            List<Map<String, Object>> topicList = (List<Map<String,Object>>) out.get("OUT_TOPICS");
            Set<String> topics = new HashSet<>();

            for (Map<String, Object> topic : topicList) {
                topics.add(topic.get("id_sumber").toString());
            }

            user.setTopics(topics);

            AppUtils.getLogger(this).info("data user credential : {}", user.toString());
            return user;
        }catch (Exception e){
            e.printStackTrace();
            return new User();
        }
    }

    public List loadMenu(String username) {

        try{
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_SECMAN")
                    .withFunctionName("get_list_menu_by_id_user");

            SqlParameterSource in = new MapSqlParameterSource()
                    .addValue("p_user_id", username);
            Map<String, Object> out = simpleJdbcCall.execute(in);
            AppUtils.getLogger(this).info("data get_menu : {}", out.toString());

            List<Map<String,Object>> menulist = (List<Map<String, Object>>) out.get("return");

            return menulist;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


}
