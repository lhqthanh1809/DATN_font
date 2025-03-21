import React from "react";
import { Text, View } from "react-native";
import { CalendarComponents, CalendarWeek } from "react-native-ui-datepicker";

interface CustomWeekdayProps {
  weekday: CalendarWeek;
}

const CustomWeekday: React.FC<CustomWeekdayProps> = ({ weekday }) => {
  return (
    <Text className="font-BeVietnamSemiBold text-lime-500">
      {weekday.name.short}
    </Text>
  );
};

const Calendar: CalendarComponents = {
  Weekday: (weekday: CalendarWeek) => <CustomWeekday weekday={weekday} />,
  // Các component khác...
};

export default Calendar;
