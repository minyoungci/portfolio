import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { createRobotStudio, refineRobotAppearance } from './robotAppearance'

export type RobotMode = 'medical' | 'open' | 'research'
export type RobotAction = 'scan' | 'wave' | 'zoomIn' | 'zoomOut' | 'reset'
export interface RobotController {
  setMode: (mode: RobotMode) => void
  setPaused: (paused: boolean) => void
  act: (action: RobotAction) => void
  dispose: () => void
}

// All motion is an artistic web interaction, not a robot-control or medical simulation.
export function createRobotScene(canvas: HTMLCanvasElement, onStatus: (status: 'ready' | 'fallback') => void): RobotController {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  } catch {
    onStatus('fallback')
    return { setMode() {}, setPaused() {}, act() {}, dispose() {} }
  }
  const host = canvas.parentElement!
  const stage = canvas.closest('.hero-stage')!
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const mobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 40)
  camera.position.set(0, -.18, 7.8)
  camera.lookAt(0, -.32, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor(0x000000, 0)
  let env = createRobotStudio(renderer)
  scene.environment = env.texture
  scene.environmentIntensity = .55
  const key = new THREE.DirectionalLight(0xf1e9ff, 2.1)
  key.position.set(-3, 4, 5)
  key.castShadow = true
  key.shadow.mapSize.setScalar(mobile ? 1024 : 2048)
  Object.assign(key.shadow.camera, { left: -2.8, right: 2.8, top: 2.8, bottom: -2.8, near: .1, far: 15 })
  key.shadow.camera.updateProjectionMatrix()
  key.shadow.bias = -.00015
  key.shadow.normalBias = .006
  const rim = new THREE.DirectionalLight(0xa87aff, 2.4)
  rim.position.set(3, 2, -3)
  const fill = new THREE.DirectionalLight(0x98bdff, .85)
  fill.position.set(-3, 0, 1)
  scene.add(key, rim, fill)
  const robot = new THREE.Group()
  robot.scale.setScalar(6.3)
  robot.position.y = .18
  scene.add(robot)

  const glow = new THREE.MeshBasicMaterial({ color: 0xbf8aff, toneMapped: false })
  const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xa76aff, transparent: true, opacity: .12, blending: THREE.AdditiveBlending, depthWrite: false })
  const hologram = new THREE.Group()
  hologram.position.set(-1.3, .22, .65)
  scene.add(hologram)
  const nodePositions = new Float32Array(48 * 3)
  const destinations = new Float32Array(48 * 3)
  const nodeGeometry = new THREE.BufferGeometry()
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(0xcda9ff) }, pixelRatio: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: 'uniform float pixelRatio; void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=8.*pixelRatio*(4./-p.z);gl_Position=projectionMatrix*p;}',
    fragmentShader: 'uniform vec3 color; void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(color,1.-smoothstep(.1,.5,r));}',
  })
  hologram.add(new THREE.Points(nodeGeometry, nodeMaterial))
  const edgeGeometry = new THREE.BufferGeometry()
  const edgePositions = new Float32Array(96 * 6)
  const edgePairs = new Uint8Array(96 * 2)
  edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xb78cff, transparent: true, opacity: .25, depthWrite: false })
  hologram.add(new THREE.LineSegments(edgeGeometry, edgeMaterial))
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.57, .004, 6, 100), glow)
  ring.rotation.x = Math.PI / 2
  ring.position.y = -.43
  hologram.add(ring)
  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(.64, .002, 4, 100), haloMaterial)
  ringOuter.rotation.copy(ring.rotation)
  ringOuter.position.copy(ring.position)
  hologram.add(ringOuter)

  const scan = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, .018, 64, 1, true), haloMaterial.clone())
  scan.material.opacity = .55
  scan.visible = false
  scene.add(scan)
  const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.45, .008, 6, 100), glow)
  scanRing.rotation.x = Math.PI / 2
  scan.add(scanRing)

  const joints = new Map<string, { object: THREE.Object3D; axis: THREE.Vector3 }>()
  let head: THREE.Object3D | undefined
  let disposed = false, loaded = false, lost = false, visible = false, paused = false
  let frame = 0, last = 0, time = 0, slowFrames = 0
  let yaw = -.24, targetYaw = -.24, zoom = 1, targetZoom = 1
  let scanAge = -1, waveAge = -1
  let gazeX = 0, gazeY = 0
  let entrance = 0, pose = 0, targetPose = 0
  const lightColor = new THREE.Color()
  const pointer = new THREE.Vector2()
  let drag: { id: number; x: number; yaw: number } | null = null
  const abort = new AbortController()
  let mode: RobotMode = 'medical'
  let quality = mobile ? 1.4 : Math.min(devicePixelRatio, 1.8)

  function setMode(next: RobotMode) {
    mode = next
    targetPose = next === 'open' ? 1 : next === 'research' ? -1 : 0
    for (let i = 0; i < 48; i++) {
      const a = (mode === 'medical' ? Math.floor(i / 2) : i) * 2.39996323
      const y = 1 - ((mode === 'medical' ? Math.floor(i / 2) / 23 : i / 47)) * 2
      const r = Math.sqrt(1 - y * y)
      if (mode === 'medical') {
        // Two hemispheres, with organic folds, make the data metaphor readable at a glance.
        const hemisphere = i % 2 ? 1 : -1
        destinations.set([hemisphere * (.19 + Math.cos(a) * r * .16), y * .3, Math.sin(a) * r * .33], i * 3)
      } else if (mode === 'open') {
        const layer = Math.floor(i / 16)
        destinations.set([((i % 4) - 1.5) * .22, (layer - 1) * .32, ((Math.floor(i / 4) % 4) - 1.5) * .22], i * 3)
      } else {
        const t = i / 47 * Math.PI * 4
        destinations.set([Math.cos(t) * .32, (i / 47 - .5) * .85, Math.sin(t) * .32], i * 3)
      }
    }
    for (let i = 0; i < 48; i++) {
      const nearest = Array.from({ length: 48 }, (_, j) => ({ j, distance: j === i ? Infinity : [0, 1, 2].reduce((sum, axis) => sum + (destinations[i * 3 + axis] - destinations[j * 3 + axis]) ** 2, 0) })).sort((a, b) => a.distance - b.distance)
      edgePairs.set([i, nearest[0].j, i, nearest[1].j], i * 4)
    }
    if (!loaded || paused || reduced.matches) nodePositions.set(destinations)
    drawOnce()
  }

  function joint(name: string, angle: number) {
    const j = joints.get(name)
    if (j) j.object.quaternion.setFromAxisAngle(j.axis, angle)
  }

  function update(dt: number, animate: boolean) {
    const blend = animate ? 1 - Math.exp(-dt * 7) : 1
    yaw = THREE.MathUtils.lerp(yaw, targetYaw, blend)
    zoom = THREE.MathUtils.lerp(zoom, targetZoom, blend)
    gazeX = THREE.MathUtils.lerp(gazeX, pointer.x, blend)
    gazeY = THREE.MathUtils.lerp(gazeY, pointer.y, blend)
    pose = THREE.MathUtils.lerp(pose, targetPose, blend)
    // A single entrance opens the composition; switching themes never replays it.
    entrance = animate ? Math.min(1, entrance + dt / 1.4) : 1
    const arrived = 1 - (1 - entrance) ** 3
    robot.rotation.y = yaw + gazeX * .045 + pose * .14 - (1 - arrived) * .42
    robot.rotation.z = animate ? Math.sin(time * .6) * .008 : 0
    robot.position.y = .18 - (1 - arrived) * .22 + (animate ? Math.sin(time * .9) * .018 : 0)
    if (head) head.rotation.set(0, -gazeY * .12, -gazeX * .26, 'ZYX')
    const wave = waveAge >= 0 ? Math.sin(Math.min(waveAge / .65, 1) * Math.PI / 2) * Math.min((3.4 - waveAge) / .65, 1) : 0
    // Open the framing for a raised hand, including at the user's closest zoom.
    camera.zoom = zoom * (1 - wave * .22) * (.94 + arrived * .06)
    camera.updateProjectionMatrix()
    joint('right_shoulder_pitch_joint', -.14 - wave * .84)
    joint('right_shoulder_roll_joint', -.12 - wave * .45)
    joint('right_elbow_joint', .2 * (1 - wave))
    joint('right_wrist_roll_joint', wave * Math.sin(waveAge * 10) * .4)
    joint('left_shoulder_pitch_joint', -.24 + pose * .12)
    joint('left_shoulder_roll_joint', .18 + Math.abs(pose) * .08)
    joint('left_elbow_joint', .7 - pose * .25)
    hologram.rotation.y = animate ? time * .16 : 0
    hologram.position.set(-1.3 + pose * .12, .22 - pose * .12 + (animate ? Math.sin(time * 1.2) * .04 : 0), .65)
    hologram.scale.setScalar(.65 + arrived * .35)
    key.position.x = -3 + gazeX * .65
    key.position.y = 4 + gazeY * .35
    lightColor.set(mode === 'research' ? 0x9caeff : mode === 'open' ? 0xe3b3ff : 0xbf8aff)
    glow.color.lerp(lightColor, blend)
    rim.color.lerp(lightColor, blend)
    nodeMaterial.uniforms.color.value.lerp(lightColor, blend)
    for (let i = 0; i < nodePositions.length; i++) nodePositions[i] += (destinations[i] - nodePositions[i]) * blend
    nodeGeometry.attributes.position.needsUpdate = true
    for (let i = 0; i < 96; i++) {
      const a = edgePairs[i * 2]
      const b = edgePairs[i * 2 + 1]
      edgePositions.set(nodePositions.subarray(a * 3, a * 3 + 3), i * 6)
      edgePositions.set(nodePositions.subarray(b * 3, b * 3 + 3), i * 6 + 3)
    }
    edgeGeometry.attributes.position.needsUpdate = true
    edgeGeometry.computeBoundingSphere()
    nodeGeometry.computeBoundingSphere()
    scan.visible = scanAge >= 0
    scan.position.y = 1.6 - Math.max(0, scanAge) * 1.45
  }

  function active() { return loaded && visible && !document.hidden && !lost && !disposed }
  function drawOnce() {
    if (!active()) return
    update(0, !paused && !reduced.matches)
    renderer.render(scene, camera)
  }
  function tick(now: number) {
    frame = 0
    if (!active() || paused || reduced.matches) return
    const raw = last ? (now - last) / 1000 : 1 / 60
    const dt = Math.min(raw, .05)
    last = now
    time += dt
    if (scanAge >= 0) { scanAge += dt; if (scanAge > 2.3) scanAge = -1 }
    if (waveAge >= 0) { waveAge += dt; if (waveAge > 3.4) waveAge = -1 }
    if (raw > .034) slowFrames++
    else slowFrames = Math.max(0, slowFrames - 1)
    if (slowFrames > 90 && quality > 1) { quality = 1; resize(); slowFrames = 0 }
    update(dt, true)
    renderer.render(scene, camera)
    frame = requestAnimationFrame(tick)
  }
  function sync() {
    cancelAnimationFrame(frame)
    frame = 0
    last = 0
    if (active()) {
      drawOnce()
      if (!paused && !reduced.matches) frame = requestAnimationFrame(tick)
    }
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height || disposed) return
    renderer.setPixelRatio(quality)
    renderer.setSize(width, height, false)
    nodeMaterial.uniforms.pixelRatio.value = quality
    camera.aspect = width / height
    // Portrait framing retains the whole upper body without clipping its shoulders.
    camera.position.z = Math.max(7.8, 7.8 / camera.aspect)
    camera.updateProjectionMatrix()
    drawOnce()
  }
  function pointerMove(event: PointerEvent) {
    if (!loaded) return
    const rect = canvas.getBoundingClientRect()
    if (!paused && !reduced.matches) pointer.set(THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1), THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1))
    if (drag && drag.id === event.pointerId) {
      targetYaw = THREE.MathUtils.clamp(drag.yaw + (event.clientX - drag.x) * .008, -1.1, 1.1)
      if (paused || reduced.matches) drawOnce()
    }
  }
  function pointerDown(event: PointerEvent) {
    if (!loaded || event.button !== 0) return
    drag = { id: event.pointerId, x: event.clientX, yaw: targetYaw }
    canvas.setPointerCapture(event.pointerId)
  }
  function pointerEnd(event: PointerEvent) {
    if (drag?.id === event.pointerId) drag = null
    if (event.pointerType !== 'mouse') pointer.set(0, 0)
  }
  function pointerLeave() { if (!drag) pointer.set(0, 0) }
  function keyDown(event: KeyboardEvent) {
    if (!loaded) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      targetYaw = THREE.MathUtils.clamp(targetYaw + (event.key === 'ArrowLeft' ? -.15 : .15), -1.1, 1.1)
      drawOnce()
    } else if (['+', '=', '-', 'Home'].includes(event.key)) {
      event.preventDefault()
      act(event.key === 'Home' ? 'reset' : event.key === '-' ? 'zoomOut' : 'zoomIn')
    }
  }
  function act(action: RobotAction) {
    if (!loaded) return
    const still = paused || reduced.matches
    if (action === 'scan') scanAge = still ? 1 : 0
    if (action === 'wave') waveAge = still ? 1.2 : 0
    if (action === 'zoomIn') targetZoom = Math.min(1.22, targetZoom + .1)
    if (action === 'zoomOut') targetZoom = Math.max(.8, targetZoom - .1)
    if (action === 'reset') { targetYaw = -.24; targetZoom = 1; pointer.set(0, 0); waveAge = scanAge = -1 }
    drawOnce()
  }

  function contextLost(event: Event) { event.preventDefault(); lost = true; sync(); onStatus('fallback') }
  function contextRestored() {
    lost = false
    env.dispose()
    env = createRobotStudio(renderer)
    scene.environment = env.texture
    if (loaded) { onStatus('ready'); resize(); sync() }
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: 0 })
  observer.observe(canvas)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  document.addEventListener('visibilitychange', sync)
  reduced.addEventListener('change', sync)
  stage.addEventListener('pointermove', pointerMove as EventListener, { passive: true })
  stage.addEventListener('pointerleave', pointerLeave)
  canvas.addEventListener('pointerdown', pointerDown)
  canvas.addEventListener('pointerup', pointerEnd)
  canvas.addEventListener('pointercancel', pointerEnd)
  canvas.addEventListener('lostpointercapture', pointerEnd)
  canvas.addEventListener('keydown', keyDown)
  canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('webglcontextrestored', contextRestored)
  setMode('medical')
  resize()

  function disposeObject(object: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    object.traverse(item => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Points || item instanceof THREE.Line) {
        geometries.add(item.geometry)
        for (const material of Array.isArray(item.material) ? item.material : [item.material]) materials.add(material)
      }
    })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => material.dispose())
  }

  fetch(`/models/robot/robot-${mobile ? 'mobile' : 'desktop'}.glb`, { signal: abort.signal })
    .then(response => { if (!response.ok) throw new Error('Robot model unavailable'); return response.arrayBuffer() })
    .then(buffer => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer, ''))
    .then(gltf => {
      if (disposed) { disposeObject(gltf.scene); return }
      robot.add(gltf.scene)
      gltf.scene.traverse(object => {
        if (Array.isArray(object.userData.axis)) joints.set(object.name, { object, axis: new THREE.Vector3().fromArray(object.userData.axis) })
        if (object.name === 'head_gaze') head = object
      })
      refineRobotAppearance(gltf.scene, glow)
      loaded = true
      onStatus(lost ? 'fallback' : 'ready')
      sync()
    }).catch(() => { if (!disposed) onStatus('fallback') })

  return {
    setMode,
    setPaused(value) { paused = value; pointer.set(0, 0); sync() },
    act,
    dispose() {
      disposed = true
      abort.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
      stage.removeEventListener('pointermove', pointerMove as EventListener)
      stage.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointerup', pointerEnd)
      canvas.removeEventListener('pointercancel', pointerEnd)
      canvas.removeEventListener('lostpointercapture', pointerEnd)
      canvas.removeEventListener('keydown', keyDown)
      canvas.removeEventListener('webglcontextlost', contextLost)
      canvas.removeEventListener('webglcontextrestored', contextRestored)
      disposeObject(scene)
      key.shadow.dispose()
      env.dispose()
      renderer.dispose()
    },
  }
}
