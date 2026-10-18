"use client";
import React, { useState } from "react";
import GalleryList from "../../gallerry/_Component/GalleryContainer";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";
import AddNewGelleryModal from "./AddNewGelleryModal";

const GelleryContainer = () => {
  const [showCreatebannerModal, setShowCreatebannerModal] = useState(false);
  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <Button
          type="primary"
          size="large"
          icon={<PlusCircle size={20} />}
          iconPosition="start"
          className="!w-full !py-6"
          onClick={() => setShowCreatebannerModal(true)}
        >
          Add New Gellary Image
        </Button>
      </div>

      <GalleryList />

      <AddNewGelleryModal
        open={showCreatebannerModal}
        setOpen={setShowCreatebannerModal}
      />
    </div>
  );
};

export default GelleryContainer;
