import Axios from 'axios';
import AppConfig from "@/domain/AppConfig";
import { Video, Rank } from "@/types/video";

export class VideoService {
  private static INSTANCE: VideoService;
  public static get instance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new VideoService();
    }
    return this.INSTANCE;
  }

  readonly BASE_URL = AppConfig.apiUrl;
  private async get(url: string): Promise<Video[]> {
    const data: Video[] = (await Axios.get(url, {})).data;
    const hour: number = 9;

    data.forEach(d => {
      this.setVideoRank(d);
      if(d.published != undefined){
        d.published = new Date(d.published);
        d.published.setHours(d.published.getHours() + hour);
      }
      if(d.liveSchedule != undefined){
        d.liveSchedule = new Date(d.liveSchedule);
        d.liveSchedule.setHours(d.liveSchedule.getHours() + hour);
      }
      if(d.liveStart != undefined){
        d.liveStart = new Date(d.liveStart);
        d.liveStart.setHours(d.liveStart.getHours() + hour);
      }
      if(d.uploadDate != undefined){
        d.uploadDate = new Date(d.uploadDate);
        d.uploadDate.setHours(d.uploadDate.getHours() + hour);
      }
    });
    return data;
  }

  async getChannelVideo(channelId: string, from: string, count:number): Promise<Video[]> {
    let url = `${this.BASE_URL}/video/channel/${channelId}`;
    if(from != ""){
       url = `${url}?from=${from}&count=${count}`;
    }
    const data: Video[] = await this.get(url);

    let result: Video[] = [];

    // 予定を抽出
    data.forEach(d => {
      if (d.status == "reserve") result.push(d);
    });
    // ライブを抽出
    data.forEach(d => {
      if (d.status == "stream" ) result.push(d);
    });
    // 上記以外を抽出
    data.forEach(d => {
      if (d.status != "reserve" && d.status != "stream") {
        result.push(d);
      }
    });

    return result;
  }

  async getFieldVideo(field: string): Promise<Video[]> {
    return this.get(`${this.BASE_URL}/video/${field}`);
  }

  async getFieldVideoFrom(field: string,  from: string, count: number): Promise<Video[]> {
    return this.get(`${this.BASE_URL}/video/${field}?&from=${from}&count=${count}`);
  }

  private setVideoRank(video: Video) {
    var score;
    if (video.status == 'stream') {
      score = video.liveViews / 1000;
    } else {
      score = video.views / 20000;
    }
    var idx = Math.floor(score);
    video.rank = Rank.none;
    if (idx == 1) video.rank = Rank.low;
    if (idx == 2) video.rank = Rank.low;
    if (idx == 3) video.rank = Rank.middle;
    if (idx == 4) video.rank = Rank.middle;
    if (idx >= 5) video.rank = Rank.high;
  }

}

export default VideoService.instance;
