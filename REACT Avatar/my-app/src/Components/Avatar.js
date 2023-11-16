import React from "react";
import "../CSS/Avatar.css";

function Avatar () {
    return (
        <div className="Avatar">
            <model-viewer 
                className = "model" 
                alt="Ready Player Me Avatar"
                src="https://models.readyplayer.me/6529c84847d203826af5808d.glb" 
                shadow-intensity="1" 
            >                
            </model-viewer>
        </div>
    );
}

export default Avatar;