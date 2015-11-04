
varying vec3 vNormal;
varying vec3 vEye;

void main() {

	float f      = 2. * abs( dot( vNormal, normalize( vEye ) ) );
	f            = .2 * ( 1. - smoothstep( 0.0, 1., f ) );
	gl_FragColor = vec4( 1., 1., 1., f );

}