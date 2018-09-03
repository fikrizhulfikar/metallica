$(document).ready(function () {
    getAllData();

});

function getAllData() {
    showLoadingCss()

    $.ajax({
        url: baseUrl + "/api_operator/placement/get_penerimaan_subsidi",
        dataType: 'JSON',
        type: "GET",
        data:{
          pJenis : ""
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("list penerimaan subsidi : ",res);

            $.each(res.return, function (key, val) {

                var newHtml;

                if (newRoleUser[0] != "ROLE_MS_LIKUIDITAS" && newRoleUser[0] != "ROLE_DM_SETTLEMENT" && newRoleUser[0] != "ROLE_SETTLEMENT" && newRoleUser[0] != "ROLE_ADMIN" && newRoleUser[0] != "ROLE_MS_PENDAPATAN" && newRoleUser[0] != "ROLE_DM_TERPUSAT") {

                    newHtml ="<tr>"+
                        "<th>"+val.BANK+"</td>"+
                        "<td style='display:none;' class='kdbank_subsidi'>"+val.KODE_BANK+"</td>"+
                        "<td class='kdbank_potensi'>"+accounting.formatNumber(val.JUMLAH, 2, ".", ",")+"</td>"+
                        "<td align='center'><input width='100%' class='form-control' type='number' value='0'></td>" +
                        "<td align='center'>-</td>" +
                        "</tr>";
                }else{
                    newHtml ="<tr>"+
                    "<th>"+val.BANK+"</td>"+
                    "<td style='display:none;' class='kdbank_subsidi'>"+val.KODE_BANK+"</td>"+
                    "<td class='kdbank_potensi'>"+accounting.formatNumber(val.JUMLAH, 2, ".", ",")+"</td>"+
                    "<td align='center'><input width='100%' class='form-control' type='number' value='0'></td>" +
                    "<td align='center'><button class='btn btn-primary' style='cursor: pointer'>Save</button></td>" +
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

$('table').on('click', '.btn', function()
{
    var row = $(this).closest('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    console.log(row.find('.kdbank_subsidi').html());
    console.log(row.find('input').val());

    $.ajax({
        url: baseUrl + "/api_operator/placement/ins_saldo_penerimaan_subsidi",
        dataType: 'JSON',
        type: "POST",
        data : {
            pJenis:"",
            pKodeBank: row.find('.kdbank_subsidi').html(),
            pJumlah: row.find('input').val(),
        },
        success: function (res) {
            console.log("res ins penerimaaan subsidi : ",res);
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

});