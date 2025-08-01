import { useState } from 'react'
// import { async } from '@firebase/util';
import * as FileSaver from 'file-saver'
// import { Button, Tooltip } from 'react-bootstrap';
import XLSX from 'sheetjs-style'

export const useExcelImport = () => {

    const [isCompleted, setIsCompleted] = useState(false)
    // const [error, setError] = useState(null)


    const exportExcel = async (excelData, fileName) => {
        console.log('excelData ', excelData, ' :: fileName : ', fileName);
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
        setIsCompleted(true);

    }

    return { exportExcel, isCompleted }
}
