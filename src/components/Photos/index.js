import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
import { readFile, getRotatedImage } from '../../utils/images'

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

function Photo() {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)



  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)

      // apply rotation if needed
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }

      setImageSrc(imageDataUrl)
    }
  }

  return (
    <div>
      {!imageSrc
      ? <input type="file" accept="image/*" onChange={onFileChange} />
      : <Cropper
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        image={imageSrc}
        aspect={4/3}
      />
      }
    </div>
  )
}

export default Photo;
