// Artwork metadata - loaded from JSON file
let artworkData = {};
let artworkDataLoaded = false;

// Load artwork data from JSON file
fetch('assets/artwork-data.json')
  .then(response => response.json())
  .then(data => {
    artworkData = data;
    artworkDataLoaded = true;
    console.log('Artwork data loaded successfully');
  })
  .catch(error => {
    console.error('Error loading artwork data:', error);
  });

let currentCard = null;
let currentArtwork = null;

// Component to handle artwork interaction
AFRAME.registerComponent('artwork-interaction', {
  schema: {
    artworkId: { type: 'string' },
    framePadding: { type: 'number', default: 0.35 },
    frameDepth: { type: 'number', default: 0.02 },
    frameOrientation: { type: 'string', default: 'auto' }
  },
  init: function() {
    // Make it interactive for VR raycaster and desktop
    this.el.setAttribute('class', 'clickable');
    
    // Handle clicks in both desktop and VR mode
    // In VR, click is triggered when user presses button while raycaster intersects
    this.el.addEventListener('click', this.onClick.bind(this));

    // Add a decorative frame around the artwork once dimensions are known
    this.createFrame();
  },
  createFrame: function() {
    // Get the artwork's width/height to size the frame
    const width = parseFloat(this.el.getAttribute('width')) || 1;
    const height = parseFloat(this.el.getAttribute('height')) || 1;

    // Pick frame orientation based on artwork shape unless explicitly set
    const orientation =
      this.data.frameOrientation === 'auto'
        ? (width >= height ? 'landscape' : 'portrait')
        : this.data.frameOrientation;
    const frameTex =
      orientation === 'portrait' ? '#framePortraitTex' : '#frameLandscapeTex';

    // Use the same local position/rotation as the artwork
    const position = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };
    const rotation = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };

    const frame = document.createElement('a-plane');
    frame.setAttribute('width', width + this.data.framePadding);
    frame.setAttribute('height', height + this.data.framePadding);
    frame.setAttribute('position', {
      x: position.x,
      y: position.y,
      z: position.z - this.data.frameDepth
    });
    frame.setAttribute('rotation', rotation);
    frame.setAttribute(
      'material',
      `src: ${frameTex}; transparent: true; side: double; shader: flat; alphaTest: 0.05`
    );

    // Attach behind the artwork so the frame stays aligned
    if (this.el.parentEl) {
      this.el.parentEl.appendChild(frame);
      this.frameEntity = frame;
    }
  },
  onClick: function(evt) {
    // Works in both desktop (mouse click) and VR (controller button press)
    // Toggle card: if this artwork's card is already showing, close it
    if (currentArtwork === this.el && currentCard) {
      currentCard.remove();
      currentCard = null;
      currentArtwork = null;
    } else {
      this.showCard();
    }
  },
  showCard: function() {
    const artworkId = this.data.artworkId;
    
    // Wait for data to load if not ready yet
    if (!artworkDataLoaded) {
      console.warn('Artwork data not loaded yet. Please wait...');
      return;
    }
    
    const data = artworkData[artworkId];
    
    if (!data) {
      console.warn('Artwork data not found for ID:', artworkId);
      return;
    }
    
    // Hide previous card
    if (currentCard) {
      currentCard.remove();
      currentCard = null;
    }
    
    // Get artwork world position and rotation
    const artworkWorldPos = new THREE.Vector3();
    const artworkWorldQuat = new THREE.Quaternion();
    this.el.object3D.getWorldPosition(artworkWorldPos);
    this.el.object3D.getWorldQuaternion(artworkWorldQuat);
    
    // Get artwork dimensions
    const artworkWidth = parseFloat(this.el.getAttribute('width')) || 2;
    const artworkHeight = parseFloat(this.el.getAttribute('height')) || 2;
    
    // Calculate card position: below the artwork
    // Offset downward by half the artwork height plus spacing
    const offsetY = artworkHeight / 2 + .9;
    
    // Get the artwork's local down direction (Y-axis in artwork's local space)
    const localDown = new THREE.Vector3(0, -1, 0);
    localDown.applyQuaternion(artworkWorldQuat);
    
    // Get the artwork's forward direction (Z-axis in artwork's local space, negative for A-Frame)
    const localForward = new THREE.Vector3(0, 0, -1);
    localForward.applyQuaternion(artworkWorldQuat);
    
    // Position card below artwork, slightly in front
    const cardPos = new THREE.Vector3();
    cardPos.copy(artworkWorldPos);
    cardPos.add(localDown.clone().multiplyScalar(offsetY));
    cardPos.add(localForward.clone().multiplyScalar(-0.05));
    
    // Create 3D card entity
    const scene = this.el.sceneEl;
    const cardEntity = document.createElement('a-entity');
    cardEntity.setAttribute('id', 'artwork-card');
    
    // Calculate dynamic card dimensions based on content
    const cardWidth = 2.5;
    const padding = 0.15;
    const lineSpacing = 0.12;
    
    // Estimate description height (approximate based on text length and wrap)
    const descLines = Math.ceil(data.description.length / 35);
    const descHeight = descLines * 0.085 * 1.2; // font-size * line-height factor
    
    // Calculate total content height
    const titleHeight = 0.16;
    const artistHeight = 0.09;
    const yearHeight = 0.08;
    const totalContentHeight = titleHeight + lineSpacing + artistHeight + lineSpacing + yearHeight + lineSpacing + descHeight;
    const cardHeight = totalContentHeight + (padding * 2);
    
    // Card background (white plane) - dynamic size, centered
    const cardBg = document.createElement('a-plane');
    cardBg.setAttribute('width', cardWidth);
    cardBg.setAttribute('height', cardHeight);
    cardBg.setAttribute('color', '#ffffff');
    cardBg.setAttribute('opacity', '0.95');
    cardBg.setAttribute('position', '0 0 0');
    cardBg.setAttribute('shadow', 'receive: true');
    cardEntity.appendChild(cardBg);
    
    // Calculate text positions from center (Y=0)
    // Start from top and work down, centered around Y=0
    const halfHeight = cardHeight / 2;
    const startY = halfHeight - padding;
    
    // Title text - centered horizontally and vertically positioned
    const titleY = startY - (titleHeight / 2);
    const titleText = document.createElement('a-text');
    titleText.setAttribute('value', data.title);
    titleText.setAttribute('align', 'center');
    titleText.setAttribute('width', cardWidth - 0.2);
    titleText.setAttribute('position', `0 ${titleY.toFixed(3)} 0.01`);
    titleText.setAttribute('color', '#333333');
    titleText.setAttribute('font', 'roboto');
    titleText.setAttribute('font-size', '0.16');
    titleText.setAttribute('font-weight', 'bold');
    cardEntity.appendChild(titleText);
    
    // Artist text
    const artistY = titleY - (titleHeight / 2) - lineSpacing - (artistHeight / 2);
    const artistText = document.createElement('a-text');
    artistText.setAttribute('value', data.artist);
    artistText.setAttribute('align', 'center');
    artistText.setAttribute('width', cardWidth - 0.2);
    artistText.setAttribute('position', `0 ${artistY.toFixed(3)} 0.01`);
    artistText.setAttribute('color', '#666666');
    artistText.setAttribute('font', 'roboto');
    artistText.setAttribute('font-size', '0.09');
    artistText.setAttribute('font-style', 'italic');
    cardEntity.appendChild(artistText);
    
    // Year text
    const yearY = artistY - (artistHeight / 2) - lineSpacing - (yearHeight / 2);
    const yearText = document.createElement('a-text');
    yearText.setAttribute('value', data.year);
    yearText.setAttribute('align', 'center');
    yearText.setAttribute('width', cardWidth - 0.2);
    yearText.setAttribute('position', `0 ${yearY.toFixed(3)} 0.01`);
    yearText.setAttribute('color', '#888888');
    yearText.setAttribute('font', 'roboto');
    yearText.setAttribute('font-size', '0.08');
    cardEntity.appendChild(yearText);
    
    // Description text (wrapped) - centered
    const descY = yearY - (yearHeight / 2) - lineSpacing - (descHeight / 2);
    const descText = document.createElement('a-text');
    descText.setAttribute('value', data.description);
    descText.setAttribute('align', 'center');
    descText.setAttribute('width', cardWidth - 0.3);
    descText.setAttribute('position', `0 ${descY.toFixed(3)} 0.01`);
    descText.setAttribute('color', '#888888');
    descText.setAttribute('font', 'roboto');
    descText.setAttribute('font-size', '0.085');
    descText.setAttribute('wrap-count', '35');
    cardEntity.appendChild(descText);
    
    // Set card position and rotation
    // Position relative to artwork
    cardEntity.setAttribute('position', {
      x: cardPos.x,
      y: cardPos.y,
      z: cardPos.z
    });
    
    // Make card face the same direction as artwork
    // Get artwork's rotation in degrees
    const artworkEuler = new THREE.Euler();
    artworkEuler.setFromQuaternion(artworkWorldQuat);
    const cardRotation = {
      x: artworkEuler.x * (180 / Math.PI),
      y: artworkEuler.y * (180 / Math.PI),
      z: artworkEuler.z * (180 / Math.PI)
    };
    cardEntity.setAttribute('rotation', cardRotation);
    
    // Add to scene
    scene.appendChild(cardEntity);
    currentCard = cardEntity;
    currentArtwork = this.el;
    
    // Store reference for cleanup
    this.cardEntity = cardEntity;
  },
  remove: function() {
    if (currentArtwork === this.el && currentCard) {
      currentCard.remove();
      currentCard = null;
      currentArtwork = null;
    }
    if (this.frameEntity) {
      this.frameEntity.remove();
      this.frameEntity = null;
    }
  }
});

/**
 * Raycast Collision Component
 * 
 * Implements Three.js raycasting-based collision detection to prevent
 * the camera (player) from passing through walls, artworks, and 3D models.
 * 
 * This component:
 * - Uses THREE.Raycaster to detect collisions in the forward movement direction
 * - Only checks objects marked with the "collidable" class
 * - Blocks movement when a collidable object is within the collision distance threshold
 * - Pauses/resumes wasd-controls based on collision detection
 */
AFRAME.registerComponent('raycast-collision', {
  schema: {
    // Distance threshold for collision detection (in A-Frame units)
    collisionDistance: { type: 'number', default: 1.0 }
  },

  init: function() {
    // Initialize Three.js Raycaster
    this.raycaster = new THREE.Raycaster();
    
    // Direction vector for raycasting (will be updated each frame)
    this.direction = new THREE.Vector3();
    
    // Store reference to wasd-controls component
    this.wasdControls = null;
    
    // Cache for collidable objects to avoid querying DOM every frame
    this.collidables = [];
    this.lastCollidablesUpdate = 0;
    this.collidablesUpdateInterval = 1000; // Update collidables list every 1 second
    
    // Initialize collidables list on component initialization
    this.updateCollidables();
  },

  tick: function() {
    // Get the camera from the scene
    const scene = this.el.sceneEl;
    const camera = scene.camera || this.el.getObject3D('camera');
    
    if (!camera) return;

    // Get wasd-controls component if not already cached
    if (!this.wasdControls) {
      this.wasdControls = this.el.components['wasd-controls'];
      if (!this.wasdControls) return;
    }
    
    // Ensure collidables list is populated
    if (this.collidables.length === 0) {
      this.updateCollidables();
    }

    // Update collidables list periodically (performance optimization)
    const now = Date.now();
    if (now - this.lastCollidablesUpdate > this.collidablesUpdateInterval) {
      this.updateCollidables();
      this.lastCollidablesUpdate = now;
    }

    // Get camera's world position and rotation
    const cameraWorldPos = new THREE.Vector3();
    const cameraWorldQuat = new THREE.Quaternion();
    camera.getWorldPosition(cameraWorldPos);
    camera.getWorldQuaternion(cameraWorldQuat);

    // Calculate forward direction based on camera rotation
    // In A-Frame/Three.js, forward is typically (0, 0, -1) in local space
    this.direction.set(0, 0, -1);
    this.direction.applyQuaternion(cameraWorldQuat);
    this.direction.normalize();

    // Set up raycaster with camera position and forward direction
    this.raycaster.set(cameraWorldPos, this.direction);

    // Perform raycast intersection test
    // The 'true' parameter enables recursive traversal of object hierarchies
    const hits = this.raycaster.intersectObjects(this.collidables, true);

    // Check if there's a collision within the threshold distance
    const blocked = hits.length > 0 && hits[0].distance < this.data.collisionDistance;

    // Block or allow movement based on collision detection
    if (blocked) {
      // Collision detected - block movement
      // Try pause/play methods first (if available)
      if (this.wasdControls && typeof this.wasdControls.pause === 'function') {
        this.wasdControls.pause();
      } else if (this.wasdControls) {
        // Fallback: disable the component or set velocity to zero
        if (this.wasdControls.velocity) {
          this.wasdControls.velocity.set(0, 0, 0);
        }
        // Disable component if enabled property exists
        if (this.wasdControls.data && this.wasdControls.data.enabled !== undefined) {
          this.el.setAttribute('wasd-controls', 'enabled', false);
        }
      }
    } else {
      // No collision - allow movement
      // Try play method first (if available)
      if (this.wasdControls && typeof this.wasdControls.play === 'function') {
        this.wasdControls.play();
      } else if (this.wasdControls) {
        // Re-enable component if it was disabled
        if (this.wasdControls.data && this.wasdControls.data.enabled !== undefined) {
          this.el.setAttribute('wasd-controls', 'enabled', true);
        }
      }
    }
  },

  /**
   * Updates the list of collidable objects from the scene
   * This is called periodically to handle dynamically added/removed objects
   */
  updateCollidables: function() {
    this.collidables = [];
    const scene = this.el.sceneEl;
    
    // Query all elements with the "collidable" class
    const collidableElements = scene.querySelectorAll('.collidable');
    
    collidableElements.forEach(el => {
      // Get the Three.js Object3D from the A-Frame entity
      if (el.object3D) {
        this.collidables.push(el.object3D);
      }
    });
  }
});

