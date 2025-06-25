import fs from "fs/promises";
import { Movie, Actor, sequelize } from "../models/index.js";

class MovieService {
  async importMoviesFromFile(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      const movies = this.parseMoviesFile(fileContent);

      let imported = 0;
      const errors = [];

      for (const movieData of movies) {
        const transaction = await sequelize.transaction();

        try {
          // Check if movie already exists
          const existingMovie = await Movie.findOne({
            where: {
              title: movieData.title,
              year: movieData.year,
            },
            transaction,
          });

          if (existingMovie) {
            errors.push(
              `Movie "${movieData.title} (${movieData.year})" already exists`
            );
            await transaction.rollback();
            continue;
          }

          // Create movie
          const movie = await Movie.create(
            {
              title: movieData.title,
              year: movieData.year,
              format: movieData.format,
            },
            { transaction }
          );

          // Process actors
          const actorInstances = [];
          for (const actorName of movieData.actors) {
            const [actor] = await Actor.findOrCreate({
              where: { name: actorName },
              defaults: { name: actorName },
              transaction,
            });
            actorInstances.push(actor);
          }

          // Associate actors with movie
          await movie.addActors(actorInstances, { transaction });

          await transaction.commit();
          imported++;
        } catch (error) {
          await transaction.rollback();
          errors.push(`Error importing "${movieData.title}": ${error.message}`);
        }
      }

      // Clean up uploaded file
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }

      return { imported, errors };
    } catch (error) {
      console.error("Error in importMoviesFromFile:", error);
      throw error;
    }
  }

  parseMoviesFile(content) {
    const movies = [];
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    let currentMovie = {};

    for (const line of lines) {
      if (line.startsWith("Title:")) {
        // If we have a current movie, save it
        if (currentMovie.title) {
          movies.push(this.validateMovieData(currentMovie));
        }

        // Start new movie
        currentMovie = {
          title: line.replace("Title:", "").trim(),
        };
      } else if (line.startsWith("Release Year:")) {
        currentMovie.year = parseInt(line.replace("Release Year:", "").trim());
      } else if (line.startsWith("Format:")) {
        currentMovie.format = line.replace("Format:", "").trim();
      } else if (line.startsWith("Stars:")) {
        const actorsString = line.replace("Stars:", "").trim();
        currentMovie.actors = actorsString
          .split(",")
          .map((actor) => actor.trim());
      }
    }

    // Don't forget the last movie
    if (currentMovie.title) {
      movies.push(this.validateMovieData(currentMovie));
    }

    return movies;
  }

  validateMovieData(movieData) {
    // Validate required fields
    if (!movieData.title) {
      throw new Error("Title is required");
    }

    if (!movieData.year || !Number.isInteger(movieData.year)) {
      throw new Error("Valid year is required");
    }

    if (
      !movieData.format ||
      !["VHS", "DVD", "Blu-Ray"].includes(movieData.format)
    ) {
      throw new Error("Format must be VHS, DVD, or Blu-Ray");
    }

    if (
      !movieData.actors ||
      !Array.isArray(movieData.actors) ||
      movieData.actors.length === 0
    ) {
      throw new Error("At least one actor is required");
    }

    return movieData;
  }
}

export default new MovieService();
