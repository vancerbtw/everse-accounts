"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pg_1 = __importDefault(require("pg"));
var knex_1 = __importDefault(require("knex"));
var dotenv_1 = require("dotenv");
dotenv_1.config();
pg_1["default"].defaults.ssl = true;
var pg = knex_1["default"]({
    client: 'pg',
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT),
        ssl: true
    }
});
pg.schema.createTable("accounts", function (table) {
    table.increments('id');
    table.string('username');
    table.string('email');
    table.unique(['email']);
    table.string('password');
    table.boolean('is_admin').defaultTo(false);
    table.boolean('verified').defaultTo(false);
    table.string('email_token').defaultTo(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    table.boolean('disabled').defaultTo(false);
    table.timestamp('created_at').defaultTo(pg.fn.now());
}).then(function () {
    console.log('Creating accounts table');
});
exports["default"] = pg;
