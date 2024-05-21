import React from "react";
import MainLayout from "../layouts/main-layout";

const PrivacyPolicy = () => (
  <MainLayout className="PrivacyPage">
    <article className="container mt-6">
      <h1 className="title is-1">Privacy Policy</h1>

      <p>
        <strong>Effective Date:</strong> May 2024
      </p>
      <p>
        <strong>Living Company</strong> values your privacy and is committed to
        protecting your personal information. This Privacy Policy outlines how
        we collect, use, and protect your data.
      </p>

      <h2 className="title is-4 mb-0">Information Collection</h2>
      <p>
        We may collect personal information such as your name, email address,
        and contact details when you interact with our website or services.
      </p>
      <h2 className="title is-4 mb-0">Use of Information</h2>
      <p>
        The information we collect is used solely to provide and improve our
        services, communicate with you, and enhance your experience with Living
        Company.
      </p>
      <h2 className="title is-4 mb-0">Data Protection</h2>
      <p>
        We implement appropriate security measures to protect your personal
        information from unauthorized access, alteration, or disclosure.
      </p>
      <h2 className="title is-4 mb-0">No Sale or Misuse of Data</h2>
      <p>
        Living Company will never sell, trade, or misuse your personal
        information. We are committed to maintaining your trust and ensuring
        your data is used only for legitimate business purposes.
      </p>
      <h2 className="title is-4 mb-0">Contact Us</h2>
      <p>
        If you have any questions or concerns about our Privacy Policy, please
        contact us at{" "}
        <a href="mailto:contact@livingcompany.com">contact@livingcompany.com</a>
        .
      </p>
      <h2 className="title is-4 mb-0">Changes to Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated effective date.
      </p>
      <p>
        By using our services, you agree to the terms of this Privacy Policy.
      </p>
      <p>
        <strong>Living Company</strong>
      </p>
    </article>
  </MainLayout>
);

export default PrivacyPolicy;
