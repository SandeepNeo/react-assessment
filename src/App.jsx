import { useRoutes } from 'react-router-dom';
import Providers from './app/providers';
import routes from './app/routes';

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}
