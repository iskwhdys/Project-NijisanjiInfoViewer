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
export default class Schedules extends Vue {
  fields = [
    {
      id: "premier",
      title: "プレミア公開前",
      icon: { name: "mdi-timetable" },
      get: { id: "get", flag: false, count: 30 },
      reload: { id: "new", flag: false },
      videos: []
    },
    {
      id: "schedule",
      title: "配信予定",
      icon: { name: "mdi-timetable" },
      get: { id: "get", flag: false, count: 30 },
      reload: { id: "new", flag: false },
      videos: []
    }
  ];
}
</script>
