
import { Layout } from "@/components/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using IPL Stats Symphony, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Content</h2>
          <p>
            All content provided on IPL Stats Symphony is for informational purposes only. The statistics, analysis, and other information available on our website are derived from various sources, and while we strive for accuracy, we cannot guarantee the completeness or reliability of this information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            All content, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of IPL Stats Symphony or its content suppliers and is protected by international copyright laws.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Conduct</h2>
          <p>
            When using IPL Stats Symphony, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use our website in any way that violates any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any part of our website</li>
            <li>Use our website to transmit any harmful code or material</li>
            <li>Copy, reproduce, or distribute the content without prior written permission</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            IPL Stats Symphony shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Your continued use of IPL Stats Symphony after any such changes constitutes your acceptance of the new Terms and Conditions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
          
          <p className="mt-8">
            If you have any questions about these Terms and Conditions, please contact us at legal@iplstats.symphony.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
