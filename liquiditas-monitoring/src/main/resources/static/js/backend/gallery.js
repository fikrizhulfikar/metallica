var category_image= $('#selectbox_category').val();


function get_list_image()
{
    var preview = [];
    $.ajax({
        url: 'list_gallery',
        dataType: 'JSON',
        async: false, 
        type: "GET",
        data: {category : category_image},
        success: function (param) {
            $.each(param, function (index, value)
            {            
                preview.push("<img style='height:160px' src='../resources/assets/image/gallery/"+value[0].original_name+"'/>");
            });
        },
        error: function () {
            alert("something when wrong");
        }
    });
    return preview;
}

function get_list_function()
{
    var funct = [];
    $.ajax({
        url: 'list_gallery',
        dataType: 'JSON',
        async: false, 
        type: "GET",
        data: {category : category_image},
        success: function (param) {

            $.each(param, function (index, value)
            {            
                console.log("value",value);
                funct.push({caption: value[0].filename, width: "120px", url: "gallery/delete", key: value[0].id});
            });
        },
        error: function () {
            alert("something when wrong");
        }
    });
    console.log(funct);
    return funct;
}


$(document).ready(function(){

    var $el2 = $("#input-gallery");
    var footerTemplate = '<div class="file-thumbnail-footer">\n' +
    '   <div style="margin:5px 0">\n' +
    '       <input class="kv-input kv-new form-control input-sm {TAG_CSS_NEW}" value="{caption}" placeholder="Enter caption...">\n' +
    '   </div>\n' +
    '   {actions}\n' +
    '</div>';

    $el2.fileinput({
        uploadUrl: 'gallery/upload',
        // uploadAsync: false, // non aktifkan fileuploaded function
        maxFileCount: 5,
        maxFileSize: 1028,
        allowedFileExtensions: ["jpg", "gif", "png"],
        overwriteInitial: false,
        layoutTemplates: {footer: footerTemplate},
        initialPreview: get_list_image(),
        initialPreviewConfig: get_list_function(),
        uploadExtraData :   {category: category_image}
    });

    $('#input-gallery').on('fileuploaded', function(event) {
        location.reload();
    });

    $('#input-gallery').on('filepredelete', function(event, key) {
        console.log('Key = ' + key);
        var abort = true;
        if (confirm("Are you sure you want to delete this image?")) {
            abort = false;
        }
        return abort; 
    });

    $('#input-gallery').on('fileimagesloaded', function(event,key) {
        $(".kv-file-upload").hide();
    });

});