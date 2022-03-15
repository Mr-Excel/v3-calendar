# Vue 3 Calendar

`( Date Picker / Meeting or Event Scheduler )`

Compatible only with Vue 3

## Install

```bash
npm i v3-calendar
```

## Use

```javascript
import VueCalendar from "v3-calendar";
```

```html
<v3-calendar
  width="800px"
  type="events"
  @onClick="selectionOutput"
  :data="eventData"
/>
```

```javascript
import { reactive } from "vue";
import V3Calendar from "@/v3-calendar.vue";

export default {
  name: "Calendar",
  components: {
    V3Calendar,
  },
  setup() {
    const eventData = reactive([
      { id: 1, title: "test", date: "2022-03-12" },
      { id: 2, title: "test # 2", date: "2022-03-12" },
    ]);
    const selectionOutput = (v) => {
      console.log(v); // onclick date or event you will get value in "v"
    };
    return {
      eventData,
      selectionOutput,
    };
  },
};
```

## Features

- Easy to use
- Responsive
- DatePicker (Single / Mutli Selection / Date Range)
- Meeting Scheduler ( Event / Meeting Handling )

## Properties

- type
  - Type: **String**
  - Values: **events** _(default)_ | **date-picker**
- selection
  - Type: **String**
  - Values: **single** _(default)_ | **multi** | **range**
- data

  - Type: **Array**
  - Values:

  ```json
  [
    {
      "id": 1, // Required
      "start": "09:00",
      "end": "13:00",
      "date": "2022-03-10", // Required
      "title": "Testing Event" // Required
    }
  ]
  ```

- width
  - Type: **String**
  - Values: `values with px, em and % prefixes allowed ` **100%** is by _(default)_

## Custom Color Properties

`you can write color names / codes / rgb / rgba`

- backgroundColor
- Type: **String**
- Values: **#e0e0e0%** is by _(default)_
- dateColor
  - Type: **String**
  - Values: **#1a73e8%** is by _(default)_
- todayColor
  - Type: **String**
  - Values: **#f37021%** is by _(default)_
- headerColor
  - Type: **String**
  - Values: **#464646%** is by _(default)_

## Event

**onClick**
