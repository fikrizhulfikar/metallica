var tanggal = new Date();
var tglAwal = new Date();
var tglAkhir = new Date();
var tanggal2 = new Date();
var time = tanggal.getHours();
var tempTableSearch = "";
var sesi = "";

const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
let idForm = urlParams.get('p');
let xhttp = new XMLHttpRequest();
let jsonObj = null;
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200){
        jsonObj = JSON.parse(this.responseText);
        let groupedBy = function (xs, key) {
            return xs.reduce((rv, x) => {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        createDiv(groupedBy(jsonObj.return, 'BANK_SUMBER'));
    }
};
xhttp.open('GET',  `${baseUrl}api_operator/placement_lcl/nota?pIdForm=${idForm}`, true);
xhttp.send();

function createDiv(obj){
    for (const property in obj){
        let tbody = createTableElement(obj[property]);
        let p = property.replace(/\s/g, '_');
        console.log(`${property} :`, tbody);
        let template = `<div class="col-md-6">
                <div class="card">
                    <div class="card-header align-items-center">Invoice<strong>#90-98792</strong></div>
                    <div class="card-block">
                        <div class="row">
                            <div class="col-md-4">
                                <div><strong>Bank Asal</strong></div>
                                <div>Nama Rekening</div>
                                <div>No Rekening</div>
                            </div>

                            <div class="col-md-4">
                                <div><strong>${property}</strong></div>
                                <div>${obj[property][0].JENIS_REKENING}</div>
                                <div>${obj[property][0].NO_REK_SUMBER}</div>
                            </div>
                            <div class="col-md-4" style="display:flex;justify-content:center;align-items:center;">
                                <img src=${getImgPath(p)} style="width: 90% !important;" alt=""/>
                            </div>
                        </div>
                        <div style="margin-top: 1em;">
                            <p>Mohon untuk dapat dipindahkan ke rekening dibawah ini :</p>
                        </div>

                        <div style="margin-top: 1em; overflow-x: auto;">
                            <table class="table table-striped table-responsive">
                                <thead>
                                <tr>
                                    <th class="center">NAMA BANK</th>
                                    <th>NO REKENING</th>
                                    <th>NOMINAL</th>
                                    <th class="center">NO SAP</th>
                                    <th class="right">KETERANGAN</th>
                                </tr>
                                </thead>
                               ${tbody.outerHTML}
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
        let element = htmlToElement(template);
        let row = document.getElementById('row_nota');
        row.append(element);
    }
}

function createTableElement(dataBind){
    let colArray = ["BANK_ASAL", "NO_REKENING", "NOMINAL", "NO_SAP", "KETERANGAN"];
    let tbody = document.createElement("tbody");
    dataBind.forEach(function (val, key) {
       let tr = document.createElement('tr');
       for (const p in val){
           if (colArray.includes(p)){
               let td = document.createElement('td');
               let content = document.createTextNode(val[p]);
               td.appendChild(content);
               tr.appendChild(td);
               tbody.appendChild(tr);
           }
       }
    });
    return tbody;
}

function htmlToElement(html) {
    let template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function getImgPath(p){
    let pathLogo = {
        "BANK_BCA" : '/static/images/bank/bca_logo.png',
        "BANK_BNI" : '/static/images/bank/bni_logo.svg',
        "BANK_BRI" : '/static/images/bank/bri_logo.png',
        "BANK_BRI_SYARIAH" : '/static/images/bank/bris_logo.png',
        "BANK_BTN" : '/static/images/bank/btn_logo.png',
        "BANK_BUKOPIN" : '/static/images/bank/bukopin_logo.png',
        "BANK_DANAMON_SYARIAH" : '/static/images/bank/danas_logo.png',
        "BANK_DKI" : '/static/images/bank/dki_logo.png',
        "BANK_MANDIRI" : '/static/images/bank/mandiri_logo.png',
        "BANK_MEGA" : '/static/images/bank/mega_logo.png',
        "BANK_OCBC_NISP" : '/static/images/bank/ocbc_logo.svg',
        "BANK_SYARIAH_MANDIRI" : '/static/images/bank/bmrs_logo.png',
    }
    return pathLogo[p];
}


