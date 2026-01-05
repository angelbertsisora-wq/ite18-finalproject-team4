# Virtual Art Museum

## Project Story / Concept

The Virtual Art Museum is an immersive web-based application that provides users with an interactive three-dimensional gallery experience accessible directly through their web browsers. Traditional art museums face limitations in accessibility, geographical constraints, and the ability to showcase extensive collections simultaneously. This project addresses these challenges by creating a virtual environment where users can explore curated artworks, view detailed information, and experience museum-like navigation without physical barriers.

The application aims to democratize access to art appreciation and education by combining modern web technologies with virtual reality capabilities. Users can navigate through multiple gallery rooms, interact with displayed artworks, and access comprehensive metadata including artist information, creation dates, and descriptive content. The goal is to provide an engaging, educational, and accessible platform for art exploration that bridges the gap between physical museum visits and digital art consumption.

## Project Features

- **Immersive 3D Environment**: Navigate through a multi-room virtual museum with realistic architectural elements including walls, floors, ceilings, and lighting
- **Interactive Artwork Display**: View paintings and artworks mounted on walls and displayed on free-standing panels throughout the gallery
- **3D Sculpture Exhibits**: Explore three-dimensional sculptures including David, Bernini, and Madonna models with dedicated lighting
- **Artwork Information Cards**: Click on any artwork to display detailed information cards showing title, artist, year, and description
- **Multiple Gallery Rooms**: Explore the main exhibition hall, left room, and right room, each featuring distinct collections
- **Dynamic Lighting System**: Experience realistic lighting with ambient, hemisphere, point, and spotlight sources that enhance the visual presentation
- **Collision Detection**: Raycasting-based collision system prevents users from passing through walls, artworks, and 3D models, ensuring natural movement boundaries
- **Desktop and VR Support**: Compatible with standard desktop navigation and virtual reality headsets through A-Frame's built-in VR capabilities
- **Responsive Navigation**: Use WASD controls for movement and mouse/VR controllers for interaction

## Development Stack

### Frontend Technologies
- **HTML5**: Core structure and semantic markup
- **CSS3**: Styling and visual presentation
- **JavaScript (ES6+)**: Application logic and interactivity
- **A-Frame 1.5.0**: Web-based virtual reality framework for 3D scene rendering
- **Three.js**: 3D graphics library (included with A-Frame)

### Backend Technologies
- **None**: This is a client-side only application with no server-side components

### Data Storage
- **JSON**: Static artwork metadata stored in `assets/artwork-data.json`

### Tools and Libraries
- **A-Frame Components**: Custom artwork interaction component for clickable artworks
- **Three.js Raycaster**: Collision detection system for preventing camera movement through objects
- **GLTF/GLB Models**: 3D model formats for sculptures (David, Bernini, Madonna)
- **Image Assets**: JPEG and PNG formats for textures, paintings, and frames

## Team Roles and Responsibilities

### Team 4

**Lyza Kyth Balili – Frontend Development**
- Implemented the 3D museum environment using A-Frame framework
- Designed and structured the virtual gallery layout with multiple rooms
- Created interactive artwork components and user interface elements
- Developed the artwork information card system with dynamic positioning
- Integrated lighting systems and visual effects for enhanced realism

**Irvin O. Demonguitan – Backend Development, Project Manager**
- Designed and implemented the artwork metadata JSON structure
- Developed the data loading and management system for artwork information
- Created the artwork interaction component logic for click events
- Implemented the dynamic card generation system based on artwork data
- Ensured proper data flow between JSON storage and frontend display

**Angelbert Sisora – Support Frontend and Documentation**
- Assisted with frontend styling and CSS implementation
- Created and maintained project documentation
- Contributed to user interface refinement and visual consistency
- Supported testing and quality assurance of interactive features
- Coordinated documentation efforts including README creation

## Setup and Installation Guide

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari) with WebGL support
- A local web server (required for loading assets due to CORS restrictions)
- Node.js and npm (optional, for using a development server)

**Note:** The following commands work on Windows (PowerShell/Command Prompt), macOS, and Linux. Command syntax may vary slightly between platforms, but the core commands remain the same.

### Installation Steps

1. **Clone or Download the Repository**
   - Download the project files to your local machine
   - Extract the files if downloaded as an archive

2. **Navigate to Project Directory**
   
   **Windows (PowerShell or Command Prompt):**
   ```powershell
   cd artmuseum-main
   ```
   
   **macOS/Linux (Terminal):**
   ```bash
   cd artmuseum-main
   ```

3. **Set Up a Local Web Server**

   **Option A: Using Python (Recommended for beginners)**
   
   Works on Windows, macOS, and Linux:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2 (if Python 3 is not available)
   python -m SimpleHTTPServer 8000
   ```
   
   **Note for Windows users:** If `python` doesn't work, try `py` instead:
   ```powershell
   py -m http.server 8000
   ```

   **Option B: Using Node.js http-server**
   
   Works on Windows, macOS, and Linux:
   ```bash
   # Install http-server globally (if not already installed)
   npm install -g http-server
   
   # Run the server
   http-server -p 8000
   ```

   **Option C: Using PHP**
   
   Works on Windows, macOS, and Linux:
   ```bash
   php -S localhost:8000
   ```

   **Option D: Using VS Code Live Server Extension (Go Live)**
   
   Works on Windows, macOS, and Linux:
   1. Install the "Live Server" extension in VS Code
   2. Open the project folder in VS Code
   3. Right-click on `index.html` in the file explorer
   4. Select "Open with Live Server" from the context menu
   5. Alternatively, click the "Go Live" button in the VS Code status bar (bottom right)
   6. The application will automatically open in your default browser

### Running the Project

1. **Start the Local Server**
   - Use one of the methods described above to start a local web server on port 8000

2. **Open in Browser**
   - Open your web browser
   - Navigate to `http://localhost:8000`
   - The virtual museum should load automatically

3. **Navigation Controls**
   - **Desktop**: Use WASD keys to move, mouse to look around, and click on artworks to view information
   - **VR**: Use VR controllers for movement and interaction (if VR headset is connected)

4. **Interacting with Artworks**
   - Move close to any displayed artwork
   - Click on the artwork (or use VR controller)
   - An information card will appear below the artwork showing details
   - Click again to close the card

### Troubleshooting

- **Assets Not Loading**: Ensure you are using a local web server and not opening the HTML file directly
- **Black Screen**: Check browser console for errors and verify WebGL support
- **Slow Performance**: Reduce browser window size or close other applications
- **VR Not Working**: Ensure VR headset is properly connected and browser supports WebXR

## Deployment

The Virtual Art Museum can be deployed to any static hosting service that supports HTML, CSS, and JavaScript files.

### GitHub Pages

1. Push the project to a GitHub repository
2. Navigate to repository Settings > Pages
3. Select the branch containing your files (typically `main` or `master`)
4. The site will be available at `https://[username].github.io/[repository-name]`

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to project directory
3. Run `vercel` and follow the prompts
4. The site will be deployed and a URL will be provided

### Deployed Link

[Add your deployed application URL here once deployment is complete]

## Notes

### Limitations

- The application requires a local web server for development due to browser CORS policies
- Performance may vary based on device capabilities and browser WebGL support
- Large 3D models may take time to load on slower internet connections
- VR functionality requires compatible hardware and browser support

### Assumptions

- Users have access to a modern web browser with WebGL capabilities
- Artwork images are provided in the `assets/artworks` directory structure
- All 3D models (GLTF files) are properly formatted and accessible
- Users understand basic web navigation concepts

## Collision Detection System

The Virtual Art Museum implements a lightweight collision detection system using Three.js raycasting within A-Frame. This approach prevents users from passing through walls, artworks, and 3D models without introducing a full physics engine.

### Technical Implementation

- **Method**: Three.js `THREE.Raycaster` is used to cast rays from the camera position in the forward movement direction
- **Collision Objects**: Only objects marked with the `class="collidable"` attribute are checked for collisions
- **Detection Threshold**: Movement is blocked when a collidable object is detected within 1.0 unit of the camera
- **Performance**: Collidable objects are cached and updated periodically to maintain smooth performance
- **Integration**: The system integrates seamlessly with A-Frame's `wasd-controls` component, pausing movement when collisions are detected

### Marked Collidable Objects

All walls, artworks, sculptures, panels, and benches in the museum are marked with the `collidable` class, ensuring comprehensive collision coverage throughout the virtual environment.

### Future Improvements

- Implement a backend API for dynamic artwork data management
- Add user authentication and personalized gallery collections
- Include audio guides and multimedia content for artworks
- Develop a content management system for easy artwork addition
- Optimize 3D models for better performance on lower-end devices
- Add social features such as sharing favorite artworks
- Implement analytics to track user engagement and popular artworks
- Create mobile-optimized controls for touch devices
- Add search and filtering functionality for artwork discovery
- Develop multi-language support for international accessibility
- Enhance collision detection with multiple raycast directions for more accurate boundary detection

