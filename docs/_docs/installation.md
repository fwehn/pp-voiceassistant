---
title: Installation
permalink: /docs/installation/
---

Damit die Installation reibungslos funktioniert habe ich hier eine kleine Anleitung erstellt.

Voraussetzung für die unten genannten Schritte sind eine [Rhasspy-Instanz](https://rhasspy.readthedocs.io/en/latest/installation/) und ein [MQTT-Broker](https://mqtt.org/software/#servers-brokers) (in meinem Fall ein [Mosquitto-Broker](https://mosquitto.org/)).

Dieses Projekt umfasst zwei NodeJS-Projekte: Den Skillmanager (Client) und einen Skillserver.  
Der Skillserver ist dabei rein optional.  
Er stellt eine Möglichkeit dar, Skills zu [installieren](./client/skillmanager.md#online).  
Beide Applikationen können auf demselben Host installiert werden wie Rhasspy, müssen es jedoch nicht.  
Lediglich der Client benötigt eine Verbindung zur Rhasspy-Instanz.

## Client

Zunächst muss man [NodeJS](https://nodejs.org/en/download/) (in meinem Fall version "17.0.0") installieren.  
Dann kann man sich die Verzeichnisse ["src/client"](https://github.com/fwehn/pp-voiceassistant/tree/main/src/client) und ["src/sdk"](https://github.com/fwehn/pp-voiceassistant/tree/main/src/sdk) herunterladen.  
Ich empfehle dabei die Ordnerstruktur beizubehalten, da das SDK im [``package.json``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/package.json) des Clients als ``dependency`` mit einem relativen Pfad angegeben ist.  
Dieser lässt sich jedoch leicht ändern, möchte man das SDK an einer anderen Stelle ablegen.  

Hat man alle benötigten Verzeichnisse heruntergeladen, muss man noch eine JSON-Datei mit dem Namen ``skillConfigs.json`` im Verzeichnis des Clients anlegen, die ein leeres JSON objekt (``{}``) enthält.  

### Env-Variablen

Damit man den Client in der eigenen individuellen Umgebung nutzen kann, gibt es einige Umgebungsvariablen:

- ``SERVER``: Adresse des Skillservers (default: ``localhost:3000``)
- ``RHASSPY``: Adresse der Rhasspy-Instanz (default: ``localhost:12101``)
- ``PORT``: Port, über den das Webinterface erreichbar sein soll (default: ``12102``)
- ``MQTTHOST``: Adresse des MQTT-Brokers (default: ``localhost``)
- ``MQTTPORT``: Port, über den der MQTT-Broker erreichbar ist (default: ``1883``)
- ``LOCALE``: Sprache, auf der der Client arbeiten soll (default: ``de_DE``)
- ``ZIGBEETOPIC``: Das Base-Topic von Zigbee2MQTT (default: ``zigbee2mqtt``)

## Server

Beim Server handelt es sich um einen Dateiserver für die Skills.  
Darüber kann der Client dann die einzelnen Skills installieren.  

Die Installation des Skillservers ist etwas einfacher.  
Dazu benötigt man lediglich die Dateien im Verzeichnis "[src/server](https://github.com/fwehn/pp-voiceassistant/tree/main/src/server)".  
In diesem Verzeichnis muss man dann nur noch den Befehl ``npm run start`` ausführen.

### Env-Variablen
Für den Server gibt es lediglich eine Umgebungsvariable.

``PORT``: Port auf den der Express-Server "hört" (default: ``3000``)


[//]: # (## Installation der Dependencies)

[//]: # ()
[//]: # (Einige Skills verwenden bestimmte [npm-Dependencies]&#40;https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies&#41;.  )

[//]: # (Diese werden in den jeweiligen [Manifest-Dateien]&#40;./skill/manifest.md#abhngigkeiten&#41; unter dem Punkt ``dependencies`` aufgeführt.  )

[//]: # (Diese npm-Dependencies müssen manuell installiert werden.  )

[//]: # (Dazu verwendet man den Befehl:  )

[//]: # (``npm install <Name und Version der Dependency>``)

[//]: # ()
[//]: # (Dieser sollte im Verzeichnis des Skillmanagers ausgeführt werden, also im Verzeichnis, in dem sich die ``package.json`` befindet.)