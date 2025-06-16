// Fungsi untuk mengambil data stunting berdasarkan provinsi (6 teratas) dari JSON
export async function fetchStuntingByProvince() {
  try {
    // Fetch data JSON dari public folder
    const response = await fetch("/data/prevalensi_stunting_Provinsi_indonesia_2024.json")

    if (!response.ok) {
      console.error("Error fetching province data:", response.status)
      return getFallbackProvinceData()
    }

    const provinceData = await response.json()

    if (!provinceData || !Array.isArray(provinceData)) {
      console.error("Invalid province data format:", provinceData)
      return getFallbackProvinceData()
    }

    // Urutkan data berdasarkan prevalensi tertinggi dan ambil 6 teratas
    const sortedData = provinceData
      .sort((a: any, b: any) => {
        const aValue = a["Prevalensi_Stunting(%)"] || a.percentage || a.prevalence
        const bValue = b["Prevalensi_Stunting(%)"] || b.percentage || b.prevalence
        return bValue - aValue
      })
      .slice(0, 6)

    // Sesuaikan dengan format yang dibutuhkan DataChart (name, value)
    return sortedData.map((item: any) => ({
      name: item.Provinsi || item.province,
      value: Number.parseFloat((item["Prevalensi_Stunting(%)"] || item.percentage || item.prevalence).toFixed(1)),
    }))
  } catch (error) {
    console.error("Error fetching stunting data by province:", error)
    return getFallbackProvinceData()
  }
}

// Fungsi helper untuk fallback data
function getFallbackProvinceData() {
  return [
    { name: "NTT", value: 37.8 },
    { name: "Sulawesi Barat", value: 34.5 },
    { name: "Papua", value: 32.8 },
    { name: "NTB", value: 31.4 },
    { name: "Kalimantan Barat", value: 30.5 },
    { name: "Aceh", value: 29.7 },
  ]
}

// Fungsi untuk mengambil artikel edukasi populer
export async function fetchPopularEducation() {
  try {
    console.log("=== FETCHING POPULAR EDUCATION ===")

    // Gunakan endpoint Next.js API yang sudah ada
    const response = await fetch("/api/articles/popular", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Popular articles response status:", response.status)

    if (!response.ok) {
      console.error("Failed to fetch popular articles, status:", response.status)

      // Fallback: coba endpoint articles biasa
      console.log("Trying fallback endpoint: /api/articles")
      const fallbackResponse = await fetch("/api/articles", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Fallback response status:", fallbackResponse.status)

      if (fallbackResponse.ok) {
        const fallbackResult = await fallbackResponse.json()
        console.log("Fallback response data:", fallbackResult)

        // Handle different response formats
        let articles = []
        if (fallbackResult.data && Array.isArray(fallbackResult.data)) {
          articles = fallbackResult.data
        } else if (Array.isArray(fallbackResult)) {
          articles = fallbackResult
        }

        if (articles.length > 0) {
          // Ambil 5 artikel pertama dan map ke format yang dibutuhkan
          const educationData = articles.slice(0, 5).map((item: any) => ({
            id: item.id?.toString() || item.slug,
            title: item.title || "Untitled",
            slug: item.slug || item.id?.toString(),
            views: item.view_count || item.views || 0,
          }))

          console.log("Mapped education data from fallback:", educationData)
          return educationData
        }
      }

      return []
    }

    const result = await response.json()
    console.log("Popular articles response data:", result)

    // Handle different response formats
    let articles = []
    if (result.data && Array.isArray(result.data)) {
      articles = result.data
    } else if (Array.isArray(result)) {
      articles = result
    } else if (result.articles && Array.isArray(result.articles)) {
      articles = result.articles
    }

    if (articles.length > 0) {
      console.log(`Found ${articles.length} popular articles`)

      // Map data ke format yang dibutuhkan
      const educationData = articles.slice(0, 5).map((item: any) => ({
        id: item.id?.toString() || item.slug,
        title: item.title || "Untitled",
        slug: item.slug || item.id?.toString(),
        views: item.view_count || item.views || 0,
      }))

      console.log("Mapped popular education data:", educationData)
      return educationData
    }

    console.log("No articles found in response")
    return []
  } catch (error) {
    console.error("Error fetching popular education articles:", error)
    return []
  }
}

// Fungsi tambahan untuk mendapatkan semua data provinsi (untuk keperluan admin/dashboard)
export async function fetchAllProvinceData() {
  try {
    const response = await fetch("/data/prevalensi_stunting_Provinsi_indonesia_2024.json")

    if (!response.ok) {
      console.error("Error fetching all province data:", response.status)
      return []
    }

    const provinceData = await response.json()

    return provinceData.map((item: any) => ({
      province: item.Provinsi || item.province,
      year: item.Tahun || item.year || 2024,
      percentage: Number.parseFloat((item["Prevalensi_Stunting(%)"] || item.percentage || item.prevalence).toFixed(1)),
    }))
  } catch (error) {
    console.error("Error fetching all province data:", error)
    return []
  }
}

// Fungsi tambahan untuk mendapatkan detail data berdasarkan provinsi tertentu
export async function fetchProvinceDetail(provinceName: string) {
  try {
    const response = await fetch("/data/prevalensi_stunting_Provinsi_indonesia_2024.json")

    if (!response.ok) {
      console.error("Error fetching province detail:", response.status)
      return null
    }

    const provinceData = await response.json()

    const provinceDetail = provinceData.find(
      (item: any) => (item.Provinsi || item.province).toLowerCase() === provinceName.toLowerCase(),
    )

    if (provinceDetail) {
      return {
        province: provinceDetail.Provinsi || provinceDetail.province,
        year: provinceDetail.Tahun || provinceDetail.year || 2024,
        percentage: Number.parseFloat(
          (provinceDetail["Prevalensi_Stunting(%)"] || provinceDetail.percentage || provinceDetail.prevalence).toFixed(
            1,
          ),
        ),
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching province detail:", error)
    return null
  }
}
