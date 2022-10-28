const customSdk = require("@fwehn/custom_sdk");
const axios = require('axios');

function getUrl(){
    return new Promise((resolve, reject) => {
        customSdk.getAllVariables()
            .then(variables => {
                resolve(`https://api.openweathermap.org/data/2.5/forecast?zip=${variables["city"]},${variables["country"]}&appid=${variables["APIKey"]}&lang=${variables["language"]}&units=${variables["units"]}`);
            }).catch(reject);
    });
}

function getCurrentWeather(){
    getUrl()
        .then(axios.get)
        .then(res => {
            let data = res.data.list[0];
            let answer = customSdk.generateAnswer(0, [res.data.city.name, data.weather[0].description, Math.floor(data.main.temp)]);
            customSdk.say(answer);
        }).catch(customSdk.fail);
}

function getForecastWithDayNumber( day = 1){
    getSortedData().then(data => {
        let date = new Date();
        date.setDate(date.getDate()+day);

        let forecastDay = data[date.toISOString().split("T")[0]];
        let answer = customSdk.generateAnswer(0, [forecastDay["avg_desc"], Math.floor(forecastDay["temp_min"]), Math.floor(forecastDay["temp_max"])]);
        customSdk.say(answer);
    }).catch(customSdk.fail);
}

function getForecastWithDayName(dayNumber){
    getSortedData().then(data => {
        let date = new Date();
        let difference = ((dayNumber-date.getDay())%7+7)%7;
        date.setDate(date.getDate()+difference);

        let answer = "";
        if (difference > 4){
            customSdk.say(customSdk.generateAnswer(1, []));
            return;
        }

        let forecastDay = data[date.toISOString().split("T")[0]];
        answer = customSdk.generateAnswer(0, [forecastDay["avg_desc"], Math.floor(forecastDay["temp_min"]), Math.floor(forecastDay["temp_max"])]);
        customSdk.say(answer);
    }).catch(customSdk.fail)
}

function getSortedData(){
    return new Promise((resolve, reject) => {
        getUrl()
            .then(axios.get)
            .then(res => {
                let days = {}
                let list = res.data.list;

                for (let i in list){
                    let date = list[i]["dt_txt"].split(" ")[0];

                    if (!days.hasOwnProperty(date)) {
                        days[date] = {
                            "temp": [],
                            "desc": []
                        };
                    }

                    days[date]["temp"].push(list[i].main.temp);
                    days[date]["temp_min"] = Math.min(...days[date]["temp"]);
                    days[date]["temp_max"] = Math.max(...days[date]["temp"]);
                    days[date]["desc"].push(list[i].weather[0].description);
                    days[date]["avg_desc"] = getMostFrequentValue(days[date]["desc"]);
                }

                resolve(days);
            }).catch(reject);
    });
}

function getMostFrequentValue(array){
    let frequencyMap = array.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    },{})
    return Object.keys(frequencyMap).reduce((a, b) => frequencyMap[a] > frequencyMap[b] ? a : b);
}

module.exports = {
    getCurrentWeather, getForecastWithDayNumber, getForecastWithDayName
}