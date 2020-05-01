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
  table.boolean('developer').defaultTo(false);
  table.boolean('verified').defaultTo(false);
  table.string('email_token')
  table.boolean('disabled').defaultTo(false);
  table.timestamp('created_at')
}).createTable("oauth_applications", table => {
  table.bigIncrements('id');

  table.string('name');

  table.integer('owner_id', 11).unsigned()

  table.specificType('redirect_uris', 'text ARRAY');
  
  table.specificType('scopes', 'text ARRAY');

  table.boolean('disabled').defaultTo(false);
  table.timestamp('created_at');
}).createTable("applications_users", table => {
  table.bigIncrements('id');

  table.integer('user_id', 11).unsigned()


  table.integer('oauth_id', 11).unsigned()

  table.specificType('scopes', 'text ARRAY');

  table.timestamp('created_at');
}).createTable("packages", table => {
  table.bigIncrements('id');

  //developer of package
  table.integer('developer', 11).unsigned()
  .references('id')
  .inTable('accounts');

  //if the package is active and available for download/use
  table.boolean('active').defaultTo(false);
  
  //identifier of package
  table.string('identifier');

  //name of package
  table.string('name');

  //Description of package
  table.text('description');

  //images for depiction of package
  table.specificType('images', 'text ARRAY');

  //icon of package
  table.string('icon');

  //if the package is paid
  table.boolean("paid").defaultTo(false);

  //the cost of the package if it is paid
  table.decimal("price").defaultTo(0.0);

  //if the package is accepted or not
  table.boolean("pending").defaultTo(true);

  table.text("depiction");

  table.timestamp('created_at');
}).createTable("purchases", table => {
  table.bigIncrements('id');

  //id of user that made the purchase
  table.integer('user_id', 11).unsigned()
  .references('id')
  .inTable('accounts');
  
  //item reference of what was purchased
  table.integer('purchase_item', 11).unsigned()
  .references('id')
  .inTable('packages');

  //id of developer of item being purchased
  table.integer('developer_id', 11).unsigned()
  .references('id')
  .inTable('accounts');

  //the total that was taken off of the total cost
  table.decimal('discount').defaultTo(0);

  //if the purchase was gifted
  table.boolean('gifted').defaultTo(false);

  //if the gifting user is the developer so we dont payout to him if he gifted someone the package for free.
  table.boolean('gift_developer').defaultTo(false);

  //the id of the user that gifted the item if gifted is true
  table.integer('gifting_user').unsigned()
  .references('id')
  .inTable('accounts');

  //the id of the service used to pay for the item
  table.integer('processor_id');

  //if the purchase is complete or not
  table.boolean('complete').defaultTo(true);

  table.timestamp('created_at');
}).createTable("discounts", table => {
  table.bigIncrements('id');

  //id of developer
  table.integer('developer', 11).unsigned()
  .references('id')
  .inTable('accounts');

  //the discount code
  table.string("code");

  //if the discount should be applied as a percentage off or a static ammount off the purchase
  table.boolean('percentage').defaultTo(false);

  //ammount the discount is
  table.decimal('ammount').defaultTo(0);

  //this is if the discount will be applied to all of developers packages or not
  table.boolean('all').defaultTo(false);

  //packages that discount can be applied to. 
  table.specificType('packages', 'text ARRAY');

  //if discount is active and available to be used
  table.boolean('active').defaultTo(false);

  table.timestamp('created_at');
}).createTable("uploads", table => {
  table.bigIncrements("id");

  table.string("identifier");
}).createTable("files", table => {
  table.bigIncrements("files_id");

  //file upload
  table.integer('file', 11).unsigned();

  //the id of the package 
  table.string("package");

  //developer name
  table.string("developer");

  //description description
  table.string("desc");

  //package name
  table.string("name");

  //package icon
  table.string("icon");

  //version that this file is
  table.string("version");

  //check sums
  table.string("md5");
  table.string("sha1");
  table.string("sha256");

  //size
  table.bigInteger("size");

  //depends
  table.string("depends");

  //architecture
  table.string("architecture");

  //section
  table.string("section");

  //wether this version is enabled
  table.boolean("enabled");

  //wether package is accepted to the repo or not
  table.boolean("accepted");

  table.boolean("paid");

  table.string("change");
}).createTable("devices", table => {
  table.bigIncrements("device_id");

  //user assigned name for the device
  table.string("device_name");
  
  //the hash of the device's udid
  table.string("hash");
  
  //the model of the device
  table.string("model");

  //the id of the user that the device is linked to
  table.integer("user_id", 11).unsigned();

}).createTable("sessions", table => {
  table.bigIncrements("session_id");

  //hashed udid
  table.integer("device_id", 11).unsigned();

  //id of the user
  table.integer("user_id", 11).unsigned();

  //timestamp
  table.string("created_at");
}).createTable("transactions", table => {
  table.bigIncrements("transac_id");

  table.integer("user_id", 11).unsigned();
  table.integer("purchase_id", 11).unsigned();
}).then();

export default pg
