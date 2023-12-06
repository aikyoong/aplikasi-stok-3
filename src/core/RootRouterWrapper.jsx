import { Outlet } from "@tanstack/react-router";

function Root() {
  // useAutoLogout();
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default Root;
