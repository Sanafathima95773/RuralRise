import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        return true;
    }
    catch(error) {
        console.error(`error connecting to MongoDB : ${error.message}`);
        // Don't exit the process in development — allow the server to run so frontend
        // requests can be debugged (they may still fail when hitting DB-dependent routes).
        return false;
    }
}

export default connectMongoDB;