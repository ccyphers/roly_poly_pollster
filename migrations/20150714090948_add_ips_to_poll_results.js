
exports.up = function(knex, Promise) {
    return knex.schema.table('poll_results', function (table) {
        //table.json('ips')
    });
};

exports.down = function(knex, Promise) {
  
};
