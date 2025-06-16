"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DataChartProps {
  title: string
  data: Array<{ name: string; value: number }>
}

// Koordinat provinsi untuk peta
const provinceCoordinates: { [key: string]: [number, number] } = {
  NTT: [-8.6573, 121.0794],
  "Sulawesi Barat": [-2.8441, 119.232],
  Papua: [-4.2699, 138.0804],
  NTB: [-8.6529, 117.3616],
  "Kalimantan Barat": [-0.2787, 111.4752],
  Aceh: [4.6951, 96.7494],
  "Sumatera Utara": [2.1154, 99.5451],   
  "Sumatera Barat": [-0.7399, 100.8],
  Riau: [0.2933, 101.7068],
  Jambi: [-1.4852, 103.6118],
  "Sumatera Selatan": [-3.3194, 103.914],
  Bengkulu: [-3.8004, 102.2655],
  Lampung: [-4.5585, 105.4068],
  "Kepulauan Bangka Belitung": [-2.741, 106.4405],
  "Kepulauan Riau": [3.9456, 108.1429],
  "DKI Jakarta": [-6.2088, 106.8456],
  "Jawa Barat": [-6.9175, 107.6191],
  "Jawa Tengah": [-7.15, 110.1403],
  "DI Yogyakarta": [-7.8754, 110.4262],
  "Jawa Timur": [-7.536, 112.2384],
  Banten: [-6.4058, 106.064],
  Bali: [-8.4095, 115.1889],
  "Sulawesi Utara": [0.6246, 123.975],
  "Sulawesi Tengah": [-1.43, 121.4456],
  "Sulawesi Selatan": [-3.6687, 119.974],
  "Sulawesi Tenggara": [-4.14, 122.175],
  Gorontalo: [0.6999, 122.4467],
  "Kalimantan Tengah": [-1.6815, 113.3824],
  "Kalimantan Selatan": [-3.0926, 115.2838],
  "Kalimantan Timur": [1.6406, 116.4194],
  "Kalimantan Utara": [3.073, 116.0413],
  "Papua Barat": [-1.3361, 133.1747],
  Maluku: [-3.2385, 130.1453],
  "Maluku Utara": [1.5709, 127.8089],
}

const prepareData = (data: Array<{ name: string; value: number }> = []) =>
  (data || []).map((item) => ({
    ...item,
    full: 100,
  }))

export default function DataChart({ title, data = [] }: DataChartProps) {
  const chartData = prepareData(data)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Load Leaflet dynamically
  useEffect(() => {
    if (isClient && !leafletLoaded) {
      const loadLeaflet = async () => {
        try {
          // Load CSS via link tag instead of import
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            link.integrity =
              "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
          }

          // Import Leaflet
          const L = await import("leaflet");

          // Fix default markers
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          });

          setLeafletLoaded(true);
        } catch (error) {
          console.error("Error loading Leaflet:", error)
        }
      }

      loadLeaflet()
    }
  }, [isClient, leafletLoaded])

  // Initialize map
  useEffect(() => {
    if (leafletLoaded && mapRef.current && !mapInstanceRef.current) {
      const initializeMap = async () => {
        const L = await import("leaflet")

        // Create custom icon function
        const createCustomIcon = (percentage: number) => {
          const getColor = (value: number) => {
            if (value >= 35) return "#dc2626"
            if (value >= 30) return "#ea580c"
            if (value >= 25) return "#f59e0b"
            return "#16a34a"
          }

          const color = getColor(percentage)

          return L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 7px;
              ">
                ${percentage}%
              </div>
            `,
            className: "custom-marker",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })
        }

        try {
          // Initialize map
          const map = L.map(mapRef.current, {
            center: [-2.5, 118],
            zoom: 5,
            zoomControl: true,
            scrollWheelZoom: false,
          })

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map)

          // Add markers
          data.forEach((item) => {
            const coordinates = provinceCoordinates[item.name]
            if (coordinates) {
              const marker = L.marker(coordinates, {
                icon: createCustomIcon(item.value),
              }).addTo(map)

              // Add popup (equivalent to tooltip/alert from chart)
              marker.bindPopup(`
                <div style="text-align: center; padding: 8px;">
                  <h3 style="font-weight: bold; color: #1e293b; margin: 0 0 4px 0;">${item.name}</h3>
                  <p style="color: #64748b; margin: 0 0 4px 0; font-size: 12px;">Prevalensi Stunting</p>
                  <p style="font-size: 18px; font-weight: bold; color: #317BC4; margin: 0;">${item.value}%</p>
                </div>
              `)
            }
          })

          mapInstanceRef.current = map
        } catch (error) {
          console.error("Error initializing map:", error)
        }
      }

      initializeMap()
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, data])

  const marginRight = 10

  if (!isClient || !leafletLoaded) {
    return (
      <Card className="shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-800 text-md font-bold text-center">{title}</CardTitle>
          <p className="text-slate-500 text-xs mt-1 text-center">
            Data prevalensi stunting berdasarkan 6 provinsi tertinggi tahun 2024
          </p>
        </CardHeader>
        <CardContent>  
          <div
            style={{ height: `${data.length * 60}px`, width: "100%" }}
            className="flex items-center justify-center bg-gray-100 rounded"
          >
            <p className="text-gray-500">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md bg-white h-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-800 text-md font-bold text-center">{title}</CardTitle>
        <p className="text-slate-500 text-xs mt-1 text-center">
          Data prevalensi stunting berdasarkan 6 provinsi tertinggi tahun 2024
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${data.length * 65}px`, width: "100%" }} className="relative">
          <div
            ref={mapRef}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "8px",
              zIndex: 1,
            }}
          />

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs z-[1000]">
            <div className="font-bold mb-1">Tingkat Stunting</div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <span>≥35% (Sangat Tinggi)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
              <span>30-34% (Tinggi)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>25-29% (Sedang)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span>&lt;25% (Rendah)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
