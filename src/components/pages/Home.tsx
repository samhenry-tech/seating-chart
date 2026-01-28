import { Header } from "~/components/organisms/Header";
import { useEffect } from "react";
import { useViewportSize } from "react-window-size-listener";
import { SeatingChart } from "../organisms/SeatingChart";
import { TestingPage } from "./TestingPage";

export const Home = () => {
  const { height: viewportHeight } = useViewportSize();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [viewportHeight]);

  return <TestingPage />;

  // return (
  //   <section className="relative flex w-full flex-col" style={{ height: viewportHeight }}>
  //     <Header />
  //     <section className="flex w-full grow overflow-hidden">
  //       <SeatingChart />
  //     </section>
  //   </section>
  // );
};
