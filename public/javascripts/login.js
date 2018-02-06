/**
 * --------------------attaching handlers----------------------
 */
$(document).ready(
  function(){
    $("#login").click(login);
  }
);


/**
 *---------------------- functions------------------------------
 */

/**
 * makes sure that the values entered into the input fields are well formed
 * @param  {String} username [description]
 * @param  {String} password  [description]
 * @return {Boolean}      if the values are a valid username and password
 */
function validateLogin(username, password){
  if(alphaNumCheck(username) && username.length > 5 && alphaNumCheck(password) && password.length > 5){
    return true;
  } else{
    return false;
  }
}

/**
 * login event handler
 * @return {undefined}
 */
function login(){
  var res = "";
  var data = {
    username: $("#username").val(),
    password: $("#password").val()
  }

  if(validateLogin(data.username, data.password)){
    $.ajax({
      url: "/login",
      method: "POST",
      data: data,
      success: loginSuccess,
      error: loginError
    }).done(function (response) {
      res = JSON.parse(response);
      //alert(res.page);
      if(res.page == "/calendar"){
        window.location = res.page;
      } else{
        alert(res.message);
      }
    });
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
