const LAST_YEAR = 2016;

 var Calendar = function (ID) {
     this.ID = ID;
     this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
         'October', 'November', 'December'
     ];
     var date = new Date();
     this.currentMonth = date.getMonth();
     this.currentYear = date.getFullYear();
     this.currentDay = date.getDate();
 };
 Calendar.prototype.nextMonth = function () {
     if (this.currentMonth == 11) {
         this.currentMonth = 0;
         this.currentYear = this.currentYear + 1;
     } else {
         this.currentMonth = this.currentMonth + 1;
     }

     this.showCurrCalendar();
 };
 Calendar.prototype.previousMonth = function () {
     if (this.currentMonth == 0 && this.currentYear != LAST_YEAR + 1) {
         this.currentMonth = 11;
         this.currentYear = this.currentYear - 1;
     } else if(this.currentMonth != 0 && this.currentYear != LAST_YEAR) {
         this.currentMonth = this.currentMonth - 1;
     }

     this.showCurrCalendar();
 };
 Calendar.prototype.showCurrCalendar = function () {
     this.showMonthlyCal(this.currentYear, this.currentMonth);
 };
 Calendar.prototype.showMonthlyCal = function (year, month) {
     var date = new Date(),
        first_day_of_month = new Date(year, month, 1).getDay(),
         last_day_of_month = new Date(year, month + 1, 0).getDate(),
         last_day_of_last_month = month == 0 ? new Date(year - 1, 11, 0).getDate() : new Date(year, month, 0)
         .getDate();
     var HTML = '<div id="Name_Calendar" class="name">';
     HTML += '<h1 id="Name_Month" class="name">' + this.Months[month] + ' ' + year + '</h1>'
     HTML += '</div>'
     HTML += '<ul class="weekdays">';
     for (var i = 0; i < this.weekdays.length; i++) {
         HTML += '<li>' + this.weekdays[i] + '</li>';
     }
     HTML += '</ul>';
     var i = 1;
     do {
         var dateCalendar = new Date(year, month, i).getDay();
         if (dateCalendar == 0) {
             HTML += '<ul class="days">';
         } else if (i == 1) {
             HTML += '<ul class="days">';
             var k = last_day_of_last_month -first_day_of_month + 1;
             for (var j = 0; j <first_day_of_month; j++) {
                 HTML += '<li class = "other-month">';
                 HTML += '<div class = "date">' + k + '</div>';
                 HTML += '<p class="eventInfo"></p>';
                 HTML += '</li>';
                 k++;
             }
         }
         var check = new Date();
         var checkYear = check.getFullYear();
         var checkMonth = check.getMonth();
         if (checkYear == this.currentYear && checkMonth == this.currentMonth && i == this.currentDay) {
            HTML += '<li class = "day">';
            HTML += '<div class="today"><img src="/stylesheets/today.png" height="25px" width="25px">' + i + '</div>';
            HTML += '<p id= day' + i + "mon" + this.currentMonth + "y" + this.currentYear + ' class="eventBox"></p>';
            HTML += '</li>';

             $("#selectMonth").val(this.currentMonth + 1);
             $("#selectDay").val(this.currentDay);
         } else {
            HTML += '<li class = "day">';
            HTML += '<div class="date">' + i + '</div>';
            HTML += '<p id= day' + i + "mon" + this.currentMonth + "y" + this.currentYear + ' class="eventBox"></p>';
            HTML += '</li>';
         }
         if (dateCalendar == 6) {
             HTML += '</ul>';
         } else if (i == last_day_of_month) {
             var k = 1;
             for (dateCalendar; dateCalendar < 6; dateCalendar++) {
                 HTML += '<li class = "other-month">';
                 HTML += '<div class = "date">' + k + '</div>';
                 HTML += '<p id= day' + i + "mon" + this.currentMonth + "y" + this.currentYear + ' class="eventBox"></p>';
                 HTML += '</li>';
                 k++;
             }
         }
         i++;
     } while (i <= last_day_of_month);
     document.getElementById(this.ID).innerHTML = HTML;
     loadData();


 };
 window.onload = function () {
   var calendar = new Calendar("calendar");
   calendar.showCurrCalendar();
   document.getElementById('buttonNext').onclick = function () {
       calendar.nextMonth();
   };
   document.getElementById('buttonPrev').onclick = function () {
       calendar.previousMonth();
   };
   //$('#eventToAddTime').timepicker({ 'scrollDefault': 'now' });

   var selectTime = document.getElementById("eventToAddTime");
   for(var i = 0; i <= 24; i++){
     for(var j = 00; j <= 30; j+=30){
       var opt = document.createElement('option');
       if(j != 30 || i != 24){
         if(j == 0){
          opt.value = " " + i + ":0" + j;
          opt.innerHTML = " " +  i + ":0" + j;
          selectTime.appendChild(opt);
        } else{
          opt.value = " " + i + ":" + j;
          opt.innerHTML = " " + i + ":" + j;
          selectTime.appendChild(opt);
        }
       }

     }
   }
}

function loadData(){
let dataCookie = getCookie('data');
  if (dataCookie) {
    const data = parseObjectFromCookie(dataCookie);
    var serverData = JSON.parse(data);
    var day, pId, text, month, year, eventNum, name;
    if(serverData["events"] != undefined){
      for(var i = 0; i < serverData["events"].length; i++){
        day = serverData["events"][i].day;
        month = serverData["events"][i].month - 1;
        year = serverData["events"][i].year;
        name = serverData["events"][i].name + "\n";
        text = serverData["events"][i].description + serverData["events"][i].time;
        pId = "#"  + "day" + day + "mon" + month + "y" + year;
        let divEventName = document.createElement('div');
        divEventName.className = "eventName";
        divEventName.innerText = name;
        divEventName.id = pId.slice(1) + "eventName" + i;

        let divEventInfo = document.createElement('div');
        divEventInfo.className = "eventInfo";
        divEventInfo.innerText =  "\r\n" +  text + " ";
        divEventInfo.id = pId.slice(1) + "event" + i;

        let btn = document.createElement("BUTTON");
        btn.className = "btn btn-danger float-right delete";
        btn.id = pId.slice(1) + "event" + i + "delete";
        btn.textContent = "X";

        btn.addEventListener('click', function(){deleteEvent(divEventName.id, divEventInfo.id, btn.id);});
        let p = document.getElementById(pId.slice(1));
        if(p != undefined){
          p.appendChild(btn);
          divEventName.appendChild(divEventInfo);
          $(pId).append(divEventName);
          $(pId).append(divEventInfo);
        }
      }
    }
  } else {
    alert("problem loading data from server, please reload page");
  }
}

const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const deleteCookie = (name) => {
  document.cookie = name + '=; max-age=0;';
};

const parseObjectFromCookie = (cookie) => {
  const decodedCookie = decodeURIComponent(cookie);
  return decodedCookie;
};

const getServerData = (name) => {
  let dataCookie = getCookie('data');
  const data = parseObjectFromCookie(dataCookie);
  var serverData = JSON.parse(data);
  return serverData;
}


function deleteEvent(divEventNameId, divEventInfoId, divBtnId){
  divEventNameId = "#" + divEventNameId;
  divEventInfoId = "#" + divEventInfoId;
  divBtnId = "#" + divBtnId;

  $(divEventNameId).remove();
  $(divEventInfoId).remove();
  $(divBtnId).remove();
  var eventNum = divEventInfoId.substring(divEventInfoId.indexOf('t') + 4, divEventInfoId.length);
  //console.log(eventNum);
  $.ajax({
    url: "/deleteEvent",
    method: "POST",
    data: eventNum,
    success: success,
    error: error
  }).always(function (response) {
    res = JSON.parse(response);
    //alert(res.page);
    window.location = "/calendar";
  });
}
