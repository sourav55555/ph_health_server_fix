import { Server } from "http";
import app from "./app";
import { prisma } from "./app/lib/prisma";
import { seedSuperAdmin } from "./app/utils/seed";
import { envVars } from "./config/env";


const PORT = envVars.PORT || 3000;

let server: Server;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        await seedSuperAdmin();

        server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

//uncaught exception handler
process.on('uncaughtException', (error) => {
    console.log("uncaught exception detected, shutting down server", error)

    if (server) {
        server.close(() => {
            process.exit(1)
        })
        return;
    }

    process.exit(1)
})


process.on("unhandledRejection", (error) => {
    console.log("unhandled rejection detected... shutting down server", error)

    if (server) {
        server.close(() => {
            process.exit(1)
        })
        return;
    }

    process.exit(1)
})
process.on("SIGTERM", () => {
    console.log("sigterm signal received... shutting down server")
    
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})
process.on("SIGINT", () => {
    console.log("sigint signal received... shutting down server")
    
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

main();