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

const doc = new GoogleSpreadsheet('15rf6Q-wZ7ZWrBeuhHDw9o7yQ4_5M_8hctNHN9KWw-_U', serviceAccountAuth);
await doc.loadInfo();

const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
const clientSheet = doc.sheetsByIndex[1];
const rows = await sheet.getRows(); // can pass in { limit, offset }

export const phoneNumbers: string[] = [];

for(const row of rows) {
  phoneNumbers.push(row.get('Numeros'));
}

export async function addClient(Nombre:string, Telefono:string, Direccion:string, Producto:string) {
  await clientSheet.addRow({ Nombre, Telefono, Direccion, Producto });
}