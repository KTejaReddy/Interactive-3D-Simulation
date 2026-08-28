import { useState } from 'react';
import { Search, Sparkles, Play, RotateCcw } from 'lucide-react';
import { SimulationViewer, SimulationType } from './components/SimulationViewer';
import ExplanationPanel from './components/ExplanationPanel';
import { resolveSimulation } from './components/simulations/resolver';

interface Simulation {
  id: SimulationType;
  name: string;
  description: string;
  keywords: string[];
}

const simulations: Simulation[] = [
  {
    id: 'solar-system',
    name: 'Solar System',
    description: 'Explore our solar system with planets orbiting the sun',
    keywords: ['solar', 'system', 'planet', 'sun', 'space', 'orbit', 'astronomy', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn']
  },
  {
    id: 'galaxy',
    name: 'Spiral Galaxy',
    description: 'Rotating spiral galaxy with thousands of stars',
    keywords: ['galaxy', 'spiral', 'stars', 'milky', 'way', 'cosmic', 'universe', 'space']
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    description: 'Black hole with accretion disk pulling in matter',
    keywords: ['black', 'hole', 'accretion', 'disk', 'space', 'gravity', 'cosmic']
  },
  {
    id: 'nebula',
    name: 'Nebula Cloud',
    description: 'Colorful nebula cloud with particle effects',
    keywords: ['nebula', 'cloud', 'space', 'cosmic', 'stars', 'gas']
  },
  {
    id: 'asteroid-field',
    name: 'Asteroid Field',
    description: 'Asteroids rotating and orbiting in space',
    keywords: ['asteroid', 'field', 'rock', 'space', 'meteor', 'belt']
  },
  {
    id: 'bouncing-balls',
    name: 'Bouncing Balls',
    description: 'Physics simulation of balls bouncing with gravity and collision',
    keywords: ['ball', 'bounce', 'physics', 'gravity', 'collision', 'motion', 'kinetic']
  },
  {
    id: 'pendulum',
    name: 'Simple Pendulum',
    description: 'Classic pendulum swinging with realistic physics',
    keywords: ['pendulum', 'swing', 'physics', 'gravity', 'motion', 'oscillate']
  },
  {
    id: 'double-pendulum',
    name: 'Double Pendulum',
    description: 'Chaotic double pendulum showing complex motion',
    keywords: ['double', 'pendulum', 'chaos', 'physics', 'complex', 'motion']
  },
  {
    id: 'spring-system',
    name: 'Spring System',
    description: 'Connected springs demonstrating elastic physics',
    keywords: ['spring', 'elastic', 'physics', 'bounce', 'oscillate']
  },
  {
    id: 'cloth',
    name: 'Cloth Simulation',
    description: 'Waving cloth with fabric physics',
    keywords: ['cloth', 'fabric', 'wave', 'material', 'physics']
  },
  {
    id: 'particle-explosion',
    name: 'Particle Explosion',
    description: 'Mesmerizing particle system with continuous explosions',
    keywords: ['particle', 'explosion', 'burst', 'spark']
  },
  {
    id: 'fireworks',
    name: 'Fireworks',
    description: 'Spectacular fireworks display with colorful explosions',
    keywords: ['firework', 'explosion', 'celebration', 'spark', 'fire', 'burst', 'rocket']
  },
  {
    id: 'fountain',
    name: 'Water Fountain',
    description: 'Water particles shooting up in a fountain',
    keywords: ['fountain', 'water', 'spray', 'liquid', 'particle']
  },
  {
    id: 'fire',
    name: 'Fire Simulation',
    description: 'Realistic fire with rising flames and heat',
    keywords: ['fire', 'flame', 'burn', 'heat', 'hot', 'ember']
  },
  {
    id: 'smoke',
    name: 'Smoke Rising',
    description: 'Smoke particles rising and dispersing',
    keywords: ['smoke', 'fog', 'mist', 'vapor', 'particle']
  },
  {
    id: 'rain',
    name: 'Rainfall',
    description: 'Rain drops falling with realistic physics',
    keywords: ['rain', 'drop', 'water', 'weather', 'precipitation', 'storm']
  },
  {
    id: 'snow',
    name: 'Snowfall',
    description: 'Gentle snowflakes falling from the sky',
    keywords: ['snow', 'flake', 'winter', 'cold', 'weather', 'precipitation']
  },
  {
    id: 'tornado',
    name: 'Tornado Vortex',
    description: 'Spinning tornado with particle debris',
    keywords: ['tornado', 'vortex', 'spin', 'twister', 'cyclone', 'weather', 'storm']
  },
  {
    id: 'lightning',
    name: 'Lightning Bolts',
    description: 'Electric lightning strikes in the sky',
    keywords: ['lightning', 'bolt', 'electric', 'thunder', 'storm', 'weather']
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Northern lights with colorful waves in the sky',
    keywords: ['aurora', 'borealis', 'northern', 'lights', 'sky', 'polar']
  },
  {
    id: 'wave-interference',
    name: 'Wave Interference',
    description: 'Beautiful wave interference patterns in 3D',
    keywords: ['wave', 'interference', 'water', 'ocean', 'sound', 'frequency', 'pattern']
  },
  {
    id: 'ripples',
    name: 'Water Ripples',
    description: 'Ripples spreading across water surface',
    keywords: ['ripple', 'water', 'wave', 'pond', 'surface', 'drop']
  },
  {
    id: 'dna-helix',
    name: 'DNA Double Helix',
    description: 'Rotating DNA double helix structure',
    keywords: ['dna', 'helix', 'genetic', 'biology', 'molecule', 'strand', 'gene']
  },
  {
    id: 'atom',
    name: 'Atom Model',
    description: 'Electrons orbiting around an atomic nucleus',
    keywords: ['atom', 'electron', 'nucleus', 'quantum', 'chemistry', 'molecule', 'proton']
  },
  {
    id: 'crystal-growth',
    name: 'Crystal Growth',
    description: 'Crystals growing and forming geometric patterns',
    keywords: ['crystal', 'grow', 'geometric', 'formation', 'mineral']
  },
  {
    id: 'gravity-wells',
    name: 'Gravity Wells',
    description: 'Particles attracted to gravity wells in 3D space',
    keywords: ['gravity', 'well', 'attraction', 'force', 'space', 'pull', 'orbit']
  },
  {
    id: 'magnetic-field',
    name: 'Magnetic Field',
    description: 'Magnetic field lines between two poles',
    keywords: ['magnetic', 'field', 'magnet', 'pole', 'force', 'physics']
  },
  {
    id: 'flocking-birds',
    name: 'Flocking Birds',
    description: 'Birds flocking together using boid algorithm',
    keywords: ['flock', 'bird', 'boid', 'swarm', 'fly', 'group', 'behavior']
  },
  {
    id: 'lorenz-attractor',
    name: 'Lorenz Attractor',
    description: 'Chaotic mathematical Lorenz attractor pattern',
    keywords: ['lorenz', 'attractor', 'chaos', 'math', 'fractal', 'butterfly', 'strange']
  },
  {
    id: 'lava-lamp',
    name: 'Lava Lamp',
    description: 'Colorful blobs floating like a lava lamp',
    keywords: ['lava', 'lamp', 'blob', 'float', 'liquid', 'psychedelic']
  },
  {
    id: 'traffic',
    name: 'Traffic Simulation',
    description: 'Cars moving on roads with continuous flow',
    keywords: ['traffic', 'cars', 'road', 'vehicles', 'highway']
  },
  {
    id: 'city',
    name: 'City Simulation',
    description: 'Procedural city with buildings',
    keywords: ['city', 'buildings', 'urban', 'town', 'skyline']
  },
];

function App() {
  const [query, setQuery] = useState('');
  const [currentSimulation, setCurrentSimulation] = useState<SimulationType>('solar-system');
  const [key, setKey] = useState(0); // For resetting simulation

  const handleSearch = (searchQuery: string) => {
  const result = resolveSimulation(searchQuery);

  if (result) {
    setCurrentSimulation(result as SimulationType);
  } else {
    setCurrentSimulation("dynamic"); // 🔥 fallback to generator
  }

  setQuery(searchQuery); // pass input
  setKey(prev => prev + 1);
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleQuickSelect = (simId: SimulationType) => {
    setCurrentSimulation(simId);
    setKey(prev => prev + 1); // Reset simulation
  };

  const handleReset = () => {
    setKey(prev => prev + 1); // Reset simulation
  };

  const currentSimInfo = simulations.find(sim => sim.id === currentSimulation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                3D Simulation Explorer
              </h1>
              <p className="text-sm text-gray-400">Ask anything and watch it come to life in 3D</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask for a simulation... (e.g., 'show me the solar system', 'bouncing balls', 'DNA')"
                className="w-full pl-12 pr-32 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Generate
              </button>
            </div>
          </form>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap gap-2 mt-4 max-h-32 overflow-y-auto">
            {simulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => handleQuickSelect(sim.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all flex-shrink-0 ${
                  currentSimulation === sim.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {sim.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">{currentSimInfo?.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{currentSimInfo?.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Interactive</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Real-time Physics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>3D Graphics</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Simulation
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Controls</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs">Drag</span>
                  <span>Rotate view</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs">Scroll</span>
                  <span>Zoom in/out</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Try asking:</h3>
              <ul className="space-y-1 text-sm text-gray-300 max-h-64 overflow-y-auto">
                <li>• "Show me a galaxy"</li>
                <li>• "Fire simulation"</li>
                <li>• "Flocking birds"</li>
                <li>• "Double pendulum chaos"</li>
                <li>• "Black hole"</li>
                <li>• "Rain and snow"</li>
                <li>• "Fireworks display"</li>
                <li>• "Aurora borealis"</li>
                <li>• "Tornado"</li>
                <li>• "Crystal growth"</li>
              </ul>
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden" style={{ height: '700px' }}>
              <SimulationViewer 
  key={key} 
  simulationType={currentSimulation} 
  query={query}
/>
            </div>
            {/* ✅ ADD THIS */}
  <ExplanationPanel simulation={currentSimulation} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8 border-t border-white/10">
        <p className="text-center text-gray-400 text-sm">
          Drag to rotate • Scroll to zoom • Explore interactive 3D simulations
        </p>
      </footer>
    </div>
  );
}

export default App;
