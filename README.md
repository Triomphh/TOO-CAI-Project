# Auteurs
- Kévin Driencourt
- Florent Conderine

# Avant de commencer
Il est recommandé de lire ce `README.md` sur le [GitHub du projet](https://github.com/Triomphh/TOO-CAI-Project/) (si ce n'est pas déjà le cas). </br >
<sub>https://github.com/Triomphh/TOO-CAI-Project/</sub>


# Quelques infos avant de lire

## 1. Librairies utilisées
- **dmn-js** <sub>(Pre-packaged) ( Pour l'affichage du diagramme )</sub>
```html
<!-- dmns-js ONLY Viewer (pre-packaged) -->
<link rel="stylesheet" href="https://unpkg.com/dmn-js@14.7.1/dist/assets/dmn-js-drd.css">
<link rel="stylesheet" href="https://unpkg.com/dmn-js@14.7.1/dist/assets/dmn-js-decision-table.css">
<link rel="stylesheet" href="https://unpkg.com/dmn-js@14.7.1/dist/assets/dmn-js-literal-expression.css">
<link rel="stylesheet" href="https://unpkg.com/dmn-js@14.7.1/dist/assets/dmn-js-shared.css">
<link rel="stylesheet" href="https://unpkg.com/dmn-js@14.7.1/dist/assets/dmn-font/css/dmn.css">

<script src="https://unpkg.com/dmn-js@14.7.1/dist/dmn-viewer.development.js"></script>
  ```
- **dmn-moddle** <sub>( Transformer le `.dmn`/`.xml` en objet JavaScript utilisable )</sub>
- **feelin** <sub>( Évaluation des règles de l'objet **dmn** à l'aide du langage FEEL )</sub>


## 2. Organisation du code

### `app.ts`
`app.ts` est le script central (main) de l'application, actuellement il ne contient que `dragDrop.ts` car toutes les actions sont uniquement lancés à partir d'une action utilisateur (drag & drop, dans ce cas là).

### `DMN.ts`
Le code tourne autour d'une classe centrale `DMN.ts` qui gère :
1. le chargement d'un fichier `.dmn`/`.xml` et la validation/transformation de celui-ci en objet utilisable. <sub>(avec l'aide de `dmn-moddle`)</sub>
```typescript
async load( xml: File | string ): Promise<void> 
{
	try
	{
		// If xml is a (xml) File, convert it to a string, else it's already a string 
		this._xmlString = ( xml instanceof File ) ? await xml.text() : xml;

		const moddle = new DmnModdle();
		const { rootElement } = await moddle.fromXML( this._xmlString );

		this._dmnFile = {
			file_content: this._xmlString,
			file_name: "diagram"
		};

		this._dmnData = {
			me: rootElement as DMN_Definitions,
			file_name: "diagram"
		};
	}
	catch ( error )
	{
		console.error( "ERROR when trying to initialize DMN object: ", error );
	}
}
```

2. le chargement, la validation, l'initialisation et l'évaluation d'un `.json` sur le DMN
```typescript
async evaluate( jsonFile: File ): Promise<any>
{
	try
	{
		// Is _dmnData well initialized ? If not :
		if ( !this._dmnData || !this._dmnData.me )
			throw new Error( "DMN data is not properly initialized" );

		// Transform jsonFile into a usable json object
		if ( jsonFile.type !== "application/json" )
			throw new Error( "File is not a JSON file." );
		const fileContent = await jsonFile.text();
		const json = JSON.parse( fileContent );



		const jsonViewer: HTMLElement | null = document.getElementById( 'json-viewer' );
		if ( jsonViewer )
			jsonViewer.textContent = fileContent;
		


		// Get DMN Decisions 
		// FORCE CAST again...(for .drgElement) 
		const decisions = (this._dmnData.me as DMN_Definitions).drgElement.filter(
			(element: any) => is_DMN_Decision( element )
		) as DMN_Decision[];
			
			
		let results: { [key: string]: any } = {};
		let context = { ...json };

		// Reverse decisions to go from the lowest decision (leaf) to the highest (root) (Dependencies)
		const reversedDecisions = [ ...decisions ].reverse();

		for ( let decision of reversedDecisions )
		{
			// Destructuring with renaming
			const { input: inputs, rule: rules } = decision.decisionLogic;				

			// Sort the rule from the most precise to the less.
			const sortedRules = rules.sort((a, b) => {
		    const countEmptyA = a.inputEntry.filter(entry => !entry.text).length;
		    const countEmptyB = b.inputEntry.filter(entry => !entry.text).length;
		    return countEmptyA - countEmptyB;
 			});

				
			for ( let rule of sortedRules )
			{
				// Test every unary tests for each rules, and if one 'UT' is not valid, go to next rule...

				let ruleValid: boolean = true;
					
				// Counter variable cause we need to link the the inputClause to its 'UT' ( so we can can get the inputClause.inputEntry.text to match our json data and make the test )
				for ( let i=0 ; i<rule.inputEntry.length ; i++ )
				{
					const unaryTestExpression: string = rule.inputEntry[i].text;
					const inputExpression: string = inputs[i].inputExpression!.text;


					if ( !unaryTestExpression ) continue; // Skip if unary test is empty (treat it like it's true)


					const testResult: boolean = unaryTest( unaryTestExpression, { '?': context[inputExpression] } );
					

					// If a condition is not met, we stop unary tests / the rule is invalid.
					if ( !testResult )
					{
						ruleValid =  false;
						break; 
					}

				}

				// If ruleValid is true after unary tests, then add it to the context cause it's the one we want
				if ( ruleValid )
				{
					try
					{
						const outputResult = await evaluate( rule.outputEntry[0].text, context );   // Check with the context ( json base data + previous decisions calculated data )
						context[ decision.decisionLogic.output[0].name! ] = outputResult;   // take the variable name as a key
						results[ decision.name ] = outputResult;
					}
					catch ( error )
					{
						console.error( "ERROR FEEL output evaluation: ", error );
					}
					break;
				}
					
				context = { ...json, ...results };   // We add the results to our context so the parent table gets the calculated data it needs.
			}
		}

		console.log( "Résultats de l'évaluation: ", results );
		return results;

	}
	catch ( error )
	{
		console.error( "ERROR during FEEL evaluation: ", error );
	}
}
```

### `dragDrop.ts`
`dragDrop.ts` écoute les évenements utilisateur de type `dropEvent` et gère 2 cas différents :
1. Le fichier drop est un `.dmn`/`.xml`, alors un objet de classe **DMN** est créé et le .dmn est `.load` dedans + il est affiché avec `display( dmn )`
2. Le fichier drop est un `.json`, alors le fichier est `.evaluate` dans le **DMN** <sub>(s'il existe)</sub>
3. <sub>(plus quelques gestions d'affichage)</sub>

### `dmnViewer.ts`
`dmnViewer.ts` gère l'affichage du diagramme **dmn** à l'aide de la librairie **dmn-js** <br />
<sub>
Des warnings de taille peuvent apparaîtrent avec l'utilisation du viewer **dmn-js** (mais pas du modeler) 
```console
Unexpected value NaN parsing width attribute.
```
```console
Unexpected value NaN parsing height attribute.
```
</sub>


## Configuration `tsconfig.json`
```json
"module": "es6",                                     /* Specify what module code is generated. */
"moduleResolution": "node",                          /* Specify how TypeScript looks up a file from a given module specifier. */
"esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
"forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
"strict": true,                                      /* Enable all strict type-checking options. */
"skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
```


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
1. Drag & Drop un fichier `.dmn`/`.xml`
   - <sub>Requis : DMN >= 1.3 (**`DMN-examples/olderDMN/` contient des DMN < 1.3**)</sub>

### Tester les évaluations FEEL (`.json`)
0. <sub>(Active la console)</sub>
1. Drag & Drop un fichier `.json`



# Objectifs

## Fait *(même s'il faut sûrement peaufiner des choses)* :
- [x] Fichiers de base
- [x] Drag & Drop
- [x] Viewer DMN
- [x] Évaluations FEEL
- [X] HTML/CSS

## À faire : 
### Obligatoire
  
### Peaufinage



# Questionnements
- <sup>[10 déc. 14h25]</sup> ~~Actuellement, on peut drag & drop plusieurs fichiers en même temps et si c'est des DMN (.dmn ou .xml bien écrits) ils s'ouvrent tous en même temps dans le viewer. Si on part sur ça, il faut gérer en conséquences les évaluations FEEL, càd ;~~
     - ~~1 FEEL <-> Plusieurs DMN ?~~
     - ~~Plusieurs FEEL <-> Plusieurs DMN ?~~



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
- <sup>[20 déc. 18h00]</sup> <sub>Fin des évaluations FEEL et du HTML/CSS</sub>
- <sup>[12 déc. 20h10]</sup> <sub>Restructuration pour passer en partie en POO, entre autres le DMN qui devient une classe et facilite l'intéraction avec les autres fonctions ( faciliter le "transport", et réduire le nombre de données stockées en double )</sub>
- <sup>[10 déc. 16h50]</sup> <sub>Projet passé en webpack pour éviter pas mal de soucis sur les modules (vu que j'essaie de découper le code en le plus de fichiers possibles). Donc ça implique pas mal de changements (qui sont listés dans [Aide](https://github.com/Triomphh/TOO-CAI-Project/edit/main/README.md#aide)) + Il faut que je passe la bibliothèque `dmn-js` en *node-module* (`npm install dmn-js`) qui est encore sous forme d'import unpkg directement dans le HTML... (comme ça on repasse sur du modulaire qui est en accord avec le reste, e.g feelin)</sub>
