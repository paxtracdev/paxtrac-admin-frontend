import blogImg1 from "../../assets/images/blogimg.png";
import blogImg2 from "../../assets/images/businessImg1.png";
import blogImg3 from "../../assets/images/businessImg2.png";
import blogImg4 from "../../assets/images/businessImg3.png";

const STORAGE_KEY = "paxtrac_admin_blogs_data";

export const INITIAL_BLOGS = [
  {
    id: "blog-101",
    title: "Top 10 Strategies for Effective Property Management in 2026",
    slug: "top-10-strategies-for-effective-property-management-in-2026",
    category: "Property Management",
    author: "Admin Panel",
    date: "2026-10-01",
    image: blogImg1,
    excerpt: "Discover the best industry strategies to streamline your property listings and maximize ROI in today's dynamic market.",
    description: `
      <p>Managing properties effectively in 2026 requires a robust combination of smart technology, transparent vendor relations, and automated maintenance tracking.</p>
      <h3>1. Leverage Integrated Admin Dashboards</h3>
      <p>With modern platforms like <strong>PaxTrac</strong>, property managers can handle bid management, contract approvals, and tenant verifications in a centralized location.</p>
      <h3>2. Emphasize Preventive Maintenance</h3>
      <p>Addressing minor building issues before they escalate ensures tenant satisfaction and prevents severe structural overhead down the line.</p>
      <p>Implementing regular scheduled inspections guarantees compliance with safety guidelines and keeps property values high.</p>
    `,
    status: "Published",
    views: 1240,
  },
  {
    id: "blog-102",
    title: "Navigating Real Estate Bidding & Contract Compliance",
    slug: "navigating-real-estate-bidding-contract-compliance",
    category: "Real Estate Trends",
    author: "PaxTrac Editorial",
    date: "2026-09-28",
    image: blogImg2,
    excerpt: "Learn how transparent bid management protects vendors and property owners while maintaining full regulatory compliance.",
    description: `
      <p>Contract compliance is essential for risk reduction and smooth real estate operations.</p>
      <p>By standardizing bid documentation and review protocols, administrators ensure full audit readiness for all participating service vendors.</p>
      <h4>Key Takeaways:</h4>
      <ul>
        <li>Standardized vendor bidding workflows</li>
        <li>Automated contract versioning and tracking</li>
        <li>Instant alert notifications for contract renewals</li>
      </ul>
    `,
    status: "Published",
    views: 890,
  },
  {
    id: "blog-103",
    title: "Streamlining Tenant Onboarding with Digital Solutions",
    slug: "streamlining-tenant-onboarding-with-digital-solutions",
    category: "Tips & Guides",
    author: "Admin Panel",
    date: "2026-09-15",
    image: blogImg3,
    excerpt: "Explore digital identity verification, online lease execution, and automated background checks for modern leasing.",
    description: `
      <p>Modern tenants expect seamless, mobile-friendly onboarding experiences when signing lease contracts.</p>
      <p>Digital verification reduces application processing times from days to minutes, ensuring low vacancy rates and higher retention.</p>
    `,
    status: "Draft",
    views: 410,
  },
  {
    id: "blog-104",
    title: "The Future of Commercial Real Estate & Smart Contracts",
    slug: "future-of-commercial-real-estate-smart-contracts",
    category: "Real Estate Trends",
    author: "Tech Team",
    date: "2026-09-02",
    image: blogImg4,
    excerpt: "How automated agreements and electronic signatures are transforming commercial lease contracts worldwide.",
    description: `
      <p>Smart contracts and automated lease renewals are redefining real estate management across commercial sectors.</p>
      <p>Electronic signatures coupled with automated ledger tracking reduce dispute potential and guarantee transparent records.</p>
    `,
    status: "Published",
    views: 1530,
  },
];

// Helper to get blogs from localStorage or initialize with default data
export const getStoredBlogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading blogs from localStorage:", error);
    return INITIAL_BLOGS;
  }
};

// Helper to save blogs to localStorage
export const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (error) {
    console.error("Error saving blogs to localStorage:", error);
  }
};

// CRUD helpers
export const getBlogById = (id) => {
  const blogs = getStoredBlogs();
  return blogs.find((b) => String(b.id) === String(id));
};

export const addBlogItem = (newBlog) => {
  const blogs = getStoredBlogs();
  const created = {
    id: `blog-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    views: 0,
    ...newBlog,
  };
  const updatedList = [created, ...blogs];
  saveStoredBlogs(updatedList);
  return created;
};

export const updateBlogItem = (id, updatedData) => {
  const blogs = getStoredBlogs();
  const index = blogs.findIndex((b) => String(b.id) === String(id));
  if (index !== -1) {
    blogs[index] = { ...blogs[index], ...updatedData };
    saveStoredBlogs(blogs);
    return blogs[index];
  }
  return null;
};

export const deleteBlogItem = (id) => {
  const blogs = getStoredBlogs();
  const updatedList = blogs.filter((b) => String(b.id) !== String(id));
  saveStoredBlogs(updatedList);
  return updatedList;
};
