'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Deleted" to table "users"
 * addColumn "updatedAt" to table "users"
 * addColumn "createdAt" to table "users"
 * changeColumn "Admin" on table "users"
 *
 **/

var info = {
    "revision": 3,
    "name": "lastMigration",
    "created": "2019-06-02T04:45:40.522Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "users",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted"
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "updatedAt",
            {
                "type": Sequelize.DATE,
                "field": "updatedAt"
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "createdAt",
            {
                "type": Sequelize.DATE,
                "field": "createdAt"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "Admin",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Admin",
                "defaultValue": false,
                "allowNull": false
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
