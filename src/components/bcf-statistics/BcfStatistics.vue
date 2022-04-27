<template>
  <div class="bcf-statistics">
    <div class="bcf-statistics__content">
      <BIMDataSimplePieChart
        class="bcf-statistics__content__chart"
        :barsData="barsData"
        :placeholder="true"
        :placeholderStrokeWidth="10"
        :graphDrawTime="2.5"
      />

      <div
        class="bcf-statistics__content__legend"
      >
        <div class="bcf-statistics__content__legend__title">
          {{ $t(`BcfTopicsMetrics.extension.${extensionType}Title`) }}
        </div>
        <BIMDataPaginatedList
          :list="barsData"
          :perPage="6"
          :first="false"
          :last="false"
          :numberDataElements="false"
          :backgroundColor="'transparent'"
        >
          <template #element="{ element: barData }">
            <div class="bcf-statistics__content__legend__item">
              <span
                class="bcf-statistics__content__legend__item__mark"
                :style="{ borderColor: barData.color }"
              ></span>
              <span class="bcf-statistics__content__legend__item__percent">
                {{ barData.percentage.toFixed(0) }} %
              </span>
              <span class="bcf-statistics__content__legend__item__text">
                {{
                  barData.label &&
                  $t(`BcfTopicsMetrics.extension.${extensionType}`)
                }}
                {{
                  barData.label ||
                  $t(`BcfTopicsMetrics.extension.${extensionType}NotDefined`)
                }}
                <span class="total">({{ barData.total }})</span>
              </span>
            </div>
          </template>
        </BIMDataPaginatedList>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { DEFAULT_PRIORITY_COLOR } from "../../config";
// Components
import BIMDataPaginatedList from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataPaginatedList.js";
import BIMDataSimplePieChart from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataSimplePieChart.js";

const typeFieldMap = {
  Priority: "priority",
  Status: "topicStatus"
};

export default {
  components: {
    BIMDataPaginatedList,
    BIMDataSimplePieChart,
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    },
    extensionType: {
      type: String
    },
    availableExtensions: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const extensionValue = ref([typeFieldMap[props.extensionType]]);

    const barsData = computed(() => {
      if (props.bcfTopics.length) {
        // Add empty priority to match topics without priorities
        const shownExtensions = [...props.availableExtensions];

        shownExtensions.push({
          [extensionValue.value]: undefined
        });

        return shownExtensions
          .map(shownExtension => {
            let barData = {};
            if (shownExtension.color !== undefined) {
              barData.color = `#${shownExtension.color}`;
            } else {
              barData.color = DEFAULT_PRIORITY_COLOR;
            }

            const topicCount = props.bcfTopics.filter(
              bcfTopic =>
                bcfTopic[extensionValue.value] ===
                shownExtension[extensionValue.value]
            ).length;

            barData.percentage = (topicCount * 100) / props.bcfTopics.length;

            barData.label = shownExtension[extensionValue.value];

            barData.total = topicCount;
            return barData;
          })
          .sort((a, b) =>
            parseInt(a.percentage) > parseInt(b.percentage) ? -1 : 1
          );
      }
      return [];
    });
    return {
      typeFieldMap,
      barsData
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfStatistics.scss"></style>
