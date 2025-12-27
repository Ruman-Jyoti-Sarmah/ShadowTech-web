// --- script.js ---

/* Initialize Particles.js with a futuristic, connected grid configuration */
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80, // Number of particles
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#00e0ff" // Electric blue particles
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
      },
    },
    "opacity": {
      "value": 0.5,
      "random": false,
    },
    "size": {
      "value": 3,
      "random": true,
    },
    "line_linked": {
      "enable": true,
      "distance": 150, // Distance for lines to connect
      "color": "#0096ff", // Connecting line color
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2, // Slow, gentle movement
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab" // Lines follow the mouse
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "push": {
        "particles_nb": 4
      },
    }
  },
  "retina_detect": true
});