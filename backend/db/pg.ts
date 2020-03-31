import libpg from "pg";
import knex from "knex";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
libpg.defaults.ssl = true;
const pg = knex({
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

pg.schema.createTable("accounts", table => {
  table.increments('id');

  table.string('username');

  table.string('email');
  table.unique(['email']);

  table.string('password');

  table.boolean('is_admin').defaultTo(false);
  table.boolean('verified').defaultTo(false);
  table.string('email_token').defaultTo(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  table.boolean('disabled').defaultTo(false);
  table.timestamp('created_at').defaultTo(pg.fn.now())
}).then(() => {
  console.log('Creating accounts table');
});

pg.schema.createTable("oauth_applications", table => {
  table.bigIncrements('id');

  table.string('name');

  table.foreign('owner_id')
  .references('id')
  .inTable('accounts');

  table.specificType('redirect_uris', 'text ARRAY');
  
  table.specificType('scopes', 'text ARRAY');

  table.boolean('disabled').defaultTo(false);
  table.timestamp('created_at').defaultTo(pg.fn.now());
}).then(() => {
  console.log('Creating oauth_applications table');
});

pg.schema.createTable("applications_users", table => {
  table.bigIncrements('id');

  table.integer('user_id', 11).unsigned()
  .references('id')
  .inTable('accounts');


  table.integer('oauth_id', 11).unsigned()
  .references('id')
  .inTable('oauth_applications');

  table.specificType('scopes', 'text ARRAY');

  table.timestamp('created_at').defaultTo(pg.fn.now());
}).then(() => {
  console.log('Creating oauth_applications table');
});

export default pg
