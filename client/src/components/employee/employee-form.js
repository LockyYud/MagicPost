"use client";

import { useState } from "react";
import { createEmployee } from "@/api/action";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { getEmployee } from "@/api/data";

export default function EmployeeForm() {
  const employee = {
    identifier: "",
    phoneNumber: "",
    fullName: "",
    address: {
      detail: "",
      communeID: "",
      districtID: "",
      provinceID: "",
    },
    transactionPointID: "",
    goodPointID: "",
    email: "",
    role: null,
  };
  const router = useRouter();

  // let res = await fetch("https://magicpost-uet.onrender.com/api/administrative/province/getall", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // });

  return (
    <div className="bg-white container p-3 rounded shadow-lg">
      <form id="form-employee">
        <div className="row mt-0">
          <div className="col-md-6 mt-2">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              placeholder="Họ và tên"
              onChange={(e) => {
                employee.fullName = e.target.value;
              }}
            />
          </div>

          <div className="col-md-6 mt-2">
            <label htmlFor="dob">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              id="dob"
            />
          </div>
        </div>

        <div className="row mt-0">
          <div className="col-md-6 mt-2">
            <label htmlFor="email">Địa chỉ Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={(e) => {
                employee.email = e.target.value;
              }}
            />
          </div>

          <div className="col-md-6 mt-2">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              onChange={(e) => {
                employee.phoneNumber = e.target.value;
              }}
            />
          </div>
        </div>

        <div className="row mt-0">
          <div className="col mt-2">
            <label htmlFor="phoneNumber">CCCD</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              onChange={(e) => {
                employee.identifier = e.target.value;
              }}
            />
          </div>
        </div>

        <div className="row">
          <div>
            Giới tính
          </div>
        </div>

        <div className="row mt-0">
          <label htmlFor="province" className="col-sm-12 col-form-label mt-2">Địa chỉ</label>
          <div className="col-md-4 mt-2">
            <select className="form-select" aria-label="Default select example" id="province">
              <option selected>Chọn Tỉnh / TP</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>

          <div className="col-md-4 mt-2">
            <select className="form-select" aria-label="Default select example">
              <option selected>Chọn Xã / Phường</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>

          <div className="col-md-4 mt-2">
            <select className="form-select" aria-label="Default select example">
              <option selected>Chọn Quận / Huyện</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>

        <div className="row mt-0">
          <div className="col mt-2">
            <input
              className="form-control"
              id="addressDetail"
              placeholder="Chi tiết"
              onChange={(e) => {
                employee.address.detail = e.target.value;
              }}
            />
          </div>
        </div>

        <div className="row mt-0">
          <div className="col-md-6 mt-2">
            <label htmlFor="role">Vai trò</label>
            <select className="form-select" aria-label="Default select example" id="role">
              <option selected>Chọn vai trò</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>

          <div className="col-md-6 mt-2">
            <label htmlFor="transactionPoint">Địa điểm làm việc</label>
            <select className="form-select" aria-label="Default select example">
              <option selected>Địa điểm làm việc</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>

      </form>

      <div className="mt-3">
        <button
          onClick={() => {
            console.log(createEmployee(employee));
          }}
          type="button"
          className="btn btn-primary me-3"
        >
          Tạo nhân viên
        </button>

        <button type="button" className="btn btn-secondary">Xóa</button>
      </div>
    </div>
  );
}
