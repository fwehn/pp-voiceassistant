const customSdk = require("@fwehn/custom_sdk");

function changeState(device, state){
    let deviceName = customSdk.getRawToken("device");
    let stateName = customSdk.getRawToken("diyState");

    customSdk.say(customSdk.generateRandomAnswer([deviceName, stateName]));

    let leds = Array(12).fill(convertHexColToRGB("#ffffff"));
    customSdk.publishMQTT(`diy/${device}`, {"leds": leds, "brightness": (state === "1" ? 255 : 0)});
}

function changeBrightness(device, brightness){
    let deviceName = customSdk.getRawToken("device");

    customSdk.say(customSdk.generateAnswer(0, [deviceName, brightness]));
    customSdk.publishMQTT(`diy/${device}`, {"brightness": Math.floor(255*brightness/100)});
}

function changeColor(device, color){
    let deviceName = customSdk.getRawToken("device");
    let colorName = customSdk.getRawToken("color");

    customSdk.say(customSdk.generateAnswer(0, [deviceName, colorName]));
    let leds = Array(12).fill(convertHexColToRGB(color));
    customSdk.publishMQTT(`diy/${device}`, {"leds": leds});
}

function startPattern(pattern){
    customSdk.say(customSdk.generateAnswer(0, [customSdk.getRawToken("pattern")]));
    customSdk.publishMQTT("diy/plasmidLamp", {"pattern": pattern});
}

function stopPattern(){
    customSdk.publishMQTT("diy/plasmidLamp", {"pattern": "off"});
}

function convertHexColToRGB(value){
    let r = value.substring(1, 3);
    let g = value.substring(3, 5);
    let b = value.substring(5, 7);

    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

module.exports = {
    changeState, changeBrightness, changeColor, startPattern, stopPattern
}
