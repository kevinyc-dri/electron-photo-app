const fs = require('fs')

export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

  export async function getRotatedImage(imageSrc, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
}

export async function getCroppedImage(fileName, imageSrc, croppedAreaPixels, rotation=0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const maxSize = Math.max(image.width, image.height)
  // creating a large enough canvas to rotate the image to any angle safely
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))
  canvas.width = safeArea
  canvas.height = safeArea
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-safeArea / 2, -safeArea / 2)
  ctx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2)
  const data = ctx.getImageData(0, 0, safeArea, safeArea)
  // set canvas to desired width and height
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  // plop image data in with the correct offsets for x and y to crop
  ctx.putImageData(data,
      Math.round(0 - safeArea / 2 + image.width / 2 - croppedAreaPixels.x),
      Math.round(0 - safeArea / 2 + image.height / 2 - croppedAreaPixels.y)
    )
    const url = canvas.toDataURL('image/jpg', 0.8)
    const base64data = url.replace(/^data:image\/png;base64,/, '')
    const newFileName = fileName + '-cropped.png'
    fs.writeFile(newFileName, base64data, 'base64', err => console.error(err))
}
