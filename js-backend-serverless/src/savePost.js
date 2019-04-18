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

    let document = {
        _id: new Date().getTime()+' ',
        author: params.author,
        title: params.title,
        image: params.image,
        tags: params.tags,
        published: params.published,
        body: params.body
    }

    return new Promise(function (resolve, reject) {
        try {
            let cloudant = new Cloudant({
                account: params.__bx_creds.cloudantNoSQLDB.username,
                password: params.__bx_creds.cloudantNoSQLDB.password,
                plugins: 'promises'
            });
            let db = cloudant.db.use(dbname ? dbname: DBNAME);
            db.insert(document).then((result) => {
                    resolve(result);
                })
            } catch (error) {
            reject({error: error})
        }

    })
}

module.exports = main;
