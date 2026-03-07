# 🎮 GameVault

> A powerful and easy-to-use game key store simulation.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

---

## 📖 About The Project

**GameVault** is a personal project designed to simulate a modern digital game store. The goal is to build a platform that is intuitive for users while offering powerful features for developers and administrators.

This repository focuses on the **Frontend** of the application.

### 🔑 Key Features & Rules

*   **User Roles**:
    *   👤 **USER**: Can log in/out, browse the catalog, and purchase games via Stripe.
    *   🛠️ **DEVELOPER**: Inherits User permissions but can also publish new games (upload images, descriptions, etc.).
    *   🛡️ **ADMIN**: Has full control and permissions over the entire application.
*   **Payments**: Integrated securely with the **Stripe API**.
*   **Data**: All data is managed by a dedicated Backend API.
*   **Security**: Automatic redirection for unknown routes (Login for guests, Dashboard for authenticated users).

---

## 🛠️ Tech Stack

*   **Framework**: [Angular 21](https://angular.io/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)

---

## 🎨 Design & Style

The application features a clean, simple, and modern interface, accented with a **Peacock** color palette to ensure a pleasant user experience.

---

## 📱 Pages

*   🔐 **Authentication**
    *   Register
    *   Login
*   👤 **User Area**
    *   Dashboard
    *   Catalog
*   🛠️ **Developer Area**
    *   Dashboard (Game Management)
*   🛡️ **Admin Area**
    *   Dashboard (System Administration)

---

## 🚀 Getting Started

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
