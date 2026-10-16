import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Model-space dimensions are metres. The original joint hierarchy stays intact.
export function refineRobotAppearance(model: THREE.Group, glow: THREE.MeshBasicMaterial) {
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xd9dfe8, metalness: .12, roughness: .32, clearcoat: .25, clearcoatRoughness: .3 })
  const titanium = new THREE.MeshStandardMaterial({ color: 0x8a95a5, metalness: .88, roughness: .27 })
  const graphite = new THREE.MeshStandardMaterial({ color: 0x171c28, metalness: .5, roughness: .38 })
  const grip = new THREE.MeshStandardMaterial({ color: 0x242936, metalness: .05, roughness: .78 })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050a13, metalness: .25, roughness: .19, clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: .5 })
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x17305a, metalness: .5, roughness: .1, clearcoat: 1, envMapIntensity: .75 })
  const replaced = new Set<THREE.Material>()
  model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return
    const previous = object.material as THREE.Material
    object.castShadow = object.receiveShadow = true
    replaced.add(previous)
    object.material = previous.name === 'Ceramic alloy' ? ceramic : graphite
    if (/wrist|shoulder_pitch|elbow/.test(object.name)) object.material = titanium
    if (/hand_(index_1|middle_1|thumb_2)_link/.test(object.name)) object.material = grip
  })
  replaced.forEach(material => material.dispose())

  // Convert a conventional front-facing detail into the source robot's X-forward axes.
  function mount(parent: THREE.Object3D, x: number, y: number, z: number) {
    const group = new THREE.Group()
    group.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1))
    group.position.set(x, y, z)
    parent.add(group)
    return group
  }
  function part(parent: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = material !== glow
    mesh.receiveShadow = material !== glow
    mesh.position.set(x, y, z)
    parent.add(mesh)
    return mesh
  }
  function plate(points: number[][], depth: number, bevel: number) {
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)))
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, steps: 1, curveSegments: 12 })
  }
  function box(w: number, h: number, d: number, r: number) { return new RoundedBoxGeometry(w, h, d, 2, r) }
  function ring(radius: number, width: number) { return new THREE.TorusGeometry(radius, width, 8, 48) }

  const head = model.getObjectByName('head_gaze')
  if (head) {
    const helmet = mount(head, .008, 0, .117)
    helmet.name = 'optical_helmet'
    // A continuous crown and tapered jaw avoid a stack of primitive shapes.
    const profile = new THREE.CatmullRomCurve3([
      new THREE.Vector3(.008, -.081, 0), new THREE.Vector3(.042, -.075, 0),
      new THREE.Vector3(.061, -.047, 0), new THREE.Vector3(.072, .006, 0),
      new THREE.Vector3(.069, .045, 0), new THREE.Vector3(.052, .073, 0),
      new THREE.Vector3(.026, .085, 0), new THREE.Vector3(0, .088, 0),
    ])
    const shell = new THREE.LatheGeometry(profile.getPoints(32).map(p => new THREE.Vector2(p.x, p.y)), 64)
    shell.scale(1, 1, .83)
    part(helmet, shell, ceramic)
    // The visor wraps around the temples. Its lip is a real silhouette, not a decal.
    const vertices: number[] = [], indices: number[] = [], top: THREE.Vector3[] = [], bottom: THREE.Vector3[] = []
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40 - .5) * 2.45
      const x = Math.sin(a) * .0735, z = Math.cos(a) * .062
      const upper = .036 - Math.pow(Math.abs(a) / 1.225, 3) * .01
      const lower = -.027 + Math.pow(Math.abs(a) / 1.225, 3) * .012
      top.push(new THREE.Vector3(x, upper, z))
      bottom.push(new THREE.Vector3(x, lower, z))
      vertices.push(x, upper, z, x, lower, z)
      if (i < 40) { const n = i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2) }
    }
    const visor = new THREE.BufferGeometry()
    visor.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    visor.setIndex(indices)
    visor.computeVertexNormals()
    part(helmet, visor, glass)
    for (const edge of [top, bottom]) part(helmet, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge), 48, .0012, 6, false), titanium)
    part(helmet, box(.019, .001, .001, .0004), glow, 0, .005, .063)
    for (const side of [-1, 1]) {
      const optics = new THREE.Group()
      optics.position.set(side * .029, .006, .058)
      optics.rotation.y = side * .4
      helmet.add(optics)
      part(optics, box(.027, .012, .0015, .004), graphite)
      part(optics, ring(.0045, .0007), titanium, 0, 0, .0015)
      part(optics, new THREE.SphereGeometry(.0038, 24, 12), lens, 0, 0, .002).scale.z = .35
      part(optics, new THREE.TorusGeometry(.0058, .00045, 6, 32, Math.PI), glow, 0, 0, .002)
      part(optics, new THREE.CircleGeometry(.0009, 12), glow, -.001, .001, .0035)
      const ear = part(helmet, new THREE.CylinderGeometry(.019, .019, .006, 48), graphite, side * .072, .001, -.009)
      ear.rotation.z = Math.PI / 2
      const earRim = part(helmet, ring(.015, .0014), titanium, side * .076, .001, -.009)
      earRim.rotation.y = Math.PI / 2
      const earLight = part(helmet, ring(.01, .0006), glow, side * .077, .001, -.009)
      earLight.rotation.y = Math.PI / 2
    }
    // Batch the tiny vents and fasteners; their detail costs two draw calls.
    const vents: THREE.BufferGeometry[] = []
    const fasteners: THREE.BufferGeometry[] = []
    for (let i = -2; i <= 2; i++) vents.push(new THREE.BoxGeometry(.001, .004, .001).translate(i * .004, -.053, .047))
    for (const x of [-.047, .047]) fasteners.push(new THREE.CircleGeometry(.0013, 12).translate(x, -.043, .035))
    for (const [geometries, material] of [[vents, titanium], [fasteners, graphite]] as const) {
      part(helmet, mergeGeometries(geometries)!, material)
      geometries.forEach(geometry => geometry.dispose())
    }
  }
  const torso = model.getObjectByName('waist_pitch_joint')
  if (torso) {
    const core = mount(torso, .086, 0, .17)
    part(core, plate([[-.029, -.025], [-.038, -.006], [-.029, .025], [.029, .025], [.038, -.006], [.029, -.025]], .002, .002), graphite)
    part(core, ring(.0195, .0018), titanium, 0, 0, .005)
    part(core, new THREE.CircleGeometry(.017, 48), glass, 0, 0, .005)
    part(core, ring(.0148, .00065), glow, 0, 0, .006)
    part(core, ring(.0095, .0006), titanium, 0, 0, .006)
    part(core, box(.008, .008, .001, .001), glow, 0, 0, .007).rotation.z = Math.PI / 4
    const marks: THREE.BufferGeometry[] = []
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12
      marks.push(new THREE.BoxGeometry(.0006, i % 3 ? .0015 : .003, .0005).translate(0, .023, .003).rotateZ(a))
    }
    part(core, mergeGeometries(marks)!, titanium)
    marks.forEach(geometry => geometry.dispose())
  }
}

export function createRobotStudio(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene()
  studio.background = new THREE.Color(0x333746)
  const geometry = new THREE.PlaneGeometry(1, 1)
  const materials: THREE.MeshBasicMaterial[] = []
  for (const [x, y, z, w, h, intensity] of [[-3, 3, 4, 3, 5, 5], [4, 1, 2, 1, 4, 2], [1, 4, -3, 4, 2, 3]]) {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(intensity) })
    materials.push(material)
    const softbox = new THREE.Mesh(geometry, material)
    softbox.position.set(x, y, z)
    softbox.scale.set(w, h, 1)
    softbox.lookAt(0, 0, 0)
    studio.add(softbox)
  }
  const pmrem = new THREE.PMREMGenerator(renderer)
  const target = pmrem.fromScene(studio, .035)
  geometry.dispose()
  materials.forEach(material => material.dispose())
  pmrem.dispose()
  return target
}
