<template>
  <div class="ar-calendar" :style="{ width: propsWidth }">
    <div class="panel">
      <div class="actions">
        <button class="btn prev" @click="previous">Previous</button>
        <button class="btn today" @click="today">Today</button>
        <button class="btn next" @click="next">Next</button>
      </div>
      <div class="titles">
        {{ getMonthName(selectedMonth.value).full }}
        <strong style="margin-left: 10px">
          {{ getMonthName(selectedMonth.value).year }}
        </strong>
      </div>
    </div>
    <div class="ar-card" v-if="cardShow">
      <div class="card">
        <div class="body">
          <div class="items" v-if="selectedDate.items.length == 0">
            No Record Found
          </div>
          <div
            class="items"
            v-for="(v, i) in selectedDate.items"
            :key="i"
            @click="eventName(v)"
          >
            {{ v.title }}
          </div>
        </div>
        <div class="bottom">
          <button class="ar-button secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
    <table id="tbl" ref="tblRef" style="width: 100%">
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
        <tr v-for="(v, i) in weekWiseData">
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
                  v-if="search(propsData, v_).length > 0"
                  v-for="(v, i) in search(propsData, v_)"
                  :key="i"
                  :data-id="v.id"
                  :data-title="v.title"
                  :data-start="v.start"
                  :data-end="v.end"
                  :data-date="v.date"
                  :style="{ width: customWidthHeight / 7 - 4 + 'px' }"
                  class="item cut-text"
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
  </div>
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
    // Computed Variables
    const propsData = computed(() => props.data);
    const propsWidth = computed(() => props.width);
    const weekWiseData = computed(() => firstWeekData(data.value)); // All Weeks Data

    // Simple Variables
    const now = new Date(); // Today Date Time

    // Ref Variables
    const tblRef = ref(null); // Table Reference
    const customWidthHeight = ref(""); // Custom Width
    const data = ref(firstLastDate(now));
    const tableWidth = ref(""); // table Width
    const selectedDate = ref("");
    const cardShow = ref("");

    // Reactive Variables
    const selectedMonth = reactive({ value: firstLastDate(now).start.date }); // Current Selected Month

    onMounted(() => {
      const tbl = tblRef.value; // getting table
      tableWidth.value = tbl.offsetWidth > 600 ? "more" : "less"; // Checking size of table
      customWidthHeight.value = tbl.offsetHeight;
      // on resize event handler
      window.addEventListener("resize", (e) => {
        tableWidth.value = tbl.offsetWidth > 600 ? "more" : "less";
        customWidthHeight.value = tbl.offsetHeight;
      });
    });

    const close = () => {
      cardShow.value = false;
      selectedDate.value = "";
    };
    // on date click event
    const parent = (e) => {
      const type = e.target.dataset.type;
      let _parentData = "";
      if (type === "date" || type === "item") {
        _parentData =
          e.target.parentElement.parentElement.parentElement.dataset;
      } else if (type === "date-parent" || type === "data") {
        _parentData = e.target.parentElement.parentElement.dataset;
      } else if (type === "main-date") {
        _parentData = e.target.parentElement.dataset;
      } else {
        _parentData = e.target.dataset;
      }
      let _item = "";
      if (type === "item") {
        _item = e.target.dataset;
      }
      const obj = {
        parent: {
          date: _parentData.date,
          day: _parentData.day,
          dayName: _parentData.dayName,
          month: _parentData.month,
          type: _parentData.type,
          weekDay: _parentData.weekDay,
          year: _parentData.year,
        },
      };
      cardShow.value = true;
      const filtered = search(propsData.value, obj.parent.date);
      obj.items = filtered;
      selectedDate.value = obj;
      return obj;
    };

    // Event Selection
    const eventName = (data) => {
      console.log(data);
    };
    // Select previous Month
    const previous = () => {
      const _date = new Date(selectedMonth.value);
      _date.setDate(1);
      _date.setMonth(_date.getMonth() - 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    // Select Next Month
    const next = () => {
      const _date = new Date(selectedMonth.value);
      _date.setDate(1);
      _date.setMonth(_date.getMonth() + 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    // Select Current Month
    const today = () => {
      const _date = new Date();
      _date.setDate(1);
      _date.setMonth(_date.getMonth());
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    return {
      // Variables
      tblRef,
      weekWiseData,
      isToday,
      isCurrentMonth,
      selectedMonth,
      propsData,
      propsWidth,
      tableWidth,
      customWidthHeight,
      selectedDate,
      cardShow,
      // Imported Functions
      getDateDetail,
      getMonthName,
      search,
      // Created Functions
      previous,
      next,
      today,
      parent,
      close,
      eventName,
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
.ar-calendar {
  position: relative;
  .panel {
    position: relative;
    display: flex;
    justify-content: space-between;
    .titles {
      position: relative;
      background: #464646;
      color: #fff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding-right: 10px;
      padding-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .actions {
      .btn {
        position: relative;
        background: #464646;
        color: #fff;
        border: none;
        padding: 10px;
        transition: 0.5s ease-in-out;
        cursor: pointer;
        &:hover {
          background: #f37021;
        }
        &.next {
          border-top-right-radius: 5px;
        }
        &.prev {
          border-top-left-radius: 5px;
        }
        &.today {
          position: relative;
        }
      }
    }
  }
  .ar-card {
    position: absolute;
    background: #46464650;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .card {
      position: relative;
      width: 250px;
      height: fit-content;
      background: #fff;
      display: grid;
      max-height: 300px;
      border-radius: 10px;
      .top {
        position: relative;
        height: 40px;
        padding: 5px;
        display: flex;
        justify-content: right;
        align-items: center;
      }
      .body {
        position: relative;
        overflow: auto;
        max-height: 200px;
        .items {
          position: relative;
          padding: 10px;
          width: calc(100% - 20px);
          text-transform: capitalize;
          font-style: italic;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          &:hover {
            background: #464646;
            color: #fff;
          }
        }
      }
      .bottom {
        position: relative;
        height: 40px;
        padding: 5px;
        display: flex;
        justify-content: right;
        align-items: center;
      }
    }
  }
}
.ar-button {
  position: relative;
  height: 35px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;

  &.primary {
    background: #f37021;
    &:hover {
      background: #f3702190;
    }
    &:active {
      background: #f37021;
    }
  }
  &.secondary {
    background: #464646;
    &:hover {
      background: #46464650;
    }
    &:active {
      background: #464646;
    }
  }
}
</style>
