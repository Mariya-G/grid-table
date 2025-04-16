import { useMemo, useEffect, useState } from "react";
import MaterialTable from "./MaterialTable";
import { data, citiesList } from "../utils/makeData";
import { columnsConfig } from "../utils/columnsConfig";
import { createMRTColumnHelper } from "material-react-table";
import { api } from "/src/utils/auth.js";

function Remains() {
  const [remainsData, setRemainsData] = useState();

  // // Получение остатков
  // const fetchRemains = async () => {
  //   try {
  //     const remainsRes = await api.get(`/remains/`);
  //     console.log(remainsRes);
  //     setRemainsData(remainsRes);
  //   } catch (error) {
  //     console.error("Ошибка при выполнении запроса:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRemains();
  // }, []);

  //console.log(remainsData);

  const columnHelper = createMRTColumnHelper();
  // const columnsConfig = {
  //   remains: [
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
  //       header: "Адрес",
  //       // filterFn: "startsWith",
  //       //filterVariant: "multi-select", //или select - один вариант
  //       //filterSelectOptions: citiesList,
  //       filterVariant: "autocomplete",
  //     }),
  //     columnHelper.accessor("country", {
  //       header: "Country",
  //       size: 220,
  //     }),
  //     columnHelper.accessor("date", {
  //       header: "Date",
  //       filterVariant: "data-range",
  //       size: 240,
  //     }),
  //     columnHelper.accessor("age", {
  //       header: "Возраст",
  //       size: 220,
  //       aggregationFn: "count",
  //       filterVariant: "data-range",
  //       muiTableBodyCellProps: {
  //         align: "center",
  //       },
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
  //   ],
  // };
  const columns = useMemo(() => columnsConfig.remains, []);
  return (
    <div className="remains">
      <MaterialTable data={data} citiesList={citiesList} columns={columns} />
    </div>
  );
}

export default Remains;
