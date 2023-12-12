# Quelques infos avant de lire
- Le projet est très modulaire, c-à-d la plupart des fonctions ont leur propre fichier.



# Aide

## Compilation
*(Le mieux si jamais le script de compilation vient à changer)* :
```
npm run build
```
ou
```
webpack
```

## Ajouter une fonction
Vu qu'on est modulaire, il faut créer un fichier avec ton code :
`ts`/`test.ts`
```typescript
export function test(  ): void
{
  // Blah blah...
}
```

Puis l'ajouter dans `ts`/`app.ts` :
```typescript
import { test } from './test';

test();
```
<sup>(Pas de `.ts` dans les imports)</sup>


## Ajouter une librairie

### Si elle est dans `npm`
```
nmp install librairie
```
puis pour l'ajouter à ton code :
```typescript
import { fonction1, fonction2 } from '../node_modules/librairie';
```


### Sinon
...


## Tester le site

### Tester les DMN (`.dmn` ou `.xml`)
0. <sub>(Active la console)</sub>
1. Drag & Drop un/plusieurs fichier(s) `.dmn`/`.xml`
   - <sub>Requis : DMN >= 1.3 (**Seulement les `.dmn` dans `DMN-examples/`**)</sub>

### Tester les évaluations FEEL (`.json`)
0. <sub>(Active la console)</sub>
1. ...



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
    - Tester avec des extensions de fichier en maj (ex: `test.xml` <=> `test.XML`)
- Relire tout le code car c'est sûr que j'oublie des trucs là
  
### Peaufinage
- Passer `dmn-js` en node-module
- Un bel UI
- La taille dynamique du 'canvas' qui contient le viewer DMN (en fonction de la taille du diagramme)
- Enlever le(s) précédent(s) diagramme(s) quand il y a un nouveau Drag & Drop
- Voir si on peut afficher plusieurs diagrammes DMN en même temps ? (implique probablement des modifs dans les évaluations DMN <-> FEEL)
- Quelques modifs mineurs dans le Drag & Drop
    - changer les `.endswith( '.dmn' )` et `.endswith( '.xml' )` en quelque chose de mieux (type document = xml)



# Questionnements
- <sup>[10 déc. 14h25]</sup> Actuellement, on peut drag & drop plusieurs fichiers en même temps et si c'est des DMN (.dmn ou .xml bien écrits) ils s'ouvrent tous en même temps dans le viewer. Si on part sur ça, il faut gérer en conséquences les évaluations FEEL, càd ;
     - 1 FEEL <-> Plusieurs DMN ?
     - Plusieurs FEEL <-> Plusieurs DMN ?



# Pourquoi Webpack ?
- Permet de gérer les modules/librairies plus facilement
    - Gestion des imports/exports
    - Gestion des dépendances
- Outrepasser certains problèmes, de type :
    - `Cross-Origin Request Blocked`
    - chemins relatifs/absolus
    - `MIME`
- Utiliser les `node-modules` sans mettre en place un serveur à la main
- Optimisation des chargements
- Support d'anciens navigateurs/version de JS



# Journal
- <sup>[12 déc. 20h10]</sup> Restructuration pour passer en partie en POO, entre autres le DMN qui devient une classe et facilite l'intéraction avec les autres fonctions ( faciliter le "transport", et réduire le nombre de données stockées en double )
- <sup>[10 déc. 16h50]</sup> Projet passé en webpack pour éviter pas mal de soucis sur les modules (vu que j'essaie de découper le code en le plus de fichiers possibles). Donc ça implique pas mal de changements (qui sont listés dans [Aide](https://github.com/Triomphh/TOO-CAI-Project/edit/main/README.md#aide)) + Il faut que je passe la bibliothèque `dmn-js` en *node-module* (`npm install dmn-js`) qui est encore sous forme d'import unpkg directement dans le HTML... (comme ça on repasse sur du modulaire qui est en accord avec le reste, e.g feelin)
