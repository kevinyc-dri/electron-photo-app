import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

function Photo() {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  return (
    <div>
      <Cropper
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
        aspect={4/3}
      />
    </div>
  )
}

export default Photo;
