<template>
  <v-container style="max-width:1185px">
    <div v-for="field in fields" :key="field.id">
      <CommonCardList :field="field"></CommonCardList>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonCardList from "@/components/CommonCardList.vue";

@Component({
  components: {
    CommonCardList
  }
})
export default class Home extends Vue {
  fields = [
    {
      id: "live",
      title: "ライブ中",
      autoReload: true,
      icon: {
        name: "mdi-access-point",
        color: "red"
      },
      get: null,
      reload: { id: "new", flag: false },
      videos: [],
      filter: true
    },
    {
      id: "upload",
      title: "新着動画",
      icon: { name: "mdi-youtube-tv" },
      get: { id: "get", flag: false, count: 20 },
      reload: { id: "new", flag: false },
      videos: [],
      filter: true
    },
    {
      id: "archive",
      title: "アーカイブ",
      icon: { name: "mdi-play-box-multiple" },
      get: { id: "get", flag: false, count: 90 },
      reload: { id: "new", flag: false },
      videos: [],
      filter: true
    }
  ];
}
</script>
