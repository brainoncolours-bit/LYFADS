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
        <div className="loader">
          <div className="text-4xl font-bold text-gray-800">LYFADS</div>
          <p>Loading... Please wait</p>
          <div className="progress" style={{ transform: `scaleX(${loadProgress / 100})` }}></div>
        </div>
      )}

      {/* Header */}
      <section className="header">
        <div className="header--container">
          <div className="header--brand">LYFADS</div>
          <ul className="header--menu">
            <li>Features</li>
            <li>Experience it</li>
            <li>Buy now</li>
          </ul>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section cam-view-1">
        <div className="hero--container">
          <div className="hero--content">
            <h2>Always shoot like a</h2>
            <h1>Pro</h1>
            <p>Discover our most advanced camera and lens series yet: blazing fast AF, incredible low light performance, superb image stabilization, sharp image quality, and so much more.</p>
            <button className="button button-know-more" onClick={handleKnowMore}>
              Know more
            </button>
          </div>
        </div>

        <div className="hero--scroller--container">
          <div className="hero--scroller">
            <p className="hero--scroller--text">Start scrolling to explore</p>
            <svg className="bounce" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 33a15 15 0 1 0 0-30 15 15 0 0 0 0 30Z" stroke="#929292" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m12 18 6 6 6-6M18 12v12" stroke="#929292" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="section cam-view-2">
        <div className="performance--container">
          <div className="performance--content">
            <h2>Outstanding</h2>
            <h1>Performance</h1>
            <p>The camera brings some of the best features to a sleek, lightweight design with high-speed shooting, megapixel sensor, and lightning fast autofocus.</p>
          </div>
        </div>
      </section>

      {/* Power Section */}
      <section className="section cam-view-3">
        <div className="power--container">
          <div className="power--content">
            <h2>Features that bring you</h2>
            <h1>Power</h1>
            <p>The easy-to-carry camera packs advanced features into a lightweight, compact design. Perfect for high-performance photography.</p>
          </div>
          <div className="power--features--img">
            {/* Add feature images here */}
          </div>
        </div>
      </section>

      {/* Autofocus Section */}
      <section className="section cam-view-4">
        <div className="autofocus--container">
          <div className="autofocus--content">
            <h1>Smart, speedy <strong>autofocus</strong></h1>
            <p>Advanced autofocus technology with subject detection lets you keep your eye on the action while keeping subjects in crystal clear focus.</p>
          </div>
        </div>
      </section>

      {/* Additional Section 1 - Detail View */}
      <section className="section cam-view-6">
        <div className="detail--container">
          <div className="detail--content">
            <h1>Premium <strong>Build Quality</strong></h1>
            <p>Crafted with precision using premium materials for durability and comfort during extended shooting sessions.</p>
          </div>
        </div>
      </section>

      {/* Additional Section 2 - Lens View */}
      <section className="section cam-view-7">
        <div className="lens--container">
          <div className="lens--content">
            <h1>Advanced <strong>Lens System</strong></h1>
            <p>Professional-grade optics with exceptional clarity and sharpness across the entire frame.</p>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="section cam-view-5">
        <div className="explore--container">
          <div className="explore--content">
            <h1>Interactive<strong><br/>3D gallery</strong></h1>
            <button className="button button-explore" onClick={handleExplore}>
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Exit Container */}
      <div className="exit--container" style={{ display: 'none' }}>
        <button className="button--secondary button--exit" onClick={handleExit}>
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
