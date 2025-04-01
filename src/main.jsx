/* eslint-disable no-unused-vars */
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

"use client";
import App from "./App";
import React, {
  StrictMode,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "./index.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomButtonComponent = () => {
  return <button onClick={() => window.alert("clicked")}>Push Me!</button>;
};

const rowSelection = {
  mode: "multiRow",
  headerCheckbox: false,
};

const GridExample = () => {
  const gridRef = useRef(null);

  const onExport = () => {
    const params = {
      fileName: "exported_data.csv", // Имя файла
      columnKeys: ["make", "model", "price", "electric", "month"],
    };

    gridRef.current.api.exportDataAsCsv(params); // Вызов метода экспорта с параметрами
  };

  const [rowData, setRowData] = useState([
    {
      make: "Тесла",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
  ]);
  const CustomCellRenderer = (params) => {
    return <div title={params.value}>Подробная информация</div>;
  };

  // const columnDefs = [
  //   {
  //     field: 'mainInfo',
  //     cellRenderer: (params) => {
  //       return `
  //         <span>${params.value}</span>
  //         <button class="info-btn" data-row-id="${params.data.id}">Info</button>
  //       `;
  //     },
  //   },
  // ];

  // Обработчик клика на кнопку
  // document.addEventListener("click", (event) => {
  //   if (event.target.classList.contains("info-btn")) {
  //     const rowId = event.target.dataset.rowId;

  //     // Отображение дополнительной информации
  //     const popup = document.createElement("div");
  //     popup.innerHTML = `<p>Дополнительная информация:</p>`;
  //     document.body.appendChild(popup);
  //   }
  // });
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "make",
      headerName: "Марка",
      editable: true,
      cellEditor: "agSelectCellEditor",
      // cellRenderer: (params) => {
      //   return `
      //     <span>${params.value}</span>
      //     <button class="info-btn" data-row-id="${params.data.id}">Info</button>
      //   `;
      // },
      cellEditorParams: {
        values: [
          "Тесла",
          "Ford",
          "Toyota",
          "Mercedes",
          "Fiat",
          "Nissan",
          "Vauxhall",
          "Volvo",
          "Jaguar",
        ],
      },
    },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
    { field: "electric" },
    {
      field: "month",
      comparator: (valueA, valueB) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
    },

    { field: "model1" },
    { field: "model2" },
    { field: "model3" },
    { field: "model4" },
    { field: "model5" },
  ]);
  const [displayedColumns, setDisplayedColumns] = useState(
    columnDefs.map((col) => col.field)
  ); // список колонок
  const [filterValue, setFilterValue] = useState(""); // Состояние для значения фильтра
  const [showColumnList, setShowColumnList] = useState(false); // Состояние для видимости списка
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  const toggleColumnVisibility = (columnField) => {
    setDisplayedColumns((prevColumns) => {
      if (prevColumns.includes(columnField)) {
        return prevColumns.filter((col) => col !== columnField);
      } else {
        return [...prevColumns, columnField];
      }
    });
  };

  const visibleColumnDefs = useMemo(
    () => columnDefs.filter((col) => displayedColumns.includes(col.field)),
    [columnDefs, displayedColumns]
  );

  const handleToggleColumnList = () => {
    setShowColumnList(!showColumnList);
  };

  const filteredColumns = useMemo(() => {
    return columnDefs.filter((col) => {
      const columnName = col.headerName || col.field;
      return columnName.toLowerCase().includes(filterValue.toLowerCase());
    });
  }, [columnDefs, filterValue]);

  return (
    <>
      <h1>AgGridReact</h1>
      <button onClick={onExport}>Экспорт в CSV</button>
      <div className="parent-lists">
        <button onClick={handleToggleColumnList}>
          {showColumnList ? "Скрыть список колонок" : "Показать список колонок"}
        </button>

        {showColumnList && (
          <div
            className={`lists-visible ${
              showColumnList ? "lists-visible_active" : ""
            }`}
          >
            <input
              className="input-find"
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Поиск колонки..."
            />
            {filteredColumns.map((col) => (
              <label key={col.field}>
                <input
                  type="checkbox"
                  checked={displayedColumns.includes(col.field)}
                  onChange={() => toggleColumnVisibility(col.field)}
                />
                {col.headerName || col.field}
              </label>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          ref={gridRef}
          columnDefs={visibleColumnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 25, 50]}
        />
      </div>
      <h1>Data grid</h1>
      <App />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<GridExample />);
