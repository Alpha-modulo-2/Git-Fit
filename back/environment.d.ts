declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HOST: string
            PORT: string
            DB_CONN_STRING: string
            JWTSECRET: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }