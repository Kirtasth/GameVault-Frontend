# GameVault

A powerful and easy-to-use game key store simulation.

## Features

- User Roles:
  - USER: Can log in/out, browse the catalog, and purchase games via Stripe.
  - DEVELOPER: Inherits User permissions and can also publish new games.
  - ADMIN: Has full control and permissions over the entire application.
- Payments: Integrated securely with the Stripe API.
- Data Management: Managed by a dedicated Backend API.
- Security: Automatic redirection for unknown routes.
- Pages:
  - Authentication: Register and Login.
  - User Area: Dashboard and Catalog.
  - Developer Area: Dashboard and Game Management.
  - Admin Area: Dashboard and System Administration.

## Instructions

### Prerequisites

Ensure you have Node.js and the Angular CLI installed.

### Installation

Run `npm install` to install the dependencies.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
