import { useMemo } from "react";
import MaterialTable from "./MaterialTable";
import { data, citiesList } from "../utils/makeData";
import { columnsConfig } from "../utils/columnsConfig";

function Remains() {
  const columns = useMemo(() => columnsConfig.remains, []);
  return (
    <div className="remains">
      <MaterialTable data={data} citiesList={citiesList} columns={columns} />
    </div>
  );
}

export default Remains;
