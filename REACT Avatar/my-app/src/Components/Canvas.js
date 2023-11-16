import React, {useRef, useEffect} from "react"

const Canvas = props => {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.beginPath();
        context.arc(300, 300, 200, 7*Math.PI / 6, 5*Math.PI / 6, true);
        context.lineWidth = 5;
        context.strokeStyle = "#13cf13";
        context.stroke(); 
        context.closePath();
        
        var centerX = 300;
        var centerY = 300;
        var radius = 200;

        var startAngle = 7 * Math.PI / 6;
        var endAngle = 5 * Math.PI / 6;

        var clockwise = true;

        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, endAngle, clockwise);
        context.lineWidth = 5;
        context.strokeStyle = "#13cf13";
        context.stroke(); 
        context.closePath();

        context.beginPath();
        context.arc(centerX, centerY, radius, 11 * Math.PI / 6, Math.PI / 6, false);
        context.stroke(); 
        context.closePath();

        context.beginPath();
        context.arc(centerX, centerY, 250, startAngle, endAngle, clockwise);
        context.stroke(); 
        context.closePath();
        
        context.beginPath();
        context.arc(centerX, centerY, 250, 11 * Math.PI / 6, Math.PI / 6, false);
        context.stroke(); 
        context.closePath();
    }, []
    )
    

    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas