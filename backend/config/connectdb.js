import chalk from 'chalk';
import mongoose from 'mongoose';
import { systemLogs } from '../utils/logger.js';

const dbConnection = async () => {
  const connectionParams = {
    dbName: process.env.DB_NAME,
  };
  const connect = await mongoose.connect(
    process.env.MONGO_URI,
    connectionParams
  );
  console.log(
    `${chalk.blue.bold('MongoDB connected: ')} ${connect.connection.host}`
  );
  systemLogs.info(`MongoDB connected: ${connect.connection.host}`);
  try {
  } catch (error) {
    console.error(`${chalk.red.bold(`Error: ${error.message}`)}`);
    process.exit(1);
  }
};

export default dbConnection;
