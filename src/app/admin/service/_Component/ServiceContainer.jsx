"use client";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import AllServices from "./AllServices";
import AddserviceModal from "@/components/SharedModals/AddServiceModal";


const ServiceContainer = () => {
  const [showCreatebannerModal, setShowCreatebannerModal] = useState(false);
  return (
    <div>
      <div>
        {/* add service section */}
        <div className="mb-10 flex items-center justify-between">
          <Button
            type="primary"
            size="large"
            icon={<PlusCircle size={20} />}
            iconPosition="start"
            className="!w-full !py-6"
            onClick={() => setShowCreatebannerModal(true)}
          >
            Add New Service
          </Button>
        </div>

        <AllServices />
      </div>

      <AddserviceModal
        open={showCreatebannerModal}
        setOpen={setShowCreatebannerModal}
      />
    </div>
  );
};

export default ServiceContainer;
