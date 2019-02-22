module.exports = {
    //Config de l'environnement de developpement
    development: {
        username: "postgres",
        password: "example",
        database: "postgres",
        host: "localhost",
        dialect: 'postgres',
        port: 5432,
        private: "test/ressources/private.key",
        public: "test/ressources/public.key"
    },
    //Config de l'environnement de test
    test: {
        username: "postgres",
        password: null,
        database: "urigin",
        host: "localhost",
        dialect: 'postgres',
        port: 5432,
        private: "test/ressources/private.key",
        public: "test/ressources/public.key"
    },
    //Config de l'environnement de production
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOSTNAME,
        private: process.env.PRIVATE_KEY,
        public: process.env.PUBLIC_KEY,
        dialect: 'postgres'
    }
};