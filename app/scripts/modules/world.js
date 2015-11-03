let glslify = require('glslify');
import { Keyboard }  from './keyboard';
// import { Sphere }    from './sphere';

class World {

  constructor( _options ) {
    this.container         = null
    this.renderer          = null
    this.scene             = null
    this.camera            = null
    this.mesh              = null
    this.material          = null
    this.sphereMaterial    = null
    this.rendererStats     = null
    this.lavaLamp          = null
    this.fov               = 90
    this.start             = Date.now()
    this.distance          = 0
    this.ndistance         = 500
    this.texture           = 0
    this.resolution        = 50
    this.numBlobs          = 40
    this.params            = { active: true }
    this.onMouseDownMouseX = 0
    this.onMouseDownMouseY = 0
    this.lon               = 0
    this.onMouseDownLon    = 0
    this.nlat              = 0
    this.lat               = 0
    this.onMouseDownLat    = 0
    this.nlon              = 0
    this.phi               = 0
    this.theta             = 0
    this.lat               = 15
    this.mouse             = { x: 0, y: 0 }
    this.x                 = null
    this.y                 = null
    this.isUserInteracting = false
  
    this.vertexShader      = glslify('../../vertex-shaders/vertexShader.vert');
    this.fragmentShader    = glslify('../../fragment-shaders/fragmentShader.frag');
    this.sphere_vs         = glslify('../../vertex-shaders/sphere-vs.vert');
    this.sphere_fs         = glslify('../../fragment-shaders/sphere-fs.frag');
    this.rim_vs            = glslify('../../vertex-shaders/rim-vs.vert');
    this.rim_fs            = glslify('../../fragment-shaders/rim-fs.frag');
    this.simpleFrag        = glslify('../../fragment-shaders/simple.frag')

    this.init()
  }

  init() {
    this.container         = document.getElementById("container")
    this.scene             = new THREE.Scene()
    this.camera            = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, .01, 100000 );
    this.camera.position.z = 100;
    
    this.scene.add( this.camera )

    this.renderer           = new THREE.WebGLRenderer( { antialias: true } )
    this.renderer.autoClear = false
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    this.renderer.gammaInput             = true
    this.renderer.gammaOutput            = true
    this.renderer.physicallyBasedShading = true

    this.container.appendChild( this.renderer.domElement )

    this.material = new THREE.ShaderMaterial( {
        uniforms: {
          textureMap: { type: 't', value: null },
          normalMap: { type: 't', value: null },
          normalScale: { type: 'f', value: 1 },
          texScale: { type: 'f', value: 5 },
          useSSS: { type: 'f', value: 1 },
          useScreen: { type: 'f', value: 0 },
          color: { type: 'c', value: new THREE.Color( 0, 0, 0 ) }
            },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        side: THREE.DoubleSide
        
      } )

    this.effect = new THREE.MarchingCubes( this.resolution, this.material, true, false )
    this.effect.scale.set( 100, 100, 100 )

    this.scene.add( this.effect )

    this.updateCubes( this.effect, 0, this.numBlobs )

    this.sphereMaterial = new THREE.ShaderMaterial( {
        uniforms: { 
          resolution: { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
          noise: { type: 'f', value: .04 },
          color: { type: 'c', value: new THREE.Color( 0, 0, 0 ) }
        },
        vertexShader: this.sphere_vs,
        fragmentShader: this.sphere_fs,
        side: THREE.DoubleSide
      } );

    this.sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 3000, 1 ), this.sphereMaterial );
    this.scene.add( this.sphere );

    this.lavaMaterial  = new THREE.ShaderMaterial( {
        uniforms: {
          textureMap: { type: 't', value: null },
          normalMap: { type: 't', value: null },
          normalScale: { type: 'f', value: 1 },
          texScale: { type: 'f', value: 5 },
          useSSS: { type: 'f', value: 1 },
          useScreen: { type: 'f', value: 0 },
          color: { type: 'c', value: new THREE.Color( 0, 0, 0 ) }
            },
        vertexShader: this.vertexShader,
        fragmentShader: this.simpleFrag,
        transparent: true
    } )

    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };

    this.lavaTexture = new THREE.Texture();

    this.loaderImage = new THREE.ImageLoader( this.manager );
    this.loaderImage.load( 'img/carbon-fiber.jpg', function ( image ) {
      this.lavaTexture.image       = image;
      this.lavaTexture.needsUpdate = true;
    }.bind(this) );

    this.loaderObj = new THREE.OBJLoader( this.manager );
    this.loaderObj.load( 'obj/lavala.obj', function ( object ) {

      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material  = this.lavaMaterial
        }
      }.bind(this) );

      this.lavaLamp = object

      this.lavaLamp.children[0].scale.x = 1.8
      this.lavaLamp.children[0].scale.y = 1.5
      this.lavaLamp.children[0].scale.z = 1.8
      this.lavaLamp.children[0].position.y = - 217;

      this.scene.add( this.lavaLamp );
      
      this.keyboard.addObject( this.lavaLamp.children[0] );

    }.bind(this), this.onProgressLoad, this.onErrorLoad );

    this.switchTexture()
    this.render()
    this.addListeners()
    
    this.animate()
  }

  onProgressLoad( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  }
  onErrorLoad( xhr ) {
    console.log("error")
  };

  switchTexture(){      
    this.lavaMaterial.uniforms.normalScale.value = 1
    this.lavaMaterial.uniforms.texScale.value    = 10
    this.lavaMaterial.uniforms.useSSS.value      = 0
    this.lavaMaterial.uniforms.useScreen.value   = 1
    this.lavaMaterial.uniforms.textureMap.value  = THREE.ImageUtils.loadTexture( './img/944_large_remake2.jpg' )
    this.lavaMaterial.uniforms.normalMap.value   = THREE.ImageUtils.loadTexture( './img/ice-snow.jpg' )
    this.lavaMaterial.uniforms.color.value.setRGB( 36.0 / 255.0, 70.0 / 255.0, 106.0 / 255.0 )
    this.sphereMaterial.uniforms.color.value.setRGB( 51.0 / 255.0, 50.0 / 255.0, 49.0 / 255.0 )
    this.lavaMaterial.uniforms.textureMap.value.wrapS = this.lavaMaterial.uniforms.textureMap.value.wrapT = THREE.ClampToEdgeWrapping
    this.lavaMaterial.uniforms.normalMap.value.wrapS  = this.lavaMaterial.uniforms.normalMap.value.wrapT  = THREE.RepeatWrapping
  }

  updateCubes( object, time, numblobs, floor, wallx, wallz ) { 
    object.reset()
    var i, ballx, bally, ballz, subtract, strength
    subtract = 12
    strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 )
    for ( i = 0; i < numblobs; i++ ) {
      ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5 
      bally = Math.cos( i + 1.12 * time * 0.21 * Math.sin( ( 0.72 + 0.83 * i ) ) ) * 0.27 + 0.5 
      ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5 
      object.addBall( ballx, bally, ballz, strength, subtract )
    }
    if( floor ) object.addPlaneY( 2, 12 )
    if( wallz ) object.addPlaneZ( 2, 12 )
    if( wallx ) object.addPlaneX( 2, 12 )
  };

  getScene() {
    return this.scene;
  }

  animate( ts ) {
    if (this.params.active) {
      window.requestAnimationFrame( this.animate.bind(this) );
      this.render( ts );
      this.updateCubes( this.effect, .0005 * ( Date.now() - this.start ), this.numBlobs )
      this.updateCamera()
    }
  }

  updateCamera(){
    this.nlat  = Math.max( - 85, Math.min( 85, this.nlat ) )    
    this.lat   += ( this.nlat - this.lat ) * .1
    this.lon   += ( this.nlon - this.lon ) * .1
    this.phi   = ( 90 - this.lat ) * Math.PI / 180
    this.theta = this.lon * Math.PI / 180
    this.distance          += ( this.ndistance - this.distance ) * .1
    this.camera.position.x = this.scene.position.x + this.distance * Math.sin( this.phi ) * Math.cos( this.theta )
    this.camera.position.y = this.scene.position.y + this.distance * Math.cos( this.phi )
    this.camera.position.z = this.scene.position.z + this.distance * Math.sin( this.phi ) * Math.sin( this.theta )
    this.camera.lookAt( this.scene.position )
  }

  render() {
    if (!this.params.active)
        this.params.active = true;
      this.renderer.render( this.scene, this.camera );
  }

  addListeners() {
  	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
  	this.keyboard = new Keyboard();	

    window.addEventListener( 'mousedown', this.onTouchStart.bind(this) );
    window.addEventListener( 'touchstart', this.onTouchStart.bind(this) );
    window.addEventListener( 'mousemove', this.onTouchMove.bind(this) );
    window.addEventListener( 'touchmove', this.onTouchMove.bind(this) );
    window.addEventListener( 'mouseup', this.onTouchEnd.bind(this) );
    window.addEventListener( 'touchend', this.onTouchEnd.bind(this) );
  }

  onTouchStart( event ) {
    if( event.changedTouches ) {
        this.x = event.changedTouches[ 0 ].pageX;
        this.y = event.changedTouches[ 0 ].pageY;
    } else {
        this.x = event.clientX;
        this.y = event.clientY;
    }
    this.isUserInteracting     = true;
    this.onPointerDownPointerX = this.x;
    this.onPointerDownPointerY = this.y;
    this.onPointerDownLon      = this.lon;
    this.onPointerDownLat      = this.lat;
  }
  onTouchMove( event ) {
    if( event.changedTouches ) {
        this.x = event.changedTouches[ 0 ].pageX;
        this.y = event.changedTouches[ 0 ].pageY;
    } else {
        this.x = event.clientX;
        this.y = event.clientY;
    }
    if ( this.isUserInteracting ) {
      this.nlon = ( this.x - this.onPointerDownPointerX ) * 0.1 + this.onPointerDownLon;
      this.nlat = ( this.y - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
    }
    this.mouse.x = ( this.x / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( this.y / window.innerHeight ) * 2 + 1;
    event.preventDefault();
  }

  onTouchEnd( event ) {
    this.isUserInteracting = false
    event.preventDefault()
  }

  onMouseWheel( event ){
    // WebKit
    var d =100;
    if ( event.wheelDeltaY ) {
      //fov -= event.wheelDeltaY * 0.01;
      this.ndistance -= d * event.wheelDeltaY * 0.001;
    // Opera / Explorer 9
    } else if ( event.wheelDelta ) {
      //fov -= event.wheelDelta * 0.05;
      this.ndistance -= d * event.wheelDelta * 0.005;
    // Firefox
    } else if ( event.detail ) {
      //fov += event.detail * 1.0;
      this.ndistance += d * event.detail * .1;
    }
  }

  onWindowResize() {
    this.params.width  = window.innerWidth;
    this.params.height = window.innerHeight;

    this.camera.aspect = this.params.width / this.params.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.params.width, this.params.height );
  }

}

export { World };