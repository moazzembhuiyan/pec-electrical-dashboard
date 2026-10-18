"use client";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import Link from "next/link";
import BookingTable from "../../booking-management/_Component/BookingTable";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import Image from "next/image";
import { Skeleton } from "antd";

export default function DashboardContainer() {
  const { data, isLoading, isError } = useGetDashboardDataQuery();

  if (isLoading)
    return (
      <div className="space-y-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2">
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "120px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "120px" }}
            block={true}
          />
        </div>

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
        </div>
      </div>
    );

  if (isError) {
    return <div>Error fetching data: {isError}</div>;
  }

  const userStats = [
    {
      key: "users",
      title: "Total Service",
      count: data?.data?.totalService || 0,
    },
    {
      key: "customers",
      title: "Total Booking Request",
      count: data?.data?.totalBooking || 0,
    },
  ];

  const services = data?.data?.services || [];
  const gallery = data?.data?.servicePhotos || [];

  return (
    <div className="space-y-20">
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 2xl:grid-cols-3">
        {userStats?.map((stat) => (
          <div
            key={stat.key}
            className="gap-x-4 rounded-2xl bg-[#FFFFFF] p-5 text-black shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-dmSans text-lg font-medium">{stat.title}</p>
                <h5 className="mt-0.5 text-3xl font-semibold text-black">
                  {stat.key !== "earning" ? (
                    <CustomCountUp end={stat.count} />
                  ) : (
                    <span>
                      $<CustomCountUp end={stat.count} />
                    </span>
                  )}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Services and Gallery Sections */}
      <section className="flex-center-between flex-col gap-10 lg:flex-row">
        {/* Services Section */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="my-2 text-2xl font-semibold">Services</h1>
            <Link
              href="/admin/gallery"
              className="text-blue-600 hover:underline"
            >
              See All
            </Link>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {services?.length > 0 ? (
              services?.slice(0, 3).map((service) => (
                <div
                  key={service._id}
                  className="flex items-start gap-4 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={service.images[0] || "/placeholder-image.jpg"}
                      alt={service.type}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">
                      {service.type}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {service.description}
                    </p>
                    {service.images.length > 1 && (
                      <p className="mt-1 text-xs text-blue-600">
                        +{service.images.length - 1} more images
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-gray-500">
                No services available
              </p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="my-2 text-2xl font-semibold">Gallery</h1>
            <Link
              href="/admin/gallery"
              className="text-blue-600 hover:underline"
            >
              See All
            </Link>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 gap-3">
            {gallery?.length > 0 ? (
              gallery.flatMap((category) =>
                category?.images?.slice(0, 4).map((imageUrl, index) => (
                  <div
                    key={`${category.type}-${index}`}
                    className="group relative"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${category.type} gallery`}
                      width={150}
                      height={100}
                      className="h-24 w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20">
                      <span className="absolute bottom-2 left-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {category.type}
                      </span>
                    </div>
                  </div>
                )),
              )
            ) : (
              <p className="col-span-2 py-8 text-center text-gray-500">
                No gallery images available
              </p>
            )}
          </div>

          {/* Show category info if limited space */}
          {gallery?.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {gallery?.map((category) => (
                <p key={category.type} className="capitalize">
                  {category.type}: {category.images?.length} images
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        {/* Booking table */}
        <BookingTable limit={5} />
      </section>
    </div>
  );
}
