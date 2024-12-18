import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = () => {
  // Get the current domain
  const domain = window.location.origin;
  const imageUrl = `${domain}/lovable-uploads/b9564315-bfbd-4e0e-81a0-0a8691166159.png`;

  return (
    <Helmet>
      <title>Rocky's Lemonade - Lemon Law Intake</title>
      <meta property="og:title" content="Rocky's Lemonade - Lemon Law Intake" />
      <meta property="og:description" content="Submit your lemon law case to Rocky's Lemonade" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Rocky's Lemonade - Lemon Law Intake" />
      <meta name="twitter:description" content="Submit your lemon law case to Rocky's Lemonade" />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetaTags;