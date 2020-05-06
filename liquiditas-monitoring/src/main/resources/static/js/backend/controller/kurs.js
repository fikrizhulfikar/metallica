/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */

$(document).ready(function () {
    getAllData();
});

function getAllData() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/kurs/get_data",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            hideLoadingCss("")
            // console.log(res);

            $.each(res.return, function (key, val) {
                var newHtml = "<tr>"+
                    "<th>"+val.MATA_UANG+"</th>"+
                    "<th>"+accounting.formatNumber(val.NILAI,2,".",",")+"</th>"+
                    "<th>"+accounting.formatNumber(val.KURS_JUAL,2,".",",")+"</th>"+
                    "<th>"+accounting.formatNumber(val.KURS_BELI,2,".",",")+"</th>"+
                    "<th>"+accounting.formatNumber(val.MEAN,2,".",",")+"</th>"+
                    "</tr>";
                $("#table-kurs-1 tbody").append(newHtml);
            });

            $.each(res.OUT_KURS_HARIAN, function (key, val) {
                var newHtml = "<tr>"+
                    "<th>"+val.TANGGAL+"</th>"+
                    "<th>"+accounting.formatNumber(val.KURS_BELI,2,".",",")+"</th>"+
                    "</tr>";
                $("#table-kurs-2 tbody").append(newHtml);
            });
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

