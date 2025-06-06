import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { healthRouter } from './health.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { coursesRouter } from './modules/courses/courses.routes.js';
import { modulesRouter } from './modules/modules/modules.routes.js';
import { lessonsRouter } from './modules/lessons/lessons.routes.js'; // Import lesson router

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const apiV1Router = express.Router();
apiV1Router.use('/health', healthRouter);
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/users', usersRouter);
apiV1Router.use('/courses', coursesRouter);
apiV1Router.use('/modules', modulesRouter); // This now also handles /modules/:id/lessons
apiV1Router.use('/lessons', lessonsRouter);

app.use('/api/v1', apiV1Router);

app.use('/', (req, res) => res.status(200).json({ status: "success", message: "SynergyLearn API is live!" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ status: 'error', message: err.message || 'An internal server error occurred.' });
});

export { app };
