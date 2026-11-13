"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
    cam.position.set(0, 0, 9);
    scene.add(new THREE.AmbientLight(0x446677, 0.8));
    const l1 = new THREE.PointLight(0x2ee6d6, 90, 40); l1.position.set(5, 4, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0xff8a3d, 90, 40); l2.position.set(-6, -3, 5); scene.add(l2);
    const group = new THREE.Group(); scene.add(group);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), new THREE.MeshStandardMaterial({ color: 0x10222b, metalness: 0.85, roughness: 0.3, flatShading: true, emissive: 0x0b4a50, emissiveIntensity: 0.5 }));
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, 1), new THREE.MeshBasicMaterial({ color: 0x2ee6d6, wireframe: true, transparent: true, opacity: 0.3 }));
    group.add(core, wire);
    const rings = [];
    [[2.9, 0x2ee6d6], [3.5, 0xff8a3d]].forEach(([r, c], k) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.7 }));
      m.rotation.x = 1.1 + k * 0.5; m.rotation.y = k * 0.8; group.add(m); rings.push(m);
    });
    const pts = [];
    for (let i = 0; i < 34; i++) {
      const r = 3.2 + Math.random() * 2.6, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pts.push(new THREE.Vector3(r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)));
    }
    pts.forEach((v, i) => {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.07 + Math.random() * 0.06, 12, 12), new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff8a3d : 0x2ee6d6 }));
      n.position.copy(v); group.add(n);
    });
    const lp = [];
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (pts[i].distanceTo(pts[j]) < 2.8) lp.push(pts[i], pts[j]);
    group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.22 })));
    const sp = new Float32Array(900);
    for (let i = 0; i < 900; i++) sp[i] = (Math.random() - 0.5) * 40;
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x9fd8e0, size: 0.04, transparent: true, opacity: 0.7 }));
    scene.add(stars);
    const place = () => { const wide = el.clientWidth > 800; group.position.set(wide ? 3.3 : 0, wide ? 0 : 2.8, 0); group.scale.setScalar(wide ? 1 : 0.75); };
    place();
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
    const onResize = () => { renderer.setSize(el.clientWidth, el.clientHeight); cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix(); place(); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    const clock = new THREE.Clock(); let raf;
    const loop = () => {
      const t = clock.getElapsedTime();
      core.rotation.y = t * 0.3; core.rotation.x = t * 0.15; wire.rotation.y = -t * 0.2; wire.rotation.z = t * 0.1;
      rings[0].rotation.z = t * 0.2; rings[1].rotation.z = -t * 0.15;
      group.rotation.y = t * 0.08 + mouse.x * 0.8; group.rotation.x = mouse.y * 0.5;
      stars.rotation.y = t * 0.01; core.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
      renderer.render(scene, cam); raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", onResize);
      renderer.dispose(); if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="scene" />;
}
