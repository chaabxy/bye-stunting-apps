import {
  TentangKamiModel,
  type TeamMember,
  type MissionItem,
} from "@/model/user/tentang-kami-model";

export class TentangKamiPresenter {
  private model: TentangKamiModel;

  constructor() {
    this.model = new TentangKamiModel();
  }

  getTeamMembers(): TeamMember[] {
    return this.model.getTeamMembers();
  }

  getMissionItems(): MissionItem[] {
    return this.model.getMissionItems();
  }

  getCompanyInfo() {
    return this.model.getCompanyInfo();
  }

  formatTeamMemberImage(image: string): string {
    return image || "/placeholder.svg";
  }

  getTeamMemberCount(): number {
    return this.model.getTeamMembers().length;
  }

  getMissionItemsCount(): number {
    return this.model.getMissionItems().length;
  }
}
