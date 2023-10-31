import { getAllTransactionPoints } from "../../controllers/routing_point/transaction_point";

const { Router } = require("express");
const { default: catchAsync } = require("../../exceptions/catch-async");

const transactionPointRoute = new Router;

transactionPointRoute.get("/get", catchAsync(getAllTransactionPoints));

export default transactionPointRoute;