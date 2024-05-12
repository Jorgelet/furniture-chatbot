import process from "node:process";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

process.loadEnvFile();

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ] 
})

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
await doc.loadInfo();

const sheet = doc.sheetsByIndex[0];
const clientSheet = doc.sheetsByIndex[1];
const rows = await sheet.getRows();

const phoneNumbers: string[] = [];
for(const row of rows) {
  phoneNumbers.push(row.get('Numeros'));
}

async function addClient(Nombre:string, Direccion:string, Email:string, Cedula:string) {
  await clientSheet.addRow({ Nombre, Direccion, Email, Cedula });
}

export { phoneNumbers, addClient } 