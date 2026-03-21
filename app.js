const express = require('express');
const redis = require('redis');

const app = express();
app.use(express.json());

// Connect to Redis
const redisClient = redis.createClient({
  url: 'redis://redis:6379'
});

redisClient.connect().catch(console.error);

// Store tasks in Redis
let taskIdCounter = 1;

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await redisClient.get('tasks');
    res.json(JSON.parse(tasks) || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// POST a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const tasks = JSON.parse(await redisClient.get('tasks')) || [];
    
    const newTask = {
      id: taskIdCounter++,
      title: title,
      done: false
    };
    
    tasks.push(newTask);
    await redisClient.set('tasks', JSON.stringify(tasks));
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Task API running on port ${PORT}`);
});      