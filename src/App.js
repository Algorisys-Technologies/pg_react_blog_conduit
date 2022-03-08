import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.scss';
import Navbar from './components/navbar';
import GlobalFeed from './pages/global-feed';
import Login from './pages/login';
import Register from './pages/register';
import { useFetch } from './hooks/use-fetch';
import { CurrentUserProvider } from './providers/current-user-provider';
import ArticleEditor from './pages/article-editor';
import AuthenticatedRoute from './components/authenticated-route';
import FilteredArticles from './pages/filtered-articles';
import UserLoader from './components/user-loader';
import Article from './pages/article';


function App() {
  const [articles, setArticles] = useState([]);
  const [deleteArticleSlug, setDeleteArticleSlug] = useState();

  const [{ isLoading, response, error }, doFetch] = useFetch("articles");

  const [{ _a, _b, _c }, doFetchDelete] = useFetch(`articles/${deleteArticleSlug}`);

  useEffect(() => {
    if (!response) return;
    setArticles(response.articles);
  }, [response, error])

  const onArticleCreated = (article) => {
    // window.alert(JSON.stringify(article));
    setArticles([
      article,
      ...articles
    ])
  }

  const onArticleUpdated = (article) => {
    let updated = articles.map(a => {
      if (a.slug == article.slug) {
        return article;
      }
      return a;
    })

    setArticles([
      ...updated
    ])
  }

  const onArticleDeleted = (slug) => {
    setDeleteArticleSlug(slug);
  }

  useEffect(() => {
    if (!deleteArticleSlug) return;
    doFetchDelete({
      method: "delete"
    })
  }, [deleteArticleSlug]);

  useEffect(() => {
    doFetch({
      method: "get"
    })
  }, [deleteArticleSlug]);

  const onToggleFavs = (slug, status) => {
    let updated = articles.map(a => {
      if (a.slug == slug) {
        a.favorited = status;
        a.favorites_count = a.favorites_count + (status ? 1 : -1);
        return a;
      }
      return a;
    })

    setArticles([
      ...updated
    ])
  }

  return (
    <CurrentUserProvider>
      <UserLoader>
        <div className="container">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<GlobalFeed data={articles}
                onArticleDeleted={onArticleDeleted}
                onToggleFavs={onToggleFavs} />}
              />
              <Route path="/articles/:tag" element={<FilteredArticles
                onArticleDeleted={onArticleDeleted}
                onToggleFavs={onToggleFavs}
              />} />

              <Route path="/article/:slug" element={<Article />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 1st way using children in authenticated*/}
              {/* <Route path="/article/new" element={<AuthenticatedRoute>
              <ArticleEditor /></AuthenticatedRoute>} /> */}

              {/* 2nd way using <outlet /> in authenticated */}
              <Route path='/' element={<AuthenticatedRoute />}>
                <Route path='article/new'
                  element={<ArticleEditor onCreated={onArticleCreated} />} />
              </Route>

              <Route path='/' element={<AuthenticatedRoute />}>
                <Route path="/article/:slug/edit"
                  element={<ArticleEditor onUpdated={onArticleUpdated} />} />
              </Route>

            </Routes>

          </Router>
        </div>
      </UserLoader>
    </CurrentUserProvider>
  );
}

export default App;
