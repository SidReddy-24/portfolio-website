import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();

// Robust CORS configuration
const corsOptions = {
  origin: "*", // For development; in production, use specific frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

// Helper functions for data persistence
const loadData = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  return null;
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data saved to db.json');
  } catch (err) {
    console.error('Error saving data:', err);
  }
};

// Initialize Data from DB or Defaults
const defaultData = {
  projects: [
    { title: 'Immersive Scapes', category: 'WebGL Experiment', year: '2025', color: 'bg-red-500', url: 'https://github.com/example/immersive-scapes' },
    { title: 'Neon Drift', category: 'Brand Identity', year: '2024', color: 'bg-blue-500', url: 'https://github.com/example/neon-drift' },
    { title: 'Future Corp', category: 'Web Design', year: '2024', color: 'bg-green-500', url: 'https://github.com/example/future-corp' },
    { title: 'Echo Systems', category: 'Development', year: '2023', color: 'bg-purple-500', url: 'https://github.com/example/echo-systems' }
  ],
  hobbies: [
    { title: 'GLSL Shaders', date: '01.2025' },
    { title: 'Canvas Physics', date: '12.2024' },
    { title: 'React Fiber', date: '11.2024' },
    { title: 'Generative Art', date: '10.2024' },
  ],
  about: {
    bio: "I am a creative developer focused on crafting immersive digital experiences where code meets art.",
    description: "Specializing in high-fidelity motion and 3D web applications. Every project is an exploration of the boundary between the digital and the physical.",
    modules: ['React', 'WebGL', 'Framer Motion', 'Three.js', 'Node.js', 'Figma'],
    status: "Optimized",
    location: "India"
  }
};

let db = loadData() || defaultData;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state
  socket.emit('init_data', db);

  // Handle updates from Admin
  socket.on('update_projects', (newProjects) => {
    console.log('Received update_projects', newProjects.length);
    db.projects = newProjects;
    saveData(db);
    io.emit('sync_projects', db.projects);
  });

  socket.on('update_hobbies', (newHobbies) => {
    console.log('Received update_hobbies', newHobbies.length);
    db.hobbies = newHobbies;
    saveData(db);
    io.emit('sync_hobbies', db.hobbies);
  });

  socket.on('update_about', (newAbout) => {
    console.log('Received update_about', newAbout.bio?.substring(0, 20));
    db.about = newAbout;
    saveData(db);
    io.emit('sync_about', db.about);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

