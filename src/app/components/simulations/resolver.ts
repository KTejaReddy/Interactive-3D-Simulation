export function resolveSimulation(prompt: string) {
  const text = prompt.toLowerCase();

  const simulations = [
    "solar-system",
    "galaxy",
    "black-hole",
    "tornado",
    "fire",
    "rain",
    "snow",
    "dna-helix",
    "atom",
    "pendulum",
    "double-pendulum",
    "gravity-wells",
    "wave-interference",
    "fireworks",
    "aurora",
    "flocking-birds",
    "magnetic-field",
    "lorenz-attractor",
    "lava-lamp",
    "nebula",
    "asteroid-field",
    "volcano",
    "tsunami",
    "rocket-launch"
  ];

  const synonyms: Record<string, string[]> = {
    "black-hole": ["gravity", "singularity"],
    "tornado": ["storm", "cyclone"],
    "fire": ["flame", "burn"],
    "rain": ["weather", "storm"],
    "snow": ["winter"],
    "dna-helix": ["dna", "gene"],
    "atom": ["electron", "nucleus"],
    "volcano": ["lava", "eruption"],
    "tsunami": ["wave", "ocean"],
    "rocket-launch": ["rocket", "launch", "space"],
  };

  let bestMatch = null;
  let bestScore = 0;

  simulations.forEach(sim => {
    let score = 0;

    // direct match
    if (text.includes(sim)) score += 5;

    // word match
    sim.split("-").forEach(word => {
      if (text.includes(word)) score += 2;
    });

    // synonym match
    if (synonyms[sim]) {
      synonyms[sim].forEach(word => {
        if (text.includes(word)) score += 1;
      });
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = sim;
    }
  });

  return bestScore > 0 ? bestMatch : null;
}