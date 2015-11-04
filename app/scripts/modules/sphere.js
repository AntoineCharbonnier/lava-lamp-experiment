let glslify = require('glslify');

class Sphere {

  constructor() {
    this.vertexShader   = glslify('../../vertex-shaders/simple.vert');
    this.fragmentShader = glslify('../../fragment-shaders/burn.frag');

    this.meshMaterial = new THREE.ShaderMaterial( {
      uniforms: { 
          time: { type: "f", value: 0 },
          weight: { type: "f", value: 0 },
          opacity: { type: 'f', value: 1.0 } ,
          redValue: { type: 'f', value: 0.0 }, 
          greenValue: { type: 'f', value: 0.0 },
          blueValue: { type: 'f', value: 0.0 },
          fragCoord: { type: "v2", value: new THREE.Vector2(0.2,0.2) },
          Resolution : { type: "v3", value: new THREE.Vector3(100,100,100) }
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        shading: THREE.SmoothShading,
        wireframe: false,
        transparent: true,
      } 
    );

    this.meshGeometry = new THREE.CylinderGeometry(1, 0, 1, 32, 32, true, 0)    
    this.mesh = new THREE.Object3D()

    this.mesh.add( new THREE.Mesh(
      this.meshGeometry,
      this.meshMaterial
    ));

    this.mesh.position.y = 0;
    this.mesh.rotation.y = -11;
    this.mesh.position.z = -3;
    this.mesh.rotation.z = -Math.PI / 2

    this.data = {
      radius : 10,
      tube : 3,
      radialSegments : 64,
      tubularSegments : 8,
      p : 2,
      q : 3,
      heightScale : 1
    };
    this.clock           = Date.now();
    
    this.speed           = 0.0003;
    this.weight          = 5;
    this.opacity         = 0.0;
    
    this.redValue        = 0;
    this.greenValue      = 0;
    this.blueValue       = 0;
    
    this.stepRed         = 0.001
    this.stepGreen       = 0.01
    this.stepBlue        = 0.005

    return this;
  }

  update( ts ) {
    this.meshMaterial.uniforms[ 'time' ].value = this.speed * ( Date.now() - this.clock );
  }

  setWeight( _weight ) {
    this.weight = _weight;
  }

  getSoundDataWave(){
    return this.waveData;
  }

  getSoundDataBar(){
    return this.barData;
  }

  getMesh() {
    return this.mesh;
  }

}

export { Sphere };