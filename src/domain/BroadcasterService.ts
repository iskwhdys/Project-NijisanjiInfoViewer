import Axios from 'axios';
import AppCongig from "@/domain/AppConfig";
import { Broadcaster } from "@/types/broadcaster.ts";
import ChannelService from "../domain/ChannelService";

export class BroadcasterService {
  private static INSTANCE: BroadcasterService;
  public static get instance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new BroadcasterService();
    }
    return this.INSTANCE;
  }

  readonly BASE_URL = AppCongig.apiUrl;

  async getActive(): Promise<Broadcaster[]> {
    const url = this.BASE_URL + "/broadcaster";

    const channels = await ChannelService.getAllChannel();

    var broadcasters: Broadcaster[] = (await Axios.get(url, {})).data;
    broadcasters = broadcasters.filter(d => d.endDate == null);

    for (const b of broadcasters) {
      b.channel = channels.filter(c => c.id == b.youtube)[0];
      b.channel2 = channels.filter(c => c.id == b.youtube2)[0];
    }

    return broadcasters;
  }

  async get(id: string): Promise<Broadcaster> {
    const url = `${this.BASE_URL}/broadcaster/${id}`;
    return (await Axios.get(url, {})).data;
  }
}

export default BroadcasterService.instance;
