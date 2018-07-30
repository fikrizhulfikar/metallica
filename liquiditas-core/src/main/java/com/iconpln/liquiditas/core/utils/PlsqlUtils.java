package com.iconpln.liquiditas.core.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PlsqlUtils {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public <T> T functionFindOne(String packageName, String functionName, SqlParameterSource parameterSource, Class<T> clazz) {
        return new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName(packageName)
                .withFunctionName(functionName)
                .executeFunction(clazz, parameterSource);
    }

    public <T> List<T> function(String packageName, String functionName, String parameterName, RowMapper<T> rowMapper, SqlParameterSource parameterSource) {
        return new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName(packageName)
                .withFunctionName(functionName)
                .withReturnValue().returningResultSet(parameterName, rowMapper)
                .executeFunction(List.class, parameterSource);
    }

    public void procedure(String packageName, String procedureName, SqlParameterSource parameterSource) {
        new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName(packageName)
                .withProcedureName(procedureName)
                .execute(parameterSource);
    }

}
