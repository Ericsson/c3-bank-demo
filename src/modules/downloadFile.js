
export default function downloadFile(file) {
  let anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(file)
  anchor.download = file.name
  anchor.target = '_blank'
  anchor.click()
}
