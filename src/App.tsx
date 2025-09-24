import { useState, useEffect } from "react";

interface ProblemValues {
  total: number;
  mathTotal: number;
  scienceTotal: number;
  both: number;
  neither: number;
  mathOnly: number;
  scienceOnly: number;
}

interface Given {
  total?: number;
  mathTotal?: number;
  scienceTotal?: number;
  both?: number;
  neither?: number;
}

interface Problem {
  id: number;
  type: string;
  question: string;
  answer: number;
  given: Given;
  hiddenValue: string;
  allValues: ProblemValues;
}

interface Stats {
  totalSolved: number;
  streak: number;
  bestStreak: number;
  firstTryCorrect: number;
  byType: Record<string, number>;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
}

function generateProblem(id: number): Problem {
  // Problem types with different unknowns
  const types = [
    'findMathTotal',      // Find Math total (aggregate)
    'findBoth',           // Find intersection (atomic)
    'findTotal',          // Find total students
    'findScienceTotal',   // Find Science total (aggregate)
    'findMathOnly',       // Find Math-only (atomic)
    'findScienceOnly',    // Find Science-only (atomic)
    'findNeither',        // Find Neither (atomic)
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Generate base values
  const total = Math.floor(Math.random() * 15) + 30; // 30–45
  const both = Math.floor(Math.random() * 6) + 5;    // 5–10
  const hasNeither = Math.random() < 0.5;
  const neither = hasNeither ? Math.floor(Math.random() * 5) + 1 : 0;
  
  // Calculate derived values
  const scienceTotal = Math.floor(Math.random() * (total - both - neither)) + both;
  const mathTotal = total - scienceTotal + both - neither;
  const mathOnly = mathTotal - both;
  const scienceOnly = scienceTotal - both;
  
  // Structure problem based on type
  let question: string, answer: number, given: Given, hiddenValue: string;
  
  switch(type) {
    case 'findMathTotal':
      question = "How many students passed Mathematics (total)?";
      answer = mathTotal;
      hiddenValue = 'mathTotal';
      given = {
        total, scienceTotal, both,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findBoth':
      question = "How many students passed BOTH Mathematics AND Science?";
      answer = both;
      hiddenValue = 'both';
      given = {
        total, mathTotal, scienceTotal,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findTotal':
      question = "How many students are in the class (total)?";
      answer = total;
      hiddenValue = 'total';
      given = {
        mathTotal, scienceTotal, both,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findScienceTotal':
      question = "How many students passed Science (total)?";
      answer = scienceTotal;
      hiddenValue = 'scienceTotal';
      given = {
        total, mathTotal, both,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findMathOnly':
      question = "How many students passed ONLY Mathematics (not Science)?";
      answer = mathOnly;
      hiddenValue = 'mathOnly';
      given = {
        total, scienceTotal, both,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findScienceOnly':
      question = "How many students passed ONLY Science (not Mathematics)?";
      answer = scienceOnly;
      hiddenValue = 'scienceOnly';
      given = {
        total, mathTotal, both,
        ...(hasNeither && { neither })
      };
      break;
      
    case 'findNeither':
      question = "How many students passed NEITHER subject?";
      answer = neither || Math.floor(Math.random() * 5) + 1;
      hiddenValue = 'neither';
      given = {
        total, mathTotal, scienceTotal, both
      };
      break;
      
    default:
      question = "How many students passed Mathematics (total)?";
      answer = mathTotal;
      hiddenValue = 'mathTotal';
      given = { total, scienceTotal, both };
  }
  
  return { 
    id, 
    type,
    question, 
    answer, 
    given,
    hiddenValue,
    // Store all values for diagram
    allValues: { total, mathTotal, scienceTotal, both, neither, mathOnly, scienceOnly }
  };
}

// Confetti component
function Confetti({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (trigger) {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 110,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 5 + 5),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall 3s ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function VennDiagram({ problem, showAnswer, showNotation }: {
  problem: Problem;
  showAnswer: boolean;
  showNotation: boolean;
}) {
  const { given, hiddenValue, allValues } = problem;
  const showMathTotal = given.mathTotal !== undefined || (showAnswer && hiddenValue === 'mathTotal');
  const showScienceTotal = given.scienceTotal !== undefined || (showAnswer && hiddenValue === 'scienceTotal');
  const showBoth = given.both !== undefined || (showAnswer && hiddenValue === 'both');
  const showMathOnly = showAnswer && hiddenValue === 'mathOnly';
  const showScienceOnly = showAnswer && hiddenValue === 'scienceOnly';
  const showTotal = given.total !== undefined || (showAnswer && hiddenValue === 'total');
  const showNeither = given.neither !== undefined || (showAnswer && hiddenValue === 'neither');
  
  return (
    <div className="relative overflow-x-auto">
      <svg viewBox="0 0 320 180" className="w-full max-w-xs mx-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="mathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="scienceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1"/>
          </filter>
        </defs>
        
        {/* Math circle */}
        <circle
          cx="120"
          cy="90"
          r="50"
          fill="url(#mathGrad)"
          stroke="#3b82f6"
          strokeWidth="2"
          filter="url(#shadow)"
        />
        
        {/* Science circle */}
        <circle
          cx="200"
          cy="90"
          r="50"
          fill="url(#scienceGrad)"
          stroke="#10b981"
          strokeWidth="2"
          filter="url(#shadow)"
        />

        {/* Labels */}
        <text x="95" y="35" fontSize="14" fontWeight="600" fill="#3b82f6">
          {showNotation ? 'M' : 'Math'}
        </text>
        <text x="200" y="35" fontSize="14" fontWeight="600" fill="#10b981">
          {showNotation ? 'S' : 'Science'}
        </text>

        {/* ATOMIC REGIONS */}
        
        {/* Intersection (Both) - ATOMIC */}
        {showBoth ? (
          <g>
            <text x="160" y="95" fontSize="18" fontWeight="bold" fill="#1f2937" textAnchor="middle"
                  className={showAnswer && hiddenValue === 'both' ? 'animate-pulse' : ''}>
              {allValues.both}
            </text>
            {showNotation && (
              <text x="160" y="110" fontSize="10" fill="#6b7280" textAnchor="middle">
                M∩S
              </text>
            )}
          </g>
        ) : (
          <text x="160" y="95" fontSize="20" fontWeight="bold" fill="#ef4444" textAnchor="middle">
            ?
          </text>
        )}
        
        {/* Math only - ATOMIC */}
        {(showMathOnly || (showMathTotal && showBoth)) && (
          <g>
            <text x="90" y="95" fontSize="16" fontWeight="600" fill="#3b82f6" textAnchor="middle"
                  className={showAnswer && hiddenValue === 'mathOnly' ? 'animate-pulse' : ''}>
              {allValues.mathOnly}
            </text>
            {showNotation && (
              <text x="90" y="110" fontSize="10" fill="#6b7280" textAnchor="middle">
                M\S
              </text>
            )}
          </g>
        )}
        
        {/* Science only - ATOMIC */}
        {(showScienceOnly || (showScienceTotal && showBoth)) && (
          <g>
            <text x="230" y="95" fontSize="16" fontWeight="600" fill="#10b981" textAnchor="middle"
                  className={showAnswer && hiddenValue === 'scienceOnly' ? 'animate-pulse' : ''}>
              {allValues.scienceOnly}
            </text>
            {showNotation && (
              <text x="230" y="110" fontSize="10" fill="#6b7280" textAnchor="middle">
                S\M
              </text>
            )}
          </g>
        )}
        
        {/* AGGREGATES */}
        
        {/* Math Total label - AGGREGATE */}
        {showMathTotal && (
          <g>
            <rect x="50" y="65" width="60" height="18" rx="9" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1"/>
            <text x="80" y="77" fontSize="11" fill="#4f46e5" textAnchor="middle">
              {showNotation ? `|M| = ${allValues.mathTotal}` : `Total: ${allValues.mathTotal}`}
            </text>
          </g>
        )}
        
        {/* Science Total label - AGGREGATE */}
        {showScienceTotal && (
          <g>
            <rect x="210" y="65" width="60" height="18" rx="9" fill="#d1fae5" stroke="#10b981" strokeWidth="1"/>
            <text x="240" y="77" fontSize="11" fill="#059669" textAnchor="middle">
              {showNotation ? `|S| = ${allValues.scienceTotal}` : `Total: ${allValues.scienceTotal}`}
            </text>
          </g>
        )}
        
        {/* Total students - AGGREGATE */}
        {showTotal && (
          <g>
            <rect x="125" y="15" width="70" height="20" rx="10" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1"/>
            <text x="160" y="28" fontSize="11" fill="#6b21a8" textAnchor="middle">
              {showNotation ? `|U| = ${allValues.total}` : `Class: ${allValues.total}`}
            </text>
          </g>
        )}
        
        {/* Neither label - ATOMIC */}
        {showNeither && (
          <g>
            <rect x="135" y="145" width="50" height="20" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
            <text x="160" y="158" fontSize="11" fill="#92400e" textAnchor="middle">
              {showNotation ? `(M∪S)' = ${allValues.neither}` : `Neither: ${allValues.neither}`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function ProblemTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    findMathTotal: '🔢',
    findBoth: '🎯',
    findTotal: '👥',
    findScienceTotal: '🧪',
    findMathOnly: '1️⃣',
    findScienceOnly: '2️⃣',
    findNeither: '❌'
  };
  
  const labels: Record<string, string> = {
    findMathTotal: 'Aggregate',
    findBoth: 'Atomic',
    findTotal: 'Aggregate',
    findScienceTotal: 'Aggregate',
    findMathOnly: 'Atomic',
    findScienceOnly: 'Atomic',
    findNeither: 'Atomic'
  };
  
  const colors: Record<string, string> = {
    findMathTotal: 'from-blue-500 to-blue-600',
    findBoth: 'from-purple-500 to-pink-500',
    findTotal: 'from-indigo-500 to-purple-500',
    findScienceTotal: 'from-green-500 to-teal-500',
    findMathOnly: 'from-cyan-500 to-blue-500',
    findScienceOnly: 'from-emerald-500 to-green-500',
    findNeither: 'from-orange-500 to-red-500'
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${colors[type]} text-white text-lg`}>
        {icons[type]}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        labels[type] === 'Atomic' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {labels[type]}
      </span>
    </div>
  );
}

// Score tracking functions
function getStoredStats(): Stats {
  try {
    const stats = localStorage.getItem('vennDiagramStats');
    return stats ? JSON.parse(stats) : { 
      totalSolved: 0, 
      streak: 0, 
      bestStreak: 0,
      firstTryCorrect: 0,
      byType: {}
    };
  } catch {
    return { totalSolved: 0, streak: 0, bestStreak: 0, firstTryCorrect: 0, byType: {} };
  }
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem('vennDiagramStats', JSON.stringify(stats));
  } catch {
    // Silent fail if localStorage is not available
  }
}

export default function App() {
  const [problems, setProblems] = useState<Problem[]>(
    Array.from({ length: 20 }, (_, i) => generateProblem(i + 1))
  );
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [hintMode, setHintMode] = useState<'spicy' | 'nicey'>('spicy');
  const [showNotation, setShowNotation] = useState(false);
  const [stats, setStats] = useState<Stats>(getStoredStats());
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [firstAttempt, setFirstAttempt] = useState<Record<number, boolean>>({});
  const [showStats, setShowStats] = useState(false);

  const toggleAnswer = (id: number) => {
    const problem = problems.find(p => p.id === id);
    if (!problem) return;
    
    const wasHidden = !showAnswers[id];
    
    setShowAnswers(prev => ({ ...prev, [id]: !prev[id] }));
    
    if (wasHidden && !solvedProblems.has(id)) {
      // First time showing answer
      setSolvedProblems(prev => new Set([...prev, id]));
      
      // Check if it was first try (no hint used)
      const isFirstTry = !showHints[id];
      if (isFirstTry && !firstAttempt[id]) {
        setFirstAttempt(prev => ({ ...prev, [id]: true }));
      }
      
      // Update stats
      const newStats = { ...stats };
      newStats.totalSolved++;
      
      if (isFirstTry && !firstAttempt[id]) {
        newStats.firstTryCorrect++;
        newStats.streak++;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
        // Trigger confetti for first-try success
        setConfettiTrigger(prev => prev + 1);
      } else {
        newStats.streak = 0;
      }
      
      // Track by problem type
      newStats.byType[problem.type] = (newStats.byType[problem.type] || 0) + 1;
      
      setStats(newStats);
      saveStats(newStats);
    }
  };

  const progress = (solvedProblems.size / problems.length) * 100;

  const getHintForType = (problem: Problem): string => {
    const { type } = problem;
    
    const spicyHints: Record<string, string> = {
      findMathTotal: "VENN-DITTO? SUBTRACT TO GET RID-O! Total − Science(total) + Both − Neither = Math(total)! Remember: 2 N's = 2^n = 4 regions!",
      findBoth: "OVERLAP-TRAP! Math(total) + Science(total) − Total + Neither = The Sweet Spot! (1 of your 4 atomic regions)",
      findTotal: "ADD 'EM UP, SUBTRACT THE DUP! Math(total) + Science(total) − Both + Neither = Everyone! (All 4 regions counted)",
      findScienceTotal: "FLIP THE SCRIPT! Total − Math(total) + Both − Neither = Science(total)!",
      findMathOnly: "LONELY MATH! Math(total) − Both = Just the Math loners! (1 of your 4 atomic regions)",
      findScienceOnly: "SCIENCE SOLO! Science(total) − Both = Science party of one! (1 of your 4 atomic regions)",
      findNeither: "THE OUTSIDERS! Total − Math(total) − Science(total) + Both = Party Poopers! (The 4th atomic region)"
    };
    
    const niceyHints: Record<string, string> = {
      findMathTotal: `Math(total) = Math(only) + Both\nFormula: Total − Science(total) + Both − Neither`,
      findBoth: `Both = Math ∩ Science (intersection)\nFormula: Math(total) + Science(total) − Total + Neither`,
      findTotal: `Total = Math(only) + Science(only) + Both + Neither\nFormula: Math(total) + Science(total) − Both + Neither`,
      findScienceTotal: `Science(total) = Science(only) + Both\nFormula: Total − Math(total) + Both − Neither`,
      findMathOnly: `Math(only) = Math(total) − Both\nThis is the ATOMIC region: just Math, not Science`,
      findScienceOnly: `Science(only) = Science(total) − Both\nThis is the ATOMIC region: just Science, not Math`,
      findNeither: `Neither = Total − (Math ∪ Science)\nFormula: Total − Math(total) − Science(total) + Both`
    };
    
    const notationHints: Record<string, string> = {
      findMathTotal: `|M| = |M\\S| + |M∩S|\nFormula: |U| − |S| + |M∩S| − |(M∪S)'|`,
      findBoth: `|M∩S| = intersection of M and S\nFormula: |M| + |S| − |U| + |(M∪S)'|`,
      findTotal: `|U| = |M\\S| + |S\\M| + |M∩S| + |(M∪S)'|\nFormula: |M| + |S| − |M∩S| + |(M∪S)'|`,
      findScienceTotal: `|S| = |S\\M| + |M∩S|\nFormula: |U| − |M| + |M∩S| − |(M∪S)'|`,
      findMathOnly: `|M\\S| = |M| − |M∩S|\nSet difference: elements in M but not in S`,
      findScienceOnly: `|S\\M| = |S| − |M∩S|\nSet difference: elements in S but not in M`,
      findNeither: `|(M∪S)'| = |U| − |M∪S|\nComplement: elements in neither M nor S`
    };
    
    if (showNotation) {
      return notationHints[type];
    }
    return hintMode === 'spicy' ? spicyHints[type] : niceyHints[type];
  };

  const resetStats = () => {
    const newStats: Stats = { totalSolved: 0, streak: 0, bestStreak: 0, firstTryCorrect: 0, byType: {} };
    setStats(newStats);
    saveStats(newStats);
    setShowStats(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Confetti trigger={confettiTrigger} />
      
      <div className="p-3 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            🎯 Precise Venn Diagram Practice
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            Master Atomic Regions vs Aggregates
          </p>
          
          {/* Stats Bar */}
          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalSolved}</p>
                  <p className="text-xs text-gray-600">Total Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.streak}</p>
                  <p className="text-xs text-gray-600">Current Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.bestStreak}</p>
                  <p className="text-xs text-gray-600">Best Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.firstTryCorrect}/{stats.totalSolved || 1}
                  </p>
                  <p className="text-xs text-gray-600">First Try</p>
                </div>
              </div>
            </button>
            
            {showStats && (
              <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-bold text-gray-700 mb-2">Problems by Type:</h3>
                <div className="text-sm space-y-1">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-gray-600">{type.replace('find', '').replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={resetStats}
                  className="mt-3 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Reset Stats
                </button>
              </div>
            )}
          </div>
          
          {/* Key Concept Box */}
          <div className="max-w-2xl mx-auto mb-4 p-3 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border-l-4 border-yellow-500 pl-3">
                <p className="font-bold text-yellow-700">🔶 ATOMIC (precise pieces)</p>
                <p className="text-gray-600">Math only, Science only, Both, Neither</p>
                <p className="text-xs text-orange-600 mt-1 font-semibold">2 N's in VENN = 2^n = 4 regions!</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-bold text-blue-700">📊 AGGREGATE (totals)</p>
                <p className="text-gray-600">Math(total), Science(total), Class total</p>
              </div>
            </div>
          </div>
          
          {/* Controls Row - Better mobile stacking */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            {/* Hint Mode Toggle */}
            <div className="inline-flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-gray-600">Hints:</span>
              <button
                onClick={() => setHintMode('spicy')}
                className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                  hintMode === 'spicy' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🌶️ SPICY
              </button>
              <button
                onClick={() => setHintMode('nicey')}
                className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                  hintMode === 'nicey' 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🧊 NICEY
              </button>
            </div>
            
            {/* Notation Toggle */}
            <div className="inline-flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-gray-600">Notation:</span>
              <button
                onClick={() => setShowNotation(!showNotation)}
                className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                  showNotation 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showNotation ? '∩∪ SET' : 'ABC TEXT'}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Session Progress</span>
              <span>{solvedProblems.size}/{problems.length} solved</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Problems Grid - Single column on mobile */}
        <div className="grid gap-6 lg:grid-cols-2">
          {problems.map((p) => (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl ${
                solvedProblems.has(p.id) ? 'ring-2 ring-green-400' : ''
              }`}
            >
              {/* Problem Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg">Problem {p.id}</h2>
                    <ProblemTypeIcon type={p.type} />
                  </div>
                  {solvedProblems.has(p.id) && (
                    <span className="text-2xl animate-bounce">
                      {firstAttempt[p.id] ? '🌟' : '✅'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <VennDiagram problem={p} showAnswer={showAnswers[p.id]} showNotation={showNotation} />

                {/* Problem Statement */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">Given Information:</p>
                  <ul className="space-y-1 text-gray-700">
                    {p.given.total !== undefined && (
                      <li className="flex items-center">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Total students in class: <strong>{p.given.total}</strong></span>
                      </li>
                    )}
                    {p.given.mathTotal !== undefined && (
                      <li className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Mathematics <strong>(total)</strong>: <strong>{p.given.mathTotal}</strong></span>
                      </li>
                    )}
                    {p.given.scienceTotal !== undefined && (
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Science <strong>(total)</strong>: <strong>{p.given.scienceTotal}</strong></span>
                      </li>
                    )}
                    {p.given.both !== undefined && (
                      <li className="flex items-center">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Both Math AND Science <strong>(intersection)</strong>: <strong>{p.given.both}</strong></span>
                      </li>
                    )}
                    {p.given.neither !== undefined && (
                      <li className="flex items-center">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Neither subject <strong>(outside both)</strong>: <strong>{p.given.neither}</strong></span>
                      </li>
                    )}
                  </ul>
                  <p className="mt-3 text-lg font-semibold text-blue-700">
                    {p.question} 🤔
                  </p>
                </div>

                {/* Action Buttons - Stack on very small screens */}
                <div className="mt-4 flex flex-col xs:flex-row gap-2">
                  <button
                    onClick={() => setShowHints(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                    className="flex-1 px-4 py-3 xs:py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    {showHints[p.id] ? '💡 Hide Hint' : '💡 Show Hint'}
                  </button>
                  <button
                    onClick={() => toggleAnswer(p.id)}
                    className="flex-1 px-4 py-3 xs:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    {showAnswers[p.id] ? '🔒 Hide Answer' : '🔓 Show Answer'}
                  </button>
                </div>

                {/* Hint Box */}
                {showHints[p.id] && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    {hintMode === 'spicy' && !showNotation ? (
                      <>
                        <p className="font-bold text-red-600 mb-2 text-lg">🌶️ SPICY MNEMONIC:</p>
                        <div className="bg-white p-3 rounded-lg shadow-inner border-2 border-orange-300">
                          <p className="text-lg font-bold text-orange-600">
                            {getHintForType(p)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-blue-600 mb-1">
                          {showNotation ? '∩∪ SET NOTATION:' : '🧊 NICEY HINT:'}
                        </p>
                        <div className="bg-blue-50 p-3 rounded font-mono text-sm whitespace-pre-line">
                          {getHintForType(p)}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Answer Box */}
                {showAnswers[p.id] && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                    <p className="font-semibold text-green-700 mb-2">✨ Answer:</p>
                    <div className="bg-white p-3 rounded shadow-inner">
                      <p className="font-bold text-2xl text-blue-600">
                        {p.answer} students
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {p.type.includes('Only') || p.type === 'findBoth' || p.type === 'findNeither' 
                          ? '(Atomic region)' 
                          : '(Aggregate total)'}
                      </p>
                      {firstAttempt[p.id] && (
                        <p className="text-sm text-green-600 font-bold mt-2">
                          🌟 First try success! +1 streak!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Generate New Set Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setProblems(Array.from({ length: 20 }, (_, i) => generateProblem(i + 1)));
              setShowHints({});
              setShowAnswers({});
              setSolvedProblems(new Set());
              setFirstAttempt({});
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🎲 Generate New Problem Set
          </button>
        </div>

        {/* Success Message */}
        {progress === 100 && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl animate-bounce">
            🎉 Awesome! You solved all 20 problems! 🎉
          </div>
        )}
      </div>
    </div>
  );
}