import * as three from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
const Sc = new three.Scene();

const FontLo = new FontLoader();
FontLo.load("fonts/Roboto Thin_Regular.json", (font) => {
  const TextGo = new TextGeometry("Saman Tofighian", {
    font: font,
    size: 1.5,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
  });
  TextGo.center();
  const material = new three.MeshNormalMaterial({
    flatShading: true,
  });
  const mesh = new three.Mesh(TextGo, material);
  Sc.add(mesh);
});

const texture = new three.TextureLoader();
const tx = texture.load("texture/11.png");

const particles = new three.BufferGeometry();
const count = 7000;
const positionArray = new Float32Array(count);
for (let i = 0; i < count; i++) {
  positionArray[i] = (Math.random() - 0.5) * 20;
}

particles.setAttribute("position", new three.BufferAttribute(positionArray, 3));

const particlesMaterila = new three.PointsMaterial({
  size: 0.4,
  sizeAttenuation: true,
  transparent: true,
  map: tx,
  depthTest: false,
  depthWrite: false,
  blending: three.AdditiveBlending,
});
const partticlesMesh = new three.Points(particles, particlesMaterila);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const Camera = new three.PerspectiveCamera(35, size.width / size.height);
Camera.position.z = 15;
Sc.add(partticlesMesh, Camera);
const canvas = document.getElementById("web");
const renderer = new three.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
const orbit = new OrbitControls(Camera, canvas);
orbit.enableDamping = true;
orbit.mouseButtons = {
  LEFT: three.MOUSE.ROTATE,
  MIDDLE: three.MOUSE.ROTATE,
  RIGHT: three.MOUSE.ROTATE,
};
const animation = () => {
  orbit.update();
  renderer.render(Sc, Camera);
  window.requestAnimationFrame(animation);
  for (let i = 0; i < count; i++) {
    let i3 = i * 3;
    particles.attributes.position.array[i3 + 1] += 0.01; // حرکت به سمت بالا
    if (particles.attributes.position.array[i3 + 1] > 5) {
      particles.attributes.position.array[i3 + 1] = -5; // بازگشت به پایین
    }
  }
  particles.attributes.position.needsUpdate = true;
};
animation();
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  Camera.aspect = size.width / size.height;
  Camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
