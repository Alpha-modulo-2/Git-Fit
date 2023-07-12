require('dotenv').config()
import { App } from "./app";
import { connectToDatabase } from "./database/database";

const port = process.env.PORT || 8000;

try {
    connectToDatabase()
} catch (error) {
    console.log(error);
}

new App().server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});