(function () {
  const canvas = document.getElementById("triforce-canvas");
  const W = 400,
    H = 400;
  canvas.width = W;
  canvas.height = H;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });

  renderer.setSize(W, H);
  renderer.setPixelRatio(1);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  camera.position.z = 1;

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png",
    function (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearFilter;

      const uniforms = {
        u_res: { value: new THREE.Vector2(W, H) },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_time: { value: 0 },
        u_noise: { value: tex },
        u_moved: { value: false },
        u_hover: { value: 0.0 },
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: document.getElementById("vtx").textContent,
        fragmentShader: document.getElementById("frg").textContent,
      });

      scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), mat));

      // Mouse tracking relativo al canvas, no a la ventana
      // reemplaza el listener de pointermove
      let hoverTarget = 0;
      document
        .querySelector(".footer-site")
        .addEventListener("pointermove", function (e) {
          const rect = canvas.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          uniforms.u_mouse.value.x = ((e.clientX - cx) / rect.width) * 1.4;
          uniforms.u_mouse.value.y = -((e.clientY - cy) / rect.height) * 1.4;
          uniforms.u_moved.value = true;
          hoverTarget = 1.0;
        });
      document
        .querySelector(".footer-site")
        .addEventListener("pointerleave", function () {
          uniforms.u_moved.value = false;
          hoverTarget = 0.0;
        });

      // en el animate, interpola suavemente
      (function animate() {
        requestAnimationFrame(animate);
        uniforms.u_time.value = (uniforms.u_time.value + 0.012) % 1000000;
        uniforms.u_hover.value += (hoverTarget - uniforms.u_hover.value) * 0.05;
        renderer.render(scene, camera);
      })();
    },
  );
})();
