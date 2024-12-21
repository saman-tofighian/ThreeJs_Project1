import GUI from "lil-gui";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Sc = new three.Scene();

const texture = new three.TextureLoader();
const tx = texture.load("texture/9.png");

let parameters = {};
parameters.size = 0.01;
parameters.cnt = 5000;
parameters.radius = 3;
parameters.branches = 5;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnesspower = 1;
parameters.insideColor = "#fff";
parameters.outsideColor = "#ff5588";

const gui = new GUI({
  width: 350,
});

let stars = null;
let starMaterial = null;
let starPoints = null;

const galaxy = () => {
  if (starPoints !== null) {
    stars.dispose();
    starMaterial.dispose();
    Sc.remove(starPoints);
  }

  stars = new three.BufferGeometry();
  const starsPosition = new Float32Array(parameters.cnt * 3);

  
  let color = new Float32Array(parameters.cnt * 3);

  let insideColor = new three.Color(parameters.insideColor);
  let outsideColor = new three.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.cnt; ++i) {
    let i3 = i * 3;

   
    let radius = Math.random() * parameters.radius;

    
    let spin = radius * parameters.spin;

   
    let branchesAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    
    let x =
      Math.pow(Math.random(), parameters.randomnesspower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    let y =
      Math.pow(Math.random(), parameters.randomnesspower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    let z =
      Math.pow(Math.random(), parameters.randomnesspower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

  
    starsPosition[i3 + 0] = radius * Math.cos(branchesAngle + spin) + x;
    starsPosition[i3 + 1] = y;
    starsPosition[i3 + 2] = radius * Math.sin(branchesAngle + spin) + z;

    

    
    let mixer = insideColor.clone();
    mixer.lerp(outsideColor, radius / parameters.radius);

   
    color[i3 + 0] = mixer.r;
    color[i3 + 1] = mixer.g;
    color[i3 + 2] = mixer.b;
  }

  stars.setAttribute("position", new three.BufferAttribute(starsPosition, 3));
  
  stars.setAttribute("color", new three.BufferAttribute(color, 3));

  starMaterial = new three.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: tx,
    depthTest: false,
    depthWrite: false,
    blending: three.AdditiveBlending,
    vertexColors: true,
  });
  starPoints = new three.Points(stars, starMaterial);
  Sc.add(starPoints);
};
galaxy();

gui
  .add(parameters, "cnt", parameters.cnt, 7000, 200)
  .name("stars count")
  .onFinishChange(galaxy);
gui
  .add(parameters, "size", parameters.size, 0.02, 0.001)
  .name("stars size")
  .onFinishChange(galaxy);

gui
  .add(parameters, "radius", parameters.radius, 25, 1)
  .name("galaxy radius")
  .onFinishChange(galaxy);

gui
  .add(parameters, "branches", 2, 7, 1)
  .name("galaxy branches")
  .onFinishChange(galaxy);

gui
  .add(parameters, "spin", -5, 5, 1)
  .name("branches spin")
  .onFinishChange(galaxy);

gui
  .add(parameters, "randomness", parameters.randomness, 2, 0.1)
  .name("branches randomness")
  .onFinishChange(galaxy);

gui
  .add(parameters, "randomnesspower", parameters.randomnesspower, 5, 0.1)
  .name("branches randomnessPower")
  .onFinishChange(galaxy);

gui
  .addColor(parameters, "insideColor")
  .name("insideColor")
  .onFinishChange(galaxy);

gui
  .addColor(parameters, "outsideColor")
  .name("outsideColor")
  .onFinishChange(galaxy);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const Camera = new three.PerspectiveCamera(75, size.width / size.height);
Camera.position.z = 6;
Sc.add(Camera);
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
const clock = new three.Clock();
const animation = () => {
  const elapsed = clock.getElapsedTime();
  starPoints.rotation.y = elapsed / 6;
  orbit.update();
  renderer.render(Sc, Camera);
  window.requestAnimationFrame(animation);
};
animation();
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  Camera.aspect = size.width / size.height;
  Camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});