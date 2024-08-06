import React from 'react';
import '../styles.css';  // Adjusted path for all components

const About = () => {
  return (
    <div className="-page">
      <div className="skills">
        <h2>Skills</h2>
        <div className="skill-category">
          <h3>JavaScript:</h3>
          <ul className="skill-list">
            <li>• Application Engineering and Depoloyment (React + JSX)</li>
            <li>• Database API and Management (sqlite3 + JSON + Express) </li>
            <li>• Package and Deploy to Cloud Services (Babel + Webpack + Dependencies) </li>
            <li>• 3D Animations and Interactivity (Babylon + Three.js)</li>
            <li>• Quick HTML Modifications (jQuery) </li>
            <li>• Add Static Typing to JS (TypeScript)</li>
            <li>• Managing Dependencies and Accessing Database on Server-side API(Node + npm)</li>
          </ul>
        </div>
        <div className="skill-category">
        <h3>Python:</h3>
        <ul className="skill-list">
          <li>• Data Management, Data Type Conversion, File Names Management</li>
          <li>• Socket-based Networking (socket, default library)</li>
          <li>• Machine Learning (TensorFlow)</li>
          <li>• Error Logging, Test Automation,  (assert + pytest)</li>
          <li>• Data Visualization (GraphQL + matplotlib)</li>
          <li>• Data Compression &Encryption (zlib + cryptography)</li>
          <li>• Virtual Environments (venv)</li>
          <li>• Library Management (pip)</li>
          <li>• Raspberry Pi 2B+ and 3B+ (Electrical Engineering + Python)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Web Stack:</h3>
        <ul className="skill-list">
          <li>• HTML5 (Ole Reliable)</li>
          <li>• Reusable Styles and Animations (CSS & Exensions)</li>
          <li>• Front-end and Back-end Scripting (JavaScript + React)</li>
          <li>• API Design (JavaScript, PHP, JSON, SQL)</li>
          <li>• Bootstrap (Rapid Web Development)</li>
          <li>• Website Migration (Location and Dependencies)</li>
          <li>• User Experience Design (Graphic Design and Accessibility)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>LAMP Stack:</h3>
        <ul className="skill-list">
          <li>• MariaDB (SQL) Database Management</li>
          <li>• PHP & Apache Web Applications (LAMP + XAMPP)</li>
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
        <h3>Graphic Design:</h3>
        <ul className="skill-list">
          <li>• Adobe Illustrator Vector Design</li>
          <li>• Adobe Photoshop Image Editing</li>
          <li>• Web Application Wireframing</li>
          <li>• User Interface Design</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>Tools & Design Patterns:</h3>
        <ul className="skill-list">
          <li>• Kanban (Azure DevOps, Github)</li>
          <li>• Agile (Responsive Team Structure with Incremenetal Improvements)</li>
          <li>• Scrum (Team Collaboration + Feedback)</li>
          <li>• CI/CD (Continuous Delivery Towards Production)</li>
          <li>• Microservices (Small Interoperating Systems)</li>
          <li>• A/B Testing (Version Comparison, Data or Site Migration)</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>C:</h3>
        <ul className="skill-list">
          <li>• Basic Application Design (C + C++)</li>
          <li>• Basic GUI (ImGUI))</li>
          <li>• Basic GUI in Visual Studio (C# + WPF))</li>
        </ul>
      </div>
      <div className="skill-category">
        <h3>3D:</h3>
        <ul className="skill-list">
          <li>• Rendering to Web (Three.js + Babylon + webGL)</li>
          <li>• DirectX (3D Desktop Rendering)</li>
        </ul>
      </div>
    </div>
    <div className="bio_text">
      <h3>Cover Letter</h3>
      <p>
        Growing up I had computer access and mentorship through my SQL developer mom and my COBAL developer grandfather. <br />
        Testing and performing well in high school secured $28,000 in scholarships to a university, which I chose Arizona State. <br />
        To utilize previous experience in art and programming I entered Graphic Information Technology B.S. with a core focus in web development and graphic design. <br />
        Dual enrollment credits from high schooll and enrolling in up to 19 credit hours per semester allowed me to complete 5 full semesters from 2016 to 2018  <br />
        I left college at the end of 2018 to pursue live music performances until many of them were cancelled in 2020. <br />
        While managing to secure relevant work, my immediate goal is to learn more about application development by working with a team on a React application <br />
        I am passionate about wanting to work more with React <br />
      </p>
    </div>
  </div>
  );
};

export default About;
      