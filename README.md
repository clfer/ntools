NTools
======

Access Drupal useful information from markup with 1 click or less.

![toolbar](https://raw.githubusercontent.com/NerOcrO/ntools/master/toolbar.png)

## To try it is to love it!

If you want to test NTools before installing it, create the following bookmarklet :

```
javascript:(function(){var script=document.createElement('script');script.src='https://rawgit.com/NerOcrO/ntools/master/ntools.user.js?'+Math.floor(new Date);document.body.appendChild(script);})()
```

and see all you can do on your favorite Drupal !

## Installation

### Firefox

* Install [greasemonkey](https://addons.mozilla.org/fr/firefox/addon/greasemonkey/)
* [Click here and install this script](https://github.com/NerOcrO/ntools/raw/master/ntools.user.js)
* about:addons -> User scripts (monkey head icon), click on the "Preferences" button
 and add the domain names on which you want the script to be executed (e.g. : http://nerocro.monsite.fr/*)

### Chrome

* Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Click here and install this script](https://github.com/NerOcrO/ntools/raw/master/ntools.user.js)
* Tools -> Extensions
* Click on the Tampermonkey "Settings" link
* Go to the "Installed userscripts" and click on Ntools
* Click on the script "Settings" tab
* Section "Includes/Excludes" -> "User includes": the domain names on which you want the script to be executed (e.g. : http://nerocro.monsite.fr/*)

### My excluded pages

* \*/update.php*
* \*/batch?*

### Drupal Theme

* Download or clone this repo
* Place this JS script in the js/ directory of your theme
* Remove the `// ==UserScript==` header (only useful for greasemonkey)
* Add this line to your_theme.info : `scripts[] = js/ntools.user.js`

## Why this script ?

Has I have to work on several different Drupal each day, I need to
find information quickly. So I developed this script to avoid repetitive
tasks like using the element inspector to find what is the name a view,
what is the name a block, am I on a node, what is the current node nid,
what is the machine name of taxonomy, views, block ...
With **1 click** (or less), I can  access to all of this information
either with a visual effect or a complementary column in a table (admin)
or with a direct link.

## I'm a client and I don't know how to use the element inspector, can I use this script?

Of course!

This script is not only for developers. You can share it with your project manager
or your client so that they can give you some important information
to save time on the phone or in the statement of a task / bug report.

## Why not a contrib module or improving the core?

Good question!

Create a module: yes but generally we do not enable helper modules on
production environment yet I need this on production.
Improve an existant module or the core: Some of the ideas of this module could
deserve a port to the core and or existing modules but not all of them.
Plus contribution takes time to be validated and people may not agree with what I propose.

The advantage of this module is that it can be quickly installed on any version of Drupal 7
on any environment (dev / preprod / prod), on any browser that handles "user script "and it's not intrusive.
The downside is that it's javascript :D However, I learned a lot of things about how Drupal.

The other idea I had in mind was that this script can be a sandbox,
a kind of beta testing before integration in the core if it appeals to people.

## Is this script compatible with Drupal 6?

A bit...

## Front office

### The toolbar
<!---
TODO: Try a better translation of this joke?
La mer noire ? non la barre noire !
-->

The toolbar sticks by default to the left side, is togglable with a double click and
you can move it wherever you want. The configuration is saved thanks to `ntools_toggle`
and `ntools_toggle_positions` cookies.

### Login link

#### Problem

Sometimes their is no authentication form at hand on all pages (UI design problem!)
or I have to click a pseudo-link for it to appear, so I type in my browser "/user/login"
which is annoying on the long term...

#### Functionality

Display a link to "/user" with the destination parameter set to current page.

#### Bonus track

Auto focus on the login field, allowing your browser to autofill if you registered
your ?identifiant?. You just need to hit the ?Entrée? key.

#### Known issue

* The language prefix is not working
* Works only if you created a domain

### Logout link

#### Problem

Sometimes their is no logout link at hand on all pages (UI design problem!)
or I have to click a pseudo-link for it to appear, so I type in my browser "/user/logout"
which is annoying on the long term...

#### Functionality

Displa a logout link.

#### Known issues

* The language prefix is not working
* Works only if you created a domain

### Body classes

#### Problem

When an incomplete issue links to a page, I miss some information.
What page is it? an entity? of wich type? What is the nid?
Those pieces of information can be available by opening the element inspector and checking the bod classes.

#### Functionality

Display the classes beginning with "page-node-", "node-type-", "page-type-",
"page-taxonomy-term-" and "page-user-".
Display also "context-" classes with a link to edit the context.

### Masquerade

#### Problem

During testing phase, you need to change user frequently so you open multiple tabs.
[Administration menu](https://www.drupal.org/project/admin_menu) offers a switch user
functionality but [Masquerade](https://www.drupal.org/project/masquerade) is just way better.

#### Installation

Install [masquerade](https://www.drupal.org/project/masquerade) module.
Place the masquerade block in the "footer" region.

_You will need [drush_extras](https://www.drupal.org/project/drush_extras) for the following command_

`drush block-configure --module=masquerade --delta=masquerade --region=footer`

#### Functionality

Integrate masquerade block into our toolbar to have it at hand all the time.

Add role to each user (title attributes)  waiting for [this functionality](https://www.drupal.org/node/2355069).

### Display recurring elements

#### Problem

A lot of information are accessible by using the element inspector and checking classes/ids
belonging to a node, a field, a view...

#### Functionality

Extract info from those classes and ids and allow to have a better visualization of:
* <span style="background-color:#018FE2;color:#FFF;">regions</span>
* <span style="background-color:#B73939;color:#FFF;">blocks</span>
* <span style="background-color:#FFA300;color:#FFF;">views</span>
* <span style="background-color:#4D8F46;color:#FFF;">nodes</span>
* <span style="background-color:#4D8F46;color:#FFF;">profiles</span> (profile2)
* <span style="background-color:#783A00;color:#FFF;">fields</span>
* <span style="background-color:#4A3657;color:#FFF;">forms</span>

Those buttons will appear if any of the corresponding elements are found.

By clicking any of them, black transparent overlays will highlight the corresponding element
and display extended information. Clicking any of them will, remove it.

##### Regions

Display region machine name

##### Blocks

Display block id and machine name.

If you're logged in, the following link is displayed:
* Edit this block **[E]**

##### Views

Display view machine name and display name.

If you're logged in, the following link is displayed:
* Edit this block **[E]**

##### Nodes

Display node nid and content type.

The following properties are displayed (if applicable) :
* **P** → Promoted
* **S** → Sticky
* **U** → Unpublished
* **teaser** → view mode teaser

The following link is displayed:
* View this node **[V]**

If you're logged in, the following links are displayed:
* Edit this node **[E]**
* Manage fields **[F]**
* Manage display **[D]**

##### Profile

Display profile machine name.

* Manage fields **[F]**
* Manage display **[D]**

##### Fields

Display field machine name and field type.

##### Forms

Display form machine name.

##### _Troll_

_Sometimes the overlays can collapse, meaning that your front end developer may have to review its work..._

## ~~Arrière-guichet~~ Back office

Affichage du nom machine et/ou de l'identifiant sans passer par l'inspecteur
d'élément pour l'avoir de suite. Très utile pour faire une recherche rapide ou
l'écrire dans votre code. Affichage de quelques liens pour un accès rapide sans
passer par l'admin menu. Pour plus de lisibilité, leur police est grasse et
verte.

### Structure

#### Blocs

Affichage du `module → nom machine` par bloc.

#### Vocabulaires

Affichage du nom machine et du VID par vocabulaire.

Ajout de liens :

* Gérer les champs
* Gérer l'affichage

#### Termes

Affichage du TID par terme.

#### Types de contenu

Dans l'onglet "Gérer l'affichage" d'un type de contenu, ajout d'un bouton pour
rendre caché tous les labels des champs.

#### Vues

Affichage du nom machine par vue.

#### Gérer les champs

Affichage d'un lien vers le field collection quand nous sommes sur ce dernier.

### Personnes

Affichage de l'identifiant par utilisateur.

#### Permissions

Affichage du nom machine par permission.

#### Rôles

Affichage de l'identifiant par rôle.

### Modules

Affichage du nom machine par module.

### Configuration

#### Traduction d'entité

Ajout d'un bouton pour régler de façon pertinente la configuration :

* Langue par défaut : Langue par défaut
* "Hide language selector" coché
* "Exclude Language neutral from the available languages" coché
* "Hide shared elements on translation forms" coché

### Rapports

#### Liste des champs

Le tableau peut être trié par ordre alphabétique selon la colonne. Intéressant
pour savoir combien on a de texte long sur notre site par exemple.

### Bonus track

Ajout d'un surlignement sur les lignes de tableau pour mieux la visualiser.

Je me demande pourquoi ça n'existe pas de base ???

### Astuce

J'ai volontairement écrit d'une certaines façon les noms machine pour optimiser
la recherche dans le code.

Exemples :

* Pour un bloc : `['masquerade']`, vous tomberez directement dans le hook_block_info() respectif
* Pour une vue : `$view->name = 'archive';`, vous tomberez directement dans le hook_views_default_views() respectif

### Bug connu

L'en-tête des tableaux est cassée lors d'un scroll.

## Partout

Ajout d'un title sur les input/textarea/select/option avec leur nom/valeur.
