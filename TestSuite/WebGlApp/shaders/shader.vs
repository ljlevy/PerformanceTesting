attribute vec3 aVertexPosition;
attribute vec2 aTextureCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoords;

void main(void) {
   vTextureCoords = aTextureCoords;
   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
