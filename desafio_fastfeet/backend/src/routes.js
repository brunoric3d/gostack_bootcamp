// Modules
import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Routes where token isn't needed
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Use global token validator
routes.use(authMiddleware);

// Routes where token is needed
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

export default routes;
