import { Home } from "./components/pages/Home";
import { SearchProvider } from "./contexts/SearchContext";

export const App = () => (
  <SearchProvider>
    <Home />
  </SearchProvider>
);
