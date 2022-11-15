---
title: Installation
permalink: /docs/installation/
---

Damit die Installation reibungslos funktioniert habe ich hier eine kleine Anleitung erstellt.
  
Dieses Projekt umfasst zwei NodeJS-Projekte: Den Skillmanager (Client) und einen Skillserver.  
Der Skillserver ist dabei rein optional.  
Er stellt eine Möglichkeit dar, Skills zu [installieren](./client/skillmanager.md#online).  
Ich selbst hoste eine öffentlich zugängliche Instanz des Servers [hier](https://skillserver.fwehn.de).  
  
Beide Applikationen können auf demselben Host installiert werden wie Rhasspy, müssen es jedoch nicht.  
Lediglich der Client benötigt sowohl eine HTTP- als auch eine MQTT-Verbindung zur Rhasspy-Instanz.  
Außerdem muss im Rhasspy-Profil der Punkt ``Intent Handling`` deaktiviert sein.  

## Client

Da das Projekt darauf ausgelegt war, dass das Skillsystem auf einem [Raspberry Pi](https://www.raspberrypi.com/) läuft, beschreibe ich hier die Installation auf eben diesem.  

### Installation mit einem Vorkonfigurierten Image

[//]: # (TODO aussschreiben)
- image link
- z.B. win32disk imager mit link
- 1880 node red
- 1883 mosquitto
- 12100 zigbee
- 12101 rhasspy
- 12102 skillsystem

### Neuinstallation auf Basis von Raspberry Pi OS

Zunächst braucht man eine SD-Karte mit dem [Raspberry Pi OS](https://www.raspberrypi.com/software/).  
Dazu installiert man sich den Raspberry Pi Imager und beschreibt die Karte mit einer geeigneten Version des OS (in meinem Fall ``Raspberry Pi OS Lite (32-Bit)``).  
Im Raspberry Pi Imager kann man noch verschiedene Einstellungen konfigurieren.  
Wichtig dabei ist, dass der Standard-User ``pi`` bleibt.  
  
Voraussetzung für die unten genannten Schritte sind eine [Rhasspy-Instanz](https://rhasspy.readthedocs.io/en/latest/installation/) und ein [MQTT-Broker](https://mqtt.org/software/#servers-brokers) (in meinem Fall ein [Mosquitto-Broker](https://mosquitto.org/)).
Zudem müssen die Laufzeit-Umgebung [NodeJS](https://nodejs.org/en/download/) (in meinem Fall version "v17.0.0") und [Git](https://git-scm.com/) installiert sein.  
  
Sind all diese Dinge installiert und Rhasspy und der MQTT-Broker sind unter den Ports ``12101`` bzw ``1883`` erreichbar, kann die eigentliche Installation des Skillmanagers beginnen.  
Dazu Verbindet man sich mit dem Raspberry Pi via [ssh](https://de.wikipedia.org/wiki/Secure_Shell) (zum Beispiel mit [Windows Powershell](https://de.wikipedia.org/wiki/PowerShell)).  
  
Der Ausgangspunkt sollte ``/home/pi`` sein.  
Von hieraus läd man sich das [GitHub-Repository](https://github.com/fwehn/pp-voiceassistant) und installiert die benötigten [npm-Packages](https://www.npmjs.com/).  

````shell
git clone https://github.com/fwehn/pp-voiceassistant.git
cd ./pp-voiceassistant/src/sdk
sudo npm install
cd ../client
sudo npm install
````

Im Verzeichnis ``/home/pi/pp-voiceassistant/src/client`` benötigt der Skillmanager noch zwei Verzeichnisse mit den Namen ``configs`` und ``skills``.  
In ``configs`` wird noch die Datei ``skillConfigs.json`` mit einem leeren Objekt (``{}``) angelegt und dem ``root``-User volle berechtigung auf diese Datei gewährt.  
Diese Berechtigung ist wichtig, damit der Skillmanager die Datei verändern kann.  

````shell
sudo mkdir configs
sudo sh -c "echo '{}' >> /home/pi/pp-voiceassistant/src/client/configs/skillConfigs.json"
sudo chmod 777 ./configs/skillConfigs.json
sudo mkdir skills
````

Um den Skillmanager zu starten, muss man im Verzeichnis ``/home/pi/pp-voiceassistant/src/client`` den Befehl ``npm run start`` eingeben.  
Danach sollte das Webinterface unter dem Port ``12102`` erreichbar sein.  
  
Damit man den Skillmanager nicht immer manuell starten muss, habe ich einen [systemd](https://de.wikipedia.org/wiki/Systemd#:~:text=systemd%20ist%20eine%20Sammlung%20von,und%20Beenden%20weiterer%20Prozesse%20dient.)-Service erstellt.  
Um diesen im Raspberry Pi zu registrieren, muss zunächst die Datei ``skillmanager.service`` in das Verzeichnis ``/lib/systemd/system/`` kopiert und der Service aktiviert werden.  
Danach sollte das System einmal neu gestartet und der Skillmanager wieder unter dem Port ``12102`` erreichbar sein.

````shell
sudo cp /home/pi/pp-voiceassistant/src/client/skillmanager.service /lib/systemd/system/skillmanager.service
sudo systemctl daemon-reload
sudo systemctl enable /lib/systemd/system/skillmanager.service
sudo reboot
````

### Env-Variablen

Damit man den Client in der eigenen individuellen Umgebung nutzen kann, habe ich einige Umgebungsvariablen definiert:

- ``SERVER``: Adresse des Skillservers (default: ``https://skillserver.fwehn.de``)
- ``RHASSPY``: Adresse der Rhasspy-Instanz (default: ``http://127.0.0.1:12101``)
- ``PORT``: Port, über den das Webinterface erreichbar sein soll (default: ``12102``)
- ``MQTTHOST``: Adresse des MQTT-Brokers (default: ``127.0.0.1``)
- ``MQTTPORT``: Port, über den der MQTT-Broker erreichbar ist (default: ``1883``)
- ``LOCALE``: Sprache, auf der der Client arbeiten soll (default: ``de_DE``)
- ``ZIGBEETOPIC``: Das Base-Topic von Zigbee2MQTT (default: ``zigbee2mqtt``)

Diese lassen sich am besten in der ``skillmanager.service``-Datei bearbeiten.  
Dazu kann man den Befehl ``sudo nano /lib/systemd/system/skillmanager.service`` ausführen.  
  
Nachdem man die Variablen auf die eigene Umgebung angepasst hat, kann man mit ``Strg+O`` die Datei speichern und mit ``Strg+X`` den Editor verlassen.  
Danach sollten die Services einmal neu geladen und der Host neu gestartet werden. 

````shell
sudo systemctl daemon-reload
sudo reboot
````

## Server (Optional)

Beim Server handelt es sich um einen einfachen Dateiserver für die Skills.  
Darüber kann der Client dann die einzelnen Skills installieren.  
  
Ich selbst Hoste eine Instanz unter [diesem Link](https://skillserver.fwehn.de), daher ist eine Installation rein optional.
  
Die Installation des Skillservers ist etwas einfacher, als die des Skillmanagers.  
Dazu benötigt man lediglich die Dateien im Verzeichnis "[src/server](https://github.com/fwehn/pp-voiceassistant/tree/main/src/server)".  
In diesem Verzeichnis muss man dann nur noch den Befehl ``npm run start`` ausführen.

### Env-Variablen
Für den Server gibt es lediglich eine Umgebungsvariable.

``PORT``: Port auf den der Express-Server "hört" (default: ``3000``)