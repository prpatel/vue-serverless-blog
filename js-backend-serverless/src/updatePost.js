let Cloudant = require('@cloudant/cloudant');
let DBNAME = "blogdb";

function main(params, dbname) {

    if (params.__bx_creds) {
        if (params.__bx_creds.cloudantNoSQLDB) {
            console.log("cloudant info IAM info present");
            // params.__bx_creds.cloudantNoSQLDB.apikey
            // params.__bx_creds.cloudantNoSQLDB.host
        } else {

        }
    }

    // see if the id exists, if not return an error
    let id = params._id;
    if (!id) {
        console.log('Error occurred: no "id" specified updatePost()');
        return new Promise(function (resolve, reject) {
            reject({
                statusCode: 400,
                headers: {'Content-Type': 'application/json'},
                body: {
                    error: "id param is required"
                }
            })
        })
    }

    // load the db connector
    let cloudant = new Cloudant({
        account: params.__bx_creds.cloudantNoSQLDB.username,
        password: params.__bx_creds.cloudantNoSQLDB.password,
        plugins: 'promises'
    });
    let db = cloudant.db.use(dbname ? dbname : DBNAME);

    return new Promise(function (resolve, reject) {
        db.get(id, (err, existingDocument) => {
            if (err) {
                if (err.message == 'missing') {
                    console.log(`Document id ${id} does not exist.`, 'updatePost()');
                    resolve({
                        statusCode: 404,
                        headers: {'Content-Type': 'application/json'},
                        body: {
                            error: `Document id ${id} does not exist.`
                        }
                    });
                } else {
                    console.log('Error occurred: ' + err.message, 'updatePost()');
                    reject(err);
                }
            } else {
                // since we're not really expecting any concurrent users we just take the existing
                // _rev and assign it. This means two browsers concurrently trying to update the
                // same Post document will succeed! CAUTION
                let newData = {
                    _id: existingDocument._id,
                    _rev: existingDocument._rev,
                    author: params.author ? params.author : existingDocument.author,
                    title: params.title ? params.title : existingDocument.title,
                    image: params.image ? params.image : existingDocument.image,
                    tags: params.tags ? params.tags : existingDocument.tags,
                    published: params.published ? params.published : existingDocument.published,
                    body: params.body ? params.body : existingDocument.body
                }
                try {
                    db.insert(newData).then((result) => {
                        resolve({
                            headers: {'Content-Type': 'application/json'},
                            statusCode: 200,
                            body: result
                        });
                    })
                } catch (error) {
                    reject({
                        statusCode: 500,
                        headers: {'Content-Type': 'application/json'},
                        body: {
                            error: error
                        }
                    })
                }

            }
        })
    })


}

module.exports = main;
