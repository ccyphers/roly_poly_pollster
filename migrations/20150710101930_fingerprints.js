
exports.up = function(knex, Promise) {
    return knex.schema.createTable('fingerprints', function (table) {
        table.increments('id').primary();
        table.string('uuid').unique().notNullable();
        table.string('ip').notNullable();
        table.string('user_agent').notNullable();
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
  
};
