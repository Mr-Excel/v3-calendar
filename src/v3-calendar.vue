<template>
  <div
    ref="calendarMain"
    class="ar-calendar"
    :style="`width: ${propsWidth}; height: ${
      Number(propsWidthNumbers) > 600 ? '100%' : propsWidth
    };`"
  >
    <div class="panel" style="height: 35px">
      <div class="actions">
        <button class="btn prev" @click="previousYear">
          <div class="icon" v-html="i_forward"></div>
        </button>
        <button class="btn today" @click="previous">
          <div class="icon" v-html="i_prev"></div>
        </button>
        <button
          class="btn today"
          @click="today"
          style="top: -6px; padding: 9px"
        >
          Today
        </button>
        <button class="btn" @click="next">
          <div class="icon" v-html="i_next"></div>
        </button>
        <button class="btn next" @click="nextYear">
          <div class="icon" v-html="i_backward"></div>
        </button>
      </div>
      <div class="titles">
        {{ getMonthName(selectedMonth.value).full }}
        <strong style="margin-left: 10px">
          {{ getMonthName(selectedMonth.value).year }}
        </strong>
      </div>
    </div>

    <table id="tbl" ref="tblRef" style="width: 100%">
      <thead>
        <tr :style="{ height: widthDivision.head + 'px' }">
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
        <tr
          v-for="(v, i) in weekWiseData"
          :style="{ height: widthDivision.row + 'px' }"
        >
          <td
            v-for="(v_, i_) in v"
            :class="`ripple cal-date-box ${
              dateSearch(dateSelection.dates, v_) ? 'selected-date' : ''
            } 
            ${dateSearchBetween(range, v_) ? 'selected-date' : ''}
            table-size-${tableWidth} today-${isToday(
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
                  <div
                    class="counts"
                    v-if="search(propsData, v_).length > 0"
                  ></div>
                  <!-- .selected-date -->
                  {{ getDateDetail(v_).value }}
                </div>
              </div>
              <div
                class="data"
                data-type="data"
                ref="cutRef"
                v-if="propsData.length > 0"
              >
                <div
                  v-if="search(propsData, v_).length > 0"
                  v-for="(v, i) in search(propsData, v_)"
                  :key="i"
                  :data-id="v.id"
                  :data-title="v.title"
                  :data-start="v.start"
                  :data-end="v.end"
                  :data-date="v.date"
                  :style="{ width: cutText + 'px' }"
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
import { i_next, i_prev, i_forward, i_backward } from "./svg.js";
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
  dateSearch,
  dateSearchBetween,
} from "./_functions";

export default {
  props: {
    type: {
      type: String,
      default: "events",
    },
    selection: {
      type: String,
      default: "single", // single | multi | range
    },
    data: {
      type: Array,
      default: [],
    },
    width: {
      type: String,
      default: "100%",
    },
    backgroundColor: {
      type: String,
      default: "#e0e0e0",
    },
    dateColor: {
      type: String,
      default: "#1a73e8",
    },
    todayColor: {
      type: String,
      default: "#f37021",
    },
    headerColor: {
      type: String,
      default: "#464646",
    },
  },

  setup(props, context) {
    // Colors
    const type = computed(() => props.type);
    const selection = computed(() => props.selection);
    const propsColorBg = computed(() => props.backgroundColor);
    const propsColorDate = computed(() => props.dateColor);
    const propsColorToday = computed(() => props.todayColor);
    const propsColorHeader = computed(() => props.headerColor);
    const range = reactive({
      firstDate: {
        selected: false,
        date: "",
      },
      lastDate: {
        selected: false,
        date: "",
      },
    });
    const dateSelection = reactive({
      counts: 0,
      dates: [],
    });

    // Computed Variables
    const propsData = computed(() =>
      props.type === "events" ? props.data : []
    );
    const propsWidth = computed(() =>
      props.type === "events" ? props.width : "400px"
    );
    const propsWidthNumbers = computed(() => {
      const len = props.width.length;
      let width = "";
      if (len == 5) {
        width = props.width.substr(0, 3);
      } else if (len == 6) {
        width = props.width.substr(0, 4);
      } else if (len == 3) {
        width = props.width.substr(0, 1);
      } else if (len == 4) {
        width = props.width.substr(0, 2);
      }
      return width;
    });
    const weekWiseData = computed(() => firstWeekData(data.value)); // All Weeks Data

    // Simple Variables
    const now = new Date(); // Today Date Time

    // Ref Variables
    const tblRef = ref(null); // Table Reference
    const calendarMain = ref(null);
    const customWidthHeight = ref(""); // Custom Width
    const data = ref(firstLastDate(now));
    const tableWidth = ref(""); // table Width
    const selectedDate = ref([]);
    const cardShow = ref("");
    const widthDivision = ref({});
    const cutText = ref("");
    // Reactive Variables
    const selectedMonth = reactive({ value: firstLastDate(now).start.date }); // Current Selected Month

    onMounted(() => {
      const tbl = tblRef.value; // getting table
      const element = tbl.childNodes[1].childNodes[1].childNodes[1];
      tableWidth.value = tbl.offsetWidth > 600 ? "more" : "less"; // Checking size of table
      customWidthHeight.value = tbl.offsetHeight;
      cutText.value = widthCalc(element);

      calendarMain.value.style.setProperty("--background", propsColorBg.value);
      calendarMain.value.style.setProperty("--date", propsColorDate.value);
      calendarMain.value.style.setProperty("--today", propsColorToday.value);
      calendarMain.value.style.setProperty("--header", propsColorHeader.value);
      calendarMain.value.style.setProperty(
        "--header-light",
        propsColorHeader.value + "50"
      );
      calendarMain.value.style.setProperty(
        "--today-light",
        propsColorToday.value + "50"
      );
      calendarMain.value.style.setProperty(
        "--date-light",
        propsColorDate.value + "50"
      );
      calendarMain.value.style.setProperty(
        "--background-light",
        propsColorBg.value + "50"
      );

      const width = tbl.offsetWidth - 35;
      if (tbl.offsetWidth < 600) {
        widthDivision.value = {
          head: 0.17 * width,
          row: 0.138333333333 * width,
        };
      }
      // on resize event handler
      window.addEventListener("resize", (e) => {
        tableWidth.value = tbl.offsetWidth > 600 ? "more" : "less";
        customWidthHeight.value = tbl.offsetHeight;
        cutText.value = widthCalc(element);
        if (tbl.offsetWidth < 600) {
          widthDivision.value = {
            head: 0.17 * width,
            row: 0.138333333333 * width,
          };
        }
      });
    });

    const widthCalc = (element) => {
      const style = element.currentStyle || window.getComputedStyle(element),
        width_ = element.offsetWidth, // or use style.width
        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
        padding =
          parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        border =
          parseFloat(style.borderLeftWidth) +
          parseFloat(style.borderRightWidth);
      return width_ + margin - padding + border;
    };

    const forEvents = (e) => {
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
        _item = Object.assign({}, e.target.dataset);
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
      obj.selected = _item;
      selectedDate.value = obj;
      context.emit("onClick", obj);
    };

    const forMulti = (parent_) => {
      const classExist = parent_.classList.contains("selected-first");
      const dateExist = dateSelection.dates.indexOf(parent_.dataset.date);
      if (!classExist && dateExist == -1) {
        dateSelection.counts = 1;
        dateSelection.dates.push(parent_.dataset.date);
        context.emit("onClick", dateSelection);
      } else {
        context.emit("onClick", dateSelection);
        dateSelection.dates.splice(dateExist, 1);
      }
    };

    const forSingle = (parent_) => {
      const classExist = parent_.classList.contains("selected-first");
      const dateExist = dateSelection.dates[0] === parent_.dataset.date;
      if (!classExist && !dateExist) {
        dateSelection.counts = 1;
        dateSelection.dates = [parent_.dataset.date];
        context.emit("onClick", dateSelection);
      } else {
        context.emit("onClick", dateSelection);
        dateSelection.dates = [];
      }
    };

    const forRange = (parent_) => {
      const classExist = parent_.classList.contains("selected-first");
      const fd = new Date(range.firstDate.date);
      const ed = new Date(parent_.dataset.date);

      if (range.firstDate.selected && range.lastDate.selected) {
        range.firstDate.selected = false;
        range.lastDate.selected = false;
        range.firstDate.date = "";
        range.lastDate.date = "";
      }

      if (!range.firstDate.selected) {
        range.firstDate.selected = true;
        range.firstDate.date = parent_.dataset.date;
      } else if (!range.lastDate.selected && fd <= ed) {
        range.lastDate.selected = true;
        range.lastDate.date = parent_.dataset.date;
        context.emit("onClick", range);
      }
    };

    const forDatePicker = (e) => {
      const tgt = e.target.dataset;
      let parent_ = "";
      if (tgt.type === "date-parent") {
        parent_ = e.target.parentElement.parentElement;
      } else if (tgt.type === "date") {
        parent_ = e.target.parentElement.parentElement.parentElement;
      } else if (tgt.type === "main-div") {
        parent_ = e.target.parentElement;
      } else {
        parent_ = e.target;
      }
      if (selection.value === "multi") {
        forMulti(parent_);
      } else if (selection.value === "single") {
        forSingle(parent_);
      } else if (selection.value === "range") {
        forRange(parent_);
      }
    };
    // on date click event
    const parent = (e) => {
      if (type.value === "events") {
        forEvents(e);
      } else if (type.value === "date-picker") {
        forDatePicker(e);
      }
    };

    // Select previous Month
    const previous = () => {
      const _date = new Date(selectedMonth.value);
      _date.setDate(1);
      _date.setMonth(_date.getMonth() - 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    // Select previous Year
    const previousYear = () => {
      const _date = new Date(selectedMonth.value);
      const yy = _date.getFullYear();
      _date.setFullYear(yy - 1);
      data.value = firstLastDate(_date);
      selectedMonth.value = firstLastDate(_date).start.date;
    };

    // Select next year
    const nextYear = () => {
      const _date = new Date(selectedMonth.value);
      const yy = _date.getFullYear();
      _date.setFullYear(yy + 1);
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
      type,
      tblRef,
      calendarMain,
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
      widthDivision,
      cutText,
      propsWidthNumbers,
      dateSelection,
      range,

      // Imported Functions
      getDateDetail,
      getMonthName,
      search,
      dateSearch,
      dateSearchBetween,

      // Created Functions
      previous,
      next,
      today,
      parent,
      previousYear,
      nextYear,

      // icons
      i_next,
      i_prev,
      i_forward,
      i_backward,
    };
  },
};
</script>

<style scoped>
.selected-first,
.selected-date {
  background: var(--date) !important;
}
.selected-first .content,
.selected-date .content {
  background: #fff !important;
  color: var(--date) !important;
}
.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}
.ripple:active:after {
  transform: scale(0, 0);
  opacity: 0.2;
  transition: 0s;
}
.calendar {
  position: relative;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
}
.calendar .calendar-box {
  position: relative;
  padding: 4.7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.3px solid gray;
}
.calendar .head {
  text-align: center;
  background: var(--header);
  color: #fff;
  height: 50px !important;
}
.today-true .content {
  background: var(--today);
}
.today-false .content {
  background: var(--date);
}
.is-current-month-false {
  background: var(--background);
}
#tbl,
#tbl thead,
#tbl tbody,
#tbl tbody tr td {
  border: 1px solid #ddd;
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
  border-collapse: collapse;
}
#tbl tr {
  position: relative;
  height: 80px;
}
#tbl tr .cal-date-box .date .content {
  color: #fff;
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#tbl tr th {
  position: relative;
  padding: 10px;
  width: 14.2857142857%;
  background: var(--header);
  /* height: 60px; */
  color: #fff;
}
#tbl tr td {
  padding: 10px 5px;
  width: calc(100% - 10px);
}
#tbl tr .main-date {
  position: relative;
  height: 100%;
  display: grid;
}
#tbl tr .main-date .date {
  position: relative;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  /* padding-top: 10px; */
}
#tbl tr .main-date .data {
  position: relative;
  padding: 2.5px;
  width: calc(100% - 5px);
  height: 45px;
}
#tbl tr .main-date .data .item {
  font-size: 12px;
  padding: 2px;
  transition: 0.4s ease-in-out;
  cursor: pointer;
}
#tbl tr .main-date .data .item:hover {
  background: var(--date-light);
}
#tbl tr .table-size-less {
  position: relative;
}
#tbl tr .table-size-less .data {
  display: none;
}
#tbl tr .table-size-more {
  position: relative;
}
.ar-calendar {
  position: relative;
}
.ar-calendar .panel {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.ar-calendar .panel .titles {
  position: relative;
  background: var(--today);
  color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-right: 10px;
  padding-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ar-calendar .panel .actions .btn {
  position: relative;
  background: var(--date);
  color: #fff;
  border: none;
  padding: 3px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ar-calendar .panel .actions .btn:hover {
  background: #f37021;
}
.ar-calendar .panel .actions .btn.next {
  border-top-right-radius: 5px;
}
.ar-calendar .panel .actions .btn.prev {
  border-top-left-radius: 5px;
}
.ar-calendar .panel .actions .btn.today {
  position: relative;
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
}
.ar-button.primary {
  background: var(--today);
}
.ar-button.primary:hover {
  background: var(--today-light);
}
.ar-button.primary:active {
  background: var(--today);
}
.ar-button.secondary {
  background: var(--header);
}
.ar-button.secondary:hover {
  background: var(--header-light);
}
.ar-button.secondary:active {
  background: var(--header);
}
.date .content .counts {
  position: absolute;
  background: red;
  color: #fff;
  border-radius: 50%;
  top: -3px;
  right: -3px;
  padding: 1.5px;
  text-align: center;
  width: 10px;
  height: 10px;
}
</style>
