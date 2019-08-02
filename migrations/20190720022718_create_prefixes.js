const tableName = "prefixes";
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable(tableName, function(table) {
            table.uuid("id").notNullable().primary();
            table.string("prefix").unique().notNullable();
            table.json("rules");
            table.timestamps(true, true);
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists(tableName)
    ]);
};
