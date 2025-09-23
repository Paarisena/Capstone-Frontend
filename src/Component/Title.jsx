import React from "react";
import "./Title.css" // Import custom CSS for styling

const Title = ({ text }) => {
    return (
        <div className="title-container">
            <h1 className="title-text">{text}</h1>
        </div>
    );
};

export default Title;