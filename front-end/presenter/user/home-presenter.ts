import { HomeModel, type HomeData } from "@/model/user/home-model"

export class HomePresenter {
  private model: HomeModel

  constructor() {
    this.model = new HomeModel()
  }

  async getHomeData(): Promise<HomeData> {
    return await this.model.fetchHomeData()
  }
}
