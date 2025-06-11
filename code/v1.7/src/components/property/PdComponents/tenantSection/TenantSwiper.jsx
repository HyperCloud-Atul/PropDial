import { Swiper, SwiperSlide } from "swiper/react";
import TenantCard from "./TenantCard";

const TenantSwiper = ({ user, tenantDocument, confirmDeleteTenant }) => {
  return (
    <div
      className={`${
        user && ["admin", "superAdmin"].includes(user?.role)
          ? "col-sm-11 col-10"
          : "col-12"
      }`}
    >
      <div className="tenant_card">
        <Swiper
          spaceBetween={15}
          slidesPerView={3.5}
          freeMode={true}
          className="all_tenants"
          breakpoints={{
            320: { slidesPerView: 1.1, spaceBetween: 10 },
            767: { slidesPerView: 1.5, spaceBetween: 15 },
            991: { slidesPerView: 2.5, spaceBetween: 15 },
            1199: { slidesPerView: 3.5, spaceBetween: 15 },
          }}
        >
          {tenantDocument?.map((tenant, index) => (
            <SwiperSlide key={index}>
              <TenantCard
                tenant={tenant}
                confirmDeleteTenant={confirmDeleteTenant}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TenantSwiper;
