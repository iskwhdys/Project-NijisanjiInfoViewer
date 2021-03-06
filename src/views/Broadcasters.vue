<template>
  <div>
    <v-container style="max-width:1185px">
      <v-row dense>
        <v-col v-if="!this.$vuetify.breakpoint.xs">
          <v-btn-toggle v-model="gridMode" rounded mandatory dense @change="changeGridMode">
            <v-btn value="12">
              <v-icon>mdi-view-agenda-outline</v-icon>
            </v-btn>
            <v-btn value="6">
              <v-icon>mdi-grid-large</v-icon>
            </v-btn>
            <v-btn value="4">
              <v-icon>mdi-grid</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col>
          <v-select
            v-model="viewCount"
            :items="['All', '50', '25']"
            label="表示件数"
            @change="changeViewCount"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="sortKind"
            :items="['登録者数', '名前', 'デビュー']"
            label="並び順"
            @change="changeSortKind"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn-toggle v-model="sortMode" rounded mandatory dense @change="changeSortMode">
            <v-btn value="1">
              <v-icon>mdi-sort-ascending</v-icon>
            </v-btn>
            <v-btn value="-1">
              <v-icon>mdi-sort-descending</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-pagination
            v-model="pageNumber"
            :length="pageLength"
            next-icon="mdi-chevron-right"
            prev-icon="mdi-chevron-left"
            @input="changePage"
          ></v-pagination>
        </v-col>
      </v-row>

      <v-row dense v-if="loading">
        <v-col>
          <v-progress-circular :size="50" indeterminate></v-progress-circular>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col xs="12" :sm="gridMode" v-for="broadcaster in broadcasters" :key="broadcaster.id">
          <BroadcasterCard
            :broadcaster="broadcaster"
            v-on:child-event="showChannelPanel"
            :icon="'mdi-chevron-down-circle-outline'"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-pagination
            v-model="pageNumber"
            :length="pageLength"
            next-icon="mdi-chevron-right"
            prev-icon="mdi-chevron-left"
            @input="changePage"
          ></v-pagination>
        </v-col>
      </v-row>

      <v-bottom-sheet v-if="showChannelCard" v-model="showChannelCard">
        <ChannelCard :channel="broadcaster.channel" :open="true" />
        <ChannelCard v-if="broadcaster.channel2" :channel="broadcaster.channel2" :open="true" />
      </v-bottom-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BroadcasterService from "@/domain/BroadcasterService";
import { Broadcaster } from "@/types/broadcaster.ts";

import BroadcasterCard from "@/components/BroadcasterCard.vue";
import ChannelCard from "@/components/ChannelCard.vue";
import WebStorage from "@/domain/WebStorage";

@Component({
  components: {
    BroadcasterCard,
    ChannelCard
  }
})
export default class BroadcasterList extends Vue {
  broadcasters: Broadcaster[] = [];
  originBroadcaster: Broadcaster[] = [];
  loading: Boolean = true;
  gridMode: string = "";

  sortKind: string = "";
  sortMode: string = "";

  viewCount: string = "";
  pageNumber: number = 1;
  pageLength: number = 1;

  showChannelCard: Boolean = false;
  broadcaster!: Broadcaster;

  async created() {
    this.initSetting();

    this.originBroadcaster = await BroadcasterService.getActive();
    this.setData();

    this.loading = false;
  }

  viewCountNumber(): number {
    if (this.viewCount == "All") {
      return 1000;
    } else {
      return Number(this.viewCount);
    }
  }

  changePage() {
    this.loading = true;

    this.broadcasters.splice(0);
    setTimeout(() => {
      this.setData();
      this.loading = false;
    }, 1);
  }

  setData() {
    this.pageLength =
      Math.floor(this.originBroadcaster.length / this.viewCountNumber()) + 1;

    this.broadcasters.splice(0);

    const data = this.originBroadcaster
      .sort(this.sort)
      .slice(
        (this.pageNumber - 1) * this.viewCountNumber(),
        (this.pageNumber + 0) * this.viewCountNumber()
      );

    data.forEach(d => {
      this.broadcasters.push(d);
    });
  }

  showChannelPanel(broadcaster: Broadcaster) {
    if (this.showChannelCard == false) {
      this.broadcaster = broadcaster;
    }
    this.showChannelCard = !this.showChannelCard;
  }

  sort(a: Broadcaster, b: Broadcaster): number {
    var mode = false;

    if (this.sortKind == "名前") mode = a.kana > b.kana;
    if (this.sortKind == "登録者数")
      mode = a.channel.subscriberCount > b.channel.subscriberCount;
    if (this.sortKind == "デビュー") mode = a.startDate > b.startDate;
    if (this.sortKind == "最新配信日") mode = a.kana > b.kana;

    return (mode ? 1 : -1) * Number(this.sortMode);
  }

  initSetting() {
    if (WebStorage.broadcasterViewCount == "") {
      if (
        this.$vuetify.breakpoint.xs ||
        this.$vuetify.breakpoint.sm ||
        this.$vuetify.breakpoint.md
      ) {
        WebStorage.broadcasterViewCount = "25";
      } else {
        WebStorage.broadcasterViewCount = "All";
      }
    }
    this.viewCount = WebStorage.broadcasterViewCount;
    this.gridMode = WebStorage.broadcasterGridMode;
    this.sortKind = WebStorage.broadcasterSortKind;
    this.sortMode = WebStorage.broadcasterSortMode;
  }

  changeGridMode() {
    WebStorage.broadcasterGridMode = this.gridMode;
  }
  changeSortKind() {
    WebStorage.broadcasterSortKind = this.sortKind;
    this.setData();
  }
  changeViewCount() {
    WebStorage.broadcasterViewCount = this.viewCount;
    this.pageNumber = 1;
    this.setData();
  }
  changeSortMode() {
    WebStorage.broadcasterSortMode = this.sortMode;
    this.setData();
  }
}
</script>
