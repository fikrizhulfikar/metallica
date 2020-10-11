$(document).ready(function(){
   var code_path = window.location.href.replace(baseUrl+"redirect?code=","");
   var n = code_path.search("&");
   var code = code_path.substr(0,n);

   console.log(code_path);
   console.log(code);

   $.ajax({
      url : sso_url+"/exchange",
      data : '{"code":"'+code+'"}',
      type : "POST",
      beforeSend : (xhr) => {
         xhr.setRequestHeader("Content-Type","application/json");
         xhr.setRequestHeader("App-Source",sso_key)
      },success : (res) => {
         console.log("Response : ",res);
         if (res.status === 200 && res.success === true){
            getUserPrinciple(res.data.token)
         }
      }
   })
});

function getUserPrinciple(token){
   $.ajax({
      url : sso_url+"/validate",
      type : "POST",
      data : token,
      crossDomain : true,
      beforeSend : (xhr) => {
         xhr.setRequestHeader("Authorization","Bearer "+token);
         xhr.setRequestHeader("App-Source", sso_key);
      },success : (res) => {
         console.log("Oke : ",res);
         if (res.status === 200 && res.success === true){
            $.ajax({
               url : baseUrl + "auth",
               type : "POST",
               data : {username : res.data.username},
               success : (res) => {
                  window.location.replace(baseUrl+"page_operator/home");
               }
            })
         }
      }
   })
}