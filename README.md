# Integration von Bibliotheksdaten in RDF

Dieses Repository enthält Experimente zur Integration von Bibliotheksdaten
(bislang nur bibliographische Titeldaten) aus verschiedenen
Bibliotheksverbünden in RDF.

Die Titeldaten sollten alle den Empfehlungen der DINI-AG KIM folgen (https://wiki.dnb.de/x/cYMOB).

## Installation

~~~sh
npm install
~~~

## Benutzung

Dem Skript `extract` können eine oder mehrere URIs übergeben werden. Unterstützt werden bislang folgende Quellen:

- B3Kat (BVB und KOBV)
- Deutsche Nationalbibliothek (DNB)
- lobid (hbz)
- K10plus (GBV und SWB) *EXPERIMENTELL, verschiedene Varianten*

Noch ausstehend sind HeBIS (derzeit offline), die ZDB (eigener RDF-Export)

Daten aus anderen Ländern (z.B. <https://datos.bne.es/>) werden ebenfalls noch nicht unterstützt.

Hier Beispielaufrufe für den gleichen Titel bei verschiedenen Quellen:

~~~sh
npm run -s extract http://lobid.org/resources/990186583900206441 https://d-nb.info/982315627
npm run -s extract http://lod.b3kat.de/title/BV022302814
npm run -s extract http://uri.gbv.de/document/opac-de-627:ppn:555187721
npm run -s extract http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=555187721
~~~

Das Skript `compare.pl` ruft den gleichen Titel bei mehreren Verbünden auf und stellt einen groben Vergleich an.

