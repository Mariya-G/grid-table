import { useMemo } from "react";

import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_ExpandAllButton,
  // MRT_ShowHideColumnsButton,
  // MRT_ToggleFullScreenButton,
} from "material-react-table";
import { Box, Button, Stack } from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { data } from "./makeData";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { ruRU } from "@mui/material/locale";

const columnHelper = createMRTColumnHelper();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const MaterialTable = () => {
  // Вычисляем общую сумму возраста
  const totalAge = useMemo(() => {
    return data.reduce((sum, row) => sum + (row.age || 0), 0);
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Дата",
        filterVariant: "data-range",
        //accessorFn: (row) => new Date(row.date),
        //Cell: ({ cell }) => cell.getValue()?.toLocalDateString(),
        size: 40,
      }),
      columnHelper.accessor("id", {
        header: "ID",
        size: 40,
      }),
      columnHelper.accessor("firstName", {
        header: "First Name",
        size: 120,
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        size: 120,
      }),
      columnHelper.accessor("company", {
        header: "Company",
        size: 300,
      }),
      columnHelper.accessor("city", {
        header: "City",
      }),
      columnHelper.accessor("country", {
        header: "Country",
        size: 220,
      }),
      columnHelper.accessor("age", {
        header: "Возраст",
        size: 220,
        Footer: () => <p>Общая сумма: {totalAge}</p>,
      }),
    ],
    { totalAge }
  );

  const theme = useTheme();

  // экспорт pdf
  const handleExportRowsPdf = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
  };

  // экспорт csv
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
            <Box>Groups</Box>
          </Stack>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        muiTableBodyCellProps: ({ row }) => ({
          sx: (theme) => ({
            color:
              row.depth === 0
                ? theme.palette.primary.main
                : row.depth === 1
                ? theme.palette.secondary.main
                : undefined,
          }),
        }),
        size: 200,
      },
    },
    aggregationFns: true,
    enableStickyFooter: true, // футер закреплен
    enableColumnActions: true,
    enableColumnFilters: true,
    enableExpanding: true,
    enableExpandAll: false, // кнопка открыть все дочерние строки
    maxLeafRowFilterDepth: 0, //При фильтрации корневых строк сохранить все дочерние строки проходящих родительских строк
    getSubRows: (originalRow) => originalRow.subRows,
    paginateExpandedRows: false, // дочерние строки вместе с родителями на 1 странице
    filterFromLeafRows: false, //применить фильтрацию ко всем строкам, а не только к родительским строкам
    localization: MRT_Localization_RU,
    enableGrouping: true,
    manualGrouping: true,
    enableColumnDragging: true, //перемещение колонок
    enableColumnOrdering: true,
    enableColumnPinning: true, //закрепление колонок
    enableRowSelection: true,
    showProgressBars: true,
    enableRowNumbers: true,
    enableColumnResizing: true, // расширение колонок
    enableStickyHeader: true, //шапка зафиксированна
    muiTableContainerProps: { sx: { maxHeight: "500px" } },
    enableBottomToolbar: true, // вкл/откл нижней панели
    enableTopToolbar: true, //вкл/откл верхней панели
    positionGlobalFilter: "right",
    initialState: {
      columnVisibility: { lastName: false }, // при обновлении стр по ум скрываем колонку
      showColumnFilters: true,
      showGlobalFilter: true,
      expanded: true, //по ум все строки открыты
      grouping: ["age"], // группировка по ум.
    },
    //enableFilterMatchHighlighting: true,
    enableGlobalFilter: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            padding: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
          >
            Экспортировать все данные CSV
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
          >
            Экспортировать все строки CSV
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Экспортировать строки на странице CSV
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Экспортировать выбранные строки CSV
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            padding: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRowsPdf(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
          >
            Экспорт PDF
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRowsPdf(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Экспорт строк на странице PDF
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() =>
              handleExportRowsPdf(table.getSelectedRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
          >
            Экспорт выбранных строк PDF
          </Button>
        </Box>
      </>
    ),
  });

  return (
    <>
      <ThemeProvider theme={createTheme(theme, ruRU)}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </>
  );
};

export default MaterialTable;
