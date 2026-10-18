"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { useDeleteGalleryItemMutation } from "@/redux/api/gellary";
import { Trash } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GellaryCard({ service }) {
  // delete service handler
  const [deleteService, { isLoading }] = useDeleteGalleryItemMutation();
  const handledeleteService = async (id) => {
    try {
      const res = await deleteService(id).unwrap();
      if (res.success) {
        toast.success("Gellary deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the Gellary");
    }
  };
  return (
    <div className="group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </div>

      <div className="relative flex h-[300px] min-h-[300px] flex-col justify-between !p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
          <CustomConfirm
            title="Delete"
            content="Are you sure to delte this service?"
            description="Are you sure to delte this service?"
            onConfirm={() => {
              handledeleteService(service._id);
            }}
            okText="Yes, Delete"
            cancelText="Cancel"
            disabled={isLoading}
            loading={isLoading}
          >
            <Trash className="text-white" size={20} />
          </CustomConfirm>
        </div>
        <h1></h1>
        <div className="!space-y-2">
          {" "}
          <h3 className="text-2xl font-semibold text-white">
            {service.title}
          </h3>{" "}
          <p className="text-sm leading-relaxed text-neutral-300">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
