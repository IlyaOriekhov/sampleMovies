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
        len: [1, 255],
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1888, // First movie
        max: new Date().getFullYear() + 10, // Allow future movies
      },
    },
    format: {
      type: DataTypes.ENUM("VHS", "DVD", "Blu-Ray"),
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
