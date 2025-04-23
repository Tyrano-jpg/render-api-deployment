import ExcelJS from "exceljs";
import fs from "fs/promises";

import { getCustomDateTime } from "../../Utils/DateFormat.js";
import moment from "moment-timezone";
const GenerateGuestReport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Guest Reports");
  console.log("data got => ", data);
  const columns = [
    // { header: "REG-DATE", key: "registration_date", width: 20 },

    { header: "FULL NAME", key: "full_name", width: 30 },
    { header: "EMAIL ID", key: "email_id", width: 35 },
    { header: "DESIGNATION", key: "designation", width: 30 },
    { header: "CATEGORY", key: "category", width: 25 },
    { header: "COMPANY", key: "company_name", width: 30 },
    { header: "MOBILE NUMBER", key: "mobile_number", width: 30 },
    { header: "GST NUMBER", key: "gst_number", width: 15 },
    { header: "CHA LICENSE NUMBER", key: "cha_license_number", width: 15 },
    { header: "FOOD PREFERENCE", key: "food_preference", width: 15 },
    { header: "ATTEDANCE STATUS", key: "attendance_status", width: 20 },
    { header: "IN TIME", key: "in_time", width: 20 },
    { header: "REGISTRATION DATE", key: "registration_date", width: 15 },
  ];

  worksheet.columns = columns;
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  data.forEach((item) => {
    const rowData = {
      full_name: item?.full_name,
      category: item?.category ? item?.category : "-",
      email_id: item?.email_id,
      designation: item?.designation,
      mobile_number: item?.mobile_number,
      gst_number: item?.gst_number,
      cha_license_number: item?.cha_license_number,
      food_preference: item?.food_preference,
      company_name: item?.company_name,
      attendance_status: item?.attendance_status,
      in_time: item?.in_time
        ? moment(item?.in_time).tz("Asia/Kolkata").format("h:mm:ss a")
        : "-",
      registration_date: item?.registration_date
        ? new Date(item?.registration_date).toLocaleDateString()
        : "-",
    };

    worksheet.addRow(rowData);
  });

  const filePath = "public/reports/GuestExcel/guest.xlsx";

  await workbook.xlsx.writeFile(filePath);

  const timestamp = new Date().getTime();
  const downloadFileName = `Guest-${timestamp}.xlsx`;

  const destinationPath = `public/reports/GuestExcel/${downloadFileName}`;
  await fs.rename(filePath, destinationPath);

  const downloadLink = `${process.env.URL}${destinationPath}`;

  return downloadLink;
};

export { GenerateGuestReport };
