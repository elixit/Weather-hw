
var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentIndex= $("#uv-index");
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
var APIKey="9ee18d5e8fb59c9194e4b3fcd5b280cb";

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
 
    
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey; // used https://stackoverflow.com/questions/34441645/how-to-pull-temperature-info-out-off-open-weather-map-api as reference for weather mapping and ajax
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(show){

        
        console.log(show);
      
        var weathericon= show.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
      //https://openweathermap.org/current used as reference for weather conditions
        var date=new Date(show.dt*1000).toLocaleDateString();
   
        $(currentCity).html(show.name +"("+date+")" + "<img src="+iconurl+">");
        // https://stackoverflow.com/questions/49383333/jquery-toggle-between-celsius-and-fahrenheit-bad-logic-from-my-side used to help with temperature issues, I was having trouble with
        // https://stackoverflow.com/questions/17913681/how-do-i-use-tolocaletimestring-without-displaying-seconds
        var tempF = (show.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(currentHumidty).html(show.main.humidity+"%");   
        var ws=show.wind.speed;
        var windmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windmph+"MPH");
        Index(show.coord.lon,show.coord.lat);
        forecast(show.id);
        if(show.cod==200){
            findCity=JSON.parse(localStorage.getItem("cityname"));
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
                    localStorage.setItem("cityname",JSON.stringify(findCity));
                    addToList(city);
                }
            }
        }

    });
}
function Index(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(show){
                $(currentIndex).html(show.value);
            });
}
function forecast(cityid){
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(show){
        
        for (i=0;i<5;i++){
            var date= new Date((show.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= show.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var iconWind= show.list[((i+1)*8)-1].weather[0].icon;
            var windURL="https://openweathermap.org/img/wn/"+iconcode+".png"; // still adding feature  to this
            var tempK= show.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= show.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
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
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity(){
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

function clearHistory(event){
    event.preventDefault();
    findCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);




















