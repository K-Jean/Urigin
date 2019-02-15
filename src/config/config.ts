module.exports = {
    development: {
        username: "postgres",
        password: "example",
        database: "postgres",
        host: "localhost",
        dialect: 'postgres',
        port: 5432
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'postgres'
    }
};