$(document).ready(function () {
    getAllData();
    var date = new Date();
    $("#date").text("Tanggal : "+ date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear());
    console.log("date",date);
});

function getAllData() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "/api_operator/placement/get_potensi",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            hideLoadingCss("")
            console.log("list potensi : ",res);

            var newHtml;
            $.each(res.return, function (key, val) {


                if (newRoleUser[0] != "ROLE_MS_LIKUIDITAS" && newRoleUser[0] != "ROLE_DM_SETTLEMENT" && newRoleUser[0] != "ROLE_SETTLEMENT" && newRoleUser[0] != "ROLE_ADMIN" && newRoleUser[0] != "ROLE_MS_PENDAPATAN" && newRoleUser[0] != "ROLE_DM_TERPUSAT") {

                    newHtml ="<tr>"+
                        "<td>"+val.BANK+"</td>"+
                        "<td style='display:none;' class='kdbank_potensi'>"+val.KODE_BANK+"</td>"+
                        "<td class='kdbank_potensi'>"+accounting.formatNumber(val.POTENSI_H0, 2, ".", ",")+"</td>"+
                        "<td class='kdbank_potensi'>"+accounting.formatNumber(val.POTENSI_H1, 2, ".", ",")+"</td>"+
                        "<td class='kdbank_potensi'>"+accounting.formatNumber(val.TOTAL, 2, ".", ",")+"</td>"+
                        "<td align='center'><input width='100%' class='form-control' type='number' value='0'></td>" +
                        "<td align='center'>-</td>" +
                        "</tr>";
                }else{
                    newHtml ="<tr>"+
                        "<td>"+val.BANK+"</td>"+
                        "<td style='display:none;' class='kdbank_potensi'>"+val.KODE_BANK+"</td>"+
                        "<td class=''>"+accounting.formatNumber(val.POTENSI_H0, 2, ".", ",")+"</td>"+
                        "<td class=''>"+accounting.formatNumber(val.POTENSI_H1, 2, ".", ",")+"</td>"+
                        "<td class=''>"+accounting.formatNumber(val.TOTAL, 2, ".", ",")+"</td>"+
                        "<td align='center'><input id='hnol' width='100%' class='form-control' type='number' value='"+val.POTENSI_H0+"'></td>" +
                        "<td align='center'><input id='hsatu' width='100%' class='form-control' type='number' value='"+val.POTENSI_H1+"'></td>" +
                        // "<td align='center'><button class='btn btn-primary' style='cursor: pointer'>Save</button></td>" +
                        "</tr>";
                }
                $("#table-main").append(newHtml);
            });

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updatePotensi()
{
    var row = $("#table-main").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var tes = document.querySelectorAll('td.kdbank_potensi');
    var list = [];

    $('#table-main > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        map.kdbank = $(this).find('.kdbank_potensi').html();
        map.potensi_h0 = cell.find('input#hnol').val();
        map.potensi_h1 = cell.find('input#hsatu').val();
        list.push(map)
    });
    console.log(list);

    $.ajax({
        url: baseUrl + "/api_operator/placement/ins_saldo_potensi",
        dataType: 'JSON',
        type: "POST",
        data : {
            /*pKodeBank: row.find('.kdbank_potensi').html(),
            pJumlah: row.find('input').val(),*/
            pData: JSON.stringify(list)
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
                location.reload();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

};