---
title: Zigbee2MQTT
permalink: /docs/skills/Zigbee2MQTT/
---

Dieser Skill verwendet [Zigbee2MQTT](https://www.zigbee2mqtt.io/), um auf verschiedene Smarthome-Geräte zuzugreifen und diese zu verwalten.  
Bisher beschränken sich die Befehle lediglich auf die Kontrolle von Lampen.  
Lampen können ein-/ausgeschaltet werden.  
Außerdem können die Helligkeit und Farbe der Lampen verändert werden.  
Die Farben können über das Webinterface definiert werden.  

## Intents

Der Skill bietet drei Intents, die die Steuerung der Lampen übernehmen:

``... <launch> [Zigbee zu MQTT] schalte mein Licht ein``  
``... <launch> [Zigbee zu MQTT] ändere die Helligkeit von Licht auf 75 Prozent``  
``... <launch> [Zigbee zu MQTT] ändere die Farbe von Licht auf rot``  

Jeder dieser Intents führt die beschriebene Aufgabe aus und gibt eine zufällige Antwort wie z.B. "Ok" oder "Alles klar" zurück.

## Slots

Der Skill verwendet den automatisch generierten Slot ``zigbee2mqtt`` und definiert zwei weitere Slots mit folgenden Werten:

- ``state``:
    - aus
    - ein
    - an
    - _  
  
  
- ``zigbeeColor``:
    - weiß
    - rot
    - grün
    - blau

