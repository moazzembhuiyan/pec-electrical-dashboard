import React from "react";
import GelleryContainer from "./_Component/GelleryContainer";

export async function generateMetadata() {
  return {
    title: "Gallery Management",
    description:
      "Manage and oversee all gallery items within the admin dashboard.",
  };
}

export default function page() {
  return (
    <div>
      {/* <GalleryList /> */}
      <GelleryContainer />
    </div>
  );
}
