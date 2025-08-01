const TenantControls = ({ user, isPropertyManager, setShowAddTenantModal }) => {
  if (!user || (!["admin", "superAdmin"].includes(user?.role) && !isPropertyManager)) return null;

  return (
    <div className="col-sm-1 col-2" style={{ paddingRight: "0px" }}>
      <div className="plus_icon pointer">
        <div
          className="plus_icon_inner"
          onClick={() => setShowAddTenantModal(true)}
        >
          <span className="material-symbols-outlined">add</span>
        </div>
      </div>
    </div>
  );
};

export default TenantControls;
