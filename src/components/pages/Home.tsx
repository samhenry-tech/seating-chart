import { Header } from "@/components/organisms/Header";
import { SeatingChart } from "../organisms/SeatingChart";

export const Home = () => {
  return (
    <>
      <Header />
      <div className="absolute top-0 bottom-0 left-[50%] border-l border-black" />
      <div className="absolute top-[50%] right-0 left-0 border-t border-black" />
      <section className="flex w-full grow overflow-hidden">
        <SeatingChart />
      </section>
    </>
  );
};
