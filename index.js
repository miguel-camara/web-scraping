import fetch from 'node-fetch';
import { load } from 'cheerio';
import pretty from 'pretty';

import fs from 'fs';

const url = 'https://www.itescam.edu.mx/portal/avisos.php';

const response = await fetch(url);

const body = await response.text();

// Para visualizar el HTML
// console.log( pretty(body) );

let $ = load(body);

const list = $(".panel-warning").children(".panel-body").children("h5");

const warnings = [];

list.each((index, element) => {

    const title = $(element).children("a").children("font").text();
    const link = $(element).children("a").attr("href");
    const split = $(element).children("small").text();
    
    const info = split.split(" || ");

    const warning = {
        title: title,
        staff: info[0].trim(),
        department: info[1].trim(),
        date: info[2].trim(),
        expiration: info[3].trim(),
        view: info[4].trim(),
        link: `https://www.itescam.edu.mx/portal/${link}`
    }
    
    warnings.push(warning);
});

// Guardar en un archivo
fs.writeFile('warnings.json', JSON.stringify(warnings, null,2), (err) => {

    if (err) throw err;
    console.log('The file has been saved!');
});