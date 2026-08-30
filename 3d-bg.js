/* ============================================================
   3d-bg.js — Shared lightweight Three.js animated background
   used by index1.html and index2.html.

   - Floating particle field (vertex colored: cyan / green / white)
   - Two slow-rotating wireframe shapes (subtle depth layers)
   - Gentle mouse parallax on desktop
   - SCROLL-DRIVEN motion: the scene moves through / reacts to
     the page as the user scrolls (see "Scroll response" below)
   - Auto-reduced quality on touch devices
   - Respects prefers-reduced-motion
   ============================================================ */

(function () {
    'use strict';

    // Respect reduced-motion preferences: no animation at all.
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Three.js should be loaded from CDN before this script.
    if (typeof THREE === 'undefined') return;

    var canvas = document.getElementById('bg-3d');
    if (!canvas) return;

    // Touch devices get a lighter scene (fewer particles, lower DPR).
    var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    /* ---------- Scene / Camera / Renderer ---------- */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 16;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isTouch,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    var world = new THREE.Group();
    scene.add(world);

    /* ---------- Floating particle field ---------- */
    var count = isTouch ? 240 : 650;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);

    var palette = [
        new THREE.Color(0x1d4ed8), // deep electric blue
        new THREE.Color(0x0ea5e9), // sky blue
        new THREE.Color(0x60a5fa)  // soft blue
    ];

    for (var i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 44;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 34;

        var c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    var pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var pointsMat = new THREE.PointsMaterial({
        size: isTouch ? 0.10 : 0.11,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
    });
    var points = new THREE.Points(pointsGeo, pointsMat);
    world.add(points);

    /* ---------- Slow wireframe geometry (depth layers) ---------- */
    var ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.4, 1),
        new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            wireframe: true,
            transparent: true,
            opacity: isTouch ? 0.08 : 0.14
        })
    );
    ico.position.set(isTouch ? 4.4 : 5.6, 1.0, -6);
    // Remember the home position so scroll motion is added on top.
    var icoHomeZ = ico.position.z;
    var icoBaseY = ico.position.y;

    var octa = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.9, 0),
        new THREE.MeshBasicMaterial({
            color: 0x0ea5e9,
            wireframe: true,
            transparent: true,
            opacity: isTouch ? 0.07 : 0.11
        })
    );
    octa.position.set(isTouch ? -4.0 : -5.6, -1.4, -8);
    var octaHomeZ = octa.position.z;
    var octaBaseY = octa.position.y;

    world.add(ico);
    world.add(octa);

    /* ---------- Mouse parallax (desktop only) ---------- */
    var mouse = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };

    if (!isTouch) {
        window.addEventListener('mousemove', function (e) {
            target.x = (e.clientX / window.innerWidth) - 0.5;
            target.y = (e.clientY / window.innerHeight) - 0.5;
        }, { passive: true });
    }

    /* ---------- Scroll response ----------
       Track page scroll as a normalized 0..1 value and its velocity.
       The 3D scene gently reacts: camera dollies, the field drifts
       and the wireframe shapes slide at different depths (parallax). */
    var scrollTarget = 0;
    var scrollSmooth = 0;
    var scrollMax = 1;
    var lastScrollSmooth = 0;

    function readScroll() {
        scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollTarget = (window.pageYOffset || window.scrollY) / scrollMax;
    }

    window.addEventListener('scroll', readScroll, { passive: true });
    readScroll();
/* ---------- Animation loop ---------- */
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();

        // Smooth the raw scroll value so the scene eases, not snaps.
        scrollSmooth += (scrollTarget - scrollSmooth) * 0.06;
        var scrollEnergy = Math.min(0.05, Math.abs(scrollSmooth - lastScrollSmooth));
        lastScrollSmooth = scrollSmooth;

        // Constant, slow drift.
        world.rotation.y += 0.0008;
        points.rotation.y -= 0.0005;
        ico.rotation.x += 0.0012 + scrollEnergy * 0.5;
        ico.rotation.y += 0.0018;
        octa.rotation.x -= 0.0020;
        octa.rotation.z += 0.0015 + scrollEnergy * 0.4;

        // Scroll-driven camera dolly — gentle move "into" the field.
        camera.position.z = 16 - scrollSmooth * 2.0;
        camera.position.y = -scrollSmooth * 1.2;

        // Field drifts upward while scrolling (particles stream past).
        points.position.y = -scrollSmooth * 3.5;

        // Wireframe shapes slide at different rates for depth parallax.
        ico.position.z = icoHomeZ + scrollSmooth * 2.5;
        ico.position.y = icoBaseY + Math.sin(t * 0.4) * 0.35 - scrollSmooth * 1.6;
        octa.position.z = octaHomeZ + scrollSmooth * 1.4;
        octa.position.y = octaBaseY + Math.cos(t * 0.35) * 0.30 - scrollSmooth * 1.0;

        // Subtle parallax towards the cursor.
        mouse.x += (target.x - mouse.x) * 0.04;
        mouse.y += (target.y - mouse.y) * 0.04;
        world.rotation.x = mouse.y * 0.10;
        world.rotation.z = -mouse.x * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    /* ---------- Resize handling (debounced) ---------- */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 150);
    }, { passive: true });
})();