
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 vOPosition;
varying vec3 vONormal;
varying vec3 vU;
varying vec3 vEye;

void main() {

    vOPosition  = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * vOPosition;

    vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );

    vPosition = vec4( position, 1.0 );
    vNormal   = normalMatrix * normal;
    vONormal  = normal;

}
