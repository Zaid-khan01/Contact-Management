const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); // Enable CORS for frontend connection
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contact-management';

mongoose.connect(MONGODB_URI)

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    minlength: [10, 'Phone must be at least 10 digits']
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['Lead', 'Client', 'Partner', 'Vendor'],
    default: 'Lead'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Add indexes for better query performance
contactSchema.index({ createdAt: -1 });
contactSchema.index({ score: -1 });
contactSchema.index({ category: 1 });
contactSchema.index({ email: 1 });

// Create Model
const Contact = mongoose.model('Contact', contactSchema);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Smart Contact Intelligence API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      contacts: {
        getAll: 'GET /api/contacts',
        getOne: 'GET /api/contacts/:id',
        create: 'POST /api/contacts',
        update: 'PUT /api/contacts/:id',
        delete: 'DELETE /api/contacts/:id'
      },
      stats: 'GET /api/contacts/stats/summary'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    // Get query parameters for filtering/sorting
    const { category, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    let query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Build sort
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };
    
    const contacts = await Contact.find(query).sort(sortOptions);
    
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// Get single contact
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
        id: req.params.id
      });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    
    // Handle invalid MongoDB ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid contact ID format',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Error fetching contact',
      error: error.message
    });
  }
});

// Create new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, message, category, priority, score } = req.body;

    // Additional validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'email', 'phone']
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Phone validation
    if (phone.length < 10) {
      return res.status(400).json({
        message: 'Phone must be at least 10 digits'
      });
    }

    // Create new contact
    const newContact = new Contact({
      name,
      email,
      phone,
      message: message || '',
      category: category || 'Lead',
      priority: priority || 'Medium',
      score: score || 0
    });

    // Save to database
    const savedContact = await newContact.save();
    
    console.log('New contact created:', savedContact.name);
    
    res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already exists',
        error: 'Duplicate email'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      message: 'Error creating contact',
      error: error.message
    });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { name, email, phone, message, category, priority, score } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        message,
        category,
        priority,
        score,
        updatedAt: Date.now()
      },
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: 'Contact not found',
        id: req.params.id
      });
    }

    console.log('Contact updated:', updatedContact.name);
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid contact ID format',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Error updating contact',
      error: error.message
    });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({
        message: 'Contact not found',
        id: req.params.id
      });
    }

    console.log('Contact deleted:', deletedContact.name);
    
    res.json({
      message: 'Contact deleted successfully',
      contact: deletedContact
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid contact ID format',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

// Get statistics
app.get('/api/contacts/stats/summary', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    
    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const avgScore = await Contact.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      }
    ]);

    res.json({
      total: totalContacts,
      categories: categoryStats,
      priorities: priorityStats,
      scores: avgScore[0] || { averageScore: 0, maxScore: 0, minScore: 0 }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(err.status || 500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('   SMART CONTACT INTELLIGENCE - BACKEND');
  console.log('   ============================================');
  console.log(`   Server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Contacts: http://localhost:${PORT}/api/contacts`);
  console.log('   ============================================\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});