import React from "react"
import App from "./App"

export default function Intro(props){



return (
    <>
 <div className="mainDiv">
    <div className="titleDiv">
        <img onClick={props.selectEn} className="eng" src="en.png" />
    <h1>Quizzical</h1>
    <img onClick={props.selectRo} className="rom" src="ro.png" />
    </div>
    <p className="introText">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis illum beatae reprehenderit, quibusdam sit accusantium at hic corporis vero! Provident corporis molestiae in, sed fuga reprehenderit voluptatum? Temporibus, ratione dicta.</p>
    <button onClick={props.onButtonClick}>Start quiz</button>
    
   
    </div>
    </>
)    
}