/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import { BASE64 } from "./BASE64";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_ExpandAllButton,
} from "material-react-table";
import { Box, Button, Stack, Menu, MenuItem } from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { data, citiesList } from "./makeData";
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
  const [openListCSV, setOpenListCSV] = useState(null);
  // const rowVirtualizerInstanceRef = useRef(null);
  // const [data1, setData1] = useState(data);
  const [sorting, setSorting] = useState(() => {
    // Загружаем состояние сортировки из sessionStorage
    const storedSorting = sessionStorage.getItem("mrt_sorting_table_1");
    return storedSorting ? JSON.parse(storedSorting) : [];
  });
  const [globalFilter, setGlobalFilter] = useState(() => {
    return sessionStorage.getItem("globalFilter") || "";
  });
  const handleMenuClick = (event) => {
    setOpenListCSV(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpenListCSV(null);
  };

  // Сохранение состояния сортировки в sessionStorage
  useEffect(() => {
    sessionStorage.setItem("mrt_sorting_table_1", JSON.stringify(sorting));
  }, [sorting]);

  //сброс данных в хранилище
  const resetState = () => {
    sessionStorage.removeItem("mrt_sorting_table_1");
    sessionStorage.removeItem("globalFilter");
    setSorting([]);
    setGlobalFilter("");
    // window.location.reload();
  };

  // Сохраняем состояние глобального фильтра в sessionStorage при его изменении
  useEffect(() => {
    sessionStorage.setItem("globalFilter", globalFilter);
  }, [globalFilter]);

  const handleGlobalFilterChange = (filterValue) => {
    setGlobalFilter(filterValue);
  };
  // Кастомная функция фильтрации
  const fuzzyFilter = (row, columnId, value) => {
    console.log(value);
    const rowValue = row.getValue(columnId);
    return rowValue.toLowerCase().includes(value.toLowerCase());
  };

  // Вычисляем общую сумму возраста
  const totalAge = useMemo(() => {
    return data.reduce((sum, row) => sum + (row.age || 0), 0);
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        filterVariant: "data-range",
        //accessorFn: (row) => new Date(row.date),
        //Cell: ({ cell }) => cell.getValue()?.toLocalDateString(),
        size: 40,
      }),

      {
        header: "ID",
        accessorKey: "id",

        Header: <i style={{ color: "red" }}>ID </i>, // польз. header применяется без accessorFn, header и Header должны быть друг за другом
        size: 80,
        grow: false, //не разрешать этому столбцу увеличиваться (если layoutMode — это сетка)
      },
      // columnHelper.accessor("id", {
      //   header: "ID",
      //   size: 40,
      // }),
      // columnHelper.accessor("firstName", {
      //   header: "First Name",
      //   accessorFn: (row) => row.firstName,
      //   size: 120,
      // }),
      {
        header: "Наименование товара",
        accessorKey: "firstName",
        size: 400,
        filterFn: fuzzyFilter,
      },
      {
        // объединение данных в одну колонку
        header: "Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      },
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
        filterVariant: "multi-select", //или select - один вариант
        filterSelectOptions: citiesList,
      }),
      columnHelper.accessor("country", {
        header: "Country",
        size: 220,
      }),
      columnHelper.accessor("age", {
        header: "Возраст",
        size: 220,
        aggregationFn: "count",
        Footer: () => <p>Общая сумма: {totalAge}</p>,
      }),
      {
        header: "Salary",
        accessorKey: "salary",

        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return (
              <span>
                $
                {typeof value === "number"
                  ? value.toLocaleString()
                  : "нет данных"}
              </span>
            );
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>Нет данных</span>; // Отображаем сообщение об ошибке
          }
        },
      },
      {
        header: "Интернет-магазин",
        accessorFn: (originalRow) => (originalRow.isActive ? "true" : "false"),
        id: "isActive",
        filterVariant: "checkbox",
        Cell: ({ cell }) =>
          cell.getValue() === "true" ? "Active" : "Inactive",
        size: 300,
      },
    ],
    { totalAge }
  );

  const theme = useTheme();
  // фильтр точного совпадения
  // const exactMatchFilter = (row, columnId, value) => {
  //   const rowValue = row.getValue(columnId);
  //   return rowValue.toLowerCase() === value.toLowerCase();
  // };
  // const handleFilterChange = (event) => {
  //   setGlobalFilter(event.target.value);
  // };
  // экспорт pdf
  const handleExportRowsPdf = (rows) => {
    const doc = new jsPDF("landscape");

    doc.addFileToVFS("Roboto.ttf", BASE64);
    doc.addFont("Roboto.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    console.log(tableHeaders);
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
    enableColumnFilterModes: true,

    mrtTheme: {
      // подсветка при передвижении стрелками на клавиатуре
      cellNavigationOutlineColor: "limegreen",
    },
    // muiTableBodyRowProps: ({ row }) => ({
    //   sx: {
    //     backgroundColor: row.depth === 0 ? "#f5f5f5" : "inherit", // Подсветка родительских строк
    //   },
    // }),
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
          </Stack>
        ),
        // GroupedCell: ({ row, table }) => {
        //   const { grouping } = table.getState();
        //   return row.getValue(grouping[grouping.length - 1]);
        // },
        GroupedCell: ({ row }) => {
          const rowCount = row.getVisibleCells().length; // Получаем количество видимых ячеек в группе
          return `${row.getValue("city")} (${rowCount})`;
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
    enableRowPinning: true,
    aggregationFns: true,
    enableStickyFooter: true, // футер закреплен
    enableColumnActions: true,
    enableColumnFilters: true,
    enableExpanding: true, //Позволяет раскрывать строки для отображения дополнительных данных.
    enableExpandAll: false, // кнопка открыть все дочерние строки
    maxLeafRowFilterDepth: 0, //При фильтрации корневых строк сохранить все дочерние строки проходящих родительских строк
    getSubRows: (originalRow) => originalRow.subRows || [],
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
    globalFilterFn: { fuzzyFilter },
    // globalFilterFn: "contains", // отключение нечеткого соответствия в поиске
    enableColumnResizing: true, // расширение колонок
    enableStickyHeader: true, //шапка зафиксированна
    //muiTableContainerProps: { sx: { maxHeight: "500px" } },
    enableBottomToolbar: true, // вкл/откл нижней панели
    enableTopToolbar: true, //вкл/откл верхней панели
    positionGlobalFilter: "right",
    initialState: {
      density: "compact", //standart, spacious
      pagination: { pageIndex: 0, pageSize: 30 },
      columnVisibility: { lastName: false }, // при обновлении стр по ум скрываем колонку
      showColumnFilters: true,
      showGlobalFilter: false,
      expanded: true, //по ум все строки открыты true, false - закрыты
      grouping: ["city"], // группировка по ум.
      sorting,
      globalFilter,
      columnPinning: { left: ["firstName"] },
    },
    onGlobalFilterChange: handleGlobalFilterChange,
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
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
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Button onClick={handleMenuClick} startIcon={<FileDownloadIcon />}>
            Экспортировать CSV:
          </Button>
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
          <Button onClick={resetState}>Сбросить все</Button>
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
