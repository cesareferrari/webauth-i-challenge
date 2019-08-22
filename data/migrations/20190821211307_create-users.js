
exports.up = function(knex) {
  return (knex.schema
    .createTable('users', t => {
      t.increments();
      t.string('name', 128).notNullable();
      t.string('password', 128).notNullable();
    })
  )
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
