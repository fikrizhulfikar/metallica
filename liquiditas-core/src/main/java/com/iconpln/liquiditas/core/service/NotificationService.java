package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.Notification;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
                .addValue("p_title", notification.getTitle(), OracleTypes.VARCHAR)
                .addValue("p_message", notification.getMessage(), OracleTypes.VARCHAR)
                .addValue("p_additional_info", notification.getAdditionalInfo(), OracleTypes.VARCHAR)
                .addValue("p_topic", notification.getTopic(), OracleTypes.VARCHAR);
        BigDecimal result = call.executeFunction(BigDecimal.class, in);
        return result.longValue();
    }

    public ArrayList<Notification> findByTopics(String username, String topics, int start, int length) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("FIND_BY_TOPICS");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", username, OracleTypes.VARCHAR)
                .addValue("p_topics", topics, OracleTypes.VARCHAR)
                .addValue("p_start", start, OracleTypes.NUMBER)
                .addValue("p_length", length, OracleTypes.NUMBER);
        return call.returningResultSet("result", (RowMapper<Notification>) (resultSet, i) -> {
            Notification notification = new Notification();
            notification.setId(resultSet.getLong("ID"));
            notification.setCreateBy(resultSet.getString("CREATE_BY"));
            notification.setCreateDate(resultSet.getTimestamp("CREATE_DATE").getTime());
            notification.setTitle(resultSet.getString("TITLE"));
            notification.setTopic(resultSet.getString("TOPIC"));
            notification.setAdditionalInfo(resultSet.getString("ADDITIONAL_INFO"));
            notification.setMessage(resultSet.getString("MESSAGE"));
            String isSeen = resultSet.getString("IS_SEEN");
            notification.setSeen((isSeen == null || isSeen.equalsIgnoreCase("0"))  ? false : true);
            return notification;
        }).executeFunction(ArrayList.class, in);
    }

    public BigDecimal countUnseenNotificationByTopics(String username, String topics) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("COUNT_UNSEEN_NOTIF");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", username, OracleTypes.VARCHAR)
                .addValue("p_topics", topics, OracleTypes.VARCHAR);
        return call.executeFunction(BigDecimal.class, in);
    }

    public void editSeenById(String username, Long id) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withProcedureName("EDIT_SEEN");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", username, OracleTypes.VARCHAR)
                .addValue("p_id", id, OracleTypes.NUMBER);
        call.execute(in);
    }

    public void flagSeen(String username) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withProcedureName("FLAG_SEEN");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", username, OracleTypes.VARCHAR);
        call.execute(in);
    }

}
