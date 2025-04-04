import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "12 Healthy Fruits and Vegetables Must-Haves to Stock Your Fridge",
    excerpt: "Discover the essential fruits and vegetables that should always be in your kitchen for optimal health and nutrition.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    date: "16 Nov 2022",
    author: "Admin",
    category: "Nutrition"
  },
  {
    id: 2,
    title: "Great bulk recipes to help use all your organic vegetables",
    excerpt: "Learn how to create delicious meals using seasonal vegetables from your organic produce delivery.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    date: "16 Nov 2022",
    author: "Admin",
    category: "Recipes"
  },
  {
    id: 3,
    title: "The Benefits of Supporting Local Organic Farmers",
    excerpt: "Explore how choosing local organic produce helps both your health and your community.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    date: "16 Nov 2022",
    author: "Admin",
    category: "Community"
  }
];

const Blog = () => {
  return (
    <div id="blog" className="py-20 bg-dark-green-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-green-400 text-lg mb-2">From Our Blog</h3>
          <h2 className="text-4xl font-bold text-white mb-4">Latest News</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay updated with our latest articles about organic farming, healthy recipes, and sustainable living.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                  <a href="#">{post.title}</a>
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                >
                  <span className="mr-2">Read more</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            <span>View All Posts</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Blog;
