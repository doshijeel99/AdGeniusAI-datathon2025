import React, { useState, useRef, useEffect } from 'react';
import BarChart from './Charts/BarChart';
import * as XLSX from 'xlsx';
import { IoCloseSharp } from 'react-icons/io5';

interface RowData {
  row1: string;
  row2: string;
}

interface ExcelProps {
  expanded?: boolean;
}

const Visualisation: React.FC<ExcelProps> = ({ expanded = false }) => {
  const [inputarr, setInputarr] = useState<RowData[]>([]);
  const [chart, setChart] = useState<string | null>(null);
  const [row, setRow] = useState<RowData>({ row1: '', row2: '' });
  const [modalState, setModalState] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert Excel data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map the data to match RowData interface
        const formattedData: RowData[] = jsonData.map((row: any) => ({
          row1: Object.values(row)[0]?.toString() || '',
          row2: Object.values(row)[1]?.toString() || ''
        }));

        setInputarr(formattedData);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please make sure it\'s a valid Excel file.');
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsBinaryString(file);
  };

  const handleManualAdd = (): void => {
    if (!row.row1 || !row.row2) return;
    setInputarr(prevArr => [...prevArr, { row1: row.row1, row2: row.row2 }]);
    setRow({ row1: '', row2: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRow(prevRow => ({ ...prevRow, [name]: value }));
  };

  const downloadSheet = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(inputarr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const navigateChart = (): void => {
    if (inputarr.length === 0) {
      alert('Please add some data first');
      return;
    }
    setChart("BarChart");
    setModalState(true);
  };

  const closeModal = (): void => setModalState(false);

  return (
    <div className="top-0 px-10 py-12">
      <div className='w-auto rounded-xl p-7 flex flex-col'>
        <h1 className='py-2 text-2xl'>Data Visualisation</h1>
        
        {/* File Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg mb-4">Upload Excel File</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary border border-slate-700 text-gray-800 bg-white hover:text-orange-300"
            >
              Choose File
            </button>
            <span className="text-sm">{fileName || 'No file chosen'}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg mb-4">Or Add Data Manually</h2>
          <input
            className='border-2 rounded p-2 mx-2 mt-4 focus:border-2 focus:border-blue-500 bg-inherit input-bordered w-full max-w-xs'
            type="text"
            name="row1"
            value={row.row1}
            onChange={handleChange}
            placeholder='Name'
          />
          <br /><br />
          <input
            className='border-2 rounded p-2 mx-2 focus:border-2 focus:border-blue-500 bg-inherit input-bordered w-full max-w-xs'
            type="text"
            name="row2"
            value={row.row2}
            onChange={handleChange}
            placeholder='Value'
          />
          <br /><br />
          <button 
            className='rounded-lg w-52 btn btn-block btn-sm mt-2 border border-slate-700 text-gray-800 bg-white hover:text-orange-300 border-none px-10 py-3' 
            onClick={handleManualAdd}
          >
            Add
          </button>
        </div>

        <div className="flex gap-4">
          <button 
            className="rounded-lg w-52 btn btn-block btn-sm mt-2 border border-slate-700 text-gray-800 bg-white hover:text-orange-300 border-none px-10 py-3" 
            onClick={navigateChart}
          >
            Visualize Data
          </button>
          <button 
            className="rounded-lg w-52 btn btn-block btn-sm mt-2 border border-slate-700 text-gray-800 bg-white hover:text-orange-300 border-none px-10 py-3" 
            onClick={downloadSheet}
          >
            Download Sheet
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className='w-full h-full flex justify-between items-center'>
        <div className="p-4 w-full">
          <h1 className="text-center py-4 text-2xl">Data</h1>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {inputarr.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.row1}</td>
                  <td className="border p-2">{item.row2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Modal */}
        {modalState && (
          <div className="modal bg-slate-800 h-screen w-screen fixed inset-0 bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center">
            <div className='size-4/5'>
              <button className="absolute top-4 left-[95%]" onClick={closeModal}>
                <IoCloseSharp className="h-10 w-10 text-black hover:text-red-700" />
              </button>
              {chart === 'BarChart' && <BarChart inputarr={inputarr.length > 0 ? inputarr : null} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualisation;