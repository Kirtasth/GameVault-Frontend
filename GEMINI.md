# GameVault Frontend Guidelines

This project is a modern Angular standalone application.

## 🚀 Tech Stack

- **Framework**: Angular 21 (Standalone Components)
- **State Management**: **Angular Signals** (`signal()`, `computed()`)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + TestBed
- **Deployment**: Nginx (via Docker)

## 💻 Shell Environment

- **Git Workflow**: NEVER use git tools or commands (status, add, commit, push, branch, etc.) unless explicitly told to do so by the user for a specific task. The user will handle all Git operations manually.
- **Terminal**: ALWAYS use **PowerShell** for executing shell commands in this project.
- **Commands**: ALWAYS use `ng` instead of `npm run` for commands that the Angular CLI supports (e.g., `ng lint`, `ng test`, `ng build`).
- **Testing**: ALWAYS run `ng test` with the `--no-watch` flag to ensure a single execution.
- **Planning**: Do NOT create a plan unless explicitly told to. Just implement the solutions directly.
- **Browser Features**: Only show features in the web browser if explicitly requested by the user.

## 🛠️ Specialized AI Skills

- `angular-developer`: Creating components, signals, forms, and following Angular best practices.
- `angular-new-app`: Creating new standalone applications.

## 🎨 Frontend Conventions

- **State Management**: ALWAYS use signals for reactivity. Avoid `RxJS` unless necessary for complex streams.
- **Styling**: Prefer Tailwind CSS classes. Follow a mobile-first design approach.
- **Components**: Standalone only. No `NgModules`.
- **Testing**: Run `ng test` and `ng lint` to verify changes.

## 📁 Project Structure

- `core/`: Shared models, services (e.g., `BackendService`), and guards.
- `features/`: Domain-specific components and routes.
- `assets/`: Static assets.
- `environments/`: Project configuration.

## 🧪 Common Commands

- `ng serve`: Run development server.
- `ng test`: Run Angular tests.
- `ng lint`: Run Angular lint.
- `ng build`: Build for production.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python -m graphify update .` to keep the graph current (AST-only, no API cost)
