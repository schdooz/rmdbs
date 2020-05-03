const MongoClient = require('mongodb').MongoClient;

async function dropDbs(client) {
    var excludedDbs = ['admin', 'config', 'local'];
    var dropDbProcesses = [];
    var db;

    var dbNames = (await client.db().admin()
        .listDatabases({nameOnly: true}))
        .databases;

    for (const kvPair of dbNames) {
        if (excludedDbs.includes(kvPair.name)) {
            continue;
        }

        db = client.db(kvPair.name);
        dropDbProcesses.push(
            db.dropDatabase()
                .then(function () {console.log('dropped database ' + kvPair.name);})
                .catch(function (error) {
                    console.error('failed to drop database ' + kvPair.name + ' with error:\n' + error);
                }));
    };

    Promise.all(dropDbProcesses)
        .then(function() {console.log('success!');})
        .catch(function() {console.error('failure!');})
        .finally(function () {client.close();});
}

MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true})
    .then(function (client) {
        dropDbs(client);
    }).catch(function (error) {
        console.error('failed to connect to mongodb service with error:\n' + error);
    });

