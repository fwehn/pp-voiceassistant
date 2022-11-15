---
title: HelloWorld
permalink: /docs/skills/HelloWorld/
---

Bei HalloWorld handelt es sich um einen sehr einfachen Testskill.  
Bei der Erstellung ging es darum, einen ersten Programmablauf des Skillmanagers zu implementieren und zu testen.  
Wie wird ein Skill installiert?  
Wie und wo werden die Skilldaten gespeichert?  
Wie werden die Skills bei Rhasspy registriert?  
Wie werden die Daten von Rhasspy entgegengenommen und an den Skill übergeben?

## Intents

Der Skill umfasst zwei sehr ähnliche Intents.  
Sie sollen die Slots ``hello`` bzw. ``world`` erkennen und via Sprachausgabe wiedergeben. 

``... <launch> Hallo Welt sag <hello> <world>``  
Gibt "Hallo Welt", "Guten Tag Erde" oder andere Kombinationen der [Slots](#slots) wieder.

``... <launch> Hallo Welt sag <hello>``  
Gibt entweder "Hallo" oder "Guten Tag" wieder.


## Slots

Beide Slots umfassen lediglich je zwei Werte:

- ``hello``:
  - Hallo
  - Guten Tag


- ``world``:
  - Welt
  - Erde