import React from 'react';

const categories = [
  'Motorcycle Helmet',
  'Biker Equipment',
  'Airbag / Protection',
  'Spare Parts / Accessories',
  'Sportswear',
  'Scooter Equipment',
];

const CategoriesPage = ({ onSelectCategory }) => (
  <section className="categories-page">
  <h2>Categories</h2>
    <ul>
      {categories.map((cat) => (
        <li key={cat}>
          <button onClick={() => onSelectCategory(cat)}>{cat}</button>
        </li>
      ))}
    </ul>
  </section>
);

export default CategoriesPage;
