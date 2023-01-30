---
title: SDK
permalink: /docs/create-skills/sdk/
---

Ich habe, für die Entwicklung neuer Skills, ein eigenes SDK (**S**oftware **D**evelopment **K**it) erstellt.  
Dieses kümmert sich, in Zusammenarbeit mit dem [Skillmanager](./../client/skillmanager.md), um nützliche Funktionen wie zum Beispiel die Sprachausgabe, oder aber den Umgang mit den [Antwortsätzen](./locales.md#answers).  

## Konfiguration und Initialisierung

Dieser Abschnitt beschreibt die Kommunikation vom Skillmanager mit dem SDK.  
Damit der Skillmanager die Skills korrekt verwenden kann, müssen bei der Initialisierung einige Informationen definiert werden (wie z.B. unter welcher Adresse der MQTT-Broker erreichbar ist).  

### Config

Beim start des Skillmanagers wird über das SDK ein ``configObject`` erstellt, in dem einige Konfigurationen gespeichert werden.  

````javascript
let configObject = {
    mqtt: 'localhost',
    intentHandler: () => {},
    variables: {},
    zigbeeTopic: "",
    zigbeeUpdater: () => {},
    zigbeeDevices: [],
    zigbeeGroups: []
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Unter ``mqtt`` wird die Host-IP des [MQTT-Brokers](https://mqtt.org/) gespeichert, über den Rhasspy mit den einzelnen Komponenten kommuniziert.  
Über diesen Broker kommen auch alle [Intents](https://rhasspy.readthedocs.io/en/latest/intent-recognition/#mqtthermes) an, welche dann vom ``intentHandler`` verarbeitet werden.  
Beim ``intentHandler`` handelt es sich um eine Callback-Funktion, welche in [``skillManager.js``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/skillManager.js) als ``customIntentHandler`` definiert wurde.  
In Variables werden die von den Endnutzerinnen und Endnutzern gesetzten Optionen gespeichert, damit diese von den Skills über eine SDK-Funktion abgerufen werden können.  
  
Bei ``zigbeeTopic`` handelt es sich um das Topic, auf welches eine, mögliche [Zigbee2MQTT-Instanz](https://www.zigbee2mqtt.io/) ihre Daten veröffentlicht.  
Zigbee2MQTT ist hierbei optional.  
Sollte eine solche Anwendung vorliegen, so wird eine Liste mit allen Geräten und Gruppen ausgelesen und an den ``zigbeeUpdater`` übergeben.  
Dabei handelt es sich wieder um eine Callback-Funktion, die diese Liste bei Rhasspy als Slot registriert.  
``zigbeeDevices`` und ``zigbeeGroups`` beinhalten die jeweiligen Einträge.  
  
Diese Angaben werden vom [Skillmanager](./../client/skillmanager.md) mittels der ``config``-Funktion gesetzt.

````javascript
function config(options = {}){
    for (let i in options){
        if (!configObject.hasOwnProperty(i) || options[i] === undefined || options[i] === null) continue;

        configObject[i] = options[i];
    }
}
```` 
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Bei dieser Funktion handelt es sich im Grunde um eine einfache Setter Funktion, welche jedoch darauf achtet, dass nur im ``configObject`` deklarierte Felder gesetzt und verändert werden können.

### Init

Mit der ``init``-Funktion verbindet sich der [Skillmanager](./../client/skillmanager.md) mit dem MQTT-Broker und abonniert einige Topics:

````javascript
async function init() {
    client = await mqtt.connect(`mqtt://${configObject.mqtt}`);

    client.on("connect", function () {
        client.subscribe(`${configObject.zigbeeTopic}/bridge/devices`);
        client.subscribe(`${configObject.zigbeeTopic}/bridge/groups`);

        client.subscribe('hermes/intent/#');

        client.on('message', (topic, message) => {
            // ...
        });
    });
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Zwei der Topics dienen dazu, eine Liste aller Geräte und Gruppen von Zigbee2MQTT auszulesen und alle Änderungen mitzubekommen.  
Diese Liste wird dann als Slot mit dem Namen "zigbee2mqtt" an Rhasspy gesendet, damit die Spracherkennung die Wörter erkennen kann.  
  
Das dritte Topic dient dazu alle eingehenden Intents von Rhasspy aufzufangen.  
Nachdem ein Intent erkannt wird, werden sofort einige Informationen im JavaScript-Objekt ``sessionData`` gespeichert und die Nachricht an den im ``configObject`` gespeicherten ``intentHandler`` weitergegeben.  

## Sitzungsdaten

Damit Entwicklerinnen und Entwickler sich nicht darum kümmern muss, über welchen Satelliten die Sprache ausgegeben wird oder in welcher Sitzung man sich derzeit befindet, gibt es die sog. ``sessionData``.

````javascript
let sessionData = {
    siteId: "default",
    sessionId: "",
    skill: "",
    answer: ""
};
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Hier werden einige Informationen gespeichert, welche direkt von Rhasspy kommen, wie zum Beispiel die ``sessionId`` oder auch die ``siteId``.  
Diese werden unter anderem von der [``say``](#Sprachausgabe) Funktion genutzt, damit die Sprachausgabe auf dem Satelliten wiedergegeben wird, über welchen die Eingabe stattfand.  

Aber auch Informationen eines Skills werden hier gespeichert.  
So wird zum Beispiel basierend auf der ausgewählten Sprache, der Antwortsatz aus den jeweiligen ``locale``-Dateien ausgelesen.  

## Sprachausgabe

Die Funktion ``say`` kann genutzt werden, um einen Satz von Rhasspy sprechen zu lassen.

````javascript
function say(text = ""){
    let message = {
        text: text,
        siteId: sessionData["siteId"],
        sessionId: sessionData["sessionId"]
    };

    client.publish('hermes/tts/say', JSON.stringify(message));
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Der Funktion wird lediglich ein String übergeben.  
Die restlichen Informationen bezieht sie über das ``sessionData``-Objekt.  
Zum Schluss werden die Daten als String auf das Topic ``hermes/tts/say`` veröffentlicht.   

### Beispiel

````javascript
const customSdk = require("@fwehn/custom_sdk");

function helloWorld(hello, world){
    customSdk.say(`${hello} ${world}`);
}
````
*[HelloWorld](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/HelloWorld/1.0/src/index.js)*

Bei diesem Beispiel werden die beiden Strings ``hello`` und ``world`` aneinander gehangen und ausgegeben.

## Antwort generieren

Entwicklerinnen und Entwickler können [Antwortsätze](./locales.md#answers) in verschiedenen Sprachen definieren.  
Damit diese jedoch mit einigen Werten erweitert werden können, muss ein solcher Satz generiert werden.  
Dazu gibt man einen Satz wie zum Beispiel ``Es ist # Uhr #`` (aus [GetTime](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/GetTime/1.0/src/index.js)) an.  
Die Funktion ``generateAnswer`` ersetzt dann jeden Separator (standardmäßig ``#``) mit den Werten, die als Array übergeben werden.  
Mit der Variable ``answerIndex`` kann man deklarieren, welcher Antwortsatz ausgewählt werden soll.  

````javascript
function generateAnswer(answerIndex = 0 ,vars = [""], separator = "#"){
    let parts = sessionData.answers[answerIndex].split(separator);
    let answer = parts[0];
    for (let i = 1; i < parts.length; i++){
        answer = answer + vars[i-1] + parts[i];
    }
    return answer;
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Möchte man das Zeichen ``#`` selbst benutzen, kann man einen eigenen Separator verwenden, dazu muss dieser jedoch auch der Funktion übergeben werden.
Der jeweilige Satz wird vom [Skillmanager](./../client/skillmanager.md) in der jeweiligen Sprache geladen und mit der einfachen Setter-Funktion ``setAnswer`` im Objekt ``sessionData`` gespeichert.  
Von dort wird die Antwort ausgelesen.  

Für mehr Variation kann man sich einen zufälligen Satz aus der Liste der definierten Sätze auswählen und generieren lassen.  
Dazu habe ich die Funktion ``generateRandomAnswer`` erstellt.  

````javascript
function generateRandomAnswer(vars = [""], separator = "#"){
    let randomAnswerIndex = Math.floor(Math.random() * sessionData.answers.length);
    return generateAnswer(randomAnswerIndex, vars, separator);
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

### Beispiel

````javascript
const customSdk = require("@fwehn/custom_sdk");

function getTime(){
    let time = new Date();
    let answer = customSdk.generateAnswer(0, [time.getHours(), time.getMinutes()]);
    customSdk.say(answer);
}
````
*[GetTime](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/GetTime/1.0/src/index.js)*

Hier wird der Satz ``Es ist # Uhr #`` um die aktuelle Stunde und die aktuelle Minute erweitert, also z.B. ``Es ist 11 Uhr 34``.  
Dieser Satz wird dann mit der ``say``-Funktion ausgegeben.

## Raw-Tokens

Rhasspy bietet uns die Möglichkeit, dass wenn ein Slot mit einem Namen aufgerufen wird, dieser in einen Wert übersetzt wird.  
Wenn ich also beispielsweise frage wie das Wetter am ``Montag`` wird, kann man den Slot in Rhasspy so hinterlegen, dass statt ``Montag`` der Wert ``1`` für den ersten Tag der Woche zurückgegeben wird.  
Das ist sehr nützlich, wenn man plant Skills in verschiedenen Sprachen um zusetzten.  
So kann der Tag ``Montag`` im Code immer den Wert ``1`` haben, im Sprachbefehl aber mit ``Montag`` oder ``Monday`` aufgerufen werden.  
Möchte man jedoch in der Sprachausgabe jedoch Teile der Frage aufgreifen, so wäre es hilfreich den Namen des Slots verwenden zu können.  
  
"Wie wird das Wetter am ``Montag``?":
- Mit dem Wert: "Am ``1`` wird es ..."
- Mit dem Namen: "Am ``Montag`` wird es ..."
  
Um dieses Problem zu umgehen, habe ich zwei einfache Funktionen erstellt: ``setRawTokens`` und ``getRawToken``  

Sobald der Skillmanager einen Intent von Rhasspy erhält, werden die in diesem JavaScript-Object enthaltenen ``rawValue``-Werte mittels der ``setRawTokens``-Funktion in einer Liste gespeichert.  
````javascript
function setRawTokens(rawTokenList) {
    rawTokens = rawTokenList;
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Um diese Werte auszulesen, kann die Funktion ``getRawToken`` verwendet werden, der man dann den Namen des Slots übergibt.
````javascript
function getRawToken(tokenName) {
    return rawTokens[tokenName] || "Token Undefined";
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*


### Beispiel

In folgendem Beispiel wird der Raw-Token des Slots ``days`` ausgelesen und in der Variable ``dayName`` gespeichert.  
Dadurch kann der Name des Tages in der Antwort verwendet werden:  

"... wie wird das Wetter am ``Mittwoch``?" → "Am ``Mittwoch`` werden es Temperaturen von ..."

````javascript
let forecastDay = data[date.toISOString().split("T")[0]];
let dayName = customSdk.getRawToken("days");
answer = customSdk.generateAnswer(0, [dayName, Math.floor(forecastDay["temp_min"]), Math.floor(forecastDay["temp_max"])]);
customSdk.say(answer);
````
*[GetWeather](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/GetWeather/1.0/src/index.js)*



## Config Variablen 

Mit der Funktion [``config``](#config) wird nun das Feld ``variables`` im JS-Object ``configObject`` gesetzt.  
Beim Aufruf der Funktionen ``getVaraibles`` und ``getVariable`` werden jetzt die, zum im [``sessionData``](#sitzungsdaten) gespeicherten ``skill`` passenden, Variablen ausgelesen und zurückgegeben.  

````javascript
function getAllVariables(){
    return new Promise((resolve, reject) => {
        try{
            let variables = configObject.variables[sessionData["skill"]];

            if (variables){
                resolve(variables);
            }else{
                reject("Variable undefined!");
            }
        }catch (e) {
            reject(e);
        }
    });
}
````
*[sdk/index.js](https://github.com/fwehn/pp-voiceassistant/blob/main/src/sdk/index.js)*

Bei der Funktion ``getVariable`` wird lediglich der Wert, der angegeben Variable, zurückgegeben.

### Beispiel

````javascript
const customSdk = require("@fwehn/custom_sdk");

function getUrl(){
    return new Promise((resolve, reject) => {
        customSdk.getAllVariables()
            .then(variables => {
                resolve(`https://api.openweathermap.org/data/2.5/forecast?zip=${variables["city"]},${variables["country"]}&appid=${variables["APIKey"]}&lang=${variables["language"]}&units=${variables["units"]}`);
            }).catch(reject);
    });
}
````
*[GetWeather](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/GetWeather/1.0/src/index.js)*

In diesem Beispiel werden die Angaben, die über das [Webinterface](./../client/webinterface.md#details) gesetzt wurden, dazu genutzt, eine URL zu generieren, um auf die API von [OpenWeather](https://openweathermap.org/) zuzugreifen.  

## Publish

Um möglichen Entwicklerinnen und Entwicklern mehr Möglichkeiten zu bieten, habe ich eine Funktion implementiert, mit der man eigene MQTT-Nachrichten senden kann.  

````javascript
function publishMQTT(topic = "", payload ){
    if (typeof payload === "string"){
        client.publish(topic, payload);
    }else if (typeof payload === "object"){
        client.publish(topic, JSON.stringify(payload));
    }else{
        fail();
    }
}
````

Dazu müssen die zu sendenden Daten entweder als String oder als JS-Object vorliegen.  