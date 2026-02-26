import { Header } from "~/components/organisms/Header";
import { useViewportSize } from "react-window-size-listener";
import { SeatingChart } from "../organisms/SeatingChart";

export const Home = () => {
  const { height: viewportHeight } = useViewportSize();

  return (
    <section className="relative flex w-full flex-col" style={{ height: viewportHeight }}>
      <Header />
      <section className="relative flex w-full grow overflow-hidden">
        <SeatingChart />
      </section>
    </section>
  );
};
