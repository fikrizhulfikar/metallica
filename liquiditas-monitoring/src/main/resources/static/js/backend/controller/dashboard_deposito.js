document.addEventListener('DOMContentLoaded', function (event) {
   getDashDeposito($("#dashDepositoSearch").val());
});

$("#dashDepositoSearch").on("change", function () {
   getDashDeposito($(this).val());
});

function getDashDeposito(curr){
    $('#table-dash-deposito tbody').empty();
    $('#table-dash-deposito').dataTable().fnDestroy();
    let dash = $("#table-dash-deposito").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/deposito/get_dashboar_deposito",
            "type" : "GET",
            "dataType" : "json",
            "data" : {
                pCurr : curr,
            }
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"orderable": false,"visible": false,"render": (data, type, row) => {return data.BANK_CONTERPARTY;}},
            {"data": null,"orderable": false,"render": (data, type, row) => {return data.NO_ACCOUNT;}},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return new Intl.NumberFormat('id-ID').format(data.NOMINAL);}},
            {"data": null,"orderable": false,"render": (data, type, row) => {return data.INTEREST;}},
            {"data": null,"orderable": false,"render": (data, type, row) => {return data.JUMLAH_HARI;}},
            {"data": null,"orderable": false,"render": (data, type, row) => {
                    let tp;
                    if (data.TGL_PENEMPATAN === null){
                        tp = "-";
                    }else {
                        let date = new Date(data.TGL_PENEMPATAN);
                        tp = ("0" + date.getDate()).slice(-2) +"/"+ ("0" + (date.getMonth()+1)).slice(-2) +"/"+ date.getFullYear();
                    }
                    return tp;
            }},
            {"data": null,"orderable": false,"render": (data, type, row) => {
                    let jt;
                    if (data.JATUH_TEMPO === null){
                        jt = "-";
                    }else {
                        let date = new Date(data.JATUH_TEMPO);
                        jt = ("0" + date.getDate()).slice(-2) +"/"+ ("0" + (date.getMonth()+1)).slice(-2) +"/"+ date.getFullYear();
                    }
                    return jt;
            }},
            {"data": null,"orderable": false,"render": (data, type, row) => {
                    let jt;
                    if (data.TGL_PENCAIRAN === null){
                        jt = "-";
                    }else {
                        let date = new Date(data.TGL_PENCAIRAN);
                        jt = ("0" + date.getDate()).slice(-2) +"/"+ ("0" + (date.getMonth()+1)).slice(-2) +"/"+ date.getFullYear();
                    }
                    return jt;
                }},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return new Intl.NumberFormat('id-ID').format(data.BUNGA_ACCRUAL)},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return new Intl.NumberFormat('id-ID').format(data.POKOK_BUNGA)},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"orderable": false,"render": (data, type, row) => {return data.KETERANGAN;}},
        ],

        "createdRow" : function (row, data, dataIndex){
            if ( data["JENIS"] === "PENCAIRAN" ) {
                $(row).css({
                    "color": "#ff6767",
                    "font-weight" : "bold",
                });
            };

            if ( data["BANK_CONTERPARTY"].includes("TOTAL") ) {
                $(row).css({
                    "background-color": "#ffd67a",
                    "font-weight" : "bold",
                });
            };

            if ((data["BANK_CONTERPARTY"] === "JUMLAH TOTAL DEPOSITO")){
                $(row).css({
                    "background-color": "#aec7fd",
                    "font-weight" : "bold",
                });
            };

        },

        "drawCallback" : function (settings){
            let groupColumn = 0;
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'}).data();

            console.log(array);
            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
                if (last !== group.BANK_CONTERPARTY){
                    let count = 1;

                    for (let j=i; j<array.length; j++){
                        let first = array[i].BANK_CONTERPARTY;
                        if (j === array.length) break;
                        if (first !== array[j].BANK_CONTERPARTY) break;
                        count+= 1;
                    }
                    console.log(count);
                    $(rows).eq(i).before(
                        // '<tr class="group"><td rowspan="'+((group.BANK_CONTERPARTY.includes("TOTAL")) ? 1 : count)+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK_CONTERPARTY+'</td></tr>'
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK_CONTERPARTY+'</td></tr>'
                    );
                    last = group.BANK_CONTERPARTY;
                }
                // if (lastri !== group.BANK){
                //     let count2 = 1;
                //
                //     for (let j=i; i<array.length; j++){
                //         let second = array[i].BANK;
                //         if (j === array.length) break;
                //         if (second !== array[j].BANK) break;
                //         count2+= 1;
                //     }
                //
                //     $(rows).eq(i).before(
                //         '<tr class="group"><td rowspan="'+count2+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK+'</td></tr>'
                //     );
                //     lastri = group.BANK;
                // }
            });
        }
    });
}