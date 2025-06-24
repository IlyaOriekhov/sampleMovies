import sequelize from "../config/database";

import Actor from "./Actor.js";
import User from "./User.js";
import Movie from "./Movie.js";
import MovieActor from "./MovieActor.js";

//associations

Movie.belongsToMany(Actor, {
  through: MovieActor,
  foreignKey: "movieId",
  otherKey: "actorId",
  as: "actors",
});

Actor.belongsToMany(Movie, {
  through: MovieActor,
  foreignKey: "actorId",
  otherKey: "movieId",
  as: "movies",
});

export { sequelize, User, Movie, Actor, MovieActor };
