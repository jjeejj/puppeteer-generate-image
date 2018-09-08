const PGI = require('../index.js');
const fs = require('fs');
const path = require('path')

async function genera(){
    let pgi = new PGI({path:'./test.png',viewport:{width:750, height:1335}});
    await pgi.init();
    await pgi.generateImage(path.join(__dirname,'./index.ejs'),{code:'SFGHRS',img:'./code.png'});

    await pgi.destroy();
};

genera();

