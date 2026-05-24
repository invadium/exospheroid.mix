#version 300 es

// Below is a special uniform and attributes declarations for Collider.JAM .vert parser
// Make sure it declares all uniforms and attributes used in the shader.
// Collider.JAM automatically binds their location.
//
// TODO make a GLSL parser to extract that information directly from the shader source.

uniform mat4 uModelMatrix, uViewMatrix, uProjectionMatrix;

in vec3 aVertPos, aVertColor;

out vec3 vVertColor;

void main(void) {
    vec4 vertPos4 = vec4(aVertPos, 1.0);                       // convert the 3D vertex position to homogenious vec4
    vVertColor = aVertColor;                                   // interpolate the vertex color
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vertPos4;
}
