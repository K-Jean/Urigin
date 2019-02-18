module.exports = {
    development: {
        username: "postgres",
        password: "example",
        database: "postgres",
        schema: "public",
        host: "localhost",
        dialect: 'postgres',
        port: 5432
    },
    test: {
        username: "postgres",
        password: null,
        database: "urigin",
        schema: "public",
        host: "localhost",
        dialect: 'postgres',
        port: 5432
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOSTNAME,
        dialect: 'postgres'
    }
};