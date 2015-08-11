
exports.up = function(knex, Promise) {
    return knex.raw("CREATE UNIQUE INDEX fingerprints_uuid_ip ON fingerprints (uuid, ip)");
};

exports.down = function(knex, Promise) {
  
};
