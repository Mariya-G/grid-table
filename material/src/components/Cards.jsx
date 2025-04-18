import { useMemo, useEffect, useState } from "react";
import MaterialTable from "./MaterialTable";
import { api } from "/src/utils/auth.js";
import { createMRTColumnHelper } from "material-react-table";

// eslint-disable-next-line react/prop-types
function Cards({ resizeContent }) {
  const [cardsData, setCardsData] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState([]);
  const [ordering, setOrdering] = useState("");
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // // Получение карт
  // const fetchCardsData = async (pageIndex = 0) => {
  //   try {
  //     const cardsRes = await api.get(`/cards/?page=${pageIndex + 1}`);
  //     console.log(cardsRes);
  //     setCardsData(cardsRes.data.results);
  //     setTotalCount(cardsRes.data.count);
  //   } catch (error) {
  //     console.error("Ошибка при выполнении запроса:", error);
  //   }
  // };

  // Получение карт с учетом пагинации, фильтров и сортировки
  const formatFilters = (filters) => {
    const filterParams = {};
    filters.forEach((filter) => {
      filterParams[filter.id] = filter.value;
    });
    return filterParams;
  };

  const getOrdering = () => {
    if (sorting.length === 0) return "";
    return sorting.map((s) => `${s.id}${s.desc ? "-" : ""}`).join(",");
  };

  const fetchCardsData = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        ...formatFilters(columnFilters),
        ordering: getOrdering(), // Используем функцию для получения ordering
        ...(globalFilter ? { globalFilter } : {}),
      });
      const cardsRes = await api.get(`/cards/?${params.toString()}`);
      setCardsData(cardsRes.data.results);
      setTotalCount(cardsRes.data.count);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };
  useEffect(() => {
    fetchCardsData();
  }, [pagination, columnFilters, sorting, globalFilter]);

  useEffect(() => {
    fetchCardsData(pagination.pageIndex);
  }, [pagination.pageIndex]);

  const statusCard = (value) => {
    if (value === 1) {
      return "Не активирована";
    } else if (value === 2) {
      return "Активирована";
    } else if (value === 3) {
      return "Временно приостановлена";
    } else if (value === 4) {
      return "Утеряна";
    } else if (value === 5) {
      return "Закончен срок действия";
    } else if (value === 6) {
      return "Закрыта";
    } else if (value === 7) {
      return "Исчерпан лимит";
    } else if (value === 8) {
      return "Купон использован";
    }
  };

  const typeCard = (value) => {
    if (value === 0) {
      return "Не определён";
    } else if (value === 1) {
      return "Дисконтная карта";
    } else if (value === 2) {
      return "Бонусная карта";
    } else if (value === 3) {
      return "Дисконтно-бонусная карта";
    } else if (value === 4) {
      return "Сертификат";
    }
  };

  const parseDate = (value) => {
    if (value) {
      const date = new Date(value);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    } else {
      return "-";
    }
  };
  const discontClient = (value) => {
    if (value === 2) {
      return `ООО "МИКС"`;
    } else if (value === 4) {
      return "ЛЕНАФАРМ";
    } else {
      return value;
    }
  };
  const columnHelper = createMRTColumnHelper();
  const columnsCards = useMemo(
    () => [
      columnHelper.accessor("card_num", {
        header: "Номер карты",
        size: 200,
      }),
      columnHelper.accessor("card_num2", {
        header: "Номер карты 2",
        size: 200,
      }),
      columnHelper.accessor("discount_client", {
        header: "Дисконт-клиент",
        size: 120,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{discontClient(value)}</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("card_status", {
        header: "Статус карты",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span className="card-active">{statusCard(value)}</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("date_beg", {
        header: "Дата начала",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{parseDate(value)}</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("date_end", {
        header: "Дата окончания",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{parseDate(value)}</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("card_type", {
        header: "Тип карты",
        size: 300,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{typeCard(value)}</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("owner", {
        header: "Владелец карты",
        size: 200,
      }),
      columnHelper.accessor("transactions_count", {
        header: "Текущее количество транзакций",
        size: 220,
      }),
      columnHelper.accessor("transactions_sum", {
        header: "Текущая сумма транзакций",
        size: 300,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{value} &#8381;</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("bonus_value", {
        header: "Текущее значение бонусов",
        size: 300,
      }),
      columnHelper.accessor("bonus_percent", {
        header: "Текущий процент бонусов",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{value} %</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("discount_percent", {
        header: "Текущий процент скидки",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{value} %</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("money_value", {
        header: "Количество рублей на сертификате",
        size: 200,
        Cell: ({ cell }) => {
          try {
            const value = cell.getValue();
            return <span>{value} &#8381;</span>;
          } catch (error) {
            console.error("Ошибка:", error);
            return <span>-</span>;
          }
        },
      }),
      columnHelper.accessor("algorithm", {
        header: "Алгоритм",
        size: 300,
      }),
      columnHelper.accessor("source_card", {
        header: "Исходная карта",
        size: 100,
      }),
      columnHelper.accessor("mess", {
        header: "Сообщение",
        size: 300,
      }),
    ],
    [cardsData]
  );
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  return (
    <section className={resizeContent}>
      <div className="content__wrap">
        <h1 className="content__title">Карты</h1>
        <MaterialTable
          data={cardsData}
          columns={columnsCards}
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          pageCount={pageCount}
          setCardsData={setCardsData}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          sorting={sorting}
          setSorting={setSorting}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </section>
  );
}

export default Cards;
