// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore"; // ✅ Import Firestore methods

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDm4vXhtbMr-EFph0GRXvtkWWZIHf0ip8o",
  authDomain: "hotwheelshub-45992.firebaseapp.com",
  projectId: "hotwheelshub-45992",
  storageBucket: "hotwheelshub-45992.appspot.com",
  messagingSenderId: "748470311385",
  appId: "1:748470311385:web:cceab4918ce60abe4621c8",
  measurementId: "G-Y3HTQER2PQ",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore

// ✅ Sample products data
const sampleProducts = [
  {
    name: "Hot Wheels Turbo Racer",
    price: "$9.99",
    image: "https://car-images.bauersecure.com/wp-images/4644/iwc_hotwheels_1.jpeg",
  },
  {
    name: "Street Beast X",
    price: "$8.49",
    image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/5b7a60dd-211a-4672-982f-b0d49111025a/8dc85a76-f330-4a54-8b4d-8cbe32726b4f.png",
  },
  {
    name: "Monster Jam Max-D",
    price: "$12.99",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSVWxkRWQMUMHsKFkgy9ftCZcxl0FEihSvzmhE64EwATBLVCmNoHtzj_Jhq3VSEjTPSXBeuWvveAaTfzsxBKHz92MjeU-XqdqtjYIGsXG6eYmz_bQE7t8KLSZyU0hplzDmBmRSaj1Eb9NA/s1600/IMG_0199.JPG",
  },
  {
    name: "Hot Wheels Drift King",
    price: "$10.99",
    image: "https://www.characterbrands.co.uk/images/productextrazoom/887961379433-2-1.jpg",
  },
  {
    name: "Hot Wheels Shark Cruiser",
    price: "$11.49",
    image: "https://www.hamleys.com/media/catalog/product/h/o/hot_wheels_monster_action_sharkcruiser_1013634_a.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:",
  },
  {
    name: "Cyber Speeder",
    price: "$7.99",
    image: "https://i.ytimg.com/vi/QzkJEUW9ZGA/maxresdefault.jpg",
  },
];

// ✅ Product management functions
export const productsService = {
  // Add a new product
  async addProduct(product) {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        price: product.price,
        image: product.image,
        createdAt: new Date()
      });
      return { id: docRef.id, ...product };
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  },

  // Get all products
  async getProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      throw error;
    }
  },

  // Update a product
  async updateProduct(productId, updatedData) {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: new Date()
      });
      return { id: productId, ...updatedData };
    } catch (error) {
      console.error("Error updating product: ", error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, "products", productId));
      return productId;
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  },

  // ✅ Seed database with sample products (for demo purposes)
  async seedProducts() {
    try {
      const existingProducts = await this.getProducts();
      
      // Only seed if no products exist
      if (existingProducts.length === 0) {
        console.log("Seeding database with sample products...");
        
        for (const product of sampleProducts) {
          await this.addProduct(product);
        }
        
        console.log("Sample products added successfully!");
        return await this.getProducts(); // Return all products after seeding
      }
      
      return existingProducts;
    } catch (error) {
      console.error("Error seeding products: ", error);
      throw error;
    }
  }
};

// ✅ Orders management functions
export const ordersService = {
  // Create a new order
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: new Date(),
        status: 'pending' // Default status
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error("Error creating order: ", error);
      throw error;
    }
  },

  // Get all orders (sorted by newest first)
  async getOrders() {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date()
        });
      });
      return orders;
    } catch (error) {
      console.error("Error getting orders: ", error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date()
      });
      return { id: orderId, status };
    } catch (error) {
      console.error("Error updating order status: ", error);
      throw error;
    }
  },

  // Delete an order
  async deleteOrder(orderId) {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      return orderId;
    } catch (error) {
      console.error("Error deleting order: ", error);
      throw error;
    }
  }
};
