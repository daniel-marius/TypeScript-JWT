import mongoose from "mongoose";

const dbConnection = async () => {
  const connectOptions: object = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  };

  const dbConnectUri: string = process.env.MONGODB_URI || "DB URI...";

  mongoose.Promise = global.Promise;

  try {
    const currentConnection = await mongoose.connect(
      dbConnectUri,
      connectOptions
    );

    console.log(
      `Connected to MongoDB Atlas Cluster: ${currentConnection.connection.host}`
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

export default dbConnection;
