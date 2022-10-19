const rhasspy = require("./rhasspy.js");
const customSdk = require("@fwehn/custom_sdk");
const skillManager = require("./skillManager.js");
const webinterface = require("./webinterface.js");
const cli = require("./cli-tool.js");
const fs = require("fs");
const defaults = JSON.parse(fs.readFileSync(`./defaults.json`).toString())[process.env.LOCALE || "de_DE"];

// used by sdk to determine if the system has been initialized
let initiated = false;
function getInitStatus(){
    return initiated;
}

// loads local skill files
skillManager.loadSkills();
// setting some configurations for sdk to work smoothly
customSdk.config({
    mqtt: process.env.MQTTHOST || "127.0.0.1",
    port: process.env.MQTTPORT || "1883",
    intentHandler: skillManager.customIntentHandler,
    zigbeeTopic: process.env.ZIGBEETOPIC || "zigbee2mqtt",
    zigbeeUpdater: updateZigbeeList
});
// Clears Zigbee-list, inits the sdk and registers the default launch slots in Rhasspy
rhasspy.postSlots("zigbee2mqtt", [], true).catch(console.error);
customSdk.init().catch(console.error)
rhasspy.postSlots("launch", defaults["launch"], true)
    .then(async () => {
        await rhasspy.postSlots("days", defaults["days"], true).catch(console.error);
        await rhasspy.postSlots("months", defaults["months"], true).catch(console.error);
        rhasspy.trainRhasspy().then(() => initiated = true);
    })
    .catch(console.error);


// Callback function to register Zigbee devices as a Slot in Rhasspy
function updateZigbeeList(){
    let zigbeeNames = [...customSdk.getZigbeeDevices(), ...customSdk.getZigbeeGroups()] || [];
    rhasspy.postSlots("zigbee2mqtt", zigbeeNames, true)
        .then(() => {
            if (!getInitStatus()) return;
            rhasspy.trainRhasspy().catch(console.error);
        }).catch(console.error);
}

// Starts Web-UI and CLI
webinterface.startUI(process.env.LOCALE || "de_DE", process.env.PORT || "12102");
cli.startCLI(process.env.LOCALE);

