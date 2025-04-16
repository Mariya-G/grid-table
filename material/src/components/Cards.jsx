import { useMemo, useEffect, useState } from "react";
import MaterialTable from "./MaterialTable";
import { dataCards } from "../utils/makeData";
//import { columnsConfig } from "../utils/columnsConfig";
import { api } from "/src/utils/auth.js";
import { createMRTColumnHelper } from "material-react-table";

function Cards() {
  const [cardsData, setCardsData] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Получение карт
  const fetchCardsData = async () => {
    try {
      const cardsRes = await api.get(`/cards/`);
      console.log(cardsRes.data);
      setCardsData(cardsRes.data.results);
      setPagination(cardsRes.data.next);
      console.log(cardsRes.data.next);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };

  useEffect(() => {
    fetchCardsData();
  }, []);

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
      }),
      columnHelper.accessor("card_status", {
        header: "Статус карты",
        size: 200,
      }),
      columnHelper.accessor("date_beg", {
        header: "Дата начала",
        size: 200,
      }),
      columnHelper.accessor("date_end", {
        header: "Дата окончания",
        size: 200,
      }),
      columnHelper.accessor("card_type", {
        header: "Тип карты",
        size: 200,
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
      }),
    ],
    [cardsData]
  );

  return (
    <div className="cards">
      <MaterialTable data={cardsData} columns={columnsCards} />
    </div>
  );
}

export default Cards;
