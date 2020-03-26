require('dotenv').config()
const libpg = require('pg');
libpg.defaults.ssl = true;
libpg.defaults.rejectUnauthorized = false

const pg = require('knex')({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: true,
    rejectUnauthorized: false
  }
});

pg.schema.createTable("accounts", table => {
  table.increments('id')

  table.string('username')

  table.string('email')
  table.unique('email')

  table.string('password')

  table.boolean('is_admin').defaultTo(false)
  table.boolean('verified').defaultTo(false)
  table.string('email_token').defaultTo(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  table.boolean('disabled').defaultTo(false)
  table.timestamp('created_at').defaultTo(pg.fn.now())
}).then(() => {
  console.log('Creating accounts table')
})

export default pg