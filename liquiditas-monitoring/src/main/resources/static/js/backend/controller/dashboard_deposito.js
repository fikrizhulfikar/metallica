document.addEventListener('DOMContentLoaded', function (event) {
   getDashDeposito();
});

function getDashDeposito(){
    let dash = $("#table-dash-deposito").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/deposito/get_dashboar_deposito",
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"orderable": false,"visible": false,"render": (data, type, row) => {return data.URAIAN;}},
            {"data": null,"orderable": false,"visible": false,"render": (data, type, row) => {return data.BANK;}},
            {"data": null,"orderable": false,"render": (data, type, row) => {return data.CURRENCY;}},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return 'Rp '+ new Intl.NumberFormat().format(data.NOMINAL)},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return 'Rp '+ new Intl.NumberFormat().format(data.BUNGA)},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"orderable": false,"render" : (data, tyoe, row) => {return 'Rp '+ new Intl.NumberFormat().format(data.POKOK_BUNGA)},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],

        "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL" || data["NOURUT"] === "99")){
                $(row).css({
                    "background-color": "#F4D35E",
                });
            };
        },

        "drawCallback" : function (settings){
            let groupColumn = 0;
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;
            var lastri = null;
            let array = api.column(groupColumn, {page:'current'}).data();

            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
                if (last !== group.URAIAN){
                    let count = 1;

                    for (let j=i; i<array.length; j++){
                        let first = array[i].URAIAN;
                        if (j === array.length) break;
                        if (first !== array[j].URAIAN) break;
                        count+= 1;
                    }
                    count+=4;
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.URAIAN+'</td></tr>'
                    );
                    last = group.URAIAN;
                }
                if (lastri !== group.BANK){
                    let count2 = 1;

                    for (let j=i; i<array.length; j++){
                        let second = array[i].BANK;
                        if (j === array.length) break;
                        if (second !== array[j].BANK) break;
                        count2+= 1;
                    }

                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count2+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK+'</td></tr>'
                    );
                    lastri = group.BANK;
                }
            });
        }
    });
}