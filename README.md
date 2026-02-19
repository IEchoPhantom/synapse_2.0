# 🤖 SYNAPSE 2.0
## IoT-Enabled Compression Molding Machine Monitoring Dashboard

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.10-38B2AC?logo=tailwindcss) ![Recharts](https://img.shields.io/badge/Recharts-2.12.7-8884d8) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technical Stack](#technical-stack)
- [Dashboard Components](#dashboard-components)
- [Mathematical Models](#mathematical-models)
- [Data Structures](#data-structures)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Key Parameters](#key-parameters)
- [Alerts & Monitoring](#alerts--monitoring)
- [Performance Metrics](#performance-metrics)

---

## 🎯 Overview

**SYNAPSE 2.0** is a professional-grade real-time monitoring and simulation platform for rubber compression molding machines. It provides:

✅ **Live Sensor Streaming** - Real-time temperature, pressure, and cycle time data  
✅ **Physics-Based Models** - Accurate thermal and pressure dynamics  
✅ **Predictive Maintenance** - Health index calculation with deviation tracking  
✅ **Industrial Thresholds** - Safe, warning, and critical operation zones  
✅ **Smart Alerts** - Priority-based event logging with timestamps  
✅ **Dark/Light Themes** - Professional UI with smooth transitions  

**Perfect for**: Engineering projects, IoT system design, manufacturing optimization, and academic evaluation.

---

## ✨ Features

### 🎛️ Real-Time Dashboard
- **KPI Cards**: Temperature, pressure, cycle time, total output with instant deviation tracking
- **Thermal Dynamics Chart**: Dual-axis visualization of sensor data vs. mathematical model
- **Vibration Analysis**: Time-series vibration monitoring with intensity classification
- **Status Badge**: Machine health status (Healthy → Warning → Critical)
- **Event Log**: Real-time alert timeline with priority ranking

### 📊 Advanced Monitoring
- **Health Index**: Weighted calculation based on temperature, pressure, vibration, and reject rate
- **OEE Calculation**: Overall Equipment Effectiveness (Availability × Performance × Quality)
- **Deviation Tracking**: Automatic calculation of current vs. target deviations for all parameters
- **Tolerance Bands**: Visual indicators for safe/warning/critical zones

### 🔧 System Overview
- **Target Parameters**: Static setpoints (Temperature: 165°C, Pressure: 180 Bar)
- **Production Efficiency**: OEE metrics and reject count tracking
- **Predictive Maintenance**: Health status with operational guidance
- **System Architecture**: Data structures, sensors, and mathematical models

### 🌓 Theme Support
- Seamless dark/light mode toggle
- Optimized colors for each theme
- Persistent state across transitions

---

## 🏗️ Architecture

```
SYNAPSE 2.0
├── React Component (Dashboard)
│   ├── State Management (hooks)
│   ├── Physics Simulation Loop
│   ├── Alert System (PriorityQueue)
│   └── UI Components (KPI Cards, Charts, Status)
├── Data Structures
│   ├── CircularBuffer (60-point rolling time-series)
│   ├── Finite State Machine (6 cycle phases)
│   ├── PriorityQueue (alert ranking)
│   └── Hash Tables (metadata)
└── Mathematical Models
    ├── Heat Transfer Dynamics
    ├── Pressure Dynamics
    ├── Health Index Calculation
    └── OEE Formula
```

---

## 🔧 Technical Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | React 18.2.0 |
| **Build Tool** | Vite 7.3.1 |
| **Styling** | Tailwind CSS 3.4.10 |
| **Charting** | Recharts 2.12.7 |
| **Icons** | Lucide React |
| **State Management** | React Hooks (useState, useRef, useEffect) |

### Development Setup
```bash
Node.js: v18+ (required)
npm: v9+
```

---

## 📊 Dashboard Components

### 1️⃣ KPI Cards (Top Row)
Displays real-time parameter values with instant deviation percentages:

| Parameter | Value | Unit | Tolerance | Status |
|-----------|-------|------|-----------|--------|
| Mold Temperature | 135.2°C | °C | ±10% | Heating |
| Hydraulic Pressure | 136.9 Bar | Bar | ±10% | Warning |
| Cycle Phase Time | 3.4s | s | - | Active |
| Total Output | 156 | Units | - | Count |

**Deviation Formula**: `Deviation (%) = (Current − Target) / Target × 100`

### 2️⃣ Thermal Dynamics Chart
- **Dual Y-Axes**: Temperature (left, °C) & Pressure (right, Bar)
- **Three Data Series**:
  - 📊 Sensor Data (orange line)
  - 📐 Mathematical Model (amber dashed line)
  - 🔹 Pressure (cyan line)
- **Reference Line**: Target temperature (165°C)
- **Interactive Tooltips**: Hover for exact values

### 3️⃣ Vibration Analysis
- **Time-Series Graph**: Historical vibration data (mm/s)
- **Color-Coded Intensity**:
  - 🟢 Safe: < 4 mm/s
  - 🟡 Warning: 5–8 mm/s
  - 🔴 Critical: > 8 mm/s
- **Gradient Fill**: Visual emphasis on intensity zones

### 4️⃣ Status & Health Section
- **Machine Status Badge**: Color-coded health status
  - 🟢 Healthy (≥85%)
  - 🟡 Degraded (75–85%)
  - 🟠 Warning (60–75%)
  - 🔴 Critical (<60%)
- **Predictive Maintenance Card**:
  - Health index percentage
  - Tolerance indicator
  - Deviation details
  - Operational guidance

### 5️⃣ Real-Time Event Log
- Timestamped alert entries
- Priority-based color coding
- Automatic filtering and recording
- Latest alerts at top

### 6️⃣ System Overview Footer
- **Sensors**: List of monitored sensors with examples
- **Models**: Mathematical equations with color-coded labels
- **Deliverables**: Project outputs and capabilities

---

## 📐 Mathematical Models

### Heat Transfer Dynamics
```
∂T/∂t = α∇²T + Q/(ρc)
```
Models transient thermal response with:
- **α**: Thermal diffusivity
- **Q**: Heat input (phase-dependent)
- **ρc**: Heat capacity

### Pressure Dynamics
```
dP/dt = (Qpump − Qleak − Qrelief)/C
```
Calculates hydraulic system response:
- **Qpump**: Pump flow rate
- **Qleak**: System leakage
- **Qrelief**: Relief valve flow
- **C**: System compliance

### Health Index Calculation
```
Health (%) = 100 − (0.4×TempDev + 0.3×PressureDev + 0.2×RejectDev + 0.1×VibrationDev)
```
Weighted penalties:
- **40%**: Temperature deviations
- **30%**: Pressure deviations
- **20%**: Rejection rate
- **10%**: Vibration severity

### Overall Equipment Effectiveness (OEE)
```
OEE (%) = Availability × Performance × Quality × 100
```
- **Availability**: Running vs. total time (70–98%)
- **Performance**: Deviation-adjusted throughput (60–95%)
- **Quality**: 1 − (Reject Count / Total Cycles), capped at 55% minimum

---

## 🗂️ Data Structures

### 1. Circular Buffer (Time-Series Storage)
- **Capacity**: 60 data points (rolling window)
- **Data**: Temperature, pressure, vibration, cycle count, deviations
- **Purpose**: Efficient memory usage with constant-time insertion
- **Update Frequency**: Every 50ms

### 2. Finite State Machine (Cycle Phases)
```
IDLE → CLOSING → HEATING → PRESSING → COOLING → OPENING → IDLE
```
- **State Labels**: Phase name and description
- **Transitions**: Time-based or condition-driven
- **Phase-Specific Setpoints**: Different target temperatures per phase

### 3. Priority Queue (Alert Management)
- **Priority Levels**: Critical (1) → Warning (2) → Info (3)
- **Max Alerts**: Last 10 events displayed
- **Deduplication**: Same alert within 5 seconds ignored
- **Timestamp**: Exact alert occurrence time

### 4. Hash Tables (Metadata)
- **SENSOR_CATALOG**: Sensor names, units, examples
- **CYCLE_PHASES**: Phase labels and descriptions
- **COLOR_MAP**: Severity → color mappings (dark/light modes)

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/IEchoPhantom/synapse-2.0.git
cd synapse-2.0

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📖 Usage

### Running the Dashboard

1. **Start the Dev Server**:
   ```bash
   npm run dev
   ```

2. **Login Screen** (Optional):
   - Default credentials: Any username/password
   - Click "Login" to access the dashboard
   - Toggle theme (Sun/Moon icon) anytime

3. **Monitor Real-Time Data**:
   - Watch KPI cards update every 50ms
   - Check charts for temperature/pressure trends
   - Monitor health index and OEE metrics
   - Review event log for alerts

4. **Interpret Status Badges**:
   - 🟢 **Healthy**: All parameters optimal
   - 🟡 **Degraded**: Minor deviations detected
   - 🟠 **Warning**: Moderate deviations, monitor closely
   - 🔴 **Critical**: Extreme deviations, action required

### Key Interactions

- **Hover over deviation %** → See calculation formula
- **Click theme toggle** → Switch between dark/light modes
- **View event log** → Track all system events with timestamps
- **Check health index** → Monitor predictive maintenance status

---

## 🎛️ Key Parameters

### Temperature Control
| Parameter | Value | Unit | Notes |
|-----------|-------|------|-------|
| **Target Setpoint** | 165 | °C | Vulcanization temperature |
| **Tolerance Band** | ±10 | % | Safe operating range |
| **Warning Threshold** | 150 | °C | Below this = heating phase |
| **Critical Upper** | 181.5 | °C | 165 + (165×10%) |
| **Critical Lower** | 148.5 | °C | 165 − (165×10%) |

### Pressure Control
| Parameter | Value | Unit | Notes |
|-----------|-------|------|-------|
| **Target Setpoint** | 180 | Bar | Pressing force |
| **Tolerance Band** | ±10 | % | Safe operating range |
| **Critical Upper** | 198 | Bar | 180 + (180×10%) |
| **Critical Lower** | 162 | Bar | 180 − (180×10%) |
| **Relief Valve** | 200 | Bar | System protection |

### Vibration Classification
| Level | Range | Status | Action |
|-------|-------|--------|--------|
| **Safe** | < 4 mm/s | ✅ Normal | Continue operation |
| **Warning** | 5–8 mm/s | ⚠️ Caution | Monitor closely |
| **Critical** | > 8 mm/s | 🔴 Alert | Intervention needed |

### Cycle Phases
| Phase | Duration | Target Temp | Description |
|-------|----------|-------------|-------------|
| **IDLE** | Variable | 120°C | Mold open, cooling |
| **CLOSING** | 2–3s | 140°C | Mold closing |
| **HEATING** | 5–8s | 165°C | Heat transfer to mold |
| **PRESSING** | 10–15s | 165°C | Vulcanization (main phase) |
| **COOLING** | 5–10s | 100°C | Pressure relief, cooling |
| **OPENING** | 2–3s | 80°C | Mold opening |

---

## 🔔 Alerts & Monitoring

### Alert Types

#### 🔴 Critical Alerts
Triggered when:
- Health Index < 60%
- Temperature deviation > ±20%
- Pressure deviation > ±20%
- Vibration > 8 mm/s

**Action Required**: Stop operation and investigate

#### 🟡 Warning Alerts
Triggered when:
- Health Index 60–75%
- Temperature deviation 15–20%
- Pressure deviation 15–20%
- Vibration 5–8 mm/s

**Action Required**: Monitor closely, plan maintenance

#### ℹ️ Info Alerts
Triggered when:
- Phase transitions
- Deviation exceeds ±10%
- Reject count increases
- OEE changes significantly

**Action**: Log and review

### Event Log Features
- ✅ Timestamp precision (milliseconds)
- ✅ Priority-based sorting
- ✅ Color-coded severity
- ✅ Automatic deduplication
- ✅ Latest 10 events visible

---

## 📈 Performance Metrics

### Health Index Weights
```
Health = 100 − [
  (0.40 × Temperature Deviation Penalty) +
  (0.30 × Pressure Deviation Penalty) +
  (0.20 × Rejection Rate Penalty) +
  (0.10 × Vibration Severity Penalty)
]
```

**Interpretation**:
- **90–100%**: Excellent condition
- **80–90%**: Good, minor maintenance planned
- **70–80%**: Fair, maintenance advised
- **60–70%**: Poor, urgent intervention needed
- **< 60%**: Critical, stop operation

### OEE Calculation
```
Availability = Running Time / Total Time
Performance = 0.95 − (ΔT% / 100 × 0.1) − (ΔP% / 100 × 0.1)
Quality = max(0.55, 1 − Rejects / Total Cycles)

OEE = Availability × Performance × Quality × 100%
```

**Target**: OEE > 75% (world-class manufacturing)

---

## 🛠️ Customization

### Modify Setpoints
Edit constants in `src/App.jsx`:
```javascript
const TARGET_TEMP = 165;        // °C
const TEMP_TOLERANCE = 10;      // ±%
const TARGET_PRESSURE = 180;    // Bar
const PRESSURE_TOLERANCE = 10;  // ±%
```

### Adjust Alert Thresholds
```javascript
const VIBRATION_SAFE = 4;       // mm/s
const VIBRATION_WARNING = 5;    // mm/s
const VIBRATION_CRITICAL = 8;   // mm/s
```

### Change Update Frequency
```javascript
const SIMULATION_INTERVAL = 50; // milliseconds
```

---

## 📚 Project Structure

```
synapse2/
├── src/
│   ├── App.jsx              # Main dashboard component
│   ├── index.css            # Global styles
│   └── main.jsx             # React entry point
├── package.json             # Dependencies
├── vite.config.js           # Build configuration
├── tailwind.config.js       # Tailwind theme
├── postcss.config.js        # PostCSS plugins
└── README.md                # Documentation
```

---

## 🎓 Educational Value

Perfect for learning:
- ✅ React state management & hooks
- ✅ Real-time data visualization (Recharts)
- ✅ Physics-based simulation
- ✅ Data structure implementation
- ✅ Industrial IoT concepts
- ✅ Manufacturing metrics (OEE, Health Index)
- ✅ Responsive UI design

---

## 📝 License

MIT License – Feel free to use, modify, and distribute!

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Improve documentation
- Enhance visualizations

---

## 📧 Contact & Support

For questions or support, please open an issue on the repository.

---

## 🎉 Acknowledgments

Built with ❤️ using:
- **React** for component architecture
- **Recharts** for stunning visualizations
- **Tailwind CSS** for responsive design
- **Vite** for lightning-fast builds
- **Lucide Icons** for beautiful UI elements

---

**Made with ❤️ for Industrial IoT Excellence**

*Last Updated: February 2026*
