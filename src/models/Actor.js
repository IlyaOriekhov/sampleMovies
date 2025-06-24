import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Actor = sequelize.define(
  "Actor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
      },
    },
  },
  {
    indexes: [
      {
        fields: ["name"],
      },
    ],
  }
);

export default Actor;
