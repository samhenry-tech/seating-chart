import { Header } from "~/components/organisms/Header";
import { SeatingChart } from "../organisms/SeatingChart";

export const Home = () => {
  return (
    <>
      <Header />
      <section className="flex w-full grow overflow-hidden">
        <SeatingChart />
      </section>
    </>
  );
};
