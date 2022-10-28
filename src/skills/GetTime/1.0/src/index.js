const customSdk = require("@fwehn/custom_sdk");

function getTime(){
    let time = new Date();
    let answer = customSdk.generateAnswer(0, [time.getHours(), time.getMinutes()]);
    customSdk.say(answer);
}

module.exports = {
    getTime
}