# Ancestral Essence

Welcome to the **Ancestral Essence** repository! This project is structured as a full-stack monorepo (managed by `pnpm`) containing the pet-wellness frontend application and its supporting backend API server.

## 🏗️ Architecture & Technology Stack

The repository is divided into specialized packages and applications for modularity and shared dependencies.

### Frontend (`artifacts/pet-wellness`)
A modern, responsive e-commerce and wellness application tailored for pet care.
- **Framework:** React + Vite (TypeScript)
- **Routing:** `wouter` for lightweight client-side routing
- **Styling:** Tailwind CSS + Radix UI components (accessible, unstyled primitives)
- **Forms & Validation:** `react-hook-form` and `zod`
- **Integrations:** `@supabase/supabase-js` for backend-as-a-service functionalities and `@cashfreepayments/cashfree-js` for seamless payment processing.
- **Other tools:** `recharts` for data visualization, `embla-carousel-react` / `swiper` for sliders.

### Backend (`artifacts/api-server`)
A robust backend API handling core business logic, database transactions, and secure integrations.
- **Framework:** Express.js (Node.js) built with `esbuild`
- **Database & ORM:** `drizzle-orm` interfacing with PostgreSQL via the shared `@workspace/db` module
- **Validation:** Shared `@workspace/api-zod` validation schemas
- **Logging:** High-performance logging using `pino` and `pino-http`

### Shared Libraries (`lib/`)
Shared configurations, database schemas, and TypeScript interfaces used across both the frontend and backend to ensure type-safety and DRY principles.

---

## 📂 Project Structure

```
Ancestral-Essence/
├── artifacts/
│   ├── pet-wellness/     # Vite + React Frontend Application
│   └── api-server/       # Express.js Backend API Service
├── lib/                  # Shared libraries, utilities, and DB schemas
├── scripts/              # Project-wide utility scripts
├── pnpm-workspace.yaml   # Monorepo workspace configuration
└── package.json          # Root package configuration
```

---

## 🚀 Setup & Development Workflow

### Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (Package manager)
- PostgreSQL database (for the API server)
- Supabase project (for frontend authentication/storage)

### 1. Installation
Clone the repository and install all dependencies from the root directory:
```bash
git clone https://github.com/farukhetro/Ancestral-Essence.git
cd Ancestral-Essence
pnpm install
```

### 2. Environment Variables
You will need to set up your `.env` files for both the frontend and backend.
- **Frontend**: Navigate to `artifacts/pet-wellness` and configure your Supabase URL, Anon Key, and Cashfree configurations.
- **Backend**: Navigate to `artifacts/api-server` and configure your Database URL and server port (default 5000).

### 3. Running the Development Servers

You can run the applications individually from their respective directories:

**Frontend:**
```bash
cd artifacts/pet-wellness
pnpm run dev
```

**Backend:**
```bash
cd artifacts/api-server
pnpm run dev
```

### 4. Build & Typechecking
To verify types and build all projects from the root directory:
```bash
# Run TypeScript compilation checks across all workspaces
pnpm run typecheck

# Build all applications and shared libraries
pnpm run build
```

---

## 🔒 License
This project is licensed under the MIT License.
