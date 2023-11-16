import React from "react";
import "../CSS/Listen-Button.css";

function ListenButton () {
    return (
        <div className="listeningEar" >
            <img
                src={require("../Images/listening-ear.png")}
                alt="Ear Listening to Speech"
            />
            <canvas className="arcs">

            </canvas>
        </div> 
    );
}

export default ListenButton;