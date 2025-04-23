import moment from "moment";
export const getCustomDateTime = (dateString, unit = "days", format = "HH:mm a | MMMM DD, YYYY", value = 0) => {
    if (value !== 0) {
      return moment().format(format);
    } else {
      return moment(dateString).add(value, unit).format(format);
    }
  };