declare global {

    namespace Nodejs {
        interface ProcessEnv {
            DB_HOST: string;
            DB_DATABASE_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_PORT: number;
                }
    }
}

export {}