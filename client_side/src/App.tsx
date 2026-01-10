import './App.css';
import './i18n/i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from './infrastructure/graphql/graphql-client';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import PostDetailPage from './pages/PostDetailPage';

const App = () => {
  return (
    <ApolloProvider client={graphqlClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Redirect root to /en */}
            <Route path="/" element={<Navigate to="/en" replace />} />
            
            {/* Language-aware routes */}
            <Route path="/:lang" element={<HomePage />} />
            <Route path="/:lang/categories" element={<CategoriesPage />} />
            <Route path="/:lang/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/:lang/posts/:slug" element={<PostDetailPage />} />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/en" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
