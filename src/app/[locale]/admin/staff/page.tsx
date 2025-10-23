"use client";

import React from "react";
import Image from "next/image";
import { useMutation } from "@apollo/client";

// components
import Select from "@/components/select";
import StatusBadge from "@/components/status";
import EmptyPage from "@/components/emptyPage";
import Breadcrumb from "@/components/breadCrumb";
import DatePicker from "@/components/datePicker";
import IconButton from "@/components/iconButton";
import DeleteModal from "@/components/deleteModal";
import Pagination1 from "@/components/pagination1";

// utils and icons
import { useToast } from "@/utils/toast";
import useFilter from "./hooks/useFilter";
import { IEmployee } from "@/types/employee";
import useFetchEmployees from "./hooks/useFetch";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { customer_status, page_limits } from "@/utils/option";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "@/icons/page";

// APIs
import MyModal from "@/components/modal";
import Loading from "@/components/loading";
import Textfield from "@/components/textField";
import Password from "@/components/passwordTextField";
import {
  MUTATION_CREATE_EMPLOYEE,
  MUTATION_DELETE_EMPLOYEE,
  MUTATION_UPDATE_EMPLOYEE,
} from "@/api/employee";

interface CloudinaryResponse {
  secure_url?: string;
}

export default function Customer() {
  const filter = useFilter();
  const fetchEmployees = useFetchEmployees({
    filter: filter.data,
  });

  const { successMessage, errorMessage } = useToast();

  const [file, setFile] = React.useState<File | null>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [employeeData, setEmployeeData] = React.useState<IEmployee>({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    dob: "",
    image: "",
    created_at: "",
    status: "",
  });

  const [errorMessages, setErrorMessages] = React.useState<string | null>(null);

  const [deleteEmployee] = useMutation(MUTATION_DELETE_EMPLOYEE);
  const [createEmployee] = useMutation(MUTATION_CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(MUTATION_UPDATE_EMPLOYEE);

  const handleOpenDeleteModal = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenManageModal = () => {
    setOpenModal(!openModal);
  };

  const handleDeleteEmployee = async () => {
    setIsLoading(true);
    if (!employeeData?.id) {
      handleOpenDeleteModal();
      setIsLoading(false);
      return;
    }
    try {
      const res = await deleteEmployee({
        variables: {
          deleteStaffId: employeeData.id,
        },
      });
      if (res?.data?.deleteStaff.success) {
        fetchEmployees.refetch();
        successMessage({
          message: "Delete customer success!",
          duration: 3000,
        });
      } else {
        errorMessage({
          message: res?.data?.deleteStaff.error.message,
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Sorry. Unexpected error happen!",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setEmployeeData({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        email: "",
        dob: "",
        image: "",
        created_at: "",
        status: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSizeInBytes = 800 * 1024;

    if (selectedFile) {
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessages("Only JPG, JPEG, and PNG files are allowed.");
        setFile(null);
        setPreview(null);
        return;
      }

      if (selectedFile.size > maxSizeInBytes) {
        setErrorMessages("File size exceeds 800KB.");
        setFile(null);
        setPreview(null);
        return;
      }

      setErrorMessages(null);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCrateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employeeData.password !== confirmPassword) {
      errorMessage({ message: "Password don't match!", duration: 3000 });
      return;
    }
    setIsLoading(true);

    try {
      let data: CloudinaryResponse = {};
      if (file) {
        const _formData = new FormData();
        _formData.append("file", file);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        data = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      const res = await createEmployee({
        variables: {
          data: {
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            username: employeeData.username,
            password: employeeData.password,
            email: employeeData.email,
            dob: employeeData.dob,
            image: data.secure_url || employeeData.image,
          },
        },
      });

      const result = res?.data?.createStaff;
      if (result?.success) {
        successMessage({
          message: "Update shop profile successful!",
          duration: 3000,
        });
        setFile(null);
        result?.data || {};
        handleOpenManageModal();
        fetchEmployees.refetch();
      } else {
        errorMessage({
          message: result?.error?.details || "An error occurred",
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Sorry. Unexpected error happen!",
        duration: 3000,
      });
    } finally {
      setFile(null);
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employeeData.password) {
      if (employeeData.password !== confirmPassword) {
        errorMessage({ message: "Password don't match!", duration: 3000 });
        return;
      }
    }
    setIsLoading(true);

    try {
      let data: CloudinaryResponse = {};
      if (file) {
        const _formData = new FormData();
        _formData.append("file", file);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        data = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      const res = await updateEmployee({
        variables: {
          data: {
            id: employeeData.id,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            username: employeeData.username,
            password: employeeData.password,
            email: employeeData.email,
            dob: employeeData.dob,
            image: data.secure_url || employeeData.image,
          },
        },
      });

      const result = res?.data?.updateStaff;
      if (result?.success) {
        successMessage({
          message: "Update shop profile successful!",
          duration: 3000,
        });
        setFile(null);
        result?.data || {};
        handleOpenManageModal();
        fetchEmployees.refetch();
      } else {
        errorMessage({
          message: result?.error?.details || "An error occurred",
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Sorry. Unexpected error happen!",
        duration: 3000,
      });
    } finally {
      setFile(null);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Customer management", value: "/customer" },
        ]}
      />
      <div className="bg-white rounded-md p-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center justify-between mb-4">
          <h1>List of all employees:</h1>
          <IconButton
            type="button"
            isFront={true}
            title="Create New"
            icon={<PlusIcon size={16} />}
            onClick={handleOpenManageModal}
            className="rounded text-gray-500 p-2 w-auto italic text-sm border hover:bg-neon_pink hover:text-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="w-full sm:w-2/5 flex items-start justify-start gap-2 mt-2 sm:mt-0">
            <div className="w-1/4">
              <Select
                name="show"
                title="Show"
                option={page_limits}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.LIMIT,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-1/4">
              <Select
                name="status"
                title="Status"
                option={customer_status}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.STATUS,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full sm:w-3/5 flex flex-col sm:flex-row mt-2 sm:mt-0 items-end justify-start gap-2">
            <div className="relative w-full border rounded">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <SearchIcon size={16} className="text-neon_pink" />
              </div>
              <input
                required
                type="text"
                id="search"
                placeholder="Search...."
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.KEYWORD,
                    payload: e.target.value,
                  });
                }}
                className="h-8 bg-white text-gray-500 text-sm rounded ps-10 p-2 focus:outline-none focus:ring-1"
              />
            </div>
            <DatePicker
              name="start_date"
              title="Start date"
              className="py-1"
              value={filter.state.createdAtBetween.startDate ?? ""}
              onChange={(e) => {
                filter.dispatch({
                  type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                  payload: e.target.value,
                });
              }}
            />
            <DatePicker
              name="end_date"
              title="End date"
              className="py-1"
              value={filter.state.createdAtBetween.endDate ?? ""}
              onChange={(e) => {
                filter.dispatch({
                  type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                  payload: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="w-full h-auto mt-6">
          <div className="w-full hidden sm:block">
            {fetchEmployees.total ?? 0 > 0 ? (
              <table className="w-full bg-gray overflow-x-auto text-left text-sm rtl:text-right border rounded">
                <thead className="sticky top-0 text-xs bg-white">
                  <tr className="border-b border-gray text-left uppercase">
                    <th scope="col" className="py-3 pl-1 text-center">
                      id
                    </th>
                    <th scope="col" className="py-3 pl-1">
                      full name
                    </th>
                    <th scope="col" className="py-3 pl-1">
                      email
                    </th>
                    <th scope="col" className="py-3 pl-1">
                      username
                    </th>
                    <th scope="col" className="py-3 pl-1">
                      Birthday
                    </th>
                    <th scope="col" className="py-3 pl-1 text-center">
                      Status
                    </th>
                    <th scope="col" className="py-3 pl-1">
                      created_at
                    </th>
                    <th scope="col" className="py-3 pl-1 text-start">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchEmployees?.data?.map((employee, index) => (
                    <tr
                      key={employee.id + index}
                      className="border-b border-gray bg-white hover:bg-gray py-6 text-gray-500"
                    >
                      <td className="py-3 pl-1 text-center">{index + 1}</td>
                      <td className="flex items-center justify-start gap-2 py-3 pl-1">
                        <Image
                          className="shadow-md rounded"
                          src={
                            employee.image &&
                            typeof employee.image === "string" &&
                            employee.image.startsWith("http")
                              ? employee.image
                              : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                          }
                          alt="default"
                          width={30}
                          height={30}
                        />
                        <p>{employee.firstName + " " + employee.lastName}</p>
                      </td>
                      <td className="py-3 pl-1">{employee.email}</td>
                      <td className="py-3 pl-1">{employee.username}</td>
                      <td className="py-3 pl-1">
                        {formatDateToDDMMYYYY(employee.dob)}
                      </td>

                      <td className="py-3 pl-1 text-center">
                        <StatusBadge status={employee.status} />
                      </td>

                      <td className="py-3 pl-1">
                        {formatDateToDDMMYYYY(employee.created_at)}
                      </td>
                      <td className="py-3 pl-1 text-center">
                        <div className="flex gap-4">
                          <TrashIcon
                            size={18}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => {
                              setEmployeeData(employee);
                              handleOpenDeleteModal();
                            }}
                          />
                          <EditIcon
                            size={20}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => {
                              setIsUpdate(true);
                              setEmployeeData({
                                id: employee.id,
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                email: employee.email,
                                dob: new Date(employee.dob).toISOString(),
                                image: employee.image,
                                status: employee.status,
                                password: employee.password,
                                username: employee.username,
                                created_at: employee.created_at,
                              });
                              handleOpenManageModal();
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyPage />
            )}
          </div>
        </div>
        <div className="w-full flex items-end justify-end mb-4">
          <Pagination1
            filter={filter.data}
            totalPage={Math.ceil(
              (fetchEmployees.total ?? 0) / filter.data.limit
            )}
            onPageChange={(e) => {
              filter.dispatch({
                type: filter.ACTION_TYPE.PAGE,
                payload: e,
              });
            }}
          />
        </div>

        <DeleteModal
          isOpen={isOpen}
          onClose={handleOpenDeleteModal}
          onConfirm={() => handleDeleteEmployee()}
        />

        <MyModal
          isOpen={openModal}
          onClose={handleOpenManageModal}
          className="w-11/12 sm:w-3/5"
        >
          <form
            onSubmit={isUpdate ? handleUpdateEmployee : handleCrateEmployee}
            className="flex items-start justify-start flex-col gap-4 rounded bg-white w-full"
          >
            <p className="text-black">
              {isUpdate ? "Update customer information" : "Create new customer"}
              :
            </p>
            <div className="w-2/4 flex items-start justify-start gap-4">
              <div>
                {preview ? (
                  <Image
                    src={preview}
                    width={80}
                    height={80}
                    alt="Image preview"
                    className="max-w-full h-auto border rounded"
                  />
                ) : employeeData.image ? (
                  <Image
                    src={employeeData.image}
                    width={80}
                    height={80}
                    alt="Image preview"
                    className="max-w-full h-auto border rounded"
                  />
                ) : (
                  <Image
                    src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                    width={80}
                    height={80}
                    alt="Image preview"
                    className="max-w-full h-auto border rounded"
                  />
                )}
              </div>
              <div className="flex items-start justify-start flex-col gap-3">
                <label className="block text-gray-500 text-sm">
                  Upload customer profile
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="block w-full hidden"
                />
                {errorMessages && (
                  <p className="text-red-500 text-xs">{errorMessages}</p>
                )}
                <div className="flex items-start justify-start gap-4">
                  <label
                    htmlFor="file-upload"
                    className="text-xs border p-2 rounded flex items-center justify-center cursor-pointer bg-neon_pink text-white"
                  >
                    Select New
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-2">
              <Textfield
                required
                id="firstName"
                name="firstName"
                title="First name"
                color="text-gray-500"
                placeholder="Enter first name...."
                value={employeeData.firstName}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    firstName: e.target.value,
                  })
                }
              />
              <Textfield
                name="lastName"
                placeholder="Enter last name...."
                id="lastName"
                title="Last"
                required
                color="text-gray-500"
                value={employeeData.lastName}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    lastName: e.target.value,
                  })
                }
              />
              <Textfield
                name="email"
                placeholder="Enter email...."
                id="email"
                title="Email"
                required
                color="text-gray-500"
                value={employeeData.email}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    email: e.target.value,
                  })
                }
              />
              <DatePicker
                name="dob"
                title="Date of birth"
                className="h-8 w-full"
                value={
                  employeeData.dob
                    ? new Date(employeeData.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    dob: e.target.value, // ✅ Keeps it as a string
                  })
                }
              />
              <Textfield
                name="phone"
                placeholder="Enter username...."
                id="phone"
                title="Username"
                required
                color="text-gray-500"
                value={employeeData.username}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    username: e.target.value,
                  })
                }
              />

              <Password
                name="password"
                id="password"
                title="Password"
                required={isUpdate ? false : true}
                color="text-gray-500"
                placeholder="strongPassword1@"
                value={employeeData.password}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    password: e.target.value,
                  })
                }
              />

              <Password
                name="confirm_password"
                id="confirm_password"
                title="Confirm password"
                required={isUpdate ? false : true}
                color="text-gray-500"
                placeholder="strongPassword1@"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-end gap-4">
              <IconButton
                type="button"
                title="Close"
                onClick={() => {
                  setEmployeeData({
                    id: "",
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    email: "",
                    dob: "",
                    image: "",
                    created_at: "",
                    status: "",
                  });
                  handleOpenManageModal();
                }}
                className="rounded bg-gray-500 text-white w-auto text-sm hover:font-medium hover:shadow-md"
              />
              <IconButton
                type="submit"
                isFront={true}
                title="Save change"
                icon={isLoading ? <Loading /> : ""}
                className={`rounded ${
                  isUpdate ? "bg-neon_pink" : "bg-green-500"
                } text-white w-auto text-sm hover:font-medium hover:shadow-md`}
              />
            </div>
          </form>
        </MyModal>
      </div>
    </>
  );
}
