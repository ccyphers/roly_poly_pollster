
exports.up = function(knex, Promise) {
    return knex.schema.createTable('poll_results', function (table) {
        table.increments('id').primary();
        table.string('fingerprint_uuid').references('uuid').inTable('fingerprints').notNullable(); // don't ask
        table.integer('question_number').notNullable();
        table.string('ip').notNullable();
        table.integer('poll_id').references('id').inTable('polls').notNullable();
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
  
};
