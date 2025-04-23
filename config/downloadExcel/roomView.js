import ExcelJS from "exceljs";
import fs from "fs/promises";
import moment from "moment-timezone";
import { getCustomDateTime } from "../../Utils/DateFormat.js";
const GenerateRoomViewReport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(` ${data[0]?.room_no} Reports`);
  const columns = [
    { header: "SESSION NAME", key: "session_name", width: 40 },
    { header: "SESSION DESCRIPTION", key: "session_description", width: 25 },
    { header: "FULL NAME", key: "full_name", width: 25 },
    // { header: "LAST NAME", key: "last_name", width: 25 },
    { header: "DATE", key: "date", width: 20 },
    { header: "IN", key: "entry_in_time", width: 20 },
  ];

  worksheet.columns = columns;
  worksheet.getColumn("session_description").alignment = { wrapText: true };
  // worksheet.getColumn("session_name").alignment = { wrapText: true };
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  data?.forEach((item) => {
    item.session?.forEach((sessionItem) => {
      sessionItem?.logs?.forEach((log) => {
        const rowData = {
          session_name: sessionItem?.session_name,
          session_description: sessionItem?.session_description,
          full_name: `${log?.guest_id?.full_name}`,
          // last_name: `${log?.guest_id?.last_name}`,
          entry_in_time: log?.entry_in_time
            ? moment(log?.entry_in_time).tz("Asia/Kolkata").format("h:mm:ss a")
            : "-",
          date: log?.entry_in_time
            ? getCustomDateTime(log?.entry_in_time, "days", "MMMM DD, YYYY", 0)
            : "-",
        };
        worksheet.addRow(rowData);
      });
    });
  });

  const filePath = `public/reports/RoomViewExcel/${data[0]?.room_no} Reports.xlsx`;

  await workbook.xlsx.writeFile(filePath);

  const timestamp = new Date().getTime();
  const downloadFileName = `${data[0]?.room_no}-${timestamp}.xlsx`;

  const destinationPath = `public/reports/RoomViewExcel/${downloadFileName}`;
  await fs.rename(filePath, destinationPath);

  const downloadLink = `${process.env.URL}${destinationPath}`;

  return downloadLink;
};

export { GenerateRoomViewReport };
