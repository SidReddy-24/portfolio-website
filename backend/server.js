import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Initial Data
let projects = [
  {
    title: 'Immersive Scapes',
    category: 'WebGL Experiment',
    year: '2025',
    color: 'bg-red-500',
    url: 'https://github.com/example/immersive-scapes'
  },
  {
    title: 'Neon Drift',
    category: 'Brand Identity',
    year: '2024',
    color: 'bg-blue-500',
    url: 'https://github.com/example/neon-drift'
  },
  {
    title: 'Future Corp',
    category: 'Web Design',
    year: '2024',
    color: 'bg-green-500',
    url: 'https://github.com/example/future-corp'
  },
  {
    title: 'Echo Systems',
    category: 'Development',
    year: '2023',
    color: 'bg-purple-500',
    url: 'https://github.com/example/echo-systems'
  }
];

let hobbies = [
  { title: 'GLSL Shaders', date: '01.2025' },
  { title: 'Canvas Physics', date: '12.2024' },
  { title: 'React Fiber', date: '11.2024' },
  { title: 'Generative Art', date: '10.2024' },
];

let about = {
  bio: "I am a creative developer focused on crafting immersive digital experiences where code meets art.",
  description: "Specializing in high-fidelity motion and 3D web applications. Every project is an exploration of the boundary between the digital and the physical.",
  modules: ['React', 'WebGL', 'Framer Motion', 'Three.js', 'Node.js', 'Figma'],
  status: "Optimized",
  location: "India"
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state to the connecting client
  socket.emit('init_data', { projects, hobbies, about });

  // Handle updates from Admin
  socket.on('update_projects', (newProjects) => {
    console.log('Received update_projects', newProjects.length);
    projects = newProjects;
    io.emit('sync_projects', projects); // Broadcast to all clients
    console.log('Broadcasted sync_projects');
  });

  socket.on('update_hobbies', (newHobbies) => {
    console.log('Received update_hobbies', newHobbies.length);
    hobbies = newHobbies;
    io.emit('sync_hobbies', hobbies);
    console.log('Broadcasted sync_hobbies');
  });

  socket.on('update_about', (newAbout) => {
    console.log('Received update_about', newAbout.bio?.substring(0, 20));
    about = newAbout;
    io.emit('sync_about', about);
    console.log('Broadcasted sync_about');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
