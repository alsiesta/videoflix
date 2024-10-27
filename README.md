# Videoflix Frontend
Public repository: https://github.com/alsiesta/videoflix

Videoflix is a video streaming application built with Angular. This project allows users to browse, watch, and manage videos. 

This app uses a backend which provides a Django Backend App serving user registration, password reset, video management, and more. Download it here: https://github.com/alsiesta/videoflix-bknd


## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Execute the `start.bat` file in the root directory using the Command Line (CLI).

## Development Server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Environment Variables

As Angular project, environment variables are set in the environments directory. The **angular.json** file replaces these file for production accordingly.


## Key Directories and Files

- **.vscode/**: Contains Visual Studio Code specific settings and tasks.
- **src/**: Contains the source code of the application.
  - **app/**: Contains the main application code.
    - **app-routing.module.ts**: Defines the routes for the application.
    - **app.component.\***: The root component of the application.
    - **app.module.ts**: The main module of the application.
    - **browse/**: Contains components related to browsing videos.
    - **models/**: Contains data models used in the application.
    - **pages/**: Contains different pages of the application.
      - **home/**: Contains the home page components.
      - **videodetail/**: Contains the video detail page components.
    - **utils/**: Contains utility components like background video and video player.
  - **assets/**: Contains static assets like images.
  - **environments/**: Contains environment-specific configuration files.
  - **index.html**: The main HTML file of the application.
  - **main.ts**: The main entry point of the application.
  - **styles.scss**: Global styles for the application.
- **start.bat**: A batch file to start the development server.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **tsconfig.\***: TypeScript configuration files.
- **videoflix.code-workspace**: Workspace configuration for Visual Studio Code.
- **web.config**: Configuration file for web server settings.

## License

This project is licensed under the MIT License.

