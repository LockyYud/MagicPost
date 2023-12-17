import bcrypt from "bcryptjs";
import { generateRandomPassword, normalizeName } from "../../../utils";
import { sequelize } from '../../models';
import { role } from "../../models/human/role";
import Error from "../../exceptions/error";
import { Op } from "sequelize";
import { Address, Commune, District, Employee, GoodsPoint, Province, RoutingPoint, TransactionPoint } from "../../models/model-export";
import { buildAddressWhereClause } from "../routing_point/address";

const defaultPageLimit = 8;

/**
 * A controller function that retrieves a list of employees from the database 
 * based on the provided filter criteria. It accepts query
 * parameters such as `page`, `limit`, `employeeID`, ... to filter the results.
 * 
 * Records collected are also satisfy the conditions corresponding 
 * to request sender role.
 */
export const getAllEmployees = async (req, res) => {
    // Filter query params.
    const pageIndex = req.query.page || 1;
    const pageLimit = req.query.limit || defaultPageLimit;
    const employeeID = req.query.employeeID || '';
    const identifier = req.query.identifier || '';
    const phoneNumber = req.query.phoneNumber || '';
    const fullName = req.query.fullName || '';
    const role = req.query.role;
    const status = req.query.status || '';
    const email = req.query.email || '';
    const address = req.query.address;
    const workingAddress = req.query.workingAddress;

    // Where-clause to use for employees filter.
    const employeeWhereClause = {
        [Op.and]: [
            { workingPointID: req.user.workingPointID },
            { employeeID: { [Op.like]: `%${employeeID}%` } },
            { identifier: { [Op.like]: `%${identifier}%` } },
            { phoneNumber: { [Op.like]: `%${phoneNumber}%` } },
            { fullName: { [Op.like]: `%${fullName}%` } },
            { email: { [Op.like]: `%${email}%` } },
            { status: { [Op.like]: `%${status}%` } }
        ]
    };
    if (role) {
        employeeWhereClause[Op.and].push({ role: { [Op.like]: `%${role}%` } });
    }

    // Where-clause to use for address and working address filter.
    const addressWhereClause = buildAddressWhereClause(address);
    const workingAddressWhereClause = buildAddressWhereClause(workingAddress);

    // Find the number of pages with filter and limit page size.
    let totalPages = await Employee.count({
        where: employeeWhereClause,
        include: [
            {
                model: Address,
                as: 'address',
                where: addressWhereClause,
                required: true
            },
            {
                model: RoutingPoint,
                as: 'workingPoint',
                required: true,
                include: {
                    model: Address,
                    where: workingAddressWhereClause,
                    required: true
                }
            }
        ]
    });
    totalPages = Math.ceil(totalPages / pageLimit);

    if (totalPages == 0) return res.status(200).json([]);

    // Find all employees with filter and limit page size.
    const employees = await Employee.findAll({
        offset: (pageIndex - 1) * pageLimit,
        limit: parseInt(pageLimit),
        where: employeeWhereClause,
        attributes: { exclude: ['password', 'birthDate', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Address,
                as: 'address',
                attributes: ['detail'],
                where: addressWhereClause,
                required: true,
                include: [
                    { model: Commune, attributes: ['name'] },
                    { model: District, attributes: ['name'] },
                    { model: Province, attributes: ['name'] }
                ]
            },
            {
                model: RoutingPoint,
                as: 'workingPoint',
                attributes: ['addressID'],
                required: true,
                include: {
                    model: Address,
                    attributes: ['detail'],
                    where: workingAddressWhereClause,
                    required: true,
                    include: [
                        { model: Commune, attributes: ['name'] },
                        { model: District, attributes: ['name'] },
                        { model: Province, attributes: ['name'] }
                    ]
                }
            }
        ]
    });

    // Adjust final result for responding request.
    const result = {
        totalPages: totalPages,
        limit: pageLimit,
        employees: employees
    }
    return res.status(200).json(result);
}

export const addNewEmployee = async (req, res) => {
    let employee = await Employee.findOne({ where: { identifier: req.body.identifier } });
    if (employee)
        return res.status(409).json(Error.getError(Error.code.duplicated_identifier));

    let newAddress = {
        detail: req.body.address.detail,
        communeID: req.body.address.communeID,
        districtID: req.body.address.districtID,
        provinceID: req.body.address.provinceID
    }

    if (!(await checkAddress(newAddress, true)))
        return res.status(400).json(Error.getError(Error.code.invalid_address));

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = {}

    const t = await sequelize.transaction()
    try {
        newAddress = await Address.create(newAddress, { transaction: t });

        newUser = {
            identifier: req.body.identifier,
            phoneNumber: req.body.phoneNumber,
            fullName: normalizeName(req.body.fullName),
            addressID: newAddress.dataValues.addressID,
            email: req.body.email,
            workingPointID: req.body.workingPointID,
            password: hashedPassword,
            role: req.body.role,
            gender: req.body.gender,
            birthDate: req.body.birthDate
        }

        newUser = await Employee.create(newUser, { transaction: t });

        await t.commit()
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500);
    }

    newUser = { ...newUser.get() };
    newUser.address = await getAddressByID(newUser.addressID);
    newUser.password = password;
    return res.status(200).json(newUser);
}

export const editEmployeeInfo = async (req, res) => {
    let newEmployee = { ...req.body };

    let employee = await Employee.findOne({ where: { employeeID: req.params.id } });
    if (!employee) return res.status(404).json(Error.getError(Error.code.invalid_employee_id));

    let employees = await Employee.findAll({ where: { identifier: newEmployee.identifier } });
    if (employees.length > 1
        || (employees.length == 1
            && employee.identifier != newEmployee.identifier)) {
        return res.status(409).json(Error.getError(Error.code.duplicated_identifier));
    }

    let address = await Address.findOne({ where: { addressID: employee.addressID } });
    let newAddress = newEmployee.address;
    if (newAddress && !(await checkAddress(newAddress, address)))
        return res.status(400).json(Error.getError(Error.code.invalid_address));

    let newRole = employee.role;
    if (newEmployee.role) newRole = newEmployee.role;
    if (newEmployee.workingPointID) {
        if (newRole == role.TRANSACTION_POINT_HEAD || role.TRANSACTION_POINT_EMPLOYEE) {
            if (!(await TransactionPoint.findOne({
                where: { transactionPointID: newEmployee.workingPointID }
            })))
                return res.status(400).json(Error.getError(Error.code.invalid_working_address_id));
        }
        else if (newRole == role.GOODS_POINT_EMPLOYEE || role.GOODS_POINT_HEADER) {
            if (!(await GoodsPoint.findOne({
                where: { goodsPointID: newEmployee.workingPointID }
            })))
                return res.status(400).json(Error.getError(Error.code.invalid_working_address_id));
        }
        else {
            if (!(await RoutingPoint.findOne({
                where: { routingPointID: newEmployee.workingPointID }
            })))
                return res.status(400).json(Error.getError(Error.code.invalid_working_address_id));
        }
    }

    const t = await sequelize.transaction();
    try {
        if (newAddress) {
            if (newAddress.detail) address.detail = newAddress.detail;
            if (newAddress.communeID) address.communeID = newAddress.communeID;
            if (newAddress.districtID) address.districtID = newAddress.districtID;
            if (newAddress.provinceID) address.provinceID = newAddress.provinceID;
            await address.save({ transaction: t });
        }

        if (newEmployee.identifier) {
            employee.identifier = newEmployee.identifier;
        }

        if (newEmployee.phoneNumber) {
            employee.phoneNumber = newEmployee.phoneNumber;
        }

        if (newEmployee.fullName) {
            employee.fullName = newEmployee.fullName;
        }

        if (newEmployee.workingPointID) {
            employee.workingPointID = newEmployee.workingPointID;
        }

        if (newEmployee.role) {
            employee.role = newEmployee.role;
        }

        if (newEmployee.status) {
            employee.status = newEmployee.status;
        }

        await employee.save({ transaction: t });
        await t.commit()
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500);
    }

    await getEmployeeByID({ params: { id: employee.employeeID } }, res);
}

export const getEmployeeByID = async (req, res) => {
    let employee = await Employee.findOne(
        {
            where: {
                employeeID: req.params.id
            },
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['addressID', 'detail'],
                    include: [
                        {
                            model: Commune,
                            attributes: ['communeID', 'name']
                        },
                        {
                            model: District,
                            attributes: ['districtID', 'name']
                        },

                        {
                            model: Province,
                            attributes: ['provinceID', 'name']
                        }
                    ]
                },
                {
                    model: RoutingPoint,
                    as: 'workingPoint',
                    attributes: ['routingPointID'],
                    include: {
                        model: Address,
                        attributes: ['addressID'],
                        include: [
                            {
                                model: Commune,
                                attributes: ['communeID', 'name']
                            },
                            {
                                model: District,
                                attributes: ['districtID', 'name']
                            },

                            {
                                model: Province,
                                attributes: ['provinceID', 'name']
                            }
                        ]
                    }

                }
            ]
        }
    )
    if (!employee) return res.status(404).json(Error.getError(Error.code.invalid_employee_id));

    employee = { ...employee.get() };
    delete employee.password;
    delete employee.addressID;

    return res.status(200).json(employee);
} 