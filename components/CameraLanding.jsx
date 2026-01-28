'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../app/camera-landing.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Preload the model
useGLTF.preload('/assets/camera.glb');

// Camera Model Component
function CameraModel({ scrollProgress, exploreMode }) {
  const gltf = useGLTF('/assets/camera.glb');
  const modelRef = useRef();

  useFrame(() => {
    if (!modelRef.current || exploreMode) return;

    // Subtle rotation
    if (scrollProgress < 0.1 || (scrollProgress > 0.3 && scrollProgress < 0.4)) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  useEffect(() => {
    if (!modelRef.current || !gltf.scene) return;
    modelRef.current.scale.set(2, 2, 2);
    modelRef.current.position.set(0, 0, 0);
  }, [gltf]);

  if (!gltf.scene) return null;

  return <primitive ref={modelRef} object={gltf.scene.clone()} />;
}

// Camera Controller Component with Landing Zones
function CameraController({ scrollProgress, exploreMode }) {
  const { camera } = useThree();

  useFrame(() => {
    if (exploreMode) return;

    // Define camera positions for each section
    const positions = [
      { pos: [0, 0, 5], lookAt: [0, 0, 0] },           // Hero - center
      { pos: [3, 0.5, 3], lookAt: [0, 0, 0] },         // Origin story - right side landing
      { pos: [-3, 0.5, 3], lookAt: [0, 0, 0] },        // Team - left side landing
      { pos: [2.5, -0.5, 2], lookAt: [0, 0, 0] },      // Vision - right low landing
      { pos: [-2.5, 1, 2.5], lookAt: [0, 0, 0] },      // Process - left high landing
      { pos: [0, 2, 3], lookAt: [0, 0, 0] },           // Equipment - top landing
      { pos: [3.5, 0, 2], lookAt: [0, 0, 0] },         // Awards - right side
      { pos: [0, -1, 4], lookAt: [0, 0, 0] },          // Contact - front low
    ];

    const segmentCount = positions.length - 1;
    const segmentProgress = scrollProgress * segmentCount;
    const currentSegment = Math.floor(segmentProgress);
    const segmentLocalProgress = segmentProgress - currentSegment;

    const currentIndex = Math.min(currentSegment, positions.length - 1);
    const nextIndex = Math.min(currentIndex + 1, positions.length - 1);

    const currentPos = positions[currentIndex].pos;
    const nextPos = positions[nextIndex].pos;
    const currentLookAt = positions[currentIndex].lookAt;
    const nextLookAt = positions[nextIndex].lookAt;

    // Smooth easing for landing
    const eased = segmentLocalProgress < 0.5
      ? 4 * segmentLocalProgress * segmentLocalProgress * segmentLocalProgress
      : 1 - Math.pow(-2 * segmentLocalProgress + 2, 3) / 2;

    camera.position.x = currentPos[0] + (nextPos[0] - currentPos[0]) * eased;
    camera.position.y = currentPos[1] + (nextPos[1] - currentPos[1]) * eased;
    camera.position.z = currentPos[2] + (nextPos[2] - currentPos[2]) * eased;

    const lookAtX = currentLookAt[0] + (nextLookAt[0] - currentLookAt[0]) * eased;
    const lookAtY = currentLookAt[1] + (nextLookAt[1] - currentLookAt[1]) * eased;
    const lookAtZ = currentLookAt[2] + (nextLookAt[2] - currentLookAt[2]) * eased;

    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return null;
}

// WebGL Scene
function Scene({ scrollProgress, exploreMode }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.6} />
      <spotLight position={[-10, 10, -5]} angle={0.15} penumbra={1} intensity={0.4} color="#dc2626" />

      <CameraModel scrollProgress={scrollProgress} exploreMode={exploreMode} />
      <Environment preset="studio" />
      <CameraController scrollProgress={scrollProgress} exploreMode={exploreMode} />
      {exploreMode && <OrbitControls enableZoom={true} enablePan={true} />}
    </>
  );
}

export default function CameraLanding() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [exploreMode, setExploreMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasContainerRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Initial animations
    gsap.fromTo('.header--container',
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo('.hero--content',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
    );

    gsap.fromTo('.hero--scroller',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.5 }
    );

    // Scroll progress tracking
    const totalScrollDistance = 7 * window.innerHeight;
    ScrollTrigger.create({
      trigger: ".camera-landing-wrapper",
      start: "top top",
      end: "+=" + totalScrollDistance,
      onUpdate: (self) => {
        setScrollProgress(Math.min(1, self.progress));
      },
      invalidateOnRefresh: true
    });

    // Animate sections on scroll
    const sections = ['.origin--section', '.team--section', '.vision--section', '.process--section', '.equipment--section', '.awards--section'];
    
    sections.forEach((selector, index) => {
      ScrollTrigger.create({
        trigger: selector,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(`${selector} .about--section`,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading]);

  const handleExplore = () => {
    setExploreMode(true);
    document.body.style.overflow = 'hidden';
    
    const container = canvasContainerRef.current;
    if (container) {
      container.style.zIndex = '10';
      container.style.pointerEvents = 'all';
    }

    gsap.to('.exit--container', {
      display: 'flex',
      opacity: 1,
      duration: 0.5
    });
  };

  const handleExit = () => {
    setExploreMode(false);
    document.body.style.overflow = 'auto';
    
    const container = canvasContainerRef.current;
    if (container) {
      container.style.zIndex = '0';
      container.style.pointerEvents = 'none';
    }

    gsap.to('.exit--container', {
      opacity: 0,
      display: 'none',
      duration: 0.5
    });
  };

  return (
    <div className="camera-landing-wrapper">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#080808]">
          <div className="relative flex flex-col items-center">
            <div className="relative mb-12">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#dc2626] to-transparent opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative flex items-center justify-center w-40 h-40 border-2 border-[rgba(220,38,38,0.3)]">
                <h1 className="text-4xl font-black italic text-white tracking-tighter">
                  LYF<span className="text-[#dc2626]">ADS</span>
                </h1>
              </div>
            </div>

            <div className="w-80 h-[2px] bg-[rgba(255,255,255,0.1)] overflow-hidden mb-6">
              <div
                className="h-full bg-[#dc2626] transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>

            <div className="text-[rgba(255,255,255,0.3)] text-xs tracking-[0.3em] uppercase font-mono">
              {String(Math.round(loadProgress)).padStart(3, '0')}%
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="header">
        <div className="header--container">
          <div className="header--brand text-white">
            LYF<span className="text-[#dc2626]">ADS</span>
          </div>
          <ul className="header--menu text-white">
            <li>About</li>
            <li>Work</li>
            <li>Contact</li>
          </ul>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section cam-view-1">
        <div className="hero--container">
          <div className="hero--content">
            <h1 className="text-white">
              WE ARE LYF<span className="text-[#dc2626]">ADS</span>
            </h1>
            <p className="text-white">Where Vision Meets Execution</p>
          </div>
        </div>

        <div className="hero--scroller--container">
          <div className="hero--scroller">
            <p className="hero--scroller--text text-white">SCROLL</p>
            <svg className="bounce" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m6 8 4 4 4-4" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="section origin--section">
        <div className="content-block">
          <div className="text-content about--section">
            <div className="section-number">01</div>
            <div className="section-subtitle">OUR ORIGIN</div>
            <h2 className="section-title">BORN FROM PASSION</h2>
            <p className="section-description">
              Founded in 2018, LYF ADS emerged from a simple belief: that every brand has a story worth telling. What started as a two-person operation in a garage has evolved into a full-scale production powerhouse, serving clients across the globe.
            </p>
            <div className="stat-grid">
              <div className="stat-item">
                <div className="stat-number">6+</div>
                <div className="stat-label">Years</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Clients</div>
              </div>
            </div>
          </div>
          <div className="camera-zone"></div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team--section">
        <div className="content-block reverse">
          <div className="camera-zone"></div>
          <div className="text-content about--section">
            <div className="section-number">02</div>
            <div className="section-subtitle">OUR TEAM</div>
            <h2 className="section-title">CREATIVE MAVERICKS</h2>
            <p className="section-description">
              Our crew is a collective of directors, cinematographers, editors, and storytellers who live and breathe visual content. From concept to final cut, we bring decades of combined experience across commercials, music videos, documentaries, and branded content.
            </p>
            <p className="section-description mt-6">
              We don't just create content—we craft experiences that resonate, inspire, and drive results.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section vision--section">
        <div className="content-block">
          <div className="text-content about--section">
            <div className="section-number">03</div>
            <div className="section-subtitle">OUR VISION</div>
            <h2 className="section-title">REDEFINING STANDARDS</h2>
            <p className="section-description">
              We believe in pushing boundaries. In an industry saturated with mediocrity, we strive to set new benchmarks for quality, creativity, and storytelling. Our vision is to become the go-to production house for brands that refuse to settle for ordinary.
            </p>
            <button className="button mt-8" onClick={handleExplore}>
              EXPLORE OUR WORK
            </button>
          </div>
          <div className="camera-zone"></div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process--section">
        <div className="content-block reverse">
          <div className="camera-zone"></div>
          <div className="text-content about--section">
            <div className="section-number">04</div>
            <div className="section-subtitle">OUR APPROACH</div>
            <h2 className="section-title">METHODICAL MADNESS</h2>
            <p className="section-description">
              Every project begins with deep collaboration. We immerse ourselves in your brand, understand your audience, and craft a narrative that cuts through the noise. From pre-production planning to post-production polish, every detail is meticulously executed.
            </p>
            <div className="stat-grid mt-8">
              <div className="stat-item">
                <div className="stat-number">01</div>
                <div className="stat-label">Concept</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">02</div>
                <div className="stat-label">Production</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">03</div>
                <div className="stat-label">Post</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">04</div>
                <div className="stat-label">Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="section equipment--section">
        <div className="content-block">
          <div className="text-content about--section">
            <div className="section-number">05</div>
            <div className="section-subtitle">OUR ARSENAL</div>
            <h2 className="section-title">CINEMA-GRADE GEAR</h2>
            <p className="section-description">
              We shoot on the industry's best: ARRI Alexa, RED Komodo, Sony Venice. Our lens collection includes Zeiss, Cooke, and Canon cinema primes. For audio, we deploy Sennheiser and Rode systems. Color grading happens on calibrated Eizo monitors with DaVinci Resolve Studio.
            </p>
            <p className="section-description mt-6">
              But gear is just a tool. What matters is how we use it to tell your story.
            </p>
          </div>
          <div className="camera-zone"></div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="section awards--section">
        <div className="content-block reverse">
          <div className="camera-zone"></div>
          <div className="text-content about--section">
            <div className="section-number">06</div>
            <div className="section-subtitle">RECOGNITION</div>
            <h2 className="section-title">AWARD-WINNING</h2>
            <p className="section-description">
              Our work has been recognized at international film festivals, advertising awards, and industry showcases. But the real validation comes from our clients—brands that keep coming back because they know we deliver.
            </p>
            <div className="stat-grid mt-8">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Awards</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Features</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exit Container */}
      <div className="exit--container" style={{ display: 'none' }}>
        <button className="button--secondary button--exit text-white" onClick={handleExit}>
          RETURN
        </button>
      </div>

      {/* WebGL Canvas */}
      <div id="webgi-canvas-container" ref={canvasContainerRef}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} exploreMode={exploreMode} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
