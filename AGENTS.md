# GameVault

# The project
GameVault is a personal project. The objective is to simulate a game key store. The idea
is to build something very easy to use but very powerful.
Here we will focus on the frontend of the app. Which consists in this basic rules:
- There are 3 types of users: USER, DEVELOPER and ADMIN
- A USER is a registered user that can:
  - Log in (and have a refresh token stored)
  - Log out
  - Navigate through catalog
  - Buy games (with stripe)
- A DEVELOPER is a registered USER that also can create new games (with images, descriptions, etc.)
- A ADMIN is a user that has every permission in the app.
- All the purchases of the app will be through Stripe API.
- All the data will be stored in an already created backend API.
- All the unknown routes would be redirected to login if the user is not identified and to dashboard if the user is identified

# Frameworks
This frontend will be developed in Angular 21 with TailwindCSS

# Styles
Everything would have a nice and simple looking with peacock color.

# Pages
- Register
- Login
- USER dashboard
- USER catalog
- DEVELOPER dashboard
- ADMIN dashboard
