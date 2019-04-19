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

    let id = params._id;
    let rev = params._rev;
    if (!id || !rev) {
        console.log('Error occurred: no "id" and/or "rev" specified deletePost()');
        return new Promise(function (resolve, reject) {
            reject({
                statusCode: 400,
                headers: {'Content-Type': 'application/json'},
                body: {
                    error: "_id and _rev params are required"
                }
            })
        })
    }

    return new Promise(function (resolve, reject) {
        console.log("DELETEING POST")
        try {
            let cloudant = new Cloudant({
                account: params.__bx_creds.cloudantNoSQLDB.username,
                password: params.__bx_creds.cloudantNoSQLDB.password,
                plugins: 'promises'
            });
            let db = cloudant.db.use(dbname ? dbname: DBNAME);
            db.destroy(id, rev).then((result) => {
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

    })
}

module.exports = main;
