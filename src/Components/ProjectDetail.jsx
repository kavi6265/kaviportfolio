
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Css/ProjectDetail.css";

const projectData = {
  "quick-food-app-delivery": {
    title: "Quick Food App Delivery",
    category: "Full Stack Development",
    img: "/project1.png",
    certificate: "/certificate2.jpg",
    overview:
      "Quick Food App Delivery is a full-stack web application built with Node.js and Express.js. It features user registration, login authentication, session management, and a welcome dashboard. Users can register with an email and password, log in securely, and access their personalized dashboard.",
     
    features: [
      "User Registration — sign up with email and password",
      "User Login — authenticate with stored credentials",
      "Session Management — secure sessions using express-session",
      "Welcome Dashboard — personalized page for logged-in users",
      "Logout functionality — destroy session on logout",
      "Static file serving — HTML, CSS pages served via Express",
      "Pages: login.html, registration.html, welcome.html",
    ],
    techStack: ["Node.js", "Express.js", "HTML", "CSS", "JavaScript", "express-session", "body-parser","MongoDB"],
    role: "Full Stack Developer",
    duration: "1.5 months",
    githubLink: "https://github.com/kavi6265/webproject/tree/main/kavi/my-app",
    showScreenshots: true,
    img1: "/project1.png",
    img3: "/project3.png",
    img4: "/project4.png",
    img5: "/project5.png",
  },
  "gas-analysis": {
    title: "Gas Analysis",
    category: "Data Analysis",
    img: "/Project2.png",
    certificate: "/certificate3.jpg",
    showScreenshots: true,
    screenshots: [
      "/project6.png",
      "/project7.png",
      "/project8.png",
      "/project11.png",
    ],
    overview:
      "A data analysis project on air quality across 26 major Indian cities from 2015 to 2020. The dataset contains 29,531 records with 16 features including pollutants like PM2.5, PM10, NO, NO2, NOx, NH3, CO, SO2, O3, Benzene, Toluene, and Xylene along with AQI (Air Quality Index) values and AQI bucket classifications.",
    features: [
      "Loaded and explored air quality dataset (29,531 rows × 16 columns)",
      "Performed Exploratory Data Analysis (EDA) — head(), tail(), describe(), info()",
      "Checked and handled missing values using mean imputation for all numeric columns",
      "Verified zero duplicate records in the dataset",
      "Filled AQI_Bucket missing values with 'Good' category",
      "Visualized city-wise pollutant concentrations using Seaborn barplot",
      "Analyzed pollutants: PM2.5, PM10, NO, NO2, NOx, NH3, CO, SO2, O3, Benzene, Toluene, Xylene",
      "Exported cleaned dataset to Excel for further use",
    ],
    techStack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter Notebook","Excel"],
    role: "Data Analyst",
    duration: "1 month",
    githubLink: "https://github.com/kavi6265/data-analysis-/tree/main/kavi",
    img6: "/project6.png",
    img7: "/project7.png",
    img2: "/project2.png",
    img8: "/project8.png",
    img10: "/project10.png",
  },
};

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project not found</h2>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Header */}
      <motion.header
        className="detail-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="detail-header-inner">
          <div className="detail-logo">Kavi.dev</div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </motion.header>

      {/* Hero */}
      <motion.div
        className="detail-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="detail-hero-text">
          <span className="detail-category">{project.category}</span>
          <h1 className="detail-title">{project.title}</h1>
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{project.role}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Duration</span>
              <span className="meta-value">{project.duration}</span>
            </div>
          </div>
          {project.githubLink && project.githubLink !== "#" && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="detail-github-btn">
              View on GitHub →
            </a>
          )}
        </div>
        <div className="detail-hero-img">
          <img src={project.img} alt={project.title} />
        </div>
      </motion.div>
{project.certificate && (
  <motion.section
    className="detail-section"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <h2>Certificate</h2>

    <div className="certificate-container">
      <img
        src={project.certificate}
        alt="Project Certificate"
        className="certificate-img"
      />
    </div>
  </motion.section>
)}
      {/* Overview */}
      <motion.section
        className="detail-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Overview</h2>
        <p>{project.overview}</p>
      </motion.section>

      {/* Features */}
      <motion.section
        className="detail-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Key Features</h2>
        <ul className="detail-features">
          {project.features.map((f, i) => (
            <li key={i}>* {f}</li>
          ))}
        </ul>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        className="detail-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Tech Stack</h2>
        <div className="detail-tags">
          {project.techStack.map((t, i) => (
            <span key={i} className="tech-tag">{t}</span>
          ))}
        </div>
      </motion.section>

      {/* Screenshots */}
      {project.showScreenshots !== false && (
        <motion.section
          className="detail-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Output Screenshots</h2>
          <div className="detail-screenshots">
            {project.screenshots
              ? project.screenshots.map((src, i) => (
                  <img key={i} src={src} alt={`screenshot ${i + 1}`} />
                ))
              : <>
                  <img src={project.img1} alt="screenshot 1" />
                  <img src={project.img3} alt="screenshot 3" />
                  <img src={project.img4} alt="screenshot 4" />
                  <img src={project.img5} alt="screenshot 5" />
                </>
            }
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="detail-footer">
        <p>© 2026 Kavi. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProjectDetail;
