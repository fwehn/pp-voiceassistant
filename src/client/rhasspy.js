const axios = require('axios');
const fs = require("fs");

/** The Main Function to Communicate with Rhasspy
 *
 * @param {string} endpoint Endpoint to post data
 * @param {{}} body Data which will be posted to given endpoint
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
async function postToRhasspy(endpoint, body){
    return await axios.post(`${process.env.RHASSPY || "127.0.0.1:12101"}${endpoint}`, body, {});
}

/** Retrains the Rhasspy model
 *
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
async function trainRhasspy() {
    return await postToRhasspy("/api/train", {});
}

/** Adds a Sentence to an Intent
 *
 * @param {string} intentName Name of the intent
 * @param {string[][]} intents Alternatives for the intent
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
async function postSentences(intentName, intents){
    let data = {}
    let fileName = `intents/${intentName}.ini`;
    let sentencesString = ``;

    for (let i in intents){
        let sentences = intents[i];

        sentencesString = `${sentencesString}[${intentName}_${i}]\n`;
        for (let j in sentences){
            sentencesString = `${sentencesString}${sentences[j]}\n`;
        }

        if (sentences.length === 0) sentencesString = "";
        data[fileName] = sentencesString + "\n";
    }
    return await postToRhasspy("/api/sentences",  data);
}

/** Adds/Overwrites Slots
 *
 * @param {string} slotName Name of the slot
 * @param {string[]} alternatives Alternatives to save under the slot name
 * @param {boolean} overwrite Flag to overwrite a slot or just add alternatives
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
async function postSlots(slotName, alternatives, overwrite = false){
    let data = {}
    data[`slots/${slotName}`] = alternatives;

    return await postToRhasspy(`/api/slots?overwrite_all=${overwrite}`, data);
}

/** Registering Skill and its Slots in Rhasspy
 *
 * @param {string} skillName Name of the desired skill
 * @param {string} locale The locale which is currently used
 * @param {string} version Version that should be registered
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
function registerSkill(skillName, locale = "de_DE", version){
    return new Promise(async (resolve, reject) => {
        let skill = JSON.parse(fs.readFileSync(`${__dirname}/skills/${skillName}/${version}/locales/${locale}.json`).toString());

        // TODO (find a way to unique identify the slots. maybe by adding a prefix here and in the intent.sentences via regex?)
        // post slots
        for (let slot in skill.slots){
            await postSlots(slot, skill.slots[slot], true).catch(reject);
        }

        // post intents
        let intents = [];
        for (let i in skill["intents"]){
            let sentences = skill["intents"][i]["sentences"];

            let formattedSentences = [];
            for (let j in sentences){
                formattedSentences.push(`($slots/launch){launch} ${skill["invocation"]} ${sentences[j]}`);
            }

            intents.push(formattedSentences);
        }

        postSentences(skillName, intents).then(() => {
            trainRhasspy().then(resolve);
        }).catch(reject);
    });
}

/** Unregistering Skill and its Slots in Rhasspy
 *
 * @param {string} skillName Name of the desired skill
 * @param {string} locale The locale which is currently used
 * @param {string} version Version that should be unregistered
 * @returns {Promise<AxiosResponse<*>>} Axios response to use it for async processes
 */
async function unregisterSkill(skillName, locale = "de_DE", version){
    return new Promise(async (resolve, reject) => {
        let skill = JSON.parse(fs.readFileSync(`${__dirname}/skills/${skillName}/${version}/locales/${locale}.json`).toString());

        // clear slots
        for (let slot in skill.slots) {
            await postSlots(slot, [], true).catch(reject);
        }

        // clear intents
        postSentences(skillName, [[]]).then(() => {

            trainRhasspy().then(resolve);
        }).catch(reject);
    });
}

module.exports = {
    trainRhasspy, postSlots, registerSkill, unregisterSkill
}