import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Tesseract from "tesseract.js";

function App() {
  const [message, setMessage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      setImagePath(URL.createObjectURL(event?.target?.files?.[0]));
    }
  };

  const handleClick = () => {
    Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        if (result) {
          let confidence = result.data.confidence;

          let text = result.data.text;
          setText(text);
        }
      });
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual imagePath uploaded</h3>
        {/* <img src={imagePath} className="App-image" alt="logo" /> */}

        <h3>Extracted text</h3>
        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" accept="image/*" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}>
          {" "}
          convert to text
        </button>
        <p>
          {JSON.stringify(message)}
        </p>
      </main>
    </div>
  );
}

export default App;
