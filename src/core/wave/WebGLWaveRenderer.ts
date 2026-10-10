import { DotStyleFactory } from "./DotStyleFactory.ts";
import type { WaveField } from "./WaveField.ts";
import { FULL_INTENSITY_HEIGHT, LIFT_PER_UNIT, STYLE_LEVELS } from "./waveLook.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";

/** Extra device pixels around each dot, so that its antialiased edge is not cut. */
const EDGE_PIXELS = 1;

/**
 * Smallest largest-point size, in device pixels, accepted from the graphics
 * card: room for the biggest dot on a 4× screen. Below it, the 2D renderer is used.
 */
const MIN_POINT_SIZE = 32;

/**
 * Places each dot and picks its look on the graphics card. The look of each
 * level comes from the same {@link DotStyleFactory} as the 2D renderers.
 */
const VERTEX_SHADER = `#version 300 es
uniform vec2 u_area;
uniform float u_pixelRatio;
uniform float u_lift;
uniform float u_fullIntensityHeight;
uniform vec4 u_colors[${STYLE_LEVELS}];
uniform float u_radii[${STYLE_LEVELS}];
in vec2 a_rest;
in float a_height;
out vec4 v_color;
out float v_radius;

void main() {
  float intensity = clamp(abs(a_height) / u_fullIntensityHeight, 0.0, 1.0);
  int level = int(floor(intensity * ${STYLE_LEVELS - 1}.0 + 0.5));
  vec2 position = vec2(a_rest.x, a_rest.y - a_height * u_lift);
  vec2 clip = position / u_area * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_radius = u_radii[level] * u_pixelRatio;
  gl_PointSize = 2.0 * (v_radius + ${EDGE_PIXELS}.0);
  v_color = u_colors[level];
}`;

/** Paints each dot as a disc with a soft one-pixel edge, like the 2D canvas. */
const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec4 v_color;
in float v_radius;
out vec4 outColor;

void main() {
  float size = 2.0 * (v_radius + ${EDGE_PIXELS}.0);
  float distanceToCenter = length(gl_PointCoord - 0.5) * size;
  float coverage = clamp(v_radius + 0.5 - distanceToCenter, 0.0, 1.0);
  float alpha = v_color.a * coverage;
  outColor = vec4(v_color.rgb * alpha, alpha);
}`;

/** Graphics card objects of the renderer; created again if the context is lost then restored. */
interface GpuResources {
  readonly program: WebGLProgram;
  readonly restBuffer: WebGLBuffer;
  readonly heightBuffer: WebGLBuffer;
  readonly vertexArray: WebGLVertexArrayObject;
  readonly areaLocation: WebGLUniformLocation | null;
  readonly pixelRatioLocation: WebGLUniformLocation | null;
}

/**
 * Animated renderer drawn by the graphics card with WebGL 2: the same picture
 * as `AnimatedWaveRenderer`, several times faster, because each dot is
 * one point given to the graphics card instead of a circle traced by the
 * browser.
 *
 * Each frame only sends the heights of the dots; their resting positions are
 * sent once per grid size. Use {@link WebGLWaveRenderer.create}, which
 * returns `null` when WebGL 2 is not available, so that the caller can fall
 * back to a 2D renderer.
 */
export class WebGLWaveRenderer implements WaveRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly styles = new DotStyleFactory({ levels: STYLE_LEVELS });
  private resources: GpuResources | null;
  private width = 0;
  private height = 0;
  private pixelRatio = 1;
  private gridColumns = -1;
  private gridRows = -1;
  private gridSpacing = -1;

  /**
   * Creates a renderer if the canvas can give a WebGL 2 context.
   * @param canvas - Canvas to draw on; it must not already have a 2D context.
   * @returns The renderer, or `null` if WebGL 2 is not available, cannot draw
   * large enough points, or its setup fails.
   */
  static create(canvas: HTMLCanvasElement): WebGLWaveRenderer | null {
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true });
    if (gl === null) {
      return null;
    }
    const pointSizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array;
    if (pointSizeRange[1] < MIN_POINT_SIZE) {
      return null;
    }
    const renderer = new WebGLWaveRenderer(gl);
    return renderer.resources === null ? null : renderer;
  }

  /** @param gl - WebGL 2 context of the canvas to draw on. */
  private constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.resources = this.createResources();
    gl.canvas.addEventListener("webglcontextlost", this.handleContextLost);
    gl.canvas.addEventListener("webglcontextrestored", this.handleContextRestored);
  }

  resize(width: number, height: number, pixelRatio: number): void {
    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    const canvas = this.gl.canvas;
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
  }

  render(field: WaveField): void {
    const { gl, resources } = this;
    if (resources === null || gl.isContextLost()) {
      return;
    }
    gl.useProgram(resources.program);
    gl.bindVertexArray(resources.vertexArray);
    if (
      field.columns !== this.gridColumns ||
      field.rows !== this.gridRows ||
      field.spacing !== this.gridSpacing
    ) {
      this.uploadGrid(field, resources);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.heightBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, field.heights);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(resources.areaLocation, this.width, this.height);
    gl.uniform1f(resources.pixelRatioLocation, this.pixelRatio);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, field.columns * field.rows);
  }

  dispose(): void {
    const { gl, resources } = this;
    gl.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    gl.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
    if (resources !== null && !gl.isContextLost()) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.deleteVertexArray(resources.vertexArray);
      gl.deleteBuffer(resources.restBuffer);
      gl.deleteBuffer(resources.heightBuffer);
      gl.deleteProgram(resources.program);
    }
    this.resources = null;
  }

  /**
   * Compiles the shaders, creates the buffers and sends the looks of the
   * levels, which never change.
   * @returns The objects, or `null` if the graphics card refused them.
   */
  private createResources(): GpuResources | null {
    const gl = this.gl;
    const program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (program === null) {
      return null;
    }
    const restBuffer = gl.createBuffer();
    const heightBuffer = gl.createBuffer();
    const vertexArray = gl.createVertexArray();

    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);
    bindAttribute(gl, program, "a_rest", restBuffer, 2);
    bindAttribute(gl, program, "a_height", heightBuffer, 1);
    gl.bindVertexArray(null);

    const colors = new Float32Array(STYLE_LEVELS * 4);
    const radii = new Float32Array(STYLE_LEVELS);
    for (let level = 0; level < STYLE_LEVELS; level++) {
      const style = this.styles.styleAt(level);
      colors.set(style.rgba, level * 4);
      radii[level] = style.radius;
    }
    gl.uniform4fv(gl.getUniformLocation(program, "u_colors"), colors);
    gl.uniform1fv(gl.getUniformLocation(program, "u_radii"), radii);
    gl.uniform1f(gl.getUniformLocation(program, "u_lift"), LIFT_PER_UNIT);
    gl.uniform1f(gl.getUniformLocation(program, "u_fullIntensityHeight"), FULL_INTENSITY_HEIGHT);

    // Each dot's color is already multiplied by its opacity (see the fragment shader).
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.gridColumns = -1;
    return {
      program,
      restBuffer,
      heightBuffer,
      vertexArray,
      areaLocation: gl.getUniformLocation(program, "u_area"),
      pixelRatioLocation: gl.getUniformLocation(program, "u_pixelRatio"),
    };
  }

  /**
   * Sends the resting position of every dot, and makes room for their heights.
   * Only needed when the grid changes size.
   * @param field - Grid of dots.
   * @param resources - Buffers to fill.
   */
  private uploadGrid(field: WaveField, resources: GpuResources): void {
    const gl = this.gl;
    const { columns, rows, spacing } = field;
    const rest = new Float32Array(columns * rows * 2);
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = (row * columns + column) * 2;
        rest[index] = column * spacing;
        rest[index + 1] = row * spacing;
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.restBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rest, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.heightBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      columns * rows * Float32Array.BYTES_PER_ELEMENT,
      gl.DYNAMIC_DRAW,
    );
    this.gridColumns = columns;
    this.gridRows = rows;
    this.gridSpacing = spacing;
  }

  /** The graphics card was reset: stop drawing and ask the browser to restore the context. */
  private readonly handleContextLost = (event: Event): void => {
    event.preventDefault();
    this.resources = null;
  };

  /** The context is back, empty: everything is created again, the next frame redraws. */
  private readonly handleContextRestored = (): void => {
    this.resources = this.createResources();
  };
}

/**
 * Compiles and links a shader program.
 * @returns The program, or `null` if a shader does not compile or the program does not link.
 */
function linkProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  let program: WebGLProgram | null = null;
  if (vertexShader !== null && fragmentShader !== null) {
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
      gl.deleteProgram(program);
      program = null;
    }
  }
  // A linked program keeps what it needs: the shaders can go in every case.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

/**
 * Compiles one shader.
 * @returns The shader, or `null` if it does not compile.
 */
function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (shader === null) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Connects a buffer to an input of the vertex shader, inside the bound vertex array.
 * @param size - Number of floats per dot (2 for a position, 1 for a height).
 */
function bindAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  buffer: WebGLBuffer,
  size: number,
): void {
  const location = gl.getAttribLocation(program, name);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}
