import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { Thermometer, Gauge, Clock, AlertTriangle, CheckCircle, Power, Settings, TrendingUp, Zap, Droplets, Activity, Lock, User, ArrowRight, Eye, EyeOff, Sun, Moon } from 'lucide-react';

/**
 * ANIMATION & THEME STYLES
 */
const AnimationStyles = () => (
  <style>{`
    .animate__animated {
      animation-duration: 1s;
      animation-fill-mode: both;
    }
    
    .animate__hinge {
      animation-duration: 2s;
      animation-name: hinge;
    }

    .animate__fadeIn {
      animation-name: fadeIn;
    }

    @keyframes hinge {
      0% { transform-origin: top left; animation-timing-function: ease-in-out; }
      20%, 60% { transform: rotate3d(0, 0, 1, 80deg); transform-origin: top left; animation-timing-function: ease-in-out; }
      40%, 80% { transform: rotate3d(0, 0, 1, 60deg); transform-origin: top left; animation-timing-function: ease-in-out; opacity: 1; }
      100% { transform: translate3d(0, 700px, 0); opacity: 0; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }

    /* THEME TRANSITIONS */
    .theme-transition {
      transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease, box-shadow 0.5s ease, fill 0.5s ease, stroke 0.5s ease;
    }
  `}</style>
);

/**
 * SIMULATION ENGINE & CONSTANTS
 */

const CYCLE_PHASES = {
  IDLE: { duration: 5, label: 'Idle' },
  CLOSING: { duration: 3, label: 'Mold Closing' },
  HEATING: { duration: 15, label: 'Heating (Vulcanization)' },
  PRESSING: { duration: 10, label: 'High Pressure Hold' },
  COOLING: { duration: 8, label: 'Cooling' },
  OPENING: { duration: 4, label: 'Mold Opening' }
};

// --- INDUSTRIAL THRESHOLDS & SETPOINTS ---
const TARGET_TEMP = 165;
const TARGET_PRESSURE = 180;
const TEMP_TOLERANCE = 10; // ±10% deviation threshold
const PRESSURE_TOLERANCE = 10; // ±10% deviation threshold
const TEMP_WARNING_THRESHOLD = TARGET_TEMP * 0.85; // Below 85% = Heating Phase
const VIBRATION_SAFE = 4; // mm/s - Safe limit
const VIBRATION_WARNING = 5; // mm/s - Warning threshold
const VIBRATION_CRITICAL = 8; // mm/s - Critical threshold

// --- SHARED UI COMPONENTS ---

const GlassCard = ({ children, className = "", isDark }) => (
  <div className={`relative overflow-hidden rounded-2xl backdrop-blur-lg shadow-lg theme-transition ${className} 
    ${isDark 
      ? 'bg-black/40 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]' 
      : 'bg-white/60 border border-white/80 shadow-lg'
    }`}>
    {/* Shine effect */}
    <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br theme-transition pointer-events-none opacity-40
      ${isDark ? 'from-cyan-500/10 via-transparent to-transparent' : 'from-white via-transparent to-transparent'}`} 
    />
    {children}
  </div>
);

const BackgroundAmbience = ({ isDark }) => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
    {/* Light Mode Blobs */}
    <div className={`absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse theme-transition duration-700
      ${isDark ? 'bg-blue-900/20' : 'bg-amber-200 opacity-30'}`} />
    
    <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] theme-transition duration-700
      ${isDark ? 'bg-purple-900/20' : 'bg-purple-200 opacity-30'}`} />
    
    <div className={`absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full blur-[80px] theme-transition duration-700
      ${isDark ? 'bg-cyan-900/20' : 'bg-orange-100 opacity-40'}`} />
      
    {/* Dark Mode Grid Overlay */}
    {isDark && (
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)' }}></div>
    )}
  </div>
);

/**
 * LOGIN SCREEN COMPONENT
 */
const LoginScreen = ({ onLogin, isHinging, isDark, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Made login case-insensitive for username
      if (username.trim().toLowerCase() === 'admin' && password === 'password123') {
        setIsLoading(false);
        onLogin(); 
      } else {
        setError('Invalid credentials. Try admin / password123');
        setIsLoading(false);
      }
    }, 800);
  };

  const inputClasses = isDark 
    ? "bg-black/50 border-cyan-900/50 text-cyan-50 focus:ring-cyan-500/50 focus:border-cyan-400 placeholder-cyan-900/50"
    : "bg-white/50 border-stone-200 text-stone-800 focus:ring-amber-500/50 focus:border-amber-500 placeholder-stone-400";

  const labelClasses = isDark ? "text-cyan-400" : "text-stone-500";
  const iconClasses = isDark ? "text-cyan-600 group-focus-within:text-cyan-400" : "text-stone-400 group-focus-within:text-amber-600";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans theme-transition
      ${isDark ? 'bg-[#050505] text-cyan-50' : 'bg-[#F5F5DC] text-stone-800'}`}>
      
      <BackgroundAmbience isDark={isDark} />
      
      {/* Theme Toggle Button (Fixed Top Right) */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md border shadow-lg transition-all z-50
          ${isDark ? 'bg-black/50 border-cyan-500/50 text-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-white/50 border-white/60 text-amber-600 hover:bg-white/80'}`}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      
      {/* Wrapping the card in the Hinge Animation Div */}
      <div className={`relative z-10 w-full max-w-md ${isHinging ? 'animate__animated animate__hinge' : ''}`}>
        <GlassCard className="p-8 md:p-10 shadow-2xl" isDark={isDark}>
          <div className="flex flex-col items-center mb-8">
            <div className={`p-4 rounded-2xl shadow-sm border mb-4 theme-transition
              ${isDark ? 'bg-black/60 border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'bg-gradient-to-br from-amber-100 to-white border-white'}`}>
              <Droplets size={32} className={isDark ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" : "text-amber-700"} />
            </div>
            <h1 className="text-2xl font-light tracking-tight text-center">
              Compression <span className={`font-bold theme-transition ${isDark ? "text-cyan-400 drop-shadow-[0_0_3px_rgba(0,255,255,0.8)]" : "text-amber-700"}`}>Monitor</span>
            </h1>
            <p className={`text-xs font-medium tracking-widest uppercase mt-2 theme-transition ${isDark ? "text-cyan-600" : "text-stone-500"}`}>IoT Secure Access Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 theme-transition ${labelClasses}`}>ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className={`theme-transition ${iconClasses}`} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all backdrop-blur-sm theme-transition ${inputClasses}`}
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 theme-transition ${labelClasses}`}>Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className={`theme-transition ${iconClasses}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all backdrop-blur-sm theme-transition ${inputClasses}`}
                  placeholder="password123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center theme-transition ${isDark ? "text-cyan-700 hover:text-cyan-400" : "text-stone-400 hover:text-stone-600"}`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={`text-xs text-center border p-2 rounded-lg flex items-center justify-center animate-shake theme-transition
                ${isDark ? "bg-red-900/20 border-red-500/50 text-red-400" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
                <AlertTriangle size={14} className="mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isHinging}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 theme-transition
                ${isDark 
                  ? "bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] ring-cyan-500" 
                  : "text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 ring-amber-500"}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-[10px] uppercase tracking-widest theme-transition ${isDark ? "text-cyan-800" : "text-stone-400"}`}>
              Demo Credentials: <span className={isDark ? "text-cyan-500 font-bold" : "text-stone-600 font-bold"}>admin</span> / <span className={isDark ? "text-cyan-500 font-bold" : "text-stone-600 font-bold"}>password123</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

/**
 * DASHBOARD COMPONENT
 */
const Dashboard = ({ onLogout, isDark, toggleTheme }) => {
  // --- STATE MANAGEMENT ---
  const [machineState, setMachineState] = useState('IDLE');
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalCycles, setTotalCycles] = useState(124);
  const [lastCycleTime, setLastCycleTime] = useState(45.2);
  const [rejectCount, setRejectCount] = useState(3);
  const [isRunning, setIsRunning] = useState(true);
  const [dataStream, setDataStream] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tempDeviation, setTempDeviation] = useState(0);
  const [pressureDeviation, setPressureDeviation] = useState(0);
  const [healthIndex, setHealthIndex] = useState(85);
  
  const currentTemp = useRef(25);
  const currentPressure = useRef(0);

  // --- PHYSICS SIMULATION LOOP ---
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhaseTime(prev => prev + 1);

      let nextState = machineState;
      let phaseDuration = CYCLE_PHASES[machineState].duration;

      if (phaseTime >= phaseDuration) {
        setPhaseTime(0);
        switch (machineState) {
          case 'IDLE': nextState = 'CLOSING'; break;
          case 'CLOSING': nextState = 'HEATING'; break;
          case 'HEATING': nextState = 'PRESSING'; break;
          case 'PRESSING': nextState = 'COOLING'; break;
          case 'COOLING': nextState = 'OPENING'; break;
          case 'OPENING': 
            nextState = 'IDLE'; 
            setTotalCycles(c => c + 1);
            setLastCycleTime(Object.values(CYCLE_PHASES).reduce((acc, val) => acc + val.duration, 0) + (Math.random() * 2 - 1));
            break;
          default: nextState = 'IDLE';
        }
        setMachineState(nextState);
      }

      // Physics Math
      let targetT = 25;
      let heatingRate = 0.0;
      
      if (['HEATING', 'PRESSING'].includes(machineState)) {
        targetT = TARGET_TEMP;
        heatingRate = 0.8;
      } else if (machineState === 'COOLING') {
        targetT = 60;
        heatingRate = 0.5;
      } else {
        targetT = 100;
        heatingRate = 0.1;
      }

      const noise = (Math.random() - 0.5) * 1.5;
      const predictedT = currentTemp.current + (targetT - currentTemp.current) * (heatingRate * 0.2);
      currentTemp.current = currentTemp.current + (targetT - currentTemp.current) * (heatingRate * 0.15) + (noise * 0.1);

      // Calculate temperature deviation (%)
      let tempDev = 0;
      if (machineState === 'HEATING' || machineState === 'PRESSING') {
        tempDev = ((currentTemp.current - TARGET_TEMP) / TARGET_TEMP) * 100;
        setTempDeviation(tempDev);
        
        // Alert if deviation exceeds ±10%
        if (Math.abs(tempDev) > TEMP_TOLERANCE) {
          if (currentTemp.current < TEMP_WARNING_THRESHOLD) {
            addAlert(`🔴 Temperature Low: ${currentTemp.current.toFixed(1)}°C (Dev: ${tempDev.toFixed(1)}%)`, 'critical');
            setRejectCount(c => c + (Math.random() > 0.8 ? 1 : 0));
          } else {
            addAlert(`🟡 Temperature Deviation: ${tempDev.toFixed(1)}% (Set: ${TARGET_TEMP}°C)`, 'warning');
          }
        }
      }

      let targetP = 0;
      if (machineState === 'CLOSING') targetP = 50;
      if (['HEATING', 'PRESSING'].includes(machineState)) targetP = TARGET_PRESSURE;
      if (machineState === 'OPENING') targetP = 0;
      
      const pressureRate = 0.3; 
      currentPressure.current = currentPressure.current + (targetP - currentPressure.current) * pressureRate + noise;

      // Calculate pressure deviation (%)
      let pressureDev = 0;
      if (machineState === 'PRESSING') {
        pressureDev = ((currentPressure.current - TARGET_PRESSURE) / TARGET_PRESSURE) * 100;
        setPressureDeviation(pressureDev);
        
        // Alert if deviation exceeds ±10%
        if (Math.abs(pressureDev) > PRESSURE_TOLERANCE && currentPressure.current < TARGET_PRESSURE * 0.9) {
          addAlert(`🔴 Pressure Loss: ${currentPressure.current.toFixed(1)} Bar (Dev: ${pressureDev.toFixed(1)}%)`, 'critical');
          setRejectCount(c => c + (Math.random() > 0.7 ? 1 : 0));
        }
      }

      // Vibration analysis with industrial thresholds
      let vibration = 2 + Math.random() * 2;
      let vibrationAlert = null;
      
      if (machineState === 'PRESSING') {
        if (Math.random() > 0.92) {
          vibration = 6 + Math.random() * 4; // Critical vibration
          vibrationAlert = 'critical';
          addAlert(`🔴 High Vibration: ${vibration.toFixed(2)} mm/s (Critical)`, 'critical');
          setRejectCount(c => c + (Math.random() > 0.6 ? 1 : 0));
        } else if (Math.random() > 0.88) {
          vibration = 4.5 + Math.random() * 1; // Warning vibration
          vibrationAlert = 'warning';
          addAlert(`🟡 Vibration Warning: ${vibration.toFixed(2)} mm/s (Safe: <${VIBRATION_SAFE} mm/s)`, 'warning');
        }
      }

      const newDataPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        timestamp: Date.now(),
        temp: parseFloat(currentTemp.current.toFixed(1)),
        predictedTemp: parseFloat(predictedT.toFixed(1)),
        pressure: parseFloat(currentPressure.current.toFixed(1)),
        vibration: parseFloat(vibration.toFixed(1)),
        state: machineState,
        tempDeviation: parseFloat(tempDev.toFixed(1)),
        pressureDeviation: parseFloat(pressureDev.toFixed(1)),
        vibrationStatus: vibrationAlert
      };

      // Update health index based on deviations and vibration
      setHealthIndex(prev => {
        let health = 100;
        // Temperature deviation impact
        if (Math.abs(tempDev) > TEMP_TOLERANCE) health -= 10;
        if (Math.abs(tempDev) > TEMP_TOLERANCE * 1.5) health -= 10;
        // Pressure deviation impact
        if (Math.abs(pressureDev) > PRESSURE_TOLERANCE) health -= 10;
        // Vibration impact
        if (vibration > VIBRATION_CRITICAL) health -= 20;
        else if (vibration > VIBRATION_WARNING) health -= 10;
        
        return Math.max(50, Math.min(100, health + (Math.random() - 0.5) * 2));
      });

      setDataStream(prev => {
        const newStream = [...prev, newDataPoint];
        if (newStream.length > 60) newStream.shift();
        return newStream;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, machineState, phaseTime]);

  const addAlert = (msg, type) => {
    setAlerts(prev => {
      if (prev.length > 0 && prev[0].msg === msg && (Date.now() - prev[0].time < 5000)) return prev;
      return [{ msg, type, time: Date.now() }, ...prev].slice(0, 10);
    });
  };

  // Get machine status based on temperature and operation phase
  const getMachineStatus = () => {
    if (!isRunning) return { label: 'Stopped', color: 'gray' };
    if (machineState === 'IDLE') return { label: 'Idle', color: 'gray' };
    if (machineState === 'HEATING' && currentTemp.current < TEMP_WARNING_THRESHOLD) {
      return { label: 'Heating Phase', color: 'orange' };
    }
    if (Math.abs(tempDeviation) > TEMP_TOLERANCE || Math.abs(pressureDeviation) > PRESSURE_TOLERANCE) {
      return { label: 'Warning', color: 'yellow' };
    }
    if (machineState === 'PRESSING' && healthIndex < 70) {
      return { label: 'Critical', color: 'red' };
    }
    return { label: 'Optimal', color: 'green' };
  };

  const status = getMachineStatus();

  const KpiCard = ({ title, value, unit, icon: Icon, colorClass, darkColorClass, trend }) => (
    <GlassCard className="p-6 flex flex-col justify-between group h-32 relative" isDark={isDark}>
      <div className={`absolute top-4 right-4 p-2 rounded-full theme-transition 
        ${isDark ? `bg-opacity-20 ${darkColorClass.replace('text-', 'bg-').replace('400', '900')}` : `bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}`}>
        <Icon size={24} className={`theme-transition ${isDark ? darkColorClass : colorClass}`} />
      </div>
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 theme-transition ${isDark ? "text-cyan-600" : "text-stone-500"}`}>{title}</h3>
        <div className="flex items-baseline mt-1">
          <span className={`text-3xl tracking-tight theme-transition ${isDark ? "font-bold text-gray-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" : "font-light text-stone-800"}`}>{value}</span>
          <span className={`ml-1 text-sm font-medium theme-transition ${isDark ? "text-cyan-700" : "text-stone-500"}`}>{unit}</span>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-xs font-medium mt-auto">
          <span className={`px-1.5 py-0.5 rounded border theme-transition
            ${isDark 
              ? (trend > 0 ? 'text-green-400 border-green-500/50 bg-green-900/30' : 'text-red-400 border-red-500/50 bg-red-900/30') 
              : (trend > 0 ? 'text-emerald-700 bg-emerald-100 border-white' : 'text-rose-700 bg-rose-100 border-white')}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className={`ml-2 theme-transition ${isDark ? "text-cyan-800" : "text-stone-400"}`}>vs model</span>
        </div>
      )}
    </GlassCard>
  );

  const StatusBadge = ({ state }) => {
    // Dynamic Colors based on mode
    const getColors = (s) => {
      if (isDark) {
        // Neon Colors
        const map = {
          IDLE: 'bg-stone-800 text-stone-400 border-stone-700',
          CLOSING: 'bg-blue-900/40 text-blue-400 border-blue-500/50',
          HEATING: 'bg-orange-900/40 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(251,146,60,0.3)]',
          PRESSING: 'bg-green-900/40 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.4)] animate-pulse',
          COOLING: 'bg-cyan-900/40 text-cyan-400 border-cyan-500/50',
          OPENING: 'bg-indigo-900/40 text-indigo-400 border-indigo-500/50',
        };
        return map[s] || map.IDLE;
      } else {
        // Champagne Colors
        const map = {
          IDLE: 'bg-stone-200 text-stone-600 border-stone-300',
          CLOSING: 'bg-blue-100 text-blue-700 border-blue-200',
          HEATING: 'bg-amber-100 text-amber-700 border-amber-200',
          PRESSING: 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-md animate-pulse',
          COOLING: 'bg-cyan-100 text-cyan-700 border-cyan-200',
          OPENING: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
        return map[s] || map.IDLE;
      }
    };

    return (
      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border theme-transition ${getColors(state)}`}>
        {CYCLE_PHASES[state]?.label || state}
      </span>
    );
  };

  // Chart Colors
  const chartColors = {
    predTemp: isDark ? '#fbbf24' : '#fbbf24', // Amber
    actTemp: isDark ? '#f87171' : '#ea580c', // Neon Red / Orange
    pressure: isDark ? '#22d3ee' : '#0284c7', // Cyan / Blue
    grid: isDark ? '#334155' : '#e5e7eb',
    textMain: isDark ? '#94a3b8' : '#a8a29e',
    textHighlight: isDark ? '#cbd5e1' : '#57534e',
    tooltipBg: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    tooltipBorder: isDark ? '#22d3ee' : '#fff',
    refLine: isDark ? '#f472b6' : '#f87171',
  };

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 relative overflow-hidden theme-transition animate__animated animate__fadeIn
      ${isDark ? 'bg-[#050505] text-cyan-50' : 'bg-[#F5F5DC] text-stone-800'}`}>
      
      <BackgroundAmbience isDark={isDark} />

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 pb-4">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className={`p-3 rounded-2xl shadow-sm border theme-transition
            ${isDark ? 'bg-black/60 border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'bg-gradient-to-br from-amber-100 to-white border-white'}`}>
            <Droplets size={24} className={isDark ? "text-cyan-400" : "text-amber-700"} />
          </div>
          <div>
            <h1 className={`text-3xl tracking-tight theme-transition ${isDark ? "font-light text-gray-100" : "font-light text-stone-800"}`}>
              Press-01 <span className={`font-semibold theme-transition ${isDark ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.6)]" : "text-amber-700"}`}>Monitor</span>
            </h1>
            <p className={`text-xs font-medium tracking-wide uppercase theme-transition ${isDark ? "text-cyan-700" : "text-stone-500"}`}>IoT Compression Molding • {isDark ? "Cyber Neon" : "Liquid Glass"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className={`text-xs uppercase tracking-widest theme-transition ${isDark ? "text-cyan-800" : "text-stone-400"}`}>System Status</span>
            <span className={`font-bold text-sm flex items-center px-3 py-1 rounded-full border theme-transition
              ${isDark ? "text-green-400 bg-black/40 border-green-500/30" : "text-emerald-700 bg-white bg-opacity-60 border-white"}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              ONLINE
            </span>
          </div>

           {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-xl backdrop-blur-md border shadow-sm transition-all theme-transition
              ${isDark ? 'bg-black/50 border-cyan-500/50 text-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-white/50 border-white/60 text-amber-600 hover:bg-white/80'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`p-3 rounded-xl backdrop-blur-md border shadow-sm transition-all theme-transition
              ${isRunning 
                ? (isDark ? 'bg-black/50 border-cyan-500/30 text-cyan-600 hover:text-cyan-400' : 'bg-white bg-opacity-50 text-stone-600 border-white hover:bg-opacity-80')
                : (isDark ? 'bg-red-900/30 border-red-500/50 text-red-500' : 'bg-rose-100 text-rose-600 border-rose-200')}`}
          >
            <Power size={20} />
          </button>
          <button 
            onClick={onLogout}
            className={`p-3 rounded-xl backdrop-blur-md border shadow-sm transition-all theme-transition hover:text-rose-600
              ${isDark ? 'bg-black/50 border-cyan-500/30 text-cyan-700' : 'bg-white bg-opacity-50 border-white text-stone-600 hover:bg-opacity-80'}`}
            title="Logout"
          >
             <Lock size={20} />
          </button>
        </div>
      </div>

      {/* TOP ROW: KPIs */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Mold Temperature" 
          value={dataStream.length > 0 ? dataStream[dataStream.length-1].temp : '--'} 
          unit="°C" 
          icon={Thermometer} 
          isDark={isDark}
          colorClass="text-orange-600"
          darkColorClass="text-orange-400"
          trend={tempDeviation.toFixed(1)}
        />
        <KpiCard 
          title="Target Hydraulic Pressure" 
          value={dataStream.length > 0 ? dataStream[dataStream.length-1].pressure : '--'} 
          unit="Bar" 
          icon={Gauge} 
          isDark={isDark}
          colorClass="text-sky-600"
          darkColorClass="text-cyan-400"
          trend={pressureDeviation.toFixed(1)}
        />
        <KpiCard 
          title="Cycle Phase Time" 
          value={phaseTime} 
          unit="s" 
          icon={Clock} 
          isDark={isDark}
          colorClass="text-indigo-600"
          darkColorClass="text-purple-400"
        />
        <KpiCard 
          title="Total Output" 
          value={totalCycles} 
          unit="Parts" 
          icon={CheckCircle} 
          isDark={isDark}
          colorClass="text-emerald-600"
          darkColorClass="text-green-400"
        />
      </div>

      {/* MIDDLE ROW: VISUALIZATION */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* LEFT: Machine Physics (Digital Twin) */}
        <GlassCard className="lg:col-span-2 p-6" isDark={isDark}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-lg font-bold flex items-center theme-transition ${isDark ? "text-gray-100" : "text-stone-700"}`}>
                <TrendingUp size={20} className={`mr-2 theme-transition ${isDark ? "text-cyan-400" : "text-amber-600"}`}/> 
                Thermal Dynamics
              </h2>
              <p className={`text-xs mt-1 theme-transition ${isDark ? "text-cyan-700" : "text-stone-500"}`}>Real-time Sensor Data vs. Mathematical Model</p>
            </div>
            <StatusBadge state={machineState} />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataStream}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis 
                  dataKey="time" 
                  tick={{fill: chartColors.textMain, fontSize: 10}} 
                  interval={10} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{fill: chartColors.actTemp, fontSize: 10, fontWeight: 500}} 
                  domain={[0, 200]} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{fill: chartColors.pressure, fontSize: 10, fontWeight: 500}} 
                  domain={[0, 250]}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    backdropFilter: 'blur(8px)', 
                    borderRadius: '12px', 
                    border: `1px solid ${chartColors.tooltipBorder}`, 
                    boxShadow: isDark ? '0 0 15px rgba(0,255,255,0.1)' : '0 4px 12px rgba(0,0,0,0.05)', 
                    color: chartColors.textHighlight 
                  }}
                  itemStyle={{ fontSize: '12px', color: chartColors.textMain }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="predictedTemp" 
                  stroke={chartColors.predTemp} 
                  strokeWidth={isDark ? 2 : 3} 
                  strokeDasharray="4 4" 
                  dot={false} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temp" 
                  stroke={chartColors.actTemp} 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: chartColors.actTemp, stroke: isDark ? '#fff' : 'none' }}
                />
                <Line 
                  yAxisId="right"
                  type="stepAfter" 
                  dataKey="pressure" 
                  stroke={chartColors.pressure} 
                  strokeWidth={2} 
                  dot={false} 
                  strokeOpacity={0.7}
                />
                <ReferenceLine yAxisId="left" y={TARGET_TEMP} stroke={chartColors.refLine} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* RIGHT: Diagnostics */}
        <div className="space-y-6">
          
          <GlassCard className="p-6" isDark={isDark}>
            <h2 className={`text-sm font-bold mb-4 flex items-center theme-transition ${isDark ? "text-gray-300" : "text-stone-600"}`}>
              <Zap size={16} className={`mr-2 theme-transition ${isDark ? "text-yellow-400" : "text-amber-500"}`}/> 
              Vibration Analysis
            </h2>
            <div className="h-32 w-full mb-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={dataStream.slice(-20)}>
                   <defs>
                     <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={isDark ? "#fbbf24" : "#d97706"} stopOpacity={0.3}/>
                       <stop offset="95%" stopColor={isDark ? "#fbbf24" : "#d97706"} stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke={isDark ? "#fbbf24" : "#d97706"} 
                    fill="url(#colorVib)" 
                    strokeWidth={2}
                    isAnimationActive={false}
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className={`text-xs font-mono text-center rounded-full py-1.5 border mb-3 theme-transition ${
              dataStream.length > 0 && dataStream[dataStream.length-1].vibration > VIBRATION_CRITICAL ? 
                (isDark ? "text-red-400 bg-red-900/20 border-red-500/30" : "text-rose-600 bg-rose-100 border-rose-200") :
              dataStream.length > 0 && dataStream[dataStream.length-1].vibration > VIBRATION_WARNING ?
                (isDark ? "text-yellow-400 bg-yellow-900/20 border-yellow-500/30" : "text-amber-600 bg-amber-100 border-amber-200") :
                (isDark ? "text-green-400 bg-green-900/20 border-green-500/30" : "text-emerald-600 bg-emerald-100 border-emerald-200")
            }`}>
              Current: {dataStream.length > 0 ? dataStream[dataStream.length-1].vibration.toFixed(2) : 0} mm/s
            </div>
            <div className={`text-[10px] space-y-1 p-2 rounded border-l-2 theme-transition ${isDark ? "bg-black/30 border-l-cyan-500 text-cyan-300" : "bg-white/50 border-l-amber-500 text-stone-600"}`}>
              <div>🟢 Safe: &lt; {VIBRATION_SAFE} mm/s</div>
              <div>🟡 Warning: {VIBRATION_WARNING} – {VIBRATION_CRITICAL} mm/s</div>
              <div>🔴 Critical: &gt; {VIBRATION_CRITICAL} mm/s</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex-1 min-h-[200px] flex flex-col" isDark={isDark}>
            <h2 className={`text-sm font-bold mb-4 flex items-center theme-transition ${isDark ? "text-gray-300" : "text-stone-600"}`}>
              <AlertTriangle size={16} className={`mr-2 theme-transition ${isDark ? "text-red-400" : "text-rose-500"}`}/> 
              Real-Time Event Log
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {alerts.length === 0 && (
                <div className={`text-xs italic text-center py-4 theme-transition ${isDark ? "text-cyan-800" : "text-stone-400"}`}>✓ System Operating Normally</div>
              )}
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-3 rounded-lg text-xs flex items-start gap-2 shadow-sm border theme-transition
                  ${alert.type === 'critical' 
                    ? (isDark ? 'bg-red-900/30 border-red-500/50 text-red-300' : 'bg-rose-50 border-rose-200 text-rose-700')
                    : alert.type === 'warning'
                    ? (isDark ? 'bg-orange-900/30 border-orange-500/50 text-orange-300' : 'bg-amber-50 border-amber-200 text-amber-800')
                    : (isDark ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-800')
                  }`}>
                  <span className="font-mono opacity-70 text-[10px] whitespace-nowrap">
                    {new Date(alert.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                  </span>
                  <span className="flex-1 break-words">{alert.msg}</span>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>

      {/* BOTTOM ROW: Footer */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5" isDark={isDark}>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 theme-transition ${isDark ? "text-cyan-700" : "text-stone-400"}`}>Target Parameters</h3>
          <div className={`space-y-2 text-sm theme-transition ${isDark ? "text-gray-400" : "text-stone-600"}`}>
            <div className={`flex justify-between border-b pb-1 theme-transition ${isDark ? "border-gray-800" : "border-stone-200 border-opacity-50"}`}><span className="text-xs">Set Temperature</span> <span className={`font-mono font-bold ${isDark ? "text-gray-200" : "text-stone-800"}`}>{TARGET_TEMP}°C</span></div>
            <div className={`flex justify-between border-b pb-1 theme-transition ${isDark ? "border-gray-800" : "border-stone-200 border-opacity-50"}`}><span className="text-xs">Target Hydraulic Pressure</span> <span className={`font-mono font-bold ${isDark ? "text-gray-200" : "text-stone-800"}`}>{TARGET_PRESSURE} Bar</span></div>
            <div className={`flex justify-between border-b pb-1 theme-transition ${isDark ? "border-gray-800" : "border-stone-200 border-opacity-50"}`}><span className="text-xs">Vulcanization Time</span> <span className={`font-mono font-bold ${isDark ? "text-gray-200" : "text-stone-800"}`}>15s</span></div>
            <div className="flex justify-between"><span className="text-xs">Tolerance Band</span> <span className={`font-mono text-xs font-bold ${isDark ? "text-cyan-400" : "text-amber-600"}`}>±{TEMP_TOLERANCE}%</span></div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" isDark={isDark}>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 theme-transition ${isDark ? "text-cyan-700" : "text-stone-400"}`}>Production Efficiency</h3>
          <div className={`space-y-2 text-sm theme-transition ${isDark ? "text-gray-400" : "text-stone-600"}`}>
            <div className={`flex justify-between border-b pb-1 theme-transition ${isDark ? "border-gray-800" : "border-stone-200 border-opacity-50"}`}><span className="text-xs">Average Cycle Time</span> <span className={`font-mono font-bold ${isDark ? "text-gray-200" : "text-stone-800"}`}>{lastCycleTime.toFixed(1)}s</span></div>
            <div className={`flex justify-between border-b pb-1 theme-transition ${isDark ? "border-gray-800" : "border-stone-200 border-opacity-50"}`}><span className="text-xs">Overall Equipment Effectiveness</span> <span className={`font-mono font-bold ${isDark ? "text-green-400" : "text-emerald-600"}`}>92%</span></div>
            <div className="flex justify-between"><span className="text-xs">Reject Count</span> <span className={`font-mono font-bold ${rejectCount > 5 ? (isDark ? "text-red-400" : "text-rose-500") : (isDark ? "text-gray-200" : "text-stone-800")}`}>{rejectCount}</span></div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" isDark={isDark}>
           <div>
             <div className={`text-[10px] uppercase tracking-widest mb-2 theme-transition ${isDark ? "text-cyan-700" : "text-stone-400"}`}>Predictive Maintenance Health Index</div>
             <div className={`text-xl font-light mb-3 flex items-center theme-transition ${isDark ? "text-gray-200" : "text-stone-700"}`}>
               <Activity size={18} className={`mr-2 theme-transition ${
                 healthIndex >= 80 ? (isDark ? "text-green-400" : "text-emerald-500") :
                 healthIndex >= 60 ? (isDark ? "text-yellow-400" : "text-amber-500") :
                 (isDark ? "text-red-400" : "text-rose-500")
               }`}/>
               {healthIndex >= 80 ? 'Healthy' : healthIndex >= 60 ? 'Caution' : 'At Risk'}
             </div>
             <div className={`w-full h-2 rounded-full overflow-hidden theme-transition ${isDark ? "bg-gray-800" : "bg-stone-200"}`}>
               <div 
                 className={`h-full rounded-full shadow-lg transition-all ${
                   healthIndex >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                   healthIndex >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" :
                   "bg-gradient-to-r from-red-400 to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                 }`}
                 style={{ width: `${healthIndex}%` }}
               />
             </div>
           </div>
           <div className={`text-[10px] mt-3 font-medium theme-transition ${isDark ? "text-gray-500" : "text-stone-500"}`}>Status: <span className={`${
             status.color === 'green' ? (isDark ? 'text-green-400' : 'text-emerald-600') :
             status.color === 'yellow' ? (isDark ? 'text-yellow-400' : 'text-amber-600') :
             status.color === 'orange' ? (isDark ? 'text-orange-400' : 'text-orange-600') :
             status.color === 'red' ? (isDark ? 'text-red-400' : 'text-rose-600') :
             (isDark ? 'text-gray-400' : 'text-stone-500')
           } font-bold`}>{status.label}</span></div>
        </GlassCard>
      </div>

    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHinging, setIsHinging] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default: Light Mode
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleLoginSuccess = () => {
    setIsHinging(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsHinging(false);
    }, 2000);
  };

  const toggleTheme = () => {
    // 1. Fade Out (0.5s duration)
    setIsContentVisible(false);
    
    setTimeout(() => {
      // 2. Wait in invisible state for 0.5s (The "disappear" phase)
      setTimeout(() => {
        // 3. Switch Theme & Fade In
        setIsDark(!isDark);
        setIsContentVisible(true);
      }, 500); 
    }, 500); // Matches CSS transition duration
  };

  return (
    <>
      <AnimationStyles />
      <div className={`transition-opacity duration-500 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        {isAuthenticated ? (
          <Dashboard 
            onLogout={() => setIsAuthenticated(false)} 
            isDark={isDark} 
            toggleTheme={toggleTheme}
          />
        ) : (
          <LoginScreen 
            onLogin={handleLoginSuccess} 
            isHinging={isHinging} 
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        )}
      </div>
    </>
  );
}