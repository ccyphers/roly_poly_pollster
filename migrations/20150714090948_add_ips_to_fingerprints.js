
exports.up = function(knex, Promise) {
    return knex.schema.table('fingerprints', function (table) {
        table.json('ips')
    });
};

exports.down = function(knex, Promise) {
  
};
