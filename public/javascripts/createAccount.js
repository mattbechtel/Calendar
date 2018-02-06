$(document).ready(
  function(){
    $("#submit").click(submit);
  }
);

function validateSubmission(username, password){
  if(alphaNumCheck(username) && username.length > 5 && alphaNumCheck(password) && password.length > 5){
    return true;
  } else{
    return false;
  }
}

function submit(){
  var data = {
    username: $("#username").val(),
    password: $("#password").val(),
  }

  if(validateSubmission(data.username, data.password)){
    $.ajax({
      url: "/createUser",
      method: "POST",
      data: data,
      success: loginSuccess,
      error: loginError
    }).always(function (response) {
      res = JSON.parse(response);
      //alert(res.page);
      if(res.page == "/login"){
        window.location = res.page;
      } else{
        alert(res.message);
      }
    });
 } else {
   alert("Invalid username or password");
 }

}

function loginSuccess(data){

}

function loginError(a, b, c){

}

function alphaNumCheck(entry) {
    let regex = /^[a-z0-9]+$/i;
    if (entry != null && entry.match(regex)) {
        return true;
    } else {
        return false;
    }
}
