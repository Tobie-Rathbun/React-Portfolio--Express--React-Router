import React from 'react';
import '../styles.css';  // Adjusted path for all components

const About = () => {
  return (
    <div className="about-page">
      <div className="skills">
        <h2>Skills</h2>
        <div className="skill-category">
          <h3>JavaScript:</h3>
          <ul className="skill-list">
            <li>• React + JSX</li>
            <li>• Node + npm</li>
            <li>• jQuery</li>
            <li>• TypeScript</li>
          </ul>
        </div>
        <div className="skill-category">
        <h3>Python:</h3>
        <ul className="skill-list">
          <li>• Data Management</li>
          <li>• Socket-based Networking (socket, default library)</li>
          <li>• Machine Learning (TensorFlow)</li>
          <li>• Test Automation</li>
          <li>• Data Visualization (GraphQL)</li>
          <li>• Data Encryption</li>
          <li>• Virtual Environments (venv)</li>
          <li>• Library Management & pip</li>
          <li>• Raspberry Pi 2B+ and 3B+ (Practical Use Case)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Web Stack:</h3>
        <ul className="skill-list">
          <li>• HTML5</li>
          <li>• CSS & Exensions</li>
          <li>• JavaScript + React</li>
          <li>• RESTful API Design (js, PHP, JSON, SQL)</li>
          <li>• Bootstrap (Rapid Web Development)</li>
          <li>• Website Migration</li>
          <li>• User Experience Design</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>LAMP Stack:</h3>
        <ul className="skill-list">
          <li>• MariaDB (SQL) Database Management</li>
          <li>• PHP & Apache Web Applications (LAMP)</li>
          <li>• Linux BASH & Terminal Commands (Pop!_OS)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Git:</h3>
        <ul className="skill-list">
          <li>• Version Control & Pull Requests</li>
          <li>• Branch Management</li>
          <li>• Team Coordination</li>
          <li>• Terminal Commands in CMD and PowerShell</li>
          <li>• Push, Pull, Merge, Fetch, Checkout</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Adobe:</h3>
        <ul className="skill-list">
          <li>• Illustrator Vector Design</li>
          <li>• Photoshop Image Editing</li>
          <li>• Web Application Wireframing</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Tools & Design Patterns:</h3>
        <ul className="skill-list">
          <li>• Kanban (Azure, Github, Jira)</li>
          <li>• Agile (Incremenetal Improvements)</li>
          <li>• Scrum (Team Collaboration + Feedback)</li>
          <li>• CI/CD (Delivery to Production)</li>
          <li>• Microservices (Small Interoperating Systems)</li>
          <li>• A/B Testing (Version Comparison)</li>
          <li>• AWS (Amazon Web Services)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>C:</h3>
        <ul className="skill-list">
          <li>• C (Basic Application Design)</li>
          <li>• C++ (Redesign Applications with Garbage Collection)</li>
          <li>• C# + WPF (GUI Tool & Updating Existing Codebase)</li>
          <li>• Arduino Uno (Electrical Engineering + Practical Implementations)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>3D:</h3>
        <ul className="skill-list">
          <li>• OpenGL + WebGL (3D Rendering and Engine Design)</li>
          <li>• Blender (3D Model Design)</li>
          <li>• Three.js (3D Web Rendering)</li>
          <li>• DirectX (3D Desktop Rendering)</li>
          <li>• Adobe Substance + Dimension (3D Model Design)</li>
        </ul>
      </div>
    </div>
    <div className="bio_text">
      <h3>Cover Letter</h3>
      <p>
        Growing up I always had access to a computer and mentorship through my SQL developer mom or my COBAL developer grandfather. <br />
        I tested well in high school and managed to secure $28,000 in scholarships to university. <br />
        With dual enrollment credits that transferred as well as enrolling in up to 19 credit hours per semester, from 2016 to 2018 I completed 5 full semesters in Graphic Information Technology B.S. with a core focus in web development and graphic design. <br />
        I left college at the end of 2018 to pursue live music performances until many of them were cancelled in 2020. <br />
        Without putting myself above any type of work, I held miscellaneous jobs until I could move back into the technical field I had originally envisioned for myself. <br />
        Working in entry level software quality assurance for Microsoft has allowed me to hone the skills I started building before high school, and has given me the time, resources, and connections to further my existing projects and knowledge. <br />
        I have recently had a focus on network design, RESTful APIs, and building practical web applications in React. <br />
        My goal is to work in full-stack development to utilize my back-end and technical knowledge, where my front-end design skills can occasionally be worked into a project's completion and elegance.
      </p>
    </div>
  </div>
  );
};

export default About;
      