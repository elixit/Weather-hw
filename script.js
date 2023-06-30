
var city="";
var searchCity = $("#search-city"); // attatched variables to ID tagss 
let searchButton = $("#search-button");
let clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var findCity=[];
function find(city){
    for (var i=0; i<findCity.length; i++){
        if(city.toUpperCase()===findCity[i]){
            return -1;
        }
    }
    return 1;
}
var JSON;
var APIKey="9ee18d5e8fb59c9194e4b3fcd5b280cb"; // registered APIkey 

function displayWeather(event){
    event.preventDefault(); // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault allows event to not be triggered unless directed first, stops default behavior
    if(searchCity.val().trim()!==""){ // text areas length check for when user searches city
        city=searchCity.val().trim();
        currentWeather(city);
        console.log(city)
    }
}

function currentWeather(city){ // refers to user input
 
    
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey; // used https://stackoverflow.com/questions/34441645/how-to-pull-temperature-info-out-off-open-weather-map-api as reference for weather mapping and ajax
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(display){
        console.log(city)

        
        console.log(display);
      
  
        var iconurl="https://openweathermap.org/wn/";
      //https://openweathermap.org/current used as reference for weather conditions
        var date=new Date(display.dt*1000).toLocaleDateString(); // attatches new date to local storage, used https://www.w3schools.com/js/js_dates.asp as reference
   
        $(currentCity).html(display.name +"("+date+")" + "<img src="+iconurl+">");
        // https://stackoverflow.com/questions/49383333/jquery-toggle-between-celsius-and-fahrenheit-bad-logic-from-my-side used to help with temperature issues, I was having trouble with
        // https://stackoverflow.com/questions/17913681/how-do-i-use-tolocaletimestring-without-displaying-seconds
        var tempF = (display.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457"); // degree to farenheit symbol
        $(currentHumidty).html(display.main.humidity+"%");   
        var ws=display.wind.speed;
        var windmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windmph+"MPH");
        Index(display.coord.lon,display.coord.lat);
        forecast(display.id);
        if(display.cod==200){
            findCity=JSON.parse(localStorage.getItem("cityname")); // retrieves city name from local storage, allowing user to click it and get it's data
            console.log(findCity);
            if (findCity==null){
                findCity=[];
                findCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(findCity)); // stores city names in local storage
                addToList(city);
            }
            else {
                if(find(city)>0){
                    findCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(findCity)); //https://stackoverflow.com/questions/42290571/get-json-stringify-value   
                    addToList(city);
                }
            }
        }

    });
}
function Index(ln,lt){
    APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
           
            method:"GET" //https://www.w3schools.com/tags/ref_httpmethods.asp
            // 
            }).then(function(display){
                $(currentIndex).html(display.value);
            });
}
function forecast(cityid){
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(display){
        
        for (i=0;i<5;i++){
            const date= new Date((display.list[((i+1)*8)-1].dt)*1000).toLocaleDateString(); // https://www.w3schools.com/js/js_dates.asp
            var tempP= display.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempP-273.5)*1.80)+32).toFixed(2);
            var humidity= display.list[((i+1)*8)-1].main.humidity;
        
            $("#Date"+i).html(date);
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

function addToList(city){
    var listEl= $("<li>"+city.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",city.toUpperCase());
    $(".list-group").append(listEl);
}
function history(event){
    var listEl=event.target;
    if (event.target.matches("li")){
        city=listEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity(){ // displays last current city user inputed
    $("ul").empty();
    var findCity = JSON.parse(localStorage.getItem("cityname"));
    if(findCity!==null){
        findCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<findCity.length;i++){
            addToList(findCity[i]);
        }
        city=findCity[i-1];
        currentWeather(city);
    }

}

function deleteCity(event){ // allows user to delete city history
    event.preventDefault();
    findCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click",displayWeather);
$(document).on("click",history);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",deleteCity);




















