<template>
  <div class="bcf-statistics">
    <template v-if="loading">
      <div class="bcf-statistics__loading flex items-center justify-center">
        <BIMDataSpinner />
      </div>
    </template>

    <template v-else-if="bcfTopics.length === 0">
      <div class="flex items-center justify-center">
        <BcfStatisticsEmptyImage class="m-r-42" />
        <p>{{ $t("BcfTopicsMetrics.emptyText") }}</p>
      </div>
    </template>

    <template v-else>
      <div class="bcf-statistics__content flex justify-around">
        <Graph :barsData="barsData" :size="245">
          <div class="bcf-statistics__content__total flex items-center">
            <strong>{{ bcfTopics.length }}</strong>
            <span>{{ $t("BcfTopicsMetrics.issues") }}</span>
          </div>
        </Graph>
        <div
          class="bcf-statistics__content__legend flex items-start justify-center m-l-12"
        >
          <div
            v-for="barData in barsData"
            :key="barData"
            class="flex items-center"
          >
            <div
              :style="{
                width: '10px',
                height: '10px',
                'border-radius': '50px',
                'background-color': barData.color
              }"
            ></div>
            <strong class="m-x-6">
              {{ barData.percentage }} %
            </strong>
            <span>
              {{ barData.label && $t("BcfTopicsMetrics.priority") }}
              {{ barData.label || $t("BcfTopicsMetrics.notDefined") }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import { DEFAULT_PRIORITY_COLOR } from "../../config";
// Components
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSpinner.js";
import BcfStatisticsEmptyImage from "./BcfStatisticsEmptyImage.vue";

// TODO: this could be externalized .. ?
import Graph from "../graph/Graph.vue";

export default {
  components: {
    BcfStatisticsEmptyImage,
    BIMDataSpinner,
    Graph
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    },
    priorities: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  setup(props) {
    const barsData = computed(() => {
      if (props.bcfTopics.length) {
        // Add empty priority to match topics without priorities
        const shownPriorities = [...props.priorities, { priority: undefined }];

        return shownPriorities
          .map(priority => {
            let barData = {};
            if (priority.color !== undefined) {
              barData.color = `#${priority.color}`;
            } else {
              barData.color = `#${DEFAULT_PRIORITY_COLOR}`;
            }
            const topicCount = props.bcfTopics.filter(
              bcfTopic => bcfTopic.priority === priority.priority
            ).length;
            const calcPercentage = (topicCount * 100) / props.bcfTopics.length;
            barData.percentage = calcPercentage.toFixed(0);
            barData.label = priority.priority;
            return barData;
          })
          .sort((a, b) =>
            parseInt(a.percentage) > parseInt(b.percentage) ? -1 : 1
          );
      }
      return [];
    });

    return {
      barsData
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfStatisctics.scss"></style>
