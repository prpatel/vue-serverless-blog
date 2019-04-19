let assert = require('assert');
let updatePost = require('../src/updatePost');

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

    let existingDocumentId = "1555551690527";
    let baseDocument = {
        _id: existingDocumentId,
        author: 'prpatel',
        title: 'TEST TITLE updatePost2',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/WOWAKK-Kukai-Alaskan-Klee-Kai.jpg',
        tags: 'test3,test4',
        published: true,
        body: 'TEST updatePost2 TEST header\n============'
    }

    before(function (done) {
        let createDB = new Promise(function (resolve, reject) {
            cloudant.db.list(testDBName).then((listDBs) => {
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

    describe('updatePost', function () {
        it('should updatePost', async function () {
            Object.assign(params, baseDocument);
            try {
                let result = updatePost(params, testDBName);
                // console.log('updatePost:', result);
                await result;
                result.then(data => {
                    // console.log('updatePost1:', data);
                    assert.equal(data.body.ok, true, "Update succeeded");
                })
            } catch (e) {
                console.log("Exception in updatePost: ", e)
                assert.fail(e)
            }
            ;
        });
    });
});


