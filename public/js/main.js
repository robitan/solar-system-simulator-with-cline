import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Planet data with real relative sizes (scaled down) and orbital periods
const PLANET_DATA = {
    mercury: {
        radius: 0.383,
        color: 0x808080,
        orbitRadius: 10,
        orbitPeriod: 0.24,
        rotationPeriod: 58.6,
        description: "Mercury is the smallest and innermost planet in the Solar System. It's also the fastest, orbiting the Sun every 88 Earth days!"
    },
    venus: {
        radius: 0.949,
        color: 0xffd700,
        orbitRadius: 15,
        orbitPeriod: 0.615,
        rotationPeriod: -243,
        description: "Venus is often called Earth's sister planet because of their similar size. It rotates backwards compared to most other planets!"
    },
    earth: {
        radius: 1,
        color: 0x0077be,
        orbitRadius: 20,
        orbitPeriod: 1,
        rotationPeriod: 1,
        description: "Earth is our home planet! It's the only planet we know of that has liquid water on its surface and supports life."
    },
    mars: {
        radius: 0.532,
        color: 0xff4500,
        orbitRadius: 25,
        orbitPeriod: 1.88,
        rotationPeriod: 1.03,
        description: "Mars is known as the Red Planet because of its reddish color. It has the largest volcano in the solar system!"
    },
    jupiter: {
        radius: 11.209,
        color: 0xffa500,
        orbitRadius: 35,
        orbitPeriod: 11.86,
        rotationPeriod: 0.41,
        description: "Jupiter is the largest planet in our solar system! Its Great Red Spot is a giant storm that has been raging for hundreds of years."
    },
    saturn: {
        radius: 9.449,
        color: 0xffd700,
        orbitRadius: 45,
        orbitPeriod: 29.46,
        rotationPeriod: 0.44,
        description: "Saturn is famous for its beautiful rings made of ice and rock. It's also the least dense planet - it could float in water!"
    },
    uranus: {
        radius: 4.007,
        color: 0x00ffff,
        orbitRadius: 55,
        orbitPeriod: 84.01,
        rotationPeriod: -0.72,
        description: "Uranus is tilted on its side! This means its seasons are extreme, with parts of the planet having 42 years of sunlight followed by 42 years of darkness."
    },
    neptune: {
        radius: 3.883,
        color: 0x4169e1,
        orbitRadius: 65,
        orbitPeriod: 164.79,
        rotationPeriod: 0.67,
        description: "Neptune has the strongest winds in the solar system, with speeds reaching 1,200 mph! It's the most distant planet from the Sun."
    }
};

class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.planets = new Map();
        this.clock = new THREE.Clock();
        this.timeScale = 0.1;
        this.orbitsVisible = true;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
        this.createLights();
        this.createSun();
        this.createPlanets();
        this.createStarfield();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(50, 30, 50);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 2, 300);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1,
            metalness: 0,
            roughness: 1
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        const sunGlow = new THREE.PointLight(0xffff00, 1.5, 100);
        this.sun.add(sunGlow);
    }

    createPlanets() {
        for (const [name, data] of Object.entries(PLANET_DATA)) {
            const radius = data.radius * 0.5;
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: data.color });
            const planet = new THREE.Mesh(geometry, material);
            planet.userData.name = name;

            const orbitGeometry = new THREE.RingGeometry(data.orbitRadius - 0.1, data.orbitRadius + 0.1, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x666666,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;

            this.scene.add(orbit);
            this.scene.add(planet);

            this.planets.set(name, {
                mesh: planet,
                orbit: orbit,
                data: data,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1
        });

        const stars = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(1000);
            const y = THREE.MathUtils.randFloatSpread(1000);
            const z = THREE.MathUtils.randFloatSpread(1000);
            stars.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
        const starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starfield);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 200;
    }

    setupEventListeners() {
        // Mouse click for planet selection
        window.addEventListener('click', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.checkPlanetClick();
        });

        // Time scale slider
        const timeScaleSlider = document.getElementById('timeScale');
        timeScaleSlider.addEventListener('input', (event) => {
            this.timeScale = parseFloat(event.target.value);
        });

        // Reset camera button
        const resetButton = document.getElementById('resetCamera');
        resetButton.addEventListener('click', () => {
            this.camera.position.set(50, 30, 50);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });

        // Toggle orbits button
        const toggleOrbitsButton = document.getElementById('toggleOrbits');
        toggleOrbitsButton.addEventListener('click', () => {
            this.orbitsVisible = !this.orbitsVisible;
            for (const planet of this.planets.values()) {
                planet.orbit.visible = this.orbitsVisible;
            }
        });
    }

    checkPlanetClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const planetMeshes = Array.from(this.planets.values()).map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);

        const planetInfo = document.getElementById('planetInfo');
        const planetName = document.getElementById('planetName');
        const planetDescription = document.getElementById('planetDescription');

        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            const name = clickedPlanet.userData.name;
            const data = PLANET_DATA[name];

            planetName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            planetDescription.textContent = data.description;
            planetInfo.style.display = 'block';
        } else {
            planetInfo.style.display = 'none';
        }
    }

    updatePlanets() {
        const deltaTime = this.clock.getDelta() * this.timeScale;

        for (const [name, planet] of this.planets) {
            planet.angle += (2 * Math.PI * deltaTime) / planet.data.orbitPeriod;

            const x = Math.cos(planet.angle) * planet.data.orbitRadius;
            const z = Math.sin(planet.angle) * planet.data.orbitRadius;

            planet.mesh.position.set(x, 0, z);
            planet.mesh.rotation.y += (2 * Math.PI * deltaTime) / planet.data.rotationPeriod;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.sun) {
            this.sun.rotation.y += 0.001;
        }

        this.updatePlanets();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new SolarSystem();
});
