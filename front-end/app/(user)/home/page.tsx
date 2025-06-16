export const dynamic = "force-dynamic"
export const revalidate = 0

import { HomePresenter } from "@/presenter/user/home-presenter"
import HomeView from "@/view/home-view"

export default async function HomePage() {
  const presenter = new HomePresenter()

  try {
    const data = await presenter.getHomeData()
    return <HomeView data={data} />
  } catch (error) {
    console.error("Error loading home page:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }
}
