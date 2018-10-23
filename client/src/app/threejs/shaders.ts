export const grassVertexShader = `varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}`;

export const grassFragmentShader = `#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.0);

float rand(vec2 n) { 
    // return 0.6;
	// return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * (time));
	// return fract(sin(dot(n, vec2(10, 10))) * (time/10.0));
}

float noise(vec2 p){
	const int res = 6;
	// const float invRes = 1.0 / float(res);
	
	p *= float(res);
	vec2 n = floor(p);
	vec2 f = fract(p);
	
	f = f * f * (3.0 - 2.0 * f);
	
	float n0 = rand(n);
	float n1 = rand(n + vec2(1.0, 0.0));
	float n2 = rand(n + vec2(0.0, 1.0));
	float n3 = rand(n + vec2(1.0, 1.0));
	
	float m0 = mix(n0, n1, f.x);
	float m1 = mix(n2, n3, f.x);
	
	return mix(m0, m1, f.y);
}

void main( void ) {

	// vec2 position = gl_FragCoord.xy / resolution.xy;
	// vec2 position = fragCoord.xy;

	// vec2 position = gl_FragCoord.xy;
	vec2 position = vUv;    // / resolution.xy;
	vec3 color = vec3(0.0,1,0);

	color += noise(position) * 0.5;
	// color += noise(position * 2.0) * 0.25;
	// color += noise(position * 4.0) * 0.125;
	color += noise(position * 8.0 * (time/1.0)) * 0.064;
	color += noise(position * 16.0 * (time/1.0)) * 0.032;
	// color += noise(position * 32.0) * 0.016;
	// color += noise(position * 64.0) * 0.008;
	
	color *= 0.3;

	gl_FragColor = vec4(color, 1.0 );

}`;
