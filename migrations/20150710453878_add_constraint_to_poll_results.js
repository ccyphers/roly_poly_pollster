
exports.up = function(knex, Promise) {
    return knex.raw("CREATE UNIQUE INDEX fingerprint_uuid_poll_id ON poll_results (fingerprint_uuid, poll_id)");
};

exports.down = function(knex, Promise) {
  
};
