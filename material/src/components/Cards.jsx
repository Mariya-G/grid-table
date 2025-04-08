import { useMemo } from "react";
import MaterialTable from "./MaterialTable";
import { dataCards } from "../utils/makeData";
import { columnsConfig } from "../utils/columnsConfig";

function Remains() {
  const columns = useMemo(() => columnsConfig.cards, []);
  return (
    <div className="cards">
      <MaterialTable data={dataCards} columns={columns} />
    </div>
  );
}

export default Remains;
