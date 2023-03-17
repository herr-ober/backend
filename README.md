# Backend of the Herr Ober application

## Tech-stack

- Node.js
- Express.js server

## Prerequesites

### Installations

- VSCode
- Git (it is really important that you setup git after installation with your full name and email of your GitHub Account)
- Node.js 16.x (using nvm to select that specific LTS version)
- MySQL

## Initial setup

### IDE setup

Recommended extensions (VSCode):

- DotENV (mikestead.dotenv)
- ESLint (dbaeumer.vscode-eslint)

### Environment setup

- Duplicate the `.env.example` file in the root directory and rename it to `.env`
- Change the parameters in this file to match your environment

## Useful commands

#### Install dependency packages
```bash
npm install
```

#### Migrate database
```bash
npm run migrate               // Run migrations on database
npm run migration:create      // Create new migration in codebase
```

#### Start for development
```bash
npm start
```

#### Linting
```bash
npm run lint                  // Show linting issues
npm run lint:fix              // Show and try to fix linting issues
```

#### Ends the application
```
CTRL + C
```