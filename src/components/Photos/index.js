import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
import { readFile, getRotatedImage, getCroppedImage } from '../../utils/images'

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

function Photo() {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [fileName, setFileName] = useState(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, newCroppedAreaPixels) => {
    console.log({ newCroppedAreaPixels })
    setCroppedAreaPixels(newCroppedAreaPixels)
  }, [])

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFileName(file.path)
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
  if(!imageSrc) {
    return <input type="file" accept="image/*" onChange={onFileChange} />
  }
  return (
    <div className="crop-area">
        <Cropper
         crop={crop}
         zoom={zoom}
         onCropChange={setCrop}
         onZoomChange={setZoom}
         onCropComplete={onCropComplete}
         image={imageSrc}
         aspect={4/3}
       />
       <button className="save-btn"
        onClick={()=> {
          getCroppedImage(fileName, imageSrc, croppedAreaPixels)
          setImageSrc(null)
        }}>
          Save
        </button>
    </div>
  )
}

export default Photo
