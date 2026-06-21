// src/components/landing/Globe3D.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

interface Globe3DProps {
  color: string; // HSL/RGB particle color matching the Aura
  shadowColor: string; // Aura shadow/glow color
  size?: number; // Canvas size dimension
}

const EARTH_TILT_RADIAN = 22 * Math.PI / 180;
const ROTATION_SPEED_Y = 0.006;
const SPHERE_RADIUS = 1.0;
const LATITUDE_BANDS = 64;
const LONGITUDE_BANDS = 64;

// GLSL Vertex Shader Source
const VS_SOURCE = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;
  varying vec3 vNormal;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
      vTexCoord = aTexCoord;
      vNormal = aPosition; // Unit sphere normal equals vertex position
  }
`;

// GLSL Fragment Shader Source
const FS_SOURCE = `
  precision mediump float;

  varying vec2 vTexCoord;
  varying vec3 vNormal;

  uniform sampler2D uSampler;
  uniform vec3 uAuraColor;

  void main(void) {
      vec4 texColor = texture2D(uSampler, vTexCoord);
      
      // Light source slightly tilted towards front-right-top
      vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
      float diff = max(dot(normalize(vNormal), lightDir), 0.15);
      
      // Calculate landmass brightness intensity from the clean satellite texture
      float intensity = (texColor.r + texColor.g + texColor.b) / 3.0;
      
      // Smoothly interpolate between ocean and land zones based on intensity
      // This prevents pixelated, jaggy edges at coastlines
      float t = smoothstep(0.12, 0.22, intensity);
      
      // Map to high-contrast monochromatic Aura theme colors
      // Land (bright areas) gets a bright, vibrant tinted tone
      // Ocean (dark areas) gets a deep, rich base
      vec3 landColor = uAuraColor * (0.6 + 0.4 * intensity);
      vec3 oceanColor = uAuraColor * 0.12 * (1.0 - intensity);
      vec3 baseColor = mix(oceanColor, landColor, t);
      
      // Apply light diffuse shading
      vec3 finalColor = baseColor * diff;
      
      // Add atmosphere edge glow (fresnel rim lighting) using the Aura color
      float fresnel = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
      fresnel = pow(fresnel, 3.0);
      finalColor += uAuraColor * fresnel * 0.55;
      
      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Color parsing utility helpers
function parseColorToRGB(colorStr: string): [number, number, number] {
  if (colorStr.startsWith('hsl')) {
    const matches = colorStr.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
    if (matches) {
      const h = parseInt(matches[1]) / 360;
      const s = parseInt(matches[2]) / 100;
      const l = parseInt(matches[3]) / 100;
      return hslToRgb(h, s, l);
    }
  }
  if (colorStr.startsWith('rgb')) {
    const matches = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      return [
        parseInt(matches[1]) / 255,
        parseInt(matches[2]) / 255,
        parseInt(matches[3]) / 255
      ];
    }
  }
  return [0.2, 0.5, 0.9];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [r, g, b];
}

// Perspective Matrix builder
function makePerspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}

export default function Globe3D({ color, shadowColor, size = 200 }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [webGLSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize WebGL Context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);
    gl.clearColor(0, 0, 0, 0); // Translucent canvas background
    gl.enable(gl.DEPTH_TEST);

    // Helper: Compile shaders
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        logger.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VS_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FS_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      logger.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Get Uniform/Attribute locations
    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    const aTexCoordLoc = gl.getAttribLocation(program, 'aTexCoord');
    const uMVMatrixLoc = gl.getUniformLocation(program, 'uMVMatrix');
    const uPMatrixLoc = gl.getUniformLocation(program, 'uPMatrix');
    const uSamplerLoc = gl.getUniformLocation(program, 'uSampler');
    const uAuraColorLoc = gl.getUniformLocation(program, 'uAuraColor');

    // 2. Generate Sphere Mesh Geometry
    const latitudeBands = LATITUDE_BANDS;
    const longitudeBands = LONGITUDE_BANDS;
    const radius = SPHERE_RADIUS;

    const vertexPositionData: number[] = [];
    const textureCoordData: number[] = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const theta = (latNumber * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // y is vertical polar axis
        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        // u mapped directly to prevent mirroring
        const u = longNumber / longitudeBands;
        const v = latNumber / latitudeBands;

        vertexPositionData.push(x * radius, y * radius, z * radius);
        textureCoordData.push(u, v);
      }
    }

    const indexData: number[] = [];
    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
        const first = latNumber * (longitudeBands + 1) + longNumber;
        const second = first + longitudeBands + 1;

        indexData.push(first, second, first + 1);
        indexData.push(second, second + 1, first + 1);
      }
    }

    // Load geometry into buffers
    const vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aTexCoordLoc);
    gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

    // 3. Create WebGL Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Load placeholder single pixel texture while loading image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    // Configure wrapping and filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Load actual Earth texture map from public assets
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      setTextureLoaded(true);
    };
    image.onerror = () => {
      // Graceful fallback; texture load failure is silent
    };
    image.src = '/assets/earth-texture.png';

    // 4. Matrix Math and Rotation loop
    let angleY = 0;
    const rotSpeedY = ROTATION_SPEED_Y;
    let animationFrameId: number;

    const rgbColor = parseColorToRGB(color);

    // Simple Projection Matrix (Perspective)
    const pMatrix = makePerspective((45 * Math.PI) / 180, 1.0, 0.1, 100.0);
    gl.uniformMatrix4fv(uPMatrixLoc, false, new Float32Array(pMatrix));

    const renderLoop = () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      angleY += rotSpeedY;

      // Model-View Matrix with Rotate Y and tilt on X
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const tiltX = EARTH_TILT_RADIAN; // Constant Earth axis tilt
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      // Model-View Matrix representing translation + Y-axis spin + X-axis tilt
      const mvMatrix = [
        cosY, sinX * sinY, cosX * -sinY, 0,
        0, cosX, sinX, 0,
        sinY, -sinX * cosY, cosX * cosY, 0,
        0, 0, -3.4, 1 // Translated back by 3.4 units to prevent top/bottom viewport clipping and ensure a perfectly round globe
      ];

      // Pass variables into shader uniforms
      gl.uniformMatrix4fv(uMVMatrixLoc, false, new Float32Array(mvMatrix));
      gl.uniform3fv(uAuraColorLoc, new Float32Array(rgbColor));

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uSamplerLoc, 0);

      // Draw the solid sphere triangles
      gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(vertexPositionBuffer);
      gl.deleteBuffer(textureCoordBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [color, size]);

  // makePerspective helper is defined at module scope to avoid re-creation on render.

  // Fallback rendering UI when WebGL is unsupported or texture is loading
  if (!webGLSupported) {
    return (
      <div 
        className="rounded-full animate-pulse transition-all duration-500"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
          boxShadow: `0 0 35px ${shadowColor}`
        }}
      />
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
      {/* Fallback Glassmorphic circle while image loads */}
      {!textureLoaded && (
        <div 
          className="absolute inset-2 rounded-full border border-white/10 animate-pulse bg-neutral-950/40 backdrop-blur-sm"
          style={{ boxShadow: `inset 0 0 20px ${shadowColor}` }}
        />
      )}
      <canvas 
        ref={canvasRef} 
        className="select-none pointer-events-none block"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}
