import * as THREE from 'three'

export interface ParticleSphereController {
  setPaused: (paused: boolean) => void
  dispose: () => void
}

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uPointer;
  uniform float uInteraction;
  attribute float aSeed;
  varying float vDepth;
  varying float vLight;
  void main() {
    vec3 p = position;
    float wave = sin(p.y * 4.0 + uTime * .65) * sin(p.x * 3.0 - uTime * .35);
    p *= 1.0 + wave * .018;
    vec4 world = modelViewMatrix * vec4(p, 1.0);
    vec2 offset = world.xy - uPointer;
    float influence = exp(-dot(offset, offset) * 2.8) * uInteraction;
    world.xy += offset * influence * .35;
    world.z += influence * .32;
    vDepth = smoothstep(-1.65, 1.65, world.z + 5.0);
    vLight = influence * .85 + pow(aSeed, 9.0) * .65;
    gl_PointSize = uPixelRatio * uSize * (1.0 + aSeed * .8 + vDepth * .45 + influence);
    gl_Position = projectionMatrix * world;
  }
`
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  varying float vDepth;
  varying float vLight;
  void main() {
    float r = length(gl_PointCoord - .5);
    float alpha = (1.0 - smoothstep(.18, .5, r)) * (.22 + vDepth * .68);
    if (alpha < .02) discard;
    gl_FragColor = vec4(mix(uColor, uHighlight, min(vLight, .85)), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createParticleSphere(canvas: HTMLCanvasElement, onStatus: (status: 'ready' | 'fallback') => void): ParticleSphereController {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  } catch {
    onStatus('fallback')
    return { setPaused() {}, dispose() {} }
  }

  const host = canvas.parentElement!
  const stage = canvas.closest('.hero-stage')!
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  const colorPreference = matchMedia('(prefers-color-scheme: light)')
  const mobile = matchMedia('(max-width: 700px), (pointer: coarse)')
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, .1, 20)
  camera.position.z = 5
  const group = new THREE.Group()
  group.rotation.set(-.12, 0, -.17)
  scene.add(group)

  // Interleave the sphere so a reduced draw range still covers the whole surface.
  const count = 7200
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const sample = (i * 1877) % count
    const y = 1 - (sample / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = sample * Math.PI * (3 - Math.sqrt(5))
    positions.set([Math.cos(angle) * radius * 1.5, y * 1.5, Math.sin(angle) * radius * 1.5], i * 3)
    seeds[i] = (i * .61803398875) % 1
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  const uniforms = {
    uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 1.5 },
    uPointer: { value: new THREE.Vector2(0, 0) }, uInteraction: { value: 0 },
    uColor: { value: new THREE.Color() }, uHighlight: { value: new THREE.Color() },
  }
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false })
  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 192 }, (_, i) => {
    const a = i / 192 * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * 1.84, Math.sin(a) * 1.84, 0)
  }))
  const orbitMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: .22, depthWrite: false })
  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial)
  orbit.rotation.set(1.12, .28, -.35)
  group.add(orbit)

  let disposed = false
  let lost = false
  let paused = false
  let visible = false
  let frame = 0
  let last = 0
  let elapsed = 0
  let slowFrames = 0
  let quality = 1
  let interaction = 0
  const target = new THREE.Vector2()
  const pointer = new THREE.Vector2()

  function draw() {
    if (!lost && !disposed) renderer.render(scene, camera)
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.35 : 1.6) * quality
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(width, height, false)
    const halfHeight = 1.98
    camera.left = -halfHeight * width / height
    camera.right = halfHeight * width / height
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.updateProjectionMatrix()
    uniforms.uPixelRatio.value = pixelRatio
    uniforms.uSize.value = mobile.matches ? 1.5 : 1.7
    geometry.setDrawRange(0, mobile.matches ? 3200 : count)
    draw()
  }
  function recolor() {
    const styles = getComputedStyle(host)
    uniforms.uColor.value.set(styles.getPropertyValue('--accent').trim())
    uniforms.uHighlight.value.set(styles.getPropertyValue('--foreground').trim())
    orbitMaterial.color.copy(uniforms.uColor.value)
    draw()
  }
  function animate(now: number) {
    frame = 0
    const rawDelta = last ? (now - last) / 1000 : 0
    const delta = Math.min(rawDelta, .05)
    last = now
    elapsed += delta
    // One modest quality reduction for sustained slow frames; never allocate per frame.
    if (rawDelta > .026 && rawDelta < .2) slowFrames++
    else slowFrames = Math.max(0, slowFrames - 1)
    if (slowFrames > 70 && quality === 1) { quality = .75; resize() }
    pointer.lerp(target, 1 - Math.exp(-delta * 5))
    uniforms.uInteraction.value += (interaction - uniforms.uInteraction.value) * (1 - Math.exp(-delta * 5))
    uniforms.uPointer.value.copy(pointer)
    uniforms.uTime.value = elapsed
    group.rotation.y = elapsed * .065 + pointer.x * .09 * uniforms.uInteraction.value
    group.rotation.x = -.12 - pointer.y * .065 * uniforms.uInteraction.value
    group.rotation.z = -.17
    draw()
    frame = requestAnimationFrame(animate)
  }
  function syncMotion() {
    cancelAnimationFrame(frame)
    frame = 0
    last = 0
    if (disposed || lost || paused || motionPreference.matches || !visible || document.hidden) return
    frame = requestAnimationFrame(animate)
  }
  function move(event: Event) {
    if (paused || motionPreference.matches) return
    const e = event as PointerEvent
    const rect = host.getBoundingClientRect()
    target.set(((e.clientX - rect.left) / rect.width * 2 - 1) * camera.right, (1 - (e.clientY - rect.top) / rect.height * 2) * camera.top)
    target.clampScalar(-2.5, 2.5)
    interaction = 1
  }
  function leave() { interaction = 0; target.set(0, 0) }
  function release(event: Event) { if ((event as PointerEvent).pointerType !== 'mouse') leave() }
  function contextLost(event: Event) {
    event.preventDefault()
    lost = true
    syncMotion()
    onStatus('fallback')
  }
  function contextRestored() {
    lost = false
    resize()
    recolor()
    onStatus('ready')
    syncMotion()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    syncMotion()
  }, { threshold: 0 })
  intersectionObserver.observe(host)
  stage.addEventListener('pointermove', move, { passive: true })
  stage.addEventListener('pointerdown', move, { passive: true })
  stage.addEventListener('pointerleave', leave)
  stage.addEventListener('pointerup', release)
  stage.addEventListener('pointercancel', leave)
  canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('webglcontextrestored', contextRestored)
  document.addEventListener('visibilitychange', syncMotion)
  motionPreference.addEventListener('change', syncMotion)
  colorPreference.addEventListener('change', recolor)
  mobile.addEventListener('change', resize)
  resize()
  recolor()
  onStatus('ready')

  return {
    setPaused(value) { paused = value; syncMotion() },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerdown', move)
      stage.removeEventListener('pointerleave', leave)
      stage.removeEventListener('pointerup', release)
      stage.removeEventListener('pointercancel', leave)
      canvas.removeEventListener('webglcontextlost', contextLost)
      canvas.removeEventListener('webglcontextrestored', contextRestored)
      document.removeEventListener('visibilitychange', syncMotion)
      motionPreference.removeEventListener('change', syncMotion)
      colorPreference.removeEventListener('change', recolor)
      mobile.removeEventListener('change', resize)
      geometry.dispose()
      material.dispose()
      orbitGeometry.dispose()
      orbitMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
