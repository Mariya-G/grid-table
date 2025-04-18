/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import { BASE64 } from "../utils/BASE64";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_ExpandAllButton,
  MRT_TableHeadCellFilterContainer,
} from "material-react-table";
import {
  Box,
  //Button,
  Stack,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Paper,
  useMediaQuery,
  Autocomplete,
  TextField,
} from "@mui/material";

import { Download, Close } from "@mui/icons-material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { ruRU } from "@mui/material/locale";
//import { citiesList } from "../utils/makeData";

//const columnHelper = createMRTColumnHelper();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const MaterialTable = ({
  data,
  columns,
  citiesList,
  pagination,
  setPagination,
  totalCount,
  pageCount,
  setColumnFilters,
  columnFilters,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [openListCSV, setOpenListCSV] = useState(null);

  // const [columnFilters, setColumnFilters] = useState(() => {
  //   const storedColumnFilters = localStorage.getItem("columnFilters");
  //   return storedColumnFilters ? JSON.parse(storedColumnFilters) : [];
  // });

  // const [sorting, setSorting] = useState(() => {
  //   const storedSorting = localStorage.getItem("sorting");
  //   return storedSorting ? JSON.parse(storedSorting) : [];
  // });

  // const [globalFilter, setGlobalFilter] = useState(() => {
  //   return localStorage.getItem("globalFilter") || "";
  // });

  // const [pagination, setPagination] = useState(() => {
  //   const storedPagination = localStorage.getItem("pagination");
  //   try {
  //     return storedPagination
  //       ? JSON.parse(storedPagination)
  //       : { pageIndex: 0, pageSize: 10 };
  //   } catch (error) {
  //     console.error("Ошибка при парсинге состояния пагинации:", error);
  //     return { pageIndex: 0, pageSize: 10 };
  //   }
  // });

  //Сохранение состояния фильтров в колонках
  useEffect(() => {
    localStorage.setItem("сolumnFilters", JSON.stringify(columnFilters));
  }, [columnFilters]);

  // Сохранение состояния сортировки в localStorage
  useEffect(() => {
    localStorage.setItem("sorting", JSON.stringify(sorting));
  }, [sorting]);

  // Сохраняем состояние глобального фильтра в sessionStorage при его изменении
  useEffect(() => {
    localStorage.setItem("globalFilter", globalFilter);
  }, [globalFilter]);

  // Сохранение состояния пагинации
  useEffect(() => {
    localStorage.setItem("pagination", JSON.stringify(pagination));
  }, [pagination]);

  // Состояние загрузки
  useEffect(() => {
    if (data && data.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [data]);
  //сброс данных в хранилище
  const resetState = () => {
    localStorage.removeItem("sorting");
    localStorage.removeItem("globalFilter");
    localStorage.removeItem("columnFilters");
    setSorting([]);
    setGlobalFilter("");
    setColumnFilters([]);
  };

  const handleMenuClick = (event) => {
    setOpenListCSV(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpenListCSV(null);
  };

  const theme = useTheme();

  // const handleFilterChange = (event) => {
  //   setGlobalFilter(event.target.value);
  // };

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
    // <!-- ручной режим
    manualGrouping: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    //ручной режим --/>
    rowCount: totalCount,
    enableColumnDragging: true, //перемещение колонок
    enableColumnOrdering: true,
    enableColumnPinning: true, //закрепление колонок
    enableRowSelection: true,
    enableRowNumbers: false, //номера строк
    enableColumnResizing: true, // расширение колонок
    enableStickyHeader: true, //шапка зафиксированна
    muiTableContainerProps: { sx: { minHeight: "750px" } },
    enableBottomToolbar: true, // вкл/откл нижней панели
    enableTopToolbar: true, //вкл/откл верхней панели
    positionGlobalFilter: "right",
    rowPinningDisplayMode: "select-sticky", //sticky' | 'top' | 'bottom' | 'top-and-bottom' | 'select-sticky' | 'select-top' | 'select-bottom'' - поведение строки при закреплении
    initialState: {
      density: "compact", //состояние пространства в строке: standart, spacious

      columnVisibility: { lastName: false }, // при обновлении стр по ум скрываем колонку
      showColumnFilters: true,
      showGlobalFilter: false,
      //grouping: ["city"], // группировка по ум.
      columnPinning: { left: ["firstName"] }, //закрепление по ум.
    },

    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,

    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
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
        {totalCount}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "end",
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

        {/* <div>
          {Array.from(
            { length: Math.ceil(totalCount / pagination.pageSize) },
            (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                disabled={index === pagination.pageIndex}
              >
                {index + 1}
              </button>
            )
          )}
        </div> */}

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
        <Box sx={{ p: 1 }}>
          <span>
            Страница {pagination.pageIndex + 1} из {pageCount}
          </span>
        </Box>
      </>
    ),
  });

  return (
    <>
      <ThemeProvider theme={createTheme(theme, ruRU)}>
        <Paper className="filter-paper">
          {table
            .getLeafHeaders()
            .filter((header) => header.id === "city")
            .map((header) => {
              return (
                header.column.getCanFilter() && (
                  <Autocomplete
                    key={header.id}
                    options={citiesList}
                    onChange={(event, newValue) => {
                      header.column.setFilterValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={header.column.columnDef.header}
                        variant="outlined"
                      />
                    )}
                  />
                )
              );
            })}
        </Paper>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </>
  );
};

export default MaterialTable;
