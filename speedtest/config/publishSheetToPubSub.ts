import { google } from "googleapis";
import axios from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Decimal } from "decimal.js";

dotenv.config();

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];
const SPEEDCHECK_SEND_KEY = process.env.SPEEDCHECK_SEND_KEY;
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1yW0hZ6XMphRpjkUrNbG-sUrF5AQ-LfvX4JQ8-mbs9Eg";
const CREDENTIALS = JSON.parse(fs.readFileSync(SPEEDCHECK_SEND_KEY!, "utf8"));

const settings: Record<string, any> = {
  MW: {
    ID: "A4:A33",
    시간: "B4:B33",
    측정값: "G4:K33",
  },
  APP: {
    ID: "A35:A64",
    시간: "B35:B64",
    측정값: "G35:P64",
  },
  MW_div: "A",
  APP_div: "M",
};

async function getGoogleSheetData(sheetName: string, range: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_URL.split("/d/")[1].split("/")[0],
    range: `${sheetName}!${range}`,
  });
  return response.data.values || [];
}

async function main() {
  const today = new Date();
  const sheetName = `${today.getMonth() + 1}/${today.getDate()}`;
  console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

  let input: string = "APP"; // 사용자 입력 필요
  if (!["APP", "MW"].includes(input)) {
    console.log("APP/MW 둘 중 하나만 입력하세요:");
    return;
  }

  let data: any = { code: [], value: [], tested_at: [] };
  let formatData: any[] = [];

  for (const [key, keyCell] of Object.entries(
    settings[input] as Record<string, string>
  )) {
    const val = await getGoogleSheetData(sheetName, keyCell);
    const flattenedVal = val.flat();
    if (key === "ID") data.code = flattenedVal;
    else if (key === "시간") data.tested_at = flattenedVal;
    else if (key === "측정값") data.value = val;
  }

  for (let idx = 0; idx < data.code.length; idx++) {
    let avg = new Decimal(0);
    for (let val of data.value[idx]) {
      avg = avg.add(new Decimal(parseFloat(val)));
    }
    avg = avg
      .dividedBy(data.value[idx].length)
      .toDecimalPlaces(2, Decimal.ROUND_DOWN);

    const [year, time] = data.tested_at[idx].split(" ");
    const [y, m, d] = year.split("-").map(Number);
    const formattedDate = `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    const testedAt = `${formattedDate} ${time}`;

    formatData.push({ code: data.code[idx], value: avg, tested_at: testedAt });
  }

  console.log(formatData);

  const outputPath = path.join(process.cwd(), "test/output/결과.json");
  fs.writeFileSync(outputPath, JSON.stringify(formatData, null, 4), "utf8");

  console.log(
    "전송을 원할 시, 1을 눌러주세요 (미전송 종료: 0, 파라미터 수기 입력: 2)"
  );

  let userInput = "1"; // 사용자 입력 필요
  const url = "https://dcms.uhdcsre.com/dcms/qa";
  const date = today.toISOString().slice(0, 10).replace(/-/g, "");
  const div = input === "APP" ? settings.APP_div : settings.MW_div;

  if (userInput === "1") {
    await sendData(url, date, div, formatData);
  }
}

async function sendData(url: string, date: string, div: string, jsonData: any) {
  try {
    const response = await axios.post(url, jsonData, { params: { date, div } });
    console.log(
      response.status === 200 ? "전송 완료" : "전송 실패",
      response.data
    );
  } catch (error) {
    console.error("전송 오류:", error);
  }
}

main().catch(console.error);
