import { useMemo } from "react";
import MaterialTable from "./MaterialTable";
import { data } from "../utils/makeData";
import { columnsConfig } from "../utils/columnsConfig";

function Sales() {
  const columns = useMemo(() => columnsConfig.sales, []);
  return (
    <div className="sales">
      <MaterialTable data={data} columns={columns} />
    </div>
  );
}

export default Sales;
