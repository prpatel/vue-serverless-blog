let assert = require('assert');
let savePost =  require('../src/savePost');

let testDBName = "blogdbtest";
let Cloudant = require('@cloudant/cloudant');
// construct the same IAM param JSON that the
// cloud fn expects
let params = {
    __bx_creds : {
        cloudantNoSQLDB : {
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

describe('cloudant database functions', function() {
    let count = 1;

    let baseDocument = {
        author: 'prpatel',
        title: 'TEST TITLE savePost',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/WOWAKK-Kukai-Alaskan-Klee-Kai.jpg',
        tags: 'test3,test4',
        published: true,
        body: 'TEST savePost TEST header\n============'
    }

    console.log(JSON.stringify(baseDocument));

    before(function(done) {
        let createDB = new Promise(function(resolve, reject) {
            cloudant.db.list(testDBName).then((listDBs)=> {
                    if (!listDBs.includes(testDBName)) {
                        cloudant.db.create(testDBName).then(() => {
                                resolve(data);
                                done();
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        resolve("db exists");
                        done();
                    }
                }
            )
        });
    });

    describe('savePost', function() {
        it('should save post', async function(){
            Object.assign( params, baseDocument );
            let result = savePost(params, testDBName);
            await result;
            result.then(data => {
                console.log('savePost:', data)
                // assert.equal(data.rows, 2, "Limit param not working");
            } )

        });
    });
});


{"author":"prpatel","title":"TEST WEB TITLE savePost”,"image":"https://upload.wikimedia.org/wikipedia/commons/5/54/WOWAKK-Kukai-Alaskan-Klee-Kai.jpg","tags":"test3,test4","published":true,"body":”TEST  WEB savePost TEST header\n============"}'

