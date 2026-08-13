# React Evaluation Suite — Multi-Module Application

A modern, high-performance React application built with **React 19**, **Vite**, **Redux Toolkit**, **React Router v7**, **AG Grid Community v36**, and **Tailwind CSS v4**. 

This single integrated application houses three independent, feature-rich functional modules accessible from a shared navigation shell:

1. **Task 1 — E-Commerce & Cart Management** (`/ecommerce`, `/ecommerce/cart`)
2. **Task 2 — Stock Portfolio Manager with AG Grid** (`/stocks`)
3. **Task 3 — Real-Time Nifty 50 & Sensex Market Feed** (`/market`)

---

## 🚀 Quick Start Guide

Follow these step-by-step instructions to set up, run, and test the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (v20+ recommended)
- **npm**: `v9.0.0` or higher

Check your installed versions by running:
```bash
node -v
npm -v
```

---

### Step-by-Step Installation & Setup

#### Step 1: Navigate to Project Root
Open your terminal and navigate to the project directory:
```bash
cd react-assessment
```

#### Step 2: Install Project Dependencies
Install all required npm dependencies:
```bash
npm install
```

#### Step 3: Start the Development Server
Launch the Vite local development server:
```bash
npm run dev
```

#### Step 4: Open in Browser
Once the development server starts, open your web browser and navigate to:
```text
http://localhost:5173
```
*Note: If port 5173 is in use, Vite will automatically select the next available port (e.g., http://localhost:5174).*

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local Vite development server with HMR. |
| `npm run build` | Builds the optimized production bundle to the `dist/` directory. |
| `npm run preview` | Runs a local web server to preview the production build in `dist/`. |
| `npm run lint` | Runs ESLint across all source files to verify code quality. |

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 (`react`, `react-dom`)
- **Build Tool & Dev Server**: Vite 8 (`vite`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Data Table Engine**: AG Grid Community 36 (`ag-grid-community`, `ag-grid-react`)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)
- **Iconography**: Lucide React (`lucide-react`)

---

## 📦 Application Modules & Features

### 🛒 Task 1: E-Commerce & Cart Management
- **Routes**: `/ecommerce` & `/ecommerce/cart`
- **Features**:
  - **Product Catalog**: Browse curated products with search, category filtering, and responsive grid layout.
  - **Product Quick View**: Interactive modal displaying detailed specifications, ratings, and stock status.
  - **Shopping Cart Grid**: Managed with AG Grid & custom controls supporting quantity adjustments, item removal, and live total price calculations.
  - **Redux Integration**: Global state management via `cartSlice`.

### 📈 Task 2: Stock Portfolio Manager
- **Route**: `/stocks`
- **Features**:
  - **Stock Search & Add**: Search stocks by symbol or company name with duplicate prevention.
  - **Interactive AG Grid**: Inline cell editing for Price, Change, Low, High, Volume, Market Cap, and Updated At.
  - **Input Validation**: Automatic validation for non-negative numbers and format safety; invalid edits are safely reverted.
  - **State Synchronization**: Immediate Redux store updates via `stockSlice` reflecting directly in the grid.

### ⚡ Task 3: Real-Time Market Feed (Nifty 50 & Sensex)
- **Route**: `/market`
- **Features**:
  - **Live WebSocket Dashboard**: Connect/Disconnect toggles for real-time market data streaming.
  - **Real-Time Price Flash**: Dynamic visual feedback (green highlight on tick increase, red highlight on tick decrease).
  - **Interactive Trend Charts**: Real-time line visualization of Nifty 50 and Sensex price histories.
  - **Redux & Connection Safety**: Transient tick state managed efficiently outside Redux state to maximize render performance.

---

## 📂 Project Architecture & Directory Structure

```text
react-assessment/
├── src/
│   ├── app/                     # Main App container, Layout shell & Router configuration
│   ├── components/              # Shared UI components (Navigation, Header, Buttons)
│   ├── modules/                 # Isolated domain modules
│   │   ├── ecommerce/           # Task 1: Pages, Components, Data & Redux slice
│   │   ├── stocks/              # Task 2: Pages, Components, AG Grid & Redux slice
│   │   └── market/              # Task 3: Pages, Components, WebSocket & Redux slice
│   ├── store/                   # Centralized Redux Toolkit store setup
│   ├── index.css                # Global styles, Tailwind imports & AG Grid theme styling
│   └── main.jsx                 # Application entry point & AG Grid module registration
├── package.json                 # Project dependencies & npm scripts
└── README.md                    # Project setup & documentation
```

---

## 🔑 Technical Design Highlights

- **Modular Architecture**: Feature modules (`ecommerce`, `stocks`, `market`) maintain strict isolation of business logic, components, and state slices.
- **AG Grid v36 Compatibility**: Global module registration via `ModuleRegistry.registerModules([AllCommunityModule])` ensures AG Grid cell editing and row operations function seamlessly.
- **Performance Optimization**: WebSocket instances and high-frequency stream controllers are kept outside Redux store state to prevent unnecessary React re-renders.

---

## 📄 License

This repository is created for React Frontend Evaluation & Assessment.
