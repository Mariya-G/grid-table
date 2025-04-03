import * as React from "react";
import Material from "./Material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ruRU as dataGridRuRU } from "@mui/x-data-grid/locales";
import { ruRU as coreRuRu } from "@mui/material/locale";
//import { ruRU as datePickerRuRU } from "@mui/x-date-pickers/locale";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  coreRuRu, // Локализация для Material-UI
  dataGridRuRU // Локализация для Data Grid
  //datePickerRuRU
);

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 300,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "Колонка",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
  {
    field: "Колонка0",
    headerName: "Колонка0",
    sortable: false,
    width: 160,
  },
  {
    field: "Колонка1",
    headerName: "Колонка1",
    sortable: true,
    width: 160,
  },
  {
    field: "Колонка2",
    headerName: "Колонка2",
    sortable: true,
    width: 160,
  },
  {
    field: "Колонка3",
    headerName: "Колонка3",
    sortable: true,
    width: 160,
  },
  {
    field: "Колонка4",
    headerName: "Колонка4",
    sortable: true,
    width: 160,
  },
];

const rows = [
  { id: 1, lastName: "Snow1", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </ThemeProvider>
      <Material />
    </>
  );
}
