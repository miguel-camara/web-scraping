import fetch from 'node-fetch';
import { load } from 'cheerio';
import pretty from 'pretty';
import axios from 'axios';

import fs from 'fs';

const url = 'https://www.itescam.edu.mx/portal/avisos.php';

// Axios
const response = await axios.get(url, {
  responseType: 'arraybuffer',
  responseEncoding: 'binary',
});
const body = new TextDecoder('iso-8859-1').decode(response.data);

// Fetch API
// const response = await fetch(url);
// const buffer = await response.arrayBuffer();
// const body = new TextDecoder('iso-8859-1').decoder.decode(buffer);

let $ = load(body);

const list = $('.panel-warning').children('.panel-body').children('h5');

const warnings = [];

list.each((index, element) => {
  const title = $(element).children('a').children('font').text();
  const link = `https://www.itescam.edu.mx/portal/${$(element)
    .children('a')
    .attr('href')}`;
  const result = $(element)
    .children('small')
    .text()
    .split(' || ')
    .map(item => item.trim());

  // Destructuring
  let [staff, department, date, expiration, view] = result;

  const warning = {
    title,
    staff,
    department,
    date,
    expiration,
    view,
    link,
  };

  warnings.push(warning);
});

// Guardar en un archivo
fs.writeFile('warnings.json', JSON.stringify(warnings, null, 2), err => {
  if (err) throw err;
  console.log('The file has been saved!');
});
