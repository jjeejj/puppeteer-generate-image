const PGI = require('../index.js');
const fs = require('fs')

async function genera(){
    let pgi = new PGI({path:'./test.png'});
    await pgi.init();
    await pgi.generateImage(fs.readFileSync('./index.ejs','utf8'));

    await pgi.destroy();
};

genera();

