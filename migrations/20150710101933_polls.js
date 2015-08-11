
exports.up = function(knex, Promise) {
    return knex.schema.createTable('polls', function (table) {
        table.increments('id').primary();
        //table.uuid('ext_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable();
        table.json('questions').notNullable();
        table.json('options');
        table.timestamp('start_date');
        table.timestamp('end_date');
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamps();
    })

};

exports.down = function(knex, Promise) {
  
};
