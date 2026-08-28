import React from "react";

const explanations = {
  "solar-system": {
    title: "Solar System",
    content:
      "This simulation shows planets orbiting the Sun due to gravitational forces. Each planet follows an elliptical path influenced by the Sun's massive gravity."
  },
  "black-hole": {
    title: "Black Hole",
    content:
      "A black hole is a region in space where gravity is so strong that nothing, not even light, can escape. The surrounding accretion disk contains matter spiraling inward."
  },
  "galaxy": {
    title: "Spiral Galaxy",
    content:
      "This represents a galaxy where billions of stars rotate around a central mass. The spiral arms form due to density waves and gravitational interactions."
  },
  "bouncing-balls": {
    title: "Bouncing Balls",
    content:
      "This simulation demonstrates gravity, collision, and energy loss. Balls bounce due to elastic collisions and gradually lose energy due to damping."
  },
  "pendulum": {
    title: "Simple Pendulum",
    content:
      "A pendulum swings due to gravity. Its motion is periodic and depends on its length and gravitational acceleration."
  },
  "double-pendulum": {
    title: "Double Pendulum",
    content:
      "This system shows chaotic motion. Small changes in initial conditions lead to completely different outcomes, demonstrating chaos theory."
  },
  "tornado": {
    title: "Tornado",
    content:
      "A tornado is a rapidly rotating column of air. The particles simulate swirling motion caused by pressure differences and angular momentum."
  },
  "fire": {
    title: "Fire",
    content:
      "Fire is a chemical reaction releasing heat and light. The particles rise upward due to convection and decreasing density."
  },
  "rain": {
    title: "Rainfall",
    content:
      "Rain occurs when water droplets fall due to gravity. This simulation shows downward motion with constant acceleration."
  },
  "snow": {
    title: "Snowfall",
    content:
      "Snowflakes fall slowly due to air resistance. Their motion includes drifting and gentle descent."
  },
  "dna-helix": {
    title: "DNA Helix",
    content:
      "DNA is a double helix structure carrying genetic information. The twisting shape helps in compact storage and replication."
  },
  "atom": {
    title: "Atom Model",
    content:
      "Atoms consist of a nucleus with electrons orbiting around it. This model shows simplified orbital motion."
  },
  "gravity-wells": {
    title: "Gravity Wells",
    content:
      "Objects attract each other through gravity. Particles move toward massive objects following inverse-square law forces."
  },
  "wave-interference": {
    title: "Wave Interference",
    content:
      "When waves overlap, they combine to form patterns of constructive and destructive interference."
  },
  "fireworks": {
    title: "Fireworks",
    content:
      "Fireworks explode due to combustion, sending particles outward in all directions with gravity pulling them down."
  },
  "aurora": {
    title: "Aurora Borealis",
    content:
      "Auroras occur when charged particles interact with Earth's magnetic field and atmosphere, producing glowing lights."
  },
  "flocking-birds": {
    title: "Flocking Behavior",
    content:
      "Birds follow simple rules: separation, alignment, and cohesion. Together, they create complex group behavior."
  },
  "magnetic-field": {
    title: "Magnetic Field",
    content:
      "Magnetic fields are created by moving charges. Field lines show the direction of magnetic force."
  },
  "lorenz-attractor": {
    title: "Lorenz Attractor",
    content:
      "This is a chaotic system where tiny changes lead to large differences. It represents weather unpredictability."
  },
  "lava-lamp": {
    title: "Lava Lamp",
    content:
      "Blobs rise and fall due to density differences and heat transfer in fluids."
  },
};

export default function ExplanationPanel({ simulation }) {
  const data = explanations[simulation] || {
    title: "Simulation",
    content: "This simulation demonstrates real-world physics and dynamic behavior."
  };

  return (
    <div className="mt-4 p-5 rounded-xl bg-black/40 border border-white/10 text-white">
      <h2 className="text-lg font-semibold mb-2">{data.title}</h2>
      <p className="text-sm text-gray-300 leading-relaxed">
        {data.content}
      </p>
    </div>
  );
}