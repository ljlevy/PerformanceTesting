precision mediump float;

varying vec2 vTextureCoords;

uniform sampler2D uSampler;            
uniform int cellg; 
uniform int cellx;
uniform int celly;
uniform int cellz;
uniform int type;

void main(void) {
  vec4 textureColor = texture2D(uSampler, vTextureCoords);
  float z = 0.8 - float(cellz) * 0.2;
  if (type == 0) {
    float g = 0.9 - float(cellg) * 0.2;
    float x = 0.9 - float(cellx) * 0.2;
    float y = 0.9 - float(celly) * 0.2;
    vec3 highlightColor = vec3(g * z, x * z, y * z);
    gl_FragColor = vec4(mix(highlightColor, textureColor.rgb, textureColor.a), 1.0);
  } else {
    gl_FragColor = vec4(z, z, z, 1.0);
  }
}