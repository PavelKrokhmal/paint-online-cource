import React, {useEffect, useRef, useState} from 'react'
import '../styles/canvas.scss'
import {observer} from 'mobx-react-lite'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import {Modal, Button} from 'react-bootstrap'
import {useParams} from 'react-router-dom'

function Canvas() {
    const canvasRef = useRef()
    const userNameRef = useRef()
    const [modal, setModal] = useState(true)
    const {id} = useParams()

    useEffect(()=> {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, [])

    useEffect(()=> {
        if (canvasState.userName) {
            const socket = new WebSocket('ws://localhost:5000/')
            socket.onopen = () => {
                console.log('Connection is on')
                socket.send(JSON.stringify({
                    id,
                    userName: canvasState.userName,
                    method: 'connection' 
                }))
            }
            socket.onmessage = (event) => {
                console.log(event.data)
            }
        }
    }, [canvasState.userName])

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const connectHandler = () => {
        canvasState.setUserName(userNameRef.current.value)
        setModal(false)
    }

    return (
        <div className="canvas">
             <Modal show={modal} onHide={() => {setModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={userNameRef}/>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => connectHandler()}>
                    Enter
                </Button>
                </Modal.Footer>
            </Modal>
            <canvas width={600} height={400} ref={canvasRef} onMouseDown={mouseDownHandler}></canvas>
        </div>
    )
}

export default observer(Canvas)
