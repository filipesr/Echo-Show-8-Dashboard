import Dashboard from "@/components/Dashboard";
import DeviceFrame from "@/components/DeviceFrame";
import { getLocalPhotos } from "@/lib/photos";

// Server component: lists /public/photos at build time and hands the list
// to the client. DeviceFrame detects standalone mode and picks the layout.
export default function Home() {
  return (
    <DeviceFrame>
      <Dashboard photos={getLocalPhotos()} />
    </DeviceFrame>
  );
}
