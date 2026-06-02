import React, { useEffect, useRef, useState, Suspense } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useAnimationFrame
} from "framer-motion";

import {
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaUsers,
  FaJsSquare, 
  FaPython,
  FaChartBar,
  FaGithub,
  FaLaptopCode,
  FaGitAlt 
} from "react-icons/fa";
import { SiFlask, SiMongodb, SiJupyter, SiGooglecolab } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';
import { VscVscode } from 'react-icons/vsc';
import { FaBehance, FaLinkedin } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import emailjs from '@emailjs/browser';
import { SiMiro, SiGoogleanalytics } from "react-icons/si";
import { MdOutlineDesignServices } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Link } from 'react-router-dom';
import "../Css/Protfolio.css";
import hookImg from "../assets/gold-hook.png";
import * as THREE from 'three'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useControls } from 'leva'

// This is crucial for MeshLine to work inside the Canvas
extend({ MeshLineGeometry, MeshLineMaterial })
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb');
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg');
  const cardTexture = useTexture("/myprofile .jpeg");

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    if (cardTexture) {
      cardTexture.anisotropy = 16;
     
      cardTexture.repeat.set(1.8, 1);
      cardTexture.offset.set(0.1, 0);
      cardTexture.rotation = 0;
      cardTexture.flipY = false;
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture]);

  // Joints with adjusted anchor for increased card size
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.5]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 2.4, 0]]); // Shifted anchor up

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group position={[0, 5, 0]}> {/* Centered position for mobile */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        {[j1, j2, j3].map((ref, i) => (
          <RigidBody key={i} position={[0.5 * (i + 1), 0, 0]} ref={ref} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
        ))}
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          {/* Increased Collider size */}
          <CuboidCollider args={[1.2, 1.7, 0.01]} />
          <group
            scale={3.9} // Increased Visual Scale
            position={[0, -2.3, -0.05]} // Adjusted offset
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            
            <mesh geometry={nodes.card.geometry}>
              <meshBasicMaterial map={cardTexture} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} transparent={true} // Enable transparency
  alphaTest={0.5}    // Cuts off the black/invisible parts of the texture
  depthWrite={false} />
      </mesh>
    </>
  );
}
function Protfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
const pendulumRef = useRef(null);
const ropeRef = useRef(null);
const ropePathRef = useRef(null);
const shadowRef = useRef(null);
 const ropeLeftRef = useRef(null);
  const ropeRightRef = useRef(null);
const dropY = useSpring(-900, {
    stiffness: 100,
    damping: 20,
    mass: 1.5
  });
const form = useRef(); // 2. Create a ref for the form

  const sendEmail = (e) => {
    e.preventDefault();

    // Replace these with your actual IDs from EmailJS dashboard
    const SERVICE_ID = "service_7e2y6dr";
    const TEMPLATE_ID = "template_9160hqn";
    const PUBLIC_KEY = "zN7QKXckeIAiCga_K";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          alert("Message sent successfully!");
          e.target.reset(); // Clears the form
      }, (error) => {
          alert("Failed to send message, please try again.");
          console.log(error.text);
      });
  };
  useEffect(() => {
    // Delays the drop slightly for impact
    const timer = setTimeout(() => dropY.set(-150), 500); 
    return () => clearTimeout(timer);
  }, [dropY]);
useEffect(() => {
    let angle = -0.15; 
    let velocity = 0;
    const gravity = 9.81;
    const length = 2.5;
    const damping = 0.006;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const acceleration = -(gravity / length) * Math.sin(angle) - damping * velocity;
      velocity += acceleration * delta;
      angle += velocity * delta;

      if (pendulumRef.current) {
        pendulumRef.current.style.transform = `rotate(${angle}rad)`;
      }

      // Physics-based rope bending
      const bend = velocity * 30; 
      const midY = 150;
      const endX = 100;
      const endY = 380; 

      if (ropeLeftRef.current && ropeRightRef.current) {
        ropeLeftRef.current.setAttribute("d", `M75 0 Q${75 + bend} ${midY} ${endX} ${endY}`);
        ropeRightRef.current.setAttribute("d", `M125 0 Q${125 + bend} ${midY} ${endX} ${endY}`);
      }
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);
  /* ================= REAL PHYSICS ENGINE ================= */

 

  /* Smooth Professional Scroll Animation */

  const scrollReveal = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };
// 1. Define your projects with specific Behance/Live links
const projects = [
  { id: 1, title: "Full Stack Development", linkName: "Quick Food App Delivery", img: "/project1.png", url: "/project/quick-food-app-delivery" },
  { id: 2, title: "Data Analysis", linkName: "Gas Analysis", img: "/Project2.png", url: "/project/gas-analysis" },
];

const [currentPage, setCurrentPage] = useState(0);
const cardsPerPage = 1;
const totalPages = projects.length;
  return (
    <div className="wrapper">
    <div id="root">
      {/* NAVBAR */}
      <motion.nav
        className="header-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-container">
          <div className="header-logo">Kavi.dev</div>

          <div className="header-menu">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

         <div className="header-socials">
  <a href="https://github.com/kavi6265" target="_blank" rel="noreferrer">
  <FaGithub size={22} />
</a>
  <a href="https://www.linkedin.com/in/kaviyarasu-c-85b6a22a8/" target="_blank" rel="noreferrer">
    <FaLinkedin size={22} />
  </a>
</div>

          {/* Mobile Menu Toggle */}
          <div 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Mobile Menu Header */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">Kavi.dev</div>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            ✕
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="mobile-menu-content">
          <div className="mobile-menu-links">
            <a href="#home" onClick={closeMobileMenu}>Home</a>
            <a href="#about" onClick={closeMobileMenu}>About</a>
            <a href="#skills" onClick={closeMobileMenu}>Skills</a>
            <a href="#services" onClick={closeMobileMenu}>Services</a>
            <a href="#projects" onClick={closeMobileMenu}>Projects</a>
            <a href="#contact" onClick={closeMobileMenu}>Contact</a>
          </div>
          
          <div className="mobile-menu-socials">
            <a href="https://github.com/kavi6265" target="_blank" rel="noreferrer">
              <FaGithub size={32} />
            </a>
            <a href="https://www.linkedin.com/in/kaviyarasu-c-85b6a22a8/" target="_blank" rel="noreferrer">
              <FaLinkedin size={32} />
            </a>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <motion.section id="home" className="hero-section">
       
        {/* LEFT */}
  <div className="hero-left">
  <div className="bio-card">
    <p className="bio-intro" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>I'm</p>
    
    <motion.h1
      className="bio-name"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05, // Speed of letters appearing
          },
        },
      }}
    >
      {"Kaviyarasu".split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>

    <p className="bio-description">
      A passionate and energetic individual with a strong interest in
      technology, coding, and design. I enjoy building creative solutions and
      continuously learning new things to grow both personally and
      professionally.
    </p>

    <div className="bio-actions">
    <a href="#contact">
      <button className="btn-contact">Contact</button>
      </a>
      <a href="/myresume.pdf" download>
  <button className="btn-download">Download CV</button>
</a>
    </div>
  </div>
</div>
 {/* ... keep your imports and physics logic the same ... */}
<div className="hero-right">
    <div className="portfolio-stage">
      <Canvas camera={{ position: [0, 0, 15], fov: 25 }} gl={{ transparent: true, antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />
        <Suspense fallback={null}>
          <Physics gravity={[0, -40, 0]}>
            <Band />
          </Physics>
          <Environment background={false}>
            <Lightformer intensity={1.5} color="white" position={[0, 5, 5]} rotation={[0, 0, Math.PI / 3]} scale={[10, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  </div>
      </motion.section>
         
     

      {/* ABOUT SECTION */}
   <motion.section
  className="about-section"
  id="about"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
>
  <motion.div className="about-card" variants={scrollReveal}>

    <div className="about-card-left">
      <h2 className="about-heading">About Me</h2>
      <p className="about-text">
       I am a passionate Information Technology graduate with a strong interest in web development, software development, and emerging technologies. I enjoy building practical and user-friendly applications while solving real-world problems through technology. My experience includes developing web applications using Python Flask, HTML, CSS, JavaScript, and MongoDB, along with using Git and GitHub for version control and project collaboration. I am also proficient in Microsoft Excel for data management, analysis, and reporting. Through academic projects and internships, I have developed strong problem-solving, analytical thinking, and teamwork skills. I am a continuous learner who is always eager to explore new technologies, enhance my technical expertise, and contribute to innovative projects that create meaningful impact.
      </p>
      
      <a href="#contact">
        <button className="about-contact-btn">Contact</button>
      </a>
    </div>

    <div className="about-card-right">
      <div className="about-image-circle">
        <img src="/myphoto.jpeg" alt="Kaviyarasu" />
      </div>
    </div>

  </motion.div>
</motion.section>
      {/* SKILLS SECTION */}
{/* SKILLS SECTION */}
<motion.section
  className="skills-section"
  id="skills"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
>
  <motion.h2 className="skills-heading" variants={scrollReveal}>
    Skills
  </motion.h2>

  <div className="skills-wrapper">

    {/* LEFT - DESIGN */}
<motion.div className="skills-card large-card" variants={scrollReveal}>
  <h3>Development</h3>

  {/* CRITICAL: Ensure this class name is exactly skills-grid-3 */}
  <div className="skills-grid-3">
    <div className="skill-box">
      <div className="icon-card red"><FaHtml5 /></div>
      <span>HTML</span>
    </div>

    <div className="skill-box">
      <div className="icon-card blue"><FaCss3Alt /></div>
      <span>CSS</span>
    </div>

    <div className="skill-box">
      <div className="icon-card yellow"><FaJsSquare /></div>
      <span>JavaScript</span>
    </div>

    <div className="skill-box">
      <div className="icon-card blue-alt"><FaPython /></div>
      <span>Python</span>
    </div>

    <div className="skill-box">
      <div className="icon-card green-light"><SiFlask /></div>
      <span>Flask</span>
    </div>

    <div className="skill-box">
      <div className="icon-card green"><SiMongodb /></div>
      <span>MongoDB</span>
    </div>

    <div className="skill-box">
      <div className="icon-card red-alt"><DiMysql /></div>
      <span>MySQL</span>
    </div>

    <div className="skill-box">
      <div className="icon-card purple"><FaGithub /></div>
      <span>GitHub</span>
    </div>
  </div>
</motion.div>
    {/* RIGHT SIDE */}
    <div className="skills-right">

      {/* TOOLS */}
   <motion.div className="skills-card small-card" variants={scrollReveal}>
  <h3>Analytical Tools</h3>

  <div className="skills-grid-3">
    {/* Jupyter Card */}
    <div className="skill-box">
      <div className="icon-card" style={{ backgroundColor: 'rgba(243, 118, 38, 0.15)' }}>
        <SiJupyter color="#F37626" size="1.5em" />
      </div>
      <span>Jupyter</span>
    </div>

    {/* Google Colab Card */}
    <div className="skill-box">
      <div className="icon-card" style={{ backgroundColor: 'rgba(249, 171, 0, 0.15)' }}>
        <SiGooglecolab color="#F9AB00" size="1.5em" />
      </div>
      <span>Google Colab</span>
    </div>

    {/* Power BI Card */}
    <div className="skill-box">
      <div className="icon-card" style={{ backgroundColor: 'rgba(242, 200, 17, 0.15)' }}>
        <FaChartBar color="#F2C811" size="1.5em" />
      </div>
      <span>Power BI</span>
    </div>
  </div>
</motion.div>

      {/* DEVELOPMENT */}
      <motion.div className="skills-card small-card" variants={scrollReveal}>
  <h3>Development Evironment/Editor</h3>

  <div className="skills-grid-2 center-items">
    

    {/* Git - Using an orange background to match its brand */}
    <div className="skill-box">
      <div className="icon-card" style={{ backgroundColor: 'rgba(120, 9, 211, 0.81)' }}><FaGitAlt /></div>
      <span>Git</span>
    </div>

    {/* VS Code - Using your existing blue background class */}
    <div className="skill-box">
      <div className="icon-card blue"><VscVscode /></div>
      <span>VS Code</span>
    </div>
  </div>
</motion.div>

    </div>
  </div>
</motion.section>



     <motion.section
  className="service-section"
  id="services"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
>

  <motion.h2 className="service-heading" variants={scrollReveal}>
    Services
  </motion.h2>

  <motion.div className="service-row" variants={staggerContainer}>

    <motion.div className="service-card" variants={scrollReveal}>
 <div className="service-icon">
    <FaLaptopCode size={35} />
  </div>
  <h3>Web Developer</h3>
  <p>
    Building responsive websites and web applications using HTML, CSS, JavaScript, Python Flask, and MongoDB.
  </p>
</motion.div>

<motion.div className="service-card" variants={scrollReveal}>
 <div className="service-icon">
    <FaChartBar size={35} />
  </div>
  <h3>Data Analyst</h3>
  <p>
    Transforming raw data into meaningful insights using Excel, data visualization, and analytical techniques.
  </p>
</motion.div>

    

  </motion.div>
  <motion.div
    className="hire-wrapper"
    variants={scrollReveal}
  ><a href="#contact">
    <button className="hire-btn" >Hire Me</button>
    </a>
  </motion.div>

{/* PROJECTS SECTION */}

</motion.section>
<motion.section className="projects-section" id="projects">
  <h2 className="contact-title">Projects</h2>
  <div className="projects-container" style={{ width: '85%', maxWidth: '1200px', margin: '0 auto' }}>
    <div className="projects-grid">
      {projects.map((project) => (
        <div className="project-card-outer" key={project.id}>
          <div className="project-card-v2">
            <Link to={project.url} className="card-image-container">
              <img src={project.img} alt={project.title} />
            </Link>
            <div className="card-details">
              <h4 className="card-category">
                <span>{project.title}</span>
              </h4>
              <Link to={project.url} className="card-project-name">
                {project.linkName}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</motion.section>
{/* CONTACT SECTION */}
<motion.section className="contact-section" id="contact">
        <div className="contact-card">
          <h2 className="contact-title">Contact Me</h2>

          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="user_name" // Ensure this matches your EmailJS template
                placeholder="Your Name" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="user_email" // Ensure this matches your EmailJS template
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" // Ensure this matches your EmailJS template
                rows="5" 
                placeholder="Say something..." 
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <LuSend size={18} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </motion.section>
      </div>
      {/* FOOTER SECTION */}
      <footer className="footer-section">
        <div className="footer-container">

          {/* Top row — nav + socials */}
          <div className="footer-top-row">
            <nav className="footer-nav-links">
              <a href="#home"><span>Home</span></a>
              <a href="#projects"><span>Project</span></a>
              <a href="#about"><span>About me</span></a>
              <a href="#contact"><span>Contact</span></a>
            </nav>

            <div className="footer-social-icons">
              <a href="https://www.instagram.com/kavi_arasu_6265" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-ig">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="https://www.linkedin.com/in/kaviyarasu-c-85b6a22a8/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-li">
                <i className="fa-brands fa-linkedin" />
              </a>
              <a href="https://github.com/kavi6265" target="_blank" rel="noreferrer" aria-label="Behance" className="footer-social-be">
                <i className="fa-brands fa-github" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" />

          {/* Bottom row — copyright */}
          <div className="footer-bottom-row">
            <p className="footer-copy">© 2026 Kavi. All rights reserved</p>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default Protfolio;
