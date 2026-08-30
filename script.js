// --- script.js ---
// Landing page: premium particle background + subtle mouse parallax.

/* Initialize Particles.js with a refined, connected network config.
   Colours tuned for the light / professional theme. */
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 60,
      "density": {
        "enable": true,
        "value_area": 900
      }
    },
    "color": {
      "value": "#c084fc" // soft purple dots
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
      },
    },
    "opacity": {
      "value": 0.45,
      "random": true,
    },
    "size": {
      "value": 2.2,
      "random": true,
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#a855f7",
      "opacity": 0.18,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.7,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 0.45
        }
      },
    }
  },
  "retina_detect": true
});