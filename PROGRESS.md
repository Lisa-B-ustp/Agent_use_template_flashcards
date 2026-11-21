# Progress

## Done

- F1: HTML-Struktur für das Hundprofil erstellt
  - Eingabefelder für Name, Gewicht, Rasse und Alter
  - Profil wird im Browser gespeichert und nach erneutem Laden wieder angezeigt
- F2: HTML für die tägliche Bewegungserfassung erstellt
  - Felder für Datum und Bewegungszeit in Minuten
  - Werte werden pro Datum gespeichert; die heutige Bewegungszeit wird angezeigt
- F3: 30-Tage-Übersicht umgesetzt
  - Balken zeigen die Bewegungszeit; eine Linie zeigt erfasste Gewichte der letzten 30 Tage
  - Gewicht kann mit Datum eingetragen werden und wird im Browser gespeichert
  - Bewegungszeit und Gewicht verwenden getrennte Skalen
- CSS-Grundgestaltung und Hundprofil gestaltet
  - Grün-oranges Farbschema und Profilkarte
  - Eingabefelder und Button formatiert
- CSS für Bewegungserfassung und 30-Tage-Übersicht gestaltet
  - Kartenlayout, Felder, Buttons sowie Balken- und Liniengrafik formatiert
- Manueller Browser-Test erfolgreich abgeschlossen
  - Profil, Bewegungserfassung und 30-Tage-Grafik überprüft

## Next

- Gewichtserfassung und Gewichtslinie im Browser prüfen

## Decisions & notes

- Profil und Bewegungswerte werden im Browser gespeichert
- Pro Datum wird ein Tagesgesamtwert gespeichert; erneutes Speichern ersetzt den bisherigen Wert
- Auch Gewicht wird pro Datum gespeichert; erneutes Speichern ersetzt den bisherigen Messwert
- Die Balkenhöhe wird relativ zum höchsten Wert der letzten 30 Tage berechnet
- Die Gewichtslinie verwendet eine eigene Skala anhand der gespeicherten Messwerte
- Der bisherige manuelle Browser-Test wurde vor dem Hinzufügen der Gewichtslinie erfolgreich abgeschlossen
- Automatische Prüfungen wurden nicht ausgeführt

## Known problems

- Keine bekannt