import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} from '../controllers/favorites.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/add', authenticate, addFavorite);
router.post('/remove', authenticate, removeFavorite);
router.get('/', authenticate, getFavorites);
router.get('/check', authenticate, checkFavorite);

export default router;
