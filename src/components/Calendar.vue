<template>
  <pre>
  {{ monthName }}
  </pre>
  {{ selectedMonth }}
  <hr />
  {{ selectedMonthNumber }}

  <button @click="next">Next</button>
  <button @click="previous">Previous</button>
  <button @click="today">Today</button>
  <table id="tbl" :style="{ width: props_width }">
    <thead>
      <tr>
        <th id="Sun">Sun</th>
        <th id="Mon">Mon</th>
        <th id="Tue">Tue</th>
        <th id="Wed">Wed</th>
        <th id="Thu">Thu</th>
        <th id="Fri">Fri</th>
        <th id="Sat">Sat</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(v, i) in firstWeek">
        <td
          v-for="(v_, i_) in v"
          :class="`ripple cal-date-box table-size-${tableWidth} today-${isToday(
            v_
          )} is-current-month-${isCurrentMonth(
            v_,
            getMonthName(selectedMonth.value).value
          )}`"
          :style="{ width: 'calc(' + customWidthHeight / 7 + 'px - 10px)' }"
          :key="i_"
          @click="parent"
          :headers="getDateDetail(v_).short"
          :data-date="getDateDetail(v_).date"
          :data-year="getDateDetail(v_).year"
          :data-month="getDateDetail(v_).month"
          :data-day="getDateDetail(v_).value"
          :data-week-day="getDateDetail(v_).weekDay"
          :data-day-name="getDateDetail(v_).full"
          data-type="td"
        >
          <div class="main-date" data-type="main-div">
            <div class="date" data-type="date-parent">
              <div class="content" data-type="date">
                {{ getDateDetail(v_).value }}
              </div>
            </div>
            <div class="data" data-type="data">
              <div
                v-if="search(props_data, v_).length > 0"
                v-for="(v, i) in search(props_data, v_)"
                :key="i"
                :data-id="v.id"
                :style="{ width: customWidthHeight / 7 - 4 + 'px' }"
                class="item cut-text"
                @click="childHandler"
                data-type="item"
              >
                <span style="text-transform: capitalize">{{ v.title }}</span>
                {{ v.start }} - {{ v.end }}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, computed, reactive } from "vue";

import {
  getDayName,
  getMonthName,
  firstLastDate,
  doubleNumber,
  getDateDetail,
  firstWeekData,
  isToday,
  isCurrentMonth,
  YYYYMMDD,
  search,
} from "./_functions";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  setup(props, context) {
    const now = new Date();
    const props_data = computed(() => props.data);
    const props_width = computed(() => props.width);
    const childEleWidth = computed(() => {
      const divided = customWidthHeight / 7;
      return divided - 5;
    });
    const selectedMonth = reactive({ value: firstLastDate(now).start.date });
    const monthName = computed(() => getMonthName(selectedMonth.value));
    const data = ref(firstLastDate(now));
    const firstWeek = computed(() => firstWeekData(data.value));
    const days = ref(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    const selectedMonthNumber = computed(
      () => getMonthName(selectedMonth.value).value
    );
    const tableWidth = ref("");
    const customWidthHeight = ref("");
    onMounted(() => {
      const tbl_ = document.getElementById("tbl");
      if (tbl_.offsetWidth > 600) {
        tableWidth.value = "more";
      } else {
        tableWidth.value = "less";
      }
      customWidthHeight.value = document.getElementById("tbl").offsetHeight;
      window.addEventListener("resize", (e) => {
        const tbl = document.getElementById("tbl");
        const _height = tbl.offsetHeight;
        customWidthHeight.value = document.getElementById("tbl").offsetHeight;

        console.log(document.getElementById("tbl").offsetHeight);
      });
    });

    const parent = (e) => {
      const { date, dayName, day, month, weekday, year, id, type } =
        e.target.dataset;
      const obj = { type, date, dayName, day, month, weekday, year, id };
      alert("type => " + type + ", date => " + date);
      return obj;
    };

    const childHandler = (e) => {
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
      alert("Child Element Clicked!");
    };

    const previous = () => {
      const _date = new Date(selectedMonth.value);
      _date.setDate(1);
      _date.setMonth(_date.getMonth() - 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    const next = () => {
      const _date = new Date(selectedMonth.value);
      _date.setDate(1);
      _date.setMonth(_date.getMonth() + 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    const today = () => {
      const _date = new Date();
      _date.setDate(1);
      _date.setMonth(_date.getMonth());
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };
    return {
      data,
      days,
      getDateDetail,
      firstWeek,
      isToday,
      isCurrentMonth,
      selectedMonth,
      getMonthName,
      monthName,
      previous,
      next,
      selectedMonthNumber,
      today,
      props_data,
      search,
      childHandler,
      props_width,
      tableWidth,
      parent,
      customWidthHeight,
      childEleWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  position: relative;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  .calendar-box {
    position: relative;
    padding: 4.7px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.3px solid gray;
  }
  .head {
    text-align: center;
    background: #464646;
    color: #fff;
    height: 50px !important;
  }
}
.today-true .content {
  background: #f37021;
}
.today-false .content {
  background: #1a73e8;
}
.is-current-month-false {
  background: rgb(224, 224, 224);
}
#tbl,
#tbl thead,
#tbl tbody,
#tbl tbody tr td {
  border: 1px solid rgb(221, 221, 221);
}
.cut-text {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 130px;
  height: 1.2em;
  white-space: nowrap;
}
#tbl {
  position: relative;
  max-width: 100%;

  // height: calc(100vh - 16px);
  border-collapse: collapse;

  tr {
    position: relative;
    height: 80px;
    .cal-date-box {
      .date {
        .content {
          color: #fff;
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    th {
      position: relative;
      padding: 10px;
      width: 14.2857142857%;
      background: #464646;
      height: 60px;
      color: #fff;
    }
    .main-date {
      position: relative;
      height: 100%;
      display: grid;
      .date {
        position: relative;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        padding-top: 10px;
      }
      .data {
        position: relative;
        padding: 2.5px;
        width: calc(100% - 5px);
        height: 45px;
        .item {
          font-size: 12px;
          padding: 2px;
          transition: 0.4s ease-in-out;
          cursor: pointer;
          &:hover {
            background: #f3702120;
          }
        }
      }
    }
    .table-size-less {
      position: relative;
      .data {
        display: none;
      }
    }
    .table-size-more {
      position: relative;
    }
  }
}
</style>
