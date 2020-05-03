# rmdbs
Delete all local mongodb databases

A simple node.js script that deletes all local mongodb databases.

By default, 'admin', 'config' and 'local' databases are excluded.

Requires node.js >= 10.0.0.

## Installation
Clone the repo, then execute `npm install` in the new directory to install the node dependencies (yargs, MongoDB node driver).

## Usage examples
* `node rmdbs.js`

  Delete all databases, excluding 'admin', 'config' and 'local'.

* `node rmdbs.js --exclude account security`

  Exclude 'account' and 'security' databases from deletion. rmdbs will not delete anything if there is a provided name that does not correspond to an existing database.

* `node rmdbs.js --include local config`

  Include 'local' and 'config' databases in deleted databases.

* `node rmdbs.js --all`

  Delete all databases (except admin, which cannot be deleted).
