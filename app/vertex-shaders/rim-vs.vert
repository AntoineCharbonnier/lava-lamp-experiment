
varying vec3 vNormal;
varying vec3 vEye;

void main() {

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	
	vNormal     = normalize( normalMatrix * normal );
	vEye        = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;

}
