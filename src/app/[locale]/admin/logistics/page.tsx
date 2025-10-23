"use client";

import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import * as Yup from "yup";
// Components
import DeleteModal from "@/components/deleteModal";
import IconButton from "@/components/iconButton";
import Pagination from "@/components/pagination";

// Icons and utils
import { DELETE_BRANDING } from "@/api/brand";
import { CREATE_LOGISTICS, UPLOAD_LOGISTICS } from "@/api/logistics";
import Breadcrumb from "@/components/breadCrumb";
import Chip from "@/components/chip";
import MyModal from "@/components/modal";
import Select from "@/components/select";
import StatusBadge from "@/components/status";
import Textfield from "@/components/textField";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import { AddIcon, CancelIcon, EditIcon, TrashIcon } from "@/icons/page";
import { ILogisticsData } from "@/types/brand";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { LogisticsOpion, TransportModeOption } from "@/utils/option";
import { replaceSize } from "@/utils/resizeImage";
import { useToast } from "@/utils/toast";
import { useFetchLogistics } from "./hooks/useFetchLogistics";
interface FormValues {
  status: string;
  transport_modes: string[];
}

export default function Logistics() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();
  const [deleteBranding] = useMutation(DELETE_BRANDING);

  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranding, setSelectedBranding] = useState<ILogisticsData>();
  const [logistics, setLogistics] = useState<ILogisticsData[]>();
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [logo, setLogo] = useState("");
  const {
    filters,
    updateKeyword,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
    fetchBrandings
  } = useFetchLogistics();
  const [createLogistics] = useMutation(CREATE_LOGISTICS);
  const [updateLogistics] = useMutation(UPLOAD_LOGISTICS)

  useEffect(() => {
    if (data?.getLogistics?.data) setLogistics(data?.getLogistics?.data);
  }, [data?.getLogistics?.data]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    updateKeyword(e.target.value); // Triggers debounce logic
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateKeyword(searchInput); // Immediately trigger search on "Enter"
    }
  };

  const handlePageChange = (page: number) => {
    updatePage(page); // Update filter state with new page
  };



  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteBranding({
        variables: {
          deleteBrandingId: selectedBranding?.id,
        },
      });

      successMessage({
        message: "Delete branding successful!.",
        duration: 3000,
      });
      setIsOpen(false);

      const updateBranding = logistics?.filter(
        ({ id }) => id !== selectedBranding?.id
      );
      setLogistics(updateBranding);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBranding = (branding: ILogisticsData) => {
    setSelectedBranding(branding);
    setIsOpen(true);
  };

  if (error) return <p>Error: {error.message}</p>;
  const totalItems: number = data?.getBrandings?.total;
  const handleRemoveCoverImage = (e: any) => {
    e.preventDefault();
    setSelectedImage(null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image"
  ) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedImage(files[0]);
  };
  const validationSchema = Yup.object({
    company_name: Yup.string().required("Company name is required"),
    status: Yup.string().required("Status is required"),
    transport_modes: Yup.array().of(Yup.string()).min(1, "Select at least one mode"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      company_name: "",
      cost: 0,
      logo: null,
      status: "",
      transport_modes: [],
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true)
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await response.json();
        // Update Formik field with uploaded URL
        values.logo = data.secure_url;
      }
      try {
        if (isEditOpen) {
          const { id, ...updateData } = values
          const result = await updateLogistics({
            variables: {
              updateLogicticsId: values?.id,
              data: updateData,
            },
          });
          if (result?.data?.updateLogictics?.success) {

            if (selectedImage && logo) {
              await fetch("/api/delete-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secureUrl: logo }),
              });
            }
            setIsEditOpen(false)
            formik.resetForm()
            successMessage({
              message: "Update Logistics successful!.",
              duration: 3000,
            });
            fetchBrandings()
          } else {
            errorMessage({
              message: result?.data?.updateLogictics?.error?.message,
              duration: 3000,
            });
          }
        } else {
          const { id, ...dateData } = values
          const result = await createLogistics({
            variables: {
              data: dateData,
            },
          });

          if (result?.data?.createLogistics?.data?.id) {
            setCreateOpen(false)
            formik.resetForm()
            successMessage({
              message: "Added Logistics successful!.",
              duration: 3000,
            });
            fetchBrandings()
          } else {
            errorMessage({
              message: result?.data?.createLogistics?.error?.message,
              duration: 3000,
            });
          }

        }

      } catch (error) {
        console.error("Error uploading image:", error);
        errorMessage({
          message: "Added Logistics failed!.",
          duration: 3000,
        });
      } finally {
        setLogo("")
        formik.setSubmitting(false)
      }
    },
  });

  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Logistics management", value: "/admin/logistics" },
          ]}
        />
        <div>
          <IconButton
            className="rounded text-white p-2 bg-neon_pink text-sm"
            icon={<AddIcon size={18} />}
            isFront={true}
            title={"Add New"}
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="w-full space-x-4 flex text-gray-600 justify-between">
        <div className="flex space-x-4">
          <div>
            <p className="text-sm text-gray-500">Search</p>
            <input
              type="text"
              value={searchInput}
              placeholder="Search ..."
              onChange={handleSearchInput}
              onKeyDown={handleKeyPress}
              className="h-9 text-sm p-2 rounded w-full border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <p className="mx-2 text-gray-500 text-sm">Start date</p>
              <input
                type="date"
                onChange={(e) =>
                  updatedAtRange(
                    e.target.value,
                    filters.dateRange?.endDate || ""
                  )
                }
                className="h-9 text-sm p-2 rounded w-full  border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
              />
            </div>
            <div>
              <p className="mx-2 text-gray-500 text-sm">End date</p>
              <input
                type="date"
                onChange={(e) =>
                  updatedAtRange(
                    filters.dateRange?.startDate || "",
                    e.target.value
                  )
                }
                className="h-9 text-sm p-2 rounded w-full  border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Sort</p>
          <select
            onChange={(e) => updateSortBy(e.target.value)}
            className="h-9 text-sm p-2 rounded w-full border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
          >
            <option value="created_at_DESC">Created At (Newest)</option>
            <option value="created_at_ASC">Created At (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white h-auto rounded-md">
        <div className="w-full h-full overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {g("_table_no")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {g("_name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  {g("_created_at")}
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {logistics?.map((logic, index) => {
                return (
                  <tr className="bg-white border-b" key={logic?.id}>
                    <th scope="row" className="px-6 py-4">
                      {(filters.page - 1) * filters.limit + index + 1}
                    </th>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={`${replaceSize(
                          50,
                          50,
                          logic?.logo
                            ? logic?.logo
                            : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        )}`}
                        width={60}
                        height={60}
                        alt="Picture of the branding"
                      />
                      {logic.company_name}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {<StatusBadge status={logic.status} />}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateToDDMMYYYY(logic?.created_at)}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <EditIcon
                        onClick={() => {
                          setIsEditOpen(true)
                          formik.setFieldValue("id", logic.id)
                          formik.setFieldValue("company_name", logic.company_name)
                          formik.setFieldValue("status", logic.status)
                          formik.setFieldValue("cost", logic.cost)
                          formik.setFieldValue("transport_modes", logic.transport_modes)
                          formik.setFieldValue("logo", logic.logo)
                          setLogo(logic?.logo || "")
                        }
                        }
                        size={20}
                        className="cursor-pointer"
                      />
                      <TrashIcon
                        onClick={() => handleSelectBranding(logic)}
                        size={20}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-gray-600 flex items-end justify-end">
          <Pagination
            filter={{ page: filters.page, limit: filters.limit }}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <MyModal
        isOpen={createOpen || isEditOpen}
        onClose={() => { formik.resetForm(); setCreateOpen(false); setIsEditOpen(false) }}
        className="max-w-2xl"
        outside={false}
      >
        <form className="text-gray-700" onSubmit={formik.handleSubmit}>
          <h4>{isEditOpen ? "Edit logistics" : "Add new logistics"}</h4>
          <div className="my-5">
            <Textfield title="Company name" placeholder="Enter company name" name="company_name"
              value={formik.values.company_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.errors.company_name}
            />
            <Textfield title="Cost" type="number" placeholder="Cost"
              name="cost"
              value={formik.values.cost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} helperText={formik.errors.cost} />

            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-2">
                Logo
              </label>
              <div className="relative w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                {selectedImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 z-10 bg-white p-0.5 rounded-full text-red-500 hover:text-red-700 shadow"
                      onClick={handleRemoveCoverImage}
                    >
                      <CancelIcon className="w-5 h-5 text-primary hover:text-primary" />
                    </button>
                  </>
                ) : formik.values.logo ? (
                  <img
                    src={formik.values.logo}
                    alt="Cover Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Select to logo</span>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="my-5">
              <label>Status</label>
              <Select option={LogisticsOpion} name="status"
                value={formik.values.status}
                onChange={(val) => {
                  formik.setFieldValue("status", val.target.value)
                }} />
              {formik.errors.status && (
                <label className="text-xs text-primary">{formik.errors.status}</label>
              )}
            </div>
            <div className="my-5">
              <label>Transport modes</label>
              <Select option={TransportModeOption} name="transport_modes"
                value={
                  (formik.values.transport_modes as any[])?.[
                  (formik.values.transport_modes as any[]).length - 1
                  ] || ""
                }
                onChange={(val) => {
                  const selectedValue = val.target.value as any;
                  const currentValues = (formik.values.transport_modes as any[]) || [];
                  if (selectedValue === "") return;
                  if (!currentValues.includes(selectedValue as any)) {
                    formik.setFieldValue("transport_modes", [...currentValues, selectedValue]);
                  }
                }} />
              <div className="flex gap-2 mt-2">
                {(formik.values.transport_modes as any[])?.map((mode: any, idx: number) => (
                  <Chip key={idx} label={mode} onClick={() => {
                    const updatedModes = (formik.values.transport_modes as any[]).filter(
                      (m) => m !== mode
                    );
                    formik.setFieldValue("transport_modes", updatedModes);
                  }} />
                ))}
              </div>
              {formik.errors.transport_modes && (
                <label className="text-xs text-primary">{formik.errors.transport_modes}</label>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <IconButton title="Close" className="rounded text-black p-2 bg-gray-100 text-sm"
              onClick={() => {
                formik.resetForm()
                setCreateOpen(false)
                setIsEditOpen(false)
              }} />
            <IconButton title={formik.isSubmitting ? "Submiting..." : "Submit"} className="rounded text-white p-2 bg-base text-sm" />
          </div>
        </form>
      </MyModal>
      <DeleteModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleDelete()}
      />
    </div>
  );
}
