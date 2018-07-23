
/*<![CDATA[*/

connect();
getNotifications();

function connect() {
    sockJsProtocols = ["xhr-streaming", "xhr-polling"];
    var socket = new SockJS(baseUrl + "liquiditas", null, {transports: sockJsProtocols});
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        topics.forEach(function (data) {
            stompClient.subscribe("/topic/"+data, function(message) {
                showMessageOutput(message);
            });
        });
    });
}

function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
        console.log("Disconnected");
    }

}

function showMessageOutput(message) {
    var data = JSON.parse(message.body);
    var added =
        '<a href="#" class="dropdown-item">\n' +
        '  <div class="message">\n' +
        '    <div>\n' +
        '      <small class="text-muted" id="notification_title"><b>'+data.title+'</b></small>\n' +
        '      <small class="text-muted float-right mt-1" id="notification_date"><b>'+"now"+'</b></small>\n' +
        '    </div>\n' +
        '    <div class="small text-muted text-truncate" id="notification_body"><b>'+data.message+'</b></div>\n' +
        '  </div>\n' +
        '</a>\n';

    var newItem = document.createElement('li');
    newItem.style.cssText = 'background-color:#f7f8f9';

    newItem.onclick = function () {
        showNotifModal(data.id, data.additionalInfo);
    };
    newItem.setAttribute("id", data.id);
    var divNode = document.createElement("div");
    divNode.innerHTML = added;
    newItem.appendChild(divNode);

    var list = document.getElementById("notification_div");
    list.insertBefore(newItem, list.childNodes[2]);

    var count = parseInt($("#notification_count").html());
    count+=1;
    $("#notification_count").html(count);
    $("#notification_count_title").html('You have ' + count + ' unread message.');
    $.toast({
        text : data.message,
        hideAfter : 5000,              // `false` to make it sticky or time in miliseconds to hide after
        textAlign : 'left',            // Alignment of text i.e. left, right, center
        position : 'bottom-right'       // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
    });
}

//for send message to socket server
// function sendContent() {
//     stompClient.send("/push/content", {}, "test send from client");
// }


function getNotifications() {
    $.ajax({
        type: "GET",
        url: baseUrl + "notification/get_notifications",
        async: true,
        success: function(res) {
            var drop_down =
                '<ul id="notification_div" class="dropdown-menu dropdown-menu-right dropdown-menu-lg show" style="width:750px !important;" >\n' +
                '  <div class="dropdown-header text-center">\n' +
                '   <strong id="notification_count_title"></strong>\n' +
                '  </div>\n' +
                '</ul>\n';
            var count = 0;
            $("#notification_li").append(drop_down);
            res.forEach(function (data) {
                var backgroundColor = "";
                var added = "";
                if (data.seen == true) {
                    backgroundColor = '<li id="'+data.id+'" style="background-color: white" onclick="showNotifModal(null, \''+data.additionalInfo+'\')">\n';
                    added += backgroundColor +
                        '<a href="#" class="dropdown-item">\n' +
                        '  <div class="message">\n' +
                        '    <div>\n' +
                        '      <small class="text-muted" id="notification_title">'+data.title+'</small>\n' +
                        '      <small class="text-muted float-right mt-1" id="notification_date">'+formatDate(new Date(data.createDate))+'</small>\n' +
                        '    </div>\n' +
                        '    <div class="small text-muted text-truncate" id="notification_body">'+data.message+'</div>\n' +
                        '  </div>\n' +
                        '</a>\n' +
                        '</li>\n';
                } else {
                    backgroundColor = '<li id="'+data.id+'" style="background-color: #f7f8f9" onclick="showNotifModal(\''+data.id+'\', \''+data.additionalInfo+'\')">\n';
                    added += backgroundColor +
                        '<a href="#" class="dropdown-item">\n' +
                        '  <div class="message">\n' +
                        '    <div>\n' +
                        '      <small class="text-muted" id="notification_title"><b>'+data.title+'</b></small>\n' +
                        '      <small class="text-muted float-right mt-1" id="notification_date"><b>'+formatDate(new Date(data.createDate))+'</b></small>\n' +
                        '    </div>\n' +
                        '    <div class="small text-muted text-truncate" id="notification_body"><b>'+data.message+'</b></div>\n' +
                        '  </div>\n' +
                        '</a>\n' +
                        '</li>\n';
                    count++;
                }
                $("#notification_div").append(added);
            });
            $("#notification_count").html(count);
            $("#notification_count_title").html('You have ' + count + ' unread message.');

        }
    });

}

function editSeenById(key) {
    $.ajax({
        type: "POST",
        url: baseUrl + "notification/edit_seen_by_id/" + key,
        async: true,
        contentType: 'application/x-www-form-urlencoded',
        success: function(obj) {
            $('#'+key+'').css("background-color", "white");
            var count = parseInt($("#notification_count").html());
            count -= 1;
            $("#notification_count").html(count);
            $("#notification_count_title").html('You have ' + count + ' unread message.');
            $('#'+key+'').prop('onclick',null).off('click');
        }
    });
}

function showNotifModal(key, additionalInfo) {
    if (key != null && key != 'null') {
        editSeenById(key);
    }
    if (additionalInfo != null && additionalInfo != 'null') {
        additionalInfo = additionalInfo.split(";");
        if (additionalInfo !== null) {
            var menu_id = additionalInfo[0];
            var data_id = additionalInfo[1];
            if (menu_id == 1 || menu_id == '1') {
                showRekapData(data_id);
            } else {
                showTripartite(data_id);
            }
        }
    }
}

function showRekapData(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdValas: id
        },
        success: function (res) {
            hideLoadingCss("")
            idValas = id
            $("#pTglJatuhTempo_rekap_data").val("");
            $("#pNilaiTagihan_rekap_data").val("");
            $("#pNoTagihan_rekap_data").val("");
            $("#pTglTagihan_rekap_data").val("");
            $("#pNoNotaDinas_rekap_data").val("");
            $("#pTglNotaDinas_rekap_data").val("");
            $('#pTglJatuhTempo_rekap_data').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
            $('#pTglTagihan_rekap_data').datepicker({dateFormat: 'dd/mm/yy'});
            $('#pTglNotaDinas_rekap_data').datepicker({dateFormat: 'dd/mm/yy'});

            tempVendor = res[0].ID_VENDOR;
            tempUnit = res[0].ID_UNIT;

            setSelectJenisPembayaran("pJenisPemabayaran_rekap_data", "", res[0].ID_JENIS_PEMBAYARAN);
            setSelectCurr("pCurrency_rekap_data", "", res[0].CURRENCY, "REKAP");
            setSelectBank("pBankTujuan_rekap_data", "", "TUJUAN", res[0].KODE_BANK_TUJUAN, "REKAP");
            setSelectBank("pBankPembayar_rekap_data", "", "PEMBAYAR", res[0].KODE_BANK_PEMBAYAR, "REKAP");
            setSelectVendor("pVendor_rekap_data", res[0].ID_JENIS_PEMBAYARAN, res[0].ID_VENDOR);
            setSelectUnit("pUnitPenerima_rekap_data", res[0].ID_JENIS_PEMBAYARAN, res[0].ID_UNIT);

            $("#pTglJatuhTempo_rekap_data").val(res[0].TGL_JATUH_TEMPO);
            $("#pNilaiTagihan_rekap_data").val(res[0].TOTAL_TAGIHAN);
            $("#pNoTagihan_rekap_data").val(res[0].NO_TAGIHAN);
            $("#pTglTagihan_rekap_data").val(res[0].TGL_TAGIHAN);
            $("#pNoNotaDinas_rekap_data").val(res[0].NO_NOTDIN);
            $("#pTglNotaDinas_rekap_data").val(res[0].TGL_NOTDIN);
            $("#pKeterangan_rekap_data").val(res[0].DESKRIPSI);
            $("#pTipeTransaksi_rekap_data").val(res[0].TIPE_TRANSAKSI);
            $("#pTglTerimaInvoice_rekap_data").val(res[0].TGL_TERIMA_INVOICE);

            setTimeout(function () {
                $("#pVendor_rekap_data").select2({
                    width: "100%"
                });
                $("#pUnitPenerima_rekap_data").select2({
                    width: "100%"
                });
                $('#rekap-data-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
            hideLoadingCss()

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function showTripartite(id) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/tripartite/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdTripartite: id
        },
        success: function (res) {
            hideLoadingCss("");
            idTripartite = id;

            $("#pTglJatuhTempo_tripartite").val(res[0].TGL_JATUH_TEMPO);
            $("#pTglJatuhTempoH2_tripartite").val(res[0].H2_JATUH_TEMPO);
            $("#pNominalSebelumPajak_tripartite").val(res[0].NOMINAL_SBLM_PAJAK);
            $("#pPajak_tripartite").val(res[0].PAJAK);
            $("#pNominalDenganUnderlying_tripartite").val(res[0].NOMINAL_UNDERLYING);
            $("#pNominalTanpaUnderlying_tripartite").val(res[0].NOMINAL_TANPA_UNDERLYING);
            $("#pSpread_tripartite").val(res[0].SPREAD);
            $("#pNoInvoice_tripartite").val(res[0].NO_INVOICE);
            $("#pTglInvoice_tripartite").val(res[0].TGL_TERIMA_INVOICE);
            $("#pKursJisdor_tripartite").val(res[0].KURS_JISDOR);
            $("#pTglTerimaInvoice_tripartite").val(res[0].TGL_INVOICE);
            $("#pNoNotdin_tripartite").val(res[0].NO_NOTDIN);
            // $("#pNoNotaDinas").val(res[0].TGL_NOTDIN);
            $("#pDeskripsi_tripartite").val(res[0].DESKRIPSI);

            tempVendor = res[0].ID_VENDOR;

            setSelectJenisPembayaran("pJenisPemabayaran_tripartite", "TRIPARTITE", res[0].ID_JENIS_PEMBAYARAN);
            setSelectBank("pBankCounterparty_tripartite", "", "PEMBAYAR", res[0].ID_BANK_CONTERPARTY, "TRIPARTITE");
            setSelectCurr("pCurrency_tripartite", "", res[0].CURRENCY, "TRIPARTITE");
            $("#pTipeTransaksi").val(res[0].TIPE_TRANSAKSI);

            setTimeout(function () {
                $("#pVendor_tripartite").select2({
                    width: "100%"
                });
                $('#tripartite-data-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function formatDate(date) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1, // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "am" : "pm";

    return month + "/" + day + "/" + year + " " + hourFormatted + ":" +
        minuteFormatted + ":" + second + " " + morning;
}

/*]]>*/
