var MongoClient = require('mongodb').MongoClient;
var argv = require('yargs')
    .alias('all', 'a')
    .boolean('all')
    .alias('include', 'i')
    .array('include')
    .alias('exclude', 'e')
    .array('exclude')
    .argv;

async function dropDbs(client) {
    var excludedDbs = ['admin', 'config', 'local'];
    var dropDbProcesses = [];

    var dbNames = (await client.db().admin()
        .listDatabases({nameOnly: true}))
        .databases
        .map(function (kvPair) {return kvPair.name;});

    if (argv.all) {
        excludedDbs = ['admin'];
    }

    if (argv.include) {
        for (let name of argv.include) {
            let i;
            if ((i = excludedDbs.indexOf(name)) > -1) {
                excludedDbs.splice(i, 1);
            }
        }
    }

    if (argv.exclude) {
        for (let name of argv.exclude) {
            if (!dbNames.includes(name)) {
                throw name + ' is not a name of a database. Did you misspell the db?';
            }
        }

        for (let name of argv.exclude) {
            if (!excludedDbs.includes(name)) {
                excludedDbs.push(name);
            }
        }
    }

    for (let name of dbNames) {
        let db;

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
    }

    Promise.all(dropDbProcesses)
        .then(function () {console.log('success!');})
        .catch(function () {console.error('failure!');})
        .finally(function () {client.close();});
}

MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true})
    .then(function (client) {
        dropDbs(client).catch(function (error) {
            console.error('dropDbs failed with error:\n' + error);
            client.close();
        })
    }).catch(function (error) {
        console.error('failed to connect to mongodb service with error:\n' + error);
    });

