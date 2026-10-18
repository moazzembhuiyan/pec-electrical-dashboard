"use client";

import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { useDeleteServiceMutation } from "@/redux/api/serviceApi";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import EditServiceModal from "./EditserviceModal";


export default function ServiceCard({ service }) {
  const [open, setOpen] = useState(false);
  const [deleteService, { isLoading }] = useDeleteServiceMutation();

  const handleDeleteService = async (id) => {
    try {
      const res = await deleteService(id).unwrap();
      if (res.success) {
        toast.success("Service deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the service");
    }
  };

  return (
    <>
      <div className="group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <Image
            src={service.images?.[0] || "/placeholder.svg"}
            alt={service.type}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        <div className="relative flex h-[300px] min-h-[300px] flex-col justify-between !p-6">
          <div className="flex items-center justify-end gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
              <CustomConfirm
                title="Delete"
                content="Are you sure to delete this service?"
                description="Are you sure to delete this service?"
                onConfirm={() => handleDeleteService(service._id)}
                okText="Yes, Delete"
                cancelText="Cancel"
                disabled={isLoading}
                loading={isLoading}
              >
                <Trash className="text-white" size={20} />
              </CustomConfirm>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500"
            >
              <Edit className="text-white" size={20} />
            </button>
          </div>

          <div className="!space-y-2">
            <h3 className="text-2xl font-semibold text-white">{service.type}</h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditServiceModal
        open={open}
        service={service}
        onClose={() => setOpen(false)}
        onSuccess={() => setOpen(false)}
      />
    </>
  );
}