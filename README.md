# Stack
<img src="https://docs.google.com/drawings/d/1Pt9TELU1XJXlB3UUdzsYcTzOYz9N_3qoOBiZQI245Os/pub?w=909&amp;h=442">

# Componentes
## data_reader
Proceso node encargado de realizar las lecutras desde el dispositivo serie al que está conectado el arduino y guardar los datos crudos y procesados

## server
Servidor web, sirve el cliente web, escucha por cambios en la collection "signals" de mongo y envía los datos a todos los clientes subsciptos usando [socket.io](http://socket.io/).

## client
Cliente [AngularJS](https://angularjs.org/) que utiliza [socket.io](http://socket.io/) para escuchar por nuevos datos enviados desde el servidor, también informa errores y estado.

# Instrucciones
## Archivo de configuration
En **./config.json** debe definirse la url de la base node usada tanto por el proceso de lectura como por el proceso del servidor web.
Además se debe especificar el dispositivo serie al que se encuetra conectado el arduino para hacer las lecturas (solamente requerido por dicho proceso).

## Setup
### data_reader
<pre><code>
$ cd ./data_reader
$ npm install
</code></pre>

### server
<pre><code>
$ cd ./server
$ npm install
</code></pre>

### client
<pre><code>
$ cd ./client
$ npm install
$ bower install
</code></pre>

## Ejecución
Iniciar el proceso de lecturas
<pre><code>
$ cd ./data_reader
$ node run.js
</code></pre>
Iniciar el servidor y abrir un cliente (ambiente desarrollo)
<pre><code>
$ cd ./client
$ gulp start
</code></pre>
