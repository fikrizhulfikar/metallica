package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.PembelianValas;
import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.driver.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 9/29/17.
 */
@Repository
public class PembelianValasService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    @Transactional
    public int insertTrValas(List<PembelianValas> pembelianValasList, String date) {

        int resTemp;
        SimpleJdbcCall simpleJdbcCallDel = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_beli_valas_by_tgl");


        SqlParameterSource inDel = new MapSqlParameterSource()
                .addValue("p_tgl", date)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> outDel = simpleJdbcCallDel.execute(inDel);
        AppUtils.getLogger(this).info("RESPONSE DEL FOR DATE {}, {}",date,outDel.toString());
        String resDel = outDel.get("return").toString();
        resTemp = Integer.parseInt(resDel);

        if(resDel.equals("1") || resDel == "1") {
            SimpleJdbcCall simpleJdbcCallInsert = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_VALAS")
                    .withFunctionName("ins_beli_valas");

            for (PembelianValas pembelianValas : pembelianValasList) {

                SqlParameterSource inIns = new MapSqlParameterSource()
                        .addValue("p_id_beli_valas", null)
                        .addValue("p_bank_pengirim", pembelianValas.getBankPengirim())
                        .addValue("p_bank_penerima", pembelianValas.getBankPenerima())
                        .addValue("p_tgl_posting", pembelianValas.getTglPosting())
                        .addValue("p_curr", pembelianValas.getCurrency())
                        .addValue("p_pembelian", pembelianValas.getPembelian())
                        .addValue("p_kurs", pembelianValas.getKurs())
                        .addValue("p_no", pembelianValas.getNoSettlement())
                        .addValue("p_pay", pembelianValas.getPayReq())
                        .addValue("p_doc1", pembelianValas.getDoc1())
                        .addValue("p_doc2", pembelianValas.getDoc2())
                        .addValue("p_create_by", "VALAS SCHEDULER")
                        .addValue("p_konversi_idr", pembelianValas.getKonversiIdr())
                        .addValue("out_msg", OracleTypes.VARCHAR);
                Map<String, Object> outIns = simpleJdbcCallInsert.execute(inIns);
                resTemp = Integer.valueOf(outIns.get("return").toString());
                AppUtils.getLogger(this).error("RESPONSE INSERT FOR NO DOC1 : {}, DOC 2 : {} = {}", pembelianValas.getDoc1(), pembelianValas.getDoc2(),outIns.toString());
            }
        }
        return  resTemp;
    }
}
