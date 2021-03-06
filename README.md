[![Travis](https://img.shields.io/travis/vinyguedess/stackerjs-db-file-adapter.svg)](https://travis-ci.org/vinyguedess/stackerjs-db-file-adapter)
[![Maintainability](https://api.codeclimate.com/v1/badges/5ad822c89c7a3de70631/maintainability)](https://codeclimate.com/github/vinyguedess/stackerjs-db-file-adapter/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5ad822c89c7a3de70631/test_coverage)](https://codeclimate.com/github/vinyguedess/stackerjs-db-file-adapter/test_coverage)
[![Dependencies](https://img.shields.io/david/vinyguedess/stackerjs-db-file-adapter.svg)](https://david-dm.org/vinygfuedess/stackerjs-db-file-adapter)
[![npm](https://img.shields.io/npm/dt/stackerjs-db-file-adapter.svg)](https://www.npmjs.com/package/stackerjs-db-file-adapter)

# StackerJS DB: File Adapter
An adapter for file system database.

## Installation
```bash
npm install --save stackerjs-db-file-adapter
```

## Usage
You need to create a config folder with a file called db.js, as follows:
```javascript
// config/db.js

module.exports = {
    host: "path/to/host",
    name: "database_name"
}
```
Now you're set to write your queries.