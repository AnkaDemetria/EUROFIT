const express = require('express');
const mysql = require('mysql');

const app = express();

const port = process.env.PORT || 3000;//je lui dis que le port est soit égal à 3000 soit(||) au port dans le fichier
//cors permet de faire de notre API une ressource distante capable d etre utilisée depuis n importe quel serveur donc on l installe dans le terminal avec npm i cors

app.use(express.json());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    port: 3306,
    database:'euro_fit'
});



module.exports = {app, port, connection};// on va exporter les données puiqu on ne les utilise pas