import React, { useEffect } from "react";

function AdminDashboard() {
  useEffect(() => {
    console.log("Admin Dashboard loaded");
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}

export default AdminDashboard;


