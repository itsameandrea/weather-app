$(document).ready(function(){
    var latitude;
    var longitude;
    var weather;
    var toggle;
    var tempF;
    var tempC;
    var googleKey = "AIzaSyDGlAw86K6n_Aah1SjLW2OOWg8YezFLxoM";
    
    function initialize() {

        var input = document.getElementById('pac-input');
        console.log(input);
        var options = {
            types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
         $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+$("#pac-input").val()+"&key="+googleKey, function(json){
                var lat = json.results[0].geometry.location.lat
                var lng = json.results[0].geometry.location.lng
                
                callWeather(lat, lng);
                var locationHtml = "<h1 class='text-center' id='location'>"+ $("#pac-input").val() +"</h1>";
                $("#location").html(locationHtml);
            });
        });  
    }
        
    google.maps.event.addDomListener(window, 'load', initialize);
 
    
    $('#toggle-event').change(function() {
        if($(this).prop('checked')){
            $("#temp").html(tempC + " °C");
        } else $("#temp").html(tempF + " °F");
        console.log(weather);
    });
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            
            //-- Get latitude and longitude of the current location
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            //-- Push the lat and long to Google and return the City and append it to the HTML
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key="+ googleKey, function(json){
                console.log(json);
                var location = json.results[1].address_components[1].long_name;
                var locationHtml = "<h1 class='text-center' id='location'>"+ location +"</h1>";
                $("#location").append(locationHtml);
            });
            callWeather(latitude, longitude);
        });
    }
    
    
    function callWeather(local_lat, local_long){
        
        var url = 'https://api.forecast.io/forecast/55eecbdc418f8583ab59a426e34dfc4b/'+local_lat+','+local_long;
        var iconUrl;
        
        $.ajax({
          url: url,
          dataType: "jsonp",
          success: function (data) {
            console.log(data);
            
            switch (data.currently.icon) {
                case 'clear-day':
                    // code
                    weather = "sunny";
                    iconUrl = "imgs/sun.png"
                    break;
                case 'clear-night':
                    // code
                    weather = "moon";
                    iconUrl = "imgs/clear-night.png"
                    break;
                case 'rain':
                    // code
                    weather = "rainy";
                    iconUrl = "imgs/rain.png"
                    break;
                case 'snow':
                    // code
                    weather = "snow";
                    iconUrl = "imgs/snow.png"
                    break;
                case 'sleet':
                    // code
                    weather = "sleet";
                    iconUrl = "imgs/sleet.png"
                    break;
                case 'wind':
                    // code
                    weather = "wind";
                    iconUrl = "imgs/windy.png"
                    break;
                case 'fog':
                    // code
                    weather = "fog";
                    iconUrl = "imgs/foggy.png"
                    break;
                case 'cloudy':
                    // code
                    weather = "cloudy";
                    iconUrl = "imgs/cloudy.png"
                    break;
                case 'partly-cloudy-day':
                    weather = "cloudy";
                    iconUrl = "imgs/cloudy.png"
                    // code
                    break;
                case 'partly-cloudy-night':
                    // code
                    weather = "cloudy night";
                    iconUrl = "imgs/cloudy-night.png"
                    break;
            };
            
            tempF = data.currently.apparentTemperature.toFixed(0);
            tempC = ((tempF - 32) / 1.8).toFixed(0);
            
            var temp_html = "<h3 id='temp'>"+tempF+" °F </h3>"
            
            $("#weather-temp").html(temp_html);
            $("#weather-icon").attr('src',iconUrl);

          }
        }).done(function(){
            
            var imgUrl = "https://source.unsplash.com/random?"+weather;
                  
            $('body').css('background-image', 'url('+ imgUrl +')' );
                
            $(".container-fluid.invisible").removeClass("invisible").addClass("show");
        })
        
    }

    
})