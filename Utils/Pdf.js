import puppeteer from "puppeteer";
import hbs from "hbs";
import fs from "fs";
import path from "path";

const PrintPdfGenerate = async (details) => {
  try {
    const htmlFileName = "qrcode.hbs";
    const filename = `${details?.id}_print_qr_code.pdf`;
    const folderName = "qrcode_pdf";
    const outputPath = path.join("public", "upload", folderName);

    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const compileTemplate = async (templateName, data) => {
      const filepath = path.join(process.cwd(), "view", templateName);
      const templateContent = fs.readFileSync(filepath, "utf8");
      return hbs.compile(templateContent)(data);
    };

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });

    // const page = await browser.newPage();
    let browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    let page = await browser.newPage();
    const content = await compileTemplate(htmlFileName, { details });

    await page.setContent(content);
    await page.emulateMediaType("screen");

    // Set custom width and height for 80mm x 80mm
    await page.pdf({
      path: path.join(outputPath, filename),
      width: "50.1mm",
      height: "30.4mm",

      printBackground: true,
    });

    await browser.close();

    const newurl = `${process.env.URL}public/upload/${folderName}/${filename}`;
    return newurl;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

const PrintImageGenerate = async (details) => {
  console.log("pdf details => ", details);
  try {
    const htmlFileName = "qrcode.hbs";
    const filename = `${details?.full_name}_${details?.guest_id}.png`;
    const folderName = "qrcode_images";
    const outputPath = path.join("public", "upload", folderName);

    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const compileTemplate = async (templateName, data) => {
      const filepath = path.join(process.cwd(), "view", templateName);
      const templateContent = fs.readFileSync(filepath, "utf8");
      return hbs.compile(templateContent)(data);
    };

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const content = await compileTemplate(htmlFileName, { details });

    await page.setContent(content);
    await page.emulateMediaType("screen");

    // Set the viewport size to ensure proper rendering of the content
    await page.setViewport({
      width: 189, // 80mm in pixels (approx 300 pixels for standard resolution)
      height: 113,

      deviceScaleFactor: 1, // for higher resolution
    });

    // Take a screenshot of the content
    await page.screenshot({
      path: path.join(outputPath, filename),
      fullPage: true,
      omitBackground: true, // to handle transparent background
    });

    await browser.close();

    const newurl = `${process.env.URL}public/upload/${folderName}/${filename}`;
    return newurl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
const PrintImageGenerateForEmail = async (details) => {
  try {
    const htmlFileName = "qrcode_email.hbs";
    const filename = `${details?.full_name}_${details?.guest_id}.png`;
    const folderName = "qrcode_images";
    const outputPath = path.join("public", "upload", folderName);

    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const compileTemplate = async (templateName, data) => {
      const filepath = path.join(process.cwd(), "view", templateName);
      const templateContent = fs.readFileSync(filepath, "utf8");
      return hbs.compile(templateContent)(data);
    };

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const content = await compileTemplate(htmlFileName, { details });

    await page.setContent(content);
    await page.emulateMediaType("screen");

    // Set the viewport size to ensure proper rendering of the content
    const viewportWidth = 300; // Increase the width for better clarity
    const viewportHeight = 300; // Increase the height for better clarity
    const deviceScaleFactor = 2;

    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: deviceScaleFactor,
    });

    // Take a screenshot of the content
    await page.screenshot({
      path: path.join(outputPath, filename),
      fullPage: true,
      omitBackground: true, // to handle transparent background
    });

    await browser.close();

    const newurl = `${process.env.URL}public/upload/${folderName}/${filename}`;
    console.log("print qr => ", newurl);
    return newurl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export { PrintImageGenerate, PrintPdfGenerate, PrintImageGenerateForEmail };
