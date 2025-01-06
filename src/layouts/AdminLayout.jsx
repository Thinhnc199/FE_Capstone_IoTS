function AdminLayout(children) {
  return (
    <div className="h-screen flex flex-col overflow-y-hidden no-scrollbar">
      <h1 className="text-red-500">HeaderHeaderAdminTest</h1>
      <div className="flex h-[calc(100vh-60px)] overflow-y-hidden no-scrollbar bg-mainColer">
        <h1 className="text-red-500">SidebarAdminTest</h1>
        <div className="flex-1 overflow-y-scroll bg-white rounded-md">
          <div className="p-4 ">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
