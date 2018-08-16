package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LMetallicaService {

    @Autowired
    private PlsqlUtils plsqlUtils;

    public List<String> grantedUris(String username) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", username, OracleTypes.VARCHAR);
        return plsqlUtils.function("PKG_LMETALLICA", "grantedUris", "", new RowMapper<String>() {
            @Override
            public String mapRow(ResultSet resultSet, int i) throws SQLException {
                return resultSet.getString("NAMA_FORM");
            }
        }, in);
    }

}
