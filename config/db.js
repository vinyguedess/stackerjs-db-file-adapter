const { Config } = require("stackerjs-utils");

module.exports = {
    host: Config.env("DB_HOST"),
    name: Config.env("DB_NAME")
};