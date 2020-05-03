var MongoClient = require('mongodb').MongoClient;
var argv = require('yargs')
    .alias('include', 'i')
    .array('include')
    .argv;

async function dropDbs(client) {
    var excludedDbs = ['admin', 'config', 'local'];
    var dropDbProcesses = [];
    var db;

    var dbNames = (await client.db().admin()
        .listDatabases({nameOnly: true}))
        .databases
        .map(function (kvPair) {return kvPair.name;});

    if (argv.include) {
        for (let name of argv.include) {
            let i;
            if ((i = excludedDbs.indexOf(name)) > -1) {
                excludedDbs.splice(i, 1);
            }
        }
    }

    for (let name of dbNames) {
        if (excludedDbs.includes(name)) {
            continue;
        }

        db = client.db(name);
        dropDbProcesses.push(
            db.dropDatabase()
                .then(function () {console.log('dropped database ' + name);})
                .catch(function (error) {
                    console.error('failed to drop database ' + name + ' with error:\n' + error);
                }));
    };

    Promise.all(dropDbProcesses)
        .then(function () {console.log('success!');})
        .catch(function () {console.error('failure!');})
        .finally(function () {client.close();});
}

MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true})
    .then(function (client) {
        dropDbs(client);
    }).catch(function (error) {
        console.error('failed to connect to mongodb service with error:\n' + error);
    });

