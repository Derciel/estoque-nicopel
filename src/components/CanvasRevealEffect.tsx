import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  reverse?: boolean;
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[255, 255, 255]],
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  totalSize = 20,
  dotSize = 3,
  reverse = false,
}) => {
  const uniforms = useMemo(() => {
    const colorsArray = Array(6).fill(colors[0]);
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
      },
      u_opacities: {
        value: new Float32Array(opacities),
      },
      u_total_size: {
        value: totalSize,
      },
      u_dot_size: {
        value: dotSize,
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return <Shader uniforms={uniforms} reverse={reverse} />;
};

const ShaderMaterial = ({ uniforms, reverse }: any) => {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const material = useMemo(() => {
    const preparedUniforms: { [key: string]: THREE.IUniform } = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width * 2, size.height * 2) },
      u_colors: { value: uniforms.u_colors.value.map((v: number[]) => new THREE.Vector3().fromArray(v)) },
      u_opacities: { value: uniforms.u_opacities.value },
      u_total_size: { value: uniforms.u_total_size.value },
      u_dot_size: { value: uniforms.u_dot_size.value },
    };

    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        varying vec2 vUv;

        float PHI = 1.61803398874989484820459;

        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }

        void main() {
          vec2 st = vUv * u_resolution;
          st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
          st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

          float frequency = 5.0;
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(show_offset * 6.0)];

          vec2 center_grid = u_resolution / 2.0 / u_total_size;
          float dist_from_center = distance(center_grid, st2);
          float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
          float timing_offset = ${reverse ? "(max_grid_dist - dist_from_center)" : "dist_from_center"} * 0.01 + (random(st2) * 0.15);
          opacity *= step(timing_offset, u_time * 0.5);
          opacity *= clamp((1.0 - step(timing_offset + 0.1, u_time * 0.5)) * 1.25, 1.0, 1.25);

          gl_FragColor = vec4(color, opacity);
          gl_FragColor.rgb *= gl_FragColor.a;
        }
      `,
      uniforms: preparedUniforms,
      transparent: true,
    });
  }, [uniforms, size, reverse]);

  return <primitive object={material} ref={materialRef} />;
};

const Shader: React.FC<{ uniforms: any; reverse: boolean }> = ({ uniforms, reverse }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <mesh>
        <planeGeometry args={[2, 2]} />
        <ShaderMaterial uniforms={uniforms} reverse={reverse} />
      </mesh>
    </Canvas>
  );
};

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
  reverse = false,
}) => {
  return (
    <div className={`h-full relative w-full ${containerClassName}`}>
      <div className="h-full w-full">
        <DotMatrix colors={colors} dotSize={dotSize} reverse={reverse} />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      )}
    </div>
  );
};