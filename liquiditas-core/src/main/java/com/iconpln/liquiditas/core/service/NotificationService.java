package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.Notification;
import java.math.BigDecimal;
import java.util.ArrayList;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long save(Notification notification) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("SAVE_NOTIFICATION");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_create_by", notification.getCreateBy(), OracleTypes.VARCHAR)
                .addValue("p_create_date", notification.getCreateDate(), OracleTypes.DATE)
                .addValue("p_is_seen", notification.isSeen() ? "1" : "0", OracleTypes.VARCHAR)
                .addValue("p_title", notification.getTitle(), OracleTypes.VARCHAR)
                .addValue("p_message", notification.getMessage(), OracleTypes.VARCHAR)
                .addValue("p_topic", notification.getTopic(), OracleTypes.VARCHAR);
        BigDecimal result = call.executeFunction(BigDecimal.class, in);
        return result.longValue();
    }

    public ArrayList<Notification> findByTopics(String topics) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("FIND_BY_TOPICS");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_topics", topics, OracleTypes.VARCHAR);
        return call.returningResultSet("result", (RowMapper<Notification>) (resultSet, i) -> {
            Notification notification = new Notification();
            notification.setId(resultSet.getLong("ID"));
            notification.setCreateBy(resultSet.getString("CREATE_BY"));
            notification.setCreateDate(resultSet.getDate("CREATE_DATE"));
            notification.setSeen(resultSet.getString("IS_SEEN").equalsIgnoreCase("0") ? false : true);
            notification.setTitle(resultSet.getString("TITLE"));
            notification.setTopic(resultSet.getString("TOPIC"));
            notification.setMessage(resultSet.getString("MESSAGE"));
            return notification;
        }).executeFunction(ArrayList.class, in);
    }

    public void editSeenById(Long id) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withProcedureName("EDIT_SEEN_BY_ID");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id", id, OracleTypes.NUMBER);
        call.execute(in);
    }

}
