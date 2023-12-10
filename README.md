# Objectifs

## Fait *(même s'il faut sûrement peaufiner des choses)* :
- [x] Fichiers des base
- [x] Drag & Drop
- [x] Viewer DMN

## À faire : 
### Obligatoire
- Gestion des données d'entrée pour l'évaluation FEEL
- Implémentation des types dmn-moddle (`DMN-JS.ts`)
- Vérifier que tout est bien TypeScript
- Tests...
- Relire tout le code car c'est sûr que j'oublie des trucs là
  
### Peaufinage
- UI 
- La taille dynamique du 'canvas' qui contient le viewer DMN (en fonction de la taille du diagramme)
- Enlever le(s) précédent(s) diagramme(s) quand il y a un nouveau Drag & Drop
- Voir si on peut afficher plusieurs diagrammes DMN en même temps ? (implique probablement des modifs dans les évaluations DMN <-> FEEL)
- Quelques modifs mineurs dans le Drag & Drop

### Questionnements
- [10 déc. 14h25] Actuellement, on peut drag & drop plusieurs fichiers en même temps et si c'est des DMN (.dmn ou .xml bien écrits) ils s'ouvrent tous en même temps dans le viewer. Si on part sur ça, il faut gérer en conséquences les évaluations FEEL, càd ;
     - 1 FEEL <-> Plusieurs DMN ?
     - Plusieurs FEEL <-> Plusieurs DMN ?
