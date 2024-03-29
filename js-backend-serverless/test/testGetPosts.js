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
    let existingDocumentId;
    let existingDocumentRev;

    // return;
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


    // for this test, create a document to destroy in the test
    before(function (done) {
        cloudant.db.list(testDBName).then((listDBs) => {
                if (!listDBs.includes(testDBName)) {
                    cloudant.db.create(testDBName).then(() => {
                        cloudant.use(testDBName).insert(baseDocument).then((data) => {
                            console.log("data", data)
                            existingDocumentId=data.id;
                            existingDocumentRev=data.rev;
                            done();
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    console.log("db exists");
                    cloudant.use(testDBName).insert(baseDocument).then((data) => {
                        console.log("data", data)
                        existingDocumentId=data.id;
                        existingDocumentRev=data.rev;
                        done();
                    });
                }
            }
        )
    });

    describe('getPosts', function() {
        it('should return some posts', async function(){
            params.limit = 2;
            let result = getPosts(params, testDBName);
            await result;
            result.then(data => {
                assert.equal(data.body.rows.length, 2, "Limit param not working");
            } )

        });
    });

    describe('get ONE post', function() {
        it('should return 1 post', async function(){
            params._id = existingDocumentId;
            let result = getPosts(params, testDBName);
            await result;
            result.then(data => {
                assert.equal(data.body._id, existingDocumentId, "not able to fetch exactly one post by id");
            } )

        });
    });
});

