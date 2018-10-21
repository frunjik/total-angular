import * as THREE from 'three';

export class CameraControls {
    // object: any;
    camera: any;
    canvas: any;
    enabled = true;

    // "target" sets the location of focus, where the object orbits around
    target = new THREE.Vector3();
    // How far you can dolly in and out ( PerspectiveCamera only )
    minDistance = 0;
    maxDistance = Infinity;
    // How far you can zoom in and out ( OrthographicCamera only )
    minZoom = 0;
    maxZoom = Infinity;
    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    minPolarAngle = 0; // radians
    maxPolarAngle = Math.PI; // radians
    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    minAzimuthAngle = - Infinity; // radians
    maxAzimuthAngle = Infinity; // radians
    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    enableDamping = false;
    dampingFactor = 0.25;
    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    enableZoom = true;
    zoomSpeed = 1.0;
    // Set to false to disable rotating
    enableRotate = true;
    rotateSpeed = 1.0;
    // Set to false to disable panning
    enablePan = true;
    keyPanSpeed = 7.0;	// pixels moved per arrow key push
    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    autoRotate = false;
    autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
    // Set to false to disable use of the keys
    enableKeys = true;
    // The four arrow keys
    keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
    // Mouse buttons
    mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    // for reset
    target0;    // = this.target.clone();
    position0;  // = this.object.position.clone();
    zoom0;      // = this.object.zoom;
    STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
	state = this.STATE.NONE;
	EPS = 0.000001;
	// current position in spherical coordinates
	spherical = new THREE.Spherical();
	sphericalDelta = new THREE.Spherical();
	scale = 1;
	panOffset = new THREE.Vector3();
    // added
    v_panLeft = new THREE.Vector3();
    v_panRight = new THREE.Vector3();
    v_panOffset = new THREE.Vector3();

	zoomChanged = false;
	rotateStart = new THREE.Vector2();
	rotateEnd = new THREE.Vector2();
	rotateDelta = new THREE.Vector2();
	panStart = new THREE.Vector2();
	panEnd = new THREE.Vector2();
	panDelta = new THREE.Vector2();
	dollyStart = new THREE.Vector2();
	dollyEnd = new THREE.Vector2();
	dollyDelta = new THREE.Vector2();
    // update
    offset = new THREE.Vector3();
    // so camera.up is the orbit axis
    quat;   // = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
    quatInverse;    // = quat.clone().inverse();
    lastPosition;   // = new THREE.Vector3();
    lastQuaternion; // = new THREE.Quaternion();    
    
    constructor(camera, canvas) {
        // this.object = camera;
        this.camera = camera;
        this.canvas = canvas;
		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.camera.position.clone();
		this.zoom0 = this.camera.zoom;

        this.quat = new THREE.Quaternion().setFromUnitVectors( this.camera.up, new THREE.Vector3( 0, 1, 0 ) );
        this.quatInverse = this.quat.clone().inverse();
        this.lastPosition = new THREE.Vector3();
        this.lastQuaternion = new THREE.Quaternion();
    }

    getPolarAngle() {
		return this.spherical.phi;
	};

	getAzimuthalAngle() {
		return this.spherical.theta;
	};

    getAutoRotationAngle() {
		return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
	}

	getZoomScale() {
		return Math.pow( 0.95, this.zoomSpeed );
	}

	rotateLeft(angle) {
		this.sphericalDelta.theta -= angle;
	}

    rotateUp(angle) {
		this.sphericalDelta.phi -= angle;
	}

    panLeft(distance, objectMatrix) {
        this.v_panLeft.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        this.v_panLeft.multiplyScalar(-distance);
        this.panOffset.add(this.v_panLeft);
    }

	panUp(distance, objectMatrix) {
        this.v_panRight.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
        this.v_panRight.multiplyScalar(distance);
        this.panOffset.add(this.v_panRight);
    }  

	pan(deltaX, deltaY) {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        if ( this.camera instanceof THREE.PerspectiveCamera ) {
            // perspective
            var position = this.camera.position;
            this.v_panOffset.copy( position ).sub( this.target );
            var targetDistance = this.v_panOffset.length();
            // half of the fov is center to top of screen
            targetDistance *= Math.tan( ( this.camera.fov / 2 ) * Math.PI / 180.0 );
            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            this.panLeft( 2 * deltaX * targetDistance / h, this.camera.matrix );
            this.panUp( 2 * deltaY * targetDistance / h, this.camera.matrix );
        } else if ( this.camera instanceof THREE.OrthographicCamera ) {
            // orthographic
            this.panLeft( deltaX * ( this.camera.right - this.camera.left ) / this.camera.zoom / w, this.camera.matrix );
            this.panUp( deltaY * ( this.camera.top - this.camera.bottom ) / this.camera.zoom / h, this.camera.matrix );
        } else {
            // camera neither orthographic nor perspective
            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
            this.enablePan = false;
        }
    }

    reset() {
        this.target.copy( this.target0 );
        this.camera.position.copy( this.position0 );
        this.camera.zoom = this.zoom0;
        this.camera.updateProjectionMatrix();
        this.update();
        this.state = this.STATE.NONE;
	};

    update() {
		let position = this.camera.position;
		this.offset.copy( position ).sub( this.target );
		// rotate offset to "y-axis-is-up" space
		this.offset.applyQuaternion( this.quat );
		// angle from z-axis around y-axis
		this.spherical.setFromVector3( this.offset );
        if ( this.autoRotate && this.state === this.STATE.NONE ) {
            this.rotateLeft( this.getAutoRotationAngle() );
        }
        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;
        // restrict theta to be between desired limits
        this.spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this.spherical.theta ) );
        // restrict phi to be between desired limits
        this.spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this.spherical.phi ) );
        this.spherical.makeSafe();
		this.spherical.radius *= this.scale;
		// restrict radius to be between desired limits
		this.spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this.spherical.radius ) );
 	    // move target to panned location
		this.target.add( this.panOffset );
		this.offset.setFromSpherical( this.spherical );
        // rotate offset back to "camera-up-vector-is-up" space
        this.offset.applyQuaternion( this.quatInverse );
		position.copy( this.target ).add( this.offset );
		this.camera.lookAt( this.target );
        if ( this.enableDamping === true ) {
            this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
            this.sphericalDelta.phi *= ( 1 - this.dampingFactor );
        } else {
            this.sphericalDelta.set( 0, 0, 0 );
        }

		this.scale = 1;
		this.panOffset.set( 0, 0, 0 );

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8
        if ( this.zoomChanged ||
            this.lastPosition.distanceToSquared( this.camera.position ) > this.EPS ||
            8 * ( 1 - this.lastQuaternion.dot( this.camera.quaternion ) ) > this.EPS ) {
            this.lastPosition.copy( this.camera.position );
            this.lastQuaternion.copy( this.camera.quaternion );
            this.zoomChanged = false;
            return true;

        }
        return false;
	};

    dollyIn(dollyScale) {
        if (this.camera instanceof THREE.PerspectiveCamera ) {
            this.scale /= dollyScale;
        } else if ( this.camera instanceof THREE.OrthographicCamera ) {
            this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom * dollyScale ) );
            this.camera.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;
        }
    }

	dollyOut(dollyScale) {
        if (this.camera instanceof THREE.PerspectiveCamera ) {
            this.scale *= dollyScale;
        } else if ( this.camera instanceof THREE.OrthographicCamera ) {
            this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom / dollyScale ) );
            this.camera.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;
        }
    }
}
