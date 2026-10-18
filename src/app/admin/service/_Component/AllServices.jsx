"use client";

import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useState } from "react";
import { useGetServicesQuery } from "@/redux/api/serviceApi";
import { Pagination, Skeleton } from "antd";
import AddserviceModal from "@/components/SharedModals/AddServiceModal";

export default function AllServices() {
  const [showCreatebannerModal, setShowCreatebannerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // get services from api
  const { data, isLoading } = useGetServicesQuery({
    limit: 10,
    page: currentPage,
  });
  const services = data?.data || [];
  const totalPage = data?.meta?.totalPage;

  if (isLoading)
    return (
      <div className="space-y-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2">
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
        </div>
      </div>
    );
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-16 w-16 text-neutral-500" />
        <p className="text-neutral-500">No services found.</p>
        {/* Pagination */}
        <div className="flex items-center justify-center !gap-4 !pt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm text-neutral-400">
            Page <span className="text-white">1</span> of 10
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            // disabled={currentPage === totalPage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto !w-full">
      {/* Regular Services Grid */}
      <div className="grid grid-cols-1 !gap-10 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Pagination
      <div className="flex items-center justify-center !gap-4 !pt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-sm text-neutral-400">
          Page <span className="text-white">1</span> of 10
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPage}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div> */}

      <Pagination
        className="mt-10 flex justify-end"
        current={currentPage}
        total={totalPage}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
      />
      <AddserviceModal
        open={showCreatebannerModal}
        setOpen={setShowCreatebannerModal}
      />
    </div>
  );
}
