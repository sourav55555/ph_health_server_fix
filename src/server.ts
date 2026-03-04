import app from "./app";
import { prisma } from "./app/lib/prisma";
import { envVars } from "./config/env";


const PORT = envVars.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();