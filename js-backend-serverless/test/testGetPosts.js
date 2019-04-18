let assert = require('assert');
let getPosts =  require('../src/getPosts');

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

    return;
    let count = 1;
    let baseDocument = {
        _id: new Date().getTime()+'',
        author: 'prpatel',
        title: 'TEST TITLE ' + count,
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/WOWAKK-Kukai-Alaskan-Klee-Kai.jpg',
        tags: 'test1,test2',
        published: true,
        body: '   An h1 header\n============'
    }


    before(function(done) {
        let createDB = new Promise(function(resolve, reject) {
            cloudant.db.list(testDBName).then((listDBs)=> {
                    if (!listDBs.includes(testDBName)) {
                        cloudant.db.create(testDBName).then(() => {
                            cloudant.use(testDBName).insert(baseDocument).then((data) => {
                                resolve(data);
                                done();
                            });
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

    describe('getPosts', function() {
        it('should return some posts', async function(){
            params.limit = 2;
            let result = getPosts(params, testDBName);
            await result;
            result.then(data => {
                assert.equal(data.rows.length, 2, "Limit param not working");
            } )

        });
    });
});

