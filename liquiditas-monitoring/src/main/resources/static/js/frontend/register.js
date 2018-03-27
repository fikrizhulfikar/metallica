$( document ).ready(function() {
    var reg = $("#registration").val();
    showInfoReg(reg);

});

$("#registration").change(function() {
    showInfoReg($(this).val());
});

function showInfoReg(reg) {
    if(reg == "conference"){
        $("#info-summit").hide();
        $("#info-conference").show();
    }else{
        $("#info-conference").hide();
        $("#info-summit").show();
    }
}