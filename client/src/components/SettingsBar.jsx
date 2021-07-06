import React from 'react'
import toolState from '../store/toolState'

function SettingsBar() {
    return (
        <div className="settings-bar">
            <label htmlFor="line-width">Line width</label>
            <input style={{margin: '0 10px'}} 
                id="line-width" 
                onChange={e => toolState.setLineWidth(e.target.value)}
                type='number' 
                min={1} 
                max={50} 
                defaultValue={1}/>
            <label htmlFor="stroke-color">Stroke color</label>
            <input id="stroke-color" onChange={e => toolState.setStrokeColor(e.target.value)} type="color"/>
        </div>
    )
}

export default SettingsBar
