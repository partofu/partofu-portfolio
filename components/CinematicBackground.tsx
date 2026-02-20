"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CinematicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high dpi
    containerRef.current.appendChild(renderer.domElement);

    // --- Shader Material ---
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      
      varying vec2 vUv;

      // --- Noise Functions (Simplex 3D) ---
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      // Pseudo-random for grain
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Rotate UV coordinates
      vec2 rotate(vec2 uv, float angle) {
          float s = sin(angle);
          float c = cos(angle);
          return mat2(c, -s, s, c) * uv;
      }

      void main() {
        vec2 uv = vUv;
        // Fix aspect ratio
        uv.x *= uResolution.x / uResolution.y;

        // Very Subtle Parallax (Max 3%)
        vec2 mouseOffset = uMouse * 0.03; 
        uv += mouseOffset;

        // --- Diagonal Streak Logic ---
        
        // 1. Rotate space to create diagonal flow (approx 45 degrees)
        vec2 rotatedUV = rotate(uv, -0.785); // -45 degrees in radians
        
        // 2. Stretch space along the diagonal to simulate "flowing ribbon"
        // Stretch X (which corresponds to diagonal direction after rotation)
        vec2 stretchedUV = vec2(rotatedUV.x * 0.5, rotatedUV.y * 3.0); 

        // 3. Add Flow Motion
        float t = uTime * 0.15; // Slow, controlled flow speed
        vec3 p = vec3(stretchedUV, t);
        
        // 4. Sample Noise for the "Plasma/Fog" texture
        // Layer 1: Base flow
        float noise1 = snoise(p);
        
        // Layer 2: Warped detail (Domain warping)
        vec3 p2 = p + vec3(noise1 * 0.5, noise1 * 0.2, t * 0.2);
        float noise2 = snoise(p2 * 1.5); // Higher frequency

        // Combine noise layers
        float finalNoise = (noise1 * 0.6 + noise2 * 0.4);
        
        // 5. Create the "Streak" shape (Masking)
        // We want a band in the center of the rotated Y axis
        // rotatedUV.y is roughly -1 to 1. Center is 0.
        // We add some wave distortion to the center line using sine
        float centerLine = 0.0 + sin(rotatedUV.x * 1.5 + t * 0.5) * 0.2; 
        float distFromCenter = abs(rotatedUV.y - centerLine);
        
        // Soft mask: 1.0 at center, fading quickly to 0.0
        float mask = smoothstep(0.8, 0.0, distFromCenter); // Adjust 0.8 to control width
        
        // Combine noise with mask
        float intensity = (finalNoise * 0.5 + 0.5) * mask; // Map noise to 0-1 and apply mask
        intensity = pow(intensity, 1.8); // Contrast curve to darken edges
        
        // 6. Color Mapping
        vec3 colorBlack = vec3(0.04, 0.04, 0.04); // #0A0A0A - Deep Dark Base
        vec3 colorShadow = vec3(0.16, 0.04, 0.02); // #2A0A05 - Deep Red Shadow
        vec3 colorOrange = vec3(1.0, 0.3, 0.0); // #FF4D00 - Primary Brand
        vec3 colorHighlight = vec3(1.0, 0.48, 0.24); // #FF7A3C - Highlight

        // Gradient Logic: Black -> Shadow -> Orange -> Highlight
        vec3 finalColor = mix(colorBlack, colorShadow, smoothstep(0.0, 0.2, intensity));
        finalColor = mix(finalColor, colorOrange, smoothstep(0.2, 0.6, intensity));
        finalColor = mix(finalColor, colorHighlight, smoothstep(0.6, 1.0, intensity));
        
        // 7. Bloom / Glow Boost
        // Add additive glow to the brightest parts
        float glow = smoothstep(0.7, 1.0, intensity);
        finalColor += colorOrange * glow * 0.3;

        // 8. Post Processing
        
        // Vignette (darken corners)
        vec2 q = vUv;
        float vignette = pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.3);
        finalColor *= mix(0.5, 1.0, vignette);

        // Film Grain (Ultra subtle < 2%)
        float grain = random(uv * uTime) * 0.015;
        finalColor += grain;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // --- Animation Loop ---
    let frameId: number;
    const animate = (time: number) => {
      material.uniforms.uTime.value = time * 0.001;
      
      // Smooth mouse lerp could be added here for even smoother parallax, 
      // but simple uniform update is fine for performant parallax.
      const targetX = (mouseRef.current.x / window.innerWidth - 0.5) * 2;
      const targetY = -(mouseRef.current.y / window.innerHeight - 0.5) * 2;
      
      // Lerp uniform values
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.05;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    // --- Event Listeners ---
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement); // Standard cleanup
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0E0E0E' }} // Base color before load
    />
  );
};

export default CinematicBackground;
