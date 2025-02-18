# Solar System Simulator

An interactive 3D visualization of our solar system designed to help children learn about space in an engaging way.

![sample image](https://github.com/user-attachments/assets/fb78498a-a1b4-488b-abb1-97e2ad09c9b9)

## Overview

This project uses Three.js to create an immersive 3D simulation of the solar system, allowing users to explore and learn about planets, their orbits, and other celestial bodies in our solar system.

## Features

- 3D visualization of the solar system
- Interactive planet exploration
- Educational information about celestial bodies
- Realistic orbital mechanics
- Intuitive user controls

## Technologies Used

- Node.js
- Three.js for 3D graphics
- Docker for containerization

## Getting Started

### Prerequisites

- Docker
- Node.js (for local development)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Build and run with Docker:

```bash
docker build -t solar-system-simulator .
docker run -p 3000:3000 solar-system-simulator
```

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
solar-system-simulator/
├── public/              # Static files
│   ├── index.html      # Main HTML file
│   └── js/             # Client-side JavaScript
├── src/                # Server-side source code
├── Dockerfile          # Docker configuration
└── package.json        # Project dependencies
```

## License

This project is open source and available under the [MIT License](LICENSE).
