import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import configData from "../config/db.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configData[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

let db = {};

const importModel = async (file) => {
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)));
  return modelModule.default(sequelize, Sequelize.DataTypes);
};

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

for (const file of modelFiles) {
  const model = await importModel(file);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.performTransaction = async (operations) => {
  const transaction = await sequelize.transaction();
  try {
    await operations(transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;