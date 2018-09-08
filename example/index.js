const PGI = require('../index.js');
const fs = require('fs');
const path = require('path')

async function genera(){
    let pgi = new PGI({path:'./test.png',viewport:{width:750, height:1335}});
    await pgi.init();
    await pgi.generateImage(fs.readFileSync('./index.ejs','utf8'),{code:'SFGHRS',img:'file:///Users/jiang/Project/puppeteer-generate-image/example/code.png'});

    await pgi.destroy();
};

genera();

