
import { Layout } from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <p>
            At IPL Stats Symphony, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> We may collect personal information such as your name and email address when you subscribe to our newsletter or contact us.
          </p>
          <p>
            <strong>Log Data:</strong> Like many websites, we collect information that your browser sends whenever you visit our site. This may include your computer's IP address, browser type, browser version, and the pages of our site that you visit.
          </p>
          <p>
            <strong>Cookies:</strong> We use cookies to collect information and improve your browsing experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Communicate with you for customer service and updates</li>
            <li>Send you newsletters if you've subscribed</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our website, provide services on our behalf, perform website-related services, or assist us in analyzing how our website is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Analytics</h2>
          <p>
            We may use third-party service providers to monitor and analyze the use of our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal information we have about you</li>
            <li>Correct any inaccuracies in your information</li>
            <li>Request the deletion of your information</li>
            <li>Object to the processing of your information</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <p className="mt-8">
            If you have any questions about this Privacy Policy, please contact us at privacy@iplstats.symphony.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
