import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MovieActor = sequelize.define(
  "MovieActor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Movies",
        key: "id",
      },
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Actors",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["movieId", "actorId"],
      },
    ],
  }
);

export default MovieActor;
