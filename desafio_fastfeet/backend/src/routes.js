// Modules
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DelivererController from './app/controllers/DelivererController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

// Routes where token isn't needed
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Use global token validator
routes.use(authMiddleware);

// Routes where token is needed
routes.put('/users', UserController.update);

// File upload route
routes.post('/files', upload.single('file'), FileController.store);

// Recipient routes
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

// Deliverer's routes
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:deliverymanId', DeliverymanController.update);
routes.delete('/deliveryman/:deliverymanId', DeliverymanController.delete);

// Delieveries routes
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.delete('/deliveries/:deliveryId', DeliveryController.delete);

routes.get('/deliveryman/:deliverymanId/deliveries', DelivererController.index);

routes.put(
  '/deliveryman/:deliverymanId/delivery/:deliveryId',
  DelivererController.update
);

export default routes;
