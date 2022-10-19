---
title: Evaluationen
permalink: /docs/evaluation/evaluation/
---

In diesem Abschnitt werde ich mir einige verschiedene Ansätze für modulare Systeme anschauen und evaluieren.  
Dazu habe ich mir drei verschiedene Systeme herausgesucht:  
- [Amazon Alexa](./amazonalexa.md)
- [Google Assistant](./googleassistant.md)
- [Home Assistant](./homeassistant.md)

Alle drei bieten einen etwas anderen Ansatz und Aufbau.  

# Warum habe ich mir genau diese Systeme ausgesucht?

Amazon Alexa und Google Assistant sind zwei der weit verbreitetsten Sprachassistenten überhaupt.  
Es lag also recht nahe, mir diese beiden Systeme anzuschauen.
Beide bieten einen komplett anderen Grundaufbau und setzten auf eine ganz andere Herangehensweise, wie die einzelnen Funktionen zu erstellen sind.  
Bei Alexa ist es sehr Code basiert, wohingegen beim Google Assistant alles eher Dialog basiert ist, indem man Fragen, Antworten und Reaktionen definiert und in Abhängigkeit zueinander setzt.  
Allerdings bieten beide auch die Möglichkeit, mittels Webhooks eine Kommunikation zu externen Servern aufzubauen.  
Dadurch gibt es kaum Beschränkungen in der komplexität dieser Funktionen.  

Home Assistant habe ich mir angeschaut, da es zwar kein Sprachassistent ist, jedoch trotzdem ein modulares Funktionssystem benutzt.  
Der grundlegende Anwendungszweck war also ein gänzlich anderer.  
Hier ging es dann eher darum, mir den Aufbau der Funktionen anzuschauen.  

# Worauf habe ich mich fokussiert?

Bei der Evaluation der Systeme habe ich mich auf den grundlegenden Aufbau der verschiedenen Module konzentriert.  
Welche Dateien werden von den Systemen verlangt, damit das Modul einwandfrei funktioniert?  
Wie sind diese Dateien aufgebaut?  
Wie sind die Befehle der Sprachassistenten aufgebaut? (Nur bei Amazon Alexa und Google Assistant)

Es ging mir bei der Evaluation also nicht darum, die Funktionsweise der Systeme zu analysieren, sondern eher die Sicht der Entwicklerinnen und Entwickler einzunehmen.  