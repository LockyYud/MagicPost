"use client";
import { getEmployee } from "@/api/data";
import { CreateEmployee } from "@/components/employee/button";
import Pagination from "@/components/employee/pagination";
import SearchEmployee from "@/components/employee/search";
import EmployyeeTable from "@/components/employee/employee-table";
import "@/css/employee/customTable.css"

const list_employee = ["name", "phone", "address", "role", "email"];
const item_per_page = 6;
export default function page({ searchParams: { query, page } }) {
  const currentQuery = query || "";
  const currentPage = Number(page) || 1;
  const data = getEmployee();
  const totalPage = data.length / item_per_page;
  return (
    // <>
    //   <h2 id="tittlee">Danh sach nhan vien</h2>
    //   <div id="create-search">
    //     <SearchEmployee />
    //     <CreateEmployee />
    //   </div>
    //   <EmployyeeTable data={data}></EmployyeeTable>
    //   <Pagination totalPage={totalPage} />
    // </>
    <div className="tableContainer">
      <div className="row ">
        <div className="col">
          <h3>Danh sách nhân viên</h3>
        </div>
        <div className="col btnContainer">
          <button className="btn">Xuất Excel</button>
          <CreateEmployee />
        </div>
      </div>

      <div className="row">
        <EmployyeeTable data={data}></EmployyeeTable>
        <Pagination totalPage={totalPage} />
      </div>
    </div>
  );
}
