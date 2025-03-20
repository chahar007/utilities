
import { Layout } from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            Welcome to IPL Stats Symphony, your premier destination for comprehensive Indian Premier League statistics and analysis.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            At IPL Stats Symphony, we are passionate about bringing cricket enthusiasts the most accurate, up-to-date, and insightful IPL statistics. Our mission is to enhance your cricket viewing experience by providing you with detailed analytics that tell the complete story behind the numbers.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            Our team consists of cricket analytics experts, data scientists, and passionate cricket fans who work tirelessly to ensure that you get the most comprehensive IPL statistics and insights. We believe in the power of data to reveal patterns and stories that might otherwise go unnoticed.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Real-time points table updates</li>
            <li>In-depth player performance analytics</li>
            <li>Interactive player comparison tools</li>
            <li>Historical team performance data</li>
            <li>Match predictions based on statistical models</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Journey</h2>
          <p>
            IPL Stats Symphony was founded in 2023 with a simple goal: to make cricket statistics accessible, understandable, and enjoyable for fans. Since then, we've grown to become one of the most trusted sources for IPL statistics and analytics.
          </p>
          
          <p className="mt-8">
            Thank you for being a part of our cricket-loving community. We're excited to continue enhancing your IPL experience with powerful statistics and insights.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
