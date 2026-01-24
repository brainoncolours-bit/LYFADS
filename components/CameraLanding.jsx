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
      { opacity: 1, y: '0%', duration: 0.8, ease: 'power1.inOut' }
    );

    gsap.fromTo('.hero--scroller',
      { opacity: 0, y: '150%' },
      { opacity: 1, y: '0%', duration: 1, ease: 'power4.inOut' }
    );

    gsap.fromTo('.hero--content',
      { opacity: 0, x: '-50%' },
      { opacity: 1, x: '0%', duration: 1.8, ease: 'power4.inOut' }
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
        gsap.to('.hero--scroller', { opacity: 0, y: '150%', duration: 0.5 });
        gsap.to('.hero--content', { opacity: 0, xPercent: '-100', duration: 0.5 });
        gsap.fromTo('.performance--content',
          { opacity: 0, x: '110%' },
          { opacity: 1, x: '0%', duration: 0.5 }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '.cam-view-3',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onEnter: () => {
        gsap.to('.performance--content', { autoAlpha: 0, duration: 0.5 });
        gsap.fromTo('.power--content',
          { opacity: 0, x: '-110%' },
          { opacity: 1, x: '0%', duration: 0.5 }
        );
        gsap.fromTo('.power--features--img',
          { opacity: 0, x: '110%' },
          { opacity: 1, x: '0%', duration: 0.5 }
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
          { opacity: 0, y: '130%' },
          { opacity: 1, y: '0%', duration: 0.5 }
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
          { opacity: 0, x: '130%' },
          { opacity: 1, x: '0%', duration: 0.5 }
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
          { opacity: 0, x: '110%' },
          { opacity: 1, x: '0%', duration: 0.5 }
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
          { opacity: 0, x: '-110%' },
          { opacity: 1, x: '0%', duration: 0.5 }
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
    }

    gsap.to('.explore--content', {
      opacity: 0,
      x: '130%',
      duration: 0.5
    });

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

    gsap.to('.explore--content', {
      opacity: 1,
      x: '0%',
      duration: 0.5
    });

    gsap.to('.exit--container', {
      opacity: 0,
      display: 'none',
      duration: 0.5
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0a] backdrop-blur-sm">
          <div className="relative flex flex-col items-center">
            {/* Animated Logo */}
            <div className="relative mb-8">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 opacity-75 blur-lg animate-pulse"></div>
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#1c1c1c] border border-gray-800">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">LYFADS</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">LYFADS</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 mb-8 text-lg tracking-wide">Loading Experience...</p>

            {/* Progress bar container */}
            <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>

            {/* Progress percentage */}
            <div className="mt-4 text-gray-400 text-sm">{Math.round(loadProgress)}%</div>

            {/* Animated dots */}
            <div className="flex space-x-1 mt-8">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="header">
        <div className="header--container">
          <div className="header--brand text-white">LYFADS PRODUCTIONS</div>
          <ul className="header--menu text-white">
            <li className="text-white">Our Films</li>
            <li className="text-white">Services</li>
            <li className="text-white">Contact</li>
          </ul>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section cam-view-1">
        <div className="hero--container">
          <div className="hero--content">
            <h2 className="text-white">Bringing Stories to</h2>
            <h1 className="text-white">Life</h1>
            <p className="text-white">At LYFADS Productions, we craft cinematic experiences that captivate audiences. Our award-winning team combines cutting-edge technology with artistic vision to create unforgettable visual narratives.</p>
            <button className="button button-know-more text-white" onClick={handleKnowMore}>
              Discover Our Vision
            </button>
          </div>
        </div>

        <div className="hero--scroller--container">
          <div className="hero--scroller">
            <p className="hero--scroller--text text-white">Scroll to explore our work</p>
            <svg className="bounce" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 33a15 15 0 1 0 0-30 15 15 0 0 0 0 30Z" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m12 18 6 6 6-6M18 12v12" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="section cam-view-2">
        <div className="performance--container">
          <div className="performance--content">
            <h2 className="text-white">Exceptional</h2>
            <h1 className="text-white">Production Value</h1>
            <p className="text-white">Our productions feature state-of-the-art equipment, professional lighting, and expert cinematography. Every frame is crafted with precision to deliver the highest quality visuals.</p>
          </div>
        </div>
      </section>

      {/* Power Section */}
      <section className="section cam-view-3">
        <div className="power--container">
          <div className="power--content">
            <h2 className="text-white">Storytelling that</h2>
            <h1 className="text-white">Impacts</h1>
            <p className="text-white">We specialize in creating compelling narratives that resonate with audiences. From concept to final cut, our team ensures your story is told with authenticity and emotional depth.</p>
          </div>
          <div className="power--features--img">
            {/* Add feature images here */}
          </div>
        </div>
      </section>

      {/* Creative Direction Section */}
      <section className="section cam-view-4">
        <div className="autofocus--container">
          <div className="autofocus--content">
            <h1 className="text-white">Sharp Creative <strong className="text-white">Direction</strong></h1>
            <p className="text-white">Our directors and creative team work closely with clients to bring their vision to life. We focus on innovative approaches that set your project apart from the competition.</p>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="section cam-view-6">
        <div className="detail--container">
          <div className="detail--content">
            <h1 className="text-white">Masterful <strong className="text-white">Craftsmanship</strong></h1>
            <p className="text-white">Every project receives meticulous attention to detail. Our experienced crew ensures flawless execution from pre-production through post-production.</p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="section cam-view-7">
        <div className="lens--container">
          <div className="lens--content">
            <h1 className="text-white">Professional <strong className="text-white">Equipment</strong></h1>
            <p className="text-white">We utilize industry-leading cameras, lenses, and audio equipment to capture stunning visuals and crystal-clear sound for every production.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section cam-view-5">
        <div className="explore--container">
          <div className="explore--content">
            <h1 className="text-white">Immerse Yourself<br/>in Our <strong className="text-white">Portfolio</strong></h1>
            <button className="button button-explore text-white" onClick={handleExplore}>
              Experience Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Exit Container */}
      <div className="exit--container" style={{ display: 'none' }}>
        <button className="button--secondary button--exit text-white" onClick={handleExit}>
          Exit
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
