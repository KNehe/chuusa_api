import app from './app';

process.on("uncaughtException", err=>{
    console.log("UnCaught Exception Shutting down ...");
    console.log(err.name, err.message);
    process.exit(1);
});

const port = process.env.PORT || 3004;

const server = app.listen(port,()=>{
    console.log(`Server running on port ${port}...`);
});

process.on("unhandledRejection", err=>{
    console.log("UnhandledRejection Shutting down ...", err);
    server.close(()=>{
        process.exit(1);
    });
});