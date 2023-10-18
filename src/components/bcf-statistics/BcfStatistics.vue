<template>
  <div class="bcf-statistics">
    <div class="bcf-statistics__content">
      <BIMDataSimplePieChart
        class="bcf-statistics__content__chart"
        :barsData="chartData"
        :placeholder="true"
        :placeholderStrokeWidth="10"
        :graphDrawTime="2.5"
      />

      <div
        class="bcf-statistics__content__legend"
      >
        <div class="bcf-statistics__content__legend__title">
          {{ $t(`BcfComponents.BcfStatistics.extension.${extensionType}Title`) }}
        </div>
        <BIMDataPaginatedList
          :list="chartData"
          :perPage="6"
          :first="false"
          :last="false"
          :numberDataElements="false"
          :backgroundColor="'transparent'"
        >
          <template #element="{ element: data }">
            <div class="bcf-statistics__content__legend__item">
              <span
                class="bcf-statistics__content__legend__item__mark"
                :style="{ borderColor: data.color }"
              ></span>
              <span class="bcf-statistics__content__legend__item__percent">
                {{ data.percentage.toFixed(0) }} %
              </span>
              <span class="bcf-statistics__content__legend__item__text">
                {{
                  data.label ||
                  $t(`BcfComponents.BcfStatistics.extension.${extensionType}NotDefined`)
                }}
                <span class="count">
                  ({{ data.count }})
                </span>
              </span>
            </div>
          </template>
        </BIMDataPaginatedList>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { DEFAULT_PRIORITY_COLOR } from "../../config.js";
import { getAvailableExtensions, getExtensionField } from "../../utils/extensions.js";
// Components
import BIMDataPaginatedList from "@bimdata/design-system/src/BIMDataComponents/BIMDataPaginatedList/BIMDataPaginatedList.vue";
import BIMDataSimplePieChart from "@bimdata/design-system/src/BIMDataComponents/BIMDataSimplePieChart/BIMDataSimplePieChart.vue";

export default {
  components: {
    BIMDataPaginatedList,
    BIMDataSimplePieChart,
  },
  props: {
    detailedExtensions: {
      type: Object,
      required: true
    },
    extensionType: {
      type: String
    },
    topics: {
      type: Array,
      required: true
    },
  },
  setup(props) {
    const chartData = computed(() => {
      if (props.topics.length === 0) return [];

      const extField = getExtensionField(props.extensionType);
      const displayedExtensions = getAvailableExtensions(props.extensionType, props.detailedExtensions);

      // Add an undefined extension value to match topics
      // that have no value for this extension.
      displayedExtensions.push({ [extField]: undefined });

      return displayedExtensions
        .map(extension => {
          const topicCount = props.topics
            .filter(topic => topic[extField] === extension[extField])
            .length;

          return {
            label: extension[extField],
            color: `#${extension.color ?? DEFAULT_PRIORITY_COLOR}`,
            count: topicCount,
            percentage: (topicCount * 100) / props.topics.length
          };
        })
        .sort((a, b) => b.percentage - a.percentage);
    });

    return {
      chartData
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfStatistics.scss"></style>
