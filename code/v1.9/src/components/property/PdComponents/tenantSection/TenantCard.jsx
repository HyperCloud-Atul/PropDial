import { Link } from "react-router-dom";
import { firstLetterCapitalize } from "../../../../utils/lib";

const TenantCard = ({ tenant, confirmDeleteTenant, user }) => (
  <div
    className={`tc_single relative item ${
      tenant.status === "inactive" ? "t_inactive" : ""
    }`}
  >
    <Link className="left" 
    // to={`/tenantdetails/${tenant.id}`} 
    >
      <div className="tcs_img_container">
        <img
          src={tenant.tenantImgUrl || "/assets/img/dummy_user.png"}
          alt="Preview"
        />
      </div>
      <div className="tenant_detail">
        <h6 className="t_name">
          {tenant.name ? firstLetterCapitalize(tenant.name) : "Tenant Name"}
        </h6>
        <h6 className="t_number">
          {tenant.mobile
            ? tenant.mobile.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")
            : "Tenant Phone"}
        </h6>
        <h6 className="t_number">{tenant?.emailId}</h6>
        {user?.role === "superAdmin" && (
   <h6
          className="text_red"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmDeleteTenant(tenant.id, tenant.userId);
          }}
          style={{ fontSize: "10px", letterSpacing: "0.4px" }}
        >
          Delete
        </h6>
        )}
     
      </div>
    </Link>
    <div className="wha_call_icon">
      <Link className="call_icon wc_single" to={`tel:+${tenant?.mobile}`}>
        <img src="/assets/img/simple_call.png" alt="call" />
      </Link>
      <Link className="wha_icon wc_single" to={`https://wa.me/+${tenant.mobile}`}>
        <img src="/assets/img/whatsapp_simple.png" alt="whatsapp" />
      </Link>
    </div>
  </div>
);

export default TenantCard;
