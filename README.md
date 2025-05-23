# Geofence Editor

A React-based application for drawing, editing, and managing polygonal geofences on Google Maps. Users can create, modify, delete, and save their geofences to the browser's local storage.

## Features

* **Polygon Drawing**: Easily draw new polygons directly on the map.
* **Polygon Editing**:
    * Drag entire polygons to new locations.
    * Move individual vertices of a polygon.
    * Add new points to a polygon by dragging edge midpoints.
* **Polygon Management**:
    * Select existing polygons to edit or delete.
    * A dropdown menu lists all created polygons for easy management.
* **Persistent Storage**: Polygons are saved to the browser's `localStorage`, so your work is preserved between sessions.
* **Cancel Drawing**: Press the "Escape" key to cancel the current drawing operation.
* **Customizable Appearance**:
    * Drawing polygons appear with a red fill and stroke.
    * Polygons being edited change to a green fill and stroke for clear visual feedback.

## Tech Stack

* **React**: Core library for building the user interface.
* **@react-google-maps/api**: React wrapper for the Google Maps JavaScript API, used for map rendering and polygon functionalities.
* **HTML5 & CSS3**: For structuring and styling the application.
* **JavaScript (ES6+)**

## Project Structure

* `public/index.html`: The main HTML template.
* `src/index.js`: The entry point for the React application.
* `src/MapComponent.js`: The core component handling map display, drawing, and polygon logic.
* `src/styles.css`: Global styles for the application.

## Prerequisites

* Node.js and npm (or yarn) installed.
* A valid Google Maps JavaScript API Key with the "Maps JavaScript API" and "Drawing Library" enabled.

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/](https://github.com/){your-username}/Geofence-Editor.git
    cd Geofence-Editor
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

3.  **Add your Google Maps API Key**:
    Open `src/MapComponent.js` and replace `"YOUR_Maps_API_KEY"` with your actual API key:
    ```javascript
    <LoadScript googleMapsApiKey="YOUR_Maps_API_KEY" libraries={["drawing", "places"]}>
    ```
    **Important**: For client-side applications, the API key will be visible in the browser. Ensure you have restricted your API key in the Google Cloud Console (e.g., to your specific deployment domain) to prevent unauthorized use.

## Available Scripts

In the project directory, you can run:

* **`npm start`** or **`yarn start`**:
    Runs the app in development mode.
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
    The page will reload if you make edits. You will also see any lint errors in the console.
    *Note: This script uses `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with newer Node.js versions.*

* **`npm run build`** or **`yarn build`**:
    Builds the app for production to the `build` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.
    The build is minified and the filenames include hashes.
    *Note: This script uses `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with newer Node.js versions.*

* **`npm test`** or **`yarn test`**:
    Launches the test runner in interactive watch mode.

* **`npm run eject`** or **`yarn eject`**:
    This command will remove the single build dependency from your project. If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. This command can’t be undone.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1.  **Set the `homepage` in `package.json`**:
    Ensure the `homepage` field in your `package.json` points to your GitHub Pages URL:
    ```json
    "homepage": "http://{your-username}.github.io/Geofence-Editor",
    ```
    Replace `{your-username}` with your GitHub username.

2.  **Deploy**:
    ```bash
    npm run deploy
    ```
    This script will first build the project (`npm run build`) and then deploy the contents of the `build` folder to a `gh-pages` branch on your GitHub repository.

3.  **Configure GitHub Repository**:
    * Go to your repository settings on GitHub.
    * Navigate to the "Pages" section.
    * Ensure the source is set to "Deploy from a branch" and select the `gh-pages` branch with the `/ (root)` folder.

Your site should then be live at the URL specified in your `homepage`.
