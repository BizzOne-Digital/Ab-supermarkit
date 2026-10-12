// One-time import of selected Google Business reviews as site testimonials.
// Per the client's decision, Google reviews aren't live-integrated — real reviews are
// manually curated in and shown via the existing Testimonial model/admin page.
//
// Usage: node utils/importGoogleReviews.js
import 'dotenv/config';
import connectDB from '../config/db.js';
import Testimonial from '../models/Testimonial.js';

const REVIEWS = [
  { customerName: 'Manjot Bajwa', review: 'Great new addition to London! AB’s Supermarket has a wonderful variety of Indian food items, is clean and well organized and makes shopping easy. Wishing them lots of success!! Definitely worth checking it out', rating: 5 },
  { customerName: 'Jasleen Sindhu', review: 'I love this new grocery store. It feels so homely and all the food there is delicious. I love their stock, there’s Korean and all the Indian snacks you can think of! Also the mango lassi is to die for.', rating: 5 },
  { customerName: 'Grace GL Carruthers', review: "AB's Supermarket is a great place to shop! The store smells fresh and clean, everything is well organized, and it's easy to find what you need. The prices are fair, and the overall shopping experience is pleasant. I would definitely recommend stopping by.", rating: 5 },
  { customerName: 'Sargi', review: 'Great customer service and they have all the Indian snacks you could think of!!', rating: 5 },
  { customerName: 'Gage W', review: 'The best new store in London, they have everything! Very well organized. The prices and the food are fantastic, and so is the customer service.', rating: 5 },
  { customerName: 'Harmandeep Kaur', review: 'Amazing variety and excellent customer service. Must visit', rating: 5 },
  { customerName: 'Simran Jeet', review: 'Exceptional customer service and tons of Indian and Canadian products available.', rating: 5 },
  { customerName: 'Bhupinder', review: 'Great service, well behaved staff, everything well organized and now Moga Meat also available.', rating: 5 },
  { customerName: 'beast', review: 'Great variety of snacks and frozen food. Glad to see Korean snacks.', rating: 5 },
  { customerName: 'Rajinder Singh', review: 'Amazing collection.', rating: 5 },
  { customerName: 'Mihir Grover', review: 'Great staff, great selection.', rating: 5 },
  { customerName: 'Tegbir Mavi', review: 'Great staff and super friendly people.', rating: 5 },
  { customerName: 'Izza Hassan', review: 'Great store!', rating: 5 },
  { customerName: 'Review Me', review: 'Exceptional experience, mint clean looks, spacious aisles and wow factor looking at the range of products within this supermarket.', rating: 5 },
  { customerName: 'Parneet Kaur', review: 'I had a really great experience at AB Super Market! I tried their sweets and juices, and everything was so fresh and delicious. The staff was also very friendly, welcoming, and helpful. They have a great variety of products.', rating: 5 },
  { customerName: 'Jagdeep Singh Sekhon', review: 'Good products and good service', rating: 5 },
  { customerName: 'Savneet Kaur', review: 'Best supermarket in town... neat and clean so organized... best products', rating: 5 },
  { customerName: 'Sulakhan Brar', review: 'Good price as compared to the market. Owner is very nice and staff is helpful.', rating: 5 },
  { customerName: 'Nicholas Gray', review: 'Great store, almost like a grocery store', rating: 5 },
  { customerName: 'Harsimran Anand', review: 'Great collection. Nicely built', rating: 5 },
  { customerName: 'Amina Kamal', review: 'Great store amazing prices!', rating: 5 },
  { customerName: 'Miranda Siegrist', review: 'Great environment and lovely staff. Highly recommend.', rating: 5 },
  { customerName: 'Raiyah Malik', review: 'Great grocery store and food is great too! Samosa chat is delicious', rating: 5 },
  { customerName: 'Kalista Brown', review: "Fantastic staff, amazing selection and incredibly well priced. We'll most definitely be returning!!!", rating: 5 },
];

async function run() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const r of REVIEWS) {
    const exists = await Testimonial.findOne({ customerName: r.customerName, review: r.review });
    if (exists) {
      skipped++;
      continue;
    }
    await Testimonial.create({ ...r, isEnabled: true });
    created++;
  }

  console.log(`Created ${created} testimonials, skipped ${skipped} already present.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
