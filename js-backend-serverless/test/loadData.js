let assert = require('assert');
let getPosts = require('../src/getPosts');

let testDBName = "blogdbtest";
let Cloudant = require('@cloudant/cloudant');
// construct the same IAM param JSON that the
// cloud fn expects
let params = {
    __bx_creds: {
        cloudantNoSQLDB: {
            username: process.env.CLOUDANT_USERNAME,
            password: process.env.CLOUDANT_PASSWORD
        }
    }
}
let cloudant = new Cloudant({
    account: params.__bx_creds.cloudantNoSQLDB.username,
    password: params.__bx_creds.cloudantNoSQLDB.password,
    plugins: 'promises'
});


async function loadData() {
    for (let i = 0; i < 8; i++) {
        let baseDocument = {
            _id: new Date().getTime() + '',
            author: 'prpatel',
            title: 'TEST TITLE ' + i,
            image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/WOWAKK-Kukai-Alaskan-Klee-Kai.jpg',
            tags: 'test1,test2',
            published: true,
            body: 'TEST' + i + '   An h1 header\n============'
        }
        cloudant.use(testDBName).insert(baseDocument)
        await sleep(10);
    }
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

// loadData();

