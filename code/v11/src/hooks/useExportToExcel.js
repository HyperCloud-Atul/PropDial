import { useState } from 'react'
import * as XLSX from 'xlsx';

export const useExportToExcel = (data, filename) => {

    const [response, setResponse] = useState(false)

    const exportToExcel = async (data, filename) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, filename);

            setResponse(true)
        }
        catch (ex) {
            console.log("Export File Error: ", ex)
            setResponse(false)
        }
    }

    return { exportToExcel, response }
}