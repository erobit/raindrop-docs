# raindrop docs
 
A simple social document sharing app

## Live demo ( alpha software - updated daily )
http://raindrop.iriscouch.com/raindrop/_design/docs/index.html

## Todo list

### Phase I - Categories, tags and docs

* Ability to add / upload documents to couch
* Ability to add attachments to documents
** The actual document (pdf/epub/.m4v/.webp/.webm/etc..)
** Cover art
* Doc viewers for popular types - html5 audio/video
* Review Doc types/tags model and define actual schemas for types?

### Phase II - Production urls, security and search

* Password protect data - only visible via people you share with
* Add rewrites for existing urls &amp; rest api urls
* Add backbone.js controller to manage urls (tab &amp; tag selects) / html5 pushState
* Setup demo.raindrop.io with couchdb, replicate app from iriscouch &amp; setup .git post-commit hook
* Search method - Should we have a search tab instead - would work better for usability?