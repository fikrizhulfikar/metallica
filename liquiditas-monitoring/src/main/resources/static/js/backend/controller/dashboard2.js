function rencanaBayarBarLine(){
    const dataSource = {
        chart : {
            caption : "Analisa Realisasi Pembayaran",
            subcaption : "Treasury, PT. PLN (Persero)",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0"
        },
        categories : [
            {
                category : [
                    {
                        label : "1 January 2020"
                    },
                    {
                        label : "2 January 2020"
                    },
                    {
                        label : "3 January 2020"
                    },
                    {
                        label : "4 January 2020"
                    },
                    {
                        label : "5 January 2020"
                    }
                ]
            }
        ],
        dataset : [
            {
                seriesname : "Rencana Pembayaran",
                renderas : "line",
                data : [
                    {
                        value: "1441290"
                    },
                    {
                        value: "855912"
                    },
                    {
                        value: "911404"
                    },
                    {
                        value: "648136"
                    },
                    {
                        value: "648136"
                    }
                ]
            },
            {
                seriesname : "Obligasi",
                data : [
                    {
                        value: "92970"
                    },
                    {
                        value: "77685"
                    },
                    {
                        value: "68352"
                    },
                    {
                        value: "76791"
                    },
                    {
                        value: "76791"
                    }
                ]
            },
            {
                seriesname : "Valas",
                data : [
                    {
                        value: "380000"
                    },
                    {
                        value: "779000"
                    },
                    {
                        value: "100000"
                    },
                    {
                        value: "100000"
                    },
                    {
                        value: "100000"
                    }
                ]
            },
            {
                seriesname : "Lain-lain",
                data : [
                    {
                        value: "970000"
                    },
                    {
                        value: ""
                    },
                    {
                        value: "390900"
                    },
                    {
                        value: "100000"
                    },
                    {
                        value: "100000"
                    }
                ]
            },
            {
                seriesname : "Gaji Pegawai",
                data : [
                    {
                        value: ""
                    },
                    {
                        value: ""
                    },
                    {
                        value: "90000"
                    },
                    {
                        value: ""
                    },
                    {
                        value: ""
                    }
                ]
            },
        ]
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function tableRekapMataUang(){
    let mataUang = $("#matauang").DataTable({
        searching : false,
        paging : false,
        bInfo : false,
        bLengthChange : false,
        footerCallback : function (row, data, start, end, display) {
            let intVal = function ( i ) {return typeof i === 'string' ? i.replace(/[\Rp]/g, '')*1 : typeof i === 'number' ? i : 0;};
            let api = this.api();
            let total = api.column(2,{page:'current'}).data().reduce((a,b)=>{return intVal(a)+intVal(b);}, 0);
            $("#matauang tfoot").find('td').eq(1).html(new Intl.NumberFormat().format(total));
        }
    });
}

function tableJenisRekening(){
    let table_jenis_rekening = $("#jenis-rekening-table").DataTable({
        bInfo: false,
        paging : false,
        searching : false,
        bLengthChange: false,
        footerCallback : function(row, data, start, end, display){
            let intVal = (i) => {return typeof i === 'string' ? i.replace(/[\Rp]/g, '')*1 : typeof i === 'number' ? i : 0};
            let api = this.api();
            let total_col1 = api.column(1, {page: 'current'}).data().reduce((a,b)=>{return intVal(a)+intVal(b)},0);
            let total_col2 = api.column(2, {page: 'current'}).data().reduce((a,b)=>{return intVal(a)+intVal(b)},0);
            $("#jenis-rekening-table tfoot").find('td').eq(1).html('<b>'+new Intl.NumberFormat().format(total_col1)+'</b>');
            $("#jenis-rekening-table tfoot").find('td').eq(2).html('<b>'+new Intl.NumberFormat().format(total_col2)+'</b>');
        }
    });
}

function tableRekeningInvestasi(){
    let table_rek_investasi = $("#rekening-investasi-table").DataTable({
        bInfo: false,
        paging : false,
        searching : false,
        bLengthChange: false,
        footerCallback : function(row, data, start, end, display){
            let intVal = (i) => {return typeof i === 'string' ? i.replace(/[\Rp]/g, '')*1 : typeof i === 'number' ? i : 0};
            let api = this.api();
            let total_col1 = api.column(1, {page: 'current'}).data().reduce((a,b)=>{return intVal(a)+intVal(b)},0)
            let total_col2 = api.column(2, {page: 'current'}).data().reduce((a,b)=>{return intVal(a)+intVal(b)},0);
            $("#rekening-investasi-table tfoot").find('td').eq(1).html('<b>'+new Intl.NumberFormat().format(total_col1)+'</b>');
            $("#rekening-investasi-table tfoot").find('td').eq(2).html('<b>'+new Intl.NumberFormat().format(total_col2)+'</b>');
        }
    });
}

function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;
    // let current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString();
    console.log("Current Date : ",current_full_date);

    for (let i=0; i<5; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header-tanggal").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
        $("#header_tanggal_realisasi").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let main_rencana = $("#main-rencana").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/saldo_awal",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>';}},
            {"data": "ISANAK","visible":false},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            // console.log("Data Index: ",dataIndex);
            // console.log("Cok1 : ",$(row));
            const regexHead = RegExp("([A-Z])\\..");
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

            if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"]) && dataIndex === 0){
                $(row).css({
                    "color" : "white",
                    "background-color": "#a01629",
                    "cursor" : "pointer",
                });
                $(row).addClass("super-parent");
                $(row).attr("onclick", "showParents(this)");

            }else if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"]) && dataIndex > 0){
                $(row).css({
                    "color" : "white",
                    "background-color": "#16a085"
                });
                $(row).addClass("parent");
                $(row).addClass("grand-parent");
            }

            if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
                $(row).css({
                    "background-color": "#f1c40f",
                    "cursor": "pointer",

                });
                $(row).attr("onclick","showChild(this)");
                $(row).addClass("parent");
            };

            if (data["ISANAK"] === 1){
                $(row).addClass("child");
                $(row).hide();
            };

            if (data["URAIAN"] === null) {$(row).remove()};
        },
        "initComplete" : (settings, json) => {
            let parent = $(".super-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });
    let main_realisasi = $("#main-realisasi").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/saldo_realisasi",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>'}},
            {"data": "KODE","visible":false},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN5)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN4)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN3)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN2)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN1)+'</td>'}},
        ],
        "createdRow" : function (row, data, dataIndex){
            console.log("Data : ",data["URAIAN"]);
            const regexHead = RegExp("([A-Z])\\..");
            // const regexChild2 = RegExp("([A-Z])\\...")
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")

            if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"]) && (data["URAIAN"] === "Saldo Awal" || data["URAIAN"] === "Saldo Akhir")){
                $(row).css({
                    "color" : "white",
                    "background-color": "#a01629",
                    "cursor" : "pointer",
                });
                $(row).addClass("super-parent");
                $(row).addClass("parent");
                $(row).attr("onclick", "showParents(this)");
            }else if(data['ISANAK'] === 0 && !regexChild1.test(data["KODE"])){
                $(row).css({
                    "color" : "white",
                    "background-color": "#16a085"
                });
                $(row).addClass("grand-parent");
                $(row).addClass("parent");
            }

            if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
                $(row).css({
                    "background-color": "#f1c40f",
                    "cursor": "pointer",

                });
                $(row).attr("onclick","showChild(this)");
                $(row).addClass("parent");
            };

            if (data["ISANAK"] === 1){
                $(row).addClass("child");
                $(row).hide();
            };

            if (data["URAIAN"] === null) {$(row).remove()};
        },
        "initComplete" : (setting, json) => {
            let parent1 = $(".super-parent").nextUntil(".grand-parent");
            parent1.hide();
        }
    });
}

function tableRencanaImprestValas(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_imprest_valas").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#rencana_imprest_valas").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_recana_valas",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "name" : "bank",
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")}
            },
            {"data" : "URAIAN"},
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";}
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return data.RP_D0
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return data.RP_D1
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return data.RP_D2
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return data.RP_D3
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return data.RP_D4
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return data.RP_D4
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return data.RP_D6
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return data.RP_D7
                        }
                    }
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#bed0cb",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
    })
}

function tableRencanaImpres(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_rencana_imprest").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#dash_rencana_imprest").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_rencana_imprest",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "headerSort" : false,
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")},
            },
            {"data" : "URAIAN"},
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";}
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D0);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D1);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D2);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D3);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D6);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D7);
                        }
                    }
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#bed0cb",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
    })
}

function tableRealisasiBankCurrency(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    let tb_dash_real_bank_curr = $("#dash_real_bank_curr").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_curr",
            "data" : {
                "ptanggal" : "20200212"
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data" : "URAIAN"},
            {"data": "ORI_CURR_NOW"},
            {"data" : "EQ_IDR_NOW"},
            {
                "data" : "PERSEN_NOW",
                "render": (data) => {
                    return data.PERSEN_NOW + "%"
                },
                "createdCell" : (data) => {
                    (data.NOURUT_CURRENCY === 0) ? $(cell).css("background-color","#ffad33") : $(cell).css("background-color","#f7d39e");

                }
            },
            {"data": "ORI_CURR_WEEK"},
            {"data" : "EQ_IDR_WEEK"},
            {"data" : "PERSEN_WEEK"},
            {"data": "ORI_CURR_MONTH"},
            {"data" : "EQ_IDR_MONTH"},
            {"data" : "PERSEN_MONTH"},
            {"data": "ORI_CURR_YEAR"},
            {"data" : "EQ_IDR_YEAR"},
            {"data" : "PERSEN_YEAR"},
        ],
        "createdRow": (row, data, dataIndex) => {
            if (data["NOURUT_CURRENCY"] === 0){
                $(row).css({
                    "font-weight": "bold",
                    "background-color" : "#9bc3ff",
                })
            }
        }
    })
}

function tbDashRealBank(){
    let tb_dash_real_bank = $("#dash_real_bank").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_bank",
            "data" : {
                "ptanggalawal" : "20200212",
                "ptanggalakhir" : "20200212"
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "columns" : [
            {"data": "BANK"},
            {"data": "CURRENCY"},
            {"data": "RP_DINAMIS"},
        ]
    })
}

function showChild(el){
    let child = $(el).nextUntil(".parent");
    (child.is(":visible")) ? child.hide() : child.show()
    // console.log(child);
}

function showParents(el){
    let parent = $(el).nextUntil(".grand-parent");
    (parent.is(":visible")) ? parent.hide() : parent.show();
}

$(document).ready(function () {
    tableRekapMataUang();
    tableJenisRekening();
    tableRekeningInvestasi();
    rencanaBayarBarLine();
    tableMainDashboard();
    dataTable();
    tableRencanaImprestValas();
    tableRencanaImpres();
    tableRealisasiBankCurrency();

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function dataTable(){
$.ajax({
          url: baseUrl + "api_dashboard/get_rekening_vs_rencana",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_SALDO;
            var tes = JSON.stringify(data);
            $("#tglcetak").html(data[0].TANGGAL);

            var dataPieRekRencana = [];
            $.each(data, function (index, value) {
                var dataPieTemp = {
                    minvalue: '0',
                    maxvalue: value.PERSENTASE,
                    code: value.WARNA,
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana.push(dataPieTemp)
            });

            var dataPieRekRencana2 = [];
            $.each(data2, function (index, value) {
                var dataPieTemp2 = {
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana2.push(dataPieTemp2)
            });

            creteChartRekRencana(dataPieRekRencana, dataPieRekRencana2);
            hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-jenis-bank tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-jenis-bank tbody').append(html);
      }
     });
$.ajax({
   url: baseUrl + "api_dashboard/get_komposisi_saldo",
   dataType: 'JSON',
   type: "GET",
   success: function (res) {
       var data = res.return;
       $("#tglcetak").html(data[0].TANGGAL);
       $.each(data, function (key, val) {
         var html = "<tr>" +
             "<td>" + val.JENIS_REKENING + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
             "</tr>";
         $('#table-komposisi-saldo tbody').append(html);
       });

         var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
             "<td>TOTAL</td>" +
             "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL,2,".",",") + "</td>" +
             "</tr>";

       $('#table-komposisi-saldo tbody').append(total1);

       var dataPieKompSaldo = [];
         $.each(res.OUT_PIE_KOMPOSISI, function (index, value) {
//         console.log('PERSENTASE :'+value.PERSENTASE);
//         console.log('WARNA :'+value.WARNA);
             var dataPieTemp = {
                 minvalue: '0',
                 maxvalue: value.PERSENTASE,
                 code: value.WARNA
             };
             dataPieKompSaldo.push(dataPieTemp)
         });

         creteChartKompSaldo(dataPieKompSaldo);
         hideLoadingCss()
     },
     error: function () {
         // hideLoadingCss("Gagal Ambil Data");
         hideLoadingCss();
         $('#table-komposisi-saldo tbody').empty();
         var html = "<tr>" +
             "<td colspan='5' align='center'> No Data </td>" +
             "</tr>";
         $('#table-komposisi-saldo tbody').append(html);
     }
    });
$.ajax({
          url: baseUrl + "api_dashboard/get_rencana_pembayaran",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_BAR_CASHCODE;
//            var tes = JSON.stringify(res.return);
            var tes2 = JSON.stringify(data2);
            $("#tglcetak").html(data[0].TANGGAL);

            var dataChartRenPembayaran = [];
            $.each(data2, function (index, value) {
                var dataPieTemp = {
                    seriesname : value.CASH_DESCRIPTION,
                    data : [
                    {
                        value: value.HS
                    },
                    {
                        value: value.H1
                    },
                    {
                        value: value.H2
                    },
                    {
                        value: value.WEEKLY
                    },
                    {
                        value: value.MONTHLY
                    }
                    ]
                };
                dataChartRenPembayaran.push(dataPieTemp)
            });

            rencanaPembayaranBarLine(dataChartRenPembayaran);
            hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-jenis-bank tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-jenis-bank tbody').append(html);
      }
     });
$.ajax({
          url: baseUrl + "api_dashboard/get_realisasi_pembayaran",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_BAR_CASHCODE;
//            var tes = JSON.stringify(res.return);
            var tes2 = JSON.stringify(data2);
            console.log('CUKKK :'+tes2)
            $("#tglcetak").html(data[0].TANGGAL);

            var dataChartRealPembayaran = [];
            $.each(data2, function (index, value) {
                var dataPieTemp = {
                    seriesname : value.CASH_DESCRIPTION,
                    data : [
                    {
                        value: value.HS
                    },
                    {
                        value: value.H1
                    },
                    {
                        value: value.H2
                    },
                    {
                        value: value.WEEKLY
                    },
                    {
                        value: value.MONTHLY
                    }
                    ]
                };
                dataChartRealPembayaran.push(dataPieTemp)
            });

            realisasiPembayaranBarLine(dataChartRealPembayaran);
            hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-jenis-bank tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-jenis-bank tbody').append(html);
      }
     });
}

function creteChartRekRencana(data, data2) {
    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-rencana-pembayaran1',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption" : "Rencana Pembayaran",
                        "subcaption" : "Treasury, PT. PLN (Persero)",
                        "bgColor": "#FFFFFF",
                        "numbersuffix": "%",
                        "lowerLimitDisplay": "0%",
                        "upperLimitDisplay": "100%",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "8",
                        "pivotFillColor": "#000000",
                        "pivotFillAlpha": "100",
                        "pivotFillMix": "#77D5D4",
                        "valueBelowPivot": "0",
                        pivotFillAlpha: "1",
                        showTickMarks: "0",
                        showTickValues: "1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: "0",
                              maxvalue: data[0].maxvalue,
                              code: data[0].code
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: data[1].code
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: "100",
                              code: data[2].code
                          },
                       ]
                     },
                    "dials": {
                          "dial": [{
                         "id": "fd_dial",
                         alpha : 70,
                         "value": data2[1].dial
                       }, {
                         "id": "clth_dial",
                         "value": data2[0].dial
                       }
                      ]
                    }
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartKompSaldo(data) {
    var tes = JSON.stringify(data);
    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    console.log('WARNA :'+ tes);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-komposisi-saldo',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption" : "Komposisi Saldo",
                        "subcaption" : "Treasury, PT. PLN (Persero)",
                        "bgColor": "#FFFFFF",
                        "lowerLimitDisplay": " ",
                        "upperLimitDisplay": " ",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "8",
                        "valueBelowPivot": "0",
                        pivotFillAlpha:"0",
                        showTickMarks:"0",
                        showTickValues:"0",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: '0',
                              maxvalue: data[0].maxvalue,
                              code: data[0].code,
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: data[1].code
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: maxval2,
                              code: data[2].code
                          },
                          {
                              minvalue: maxval2,
                              maxvalue: '100',
                              code: data[3].code
                          }
                       ]
                     },
                    "dials": {
                          "dial": [
                          {
                              alpha:"0",
                              value:maxval2
                          }
                      ]
                    }
                }
            });
        fusioncharts.render();
    });
}

function rencanaPembayaranBarLine(data){

var tes = JSON.stringify(data);
    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran",
            subcaption : "Treasury, PT. PLN (Persero)",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0"
        },
        categories : [
            {
                category : [
                    {
                        label : "Hari H"
                    },
                    {
                        label : "Hari 1"
                    },
                    {
                        label : "Hari 2"
                    },
                    {
                        label : "Weekly"
                    },
                    {
                        label : "Monthly"
                    }
                ]
            }
        ],
        dataset : data
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "column-rencana-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function realisasiPembayaranBarLine(data){

var tes = JSON.stringify(data);
console.log('DZ :' +tes);
    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran",
            subcaption : "Treasury, PT. PLN (Persero)",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0"
        },
        categories : [
            {
                category : [
                    {
                        label : "Hari H"
                    },
                    {
                        label : "Hari 1"
                    },
                    {
                        label : "Hari 2"
                    },
                    {
                        label : "Weekly"
                    },
                    {
                        label : "Monthly"
                    }
                ]
            }
        ],
        dataset : data
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "column-realisasi-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}




