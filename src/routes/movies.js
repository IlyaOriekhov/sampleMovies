import express from "express";
import multer from "multer";
import { Op } from "sequelize";
import { Movie, Actor, sequelize } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validation.js";
import {
  movieCreateSchema,
  movieQuerySchema,
  movieIdSchema,
} from "../validation/schemas.js";
import { badRequest, notFound } from "../utils/error.js";
import movieService from "../services/movieService.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.use(authenticateToken);

router.post("/", validateBody(movieCreateSchema), async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, year, format, actors } = req.body;

    const movie = await Movie.create(
      {
        title: title.trim(),
        year,
        format,
      },
      { transaction }
    );

    const actorInstances = [];
    for (const actorName of actors) {
      const trimmedName = actorName.trim();
      const [actor] = await Actor.findOrCreate({
        where: { name: trimmedName },
        defaults: { name: trimmedName },
        transaction,
      });
      actorInstances.push(actor);
    }

    await movie.addActors(actorInstances, { transaction });
    await transaction.commit();

    const movieWithActors = await Movie.findByPk(movie.id, {
      include: [
        {
          model: Actor,
          as: "actors",
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      data: movieWithActors,
      status: 1,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating movie:", error);
    next(error);
  }
});

router.get("/", validateQuery(movieQuerySchema), async (req, res, next) => {
  try {
    const { title, actor, sort, order } = req.query;

    let whereClause = {};
    let includeClause = [
      {
        model: Actor,
        as: "actors",
        through: { attributes: [] },
      },
    ];

    if (title) {
      whereClause.title = {
        [Op.like]: `%${title}%`,
      };
    }

    if (actor) {
      includeClause[0].where = {
        name: {
          [Op.like]: `%${actor}%`,
        },
      };
      includeClause[0].required = true;
    }

    const movies = await Movie.findAll({
      where: whereClause,
      include: includeClause,
      order: [[sort, order]],
    });

    res.status(200).json({
      data: movies,
      status: 1,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);
  }
});

router.get("/:id", validateParams(movieIdSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id, {
      include: [
        {
          model: Actor,
          as: "actors",
          through: { attributes: [] },
        },
      ],
    });

    if (!movie) {
      return next(notFound("Movie not found"));
    }

    res.status(200).json({
      data: movie,
      status: 1,
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    next(error);
  }
});

router.delete("/:id", validateParams(movieIdSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return next(notFound("Movie not found"));
    }

    await movie.destroy();

    res.status(200).json({
      status: 1,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    next(error);
  }
});

router.post("/import", upload.single("movies"), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(badRequest("No file uploaded"));
    }

    const result = await movieService.importMoviesFromFile(req.file.path);

    res.status(200).json({
      status: 1,
      message: `Successfully imported ${result.imported} movies`,
      data: {
        imported: result.imported,
        errors: result.errors,
      },
    });
  } catch (error) {
    console.error("Error importing movies:", error);
    next(error);
  }
});

export default router;
