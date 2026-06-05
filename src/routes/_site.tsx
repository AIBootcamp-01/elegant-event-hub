import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/_site")({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
