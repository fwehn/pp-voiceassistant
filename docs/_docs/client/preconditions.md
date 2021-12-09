---
title: Vorbedingungen
permalink: /docs/client/preconditions/
---

Manche Skills brauchen andere Programme oder Vorbedingungen um zu funktionieren.  
Doch wie findet man individuell für ein Gerät heraus, ob diese Vorbedingungen erfüllt sind?  


## Zigbee2MQTT

[Zigbee2MQTT](https://zigbee2mqtt.io) ist ein sehr gutes Tool, um die Möglichkeiten eines Sprachassistenten zu erweitern, indem man mittels eines Zigbee-Sticks mit verschiedensten [Zigbee-Geräten](https://www.zigbee2mqtt.io/supported-devices/) kommuniziert.  
Möchte man nun einen Skill installieren, welcher zum Beispiel verschiedene Lampen steuern soll, so sollte es für den Endnutzer ersichtlich sein, ob Zigbee2MQTT installiert ist oder nicht.  
Um das zu überprüfen, könnte man zum Beispiel auf verschiedene Zigbee2MQTT Topics "hören".  
Es kann allerdings auch sein, dass der Benutzer das "Base-Topic" bei der Konfiguration umbenannt hat.  


## LCD

## docker.sock
Sollte man den Skillmanager als Docker Container ausrollen, könnte man ihm Zugriff auf den ``docker.sock`` gewähren.  
Dadurch könnte man einsehen, welche Container auf dem aktuellen Host laufen (ähnlich wie zum Beispiel Portainer).  

## Base/Satellite-Setup

Befindet sich Rhasspy derzeit in einem [Base/Satellite-Setup](https://rhasspy.readthedocs.io/en/latest/tutorials/#server-with-satellites)?  
Ist das der Fall so ist es etwas schwieriger zu überprüfen, ob  Displays oä angeschlossen sind.  
Mit folgendem API-Call kann man sich das Profil von Rhasspy anzeigen lassen:  
```http request
http://<rhasspy-ip>:12101/api/profile
```  
Daraus kann man dann ableiten, ob es sich um ein Base/Satellite-Setup.  
