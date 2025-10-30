import { Outlet } from 'react-router-dom';
import { Header } from './components/header';
import { SearchProvider } from './context/SearchContext'; // 1. Import

function App() {
  return (
    // 2. Wrap everything in the SearchProvider
    <SearchProvider>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </SearchProvider>
  );
}

export default App;