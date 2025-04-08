/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import { BASE64 } from "../utils/BASE64";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_ExpandAllButton,
} from "material-react-table";
import {
  Box,
  //Button,
  Stack,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";

import { Download, Close } from "@mui/icons-material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { ruRU } from "@mui/material/locale";
//import { citiesList } from "../utils/makeData";

const columnHelper = createMRTColumnHelper();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const MaterialTable = ({ data, columns }) => {
  const [openListCSV, setOpenListCSV] = useState(null);

  const [sorting, setSorting] = useState(() => {
    const storedSorting = localStorage.getItem("mrt_sorting_table_1");
    return storedSorting ? JSON.parse(storedSorting) : [];
  });

  const [globalFilter, setGlobalFilter] = useState(() => {
    return localStorage.getItem("globalFilter") || "";
  });

  const [columnFilters, setColumnFilters] = useState(() => {
    const storedColumnFilters = localStorage.getItem("columnFilters");
    return storedColumnFilters ? JSON.parse(storedColumnFilters) : [];
  });

  const handleMenuClick = (event) => {
    setOpenListCSV(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpenListCSV(null);
  };

  // Сохранение состояния сортировки в localStorage
  useEffect(() => {
    localStorage.setItem("mrt_sorting_table_1", JSON.stringify(sorting));
  }, [sorting]);

  //сохранение фильтров в колонках
  useEffect(() => {
    localStorage.setItem("сolumnFilters", JSON.stringify(columnFilters));
    console.log(columnFilters);
  }, [columnFilters]);

  //сброс данных в хранилище
  const resetState = () => {
    localStorage.removeItem("mrt_sorting_table_1");
    localStorage.removeItem("globalFilter");
    localStorage.removeItem("columnFilters");
    setSorting([]);
    setGlobalFilter("");
    setColumnFilters([]);
    // window.location.reload();
  };

  // Сохраняем состояние глобального фильтра в sessionStorage при его изменении
  useEffect(() => {
    localStorage.setItem("globalFilter", globalFilter);
  }, [globalFilter]);

  // // Вычисляем общую сумму возраста
  // const totalAge = useMemo(() => {
  //   return data.reduce((sum, row) => sum + (row.age || 0), 0);
  // }, [data]);

  // const columns = useMemo(
  //   () => [
  //     // {
  //     //   header: "ID",
  //     //   accessorKey: "id",

  //     //   Header: <i style={{ color: "red" }}>ID </i>, // польз. header применяется без accessorFn, header и Header должны быть друг за другом
  //     //   size: 80,
  //     //   grow: false, //не разрешать этому столбцу увеличиваться (если layoutMode — это сетка)
  //     // },
  //     {
  //       header: "Наименование товара",
  //       accessorKey: "firstName",
  //       size: 300,
  //     },
  //     {
  //       // объединение данных в одну колонку
  //       header: "Name",
  //       accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  //     },
  //     columnHelper.accessor("lastName", {
  //       header: "Last Name",
  //       size: 120,
  //     }),
  //     columnHelper.accessor("company", {
  //       header: "Company",
  //       size: 300,
  //     }),
  //     columnHelper.accessor("city", {
  //       header: "City",
  //       filterVariant: "multi-select", //или select - один вариант
  //       filterSelectOptions: citiesList,
  //     }),
  //     columnHelper.accessor("country", {
  //       header: "Country",
  //       size: 220,
  //       //enableColumnFilter: false,
  //     }),
  //     columnHelper.accessor("date", {
  //       header: "Date",
  //       filterVariant: "data-range",
  //       //accessorFn: (row) => new Date(row.date),
  //       //Cell: ({ cell }) => cell.getValue()?.toLocalDateString(),
  //       size: 240,
  //     }),
  //     columnHelper.accessor("age", {
  //       header: "Возраст",
  //       size: 220,
  //       aggregationFn: "count",
  //       filterVariant: "data-range",
  //       // Footer: () => <p>Общая сумма: {totalAge}</p>,
  //     }),
  //     {
  //       header: "Salary",
  //       accessorKey: "salary",
  //       filterVariant: "data-range",
  //       Cell: ({ cell }) => {
  //         try {
  //           const value = cell.getValue();
  //           return (
  //             <span>
  //               $
  //               {typeof value === "number"
  //                 ? value.toLocaleString()
  //                 : "нет данных"}
  //             </span>
  //           );
  //         } catch (error) {
  //           console.error("Ошибка:", error);
  //           return <span>Нет данных</span>; // Отображаем сообщение об ошибке
  //         }
  //       },
  //     },
  //     {
  //       header: "Интернет-магазин",
  //       accessorFn: (originalRow) => (originalRow.isActive ? "true" : "false"),
  //       id: "isActive",
  //       filterVariant: "checkbox",
  //       Cell: ({ cell }) =>
  //         cell.getValue() === "true" ? "Active" : "Inactive",
  //       size: 300,
  //     },
  //   ]
  //   // [totalAge]
  // );

  const theme = useTheme();

  // const handleFilterChange = (event) => {
  //   setGlobalFilter(event.target.value);
  // };

  const handleShowColumnFiltersChange = (newFilters) => {
    setColumnFilters(newFilters);
  };

  //экспорт pdf
  const handleExportRowsPdf = (rows) => {
    const doc = new jsPDF("landscape");

    doc.addFileToVFS("Roboto.ttf", BASE64);
    doc.addFont("Roboto.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

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
    enableColumnFilterModes: false, // доп меню фильтров для колонок

    mrtTheme: {
      cellNavigationOutlineColor: "#319ce8", // подсветка при передвижении стрелками на клавиатуре
    },
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: () => (
          <Stack direction="row" alignItems="right">
            <MRT_ExpandAllButton table={table} />
          </Stack>
        ),
        // GroupedCell: ({ row }) => {
        //   const rowCount = row.getVisibleCells().length; // Получаем количество видимых ячеек в группе
        //   return `${row.getValue("city")} (${rowCount})`;
        // },
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

        size: 60,
      },
      "mrt-row-numbers": {
        enableOrdering: true,
        enablePinning: true,
        enableColumnActions: true,
        size: 40,
        grow: true, //колонки занимают оставшееся пространство
      },
    },
    //enableRowVirtualization: true, //для оптимизации загрузки строк
    enableRowPinning: true,
    aggregationFns: true,
    enableStickyFooter: true, // футер закреплен
    enableColumnActions: true,
    enableColumnFilters: true,
    localization: MRT_Localization_RU,
    enableGrouping: true,
    manualGrouping: true,
    enableColumnDragging: true, //перемещение колонок
    enableColumnOrdering: true,
    enableColumnPinning: true, //закрепление колонок
    enableRowSelection: true,
    showProgressBars: true,
    enableRowNumbers: false, //номера строк
    enableColumnResizing: true, // расширение колонок
    enableStickyHeader: true, //шапка зафиксированна
    muiTableContainerProps: { sx: { minHeight: "750px" } },
    enableBottomToolbar: true, // вкл/откл нижней панели
    enableTopToolbar: true, //вкл/откл верхней панели
    positionGlobalFilter: "right",
    initialState: {
      density: "compact", //standart, spacious
      pagination: { pageIndex: 0, pageSize: 30 },
      columnVisibility: { lastName: false }, // при обновлении стр по ум скрываем колонку
      showColumnFilters: true,
      showGlobalFilter: false,
      //grouping: ["city"], // группировка по ум.
      columnPinning: { left: ["firstName"] }, //закрепление по ум.
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      //showColumnFilters,
      columnFilters,
    },
    groupedColumnMode: "reorder",
    //     manualGrouping: true,
    // onGroupingChange: (updater) => {
    //   const newGrouping = updater(table.getState().grouping);
    //   // Отправка запроса на сервер с параметрами группировки
    // },
    //enableFilterMatchHighlighting: true,
    enableGlobalFilter: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "end",
            width: "100%",
          }}
        >
          <Tooltip title="Скачать как:">
            <IconButton aria-label="dowload" onClick={handleMenuClick}>
              <Download sx={{ color: "#5392ff" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={openListCSV}
            open={Boolean(openListCSV)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleExportData}>
              Экспортировать все данные CSV
            </MenuItem>
            <MenuItem
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
            >
              Экспортировать все строки CSV
            </MenuItem>
            <MenuItem
              disabled={table.getRowModel().rows.length === 0}
              onClick={() => handleExportRows(table.getRowModel().rows)}
            >
              Экспортировать строки на странице CSV
            </MenuItem>
            <MenuItem
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            >
              Экспортировать выбранные строки CSV
            </MenuItem>
          </Menu>
          <Tooltip title="Сбросить все">
            <IconButton aria-label="reset" onClick={resetState}>
              <Close sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* <Box
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
          
        </Box> */}
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
