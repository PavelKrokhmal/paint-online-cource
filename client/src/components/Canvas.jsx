import React, {useEffect, useRef} from 'react'
import '../styles/canvas.scss'
import {observer} from 'mobx-react-lite'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'

function Canvas() {
    const canvasRef = useRef()

    useEffect(()=> {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, [])

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    return (
        <div className="canvas">
            <canvas width={600} height={400} ref={canvasRef} onMouseDown={mouseDownHandler}></canvas>
        </div>
    )
}

export default observer(Canvas)
