varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vReflect;
varying float ao;
uniform float time;
uniform float size;
uniform float opacity;
uniform float redValue;
uniform float greenValue;
uniform float blueValue;
vec3 vColor;

float rand(vec2 co){
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))* 43758.5453);
}

void main() {

    vec2 position = -1.0 + 2.0 * vUv;
    
    // float red    = redValue + sin(position.x * position.y + clamp( time / 5.0, 191.0 / 255.0, 38.0 / 255.0 ));
    // float green  = greenValue + sin(position.x * position.y + clamp( time / 4.0, 209.0 / 255.0, 118.0 / 255.0 ));
    // float blue   = blueValue + sin(position.x * position.y + clamp( time / 3.0, 228.0 / 255.0, 173.0 / 255.0 ) );
    
    float red    = redValue   + sin(position.x * position.y + clamp(time / 20.0, time / 20.0, time / 20.0) );
    float green  = greenValue + sin(position.x * position.y + clamp(time / 20.0, time / 20.0, time / 20.0) );
    float blue   = blueValue  + sin(position.x * position.y + clamp(time / 20.0, time / 20.0, time / 20.0) );


    gl_FragColor = vec4(red , green , blue , opacity);

    // float green = 192.0 / 255.0;
    // float blue = 158.0 / 255.0;

    // vec3 light = vec3(0.0, green, blue);

    // light = normalize(light);

    // float dProd = max(0.1, dot(vNormal, light));

    // vColor = vec3( dProd, dProd, dProd );

    // float h = sqrt( abs( vPosition.x ) / 100.0 );

    // float opac = pow( 1.0 - abs( h ), 2.0 ) * opacity;

    // float rnd = rand( vNormal.xy + vColor.xy );

    // gl_FragColor = vec4(
    //   vColor,
    //   clamp( pow(opac, 1.8) * rnd, 0.0, opacity)
    // );

    // gl_FragColor = vec4(dProd,
    //                     dProd,
    //                     dProd,
    //                     1.0); 
}
