let assert = require('assert');
let deletePost = require('../src/deletePost');

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

describe('cloudant database functions', function () {
    return;

    let existingDocumentId;
    let existingDocumentRev;

    let baseDocument = {
        _id: new Date().getTime()+'',
        author: 'prpatel',
        title: 'TEST DESTROY ',
        image: 'dog.jpg',
        tags: 'test1,test2',
        published: true,
        body: 'TEST DESTROY   An h1 header\n============'
    }

    // for this test, create a document to destroy in the test
    before(function (done) {
            cloudant.db.list(testDBName).then((listDBs) => {
                    if (!listDBs.includes(testDBName)) {
                        cloudant.db.create(testDBName).then(() => {
                            cloudant.use(testDBName).insert(baseDocument).then((data) => {
                                // console.log("data", data)
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
                            // console.log("data", data)
                            existingDocumentId=data.id;
                            existingDocumentRev=data.rev;
                            done();
                        });
                    }
                }
            )
    });

    describe('deletePost', function () {
        it('should deletePost', async function () {
            Object.assign(params, {_id: existingDocumentId, _rev:existingDocumentRev});
            try {
                let result = deletePost(params, testDBName);
                // console.log('deletePost:', result);
                await result;
                result.then(data => {
                    // console.log('deletePost:', data);
                    assert.equal(data.body.ok, true, "deletePost succeeded");
                })
            } catch (e) {
                console.log("Exception in deletePost: ", e)
                assert.fail(e)
            }
            ;
        });
    });
});


