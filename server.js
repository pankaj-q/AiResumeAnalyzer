import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { parseResume } from './utils/resumeParser.js';
import { calculateATSScore } from './utils/atsScorer.js';
import { getRedisClient } from './utils/redis.js';
import logger from './utils/logger.js';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// ── Security & middleware ──────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '1mb' }));
const staticDir = isProd ? 'client/dist' : 'public';
app.use(express.static(staticDir, { maxAge: isProd ? '7d' : 0 }));

// ── Rate limiters ──────────────────────────────────────────────
const redisClient = getRedisClient();

function makeStore(prefix) {
  return redisClient
    ? new RedisStore({ prefix, sendCommand: (...args) => redisClient.call(...args) })
    : undefined;
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:global:'),
  handler: (_, res) => res.status(429).json({ error: 'Too many requests. Try again later.' }),
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:api:'),
  message: { error: 'Rate limit exceeded. Max 10 analyses per hour.' },
});

app.use(globalLimiter);

// ── File upload ────────────────────────────────────────────────
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ['.pdf', '.docx'].includes(ext));
  },
});

// ── Routes ─────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), redis: !!redisClient });
});

app.post('/api/analyze', apiLimiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Upload a PDF or DOCX resume' });
    if (!req.body.jobDescription) return res.status(400).json({ error: 'Provide a job description' });

    const parsed = await parseResume(req.file.path, req.file.originalname);
    const result = await calculateATSScore(parsed, req.body.jobDescription);

    logger.info(`Analysis complete — ATS: ${result.atsScore} — file: ${req.file.originalname}`);
    res.json(result);
  } catch (err) {
    logger.error('Analysis failed', err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Analysis failed' });
  }
});

// ── Error handler ──────────────────────────────────────────────
app.use((err, _, res, __) => {
  logger.error('Unhandled error', err);
  res.status(err.status || 500).json({ error: isProd ? 'Internal server error' : err.message });
});

// ── Start ──────────────────────────────────────────────────────
const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT} [${isProd ? 'prod' : 'dev'}]`));

function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    redisClient?.quit();
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
