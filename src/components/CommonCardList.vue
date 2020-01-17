<template>
  <div>
    <v-row>
      <v-col>
        <v-divider></v-divider>
        <h3>
          <v-icon>{{ feald.icon }}</v-icon>
          {{ feald.title }}
          <v-btn fab small @click="reloadVideos(feald)">
            <v-icon>
              {{ feald.reload.flag ? "mdi-sync mdi-spin" : "mdi-rotate-left" }}
            </v-icon>
          </v-btn>
        </h3>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col xl="2" justify="start" v-for="video in feald.videos" :key="video.id">
        <VideoCard :video="video" :type="feald.id"></VideoCard>
      </v-col>
      <v-col v-if="feald.get" xl="2" justify="start">
        <v-btn fab small @click="getVideos(feald)">
          <v-icon>
            {{ feald.get.flag ? "mdi-sync mdi-spin" : "mdi-chevron-right" }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import Axios from "axios";
import moment from "moment";
import VideoCard from "@/components/VideoCard.vue";
import Video from "@/types/video.ts";
import Channel from "@/types/channel.ts";
import GrobalValiables from "@/mixins/grobalValiables";

@Component({
  components: {
    VideoCard
  }
})
export default class CommonCardList extends Mixins(GrobalValiables) {
  @Prop() private feald!: any;

  async created() {
    this.reloadVideos(this.feald);
  }

  async reloadVideos(feald: any) {
    feald.reload.flag = true;
    feald.videos.splice(0, feald.videos.length);
    Axios.get(this.apiUrl + "video?type=" + feald.id + "&mode=" + feald.reload.id, {})
      .then(async response => {
        const data = await this.downloadChannelThumbnail(response.data);
        data.forEach(d => feald.videos.push(d));
      })
      .finally(() => {
        feald.reload.flag = false;
      });
  }
  async getVideos(feald: any) {
    feald.get.flag = true;
    const lastVideo = feald.videos[feald.videos.length - 1];
    const date = feald.id == "upload" ? lastVideo.uploadDate : lastVideo.liveStart;
    const from = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const url = this.apiUrl + "video";
    const param = "?type=" + feald.id + "&mode=" + feald.get.id + "&from=" + from + "&count=" + feald.get.count;
    Axios.get(url + param, {})
      .then(async response => {
        const data = await this.downloadChannelThumbnail(response.data);
        data.forEach(d => feald.videos.push(d));
      })
      .finally(() => {
        feald.get.flag = false;
      });
  }

  async downloadChannelThumbnail(videos: Video[]) {
    var channels: Channel[] = [];

    for (const v of videos) {
      var channel: Channel = channels.find(c => c.id == v.channelId) as Channel;
      if (channel == null) {
        channel = (await Axios.get(this.apiUrl + "channel/" + v.channelId + "?MiniThumbnail=0", {})).data;
        channels.push(channel);
      }
      v.channel = channel;
    }
    return videos;
  }
}
</script>