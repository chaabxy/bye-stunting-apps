import { exec } from "child_process"
import path from "path"

// Path ke file server Hapi.js
const serverPath = path.join(__dirname, "../server/hapi-server.ts")

// Jalankan server menggunakan ts-node
const serverProcess = exec(`npx ts-node ${serverPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing server: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Server stderr: ${stderr}`)
    return
  }
  console.log(`Server stdout: ${stdout}`)
})

// Log output server
serverProcess.stdout?.on("data", (data) => {
  console.log(`Server: ${data}`)
})

// Log error server
serverProcess.stderr?.on("data", (data) => {
  console.error(`Server Error: ${data}`)
})

// Handle server exit
serverProcess.on("exit", (code) => {
  console.log(`Server process exited with code ${code}`)
})

console.log("Starting Hapi.js server...")
