$(document).ready(
  function(){
    $("#addEvent").click(addEvent);
  }
);

function addEvent(){
  var serverData = getServerData();
  var data = {
      name : $("#eventToAddName").val(),
      description : $("#eventToAddDes").val(),
      time : $("#eventToAddTime").val(),
      day : $("#selectDay").val(),
      month : $("#selectMonth").val(),
      year : $("#selectYear").val(),
      eventNum : serverData["events"].length
  }

  if(data.name != "" && data.description != "" && data.month != "-" && data.day != "-"){
    $.ajax({
      url: "/addEvent",
      method: "POST",
      data: data,
      success: success,
      error: error
    }).always(function (response) {
      res = JSON.parse(response);
      if(res.page == "/calendar"){
        window.location = res.page;
      } else{
        alert(res.message);
      }
    });
  } else{
    alert("Must fill out all fields for the event");
  }
}



function success(){

}

function error(){

}
