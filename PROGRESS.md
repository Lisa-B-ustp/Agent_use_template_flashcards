# Progress

## Done

- F1: HTML-Struktur für das Hundprofil erstellt
  - Eingabefelder für Name, Rasse und Alter
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
  - Profil, Bewegungserfassung und Gewichtslinie überprüft
- Mehrere Profile – Schritt 1: HTML-Steuerelemente ergänzt
  - Auswahlfeld für Hundprofile und Schaltfläche für ein neues Profil
- Mehrere Profile – Schritt 2: Steuerelemente gestaltet
  - Auswahlfeld und Schaltfläche an das bestehende Grün-Orange-Design angepasst
- Mehrere Profile – Schritt 3: Bestehende Datenübernahme ergänzt
  - Bisheriges Profil sowie Bewegungs- und Gewichtsmessungen werden einmalig zusammengeführt
  - Alte Speicherwerte bleiben zur Sicherheit erhalten
  - Änderungen werden bis zur Umstellung der Formulare mit der übernommenen Kopie synchronisiert

## Next

- Mehrere Profile – Schritt 4: Profile erstellen und zwischen ihnen wechseln

## Decisions & notes

- Profil und Bewegungswerte werden im Browser gespeichert
- Pro Datum wird ein Tagesgesamtwert gespeichert; erneutes Speichern ersetzt den bisherigen Wert
- Auch Gewicht wird pro Datum gespeichert; erneutes Speichern ersetzt den bisherigen Messwert
- Das Profil enthält kein Gewichtsfeld; Gewichtsmessungen werden separat mit Datum erfasst
- Die Balkenhöhe wird relativ zum höchsten Wert der letzten 30 Tage berechnet
- Die Gewichtslinie verwendet eine eigene Skala anhand der gespeicherten Messwerte
- Der manuelle Browser-Test nach Ergänzung der Gewichtslinie wurde vom Nutzer als erfolgreich bestätigt
- Die Steuerelemente für mehrere Profile sind gestaltet, aber noch nicht funktionsfähig
- Die neue Profilspeicherung ist vorbereitet; Auswahl und Wechsel sind noch nicht angeschlossen
- Automatische Prüfungen wurden nicht ausgeführt

## Known problems

- Keine bekannt