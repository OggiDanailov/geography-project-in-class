// Pairs:
// (Amber/Holly)
//Emily/Engel)
// (Rosie/Alison)
// (Tom/Jessica)


// 1. make a github repo and make sure that you can both push and pull from it
// 2. Using this site:
// http://restcountries.eu/#api-endpoints-regional-bloc
// Build a single page app that shows:
// a. - whatever country the user inserts printed on the page;
// b. - the capital of this country;
// c. - population of this country:
// 	1) - try to convert the population into normal decimal numbers; please take a look at this:
// 	// https://stackoverflow.com/questions/6784894/add-commas-or-spaces-to-group-every-three-digits
// e. - create 3 language buttons for french, german and japanese and when you click on them you get
// the corresponding translation of the country

// 3. Use this address to retrieve data about gdp per country:
// "https://raw.githubusercontent.com/OggiDanailov/gdp-data/master/data.json"
		// a) figure out a way of printing the gdp of the country that you called;
			// b) go to this library (or any other js statistic library):
			// https://plotly.com/javascript/getting-started/
			// and try to create a chart using the gdp data that will show how 
			// the gdp of a given country developed through the years
	// 4. expand the app that allows you to compare two different countries (ex. Mexico vs. Colombia)
	// a) you should be able to compare their gdp based on their population;
	// b) draw conclusion who's richer and who's poorer
		

$(document).ready(function() {

	let country1 = document.getElementById("country1")
	let country2 = document.getElementById("country2")
	let submit1 = document.getElementById("submit1")
	let submit2 = document.getElementById("submit2")
	let languages = document.getElementsByClassName("languages")
	let gdpButton = document.getElementsByClassName("gdp-button")[0]
	let currentCountry;
	let TESTER = document.getElementById('tester');

submit1.addEventListener("click", function() {
	firstAjaxCall("https://restcountries.eu/rest/v2/name/", firstResult, country1.value)
})

gdpButton.addEventListener("click", function() {
	returnGDP ("https://raw.githubusercontent.com/OggiDanailov/gdp-data/master/data.json")
})



	function firstAjaxCall(urladdress, callback, value) {
		$.ajax({
				url: urladdress + value,
				success: function(response) {
					callback(response)
				},
				error: function(){
					alert("no such country")
				}
		}) 
	}


	function firstResult(response) {	
		currentCountry = response[0].name	
		$(".flag1").css({
			"background-image": "url(" + response[0].flag + ")",
			"background-size": "100% 100%",
			border: "1px solid"
		})
		$(".country-name1").html("Country: " + response[0].name)
		$(".country-capital1").html("Capital: " + response[0].capital)
		$(".country-population1").html("Population: " + printPopulation(response[0].population))
		$(".spellings1").html(spellings("Various  names: " + response[0].altSpellings))
		
		for(let i = 0; i < languages.length; i++) {
			languages[i].addEventListener("click", function(e){
				if(e.target.innerHTML === 'fr') {
					$(".translations").html(response[0].translations.fr)
				} else if (e.target.innerHTML === "de") {
					$(".translations").html(response[0].translations.de)	
				} else if(e.target.innerHTML === 'ja') {
					$(".translations").html(response[0].translations.ja)	
				}
			})
		}
	}

// https://stackoverflow.com/questions/6784894/add-commas-or-spaces-to-group-every-three-digits

	function printPopulation (num) {
		var str = num.toString().split('.');
    	if (str[0].length >= 5) {
       	 str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    	}
    	if (str[1] && str[1].length >= 5) {
        	str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    	}
    return str.join('.');
	}

	function spellings (array) {
		var result = " ";
		for(let i = 0; i < array.length; i++) {
			result += (array[i] + " ")
		}
		return result
	}


	function returnGDP(urladdress){
		let gdpArrayValues = [];
		let gdpArrayYears = [];
		$.ajax({url: urladdress,
		type: "GET",
			success: function(res){
				var parsed = JSON.parse(res)
				parsed.forEach(function(country) {
					if(country["Country Name"] === currentCountry) {
						$(".country-gdp").html("GDP in $ for 2017:  " + printPopulation(country["2017"]))
						var a = Object.values(country)
						var b = Object.keys(country)
						for( let i = 0; i < a.length; i++) {
							if(a[i] !== "" && typeof a[i] === 'number') {
								gdpArrayValues.push(a[i])
								gdpArrayYears.push(b[i])
							}
						}
						
						Plotly.newPlot( TESTER, [{
							x: gdpArrayYears,
							y: gdpArrayValues }], {
							margin: { t: 0 } } );
							}
						})

			}
		})
	}



})