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

    return new Promise(function (resolve, reject) {
        try {
            let cloudant = new Cloudant({
                account: params.__bx_creds.cloudantNoSQLDB.username,
                password: params.__bx_creds.cloudantNoSQLDB.password,
                plugins: 'promises'
            });
            let db = cloudant.db.use(dbname ? dbname: DBNAME);

            db.list({descending: true, include_docs:true, limit: limit, skip: skip}, function(err, result) {
                if (err) {
                    reject({error: err})
                } else {
                    resolve(result);
                }
                // console.log('result: %s', JSON.stringify(result, null, 4));
            });


        } catch (error) {
            reject({error: error})
        }
    })
}

module.exports = main;
