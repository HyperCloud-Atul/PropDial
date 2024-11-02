import React, { useState } from "react";
import * as XLSX from "xlsx";

class ImportExcel extends React.Component {

    //  const { addDocument, error } = useFirestore("test-propdial");

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            file: "",
        };
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    filePathset(e) {
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        console.log(file);
        this.setState({ file });

        console.log(this.state.file);
    }

    readFile() {
        console.log('in readfile');
        var f = this.state.file;
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            this.convertToJson(data)
            /* Update state */
            // console.log("Data>>>" + data);// shows that excel data is read
            // console.log(this.convertToJson(data)); // shows data in json format
        };
        reader.readAsBinaryString(f);
    }

    convertToJson(csv) {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        console.log("results: ", result)
        this.props.setJSON(result);
        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }

    render() {
        return (
            <div>
                <input
                    type="file"
                    id="file"
                    ref="fileUploader"

                    onChange={this.filePathset.bind(this)}
                />


                <div
                    style={{
                        background: '#348DCB',
                        padding: '5px 30px',
                        color: '#fff',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        width: '300px'
                    }} onClick={() => {
                        this.readFile();
                    }}>Import into Database Collection</div>

                {/* <button
                    
                >
                    
                </button> */}
            </div>
        );
    }
}
export default ImportExcel;