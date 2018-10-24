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


export const sobelFragmentShader = `
// Sobel Edge Detection Filter
// GLSL Fragment Shader
// Implementation by Patrick Hebron

uniform sampler2D	texture;
uniform float 		width;
uniform float 		height;

void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
{
	float w = 1.0 / width;
	float h = 1.0 / height;

	n[0] = texture2D(tex, coord + vec2( -w, -h));
	n[1] = texture2D(tex, coord + vec2(0.0, -h));
	n[2] = texture2D(tex, coord + vec2(  w, -h));
	n[3] = texture2D(tex, coord + vec2( -w, 0.0));
	n[4] = texture2D(tex, coord);
	n[5] = texture2D(tex, coord + vec2(  w, 0.0));
	n[6] = texture2D(tex, coord + vec2( -w, h));
	n[7] = texture2D(tex, coord + vec2(0.0, h));
	n[8] = texture2D(tex, coord + vec2(  w, h));
}

void main(void) 
{
	vec4 n[9];
	make_kernel( n, texture, gl_TexCoord[0].st );

	vec4 sobel_edge_h = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
  	vec4 sobel_edge_v = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
	vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));

	gl_FragColor = vec4( 1.0 - sobel.rgb, 1.0 );
}`;

export const contourFragmentShader = `
//Fragment shader contour detection
//Blinn-Phong with same color for RGB
//#version 330
//layout(location = 0) out vec4 out_color;
 
uniform vec3 light_position;
uniform vec3 eye_position;
 
uniform int material_shininess;
uniform float material_kd;
uniform float material_ks;
 
in vec3 world_pos;
in vec3 world_normal;
 
void main()
{
 vec3 L = normalize( light_position - world_pos);
 vec3 V = normalize( eye_position - world_pos);
 vec3 H = normalize(L + V );
 
 float diffuse = material_kd * max(0, dot(L,world_normal));
 float specular = 0;
 
 if( dot(L,world_normal) > 0.0)
 {
 specular = material_ks * pow( max(0, dot( H, world_normal)), material_shininess);
 }
 
 //Black color if dot product is smaller than 0.3
 //else keep the same colors
 float edgeDetection = (dot(V, world_normal) > 0.3) ? 1 : 0;
 
 float light = edgeDetection * (diffuse + specular);
 vec3 color = vec3(light,light,light);
 
 //out_color = vec4(color,1);
 gl_FragColor = tex;
}`;

export const blackFragmentShader = `
void main( void ) {
	vec4 tex= vec4(0.1,0.1,0.1,1);
	gl_FragColor = tex;
}`;


export const starFragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

// Starfields will never die by WAHa.06x36^SVatG

uniform float time;
uniform vec2 resolution;

vec3 hsv(float h, float s, float v) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
	return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	vec3 v = vec3(p, 1.0 - length(p) * 0.2);

	float ta = time * 0.1;
	mat3 m=mat3(
		0.0,1.0,0.0,
		-sin(ta),0.0,cos(ta),
		cos(ta),0.0,sin(ta));
	m*=m*m;
	m*=m;
	v=m*v;

	float a = (atan(v.y, v.x) / 3.141592 / 2.0 + 0.5);
	float slice = floor(a * 1000.0);
	float phase = rand(vec2(slice, 0.0));
	float dist = rand(vec2(slice, 1.0)) * 3.0;
	float hue = rand(vec2(slice, 2.0));

	float z = dist / length(v.xy) * v.z;
	float Z = mod(z + phase + time * 0.6, 1.0);
	float d = sqrt(z * z + dist * dist);

	float c = exp(-Z * 8.0 + 0.3) / (d * d + 1.0);
	gl_FragColor = vec4(hsv(hue, 0.6 * (1.0 - clamp(2.0 * c - 1.0, 0.0, 1.0)), clamp(2.0 * c, 0.0, 1.0)), 1.0);
}
`

export const cosFragmentShader = `#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265

float polygon(vec2 st, float radius, int N)
{

  float a = atan(1.0, st.y) + PI;
  float r = 2.0* PI / float(N);

  // Shaping function that modulate the distance
  float d = cos(fract(0.5 + a/r)*r - a + time);

  d *= length(st);

  d = fract(d * 20.0);

  d = step(dot(radius, radius), dot(d, d));

  return 1.-d;
}

void main(void) 
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv = uv*2.0-1.0;

  float p = polygon(uv, 0.25, 1000);


  gl_FragColor = vec4(vec3(p), 1.0);
}
`