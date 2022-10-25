const axios = require('axios');
const admZip = require('adm-zip')
const fs = require("fs");
const customSdk = require("@fwehn/custom_sdk");
const rhasspy = require("./rhasspy.js");
const path = require("path")
const {exec} = require("child_process");

if (Object.keys(getSkillConfigs()).length === 0) writeSkillConfigs({});

// Currently loaded Skills
let skills = {};
/** Getter for Skills
 *
 * @returns {Object} a list of currently loaded skills
 */
function getSkills(){
    return skills;
}

/** File-Loader for newly downloaded Skills
 *
 * @param {string} locale The locale which is currently used
 */
function loadSkills(locale = "de_DE"){
    // Deletes old files from the require.cache
    Object.keys(require.cache).filter(entry => {
        let relative = path.relative(`${__dirname}/skills/`, entry);
        return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    }).forEach(skillModule => {
        delete require.cache[require.resolve(skillModule)];
    });

    skills = {};
    // (Re)Loads all configVariables and the source files from activated skills
    customSdk.config({variables: getAllConfigVariables(locale)});
    let skillsLocal = {};
    fs.readdirSync(`${__dirname}/skills`).forEach(function(skillName) {
        let path = `${__dirname}/skills/${skillName.toString()}/${getVersion(skillName)}/src`;
        skillsLocal[skillName] = require(path);
    });
    skills = skillsLocal;
}

//TODO change axios to something better :)
//Its throwing some errors while using it with dockers internal dns
/** Downloads a desired version of a skill as zip, unzips it and installs the required dependencies
 *
 * @param {string} name The name of the skill
 * @param {string} tag The desired version tag
 * @returns {Promise<string>} On success it will return the downloaded version Tag
 */
function downloadSkill(name = "HelloWorld", tag = "latest") {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.SERVER || "http://127.0.0.1:3000"}/download/${name}/${tag}`, {
            responseType: "arraybuffer"
        }).then(res => {
            let zip = new admZip(res.data);
            zip.extractAllTo(`${__dirname}/skills/${name}`,true);

            installDependencies(name, tag).then(() => {
                resolve(zip.getEntries()[0].entryName.split("/")[0]);
            }).catch(err => {
                // removes downloaded files to prevent errors
                fs.rmSync(`${__dirname}/skills/${name}`, { recursive: true, force: true });
                reject(err);
            });
        }).catch(reject);
    })
}

/** Function used by the webinterface to save Uploaded skill files to the skill directory and installs the required dependencies
 *
 * @param {string} name The name of the skill
 * @param {string} tag The tag this version should have
 * @param {Blob} data The data which represents the skill (code as zipped files)
 * @returns {Promise<string>} On success it will return the version tag
 */
function uploadSkill(name, tag, data){
    return new Promise((resolve, reject) => {
        try{
            let zip = new admZip(data);
            zip.extractAllTo(`${__dirname}/skills/${name}/${tag}`, true);

            installDependencies(name, tag).then(() => {
                resolve(zip.getEntries()[0].entryName.split("/")[0]);
            }).catch(err => {
                // removes uploaded files to prevent errors
                fs.rmSync(`${__dirname}/skills/${name}`, { recursive: true, force: true });
                reject(err);
            });
        }catch (e) {
            reject(e);
        }
    })
}


/** Deletes unused packages
 *
 * @param {string} locale The locale which is currently used
 * @param {string} skill Desired skill from which the dependencies should be deleted
 * @returns {Promise<string>} A short success or failure message
 */
function deleteDependencies(locale, skill){
    return new Promise((resolve, reject) => {
        let installed = getInstalledSkills(locale);
        installed = installed.filter(skillIndex => skillIndex !== skill);

        let usedDependencies = [];
        for (let i in installed) {
            let skillDependencies = Object.keys(getManifest(installed[i])["dependencies"]);
            usedDependencies = [...usedDependencies, ...skillDependencies];
        }

        let defaultDependencies = getDefaults()["dependencies"];
        usedDependencies = [...usedDependencies, ...defaultDependencies];

        let unusedDependencies = Object.keys(getManifest(skill)["dependencies"]);
        unusedDependencies = unusedDependencies.filter(dependency => !usedDependencies.includes(dependency));

        if (unusedDependencies.length === 0) resolve("No packages to delete");

        let depString = "";
        for (let pkg in unusedDependencies){
            depString = `${depString} ${unusedDependencies[pkg]}`;
        }

        exec(`npm uninstall ${depString}`, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

/** Installs required packages
 *
 * @param {string} skill Desired skill from which the dependencies should be installed
 * @param {string} version Desired version from which the dependencies should be installed
 * @returns {Promise<string>} A short success or failure message
 */
function installDependencies(skill, version){
    return new Promise((resolve, reject) => {
        let defaultDependencies = getDefaults()["dependencies"];
        let dependencies = getManifest(skill, version)["dependencies"];

        let depString = "";
        for (let pkg in dependencies){
            if (defaultDependencies.includes(pkg)) continue;

            depString = `${depString} ${pkg}@${dependencies[pkg]}`;
        }

        if (!depString) resolve("No packages to install");

        exec(`npm install ${depString}`, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

/** Deletes the Local Skill-Files
 *
 * @param {string} name Name of the skill which should be deleted
 * @param {string} locale The locale which is currently used
 * @returns {Promise<string>} A short success or failure message
 */
function deleteLocalSkillFiles(name = "HelloWorld", locale = "de_DE"){
    return new Promise((resolve, reject) => {
        deleteDependencies(locale, name).then(() => {

            let installed = getInstalledSkills(locale);
            if (!installed.includes(name)) reject('Skill not found!');
            let configsFile = getSkillConfigs();
            if (configsFile.hasOwnProperty(name)){
                delete configsFile[name];
            }
            writeSkillConfigs(configsFile);

            fs.rmSync(`${__dirname}/skills/${name}`, { recursive: true, force: true });

            resolve('Skill deleted!');
        }).catch(reject);
    })
}

/** Get a list of Skills on Server
 *
 * @param {string} locale The locale which is currently used
 * @returns {Promise<*[]>} A list of available skills
 */
function getRemoteSkills(locale = "de_DE") {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.SERVER || "http://127.0.0.1:3000"}/skills/${locale}`).then(res => {
            let skills = [];
            let installed = getInstalledSkills();
            for (let i in res.data) {
                let skillData = res.data[i];

                let installedVersions = []
                if (installed.includes(i)){
                    installedVersions = fs.readdirSync(`${__dirname}/skills/${i}`, {withFileTypes: true}).filter(entry => entry.isDirectory()).map(entry => entry.name);
                }

                skillData["installed"] = installedVersions;
                skills.push(skillData);
            }
            resolve(skills);
        }).catch(reject);
    });
}

/** Get a list of locally installed skills
 *
 * @param {string} locale The locale which is currently used
 * @returns {string[]} A list of installed skills
 */
function getInstalledSkills(locale = "de_DE"){
    let path = `${__dirname}/skills`;
    let skills = [];

    fs.readdirSync(path).forEach(skill => {
        fs.readdirSync(`${path}/${skill}/${getVersion(skill.toString())}/locales`).forEach(file => {
            if (file.startsWith(locale)){
                skills.push(skill);
            }
        })
    });
    return skills;
}

/** Shows Overview of local Skill files
 *
 * @param {string} locale The locale which is currently used
 * @returns {Array<Object>} Some information about every installed skill
 */
function getSkillsOverview(locale = "de_DE"){
    let res = [];
    let skills = getInstalledSkills(locale)
    let configs = getSkillConfigs();

    for (let i in skills){
        let localeFile = getLocale(skills[i], locale);
        let skillConfig = configs[skills[i]] || {};

        res.push({
            active: skillConfig["active"] || false,
            name: skills[i],
            description: localeFile["description"] || "-",
            version: getVersion(skills[i])
        });
    }

    return res;
}

/** Get some Detailed Information of a Skill based on locale
 *
 * @param {string} name Name of the skill
 * @param {string} locale The locale which is currently used
 * @returns {{}} Detailed information about this skill
 */
function getSkillDetails(name = "HelloWorld", locale = "de_DE"){
    // Loads all required information
    let installed = getInstalledSkills(locale);
    if (!installed.includes(name)) return {};

    let localeFile = getLocale(name, locale);
    let manifestFile = getManifest(name);
    let skillOptions = manifestFile["options"];
    let configs = getSkillConfigs()[name] || {};
    let defaults = getDefaults()[locale];

    // Trims down launches and zigbee slot to 5 random entries
    let zigbeeNames = [...customSdk.getZigbeeDevices(), ...customSdk.getZigbeeGroups()].sort(()=> Math.random() - 0.5);
    zigbeeNames = zigbeeNames.slice(0, 5);

    let launch = defaults["launch"].sort(()=> Math.random() - 0.5);
    launch = launch.slice(0, 5);

    let days = defaults["days"].slice(0,4);
    days = [...days, "..."];

    let months = defaults["months"].slice(0,4);
    months = [...months, "..."];


    let slots = localeFile.slots;
    slots = {launch: launch.sort(), zigbee2mqtt: zigbeeNames.sort(), days: days, months: months, ...slots};

    // Formats the sentences for a better readability
    let formattedSentences = [];
    for (let i in localeFile["intents"]){
        let intent = localeFile["intents"][i];
        let sentences = intent["sentences"];

        for (let i in sentences) {
            sentences[i] = sentences[i].replaceAll(/\(\$slots\/.*?\)/g, "");  // RegEx: "...($slots/zigbee2mqtt){zigbee2mqtt}..." > "...{zigbee2mqtt}..."
            let numberMatches = sentences[i].match(/\(\d+..\d+\){.*?}/g);     // RegEx: identifying "(0..100){brightness}"

            // If the slot is a number range, this will generate a slot with some values to show on the webinterface
            if (numberMatches && numberMatches.length > 0) {
                for (let i in numberMatches){
                    let parts = numberMatches[i].split("{");
                    let key = parts[1].substring(0, parts[1].length-1);
                    let values = parts[0].substring(1, parts[0].length-1).split("..").map(val => parseInt(val, 10));
                    let startValue = values[0];
                    let endValue = values[1];
                    let diff = endValue - startValue;


                    // If the range contains more than 5 values, random values within the range will be picked
                    if (diff > 4){
                        let randomValuesInRange = [];

                        while(randomValuesInRange.length < 3){
                            let rand = Math.floor(Math.random() * (endValue-2)) + 1;
                            if(randomValuesInRange.indexOf(rand) === -1) randomValuesInRange.push(rand);
                        }

                        randomValuesInRange.sort((a, b) => a-b);

                        values = [startValue, ...randomValuesInRange, endValue];
                    }else{
                        values = Array.from({length: diff+1}, (_,index) => startValue+index);
                    }

                    slots[key] = values;
                }
                sentences[i] = sentences[i].replaceAll(/\(\d+..\d+\)/g, "");    // RegEx: "...(0..100){brightness}..." > "...{brightness}..."
            }

            let formattedSentence = `... {launch} ${localeFile["invocation"]} ${sentences[i]}`;
            formattedSentences.push(formattedSentence);
        }
    }

    return {
        active: configs["active"] || false,
        name: name,
        version: getVersion(name),
        description: localeFile["description"],
        sentences: formattedSentences,
        slots: slots,
        options: getFormattedOptionsList(skillOptions, configs["options"] || [])
    }
}

/** Generates a list of all options, set in the skillConfigs.json or default values from manifest.json
 *
 * @param {{}} skillOptions A list of all declared options
 * @param {{}} skillConfig A list of all defined options
 * @returns {*[]} A formatted list of these options
 */
function getFormattedOptionsList(skillOptions, skillConfig = {}){
    let res = [];

    for (let i in skillOptions){
        let currentOption = skillOptions[i];
        let currentConfig = skillConfig.find(conf => {
            return conf["name"] === currentOption["name"];
        }) || {};

        res.push({
            name: currentOption["name"],
            value: currentConfig["value"] || currentOption["default"],
            type: currentOption["type"],
            choices: currentOption["choices"] || []
        })
    }

    return res;
}

/** Saves/Overwrites the options of a skill in skillConfigs.json
 *
 * @param {string} skill The desired skill from which the options are to be set
 * @param {{}} values The new values of the options
 * @param {string} locale The locale which is currently used
 * @returns {Promise<unknown>} A short success or failure message
 */
function saveConfig(skill, values, locale){
    return new Promise((resolve, reject) => {
        try {
            let configsFile = getSkillConfigs();
            if (!configsFile[skill]) configsFile[skill] = {};

            let skillOptions = configsFile[skill]["options"];
            if (!skillOptions) skillOptions = [];

            for (let key in values){
                let option = {}
                option["name"] = key;
                option["value"] = values[key];

                let optionToReplace = skillOptions.find(option => {
                    return option["name"] === key;
                });

                if (!optionToReplace) {
                    skillOptions.push(option);
                }else{
                    let index = skillOptions.indexOf(optionToReplace);
                    skillOptions[index] = option;
                }
            }

            configsFile[skill]["options"] = skillOptions;
            writeSkillConfigs(configsFile);
            customSdk.config({variables: getAllConfigVariables(locale)});
            resolve("Options Saved");
        }catch (e) {
            reject(e);
        }
    });
}

/** Returns all Config-Variables of a specific locale
 *
 * @param {string} locale The locale which is currently used
 * @returns {{}} All config variables which are currently defined
 */
function getAllConfigVariables(locale = "de_DE"){
    let res = {};
    let installed = getInstalledSkills(locale);

    for (let i in installed){
        let name = installed[i];
        let manifestFile = getManifest(installed[i]);
        let skillOptions = manifestFile["options"];
        let configs = getSkillConfigs()[name] || {};

        let options = getFormattedOptionsList(skillOptions, configs["options"] || []);
        let variables = {};
        for (let i in options){
            variables[options[i]["name"]] = options[i]["value"];
        }

        res[installed[i]] = variables;
    }

    return res;
}

/** Sets the "active" Flag in skillConfigs.json
 *
 * @param {string} skill The skill of which the active flag should be set
 * @param {boolean} state The new State of the active flag
 * @returns {Promise<string>} A short success or failure message
 */
function setActivateFlag(skill, state){
    return new Promise((resolve, reject) => {
        try{
            let configsFile = getSkillConfigs();
            if (!configsFile[skill]) configsFile[skill] = {};

            configsFile[skill]["active"] = state;

            writeSkillConfigs(configsFile);
            resolve("Changes Saved!");
        }catch (e) {
            reject(e);
        }
    });
}

/** Activates a Skill
 *
 * @param {string} skill The skill which should be activated
 * @param {string} locale The locale which is currently used
 * @returns {Promise<string>} A short success or failure message
 */
function activateSkill(skill, locale = "de_DE"){
    return new Promise((resolve, reject) => {
        let installed = getInstalledSkills(locale);
        if (!installed.includes(skill)) reject("Skill not installed or do not support that language!");

        rhasspy.registerSkill(skill, locale, getVersion(skill)).then(() => {
            loadSkills(locale);
            setActivateFlag(skill, true).then(() => resolve("Skill activated!"));
        }).catch(reject);
    })
}

/** Deactivates a Skill
 *
 * @param {string} skill The skill which should be deactivated
 * @param {string} locale The locale which is currently used
 * @returns {Promise<string>} A short success or failure message
 */
function deactivateSkill(skill, locale = "de_DE"){
    return new Promise((resolve, reject) => {
        let installed = getInstalledSkills(locale);
        if (!installed.includes(skill)) reject("Skill not installed or do not support that language!");

        rhasspy.unregisterSkill(skill, locale, getVersion(skill)).then(() => {
            loadSkills(locale);
            setActivateFlag(skill, false).then(() => resolve("Skill deactivated!"));
        }).catch(reject);
    })
}

/** Getter for manifest information of a skill
 *
 * @param {string} skill Skill from which to get the manifest information
 * @param {string} version Desired version of the skill
 * @returns {{}} Manifest information
 */
function getManifest(skill, version){
    if (!version) version = getVersion(skill);
    return JSON.parse(fs.readFileSync(`${__dirname}/skills/${skill}/${version}/manifest.json`).toString());
}

/** Getter for the information of a skill's locale file
 *
 * @param {string} skill Skill from which to get the manifest information
 * @param {string} locale The locale which is currently used
 * @returns {{}} Information from the locale file of skill
 */
function getLocale(skill, locale = "de_DE"){
    let version = getVersion(skill);
    return JSON.parse(fs.readFileSync(`${__dirname}/skills/${skill}/${version}/locales/${locale}.json`).toString());
}

/** Reads from the skillConfigs file
 *
 * @returns {{}} Current configurations
 */
function getSkillConfigs(){
    return JSON.parse(fs.readFileSync(`${__dirname}/configs/skillConfigs.json`).toString());
}

/** Writes to the skillConfigs file
 *
 * @param {{}} data Data to write it the skillConfigs file
 */
function writeSkillConfigs(data){
    fs.writeFileSync(`${__dirname}/configs/skillConfigs.json`, JSON.stringify(data));
}

/** Getter for the version of a skill
 *
 * @param {string} skill Desired skill from which to get the version
 * @returns {string} The installed version of the skill
 */
function getVersion(skill){
    let configs = getSkillConfigs();
    return configs[skill]["version"];
}

/** Setter for the version of a skill
 *
 * @param {string} skill Desired skill from which to set the version
 * @param {string} version The new version
 */
function setVersion(skill, version){
    let configs = getSkillConfigs();
    configs[skill]["version"] = version;
    writeSkillConfigs(configs);
}

/** Reads the defaults.json
 *
 * @returns {{}} Every information in the defaults.json file
 */
function getDefaults(){
    return JSON.parse(fs.readFileSync(`${__dirname}/defaults.json`).toString());
}

/** Get Available Updates based on version in the manifest file
 *
 * @param {string} locale The locale which is currently used
 * @returns {Promise<unknown>} A list of available updates
 */
function getUpdates(locale = "de_DE"){
    return new Promise(async (resolve, reject) => {
        let installed = getInstalledSkills(locale);
        let availableUpdates = {};

        for (let i in installed) {
            let version = getVersion(installed[i]);
            await axios.get(`${process.env.SERVER || "http://127.0.0.1:3000"}/update/${locale}/${installed[i]}/${version}`).then(res => {
                if (res.data["update"]) {
                    availableUpdates[installed[i]] = res.data["version"];
                }
            }).catch(reject);
        }

        resolve(availableUpdates);
    });
}

/** Returns a funktion based on IntentName
 *
 * @param {string} intentName Name of the recognized intent
 * @param {{}} slots Recognized slots
 * @param {string} locale The locale which is currently used
 * @returns {{}} Function name, params and the answers belonging to the recognized intent
 */
function getFunctionBYIntentName(intentName, slots, locale = "de_DE"){
    let skillName = intentName.split("_")[0];
    let intentNumber = intentName.split("_")[1];

    let intents = getLocale(skillName, locale)["intents"];

    if (!intents[intentNumber]) return {};

    let params = [];
    intents[intentNumber]["args"].forEach(param => params.push(slots[param]));

    return {
        "name": intents[intentNumber]["function"],
        "params": params,
        "answers": intents[intentNumber]["answers"]
    };
}


/** Custom Intent Handler to call functions based on Intent and Slots
 *
 * @param {string} topic MQTT-Topic the skillmanager is listening to ('hermes/intent/#')
 * @param {string} message MQTT-Message containing all the information about the recognized intents and slots
 */
function customIntentHandler(topic, message){
    let slots = {};
    let formatted = JSON.parse(message.toString());

    if (formatted["intent"]["intentName"].startsWith("_")) {
        console.log(`Ignored Intent: ${formatted["intent"]["intentName"]}`);
        return;
    }

    let rawTokens = {};
    for (let i in formatted["slots"]){
        let currentSlot = formatted["slots"][i];

        if (currentSlot["slotName"] !== "launch"){
            let slotValue = currentSlot["value"]["value"];

            slots[currentSlot["slotName"]] = slotValue;
            rawTokens[slotValue] = currentSlot["rawValue"];
        }
    }
    customSdk.setRawTokens(rawTokens);

    let fun = getFunctionBYIntentName(formatted["intent"]["intentName"], slots, process.env.LOCALE || "de_DE");

    if (fun.hasOwnProperty("name") && fun.hasOwnProperty("params") && fun.hasOwnProperty("answers")){
        customSdk.setAnswers(fun["answers"]);

        getSkills()[formatted["intent"]["intentName"].split("_")[0]][fun["name"]].apply(this, fun["params"]);
    }
}

module.exports = {
    skills, loadSkills, downloadSkill, uploadSkill, deleteLocalSkillFiles, getRemoteSkills, getSkillsOverview, getSkillDetails, saveConfig, setActivateFlag, activateSkill, deactivateSkill, setVersion, getUpdates, customIntentHandler
}