/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import ReviewView from './ReviewView';
import ArtistView from './ArtistView';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reviews/:id" element={<ReviewView />} />
            <Route path="artists/:id" element={<ArtistView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
