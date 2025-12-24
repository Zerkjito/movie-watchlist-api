import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ htt });
});

router.post('/', (req, res) => {
  res.json({ message: 'hello' });
});

export default router;
