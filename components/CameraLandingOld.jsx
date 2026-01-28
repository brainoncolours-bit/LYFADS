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

    // Rotate model slightly for visual interest when not in explore mode
    // Only rotate when scroll is not actively changing
    if (scrollProgress < 0.01) { // Only rotate when near initial position
      modelRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    if (!modelRef.current || !gltf.scene) return;

    // Set initial scale and position
    modelRef.current.scale.set(2, 2, 2);
    modelRef.current.position.set(0, 0, 0); // Center the model
  }, [gltf]);

  if (!gltf.scene) return null;

  return (
    <primitive ref={modelRef} object={gltf.scene.clone()} />
  );
}

// Camera Controller Component
function CameraController({ scrollProgress, exploreMode }) {
  const { camera } = useThree();

  useFrame(() => {
    if (exploreMode) return; // Don't control camera if in explore mode

    // Define different camera positions for different scroll sections
    // Map scroll progress (0-1) to different camera positions
    const positions = [
      { pos: [0, 0, 5], lookAt: [0, 0, 0] },             // Hero view - initial
      { pos: [0, 0, 4], lookAt: [0, 0, 0] },             // Front view - performance section
      { pos: [4, 0, 0], lookAt: [0, 0, 0] },             // Side view - power section
      { pos: [0, 2.5, 3], lookAt: [0, 0, 0] },           // Top diagonal view - autofocus section
      { pos: [-3, 1, 2], lookAt: [0, 0, 0] },            // Left diagonal view - detail section
      { pos: [2, -1, -4], lookAt: [0, 0, 0] },           // Right back angle - lens section
      { pos: [0, 4, 0], lookAt: [0, 0, 0] },             // Top view - overhead shot
      { pos: [-2, 1, -4], lookAt: [0, 0, 0] },           // Dynamic angle - explore section
    ];

    // Calculate which segment we're in based on scroll progress
    const segmentCount = positions.length - 1;
    const segmentProgress = scrollProgress * segmentCount;
    const currentSegment = Math.floor(segmentProgress);
    const segmentLocalProgress = segmentProgress - currentSegment;

    // Get current and next position
    const currentIndex = Math.min(currentSegment, positions.length - 1);
    const nextIndex = Math.min(currentIndex + 1, positions.length - 1);

    // Interpolate between positions
    const currentPos = positions[currentIndex].pos;
    const nextPos = positions[nextIndex].pos;
    const currentLookAt = positions[currentIndex].lookAt;
    const nextLookAt = positions[nextIndex].lookAt;

    // Interpolate position
    camera.position.x = currentPos[0] + (nextPos[0] - currentPos[0]) * segmentLocalProgress;
    camera.position.y = currentPos[1] + (nextPos[1] - currentPos[1]) * segmentLocalProgress;
    camera.position.z = currentPos[2] + (nextPos[2] - currentPos[2]) * segmentLocalProgress;

    // Interpolate lookAt point
    const lookAtX = currentLookAt[0] + (nextLookAt[0] - currentLookAt[0]) * segmentLocalProgress;
    const lookAtY = currentLookAt[1] + (nextLookAt[1] - currentLookAt[1]) * segmentLocalProgress;
    const lookAtZ = currentLookAt[2] + (nextLookAt[2] - currentLookAt[2]) * segmentLocalProgress;

    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return null;
}

// WebGL Scene Component
function Scene({ scrollProgress, exploreMode, onExploreComplete }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <spotLight position={[-10, 10, -5]} angle={0.15} penumbra={1} intensity={0.5} />

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
    // Simulate loading progress
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

    // Setup scroll animations
    const sections = document.querySelectorAll('.section');

    gsap.fromTo('.header--container',
      { opacity: 0, y: '-100%' },
      { opacity: 1, y: '0%', duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo('.hero--scroller',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.8 }
    );

    gsap.fromTo('.hero--content',
      { opacity: 0, x: '-100' },
      { opacity: 1, x: '0', duration: 1.5, ease: 'power3.out', delay: 0.4 }
    );

    // Calculate total scroll distance for all sections (now with more sections)
    const totalScrollDistance = 8 * window.innerHeight; // Increased to accommodate more sections

    // Calculate normalized scroll progress (0 to 1) based on total scroll
    ScrollTrigger.create({
      trigger: ".camera-landing-wrapper",
      start: "top top",
      end: "+=" + totalScrollDistance,
      onUpdate: (self) => {
        const normalizedProgress = Math.min(1, self.progress);
        setScrollProgress(normalizedProgress);
      },
      invalidateOnRefresh: true
    });

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: '.cam-view-2',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.to('.hero--scroller', { opacity: 0, duration: 0.4, ease: 'power2.out' });
        gsap.to('.hero--content', { opacity: 0, xPercent: -50, duration: 0.6, ease: 'power2.inOut' });
        gsap.fromTo('.performance--content',
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-3',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.to('.performance--content', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' });
        gsap.fromTo('.power--content',
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-4',
      start: 'top 20%',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.fromTo('.autofocus--content',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-5',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.fromTo('.explore--content',
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-6',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.fromTo('.detail--content',
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-7',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.fromTo('.lens--content',
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
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
      container.style.width = '100vw';
    }

    gsap.to('.explore--content', {
      opacity: 0,
      x: '-100%',
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to('.exit--container', {
      display: 'flex',
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  const handleExit = () => {
    setExploreMode(false);
    document.body.style.overflow = 'auto';

    const container = canvasContainerRef.current;
    if (container) {
      container.style.zIndex = '0';
      container.style.pointerEvents = 'none';
      container.style.width = '60vw';
    }

    gsap.to('.explore--content', {
      opacity: 1,
      x: '0%',
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to('.exit--container', {
      opacity: 0,
      display: 'none',
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  const handleKnowMore = () => {
    const element = document.querySelector('.cam-view-2');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="camera-landing-wrapper">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-b from-[#0a0101] to-[#2e0505] backdrop-blur-sm">
          <div className="relative flex flex-col items-center">
            {/* Animated Logo */}
            <div className="relative mb-12">
              <div className="absolute -inset-6 rounded-sm bg-gradient-to-r from-[#ff0844] via-[#ff0844] to-transparent opacity-20 blur-2xl animate-pulse"></div>
              <div className="relative flex items-center justify-center w-32 h-32 bg-transparent border border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                <span className="text-2xl font-bold tracking-[0.3em] text-white uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>LYF ADS</span>
              </div>
            </div>

            {/* Title with Premium Styling */}
            <h2 className="text-xl font-semibold text-white mb-3 tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Loading Experience
            </h2>

            {/* Progress bar container - Ultra thin */}
            <div className="w-80 h-[1px] bg-[rgba(255,255,255,0.08)] rounded-none overflow-hidden mb-6 relative">
              <div
                className="h-full bg-gradient-to-r from-transparent via-[#ff0844] to-transparent transition-all duration-300 ease-out relative"
                style={{ width: `${loadProgress}%` }}
              >
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-r from-transparent to-[#ff0844] blur-sm"></div>
              </div>
            </div>

            {/* Progress percentage with monospace font */}
            <div className="text-[rgba(255,255,255,0.4)] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {String(Math.round(loadProgress)).padStart(3, '0')}%
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="header">
        <div className="header--container">
          <div className="header--brand text-white">LYF ADS</div>
          <ul className="header--menu text-white">
            <li className="text-white">Portfolio</li>
            <li className="text-white">Services</li>
            <li className="text-white">Contact</li>
          </ul>
        </div>
      </section>

      {/* HUD Elements - Decorative Lines */}
      <div className="hud-dot" style={{ top: '20%', left: '35%', animationDelay: '0.5s' }}></div>
      <div className="hud-line hud-line-horizontal" style={{ top: '20%', left: '35.5%' }}></div>
      <div className="hud-dot" style={{ top: '60%', right: '35%', animationDelay: '1s' }}></div>
      <div className="hud-line hud-line-vertical" style={{ top: '60.5%', right: '35%' }}></div>

      {/* Hero Section */}
      <section className="section cam-view-1">
        <div className="hero--container">
          <div className="hero--content">
            <h2 className="text-white">CINEMATIC EXCELLENCE</h2>
            <h1 className="text-white">Redefining Visual Storytelling</h1>
            <p className="text-white">LYF ADS crafts immersive brand narratives through cutting-edge cinematography and artistic vision. We transform concepts into captivating visual experiences that resonate with audiences worldwide.</p>
            <button className="button button-know-more text-white" onClick={handleKnowMore}>
              Explore Our Craft
            </button>
          </div>
        </div>

        <div className="hero--scroller--container">
          <div className="hero--scroller">
            <p className="hero--scroller--text text-white">Scroll to Discover</p>
            <svg className="bounce" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="rgba(255, 255, 255, 0.4)" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m8 12 4 4 4-4M12 8v8" stroke="rgba(255, 255, 255, 0.4)" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="section cam-view-2">
        <div className="performance--container">
          <div className="performance--content">
            <h2 className="text-white">PRODUCTION</h2>
            <h1 className="text-white">Ultra Premium Quality</h1>
            <p className="text-white">State-of-the-art equipment meets masterful technique. Our productions feature 8K cinema cameras, professional color grading, and meticulous post-production to deliver unparalleled visual fidelity.</p>
          </div>
        </div>
      </section>

      {/* Power Section */}
      <section className="section cam-view-3">
        <div className="power--container">
          <div className="power--content">
            <h2 className="text-white">NARRATIVE</h2>
            <h1 className="text-white">Stories That Impact</h1>
            <p className="text-white">Every frame tells a story. We specialize in creating authentic narratives that build emotional connections and drive engagement. From concept to delivery, we ensure your message resonates powerfully.</p>
          </div>
        </div>
      </section>

      {/* Creative Direction Section */}
      <section className="section cam-view-4">
        <div className="autofocus--container">
          <div className="autofocus--content">
            <h1 className="text-white">Precision Creative <strong className="text-white">Direction</strong></h1>
            <p className="text-white">Our award-winning directors collaborate closely with brands to transform vision into reality. We employ innovative cinematographic techniques and strategic storytelling to create distinctive content that stands out in a crowded marketplace.</p>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="section cam-view-6">
        <div className="detail--container">
          <div className="detail--content">
            <h1 className="text-white">Obsessive <strong className="text-white">Craftsmanship</strong></h1>
            <p className="text-white">Perfection lives in the details. Our veteran crew brings decades of combined experience to every project, ensuring flawless execution across all production phases.</p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="section cam-view-7">
        <div className="lens--container">
          <div className="lens--content">
            <h1 className="text-white">Cinema-Grade <strong className="text-white">Technology</strong></h1>
            <p className="text-white">ARRI, RED, Sony Venice. Prime lenses. Dolby Atmos. We deploy industry-leading equipment to capture every moment with stunning clarity and cinematic depth.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section cam-view-5">
        <div className="explore--container">
          <div className="explore--content">
            <h1 className="text-white">Explore Our <strong className="text-white">Portfolio</strong></h1>
            <button className="button button-explore text-white" onClick={handleExplore}>
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Exit Container */}
      <div className="exit--container" style={{ display: 'none' }}>
        <button className="button--secondary button--exit text-white" onClick={handleExit}>
          Return
        </button>
      </div>

      {/* WebGL Canvas */}
      <div id="webgi-canvas-container" ref={canvasContainerRef}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene
              scrollProgress={scrollProgress}
              exploreMode={exploreMode}
              onExploreComplete={handleExit}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
