"use client"

import React, { Suspense, useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2, Maximize2, Minimize2 } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PresentationControls, Html, useProgress } from "@react-three/drei"
import type * as THREE from "three"

// Mock URL for the 3D model - replace with your actual path
const peakyUrl = "/assets/models/peaky3D.glb"

/* ----------------------------- Mockups data ----------------------------- */
const mockups = [
  {
    id: "dashboard",
    title: "Dashboard del Docente",
    description: "Vista completa del progreso de la clase con métricas en tiempo real",
    image: "/assets/blackBoardView.jpeg",
    secondaryImage: "/assets/gamesView.jpeg",
    features: ["Analíticas en tiempo real", "Gestión de estudiantes", "Configuración de lecciones"],
  },
  {
    id: "game-interface",
    title: "Interfaz de Juego",
    description: "Experiencia inmersiva para estudiantes con mecánicas intuitivas",
    image: "/assets/mainView.jpeg",
    secondaryImage: "/assets/gameView.jpeg",
    features: ["Controles táctiles", "Feedback inmediato", "Progreso visual"],
  },
  {
    id: "analytics",
    title: "Analíticas Detalladas",
    description: "Reportes comprensivos sobre el desempeño y áreas de mejora",
    image: "/assets/feedBackView.jpeg",
    secondaryImage: "/assets/blackBoardView.jpeg",
    features: ["Reportes automáticos", "Insights pedagógicos", "Seguimiento longitudinal"],
  },
  {
    id: "lesson-creator",
    title: "Creador de Lecciones IA",
    description: "Herramienta inteligente que convierte PDFs en experiencias gamificadas",
    image: "/assets/iaView.jpg",
    features: ["Procesamiento IA", "Adaptación automática", "Múltiples formatos"],
  },
]

/* ------------------------- Drei/Three helpers -------------------------- */
function Loader() {
  const { progress } = useProgress()
  const shouldReduceMotion = useReducedMotion()

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600 animate-spin mb-3 sm:mb-4" />
        <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">{Math.round(progress)}% cargado</p>
      </div>
    </Html>
  )
}

function FallbackModel() {
  const modelRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (modelRef.current && !shouldReduceMotion) {
      modelRef.current.rotation.y += hovered ? 0.01 : 0.005
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh
      ref={modelRef}
      scale={[1.2, 1.2, 1.2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={hovered ? "#8b5cf6" : "#6366f1"}
        roughness={0.2}
        metalness={0.8}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

function ModelGLB() {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const gltf = useGLTF(peakyUrl, true)

  useFrame((state) => {
    if (groupRef.current && !shouldReduceMotion) {
      groupRef.current.rotation.y += hovered ? 0.01 : 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <primitive
      ref={groupRef}
      object={gltf.scene}
      scale={window.innerWidth < 768 ? 1.5 : 2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  )
}

class ErrorBoundary extends React.Component<
  {
    fallback: React.ReactNode
    children: React.ReactNode
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("3D Model Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children as any
  }
}

/* ----------------------------- Phone Mockup ----------------------------- */
const PhoneMockup: React.FC<{
  src: string
  alt?: string
  className?: string
  outerHeight?: number
  screenWidth?: number
  priority?: boolean
}> = ({ src, alt = "app screenshot", className = "", outerHeight = 640, screenWidth = 280, priority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  let responsiveHeight = outerHeight
  let responsiveWidth = screenWidth
  let framePadding = 12
  let border = 4

  if (windowWidth < 640) {
    // sm breakpoint
    responsiveHeight = Math.min(480, windowWidth * 0.8) // Max 480px or 80% of screen width
    responsiveWidth = responsiveHeight * 0.45 // Maintain aspect ratio
    framePadding = 8
    border = 3
  } else if (windowWidth < 768) {
    // md breakpoint
    responsiveHeight = outerHeight * 0.8
    responsiveWidth = screenWidth * 0.8
    framePadding = 10
    border = 3
  }

  const chrome = framePadding * 2 + border * 2
  const screenHeight = responsiveHeight - chrome

  return (
    <div
      className={`relative bg-black rounded-2xl sm:rounded-[3rem] shadow-xl sm:shadow-2xl border-2 sm:border-4 border-gray-900 ${className}`}
      style={{
        height: responsiveHeight,
        padding: framePadding,
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-28 h-3 sm:h-4 md:h-6 bg-black rounded-b-2xl sm:rounded-b-3xl z-10" />

      <div
        className="rounded-xl sm:rounded-[2rem] overflow-hidden bg-gray-100 mx-auto aspect-[9/19] relative"
        style={{ height: screenHeight, width: responsiveWidth }}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs sm:text-sm p-2 sm:p-4 text-center">
            Error al cargar imagen
          </div>
        ) : (
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </div>
  )
}

/* ----------------------------- 3D Card UI ------------------------------ */
function Peaky3DCard() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-white ${
        isFullscreen ? "fixed inset-4 z-50" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 relative ${
          isFullscreen ? "h-full" : "aspect-video"
        }`}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[10, -10, 10]} intensity={0.5} color="#3b82f6" />
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr" />

          <PresentationControls
            enabled
            global={false}
            cursor
            snap={false}
            speed={1}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Suspense fallback={<Loader />}>
              <ErrorBoundary fallback={<FallbackModel />}>
                <ModelGLB />
              </ErrorBoundary>
            </Suspense>
          </PresentationControls>

          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Instructions */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: shouldReduceMotion ? 0 : 0.5 }}
            className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center">
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                <span className="hidden sm:inline">🖱️ Arrastrá para rotar • 🔍 Zoom con rueda • </span>📱 Toca y deslizá
                para interactuar
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Status indicator */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-lg animate-pulse"
            title="Modelo 3D cargado y optimizado"
          />

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 sm:p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            ) : (
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* --------------------------- Main export component --------------------------- */
export const ProductShowcase: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isAutoPlaying || shouldReduceMotion) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockups.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, shouldReduceMotion])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsAutoPlaying(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % mockups.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + mockups.length) % mockups.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide])

  const active = mockups[currentSlide]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="text-center mb-8 sm:mb-10 lg:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-balance">
            Conocé a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Peaky</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto text-pretty px-2">
            Nuestro perezoso que representa al alumno que nunca tiene ganas de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              estudiar.
            </span>
          </p>
        </motion.div>

        <Peaky3DCard />

        <div className="mt-10 sm:mt-12 lg:mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Producto en acción</h3>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                />
                <span className="hidden sm:inline">{isAutoPlaying ? "Auto" : "Manual"}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  aria-label="Anterior"
                  disabled={shouldReduceMotion}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  aria-label="Siguiente"
                  disabled={shouldReduceMotion}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6  lg:gap-8 items-stretch"
              >
                <div className="flex items-center justify-center h-full lg:mr-8 order-2 lg:order-1">
                  <div className="block sm:hidden">
                    <PhoneMockup
                      src={active.image}
                      alt={`${active.title} - Vista principal`}
                      className="shrink-0"
                      outerHeight={640}
                      screenWidth={280}
                      priority={currentSlide === 0}
                    />
                  </div>

                  <div className="hidden sm:block">
                    {active.id !== "lesson-creator" ? (
                      <div className="flex flex-row items-end gap-4 lg:mr-8 md:gap-6 lg:gap-8">
                        <PhoneMockup
                          src={active.image}
                          alt={`${active.title} - Vista principal`}
                          className="shrink-0"
                          outerHeight={640}
                          screenWidth={280}
                          priority={currentSlide === 0}
                        />
                        <PhoneMockup
                          src={(active as any).secondaryImage ?? active.image}
                          alt={`${active.title} - Vista secundaria`}
                          className="shrink-0"
                          outerHeight={640}
                          screenWidth={280}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <PhoneMockup
                          src={active.image}
                          alt={`${active.title}`}
                          className="shrink-0"
                          outerHeight={640}
                          screenWidth={280}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 flex flex-col order-1 lg:order-2">
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-balance">
                    {active.title}
                  </h4>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 text-pretty">{active.description}</p>

                  <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-2 sm:gap-3">
                    {active.features.map((feature: string, index: number) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : index * 0.1,
                          duration: shouldReduceMotion ? 0 : 0.3,
                        }}
                        className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="text-gray-800 text-xs sm:text-sm font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 sm:pt-6 flex items-center justify-center gap-2">
                    {mockups.map((mockup, index) => (
                      <button
                        key={mockup.id}
                        onClick={() => goToSlide(index)}
                        className={`h-2 sm:h-2.5 rounded-full transition-all touch-manipulation ${
                          index === currentSlide
                            ? "w-6 sm:w-8 bg-indigo-600"
                            : "w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Ir a ${mockup.title}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-3 sm:mt-4 text-center sm:hidden">
            <p className="text-xs text-gray-500">👈 Deslizá para navegar 👉</p>
          </div>
        </div>
      </div>
    </section>
  )
}

if (typeof window !== "undefined") {
  try {
    useGLTF.preload(peakyUrl)
  } catch (error) {
    console.warn("Could not preload 3D model:", error)
  }
}
