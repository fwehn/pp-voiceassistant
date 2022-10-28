const customSdk = require("@fwehn/custom_sdk");
const stateMap = ["OFF", "ON", "TOGGLE"];

function getZigbeeTopic(){
    return new Promise((resolve, reject) => customSdk.getVariable("Zigbee2MQTT-Topic").then(resolve).catch(reject));
}

function changeLightState(zigbeeName, state){
    getZigbeeTopic()
        .then(zigbeeTopic => {
            customSdk.say(customSdk.generateAnswer(0, []));
            customSdk.publishMQTT(`${zigbeeTopic}/${zigbeeName}/set`, {"state": stateMap[state]});
        }).catch(customSdk.fail);
}

function changeLightBrightness(zigbeeName, brightness){
    getZigbeeTopic()
        .then(zigbeeTopic => {
            customSdk.say(customSdk.generateAnswer(0, []));
            customSdk.publishMQTT(`${zigbeeTopic}/${zigbeeName}/set`, {"brightness": Math.floor(255*brightness/100), "transition": 2});
        }).catch(customSdk.fail);
}

module.exports = {
    changeLightState, changeLightBrightness
}