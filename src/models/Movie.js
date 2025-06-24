import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1888, //first film
        max: new Date().getFullYear() + 10, // for future
      },
    },
    format: {
      type: DataTypes.ENUM("VHS", "DVD", "Blu-ray"),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["title"],
      },
      {
        fields: ["year"],
      },
    ],
  }
);

export default Movie;
