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

    let limit = params.limit;
    let skip = params.skip;
    let id = params._id;
    let cloudant = new Cloudant({
        account: params.__bx_creds.cloudantNoSQLDB.username,
        password: params.__bx_creds.cloudantNoSQLDB.password,
        plugins: 'promises'
    });
    let db = cloudant.db.use(dbname ? dbname: DBNAME);

    // if id is included that means we getting one Post, else several of them
    if (!id) {
        return new Promise(function (resolve, reject) {
            try {
                db.list({descending: true, include_docs:true, limit: limit, skip: skip}, function(err, result) {
                    if (err) {
                        reject({
                            statusCode: 500,
                            headers: {'Content-Type': 'application/json'},
                            body: {
                                error: error
                            }
                        })
                    } else {
                        resolve({
                            headers: {'Content-Type': 'application/json'},
                            statusCode: 200,
                            body: result
                        });
                    }
                    // console.log('result: %s', JSON.stringify(result, null, 4));
                });
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
    } else {
        return new Promise(function (resolve, reject) {
            try {
                db.get(id, function(err, result) {
                    if (err) {
                        reject({
                            statusCode: 500,
                            headers: {'Content-Type': 'application/json'},
                            body: {
                                error: error
                            }
                        })
                    } else {
                        resolve({
                            headers: {'Content-Type': 'application/json'},
                            statusCode: 200,
                            body: result
                        });
                    }
                    // console.log('result: %s', JSON.stringify(result, null, 4));
                });
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


}

module.exports = main;
