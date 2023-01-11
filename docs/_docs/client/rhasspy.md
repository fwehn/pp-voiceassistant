---
title: Rhasspy
permalink: /docs/client/rhasspy/
---

Was ist Rhasspy?  
Rhasspy ist eim Open-Source Sprachassistent.
Es ist ein Programm, welches verschiedene Techniken, unter anderem eine WakeWord-Erkennung, eine Spracherkennung und eine Intent-Erkennung verbindet, sodass es möglich ist, aus einem gesprochenen Satz einen Befehl zu erkennen und zu verarbeiten.  
  
Auf dieser Seite beschreibe ich einige Dinge zu Rhasspy, welche ich genutzt habe, um mein Skillsystem umzusetzen.  
Wie genau kommuniziert meine Anwendung mit der Rhasspy Instanz?  
Wie betreibe ich Rhasspy eigentlich?  

## Neue Intents hinzufügen
**Problem: Wie hinterlegt man die Intents eines Skills bei Rhasspy, sodass die Spracherkennung und die Intent-Erkennung damit arbeiten können?**

Lösung: Ich nutze die [Rhasspy-Api](https://rhasspy.readthedocs.io/en/latest/reference/#http-api), um neue Intents zu hinterlegen und Rhasspy neu zu trainieren.
### Sätze
Neue Sätze/Intents kann man unter ``http://<host-ip>:12101/api/sentences`` registrieren.  
Diese werden dann unter ``<Pfad des Profils>/intents/<Intentname>`` gespeichert.  
Dazu werden folgende Daten mittels einer HTTP-POST-Anfrage an obigen Endpoint gepostet:
````json
{
  "intents/<Name des Intents>.ini" : "[<Name des Intents>]\n<Sätze jeweils mit '\n' separiert>"
}
````

### Slots
Neue Slots kann man unter ``http://<host-ip>:12101/api/slots`` registrieren.  
Dazu wird ein Array mit den einzelnen Alternativen unter dem Slotnamen an obigen Endpoint gepostet:
````json
{
  "slots/<Name des Slots>": [
    "<Alternative 1>", 
    "<Alternative 2>",
    "<Alternative 3>",
    
    "<Alternative n>"
  ]
}
````

## Rhasspy trainieren
Um die Änderungen wirksam zu machen, muss man nach den obigen Anfragen eine weitere Anfrage an folgenden Endpoint senden: ``http://<host-ip>:12101/api/train``  
Dadurch wird Rhasspy's eigene Trainingsroutine gestartet.  
Rhasspy kümmert sich im Hintergrund darum, dass die Spracherkennung die neu hinzugefügten Wörter erkennt und die neuen Sätze von der Intent-Erkennung erfasst und die Intentionen bestimmt werden können.  



## Base/Satellite
Für die Arbeit an diesem Projekt brauchte ich eine Rhasspy Instanz, mit der ich meinen Code testen konnte.  
Da ich mir vor ein paar Monaten einen [Docker-Swarm](https://docs.docker.com/engine/swarm/) Cluster aus mehreren [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) gebaut habe, habe ich mich dazu entschlossen, Rhasspy in einem [Base/Satellite-Setup](https://rhasspy.readthedocs.io/en/latest/tutorials/#server-with-satellites) zu betreiben.  
Dabei hat man einen Zentralen Server (in meinem Fall das Cluster) und einen oder mehrere Satelliten (in meinem Fall ein [Raspberry Pi Zero W](https://www.raspberrypi.com/products/raspberry-pi-zero-w/) mit [ReSpeaker 2-Mics Pi HAT](https://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT/)).  

![Raspberry Pi Cluster](./../../assets/img/Hardware/Cluster/clusterandswitch.jpg)
*Bild meines Raspberry Pi Clusters mit Zigbee-Stick CC2531*

![Raspberry Pi Zero W](./../../assets/img/Hardware/Satellite/satellite.jpg)
*Bild meines Satellites (Raspberry Pi Zero W)*

Auf beiden läuft ein Docker Container basierend auf dem [Rhasspy Image](https://rhasspy.readthedocs.io/en/latest/installation/#docker).  
Darüber hinaus läuft ein [Mosquitto Container](https://hub.docker.com/_/eclipse-mosquitto) als MQTT-Broker auf dem Base-Server (Cluster).  
Beide Rhasspy Instanzen verbinden sich mit dem MQTT-Broker, um miteinander zu kommunizieren. 

Dabei kümmert sich der Base Container um folgende Punkte:  
- Speech to Text ([Kaldi](https://kaldi-asr.org/))
- Intent Recognition ([Fsticuffs](https://rhasspy.readthedocs.io/en/latest/intent-recognition/#fsticuffs))
- Text to Speech ([NanoTTS](https://github.com/gmn/nanotts))

Der Satellite Container übernimmt lediglich die Wake Word Detection([Porcupine](https://picovoice.ai/platform/porcupine/)) und die Audio Ein-/Ausgabe([ALSA](http://manpages.ubuntu.com/manpages/bionic/man1/aplay.1.html)).
