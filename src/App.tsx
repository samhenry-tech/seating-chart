import { Home } from "./components/pages/Home";
import { SearchProvider } from "./contexts/SearchContext";
import { SeatingChartProvider } from "./contexts/SeatingChartContext";

const App = () => (
  <SeatingChartProvider>
    <SearchProvider>
      <Home />
    </SearchProvider>
  </SeatingChartProvider>
);

export default App;
