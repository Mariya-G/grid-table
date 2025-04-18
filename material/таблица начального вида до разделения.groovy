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